<template>
  <nav class="navbar">
    <NuxtLink
      v-for="link in navLinks"
      :key="link.to"
      class="nav-link"
      :to="link.to"
      :class="{ active: isLinkActive(link) }"
    >
      <component :is="link.icon" class="nav-icon" />
      <span>{{ link.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script lang="ts" setup>
import { h } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isLinkActive = (link: any) => {
  if (route.path === link.to) return true;

  if (link.label === "Users" && route.path.startsWith("/users")) {
    return true;
  }

  if (link.to !== "/" && route.path.startsWith(link.to)) {
    return true;
  }

  return false;
};
// SVG icon components defined inline for simplicity
const UsersIcon = {
  render: () =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        class: "nav-icon",
      },
      [
        h("path", {
          d: "M7 8a3 3 0 100-6 3 3 0 000 6zM14.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM1.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 017 18a9.953 9.953 0 01-5.385-1.572zM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 00-1.588-3.755 4.502 4.502 0 015.874 2.636.818.818 0 01-.36.98A7.465 7.465 0 0114.5 16z",
        }),
      ],
    ),
};

const TaskIcon = {
  render: () =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        class: "nav-icon",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M6 4.75A.75.75 0 016.75 4h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 4.75zM6 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75A.75.75 0 016 10zm0 5.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM1.99 4.75a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 15.25a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1v-.01zM1.99 10a1 1 0 011-1H3a1 1 0 011 1v.01a1 1 0 01-1 1h-.01a1 1 0 01-1-1V10z",
          "clip-rule": "evenodd",
        }),
      ],
    ),
};

const ContactIcon = {
  render: () =>
    h(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 20 20",
        fill: "currentColor",
        class: "nav-icon",
      },
      [
        h("path", {
          "fill-rule": "evenodd",
          d: "M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z",
          "clip-rule": "evenodd",
        }),
      ],
    ),
};

// const TodoIcon = {
//   render: () =>
//     h(
//       "svg",
//       {
//         xmlns: "http://www.w3.org/2000/svg",
//         viewBox: "0 0 20 20",
//         fill: "currentColor",
//         class: "nav-icon",
//       },
//       [
//         h("path", {
//           "fill-rule": "evenodd",
//           d: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z",
//           "clip-rule": "evenodd",
//         }),
//       ],
//     ),
// };

const navLinks = [
  { to: "/", label: "Users", icon: UsersIcon },
  { to: "/Task", label: "Tasks", icon: TaskIcon },
  // { to: "/Todo", label: "Todo", icon: TodoIcon },
  { to: "/Contact", label: "Contact", icon: ContactIcon },
];
</script>

<style scoped lang="scss">
.navbar {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba($btn-bg-primary, 0.15);
    color: $navy-text;
  }

  &.active {
    background: $btn-bg-primary;
    color: $navy-text;
    font-weight: 600;
    box-shadow: 4px 4px 6px $navy-text;
  }
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
