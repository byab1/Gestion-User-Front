<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block text-sm">Email</label>
      <input v-model="email" type="email" class="w-full border p-2 rounded" required />
    </div>
    <div>
      <label class="block text-sm">Mot de passe</label>
      <input v-model="password" type="password" class="w-full border p-2 rounded" required />
    </div>
    <div class="flex items-center justify-between">
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Se connecter</button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from './../store/auth'
import { useToast } from 'primevue/usetoast'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const toast = useToast()

async function onSubmit() {
  try {
    await auth.login(email.value, password.value)
    toast.add({ severity: 'success', summary: 'Connecté', detail: 'Bienvenue', life: 2000 })
    // redirect to home
    window.location.href = '/dashboard'
  } catch (err) {
    const msg = err.response?.data?.message || 'Erreur de connexion'
    toast.add({ severity: 'error', summary: 'Erreur', detail: msg, life: 4000 })
  }
}
</script>
