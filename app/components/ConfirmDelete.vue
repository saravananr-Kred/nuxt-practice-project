<script setup lang="ts">
const dialog = defineModel<boolean>("model");
const emits = defineEmits<{
  (e: "cancel-delete"): void;
  (e: "confirm-delete"): void;
}>();
</script>

<template>
  <v-dialog v-model="dialog" max-width="440" persistent>
    <v-card class="delete-dialog-card">
      <v-card-item class="pa-6">
        <div class="d-flex align-center mb-4">
          <div class="icon-wrapper mr-4">
            <v-icon icon="mdi-delete-outline" color="#04a004" size="28" />
          </div>
          <v-card-title class="text-h5 font-weight-bold dialog-title">
            Confirm Delete
          </v-card-title>
        </div>

        <v-card-text class="pa-0 dialog-body-text">
          Are you sure you want to delete this item? This action
          <span class="font-weight-bold">cannot be undone</span>.
        </v-card-text>
      </v-card-item>

      <v-divider class="border-opacity-25" :color="'#36eb36'" />

      <v-card-actions class="pa-6">
        <v-btn
          class="btn-secondary text-none px-6"
          variant="flat"
          height="44"
          @click="emits('cancel-delete')"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          class="btn-primary-action text-none px-8"
          variant="flat"
          height="44"
          @click="emits('confirm-delete')"
        >
          Yes, Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.delete-dialog-card {
  background-color: $background-primary !important;
  border: 1px solid $card-border !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 25px -5px $shadow-navy !important;
  overflow: hidden;
  position: relative;
}

.header-accent {
  height: 6px;
  background: linear-gradient(90deg, $btn-bg-primary, $btn-bg-primary-dark);
}

.icon-wrapper {
  background-color: $card-background; // Translucent green
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-title {
  font-family: $main-font !important;
  color: $navy-text;
  letter-spacing: -0.5px;
}

.dialog-body-text {
  font-family: $secondary-font !important;
  color: $navy-text;
  line-height: 1.6;
  font-size: 1rem;
}

/* Button Styling */
.btn-secondary {
  background-color: $btn_bg-secondary !important;
  color: $navy-text !important;
  font-family: $main-font;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background-color: $btn_bg-secondary--hover !important;
  }
}

.btn-primary-action {
  background-color: $btn-bg-primary-dark !important;
  color: $btn-primary !important; // #fafafa
  font-family: $main-font;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 4px 12px #26d3264d;
  transition: all 0.3s ease;

  &:hover {
    background-color: $btn-bg-primary-dark-hover !important;
    transform: translateY(-1px);
    box-shadow: 0 6px 15px #26d32666;
  }
}
</style>
