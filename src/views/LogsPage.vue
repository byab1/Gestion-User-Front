<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Journal des activités</h2>

    <div class="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Filtrer par utilisateur"
        v-model="filters.user"
        class="border rounded px-3 py-1"
      />
      <input
        type="text"
        placeholder="Filtrer par action"
        v-model="filters.action"
        class="border rounded px-3 py-1"
      />
    </div>

    <table class="min-w-full bg-white shadow-md rounded overflow-hidden">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 cursor-pointer" @click="sortBy('id')">ID</th>
          <th class="px-4 py-2 cursor-pointer" @click="sortBy('user')">Utilisateur</th>
          <th class="px-4 py-2 cursor-pointer" @click="sortBy('action')">Action</th>
          <th class="px-4 py-2 cursor-pointer" @click="sortBy('details')">Détails</th>
          <th class="px-4 py-2 cursor-pointer" @click="sortBy('createdAt')">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="log in filteredLogs"
          :key="log.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="px-4 py-2">{{ log.id }}</td>
          <td class="px-4 py-2">{{ log.user.name }}</td>
          <td class="px-4 py-2">{{ log.action }}</td>
          <td class="px-4 py-2">{{ log.details }}</td>
          <td class="px-4 py-2">{{ log.createdAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center gap-2">
      <button
        @click="prevPage"
        :disabled="page <= 1"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Précédent
      </button>
      <span>Page {{ page }}</span>
      <button
        @click="nextPage"
        :disabled="page >= totalPages"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'
import api from '@/services/http'

const auth = useAuthStore()

if (!auth.user.roles.includes('ROLE_ADMIN')) {
  window.location.href = '/'
}

const logs = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)

const filters = ref({
  user: '',
  action: ''
})

const sortField = ref('id')
const sortOrder = ref('asc')

const fetchLogs = async () => {
  try {
    const params = {
      page: page.value,
      limit: limit.value,
      sort: sortField.value,
      order: sortOrder.value,
      user: filters.value.user,
      action: filters.value.action
    }

    const response = await api.get('/api/logs', {params})

    // API renvoie logs dans response.data.logs
    logs.value = response.data.logs
    total.value = response.data.total
  } catch (err) {
    console.error(err)
  }
}

// Re-fetch quand page, sort ou filters changent
watch([page, sortField, sortOrder, () => filters.value.user, () => filters.value.action], fetchLogs, { immediate: true })

const filteredLogs = computed(() => logs.value)

const totalPages = computed(() => Math.ceil(total.value / limit.value))

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

function sortBy(field) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}
</script>
