<template>
  <section
    class="flex flex-col min-h-[calc(100vh-3.7rem)] items-center justify-center min-w-full py-5"
    v-if="productData"
  >
    <h-loading
      :show-loading="isLoading"
      loading-text="Adding A Product"
    ></h-loading>

    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h1 class="font-bold text-primary text-xl w-full my-2 text-center">
      {{ $t("add_realtime_product") }}
    </h1>
    <div class="max-w-7xl flex items-center justify-center w-full">
      <h-stepper
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'medias', value: $t('media') },
        ]"
        :is-loading="isLoading"
        @submit="submit"
        :validation-schema="dynamicSchema"
        :initial-value="productData"
        :isForAdd="false"
        class="w-full"
        line-class="lg:w-[20rem] min-w-[6rem] md:w-[15rem] xs:w-[10rem]"
      >
        <template #basics="{ state, index }">
          <template v-if="state == index">
            <div
              class="grid flex-1 grid-cols-1 justify-center md:grid-cols-2 gap-x-6 gap-y-2 mt-5 mb-20 px-5"
            >
              <h-text-field
                name="product_name"
                label="product_name"
                :placeholder="$t('product_name')"
              />
              <div class="flex justify-center items-center gap-3 w-full">
                <h-select
                  class="flex-1"
                  :items="category"
                  name="category"
                  label="category"
                  v-model="categorySelected"
                />
              </div>
              <h-text-field
                class="flex-1"
                name="price"
                label="price"
                type="number"
                :placeholder="$t('price')"
              />
              <h-text-field
                name="demo_link"
                label="demo_link"
                placeholder="http://"
              />

              <div class="group max-w-[350px]">
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
              <div class="flex flex-col w-full mt-1">
                <h-rich-text
                  label="product_detail"
                  toolbar="minimal"
                  name="product_detail"
                  rules="required"
                />
              </div>
            </div> </template
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
                  @exceed:limit="exceedLimit"
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
import fetchSingleProduct from "@/apollo/query/product/virtual/fetchSingleProduct.gql";
import deleteImage from "@/apollo/mutation/product/virtual/deleteProductImage.gql";
import updateBasic from "@/apollo/mutation/product/virtual/updateBasicProduct.gql";
import addImage from "@/apollo/mutation/product/virtual/addImage.gql";
import fetchProductCategory from "@/apollo/query/product/virtual/fetchCategories.gql";
import { useField } from "vee-validate";
import { useAuth } from "~/store/auth";
const { productId } = useRoute().params as { productId: number };

const isLoading = ref(false);
const images = ref();
const clearImage = ref(false);
const {
  result: fetchProductData,
  error: fetchProductDataError,
  fetchMore,
} = useCustomQuery(fetchSingleProduct, { product_id: productId });

const {
  mutate: updateBasicProduct,
  onError: onUpdateBasicProductError,
  onDone: onUpdateBasicProduct,
} = useCustomMutation(updateBasic);
onUpdateBasicProductError((error) => {
  isLoading.value = false;
  console.log(error);

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

const { result, error } = useCustomQuery(fetchProductCategory);
const { locale } = useI18n();
const { value: categoryValue } = useField("category", "required");
const categoryId = ref();
const categorySelected = ref();

watch(locale, (newValue) => {
  if (categorySelected.value) {
    categorySelected.value = category.value.find(
      (cat: any) => cat.id == categorySelected.value.id
    );
  }
});
const exceedLimit = (msg: any) => {
  showNotification(
    false,
    "allowed image to upload is " + (msg - images.value.length)
  );
};
const productData = computed(() => {
  if (fetchProductData.value) {
    const data = fetchProductData.value.product;
    images.value = null;
    console.log(images.value);
    if (data.images) {
      images.value = data.images.map((img: any) => {
        return { id: img.id, url: img.url };
      });
    }
    console.log(images.value);

    categoryId.value = data.category_id;
    return {
      product_name: data.title,
      price: data.unit_price,
      logo: data.cover_image,
      demo_link: data.demo_link,
      product_detail: JSON.parse(JSON.stringify(data.description)),
    };
  }
  return null;
});

const category = computed(() => {
  const data = result.value?.category ?? [];
  if (data.length) {
    return data.map((cat: any) => {
      const name = cat.original_language.translation_contents.find(
        (lng: any) => lng.language_type == locale.value
      ).name;
      return { id: cat.id, name };
    });
  }
  return data;
});
watch(category, (newValue) => {
  if (!categoryValue.value && newValue.length && categoryId.value) {
    categorySelected.value = category.value.find(
      (cat: any) => cat.id == categoryId.value
    );
  }
});
const submit = async (value: any, state: number) => {
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
      product_id: productId,
      set: {
        category_id: value.category.id,
        title: value.product_name,
        demo_link: value.demo_link,
        description: value.description,
        unit_price: value.price,
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
    price: "price",
    product_detail: "required",
  },
  {
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
</script>
