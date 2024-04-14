<!-- <template>
  <main class="p-2">
   
    <h-empty
      v-if="!loading && !storeData.length"
      content="You Have No Store Associated"
    >
      <template #image>
        <img
          src="https://th.bing.com/th/id/R.432cb178751aebf76b9166cdc4723c78?rik=vahYnC5T2xe7WA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-UomRXLjNZIY%2fTrQDW38PwAI%2fAAAAAAAABQk%2f-_OjDXIr3Yw%2fs1600%2fempty_cart3.jpg&ehk=Vi62%2b1pKvxonVpsGH4dEM6KklKxnauYKJ4iuDHt%2b%2fGQ%3d&risl=&pid=ImgRaw&r=0"
          alt=""
          srcset=""
          class="w-[200px] h-[200px] object-cover object-center"
        />
      </template>
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
        @menu-selected="handleMenu"
        @click="handleClickStore(store.id)"
      />
    </div>

    <div class="w-full h-8"></div>
    <h-button
      v-if="role === 'supplier'"
      btn-name="add_store"
      type="button"
      class="w-fit fixed bottom-20 right-7"
      leading-icon="uil:instagram"
      :gradient="false"
      rounded-class="rounded-md"
      leading-icon-class="bg-primary"
      btn-class="overflow-hidden bg-darkblue text-light400"
      btn-name-class="px-2 font-bold"
      @click="addStore"
    />
  </main>
</template>
<script setup>
import fetchStoreQl from "@/apollo/query/product/realTime/fetchStore.gql";
import fetchEmployeeStoreQl from "@/apollo/query/product/realTime/fetchEmployeeStore.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid, role, manager_id } = storeToRefs(useAuth());
const employee = ref(role.value == "gust" || role.value == "store_manager");
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

const stores = ref([]);
const router = useRouter();
const addStore = () => {
  router.push({ name: "my-products-add_store" });
};

const handleMenu = (value) => {
  if (value.action == "edit") {
    router.push({
      name: "my-products-edit_store-storeId",
      params: { storeId: value.id },
    });
  } else if (value.action == "delete") {
  }
};
const handleClickStore = (value) => {
  useRouter().push({
    name: "my-products-index-realTime-storeId",
    params: { storeId: value },
  });
};
</script> -->

<template>
  <main class="w-full h-full max-w-[90rem] mx-auto">
    <div class="flex gap-2 w-full justify-center md:gap-5 items-center mt-2">
      <div
        :class="
          currentPath.includes('delivery') ? 'text-primary border-primary'
            : 'text-neutral-600 border-neutral-500'
        "
        class="font-semibold transition-colors ease-in-out duration-200 border-2 px-8 py-1 rounded-sm cursor-pointer hover:border-primary hover:text-primary"
      >
        <NuxtLink
          :to="{
            name: 'my-products-orders-and-payment-page-index-storeId-delivery-storeId',
            params: { storeId },
          }"
        >
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
          currentPath.includes('self')
            ? 'text-primary border-primary'
            : 'text-neutral-600 border-neutral-500'
        "
        class="font-semibold transition-colors ease-in-out duration-200 border-2 px-8 py-1 rounded-sm cursor-pointer hover:border-primary hover:text-primary"
      >
        <NuxtLink :to="{ name: 'my-products-orders-and-payment-page-index-storeId-self-storeId',params:{storeId} }"
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
  return currentPath.value.includes("self")
});

const handleDeliveryTypeChange = () => {
  if (isWithDelivery.value) {
    router.replace({ name: "my-products-orders-and-payment-page-index-storeId-delivery-storeId",params:{storeId:storeId.value} });
  } else {
    router.replace({ name: "my-products-orders-and-payment-page-index-storeId-self-storeId",params:{storeId:storeId.value} });
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
</script>
