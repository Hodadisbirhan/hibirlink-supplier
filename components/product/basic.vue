<template>
  <div v-if="categoryList">
    <div
      class="grid flex-1 grid-cols-1 justify-center md:grid-cols-2 gap-x-6 gap-y-2 mt-10 px-5">
      <h-text-field
        name="product_name"
        label="product_name"
        :placeholder="$t('product_name')" />
      <div class="flex justify-center items-center gap-3 w-full">
        <h-select
          class="flex-1"
          :items="categoryList"
          name="category"
          label="category"
          v-model:model-value="categorySelected" />
        <h-select
          class="flex-1"
          :items="subCategoryList"
          name="sub_category"
          label="sub_category"
          v-model:model-value="subCategorySelected" />
      </div>
      <h-text-field
        class="flex-1"
        name="price"
        label="price"
        type="number"
        :placeholder="$t('price')" />

      <h-text-field
        class="flex-1"
        name="discount"
        type="number"
        label="discount-optional"
        :placeholder="$t('discount')" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mx-5 mt-2">
      <div class="flex gap-y-2 flex-col">
        <h-select
          class="flex-1"
          :items="statusList"
          name="status"
          label="status" />
        <h-text-field
          class="flex-1"
          name="amount"
          label="amount"
          type="number"
          :placeholder="$t('amount')" />
        <h-text-field
          class="flex-1"
          name="minimum"
          label="minimum"
          type="number"
          :placeholder="$t('minimum')" />
      </div>
      <div class="flex flex-col w-full mt-1">
        <h-rich-text
          label="product_detail"
          toolbar="minimal"
          name="product_detail"
          rules="required" />
      </div>
    </div>
    <slot name="coverImage"></slot>
  </div>
</template>
<script setup lang="ts">
import { useField } from "vee-validate";
const props = defineProps({
  category: { type: Object, required: true },
  status: { type: Object, required: true },
  categoryId: { type: Number, required: false },
  subCategoryId: { type: Number, required: false },
});

const { value: subCategoryValue } = useField("sub_category");
const { value: categoryValue } = useField("category");
const { locale } = useI18n();

const subCategoryList = ref([]);
const statusList = computed(() => {
  return props?.status?.map((st: any) => {
    return st.state ?? [];
  });
});

const categoryList = computed(() => {
  return props?.category?.map((cat: any) => {
    const subCategory = cat?.sub_category?.map((sub: any) => {
      const subCatLanguage = sub?.original_language?.translation_contents;

      return {
        id: sub?.id,
        name: subCatLanguage?.find(
          (subCat: any) => subCat?.language_type == locale.value
        )?.name,
      };
    });

    const catLanguage = cat.original_language.translation_contents;

    return {
      id: cat.id,
      name: catLanguage.find((lng: any) => lng.language_type == locale.value)
        .name,
      sub_category: subCategory,
    };
  });
});

const categorySelected = ref(
  props.categoryId && !categoryValue.value
    ? categoryList.value?.find((list: any) => list?.id == props?.categoryId)
    : categoryValue.value
);
if (props.categoryId) {
  subCategoryList.value = categorySelected.value?.sub_category;
}
const subCategorySelected = ref(
  props.subCategoryId && !subCategoryValue.value
    ? categorySelected.value?.sub_category.find(
        (list: any) => list?.id == props.subCategoryId
      )
    : subCategoryValue.value
);
watch(categorySelected, (newCategory, oldCategory) => {
  if (newCategory?.id != oldCategory?.id && newCategory.id) {
    subCategoryValue.value = "";
    subCategoryList.value = categorySelected.value?.sub_category;
  }
});

watch(locale, (newValue) => {
  if (categorySelected.value) {
    categorySelected.value = categoryList.value?.find((list: any) => {
      return list?.id == categorySelected.value?.id;
    });
  }
  if (subCategorySelected.value) {
    subCategorySelected.value = categorySelected.value?.sub_category?.find(
      (list: any) => list?.id == subCategorySelected.value?.id
    );
  }
});
</script>
