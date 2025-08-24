<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Liste des utilisateurs</h2>
      <button
        v-if="authStore.isAdmin"
        @click="openAddUserForm"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        + Ajouter un utilisateur
      </button>
    </div>
    <!-- Filtres -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div class="flex gap-2">
        <input
          v-model="filters.name"
          type="text"
          placeholder="Filtrer par nom"
          class="border rounded px-3 py-2 w-48 focus:ring focus:ring-indigo-200"
        />
        <input
          v-model="filters.email"
          type="text"
          placeholder="Filtrer par email"
          class="border rounded px-3 py-2 w-56 focus:ring focus:ring-indigo-200"
        />
      </div>

      <!-- Tri -->
      <button
        @click="toggleSort"
        class="flex items-center gap-2 border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
      >
        Trier par ID
        <span v-if="sortOrder === 'asc'">⬆️</span>
        <span v-else>⬇️</span>
      </button>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="min-w-full text-sm text-left">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-3">ID</th>
            <th class="px-4 py-3">Photo</th>
            <th class="px-4 py-3">Nom</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Rôles</th>
            <th class="px-4 py-3">Statut</th>
            <th class="px-4 py-3">Créé le</th>
            <th v-if="authStore.isAdmin" class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-3">{{ user.id }}</td>
            <td class="px-4 py-3">
              <img
                :src="user.photo ? BASE_IMG_URL +'/' + user.photo : defaultAvatar"
                alt="Photo"
                class="w-10 h-10 rounded-full border"
              />
            </td>
            <td class="px-4 py-3 font-medium">{{ first2UpperCase(user.name) }}</td>
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">
              <span
                v-for="role in user.roles"
                :key="role"
                class="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs mr-1"
              >
                {{ role }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span
                :class="user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded text-xs"
              >
                {{ user.active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-500">{{ formatDate(user.createdAt) }}</td>
            <!-- Actions uniquement si admin -->
            <td v-if="authStore.isAdmin" class="px-4 py-2 space-x-2">
                <button
                @click="editUser(user)"
                class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                Modifier
                </button>
                <button
                @click="deleteUser(user.id)"
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                Supprimer
                </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="prevPage"
        :disabled="page === 1"
        class="px-3 py-2 border rounded bg-gray-100 disabled:opacity-50"
      >
        Précédent
      </button>
      <span>Page {{ page }} / {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="page === totalPages"
        class="px-3 py-2 border rounded bg-gray-100 disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>

  <UserFormModal
  v-model:visible="showForm"
  v-if="showForm"
  :user="selectedUser"
  :apiErrors="apiErrors"
  @save="saveUser"
/>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue"
import api from "@/services/http"
import { BASE_IMG_URL } from "../../config"
import useHelpers from "@/utils/useHelpers"
import { useAuthStore } from "@/store/auth"
import UserFormModal from "./UserFormModal.vue"
import { useToast } from 'primevue/usetoast'

const defaultAvatar = "https://i.pravatar.cc/40"
const toast = useToast()
const users = ref([])
const total = ref(0)
const page = ref(1)
const limit = ref(5)
const sortOrder = ref("desc")
const filters = ref({ name: "", email: "" })

const authStore = useAuthStore()
const selectedUser = ref(null)
const showForm = ref(false)
const apiErrors = ref({})

const {first2UpperCase,formatDate,formatdateToLocalString}= useHelpers()

// Récupération API (avec pagination & filtres)
async function fetchUsers() {
  try {
    const res = await api.get('/api/users', {
      params: {
        page: page.value,
        limit: limit.value,
        sort: "id",
        order: sortOrder.value,
        name: filters.value.name || undefined,
        email: filters.value.email || undefined,
      },
    })
    users.value = res.data.data
    total.value = res.data.total
  } catch (error) {
    console.error("Erreur API:", error)
  }
}

const totalPages = computed(() => Math.ceil(total.value / limit.value))

function toggleSort() {
  sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc"
  fetchUsers()
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    fetchUsers()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    fetchUsers()
  }
}

function openAddUserForm() {
  selectedUser.value = null
  showForm.value = true
}

function editUser(user) {
  selectedUser.value = user
  showForm.value = true
}

// async function saveUser(userData) {
//   try {
//     if (userData.id) {
//         await api.post(`/api/users/${userData.id}`, userData)
//        toast.add({ severity: 'success', summary: 'Mise à jour éffectuée avec succès', detail: 'Succès', life: 2000 })
//     } else {
//         await api.post(`/api/users`, userData)
//         toast.add({ severity: 'success', summary: 'Utilisateur créé avec succès', detail: 'Succès', life: 2000 })
//     }
//     showForm.value = false
//     fetchUsers()
//   } catch (error) {
//     console.error("Erreur sauvegarde utilisateur:", error)
//   }
// }

async function saveUser(fd) {
  try {
    apiErrors.value = {}
    if (fd.get("id")) {
      // UPDATE
      await api.post(`/api/users/${fd.get("id")}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.add({ severity: 'success', summary: 'Mise à jour éffectuée avec succès', detail: 'Succès', life: 2000 })
    } else {
      // CREATE
      await api.post(`/api/users`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
       toast.add({ severity: 'success', summary: 'Utilisateur créé avec succès', detail: 'Succès', life: 2000 })
    }
    showForm.value = false
    fetchUsers()
  } catch (error) {
    if (error.response?.data?.errors) {
      apiErrors.value = error.response.data.errors
    } else {
      console.error("Erreur sauvegarde utilisateur:", error)
    }
    console.error("Erreur sauvegarde utilisateur:", error)
  }
}


async function deleteUser(id) {
  if (!confirm("Supprimer cet utilisateur ?")) return
  try {
    await api.delete(`/api/users/${id}`)
    toast.add({ severity: 'success', summary: 'Utilisateur supprimé avec succès', detail: 'Succès', life: 2000 })
    fetchUsers()
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error)
  }
}

// Watch filtres (reload à chaque modif)
watch(filters, () => {
  page.value = 1 // reset page
  fetchUsers()
}, { deep: true })

onMounted(fetchUsers)
</script>
