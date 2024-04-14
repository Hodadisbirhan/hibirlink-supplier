<template>
  <div class="m-8">
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>

    <div
      v-if="showProductsDialog"
      class="fixed w-full h-full flex items-center justify-center left-0 top-0 bg-black/20 z-50"
    >
      <div
        class="bg-light400 max-h-[500px] rounded-md p-5 mx-4 relative overflow-x-scroll"
      >
        <Icon
          name="ion:close-outline"
          class="w-8 h-8 absolute right-3 top-1 cursor-pointer"
          @click="closeProductDialog"
        />
        <h-table
          class="mt-5"
          :item-i-d="productId"
          :headers="header"
          :body="body"
          :is-checked="true"
          @select:row="checkedProducts"
          header-class="bg-darkblue text-light300 py-2 rounded-sm px-1 border-b"
          body-class="py-3 border-b border-neutral500 px-1 font-bold text-neutral100"
        >
          <template #product_name="{ item }">
            {{ item.product_name }}
          </template>
          <template #store_name="{ item }">
            {{ item.store_name }}
          </template>
          <template #price="{ item }">
            {{ item.price }}
          </template>
          <template #special_discount="{ item }">
            {{ item.special_discount }}
          </template>
          <template #net_price="{ item }">
            {{ item.net_price }}
          </template>
        </h-table>
        <h-button
          @click="updateDiscount"
          type="button"
          btn-name="update"
          class="w-fit mb-4 ml-auto mt-10"
          :gradient="false"
          rounded-class="rounded-md"
          leading-icon-class="bg-primary"
          btn-class="overflow-hidden bg-darkblue text-light400"
          btn-name-class="px-2 font-bold"
        />
      </div>
    </div>

    <div
      v-if="showDiscountProductsDialog"
      class="fixed w-full h-full flex items-center justify-center left-0 top-0 bg-black/20 z-50"
    >
      <div
        class="bg-light400 max-h-[500px] rounded-md p-5 mx-4 relative overflow-x-scroll"
      >
        <Icon
          name="ion:close-outline"
          class="w-8 h-8 absolute right-3 top-1 cursor-pointer"
          @click="closeProductDialog"
        />
        <h-table
          class="mt-5"
          :item-i-d="productId"
          :headers="header"
          :body="body"
          :is-checked="true"
          @select:row="checkedProducts"
          header-class="bg-darkblue text-light300 py-2 rounded-sm px-1 border-b"
          body-class="py-3 border-b border-neutral500 px-1 font-bold text-neutral100"
        >
          <template #product_name="{ item }">
            {{ item.product_name }}
          </template>
          <template #store_name="{ item }">
            {{ item.store_name }}
          </template>
          <template #price="{ item }">
            {{ item.price }}
          </template>
          <template #special_discount="{ item }">
            {{ item.special_discount }}
          </template>
          <template #net_price="{ item }">
            {{ item.net_price }}
          </template>
        </h-table>
        <h-button
          v-if="role === 'store_manager' || role === 'supplier'"
          @click="removeProductFormDiscount"
          type="button"
          btn-name="Remove"
          class="w-fit mb-4 ml-auto mt-10"
          :gradient="false"
          rounded-class="rounded-md"
          leading-icon-class="bg-primary"
          btn-class="overflow-hidden bg-darkblue text-light400"
          btn-name-class="px-2 font-bold"
        />
      </div>
    </div>

    <div class="flex justify-between">
      <p class="py-3 text-primary font-bold text-xl">Discounts</p>
    </div>

    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 text-neutral300"
    >
      <div
        v-for="(discount, index) in discounts"
        :key="index"
        class="rounded-lg relative px-5 py-8 bg-light400 shadow-sm text-sm flex flex-col items-center justify-center"
      >
        <div class="flex gap-2 items-center justify-center">
          <Icon
            name="arcticons:cdiscount"
            class="w-14 h-12 rotate-90 text-primary"
          />
          <div>
            <p class="text-2xl font-bold text-primary">{{ discount.rate }}%</p>
            <p class="mb-2 text-sm">Discount</p>
          </div>
        </div>
        <p class="my-2 text-center text-xs">
          Total of
          <span
            @click="showDiscountedProducts(discount.id)"
            class="text-sm font-semibold text-primary cursor-pointer"
            >{{ discount.total.product.count }} Products</span
          >
        </p>
        <hr class="my-2 h-2 w-full" />
        <div class="mb-auto text-center">
          <p class="text-xs font-semibold flex gap-1">
            <Icon name="ri:calendar-2-line" class="text-md text-primaryvar2" />
            {{ discount.start_date }} -
            {{ discount.end_date }}
          </p>

          <p class="my-2 text-center mb-6">
            {{ discount.reason }}
          </p>
        </div>
        <span
          v-if="discount?.end_date < currentDate"
          class="text-xs font-semibold bg-red/50 text-light200 rounded-xl px-2"
          >Expired
        </span>

        <div
          v-if="discount?.end_date >= currentDate"
          class="py-1 px-4 border-2 absolute bottom-4 mx-auto border-primaryvar1 text-primaryvar1 rounded-md hover:bg-primaryvar1 hover:text-light400 cursor-pointer"
          @click="showProductsDialogPopUp(discount.id)"
        >
          Assign
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import fetchProducts from "@/apollo/query/product/realTime/fetchProductsForDiscount.gql";
import fetchDiscount from "@/apollo/query/product/realtime/fetchDiscounts.gql";
import addSpecialDiscount from "@/apollo/mutation/product/realTime/addSpecialDiscount.gql";
import fetchDiscountedProducts from "@/apollo/query/product/realTime/fetchDiscountedProducts.gql";
import removeProductDiscount from "@/apollo/mutation/product/realTime/removeDiscountFromProduct.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";
const { uid, role, manager_id } = storeToRefs(useAuth());
const { result, fetchMore } = useCustomQuery(fetchDiscount, {
  supplier_id: manager_id.value,
});

const productQueryEnable = ref(false);
const discountProductQueryEnable = ref(false);

const variable = computed(() => {
  return {
    supplier_id: manager_id.value,
    discount_id: discountId.value,
  };
});

let currentDate: any = Date.now();
currentDate = new Date(currentDate).toJSON().slice(0, 10);

console.log(currentDate);
const discountId = ref(-1);
const {
  onError: onProductError,
  refetch: refetchProduct,
  onResult: oFetchProductResult,
} = useCustomQuery(fetchProducts, variable, 0, productQueryEnable);

const {
  onError: onDiscountProductError,
  onResult: oFetchDiscountProductResult,
} = useCustomQuery(
  fetchDiscountedProducts,
  variable,
  0,
  discountProductQueryEnable
);

const selectedProductsForDiscount = ref();
const checkedProducts = (value: any) => {
  selectedProductsForDiscount.value = null;
  selectedProductsForDiscount.value = value;
};
const productId = ref<number[]>([]);

const discounts = computed(() => {
  return result.value?.supplier?.discount ?? [];
});

const {
  mutate: removeProductDiscountMutation,
  onDone: onRemoveProductDiscountMutationResult,
  onError: onRemoveProductDiscountMutationError,
} = useCustomMutation(removeProductDiscount);
const {
  mutate: addSpecialDiscountMutation,
  onDone: onAddSpecialDiscountResult,
  onError: onAddSpecialDiscountError,
} = useCustomMutation(addSpecialDiscount);

onAddSpecialDiscountResult((result) => {
  showNotification(true, "Special Discount Add Successful");
  fetchMore({ supplier_id: uid.value } as any);
  showProductsDialog.value = false;
  refetchProduct();
});
onAddSpecialDiscountError((error) => {
  showNotification(false, "Error While Special Discount Add");
  console.log(error);
});

onRemoveProductDiscountMutationResult((result) => {
  showNotification(true, "Product Discount Remove Successful");
  fetchMore({ supplier_id: uid.value } as any);
  showDiscountProductsDialog.value = false;
});
onRemoveProductDiscountMutationError((error) => {
  console.log(error);

  showNotification(false, "Error While Discount Remove");
});
const showAddDiscountDialog = ref(false);
const showProductsDialog = ref(false);
const showDiscountProductsDialog = ref(false);

const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};

const header = [
  "product_name",
  "store_name",
  "price",
  "special_discount",
  "net_price",
];

const showProductsDialogPopUp = (id: number) => {
  discountId.value = id;
  productQueryEnable.value = true;

  showProductsDialog.value = true;
};

const showDiscountedProducts = (id: number) => {
  discountId.value = id;
  discountProductQueryEnable.value = true;

  showDiscountProductsDialog.value = true;
};
const closeProductDialog = () => {
  showProductsDialog.value = false;
  showDiscountProductsDialog.value = false;
  productQueryEnable.value = false;
  discountProductQueryEnable.value = false;
};
const body = ref([]);
oFetchProductResult((result) => {
  const data = result?.data?.products ?? [];

  productId.value = [];
  body.value = [];
  if (data.length) {
    body.value = data.map((prodData: any) => {
      productId.value.push(prodData.id);
      return {
        id: prodData.id,
        product_name: prodData.title,
        store_name: prodData.store.name,
        price: prodData.unit_price + "ETB",
        special_discount: prodData.special_discount
          ? prodData.special_discount.rate + " %"
          : " - ",
        net_price: prodData.special_discount
          ? (
              prodData.unit_price -
              (prodData.special_discount.rate / 100) * prodData.unit_price
            ).toFixed(2) + " ETB"
          : prodData.unit_price + " ETB",
      };
    });
  }

  productQueryEnable.value = false;
});

oFetchDiscountProductResult((result) => {
  const data = result?.data?.products ?? [];

  productId.value = [];
  body.value = [];
  if (data.length) {
    body.value = data.map((prodData: any) => {
      productId.value.push(prodData.id);
      return {
        id: prodData.id,
        product_name: prodData.title,
        store_name: prodData.store.name,
        price: prodData.unit_price + "ETB",
        special_discount: prodData.special_discount
          ? prodData.special_discount.rate + " %"
          : " - ",
        net_price: prodData.special_discount
          ? (
              prodData.unit_price -
              (prodData.special_discount.rate / 100) * prodData.unit_price
            ).toFixed(2) + " ETB"
          : prodData.unit_price + " ETB",
      };
    });
  }

  discountProductQueryEnable.value = false;
});
onProductError((error) => {
  console.log(error);

  productQueryEnable.value = false;
});
onDiscountProductError((error) => {
  console.log(error);

  discountProductQueryEnable.value = false;
});

const updateDiscount = () => {
  if (discountId.value && selectedProductsForDiscount.value)
    addSpecialDiscountMutation({
      supplier_id: uid.value,
      ids: selectedProductsForDiscount.value,
      discount_id: discountId.value,
    });
};

const removeProductFormDiscount = () => {
  if (discountId.value && selectedProductsForDiscount.value)
    removeProductDiscountMutation({
      product_id: selectedProductsForDiscount.value,
    });
};
useHead({
  title: "Discount",
});

definePageMeta({
  layout: "employee",
  middleware: "before-rul-entry",
});
</script>
