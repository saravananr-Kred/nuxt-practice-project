<template>
  <!-- Left: Logo + Title -->
  <NuxtLink to="/" class="header-brand">
    <div class="brand-icon">
      <IconDocumentation />
    </div>
    <span class="brand-title">Nuxt<span class="brand-accent">Learn</span></span>
  </NuxtLink>

  <!-- Center: Navbar -->
  <Navbar />

  <GlobalSearch />

  <div class="flex items-center gap-2">
    <!-- Notifications -->
    <NotificationsDropdown
      @markAsRead="markAsRead"
      @markAllAsRead="markAllAsRead"
      :notifications="notifications"
      :unreadCount="unreadCount"
    />
    <!-- Right: Profile dropdown -->
    <Profile />
  </div>
</template>

<script setup lang="ts">
const notifications = useLocalStorage("notifications", []);
const unreadCount = useLocalStorage("unreadCount", 0);
const userStore = useUsersStore();
const onlineUsers = storeToRefs(userStore).onlineUsers;

const { $notificationEcho } = useNuxtApp() as any;

const markAsRead = (id: number) => {
  notifications.value = notifications.value.map((notification: any) => {
    if (notification.id === id) {
      notification.read = true;
    }
    return notification;
  });
  unreadCount.value--;
};

const markAllAsRead = () => {
  notifications.value = notifications.value.map((notification: any) => {
    notification.read = true;
    return notification;
  });
  unreadCount.value = 0;
};

onMounted(() => {
  const loginStore = useLoginStore();
  const toastStore = useToastStore();
  const user = storeToRefs(loginStore).user;
  $notificationEcho
    .private("user-" + user.value.id)
    .listen("liveNotification", (e: any) => {
      console.log(e);
      notifications.value = [...notifications.value, e.data];
      unreadCount.value++;
      toastStore.showSuccess(e.data.message);
    });

  $notificationEcho
    .join("online-users")
    .here((users: onlineType[]) => {
      console.log(users);
      onlineUsers.value = users;
    })
    .joining((user: onlineType) => {
      console.log(user, "join");
      onlineUsers.value.push(user);
    })
    .leaving((user: onlineType) => {
      console.log(user, "leave");
      onlineUsers.value = onlineUsers.value.filter((u) => u.id !== user.id);
    });

  if (JSON.parse(localStorage.getItem("notifications") || "[]")) {
    notifications.value = JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    unreadCount.value = JSON.parse(localStorage.getItem("unreadCount") || "0");
  }
});
console.log(onlineUsers.value, "onlineUsers");

onUnmounted(() => {
  $notificationEcho.leave("online-users");
});
</script>

<style scoped lang="scss">
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  min-width: 170px;
}

.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, $btn-bg-primary, $btn-bg-primary-hover);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba($btn-bg-primary, 0.3);

  :deep(svg) {
    width: 20px;
    height: 20px;
    fill: $navy-text;
  }
}

.brand-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: $navy-text;
  letter-spacing: -0.02em;
}

.brand-accent {
  color: $btn-bg-primary-hover;
}
</style>
