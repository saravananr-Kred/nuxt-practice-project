<template>
  <Modal
    :isOpen="open"
    :title="id === 0 ? 'Add User' : 'Edit User'"
    @close="openAddUser(false)"
  >
    <form
      @submit.prevent="addUser"
      id="addUserForm"
      enctype="multipart/form-data"
    >
      <div class="flex flex-col gap-y-4 w-full">
        <FileInput
          @handle-file-upload="handleFileUpload"
          @clear-image="clearImage"
          :imagePreview="imagePreview"
          :selectedFile="selectedFile"
        />

        <div class="grid grid-cols-2 gap-2.5">
          <Input
            v-model="name"
            v-bind="nameProps"
            :error="errors.name"
            label="Full Name"
            placeholder="John Doe"
            layout="form"
          />
          <Input
            v-model="email"
            v-bind="emailProps"
            :error="errors.email"
            label="Email Address"
            placeholder="john@example.com"
            layout="form"
          />
          <Input
            v-model="street"
            v-bind="streetProps"
            :error="errors.street"
            label="Street"
            layout="form"
          />
          <!-- <Input
            v-model="city"
            v-bind="cityProps"
            :error="errors.city"
            label="City"
            layout="form"
          /> -->
          <!-- <Input
            v-model="state"
            v-bind="stateProps"
            :error="errors.state"
            label="State"
            layout="form"
          /> -->
          <Select
            v-model="state"
            v-bind="stateProps"
            :error="errors.state"
            :options="stateOptions"
            label="State"
            layout="form"
          />
          <Select
            v-model="city"
            v-bind="cityProps"
            :error="errors.city"
            :options="cityOptions"
            label="City"
            layout="form"
            :disabled="!state"
          />
          <Input
            v-model="pincode"
            v-bind="pincodeProps"
            :error="errors.pincode"
            label="Pincode"
            layout="form"
          />
          <Input
            v-model="phone"
            v-bind="phoneProps"
            :error="errors.phone"
            label="Phone"
            layout="form"
          />
          <Select
            v-model="gender"
            v-bind="genderProps"
            :error="errors.gender"
            :options="statusOptions"
            label="Gender"
            layout="form"
          />
          <Select
            v-model="role"
            v-bind="roleProps"
            :error="errors.role"
            :options="roleOptions"
            label="Account Role"
            layout="form"
          />
          <!-- <Input
            v-model="dob"
            v-bind="dobProps"
            :error="errors.dob"
            label="Date of Birth"
            type="date"
            layout="form"
          /> -->
          <Datepicker
            v-model="dob"
            v-bind="dobProps"
            :errorMessage="errors.dob"
            label="Date of Birth"
            height="36px"
            layout="form"
          />
        </div>

        <div v-if="id === 0" class="grid grid-cols-2 gap-4 pt-4 border-t">
          <Input
            v-model="password"
            v-bind="passwordProps"
            :error="errors.password"
            label="Password"
            type="password"
            layout="form"
          />
          <Input
            v-model="confirmPassword"
            v-bind="confirmPasswordProps"
            :error="errors.confirmPassword"
            label="Confirm"
            type="password"
            layout="form"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex gap-x-3 justify-end w-full">
        <Button
          colorClasses="bg-[#c8c6c6] hover:bg-[#cccbcb] text-black-600"
          @click="openAddUser(false)"
          >Cancel</Button
        >
        <Button
          type="submit"
          class="flex items-center"
          form="addUserForm"
          :disabled="loadingUsers"
        >
          <Spinner :loading="loadingUsers" class="mr-2" />
          {{ id === 0 ? "Create User" : "Save Changes" }}
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts" setup>
import { useForm, configure } from "vee-validate";
import * as yup from "yup";

// refs
const id = ref<number>(0);
const user = useUsersStore();
const { singleUser, loadingUsers } = storeToRefs(user);
const selectedFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

// model
const open = defineModel<boolean>({ required: true });

// emits
const emit = defineEmits<{ (e: "refresh-data"): () => void }>();

// props
const props = defineProps<{
  data: any | null;
  userId: number;
}>();

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

const schema = yup.object({
  name: yup.string().required("Name is required"),
  password: yup.string().when([], {
    is: () => id.value === 0,
    then: (schema) =>
      schema.required("Password is required").min(8, "Min 8 characters"),
    otherwise: (schema) => schema.optional(),
  }),
  confirmPassword: yup.string().when("password", {
    is: (password: string) => password?.length > 0,
    then: (schema) =>
      schema
        .required("Confirm Password is required")
        .min(8, "Min 8 characters")
        .oneOf([yup.ref("password")], "Passwords must match"),
    otherwise: (schema) => schema.optional(),
  }),
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
  email: yup.string().email("Enter valid email").required("Email is required"),
  dob: yup.string().required("DOB is required"),
  role: yup.number().required("Role is required"),
});

const locations = {
  California: [
    "Los Angeles",
    "San Diego",
    "San Jose",
    "San Francisco",
    "Sacramento",
  ],
  Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Tallahassee"],
  "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Springfield", "Rockford"],
  Pennsylvania: [
    "Philadelphia",
    "Pittsburgh",
    "Allentown",
    "Erie",
    "Harrisburg",
  ],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  Georgia: ["Atlanta", "Augusta", "Savannah", "Athens", "Columbus"],
  Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Olympia"],
  Arizona: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  Colorado: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
  Michigan: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint"],
  Massachusetts: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  Nevada: ["Las Vegas", "Reno", "Henderson", "North Las Vegas", "Carson City"],
  "North Carolina": [
    "Charlotte",
    "Raleigh",
    "Greensboro",
    "Durham",
    "Winston-Salem",
  ],
};

const { handleSubmit, resetForm, errors, setValues, defineField } = useForm({
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

const [name, nameProps] = defineField("name");
const [street, streetProps] = defineField("street");
const [city, cityProps] = defineField("city");
const [state, stateProps] = defineField("state");
const [pincode, pincodeProps] = defineField("pincode");
const [gender, genderProps] = defineField("gender");
const [phone, phoneProps] = defineField("phone");
const [email, emailProps] = defineField("email");
const [dob, dobProps] = defineField("dob");
const [password, passwordProps] = defineField("password");
const [confirmPassword, confirmPasswordProps] = defineField("confirmPassword");
const [role, roleProps] = defineField("role");

let roleOptions = [
  { label: "Admin", value: 1 },
  { label: "User", value: 2 },
];

const stateOptions = computed(() => {
  return [
    { label: "Select a state", value: "" },
    ...Object.keys(locations).map((l: string) => ({ label: l, value: l })),
  ];
});

const cityOptions = computed(() => {
  return state.value
    ? [
        { label: "Select a city", value: "" },
        ...locations[state.value as keyof typeof locations].map(
          (l: string) => ({
            label: l,
            value: l,
          }),
        ),
      ]
    : [{ label: "Select a state first", value: "" }];
});

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: false,
  validateOnModelUpdate: true,
});

function openAddUser(value: boolean) {
  resetForm();
  clearImage();
  id.value = 0;
  open.value = value;
}

let statusOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const addUser = handleSubmit(async (values: any) => {
  try {
    // const formData = new FormData();

    // Object.keys(values).forEach((key) => {
    //   if (values[key] !== null && values[key] !== undefined) {
    //     formData.append(key, values[key]);
    //   }
    // });

    if (selectedFile.value) {
      try {
        const supabase = useSupabaseClient();

        const fileExt = selectedFile.value.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
          .from("images")
          .upload(filePath, selectedFile.value);

        if (error) throw error;

        const { data } = supabase.storage.from("images").getPublicUrl(filePath);

        values.profile_image = data.publicUrl;
      } catch (error: any) {
        showError(error.message);
        return;
      }
    } else {
      values.profile_image = null;
    }

    if (id.value === 0) {
      await user.AddUserApi(values);
    } else {
      await user.UpdateUser(values, id.value);
    }

    resetForm();
    clearImage();
    emit("refresh-data");
    open.value = false;
  } catch (error) {
    console.error("Submission failed:", error);
  } finally {
    id.value = 0;
  }
});

watch(
  () => singleUser.value,
  (newData) => {
    if (newData?.id) {
      // We are EDITING
      id.value = newData.id;
      // Map the prop data to the form state
      setValues({
        name: newData.name || "",
        password: "",
        street: newData.street || "",
        city: newData.city || "",
        state: newData.state || "",
        pincode: newData.pincode || "",
        gender: newData.gender || "",
        phone: newData.phone || "",
        email: newData.email || "",
        dob: newData.dob || "",
        role: newData.role || 0,
      });
    } else {
      // We are ADDING
      id.value = 0;
      resetForm();
    }
  },
  { immediate: true, deep: true },
);
</script>
