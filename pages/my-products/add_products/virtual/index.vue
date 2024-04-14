<template>
  <section
    class="flex flex-col min-h-[calc(100vh-3.7rem)] items-center justify-center min-w-full py-5"
  >
    <h-loading
      :show-loading="loading"
      loading-text="Adding A Product"
    ></h-loading>

    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h1 class="font-bold text-primary text-xl w-full my-2 text-center">
      {{ $t("add_virtual_product") }}
    </h1>
    <div class="max-w-7xl flex items-center justify-center w-full">
      <h-stepper
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'medias', value: $t('media') },
        ]"
        :validation-schema="dynamicSchema"
        @submit="submit"
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
            <div class="flex md:flex-row flex-col gap-x-6 gap-y-2 mb-10 px-5">
              <div class="group min-w-[350px]">
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
                  id="coverImage"
                  name="logo"
                />
              </div>
              <div class="group flex-1">
                <label
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  for="otherImage"
                >
                  {{ $t("other_medias") }} ({{ $t("optional") }})
                </label>
                <h-file-upload
                  :limit="5"
                  accept="image/*"
                  size="1 mb"
                  id="otherImage"
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
import addProduct from "@/apollo/mutation/product/virtual/addProduct.gql";
import fetchProductCategory from "@/apollo/query/product/virtual/fetchCategories.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid } = storeToRefs(useAuth());
const loading = ref(false);
const {
  mutate: addProductMutation,
  onError: addProductError,
  onDone: addProductResult,
} = useCustomMutation(addProduct);
addProductResult((result) => {
  loading.value = false;
  showNotification(true, "Product Add Successful");
  useRouter().replace({
    name: "my-products-index-virtual",
  });
});
addProductError((error) => {
  console.log(error);
  loading.value = false;

  console.log("Add Product Error", error);

  showNotification(false, "There Is An Error Adding A Product");
});

const { result, error } = useCustomQuery(fetchProductCategory);
const { locale } = useI18n();
const categorySelected = ref();
watch(locale, (newValue) => {
  if (categorySelected.value) {
    categorySelected.value = category.value.find(
      (cat: any) => cat.id == categorySelected.value.id
    );
  }
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
  return [];
});
const submit = async (value: any) => {
  loading.value = true;
  const { uploadImages } = useFirebaseClient();
  const { urls: productLogo, error: productError } = await uploadImages(
    value.logo,
    "images/products/realtime"
  );
  if (productError && !productLogo) {
    showNotification(false, "Error While Uploading Image");

    return;
  }
  let Images: any;
  if (value.other_medias) {
    const { urls: productMedia, error: productMediaError } = await uploadImages(
      value.other_medias,
      "images/products/realtime"
    );
    if (productMediaError) {
      console.log(productMediaError);
      showNotification(false, "Error While Uploading Image");

      return;
    }
    Images = productMedia?.map((item) => {
      return { url: item, type: "image" };
    });
  }
  addProductMutation({
    object: {
      title: value.product_name,
      category_id: value.category.id,
      unit_price: value.price,
      demo_link: value.demo_link,
      description: value.product_detail,
      supplier_id: uid.value,
      cover_image: productLogo ? productLogo[0] : "default Image",
      virtual_product_media: Images
        ? {
            data: Images,
          }
        : null,
    },
  });
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
