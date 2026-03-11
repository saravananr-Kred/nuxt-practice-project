<template>
  <div class="flex justify-center items-center">
    <div class="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">Login</h1>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <Input
            v-model="email"
            id="email"
            placeholder="Email"
            :error="emailError"
            :label="'Email'"
            layout="auth"
          />
        </div>

        <div>
          <Input
            v-model="password"
            id="password"
            placeholder="Password"
            :error="passwordError"
            :label="'Password'"
            layout="auth"
          />
        </div>

        <Button additionalClasses="w-full" type="submit">
          <span class="flex gap-x-2 justify-center">
            <Spinner :loading="loading" />
            {{ loading ? "Loggin in..." : "Login" }}
          </span>
        </Button>
        <div class="text-center text-sm text-gray-600">
          Don't have an account?
          <NuxtLink
            to="/register"
            class="text-blue-600 font-semibold hover:underline"
          >
            Register
          </NuxtLink>
        </div>
        <div class="text-center text-sm text-gray-600">
          Reset your password
          <NuxtLink
            to="/forgotpassword"
            class="text-blue-600 font-semibold hover:underline"
          >
            here
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useForm, configure, useField } from "vee-validate";
import * as yup from "yup";

const login = useLoginStore();
const { loading } = storeToRefs(login);

definePageMeta({
  layout: "auth",
  public: true,
});

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 characters are required"),
});

configure({
  bails: false,
});

const { handleSubmit, resetform } = useForm({
  validationSchema: schema,
});

const { value: email, errors: emailError } = useField("email");
const { value: password, errors: passwordError } = useField("password");

const handleLogin = handleSubmit(async (values) => {
  login.handleLogin(values);
});
</script>
