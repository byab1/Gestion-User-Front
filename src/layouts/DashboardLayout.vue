<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-md flex flex-col">
      <div class="h-16 flex items-center justify-center font-bold text-xl border-b">
      Gestion Utilisateurs
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          to="/dashboard"
          class="block px-4 py-2 rounded-lg hover:bg-gray-200"
          active-class="bg-gray-300 font-semibold"
        >
          📊 Dashboard
        </RouterLink>
        <RouterLink
          to="/users"
          class="block px-4 py-2 rounded-lg hover:bg-gray-200"
          active-class="bg-gray-300 font-semibold"
        >
          👥 Utilisateurs
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-white shadow-md flex items-center justify-between px-6">
        <h1 class="text-lg font-semibold">{{ currentTitle }}</h1>
        <div class="relative">
          <button @click="toggleMenu" class="flex items-center space-x-2 focus:outline-none">
            <span class="text-gray-700 font-medium">{{ userStore.user.name }}</span>
            <img
              :src="userStore.user.photo ? BASE_IMG_URL+'/'+userStore.user.photo : defaultAvatar"
              alt="User avatar"
              class="w-8 h-8 rounded-full border"
            />
          </button>
          <!-- Dropdown -->
          <div
            v-if="menuOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
          >
            <button
              @click="logout"
              class="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-6 overflow-y-auto">
       <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/store/auth";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { BASE_IMG_URL } from "../../config";

const router = useRouter();
const route = useRoute();
const menuOpen = ref(false);

const userStore = useAuthStore();
console.log("userStore",userStore.user.name)

const defaultAvatar = 'https://i.pravatar.cc/40'

const currentTitle = computed(() => route.meta.title || "Tableau de bord");


function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function logout() {
  localStorage.removeItem("token");
  router.push("/login");
}
</script>
