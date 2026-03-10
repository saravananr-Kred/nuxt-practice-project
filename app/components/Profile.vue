<template>
  <div class="relative" ref="profileRef">
    <button @click="toggleDropdown" class="profile-trigger">
      <div class="avatar">
        <span class="avatar-text">{{ user?.name?.charAt(0) ?? "" }}</span>
      </div>
      <div class="profile-info">
        <span class="profile-name">{{ user?.name ?? "" }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="chevron"
          :class="{ 'chevron-open': isOpen }"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="profile-dropdown">
        <div class="dropdown-header">
          <div class="avatar avatar-lg">
            <span class="avatar-text">{{ user?.name?.charAt(0) ?? "" }}</span>
          </div>
          <div class="dropdown-user-info">
            <p class="dropdown-name">{{ user?.name ?? "" }}</p>
            <p class="dropdown-email">{{ user?.email ?? "" }}</p>
          </div>
        </div>
        <div class="dropdown-divider"></div>
        <button @click="logout" class="logout-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="logout-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z"
              clip-rule="evenodd"
            />
            <path
              fill-rule="evenodd"
              d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-.943a.75.75 0 111.004-1.114l2.5 2.25a.75.75 0 010 1.114l-2.5 2.25a.75.75 0 11-1.004-1.114l1.048-.943H6.75A.75.75 0 016 10z"
              clip-rule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const login = useLoginStore();
const isOpen = ref(false);
const profileRef = ref(null);

const { user } = storeToRefs(login);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const logout = () => {
  login.logout();
  isOpen.value = false;
};

const handleClickOutside = (e) => {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
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
.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px 6px 6px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    border-color: #e5e7eb;
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-lg {
  width: 42px;
  height: 42px;
  border-radius: 12px;
}

.avatar-text {
  color: $navy-text;
  font-weight: 700;
  font-size: 0.875rem;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.profile-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.chevron {
  width: 16px;
  height: 16px;
  color: #9ca3af;
  transition: transform 0.2s ease;
}

.chevron-open {
  transform: rotate(180deg);
}

/* Dropdown */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 260px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
}

.dropdown-user-info {
  flex: 1;
  min-width: 0;
}

.dropdown-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
}

.dropdown-email {
  margin: 4px 0 0;
  font-size: 0.75rem;
  color: #6b7280;
  word-break: break-all;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #ef4444;
  transition: background 0.15s ease;

  &:hover {
    background: #fef2f2;
  }
}

.logout-icon {
  width: 18px;
  height: 18px;
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
