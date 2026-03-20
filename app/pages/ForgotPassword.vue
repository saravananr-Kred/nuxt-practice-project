<template>
  <div class="fp-page">
    <!-- Left decorative panel -->
    <div class="fp-left">
      <div class="fp-left-inner">
        <div class="fp-logo">
          <div class="fp-logo-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <span class="fp-logo-text">SecureReset</span>
        </div>

        <div class="fp-left-content">
          <h2 class="fp-left-title">Recover Your Account</h2>
          <p class="fp-left-desc">
            Follow the simple steps to securely reset your password and regain
            access to your account.
          </p>

          <!-- Steps indicator -->
          <div class="fp-steps-visual">
            <div
              v-for="(s, i) in steps"
              :key="i"
              class="fp-step-item"
              :class="[
                {
                  'fp-step-done': step > i + 1,
                  'fp-step-active': step === i + 1,
                },
                { 'mt-5': i >= 1 },
              ]"
            >
              <div class="fp-step-circle">
                <svg
                  v-if="step > i + 1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <div class="fp-step-label">
                <span class="fp-step-title">{{ s.title }}</span>
                <span class="fp-step-sub">{{ s.sub }}</span>
              </div>
              <div
                v-if="i < steps.length - 1"
                class="fp-step-line"
                :class="{ 'fp-step-line-done': step > i + 1 }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Bottom decoration -->
        <div class="fp-left-blobs">
          <div class="fp-blob fp-blob-1"></div>
          <div class="fp-blob fp-blob-2"></div>
        </div>
      </div>
    </div>

    <!-- Right form panel -->
    <div class="fp-right">
      <div class="fp-card">
        <!-- Step header -->
        <div class="fp-card-header">
          <div class="fp-step-icon" :class="`fp-step-icon--${step}`">
            <!-- Email icon -->
            <svg
              v-if="step === 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
              />
              <path
                d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
              />
            </svg>
            <!-- OTP icon -->
            <svg
              v-else-if="step === 2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.79-.273 1.031l-4.174 4.174a.75.75 0 00-.22.53V21a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-.75h.75a.75.75 0 00.75-.75V18h.75a.75.75 0 00.53-.22l2.658-2.658c.24-.24.64-.34 1.031-.272A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z"
                clip-rule="evenodd"
              />
            </svg>
            <!-- Password icon -->
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                clip-rule="evenodd"
              />
            </svg>
          </div>

          <div>
            <h1 class="fp-title">
              {{
                step === 1
                  ? "Forgot Password"
                  : step === 2
                    ? "Verify OTP"
                    : "New Password"
              }}
            </h1>
            <p class="fp-subtitle">
              {{
                step === 1
                  ? "Enter your email to receive a one-time code."
                  : step === 2
                    ? `Code sent to ${loginStore.resetEmail}`
                    : "Choose a strong new password."
              }}
            </p>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="fp-progress-bar">
          <div
            class="fp-progress-fill"
            :style="{ width: `${(step / 3) * 100}%` }"
          ></div>
        </div>

        <!-- ── Step 1: Email ── -->
        <form v-if="step === 1" @submit.prevent="handleSendOtp" class="fp-form">
          <div class="fp-field-group">
            <Input
              v-model="email"
              id="email"
              placeholder="you@example.com"
              :error="emailError"
              label="Email Address"
              layout="auth"
            />
          </div>

          <button class="fp-submit-btn" type="submit" :disabled="loading">
            <Spinner :loading="loading" />
            <span>{{ loading ? "Sending OTP..." : "Send OTP" }}</span>
            <svg
              v-if="!loading"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="fp-btn-arrow"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <p class="fp-back-link">
            Remember your password?
            <NuxtLink to="/login">Back to Login</NuxtLink>
          </p>
        </form>

        <!-- ── Step 2: OTP ── -->
        <form
          v-if="step === 2"
          @submit.prevent="handleVerifyOtp"
          class="fp-form"
        >
          <div class="fp-otp-hint">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                clip-rule="evenodd"
              />
            </svg>
            Check your inbox for a 6-digit code. It expires in 15 minutes.
          </div>

          <div class="fp-field-group">
            <Input
              v-model="otp"
              id="otp"
              placeholder="000000"
              :error="otpError"
              label="OTP"
              layout="auth"
            />
          </div>

          <button class="fp-submit-btn" type="submit" :disabled="loading">
            <Spinner :loading="loading" />
            <span>{{ loading ? "Verifying..." : "Verify Code" }}</span>
            <svg
              v-if="!loading"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="fp-btn-arrow"
            >
              <path
                fill-rule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <button type="button" class="fp-resend-btn" @click="step = 1">
            Didn't receive it? Go back
          </button>
        </form>

        <!-- ── Step 3: New Password ── -->
        <form
          v-if="step === 3"
          @submit.prevent="handleResetPassword"
          class="fp-form"
        >
          <div class="fp-field-group">
            <Input
              v-model="password"
              id="password"
              type="password"
              placeholder="Min 8 characters"
              :error="passwordError"
              label="New Password"
              layout="auth"
            />
          </div>
          <div class="fp-field-group">
            <Input
              v-model="passwordConfirm"
              id="passwordConfirm"
              type="password"
              placeholder="Repeat your password"
              :error="passwordConfirmError"
              label="Confirm Password"
              layout="auth"
            />
          </div>

          <div class="fp-strength-hints">
            <span
              :class="password && password.length >= 8 ? 'hint-ok' : 'hint-off'"
              >✓ 8+ characters</span
            >
            <span
              :class="
                password && /[A-Z]/.test(password) ? 'hint-ok' : 'hint-off'
              "
              >✓ Uppercase</span
            >
            <span
              :class="
                password && /[0-9]/.test(password) ? 'hint-ok' : 'hint-off'
              "
              >✓ Number</span
            >
          </div>

          <button class="fp-submit-btn" type="submit" :disabled="loading">
            <Spinner :loading="loading" />
            <span>{{ loading ? "Resetting..." : "Reset Password" }}</span>
            <svg
              v-if="!loading"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="fp-btn-arrow"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import { useForm, useField } from "vee-validate";
import * as yup from "yup";

definePageMeta({
  layout: "auth",
  public: true,
});

useSeo("Forgot Password", "Reset your password using email and OTP");

const loginStore = useLoginStore();
const { loading } = storeToRefs(loginStore);
const step = ref(1);

const steps = [
  { title: "Email", sub: "Verify identity" },
  { title: "OTP", sub: "Enter code" },
  { title: "Password", sub: "Set new password" },
];

// Step 1
const emailSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email address"),
});
const { handleSubmit: submitEmail } = useForm({
  validationSchema: emailSchema,
});
const { value: email, errors: emailError } = useField("email");

// Step 2
const otpSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be exactly 6 digits"),
});
const { handleSubmit: submitOtp } = useForm({ validationSchema: otpSchema });
const { value: otp, errors: otpError } = useField("otp");

// Step 3
const passwordSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Minimum 8 characters"),
  passwordConfirm: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});
const { handleSubmit: submitPassword } = useForm({
  validationSchema: passwordSchema,
});
const { value: password, errors: passwordError } = useField("password");
const { value: passwordConfirm, errors: passwordConfirmError } =
  useField("passwordConfirm");

const handleSendOtp = submitEmail(async (values) => {
  const success = await loginStore.sendOtp(values.email);
  if (success) step.value = 2;
});

const handleVerifyOtp = submitOtp(async (values) => {
  const success = await loginStore.verifyOtp(values.otp);
  if (success) step.value = 3;
});

const handleResetPassword = submitPassword(async (values) => {
  await loginStore.resetPassword({
    otp: otp.value,
    password: values.password,
    password_confirmation: values.passwordConfirm,
  });
});

onUnmounted(() => {
  loginStore.resetEmail = "";
  step.value = 1;
});
</script>

<style scoped lang="scss">
// ── Layout ────────────────────────────────────────────────────────────────────
.fp-page {
  display: flex;
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

// ── Left panel ────────────────────────────────────────────────────────────────
.fp-left {
  flex: 0 0 420px;
  background: linear-gradient(155deg, #010145 0%, #030388 55%, #010145 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
}

.fp-left-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 40px 36px;
}

.fp-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 52px;
}

.fp-logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #7bf37b;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 20px;
    height: 20px;
    color: #010145;
  }
}

.fp-logo-text {
  font-size: 1rem;
  font-weight: 800;
  color: #f1f8f8;
  letter-spacing: -0.02em;
}

.fp-left-content {
  flex: 1;
}

.fp-left-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f1f8f8;
  line-height: 1.3;
  margin: 0 0 12px;
}

.fp-left-desc {
  font-size: 0.875rem;
  color: rgba(241, 248, 248, 0.65);
  line-height: 1.65;
  margin: 0 0 40px;
}

// ── Steps visual ──────────────────────────────────────────────────────────────
.fp-steps-visual {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.fp-step-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
}

.fp-step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(241, 248, 248, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: rgba(241, 248, 248, 0.45);
  background: transparent;
  flex-shrink: 0;
  transition: all 0.3s ease;

  svg {
    width: 16px;
    height: 16px;
  }
}

.fp-step-active .fp-step-circle {
  border-color: #7bf37b;
  color: #7bf37b;
  background: rgba(123, 243, 123, 0.12);
  box-shadow: 0 0 0 4px rgba(123, 243, 123, 0.12);
}

.fp-step-done .fp-step-circle {
  border-color: #7bf37b;
  background: #7bf37b;
  color: #010145;
}

.fp-step-label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 6px;
}

.fp-step-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgba(241, 248, 248, 0.5);
  transition: color 0.25s;
}

.fp-step-active .fp-step-title,
.fp-step-done .fp-step-title {
  color: #f1f8f8;
}

.fp-step-sub {
  font-size: 0.72rem;
  color: rgba(241, 248, 248, 0.4);
}

.fp-step-line {
  position: absolute;
  left: 17px;
  top: 36px;
  width: 2px;
  height: 32px;
  background: rgba(241, 248, 248, 0.15);
  transition: background 0.3s ease;
}

.fp-step-line-done {
  background: #7bf37b;
}

// ── Blobs ─────────────────────────────────────────────────────────────────────
.fp-left-blobs {
  pointer-events: none;
}

.fp-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.18;
}

.fp-blob-1 {
  width: 280px;
  height: 280px;
  background: #7bf37b;
  bottom: -60px;
  right: -80px;
}

.fp-blob-2 {
  width: 200px;
  height: 200px;
  background: #04a004;
  top: 30%;
  left: -60px;
}

// ── Right panel ───────────────────────────────────────────────────────────────
.fp-right {
  flex: 1;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.fp-card {
  background: white;
  border-radius: 20px;
  box-shadow:
    0 8px 40px rgba(1, 1, 69, 0.08),
    0 1px 3px rgba(1, 1, 69, 0.05);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
}

// ── Card header ───────────────────────────────────────────────────────────────
.fp-card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 32px 20px;
  background: linear-gradient(135deg, #ecf0e9 0%, #f5f5f5 100%);
  border-bottom: 1px solid #c0e5c9;
}

.fp-step-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #7bf37b, #26d326c9);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(123, 243, 123, 0.4);

  svg {
    width: 24px;
    height: 24px;
    color: #010145;
  }
}

.fp-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #010145;
  margin: 0 0 4px;
  line-height: 1.2;
}

.fp-subtitle {
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

// ── Progress bar ──────────────────────────────────────────────────────────────
.fp-progress-bar {
  height: 3px;
  background: #ecf0e9;
}

.fp-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7bf37b, #26d326c9);
  transition: width 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

// ── Form ──────────────────────────────────────────────────────────────────────
.fp-form {
  padding: 28px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.fp-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

// ── OTP hint ─────────────────────────────────────────────────────────────────
.fp-otp-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  background: #ecf0e9;
  border: 1px solid #c0e5c9;
  border-radius: 10px;
  font-size: 0.78rem;
  color: #010145;
  line-height: 1.5;

  svg {
    width: 16px;
    height: 16px;
    color: #04a004;
    flex-shrink: 0;
    margin-top: 1px;
  }
}

// ── Password strength hints ───────────────────────────────────────────────────
.fp-strength-hints {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  span {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    transition: all 0.2s ease;
  }

  .hint-ok {
    background: #ecf0e9;
    color: #04a004;
    border: 1px solid #c0e5c9;
  }

  .hint-off {
    background: #f5f5f5;
    color: #9ca3af;
    border: 1px solid #e5e7eb;
  }
}

// ── Submit button ─────────────────────────────────────────────────────────────
.fp-submit-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #7bf37b, #26d326c9);
  color: #010145;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(123, 243, 123, 0.4);
  transition: all 0.2s ease;
  letter-spacing: 0.01em;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5ee85e, #20c020c9);
    box-shadow: 0 6px 22px rgba(123, 243, 123, 0.5);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
}

.fp-btn-arrow {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.fp-submit-btn:hover .fp-btn-arrow {
  transform: translateX(3px);
}

// ── Back / resend links ───────────────────────────────────────────────────────
.fp-back-link {
  text-align: center;
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;

  a {
    color: #04a004;
    font-weight: 700;
    text-decoration: none;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

.fp-resend-btn {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.78rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s;

  &:hover {
    color: #04a004;
  }
}
</style>
