<script setup lang="ts">
const dialog = defineModel<boolean>("model");
const emits = defineEmits<{
  (e: "cancel-delete"): void;
  (e: "confirm-delete"): void;
}>();
</script>
<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6"> Confirm Delete </v-card-title>

      <v-card-text> Are you sure you want to delete this item? </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="emits('cancel-delete')"> Cancel </v-btn>

        <v-btn color="error" @click="emits('confirm-delete')"> Delete </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
