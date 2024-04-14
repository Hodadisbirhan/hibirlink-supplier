<template>
  <section
    class="flex flex-col min-h-[calc(100vh-3.7rem)] items-center justify-center min-w-full py-5"
    v-if="productData && category.length"
  >
    <h-loading
      :show-loading="isLoading"
      loading-text="Updating A Product"
    ></h-loading>
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h1 class="font-bold text-primary text-xl w-full my-2 text-center">
      Add RealTime Product
    </h1>
    <div class="max-w-7xl flex items-center justify-center w-full">
      <h-stepper
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'medias', value: $t('media') },
        ]"
        :validation-schema="dynamicSchema"
        @submit="submit"
        :initial-value="productData"
        :isForAdd="false"
        class="w-full"
        line-class="lg:w-[20rem] min-w-[6rem] md:w-[15rem] xs:w-[10rem]"
      >
        <template #basics="{ state, index }">
          <template v-if="state == index">
            <product-basic
              :category="category"
              :status="status"
              :categoryId="categoryId"
              :subCategoryId="subCategoryId"
            >
              <template #coverImage>
                <div class="group max-w-[300px] ml-5">
                  <label
                    class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                    for="coverImage"
                  >
                    {{ $t("brand") }}
                  </label>
                  <h-file-upload
                    :limit="1"
                    accept="image/*"
                    size="1 mb"
                    type="image"
                    id="coverImage"
                    name="logo"
                  />
                </div>
              </template>
            </product-basic> </template
        ></template>
        <template #medias="{ state, index }">
          <template v-if="state == index">
            <div
              class="flex flex-col justify-center items-center w-full gap-y-6"
            >
              <h-image-editor
                :image="images"
                :mutate-gql="deleteImage"
                v-if="images?.length"
                @notify-image-delete="onImageDelete"
              />

              <div class="group flex-1 w-full max-w-5xl mb-5">
                <label
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  for="otherImage"
                >
                  {{ $t("other_medias") }} ({{ $t("optional") }})
                </label>
                <h-file-upload
                  :limit="5 - images?.length ?? 0"
                  accept="image/*"
                  size="1 mb"
                  type="image"
                  id="otherImage"
                  :is-cleared="clearImage"
                  name="other_medias"
                />
              </div>
            </div>
          </template>
        </template>
      </h-stepper>
    </div>
  </section>
</template>
<script setup lang="ts">
import fetchSingleProduct from "@/apollo/query/product/realTime/fetchSingleProduct.gql";
import deleteImage from "@/apollo/mutation/product/realTime/deleteProductImage.gql";
import updateBasic from "@/apollo/mutation/product/realTime/updateBasicProduct.gql";
import addImage from "@/apollo/mutation/product/realTime/addImage.gql";
import fetchProductCategory from "@/apollo/query/product/realTime/fetchCategories.gql";
import { useAuth } from "~/store/auth";
const { uid } = useAuth();
const { result, error } = useCustomQuery(fetchProductCategory);
watchEffect(() => {
  console.log("CATerror", error);
});
const status = ref();
const categoryId = ref();
const subCategoryId = ref();
const category = computed(() => {
  status.value = result.value?.product_status ?? [];
  return result.value?.category ?? [];
});
const clearImage = ref(false);
const { productId } = useRoute().params as {
  productId: number;
  storeId: number;
};
const isLoading = ref(false);
const {
  result: fetchProductData,
  onError: fetchProductDataError,
  fetchMore,
} = useCustomQuery(fetchSingleProduct, { product_id: productId });
fetchProductDataError((error) => {
  console.log("ERROR", error);
});

const {
  mutate: updateBasicProduct,
  onError: onUpdateBasicProductError,
  onDone: onUpdateBasicProduct,
} = useCustomMutation(updateBasic);
onUpdateBasicProductError((error) => {
  console.log(error);

  isLoading.value = false;
  showNotification(false, "Error Occurred While Updating A Product");
});
onUpdateBasicProduct((result) => {
  isLoading.value = false;
  showNotification(true, "Update Successful");
});
const {
  mutate: addProductImage,
  onError: onAddProductImageError,
  onDone: onAddProductImage,
} = useCustomMutation(addImage);
onAddProductImageError((error) => {
  isLoading.value = false;
  console.log(error);

  showNotification(false, "Error Occurred While Updating A Product");
});
onAddProductImage((result) => {
  fetchMore({ product_id: productId } as any);
  clearImage.value = true;
  isLoading.value = false;
  showNotification(true, "Update Successful");
});
var images = ref();
const productData = computed(() => {
  if (fetchProductData.value) {
    const data = fetchProductData.value.product;
    images.value = null;
    if (data.images) {
      images.value = data.images.map((img: any) => {
        return { id: img.id, url: img.url };
      });
    }
    subCategoryId.value = data.sub_category.id;
    categoryId.value = data.sub_category.category.id;
    return {
      product_name: data.title,
      price: data.unit_price,
      status: data.status,
      amount: data.quantity,
      minimum: data.min_order,
      logo: data.cover_image,
      discount: data.discount ? data.discount : null,
      product_detail: JSON.parse(JSON.stringify(data.description)),
    };
  }
  return null;
});

const submit = async (value: any, state: number) => {
  console.log(value);

  isLoading.value = true;
  if (state == 0) {
    let image: any;
    const { uploadImages } = useFirebaseClient();
    if (typeof value.logo == "string") {
      image = value.logo;
    } else {
      const { urls, error } = await uploadImages(
        value.logo,
        "images/products/realtime"
      );
      if (error) {
        console.log(error);

        isLoading.value = false;
        showNotification(false, "Image Upload Error");
        return;
      } else if (urls) {
        image = urls[0];
      }
    }

    updateBasicProduct({
      id: productId,

      set: {
        cover_image: image,
        title: value.product_name,
        description: value.product_detail,
        min_order: value.minimum,
        unit_price: value.price,
        discount: value.discount ?? 0,
        sub_category_id: value.sub_category.id,
        quantity: value.amount,
        employer_id: uid,
      },
    });
  }
  if (state == 1) {
    if (value.other_medias) {
      const { uploadImages } = useFirebaseClient();
      const { urls, error } = await uploadImages(
        value.other_medias,
        "images/products/realtime"
      );

      if (error) {
        isLoading.value = false;
        showNotification(false, "Error While Uploading Image");
        return;
      } else if (urls) {
        const images = urls.map((url) => {
          return { url: url, product_id: productId, type: "image" };
        });
        addProductImage({ object: images });
      }
    }
  }
};
const onImageDelete = () => {
  fetchMore({ product_id: productId } as any);
  clearImage.value = true;
};
const dynamicSchema = [
  {
    product_name: "required",
    category: "required",
    sub_category: "required",
    price: "price",
    status: "required",
    amount: "amount",
    minimum: "minOrder",
    discount: "discount:price",
    product_detail: "required",
    logo: "required",
  },
];

const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};

definePageMeta({
  validate: (route) => {
    const { role } = useAuth();
    if (role === "supplier" || role === "store_manager") return true;
    else return false;
  },
});
definePageMeta({
  layout: "employee",
  middleware: "before-rul-entry",
});
</script>
