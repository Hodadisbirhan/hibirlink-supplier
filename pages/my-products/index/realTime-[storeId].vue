<template>
  <div class="my-5 mb-16">
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h-confirm-action
      v-if="showConfirmationModal"
      @confirmation="confirmationAction"
    />
    <h-empty
      v-if="!loading && !products.length"
      content="There is no product in this store"
    >
    </h-empty>
    <div v-else v-for="product in products" :key="product.id" class="my-6">
      <CardProduct
        :id="product.id"
        :title="product.title"
        :score="product.score"
        :images="product.images"
        :price="product.price"
        :status="product.status"
        :description="product.description"
        :quantity="product.amount"
        :product_by="product.product_by"
        @menu-selected="handleSelectedMenu"
      />
    </div>
    <h-button
      v-if="role === 'store_manager' || role === 'supplier'"
      @click="addProduct"
      type="button"
      btn-name="add_product"
      class="w-fit fixed bottom-20 right-7"
      leading-icon="mdi:package-variant-closed-plus"
      :gradient="false"
      rounded-class="rounded-md"
      leading-icon-class="bg-primary"
      btn-class="overflow-hidden bg-darkblue text-light400"
      btn-name-class="px-2 font-bold"
    />
  </div>
</template>
<script setup lang="ts">
import fetchProducts from "@/apollo/query/product/realTime/fetchProducts.gql";
import deleteProducts from "@/apollo/mutation/product/realTime/deleteProduct.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~/store/auth";

const { role } = storeToRefs(useAuth());
const router = useRouter();
const route = useRoute();
const { storeId } = route.params as { storeId: number };
const { result, error, loading, refetch } = useCustomQuery(fetchProducts, {
  store_id: storeId,
});
watchEffect(() => {
  console.log("error", error.value);
  console.log("value", result.value);
});
const products = computed(() => {
  const data = result.value?.store.products;
  if (data) {
    return data.map((element: any) => {
      var imageData = [];
      imageData.push({ type: "image", url: element.cover_image });
      var description = "";

      element.description?.ops?.map((txt: any) => {
        description += txt.insert + " ";
      });
      if (element.images) {
        element?.images?.map((img: any) => {
          imageData.push({ type: "image", url: img.url });
        });
      }
      return {
        id: element.id,
        title: element.title,
        score: element.total_rate.rate.avg.rate,
        images: imageData,
        price: element.unit_price,
        status: element.status,
        amount: element.quantity,
        description: description,
        product_by: element.user
          ? element.user?.first_name + " " + element.user?.last_name
          : null,
      };
    });
  }
  return [];
});
const addProduct = () => {
  router.push({
    name: "my-products-add_products-realTime-storeId",
    params: { storeId },
  });
};
interface Option {
  id: number;
  action: string;
}

const handleSelectedMenu = (value: Option) => {
  if (value.action == "edit") {
    router.push({
      name: "my-products-edit_product-realTime-productId",
      params: { productId: value.id },
    });
  } else if (value.action == "delete") {
    productToDeleteId.value = value.id;
    showConfirmationModal.value = true;
  }
};

const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
const {
  mutate: deleteProduct,
  onDone: onDeleteComplete,
  onError: onDeleteError,
} = useCustomMutation(deleteProducts);
onDeleteComplete((res) => {
  refetch();
  productToDeleteId.value = null;
  showNotification(true, "Product Delete Success");
});

onDeleteError((error) => {
  console.log(error);
  productToDeleteId.value = null;
  showNotification(
    false,
    error.message.includes("foreign")
      ? "U cant delete this product as it is occupied"
      : "Product Delete Error"
  );
});
const productToDeleteId = ref();
const showConfirmationModal = ref(false);
const confirmationAction = (response: any) => {
  showConfirmationModal.value = false;
  if (response.accept) {
    deleteProduct({ product_id: productToDeleteId.value });
  } else {
    productToDeleteId.value = null;
  }
};
</script>
