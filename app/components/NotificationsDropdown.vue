<template>
  <div class="relative" ref="dropdownRef">
    <!-- Notification Bell Trigger -->
    <button
      @click="toggleDropdown"
      class="notification-trigger relative flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="bell-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>

      <!-- Unread Badge -->
      <span v-if="unreadCount > 0" class="badge">
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="notification-dropdown">
        <div class="dropdown-header flex items-center justify-between">
          <h3 class="dropdown-title">Notifications</h3>
          <button
            v-if="unreadCount > 0"
            @click.stop="markAllAsRead"
            class="mark-read-btn"
          >
            Mark all read
          </button>
        </div>

        <div class="dropdown-divider"></div>

        <div class="notifications-list">
          <div v-if="notifications.length === 0" class="empty-state">
            No notifications yet
          </div>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            :class="['notification-item', { 'is-unread': !notification.read }]"
            @click="markAsRead(notification.id)"
          >
            <!-- Icon based on type -->
            <div class="notification-icon" :class="`icon-${notification.type}`">
              <svg
                v-if="notification.type === 'task_created'"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20h9" />
                <path
                  d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                />
              </svg>
              <svg
                v-else-if="notification.type === 'status_updated'"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <svg
                v-else-if="notification.type === 'comment_added'"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                ></path>
              </svg>
            </div>

            <div class="notification-content">
              <p class="notification-title">{{ notification.title }}</p>
              <p class="notification-message">{{ notification.message }}</p>
              <p class="notification-time">{{ notification.time }}</p>
            </div>

            <div v-if="!notification.read" class="unread-dot"></div>
          </div>
        </div>

        <div class="dropdown-divider"></div>
        <button class="view-all-btn">View all notifications</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const isOpen = ref(false);
const dropdownRef = ref(null);

const emit = defineEmits(["markAsRead", "markAllAsRead"]);
const props = defineProps({
  notifications: {
    type: Array,
    default: () => [],
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
});
// Mock Data
// const notifications = ref([
//   {
//     id: 1,
//     type: "task_created",
//     title: "New Task Assigned",
//     message: 'You have been assigned to "Frontend Redesign"',
//     time: "2 mins ago",
//     read: false,
//   },
//   {
//     id: 2,
//     type: "status_updated",
//     title: "Task Status Updated",
//     message: '"API Integration" is now In Progress',
//     time: "1 hour ago",
//     read: false,
//   },
//   {
//     id: 3,
//     type: "comment_added",
//     title: "New Comment",
//     message: 'John Doe commented on "Fix Login Bug"',
//     time: "3 hours ago",
//     read: true,
//   },
//   {
//     id: 4,
//     type: "status_updated",
//     title: "Task Completed",
//     message: '"Update Documentation" was marked as complete',
//     time: "1 day ago",
//     read: true,
//   },
// ]);

// const unreadCount = computed(() => {
//   return notifications.value.filter((n) => !n.read).length;
// });

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const markAsRead = (id) => {
  emit("markAsRead", id);
};

const markAllAsRead = () => {
  emit("markAllAsRead");
};

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped lang="scss">
.notification-trigger {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 8px;

  &:hover {
    background: #f3f4f6;
    border-color: #e5e7eb;
  }
}

.bell-icon {
  width: 20px;
  height: 20px;
  color: #374151;
}

.badge {
  position: absolute;
  top: 4px;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  background-color: #ef4444; /* red-500 */
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  border-radius: 50%;
  border: 1.5px solid white;
}

/* Dropdown */
.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 340px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 16px;
}

.dropdown-title {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  color: #111827;
}

.mark-read-btn {
  font-size: 0.75rem;
  color: #3b82f6; /* blue-500 */
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

/* Scrollbar styling for webkit */
.notifications-list::-webkit-scrollbar {
  width: 4px;
}
.notifications-list::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.empty-state {
  padding: 24px 16px;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s ease;
  position: relative;

  &:hover {
    background: #f9fafb;
  }

  &.is-unread {
    background: #f0fdf4; /* Very light green tint for unread */
  }
}

.notification-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: white;

  &.icon-task_created {
    background-color: #3b82f6; /* blue */
  }
  &.icon-status_updated {
    background-color: #f59e0b; /* amber */
  }
  &.icon-comment_added {
    background-color: #10b981; /* emerald */
  }
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.notification-message {
  margin: 2px 0 0;
  font-size: 0.8125rem;
  color: #4b5563;
  line-height: 1.4;
}

.notification-time {
  margin: 4px 0 0;
  font-size: 0.7rem;
  color: #9ca3af;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #3b82f6;
  margin-top: 6px;
}

.view-all-btn {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  text-align: center;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
    color: #111827;
  }
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
