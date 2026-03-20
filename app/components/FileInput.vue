<script lang="ts" setup>
import { Icons } from "~/assets/icons";

const props = withDefaults(
  defineProps<{
    imagePreview: string | string[] | null;
    selectedFile: File | FileList | null;
    type?: string;
  }>(),
  {
    type: "image",
  },
);

const emit = defineEmits<{
  (e: "handle-file-upload", event: Event): void;
  (e: "clear-image"): void;
}>();

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target.files && target.files.length > 0) {
    emit("handle-file-upload", event);
  }
}

function clearImage() {
  emit("clear-image");
}

function getFileNames() {
  if (!props.selectedFile) return [];

  if (props.selectedFile instanceof FileList) {
    return Array.from(props.selectedFile).map((file) => file.name);
  }

  return [props.selectedFile.name];
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-4 rounded-xl hover:border-indigo-500 transition-colors w-full relative"
  >
    <div v-if="type === 'image' && imagePreview" class="relative group">
      <NuxtImg
        :src="imagePreview as string"
        class="h-24 w-24 rounded-full object-cover ring-2 ring-indigo-500"
      />

      <button
        @click="clearImage"
        type="button"
        class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <XMark />
      </button>
    </div>

    <!-- DOCUMENT PREVIEW -->
    <div
      v-else-if="type === 'document' && imagePreview"
      class="grid grid-cols-3 gap-4 w-full mt-2"
    >
      <div
        v-for="(file, index) in imagePreview"
        :key="index"
        class="flex flex-col items-center p-3 border rounded-lg bg-gray-50 hover:bg-indigo-50 transition"
      >
        <div class="text-indigo-500 mb-2">
          <NuxtImg :src="Icons.Document" class="w-10 h-10" />
        </div>

        <p class="text-xs text-center text-gray-600 break-all line-clamp-2">
          {{ file.split("/").pop() }}
        </p>
      </div>

      <button
        @click="clearImage"
        type="button"
        class="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 shadow"
      >
        <XMark />
      </button>
    </div>

    <!-- UPLOAD UI -->
    <div v-else class="text-center">
      <label for="fileUpload" class="cursor-pointer">
        <div class="bg-indigo-50 p-3 rounded-full inline-block mb-2">
          <Camera v-if="type === 'image'" />
          <NuxtImg :src="Icons.Document" class="h-6 w-6" v-else />
        </div>

        <p class="text-xs text-gray-500">
          Upload {{ type === "image" ? "profile picture" : "documents" }}
        </p>
      </label>
    </div>

    <input
      id="fileUpload"
      type="file"
      class="hidden"
      :accept="type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt,.xls,.xlsx'"
      :multiple="type === 'document'"
      @change="handleFileUpload"
    />
  </div>
</template>
