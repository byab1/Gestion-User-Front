<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <!-- Fermer -->
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('update:visible', false)"
      >
        ✕
      </button>

      <!-- Titre -->
      <h2 class="text-xl font-semibold mb-4">
        {{ user ? "Modifier l'utilisateur" : "Ajouter un utilisateur" }}
      </h2>

      <!-- Formulaire -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            v-model="formData.name"
            type="text"
            class="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
            required
          />
          <p v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
            required
          />
           <p v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email }}</p>
        </div>

        <div v-if="!user">
          <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input
            v-model="formData.password"
            type="password"
            class="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
          />
          <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
        </div>

        <!-- Rôles -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Rôles</label>
          <select
            v-model="formData.roles"
            multiple
            class="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
          >
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            <option value="ROLE_USER">ROLE_USER</option>
          </select>
          <!-- <Select id="roles" v-model="formData.roles" :options="roles" optionLabel="label" optionValue="value" placeholder="Sélectionner..." fluid></Select> -->
          <p v-if="errors.roles" class="text-sm text-red-600 mt-1">{{ errors.roles }}</p>
        </div>

        <!-- Statut -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Statut</label>
          <select
            v-model="formData.active"
            class="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
          >
            <option :value="true">Actif</option>
            <option :value="false">Inactif</option>
          </select>
          <p v-if="errors.active" class="text-sm text-red-600 mt-1">{{ errors.active }}</p>
        </div>

        <!-- Photo -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Photo</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="w-full border rounded px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
          />
          <div v-if="preview" class="mt-2">
            <img :src="preview" alt="Preview" class="w-20 h-20 rounded-full object-cover border" />
          </div>
          <p v-if="errors.photo" class="text-sm text-red-600 mt-1">{{ errors.photo }}</p>
        </div>

        <!-- Boutons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            @click="$emit('update:visible', false)"
            class="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {{ user ? "Mettre à jour" : "Créer" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue"
import { BASE_IMG_URL } from "../../config"
import { Select } from "primevue"

const props = defineProps({
  visible: Boolean,
  user: Object,
   apiErrors: Object
})
const emit = defineEmits(["update:visible", "save"])

const formData = ref({
  id: null,
  name: "",
  email: "",
  roles: ["ROLE_USER"],
  active: true,
  photo: null,
})

const roles = ref([
    { label: 'ADMIN', value: "ROLE_ADMIN" },
    { label: 'USER', value: "ROLE_USER" }
]);

const preview = ref(null)
const errors = ref({})

watch(
  () => props.apiErrors,
  (val) => {
    errors.value = val || {}
  },
  { immediate: true }
)

watch(
  () => props.user,
  (val) => {
    if (val) {
      formData.value = {
        id: val.id,
        name: val.name,
        email: val.email,
        password: "",
        roles: val.roles,
        active: val.active,
        photo: null,
      }
      preview.value = val.photo
        ? BASE_IMG_URL+`/${val.photo}`
        : null
    } else {
      formData.value = {
        id: null,
        name: "",
        email: "",
        password: "",
        roles: ["ROLE_USER"],
        active: true,
        photo: null,
      }
      preview.value = null
    }
    errors.value = {}
  },
  { immediate: true }
)

function handleFileUpload(e) {
  const file = e.target.files[0]
  if (file) {
    formData.value.photo = file
    preview.value = URL.createObjectURL(file)
  }
}

function submitForm() {
  const fd = new FormData()
  fd.append("name", formData.value.name)
  fd.append("email", formData.value.email)
  fd.append("active", formData.value.active)
  fd.append("password", formData.value.password)
  formData.value.roles.forEach((r, i) => fd.append(`roles[${i}]`, r))
  if (formData.value.photo) {
    fd.append("photo", formData.value.photo)
  }
  if (formData.value.id) {
    fd.append("id", formData.value.id)
  }

  emit("save", fd)
}
</script>
