<template>
  <div
    v-if="order"
    :class="[showBottomSheet ? 'top-[3.5rem]' : 'top-full']"
    class="flex-1 lg:drop-shadow-none drop-shadow-2xl lg:min-w-[calc(100%-25rem)] lg:overflow-y-hidden overflow-y-auto flex lg:static fixed lg:z-0 z-40 left-0 right-0 bottom-0 flex-col gap-6 bg-light400 lg:bg-opacity-50 lg:rounded rounded-2xl p-4 transition-all ease-in-out duration-500"
  >
    <div
      class="lg:hidden flex items-center justify-between sticky top-0 w-full left-2 right-2"
    >
      <h3 class="font-bold text-lg text-neutral300">{{ order?.orderId }}</h3>
      <Icon
        name="solar:close-circle-bold-duotone"
        @click="
          () => {
            $emit('update:showBottomSheet', false);
          }
        "
        class="w-8 h-8 text-neutral300 cursor-pointer hover:text-red"
      />
    </div>
    <div class="flex 2xl:flex-row flex-col items-start gap-6">
      <div aria-label="qr-code" v-if="orderType == OrderType.PENDING">
        <QrcodeVue
          :value="store_name + '%$#@$%' + qr_code_value"
          :size="200"
          level="H"
        />
      </div>

      <div class="flex-1 flex flex-col gap-8">
        <div
          class="grid xl:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 grid-cols-1 items-center gap-x-8 gap-y-4 flex-wrap"
        >
          <p
            class="space-x-1 text-dark200"
            v-for="data in detailData"
            :key="data.key"
          >
            <Icon name="ic:twotone-playlist-add-check-circle" />
            <span class="font-bold">{{ data.key }}:</span>
            {{ data.value || "-" }}
          </p>
        </div>
        <p class="w-full bg-light300 h-fit p-2 rounded border-l-8 border-red">
          {{ $t("order_notice_message") }}
        </p>
      </div>
    </div>

    <div class="flex flex-col h-full">
      <div class="flex items-center gap-2">
        <h1 class="font-bold text-lg text-neutral300">
          {{ $t("order_detail") }}
        </h1>
        <hr class="flex-1 border-[1.5px] rounded-full border-light200" />
      </div>
      <h-table
        :headers="header"
        :body="body"
        header-class="bg-light400 text-neutral200 py-2 border-b"
        body-class="py-3 border-b-2  border-light300 border-opacity-100 font-bold text-neutral300"
      >
        <template #id="{ item }">
          {{ item.id }}
        </template>
        <template #product_name="{ item }">
          {{ item.product_name }}
        </template>
        <template #unit_price="{ item }">
          {{ item.unit_price }}
        </template>
        <template #quantity="{ item }">
          {{ item.quantity }}
        </template>
        <template #discount="{ item }">
          {{ item.discount }}
        </template>
        <template #special_discount_rate(%)="{ item }">
          {{ item.special_discount_rate }}
        </template>
      </h-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
enum OrderType {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  PICKED = "PICKED",
  DELIVERED = "DELIVERED",
}
interface Input {
  showBottomSheet: boolean;
  orderType: "PENDING" | "COMPLETED" | "PICKED" | "DELIVERED";
  order: any;
}
const props = defineProps<Input>();

defineEmits(["update:showBottomSheet"]);

const detailData = computed(() =>
  props.order
    ? [
        {
          key: "Order Id",
          value: props.order?.order_details[0]?.order_id,
        },
        {
          key: "Date",
          value: formatDateUtils(props.order?.created_at),
        },
        {
          key: "Customer Name",
          value: props.order?.user?.first_name + props.order?.user?.last_name,
        },
        {
          key: "Delivery Type",
          value: props.order.with_delivery ? "With Delivery" : "Self Pickup",
        },
        {
          key: "Delivery Service Name",
          value: props.order?.delivery_provider?.name,
        },
        {
          key: "Store",
          value: props.order.order_details[0].physical_product.store.name,
        },
        // {
        //   key: "Subtotal",
        //   value: 500,
        // },
        // {
        //   key: "Discount (-)",
        //   value: 50,
        // },
        // {
        //   key: "Total Sold",
        //   value: props.order.totalPrice,
        // },
      ]
    : []
);

// dummy data
const header = [
  "id",
  "product_name",
  "unit_price",
  "quantity",
  "discount",
  "special_discount_rate(%)",
];

const body = computed(() =>
  props.order?.order_details.map((order_detail: any) => {
    return {
      id: order_detail.id,
      product_name: order_detail.physical_product.title,
      unit_price: order_detail.unit_price,

      discount: order_detail.discount,
      quantity: order_detail.quantity,
      special_discount_rate: order_detail.special_discount_rate
        ? order_detail.special_discount_rate / 100
        : "-",
    };
  })
);

const store_name = computed(() => {
  return props.order?.order_details[0].physical_product?.store?.name;
});

const qr_code_value = computed(() => {
  return props.order?.order_details?.map((element: any) => {
    return element.id;
  });
});


</script>
