<template>
  <main class="p-2">
    <h-bread-crumb
      bread-crumb-class="bg-light50"
      home-icon-class="fill-dark300"
    />
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
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
      leading-icon="mdi:storefront-plus"
      :gradient="false"
      rounded-class="rounded-md"
      leading-icon-class="bg-primary"
      btn-class="overflow-hidden bg-darkblue text-light400"
      btn-name-class="px-2 font-bold"
      @click="addStore"
    />
  </main>
</template>
<script setup lang="ts">
import fetchStoreQl from "@/apollo/query/product/realTime/fetchStore.gql";
import fetchEmployeeStoreQl from "@/apollo/query/product/realTime/fetchEmployeeStore.gql";
import delete_store from "@/apollo/mutation/store/delete_store.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";
import useCustomMutation from "~~/composables/useCustomMutation";
import { ref } from "vue";

const { uid, role, manager_id } = storeToRefs(useAuth());
const employee = ref(role.value == "gust" || role.value == "store_manager");
const {
  result: storeResult,
  onError: storeError,
  loading,
  refetch,
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
const {
  mutate: deleteStore,
  onDone,
  onError,
} = useCustomMutation(delete_store);
onDone((data) => {
  refetch();
  showNotification(true, "Store Delete Successfull");
});
onError((error) => {
  showNotification(
    false,
    error.message.includes("foreign")
      ? "You can not delete this store as it is associated to products"
      : "error while deleting a store"
  );
});
const handleMenu = (value) => {
  if (value.action == "edit") {
    router.push({
      name: "my-products-edit_store-storeId",
      params: { storeId: value.id },
    });
  } else if (value.action == "delete") {
    deleteStore({ storeId: value.id });
  }
};
const handleClickStore = (value) => {
  useRouter().push({
    name: "my-products-index-realTime-storeId",
    params: { storeId: value },
  });
};
const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
</script>
