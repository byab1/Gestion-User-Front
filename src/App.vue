<template>
  <div class="min-h-screen bg-gray-50">
    <Toast />
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './store/auth'
import Toast from 'primevue/toast'

const auth = useAuthStore()
onMounted(() => {
  // hydrate user if token present
  if (!auth.user && auth.token) auth.fetchMe().catch(()=>auth.logout())
})
</script>

<style>
/* global styles if needed */
</style>
