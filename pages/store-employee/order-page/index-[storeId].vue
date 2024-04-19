<template>
  <main class="w-full h-full max-w-[90rem] mx-auto">
    <div class="flex gap-2 w-full justify-center md:gap-5 items-center mt-2">
      <div
        :class="
          currentPath.includes('delivery')
            ? 'text-primary border-primary'
            : 'text-neutral-600 border-neutral-500'
        "
        class="font-semibold transition-colors ease-in-out duration-200 border-2 px-8 py-1 rounded-sm cursor-pointer hover:border-primary hover:text-primary">
        <NuxtLink
          :to="{
            name: 'store-employee-order-page-index-storeId-delivery-storeId',
            params: { storeId },
          }">
          With Delivery
        </NuxtLink>
      </div>

      <label
        for="Toggle1"
        class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100">
        <span
          @click="handleDeliveryTypeChange"
          class="relative">
          <input
            id="Toggle1"
            v-model="isWithDelivery"
            @click="handleDeliveryTypeChange"
            type="checkbox"
            class="hidden peer" />
          <div
            class="w-10 h-6 rounded-full shadow-inner bg-neutral500 peer-checked:bg-neutral500"></div>
          <div
            class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-primary"></div>
        </span>
      </label>

      <div
        :class="
          currentPath.includes('self')
            ? 'text-primary border-primary'
            : 'text-neutral-600 border-neutral-500'
        "
        class="font-semibold transition-colors ease-in-out duration-200 border-2 px-8 py-1 rounded-sm cursor-pointer hover:border-primary hover:text-primary">
        <NuxtLink
          :to="{
            name: 'store-employee-order-page-index-storeId-self-storeId',
            params: { storeId },
          }"
          >Self Pick Up</NuxtLink
        >
      </div>
    </div>

    <div class="my-4"></div>
    <NuxtPage />
  </main>
</template>
<script setup lang="ts">
import { useAuth } from "~~/store/auth";

const route = useRoute();
const storeId = computed(() => {
  return route.params?.storeId;
});
const router = useRouter();

const currentPath = computed(() => route.path);
const isWithDelivery = computed(() => {
  return currentPath.value.includes("self");
});

const handleDeliveryTypeChange = () => {
  if (isWithDelivery.value) {
    router.replace({
      name: "store-employee-order-page-index-storeId-delivery-storeId",
      params: { storeId: storeId.value },
    });
  } else {
    router.replace({
      name: "store-employee-order-page-index-storeId-self-storeId",
      params: { storeId: storeId.value },
    });
  }
};

useHead({
  title: "Orders",
});
</script>
