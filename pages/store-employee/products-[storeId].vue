<template>
  <div class="my-5 mb-16 md:m-8 m-2 md:mt-16 mt-16">
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
      <template #image>
        <img
          src="https://th.bing.com/th/id/R.432cb178751aebf76b9166cdc4723c78?rik=vahYnC5T2xe7WA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-UomRXLjNZIY%2fTrQDW38PwAI%2fAAAAAAAABQk%2f-_OjDXIr3Yw%2fs1600%2fempty_cart3.jpg&ehk=Vi62%2b1pKvxonVpsGH4dEM6KklKxnauYKJ4iuDHt%2b%2fGQ%3d&risl=&pid=ImgRaw&r=0"
          alt=""
          srcset=""
          class="w-[200px] h-[200px] object-cover object-center"
        />
      </template>
    </h-empty>
    <div v-else class="">
      <div v-for="product in products" :key="product.id" class="my-6">
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
    </div>

    <h-button
      v-if="role === 'store_manager' || role === 'supplier'"
      @click="addProduct"
      type="button"
      btn-name="add_product"
      class="w-fit fixed top-16 right-7"
      leading-icon="uil:instagram"
      :gradient="false"
      rounded-class="rounded-md"
      leading-icon-class="bg-primary"
      btn-class="overflow-hidden bg-darkblue text-light400"
      btn-name-class="px-2 font-bold"
    />
  </div>
</template>
<script setup lang="ts">
import deleteProducts from "@/apollo/mutation/product/realTime/deleteProduct.gql";
import fetchProducts from "@/apollo/query/product/realTime/fetchProducts.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~/store/auth";

const { role } = storeToRefs(useAuth());
const router = useRouter();
const route = useRoute();
const { storeId } = route.params as { storeId: number };
const { result, error, loading, refetch } = useCustomQuery(fetchProducts, {
  store_id: storeId,
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
    name: "store-employee-add-product-storeId",
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
      name: "store-employee-edit-product-productId",
      params: { productId: value.id },
    });
  } else if (value.action == "delete") {
    productToDeleteId.value = value.id;
    showConfirmationModal.value = true;
  }
};
definePageMeta({
  layout: "employee",
  middleware: "before-rul-entry",
});

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
