<template>
  <Button
    label="Clique-moi"
    data-testid="increment-btn"
    @click="increment"
  />
  <p data-testid="count">{{ count }}</p>
</template>

<script setup>
import { ref } from "vue";
import { Button } from "primevue/button";

const count = ref(0);
const increment = () => count.value++;
</script>
