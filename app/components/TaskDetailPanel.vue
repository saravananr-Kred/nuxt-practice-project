<script setup lang="ts">
import { Icons } from "~/assets/icons";

const { can } = usePermis();

const props = defineProps<{
  isOpen: boolean;
  task: TaskData | null;
}>();

const TaskStore = useTasksStore();
const loginStore = useLoginStore();
const { user } = storeToRefs(loginStore);
const { taskComments } = storeToRefs(TaskStore);

const commentInput = ref("");
const loadingComment = ref(false);
const docUrl = useRuntimeConfig().public.docUrl;
console.log(docUrl, "docUrl");

const emit = defineEmits<{
  (e: "close"): void;
  (e: "edit", id: number): void;
  (e: "delete", id: number): void;
}>();

// ── Computed helpers ──────────────────────────────────────────────────────────

const userInitials = computed(() => {
  const name = props.task?.assigned_to_user_name;
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const formattedDate = computed(() => {
  if (!props.task?.end_date) return "—";
  return new Date(props.task.end_date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const formattedCreatedAt = computed(() => {
  if (!props.task?.created_at) return "—";
  return new Date(props.task.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
});

const priorityMeta: Record<string, { color: string; bg: string }> = {
  "Very High": { color: "#ef4444", bg: "#fef2f2" },
  High: { color: "#f97316", bg: "#fff7ed" },
  Medium: { color: "#eab308", bg: "#fefce8" },
  Low: { color: "#22c55e", bg: "#f0fdf4" },
};

const statusMeta: Record<string, { color: string; bg: string }> = {
  Open: { color: "#3b82f6", bg: "#eff6ff" },
  "In Progress": { color: "#f59e0b", bg: "#fffbeb" },
  Completed: { color: "#10b981", bg: "#ecfdf5" },
  "On Hold": { color: "#6b7280", bg: "#f9fafb" },
};

const priorityStyle = computed(() => {
  const p = props.task?.priority ?? "";
  return priorityMeta[p] || { color: "#6b7280", bg: "#f9fafb" };
});

const statusStyle = computed(() => {
  const s = props.task?.status ?? "";
  return statusMeta[s] || { color: "#6b7280", bg: "#f9fafb" };
});

// ── File helpers ──────────────────────────────────────────────────────────────

function isImage(url: string) {
  return /\.(png|jpe?g|gif|webp|svg|bmp)(\?|$)/i.test(url);
}

function getFileName(url: string) {
  try {
    return decodeURIComponent(url.split("/").pop() || url);
  } catch {
    return url.split("/").pop() || url;
  }
}

function handleEdit() {
  if (props.task) emit("edit", props.task.id);
}

function handleDelete() {
  if (props.task) emit("delete", props.task.id);
}

async function handleAddComment() {
  if (!props.task || !commentInput.value.trim() || loadingComment.value) return;
  loadingComment.value = true;
  let payload = {
    comment: commentInput.value.trim(),
    task_id: props.task.id,
    user_id: user.value?.id,
  };
  await TaskStore.addTaskComment(props.task.id, payload);
  commentInput.value = "";
  loadingComment.value = false;
}

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal && props.task) {
      await TaskStore.fetchTaskComments(props.task.id);
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="td-overlay">
      <div v-if="isOpen" class="td-backdrop" @click.self="emit('close')">
        <Transition name="td-panel">
          <div v-if="isOpen && task" class="td-panel" @click.stop>
            <!-- ── Header ─────────────────────────────────────── -->
            <header class="td-header">
              <div class="td-header-left">
                <div class="td-header-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p class="td-label">Task Detail</p>
                  <h2 class="td-title">{{ task.name }}</h2>
                </div>
              </div>
              <button
                class="td-close"
                @click="emit('close')"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                  />
                </svg>
              </button>
            </header>

            <!-- ── Scrollable body ────────────────────────────── -->
            <div class="td-body">
              <div class="td-content-left">
                <!-- Status + Priority badges -->
                <div class="td-badges">
                  <span
                    class="td-badge"
                    :style="{
                      color: statusStyle.color,
                      background: statusStyle.bg,
                    }"
                  >
                    <span
                      class="td-badge-dot"
                      :style="{ background: statusStyle.color }"
                    ></span>
                    {{ task.status }}
                  </span>
                  <span
                    class="td-badge"
                    :style="{
                      color: priorityStyle.color,
                      background: priorityStyle.bg,
                    }"
                  >
                    <span
                      class="td-badge-dot"
                      :style="{ background: priorityStyle.color }"
                    ></span>
                    {{ task.priority }}
                  </span>
                </div>

                <!-- ── Assigned User ───────────────────────────── -->
                <section class="td-section">
                  <h3 class="td-section-title">Assigned To</h3>
                  <div v-if="task.assigned_to" class="td-user">
                    <div class="td-avatar">
                      {{ userInitials }}
                    </div>
                    <span class="td-user-name">{{
                      task.assigned_to_user_name || "User #" + task.assigned_to
                    }}</span>
                  </div>
                  <p v-else class="td-empty">Not assigned</p>
                </section>

                <!-- ── Dates ─────────────────────────────────────── -->
                <section class="td-section">
                  <h3 class="td-section-title">Timeline</h3>
                  <div class="td-info-grid">
                    <div class="td-info-item">
                      <span class="td-info-label">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="td-info-icon"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H8V3a1 1 0 00-1-1zM4 8h12v8H4V8z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Due Date
                      </span>
                      <span class="td-info-value">{{ formattedDate }}</span>
                    </div>
                    <div class="td-info-item">
                      <span class="td-info-label">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="td-info-icon"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        Created
                      </span>
                      <span class="td-info-value">{{
                        formattedCreatedAt
                      }}</span>
                    </div>
                  </div>
                </section>

                <!-- ── Notes ─────────────────────────────────────── -->
                <section v-if="task.notes" class="td-section">
                  <h3 class="td-section-title">Notes</h3>
                  <div class="td-notes">{{ task.notes }}</div>
                </section>

                <!-- ── Attachments ────────────────────────────────── -->
                <section class="td-section">
                  <h3 class="td-section-title">
                    Attachments
                    <span v-if="task.fileCount > 0" class="td-count-pill">{{
                      task.fileCount
                    }}</span>
                  </h3>

                  <div
                    v-if="task.file_url && task.file_url.length > 0"
                    class="td-files"
                  >
                    <a
                      v-for="(url, idx) in task.file_url"
                      :key="idx"
                      :href="`${docUrl}${url}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="td-file-card"
                      :title="getFileName(url)"
                    >
                      <!-- Image preview -->
                      <template v-if="isImage(url)">
                        <img
                          :src="url"
                          :alt="getFileName(url)"
                          class="td-file-img"
                        />
                        <span class="td-file-name">{{ getFileName(url) }}</span>
                      </template>

                      <!-- Document preview -->
                      <template v-else>
                        <div class="td-file-iframe-container">
                          <iframe
                            :src="`${docUrl}${url}`"
                            class="td-file-iframe"
                            frameborder="0"
                            loading="lazy"
                          ></iframe>
                          <span class="td-file-name">{{
                            getFileName(url)
                          }}</span>
                        </div>
                      </template>
                    </a>
                  </div>

                  <p v-else class="td-empty">No attachments</p>
                </section>
              </div>

              <!-- ── Comments Section ────────────────────────────── -->
              <div class="td-content-right">
                <section class="td-section td-comments-wrapper">
                  <h3 class="td-section-title">Comments</h3>
                  <div class="td-comments-list">
                    <div
                      v-if="taskComments.length === 0"
                      class="td-empty text-center py-6"
                    >
                      No comments yet.
                    </div>
                    <div
                      v-for="c in taskComments"
                      :key="c.id"
                      class="td-comment"
                    >
                      <div class="td-avatar td-comment-avatar">
                        {{ c.user_name?.substring(0, 2).toUpperCase() || "U" }}
                      </div>
                      <div class="td-comment-body">
                        <div class="td-comment-header">
                          <span class="td-comment-author">{{
                            c.user_name || "Unknown"
                          }}</span>
                          <span class="td-comment-date"
                            >{{ new Date(c.created_at).toLocaleDateString() }}
                            {{
                              new Date(c.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            }}</span
                          >
                        </div>
                        <p class="td-comment-text">{{ c.comment }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="td-comment-input-area">
                    <textarea
                      v-model="commentInput"
                      placeholder="Add a comment..."
                      class="td-textarea"
                      @keydown.ctrl.enter="handleAddComment"
                    ></textarea>
                    <div class="td-comment-actions">
                      <Button
                        @click="handleAddComment"
                        :disabled="!commentInput.trim() || loadingComment"
                      >
                        <span v-if="loadingComment">Submitting...</span>
                        <span v-else>Post Comment</span>
                      </Button>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <!-- ── Footer actions ────────────────────────────── -->
            <footer class="td-footer">
              <button
                v-if="can('edit-tasks')"
                class="td-btn td-btn-edit"
                @click="handleEdit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="td-btn-icon"
                >
                  <path
                    d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
                  />
                </svg>
                Edit Task
              </button>
              <button
                v-if="can('delete-tasks')"
                class="td-btn td-btn-delete"
                @click="handleDelete"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="td-btn-icon"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                    clip-rule="evenodd"
                  />
                </svg>
                Delete Task
              </button>
              <button
                class="bg-gray-300 text-[#2e2e2e] td-btn"
                @click="emit('close')"
              >
                Close
              </button>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@reference "../assets/css/tailwind.css";
// ── Overlay ───────────────────────────────────────────────────────────────────
.td-backdrop {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
}

// ── Panel ─────────────────────────────────────────────────────────────────────
.td-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
  z-index: 61;
  overflow: hidden;
}

// ── Header ────────────────────────────────────────────────────────────────────
.td-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f0fdf8 0%, #f8fafc 100%);
  flex-shrink: 0;
}

.td-header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.td-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px #26d326a0;

  svg {
    width: 20px;
    height: 20px;
    color: white;
  }
}

.td-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: $btn-bg-primary-dark;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0 0 2px;
}

.td-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.35;
  word-break: break-word;
}

.td-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  margin-left: 12px;
  transition: all 0.15s ease;
  color: #64748b;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #ef4444;
  }
}

// ── Badges ────────────────────────────────────────────────────────────────────
.td-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.td-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.td-badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

// ── Body ─────────────────────────────────────────────────────────────────────
.td-body {
  flex: 1;
  overflow-y: hidden; /* Scroll handled manually in children if needed, or by split panes */
  padding: 0;
  display: flex;
  flex-direction: row;
}

.td-content-left {
  flex: 1.5;
  border-right: 1px solid #e2e8f0;
  padding: 24px;
  overflow-y: auto;
}

.td-content-right {
  flex: 0.5;
  padding: 24px;
  background: #fafbfc;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

// ── Section ───────────────────────────────────────────────────────────────────
.td-section {
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.td-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.td-count-pill {
  background: #e2e8f0;
  color: #475569;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 8px;
  border-radius: 10px;
  letter-spacing: 0;
  text-transform: none;
}

// ── User ──────────────────────────────────────────────────────────────────────
.td-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.td-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-dark);
  color: white;
  font-size: 0.8125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);
  letter-spacing: 0.05em;
}

.td-user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1e293b;
}

// ── Info grid ─────────────────────────────────────────────────────────────────
.td-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.td-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
}

.td-info-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.td-info-icon {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.td-info-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

// ── Notes ─────────────────────────────────────────────────────────────────────
.td-notes {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.65;
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  white-space: pre-wrap;
  word-break: break-word;
}

// ── Files ─────────────────────────────────────────────────────────────────────
.td-files {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.td-file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  text-decoration: none;
  transition: all 0.18s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: #14b8a6;
    background: #f0fdfa;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(20, 184, 166, 0.12);
  }
}

.td-file-img {
  width: 100%;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
}

.td-file-icon-wrap {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.td-file-icon {
  width: 28px;
  height: 28px;
}

.td-file-name {
  font-size: 0.65rem;
  color: #64748b;
  text-align: center;
  word-break: break-all;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-weight: 500;
}

// ── Empty state ───────────────────────────────────────────────────────────────
.td-empty {
  font-size: 0.8rem;
  color: #94a3b8;
  font-style: italic;
  margin: 0;
}

// ── Comments ──────────────────────────────────────────────────────────────────
.td-comments-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-bottom: none;
}

.td-comments-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.td-comment {
  display: flex;
  gap: 12px;
}

.td-comment-avatar {
  width: 36px;
  height: 36px;
  font-size: 0.75rem;
}

.td-comment-body {
  flex: 1;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.td-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.td-comment-author {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}

.td-comment-date {
  font-size: 0.7rem;
  color: #94a3b8;
}

.td-comment-text {
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.td-comment-input-area {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.td-textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px;
  font-size: 0.85rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.1);
  }
}

.td-comment-actions {
  display: flex;
  justify-content: flex-end;
}

// ── Footer ────────────────────────────────────────────────────────────────────
.td-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
  flex-shrink: 0;
}

.td-btn {
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.18s ease;
}

.td-btn-icon {
  width: 16px;
  height: 16px;
}

.td-btn-edit {
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-dark);
  color: white;
  box-shadow: 0 2px 8px rgba(20, 184, 166, 0.3);

  &:hover {
    background: linear-gradient(
      135deg,
      $btn-bg-primary-hover,
      $btn-bg-primary-dark-hover
    );
    box-shadow: 0 4px 14px rgba(20, 184, 166, 0.4);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.td-btn-delete {
  background: white;
  color: #ef4444;
  border: 1px solid #fca5a5;

  &:hover {
    background: #fee2e2;
    border-color: #f87171;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

// ── Transitions ───────────────────────────────────────────────────────────────
.td-overlay-enter-active,
.td-overlay-leave-active {
  transition: opacity 0.3s ease;
}
.td-overlay-enter-from,
.td-overlay-leave-to {
  opacity: 0;
}

.td-panel-enter-active,
.td-panel-leave-active {
  transition: transform 0.38s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.td-panel-enter-from,
.td-panel-leave-to {
  transform: translateX(100%);
}
.td-file-iframe-container {
  @apply relative w-full overflow-hidden rounded-md border border-gray-200;
  height: var(--spacing-preview-height);
}

.td-file-iframe {
  @apply w-full h-full pointer-events-none;
}

.td-file-card {
  @apply flex flex-col gap-2;
}
</style>
