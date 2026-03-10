<script setup lang="ts">
// Form State
const form = reactive({
  user_name: "",
  user_email: "",
  subject: "General Inquiry",
  message: "",
});

const isSubmitting = ref(false);
const statusMessage = ref("");

const sendEmail = async () => {
  // isSubmitting.value = true;
  // try {
  //   // Replace these with your actual EmailJS IDs
  //   await emailjs.send(
  //     "YOUR_SERVICE_ID",
  //     "YOUR_TEMPLATE_ID",
  //     { ...form },
  //     "YOUR_PUBLIC_KEY",
  //   );
  //   statusMessage.value = "Success! Your message has been sent.";
  //   // Reset form
  //   form.user_name = "";
  //   form.user_email = "";
  //   form.message = "";
  // } catch (error) {
  //   statusMessage.value = "Oops! Something went wrong. Please try again.";
  //   console.error("EmailJS Error:", error);
  // } finally {
  //   isSubmitting.value = false;
  // }
};
</script>

<template>
  <div class="contact-container">
    <h2>Get in Touch</h2>
    <p>Have a question? Drop us a line below.</p>

    <form @submit.prevent="sendEmail" class="contact-form">
      <div class="form-group">
        <label>Name</label>
        <input
          v-model="form.user_name"
          type="text"
          required
          placeholder="Your Name"
        />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input
          v-model="form.user_email"
          type="email"
          required
          placeholder="email@example.com"
        />
      </div>

      <div class="form-group">
        <label>Message</label>
        <textarea
          v-model="form.message"
          rows="5"
          required
          placeholder="How can we help?"
        ></textarea>
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? "Sending..." : "Send Message" }}
      </button>

      <p
        v-if="statusMessage"
        :class="{
          success: !statusMessage.includes('Oops'),
          error: statusMessage.includes('Oops'),
        }"
      >
        {{ statusMessage }}
      </p>
    </form>
  </div>
</template>

<style scoped>
.contact-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1rem;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
input,
textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}
button {
  padding: 1rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
button:disabled {
  background: #a8dadc;
  cursor: not-allowed;
}
.success {
  color: #2d6a4f;
  font-weight: bold;
}
.error {
  color: #e63946;
}
</style>
