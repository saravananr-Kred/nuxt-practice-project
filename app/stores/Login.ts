import { defineStore } from "pinia";
import { useCookie } from "#app";
import type { LoginResponse } from "@/Types/Data.ts";

export const useLoginStore = defineStore("login", () => {
  // Use Nuxt's useCookie for SSR-friendly cookies
  const loading = ref<boolean>(false);
  const resetEmail = ref<string>("");
  const { showError, showSuccess } = useToastStore();

  const token = useCookie<string | null>("accessToken", {
    maxAge: 60 * 60,
    sameSite: "lax",
    path: "/",
  });

  const user = useCookie<any | null>("user", {
    maxAge: 60 * 60,
    sameSite: "lax",
    path: "/",
  });

  const isLoggedIn = computed(() => !!token.value);

  const handleError = (error: any) => {
    const msg =
      error?.message || error?.statusMessage || "An unexpected error occurred";
    showError(msg);
  };

  const setToken = (data: string) => {
    token.value = data;
  };

  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    loading.value = true;

    try {
      const data = await $fetch<LoginResponse>("/api/login", {
        method: "post",
        body: credentials,
      });

      setToken(data.access_token);
      token.value = data.access_token;
      user.value = data.user;
      await navigateTo("/");
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData: any) => {
    loading.value = true;

    try {
      const data = await $fetch<LoginResponse>("/api/register", {
        method: "POST",
        body: userData,
        headers: {
          Accept: "application/json",
        },
      });
      setToken(data.access_token);
      token.value = data.access_token;
      user.value = data.user;
      showSuccess("User registered successfully!");
      await navigateTo("/");
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      await $fetch("/api/logout", { method: "POST" });
    } catch (e) {
    } finally {
      token.value = null;
      user.value = null;
      navigateTo("/login");
    }
  };

  const sendOtp = async (email: string) => {
    loading.value = true;
    try {
      let response = await $fetch<{ message: string; status: number }>(
        "/api/forgot-password/send-otp",
        {
          method: "POST",
          body: { email },
        },
      );
      console.log(response, "response");

      if (response.message.includes("OTP has been sent")) {
        resetEmail.value = email;
        showSuccess("OTP sent to your email!");
        return true;
      }
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const verifyOtp = async (otp: string) => {
    loading.value = true;
    try {
      await $fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        body: { email: resetEmail.value, otp },
      });
      showSuccess("OTP Verified!");
      return true;
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (payload: any) => {
    loading.value = true;
    try {
      await $fetch("/api/forgot-password/reset", {
        method: "POST",
        body: {
          email: resetEmail.value,
          otp: payload.otp,
          password: payload.password,
          password_confirmation: payload.password_confirmation,
        },
      });
      showSuccess("Password reset successfully! Please login.");
      resetEmail.value = ""; // Clear state
      await navigateTo("/login");
    } catch (error) {
      handleError(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    token,
    user,
    isLoggedIn,
    loading,
    register,
    handleLogin,
    logout,
    sendOtp,
    verifyOtp,
    resetPassword,
    resetEmail,
  };
});
