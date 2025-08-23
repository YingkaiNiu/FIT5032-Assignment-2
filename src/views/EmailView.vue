<template>
  <div>
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1 class="text-center mb-4">Email Service</h1>
          <p class="text-center text-muted mb-5">
            Send emails with attachments using our integrated email service.
          </p>
        </div>
      </div>
    </div>
    
    <EmailComponent />
  </div>
</template>

<script setup>
import EmailComponent from '../components/EmailComponent.vue'
</script>

<style scoped>
h1 {
  color: #2c3e50;
  font-weight: 600;
}
</style>
