<!-- <template>
  <main class="w-full h-full max-w-[90rem] mx-auto">
    <div class="flex gap-2 w-full justify-center md:gap-5 items-center mt-2">
      <div
        :class="
          /^\/my-products\/orders-and-payment(?!(\/self))+/i.test(currentPath)
            ? 'text-primary border-primary'
            : 'text-neutral-600 border-neutral-500'
        "
        class="font-semibold transition-colors ease-in-out duration-200 border-2 px-8 py-1 rounded-sm cursor-pointer hover:border-primary hover:text-primary"
      >
        <NuxtLink :to="{ name: 'my-products-orders-and-payment' }">
          With Delivery
        </NuxtLink>
      </div>

      <label
        for="Toggle1"
        class="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-100"
      >
        <span @click="handleDeliveryTypeChange" class="relative">
          <input
            id="Toggle1"
            v-model="isWithDelivery"
            @click="handleDeliveryTypeChange"
            type="checkbox"
            class="hidden peer"
          />
          <div
            class="w-10 h-6 rounded-full shadow-inner bg-neutral500 peer-checked:bg-neutral500"
          ></div>
          <div
            class="absolute inset-y-0 left-0 w-4 h-4 m-1 rounded-full shadow peer-checked:right-0 peer-checked:left-auto bg-primary"
          ></div>
        </span>
      </label>

      <div
        :class="
          /^\/my-products\/orders-and-payment\/self/i.test(currentPath)
            ? 'text-primary border-primary'
            : 'text-neutral-600 border-neutral-500'
        "
        class="font-semibold transition-colors ease-in-out duration-200 border-2 px-8 py-1 rounded-sm cursor-pointer hover:border-primary hover:text-primary"
      >
        <NuxtLink :to="{ name: 'my-products-orders-and-payment-self' }"
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
const router = useRouter();

const currentPath = computed(() => route.path);
const isWithDelivery = computed(() => {
  return !/^\/my-products\/orders-and-payment(?!(\/self))+/i.test(
    currentPath.value
  );
});

const handleDeliveryTypeChange = () => {
  if (isWithDelivery.value) {
    router.push({ name: "my-products-orders-and-payment" });
  } else {
    router.push({ name: "my-products-orders-and-payment-self" });
  }
};

useHead({
  title: "Orders",
});

definePageMeta({
  validate: (route) => {
    const { role } = useAuth();
    if (role === "supplier") return true;
    else return false;
  },
});
</script> -->

<template>
  <main class="p-2">
    <h-empty
      v-if="!loading && !storeData.length"
      content="You Have No Store Associated"
    >
    </h-empty>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-5 mt-5 mb-16"
    >
      <card-store
        v-for="store in storeData"
        :key="store.id"
        :id="store.id"
        :storeName="store.name"
        :status="store.status"
        :products="store.total_product.total.count"
        :employee="store?.total?.employee?.value"
        :date="store.created_at.slice(0, 10)"
        :business="store.category"
        :bank="store.bank"
        @click="handleClickStore(store.id)"
      />
    </div>

    <div class="w-full h-8"></div>
  </main>
</template>
<script setup>
import fetchStoreQl from "@/apollo/query/product/realTime/fetchStore.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid, role, manager_id } = storeToRefs(useAuth());
const {
  result: storeResult,
  onError: storeError,
  loading,
} = useCustomQuery(fetchStoreQl, { supplier_id: uid.value });

console.log("ROLE", role.value, manager_id);

storeError((error) => {
  console.log(error);
});
const storeData = computed(() => {
  console.log(storeResult.value?.supplier.stores);

  return storeResult.value?.supplier.stores ?? [];
});

const handleClickStore = (value) => {
  useRouter().replace({
    name: "my-products-orders-and-payment-page-index-storeId-delivery-storeId",
    params: { storeId: value },
  });
};
</script>
