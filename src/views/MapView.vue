<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">Health Services Map</h1>
        <p class="text-center text-muted mb-5">
          Find nearby hospitals, clinics, and pharmacies in your area.
        </p>
      </div>
    </div>

    <HealthMap />
  </div>
</template>

<script setup>
import HealthMap from '../components/HealthMap.vue'
</script>

<style scoped>
h1 {
  color: #2c3e50;
  font-weight: 600;
}
</style>
