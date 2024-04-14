<template>
  <div>Orders</div>
</template>

<script setup lang="ts">
import { useAuth } from "~~/store/auth";
/*
order per store view scan,

store , product,
product, edit product add, discount add
*/
definePageMeta({
  validate: (route) => {
    const { role } = useAuth();
    if (role === "supplier" || role === "guest" || role === "store_manager")
      return true;
    else return false;
  },
});
</script>
