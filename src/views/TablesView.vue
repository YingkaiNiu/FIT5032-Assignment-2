<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center mb-4">Interactive Tables</h1>
        <p class="text-center text-muted mb-5">
          Explore our interactive tables with sorting, searching, and pagination features.
        </p>
      </div>
    </div>

    <!-- First Table -->
    <div class="row mb-5">
      <div class="col-12">
        <UserTable />
      </div>
    </div>

    <!-- Second Table -->
    <div class="row">
      <div class="col-12">
        <ServiceTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserTable from '../components/UserTable.vue'
import ServiceTable from '../components/ServiceTable.vue'
</script>

<style scoped>
h1 {
  color: #2c3e50;
  font-weight: 600;
}
</style>
