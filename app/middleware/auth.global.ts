export default defineNuxtRouteMiddleware((to) => {
  const loginStore = useLoginStore();
  const publicRoutes = ["/login", "/register", "/forgotpassword"];
  const isPublic = publicRoutes.includes(to.path);

  if (!loginStore.isLoggedIn && !isPublic) {
    loginStore.logout();
    return navigateTo("/login");
  }

  if (loginStore.isLoggedIn && isPublic) {
    return navigateTo("/");
  }
});
