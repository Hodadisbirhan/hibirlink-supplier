<template>
  <main class="p-2">
    <div class="flex justify-between">
      <p class="py-3 text-primary font-bold text-xl px-2">
        Select Store To See Their Products
      </p>
    </div>
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
      class="md:m-8 m-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-6 gap-y-5 mt-5 mb-16"
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
        role="employee"
        @click="handleClickStore(store.id)"
      />
    </div>

    <div class="w-full h-8"></div>
  </main>
</template>
<script setup>
import fetchEmployeeStoreQl from "@/apollo/query/product/realTime/fetchEmployeeStore.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid, role, manager_id } = storeToRefs(useAuth());
const {
  result: storeResult,
  onError: storeError,
  loading,
} = useCustomQuery(fetchEmployeeStoreQl, {
  user_id: uid.value,
  manager_id: manager_id.value,
});

console.log("ROLE", role.value, manager_id);

storeError((error) => {
  console.log(error);
});
const storeData = computed(() => {
  console.log(storeResult.value?.store);

  return storeResult.value?.store ?? [];
});
watchEffect(() => {
  console.log("DATA", storeData.value);
});
const router = useRouter();

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
    name: "store-employee-products-storeId",
    params: { storeId: value },
  });
};

useHead({
  title: "Products",
});

definePageMeta({
  layout: "employee",
  middleware: "before-rul-entry",
});
</script>
