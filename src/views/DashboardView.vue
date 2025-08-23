<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white shadow rounded p-4">
        <h2 class="font-semibold">Nombre total d'utilisateurs</h2>
        <p class="text-3xl mt-2">{{ totalUsers }}</p>
      </div>
      <div class="bg-white shadow rounded p-4">
        <h2 class="font-semibold">Utilisateurs actifs</h2>
        <p class="text-3xl mt-2">{{ activeUsers }}</p>
      </div>
      <div class="bg-white shadow rounded p-4">
        <h2 class="font-semibold">Utilisateurs inactifs</h2>
        <p class="text-3xl mt-2">{{ inactiveUsers }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/http'

const totalUsers = ref(0)
const activeUsers = ref(0)
const inactiveUsers = ref(0)

async function fetchStats() {
  const res = await api.get('/api/users', { params: { page:1, limit:1000 } })
  const data = res.data.data
  totalUsers.value = data.length
  activeUsers.value = data.filter(u => u.active).length
  inactiveUsers.value = data.filter(u => !u.active).length
}

onMounted(fetchStats)
</script>
