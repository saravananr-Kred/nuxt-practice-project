export const usePermis = () => {
  const loginStore = useLoginStore();
  const { user } = storeToRefs(loginStore);

  const can = (permission: string): boolean => {
    return user.value?.permission?.[permission] ?? false;
  };

  return { can };
};
