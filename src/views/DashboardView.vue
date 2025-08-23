<template>
  <DashboardLayout>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
      <!-- Carte Statistique -->
      <div class="bg-white rounded-xl shadow p-4">
        <h2 class="text-gray-600">Utilisateurs</h2>
        <p class="text-2xl font-bold">{{ formatNumber(users.length,0,' ') }}</p>
      </div>
    </div>
    <!-- Tableau utilisateurs -->  
    <UserTable />
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";

import api from "@/services/http";
import UserTable from "@/components/UserTable.vue";
import useHelpers from "@/utils/useHelpers";

const users = ref([]);
const loading = ref(true);

const {formatNumber}= useHelpers()

// Récupération des utilisateurs
const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await api.get("/api/users");
    users.value = res.data.data;

    console.log(users.value)
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchUsers);
</script>
