<script setup lang="ts">
import { useForm, configure, useField } from "vee-validate";
import * as yup from "yup";

const login = useLoginStore();
const { loading } = storeToRefs(login);

definePageMeta({
  layout: "auth",
  public: true,
});

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email().required("Email is required"),
  street: yup.string().required("Street is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  pincode: yup
    .string()
    .required("Pincode is required")
    .matches(/^[0-9]+$/, "Pincode must only contain digits")
    .min(6, "Pincode must be at least 6 digits")
    .max(6, "Pincode must be at most 6 digits"),
  gender: yup.string().required("Gender is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/^[0-9]+$/, "Phone must only contain digits")
    .min(10, "Phone must be at least 10 digits")
    .max(10, "Phone must be at most 10 digits"),
  dob: yup.string().required("DOB is required"),
  role: yup
    .number()
    .required("Role is required")
    .oneOf([1, 2], "Select a valid role"),
  password: yup.string().min(8).required("Password is required"),
  confirmPassword: yup.string().when("password", {
    is: (password: string) => password?.length > 0,
    then: (schema) =>
      schema
        .required("Confirm Password is required")
        .min(8, "Min 8 characters")
        .oneOf([yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema.optional(),
  }),
});

configure({
  bails: false,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

let roleOptions = [
  { label: "Admin", value: 1 },
  { label: "User", value: 2 },
];

let genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const { handleSubmit, errors, resetForm, defineField } = useForm({
  validationSchema: schema,
  initialValues: {
    name: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    gender: "",
    phone: "",
    email: "",
    dob: "",
    role: 0,
  },
});

// Define each field to get its 'touched' status
const [name, nameProps] = defineField("name");
const [email, emailProps] = defineField("email");
const [street, streetProps] = defineField("street");
const [city, cityProps] = defineField("city");
const [state, stateProps] = defineField("state");
const [pincode, pincodeProps] = defineField("pincode");
const [gender, genderProps] = defineField("gender");
const [phone, phoneProps] = defineField("phone");
const [dob, dobProps] = defineField("dob");
const [password, passwordProps] = defineField("password");
const [confirmPassword, confirmPasswordProps] = defineField("confirmPassword");
const [role, roleProps] = defineField("role");
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
    imagePreview.value = URL.createObjectURL(target.files[0]);
  }
}

function clearImage() {
  selectedFile.value = null;
  imagePreview.value = null;
}

const handleRegister = handleSubmit(async (values: any) => {
  const formData = new FormData();

  Object.keys(values).forEach((key) => {
    if (values[key] !== null && values[key] !== undefined) {
      formData.append(key, values[key]);
    }
  });

  if (selectedFile.value) {
    formData.append("profile_image", selectedFile.value);
  }

  await login.register(formData);
  resetForm();
});
</script>

<template>
  <div class="flex justify-center items-center m-[40px_0]">
    <div class="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
        Register
      </h1>
      <form @submit.prevent="handleRegister" id="register-form">
        <FileInput
          @handle-file-upload="handleFileUpload"
          @clear-image="clearImage"
          :imagePreview="imagePreview"
          :selectedFile="selectedFile"
        />
        <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-2">
          <Input
            v-model="name"
            v-bind="nameProps"
            placeholder="Name"
            :error="errors.name"
            label="Name"
            layout="form"
          />
          <Input
            v-model="street"
            v-bind="streetProps"
            :error="errors.street"
            placeholder="Street"
            label="Street"
            layout="form"
          />
          <Input
            v-model="city"
            v-bind="cityProps"
            :error="errors.city"
            placeholder="City"
            label="City"
            layout="form"
          />
          <Input
            v-model="state"
            v-bind="stateProps"
            :error="errors.state"
            placeholder="State"
            label="State"
            layout="form"
          />
          <Input
            v-model="pincode"
            v-bind="pincodeProps"
            :error="errors.pincode"
            placeholder="Pincode"
            label="Pincode"
            layout="form"
          />
          <Select
            v-model="gender"
            v-bind="genderProps"
            :error="errors.gender"
            :options="genderOptions"
            placeholder="Gender"
            label="Gender"
            layout="form"
          />
          <Select
            v-model="role"
            v-bind="roleProps"
            :error="errors.role"
            :options="roleOptions"
            placeholder="Role"
            label="Role"
            layout="form"
          />
          <Input
            v-model="phone"
            v-bind="phoneProps"
            :error="errors.phone"
            placeholder="Phone"
            type="text"
            label="Phone"
            layout="form"
          />
          <Input
            v-model="email"
            v-bind="emailProps"
            placeholder="Email"
            :error="errors.email"
            label="Email"
            layout="form"
          />
          <Input
            v-model="dob"
            v-bind="dobProps"
            :error="errors.dob"
            placeholder="DOB"
            type="date"
            label="DOB"
            layout="form"
          />
          <Input
            v-model="password"
            v-bind="passwordProps"
            placeholder="Password"
            :error="errors.password"
            label="Password"
            type="password"
            layout="form"
          />

          <Input
            v-model="confirmPassword"
            v-bind="confirmPasswordProps"
            placeholder="Confirm Password"
            :error="errors.confirmPassword"
            label="Confirm Password"
            type="password"
            layout="form"
          />
        </div>
      </form>
      <Button
        form="register-form"
        additionalClasses="w-full mt-4"
        type="submit"
      >
        <span class="flex gap-x-2 justify-center">
          <Spinner :loading="loading" />
          {{ loading ? "Registering..." : "Register" }}
        </span>
      </Button>

      <div class="text-center text-sm text-gray-600 mt-2">
        Already have an account?
        <NuxtLink
          to="/login"
          class="text-blue-600 font-semibold hover:underline"
        >
          Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
