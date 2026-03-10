export const usePermis = () => {
  const loginStore = useLoginStore();
  const { user } = storeToRefs(loginStore);
  console.log(user.value.permission["edit-user"], "user");
  const can = (permission: string): boolean => {
    return user.value?.permission?.[permission] ?? false;
  };

  return { can };
};
