<template>
  <div
    class="flex my-4 mt-2 w-full rounded-md items-center justify-center relative"
  >
    <div class="relative w-full">
      <Icon
        name="ic:twotone-search"
        class="w-5 h-5 text-primary absolute top-3 left-2"
      />
      <input
        type="search"
        placeholder="Search By ..."
        class="pl-8 w-full rounded-md placeholder:text-sm border-[1px] border-primary focus:border-[1px] focus:ring-0 outline-none ring-0"
        v-model="searchString"
      />
    </div>
  </div>

  <main class="realtive w-full h-full">
    <h-tab :tabs="tabs as []" @activeTabNameChange="handleTabChange">
      <template #New_order>
        <section class="flex flex-col gap-4 px-3">
          <div class="flex relative lg:flex-row flex-col-reverse gap-4">
            <div
              class="h-fit flex-1 sm:min-w-[24rem] max-h-[calc(100vh-20rem)] overflow-y-auto mb-[8rem] min-w-full grid lg:grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h-empty
                v-if="activeTabOrders.length === 0 && !onFetchProductLoading"
                content="No Data Available😥"
              >
              </h-empty>
              <div
                v-else
                v-for="order in activeTabOrders"
                :key="order?.order_details[0].order_id"
                @click="
                  ($event) => {
                    controller.activeOrder = order;
                    controller.showBottomSheet = true;
                  }
                "
                class="flex h-fit rounded shadow-sm items-center cursor-pointer justify-start transition-colors ease-in-out duration-300"
                :class="[
                  controller.activeOrder.order_details[0]?.order_id ===
                  order.order_details[0].order_id
                    ? 'lg:bg-primary bg-neutral300'
                    : 'hover:bg-primaryvar3 bg-neutral300',
                ]"
              >
                <p
                  class="font-semibold px-1.5 flex items-center justify-center text-light400"
                  title="Expand"
                >
                  <Icon name="mdi:progress-check" class="w-7 h-7" />
                </p>
                <div
                  class="px-2.5 py-1.5 flex bg-light400 rounded-r-sm flex-auto items-start justify-between gap-8"
                >
                  <div>
                    <h3 class="font-extrabold mb-1.5 rounded text-primary">
                      Order Id : {{ order.order_details[0].order_id }}
                    </h3>
                    <h4 class="font-semibold text-md text-neutral300">
                      From : {{ order.user.first_name }}
                      {{ order.user.last_name }}
                    </h4>
                    <p class="font-medium text-sm text-neutral300">
                      Delivery Provider : {{ order?.delivery_provider?.name }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end">
                    <h2 class="font-extrabold text-lg text-neutral300">
                      {{ getTotalPrice(order.order_details).toFixed(2) }}
                      {{ $t("etb") }}
                    </h2>
                    <h4 class="font-semibold text-sm text-neutral300">
                      {{ formatDateUtils(order.created_at) + " " + $t("ec") }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <card-order-detail
              v-model:showBottomSheet="controller.showBottomSheet"
              v-model:order="controller.activeOrder"
              ref="bottomSheetTarget"
              orderType="PENDING"
            />
          </div>
        </section>
      </template>

      <template #completed>
        <section class="flex flex-col gap-4 px-3">
          <div class="flex relative lg:flex-row flex-col-reverse gap-4">
            <div
              class="h-fit flex-1 sm:min-w-[24rem] max-h-[calc(100vh-20rem)] overflow-y-auto mb-[8rem] min-w-full grid lg:grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h-empty
                v-if="activeTabOrders.length === 0 && !onFetchProductLoading"
                content="No Data Available😥"
              ></h-empty>
              <div
                v-else
                v-for="order in activeTabOrders"
                :key="order?.order_details[0]?.order_id"
                @click="
                  ($event) => {
                    controller.activeOrder = order;
                    controller.showBottomSheet = true;
                  }
                "
                class="flex h-fit rounded shadow-sm items-center cursor-pointer justify-start transition-colors ease-in-out duration-300"
              >
                <p
                  class="font-semibold px-1.5 flex items-center justify-center text-light400"
                  title="Expand"
                >
                  <Icon name="mdi:progress-check" class="w-7 h-7" />
                </p>
                <div
                  class="px-2.5 py-1.5 flex bg-light400 rounded-r-sm flex-auto items-start justify-between gap-8"
                >
                  <div>
                    <h3 class="font-extrabold mb-1.5 rounded text-primary">
                      {{ order.order_details[0].order_id }}
                    </h3>
                    <h4 class="font-semibold text-md text-neutral300">
                      from {{ order.user.first_name }} +
                      {{ order.user.last_name }}
                    </h4>
                    <p class="font-medium text-sm text-neutral300">
                      {{ order.delivery_provider.name }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end">
                    <h2 class="font-extrabold text-lg text-neutral300">
                      {{ getTotalPrice(order.order_details) }} {{ $t("etb") }}
                    </h2>
                    <h4 class="font-semibold text-sm text-neutral300">
                      {{ order.created_at + " " + $t("ec") }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <card-order-detail
              v-model:showBottomSheet="controller.showBottomSheet"
              v-model:order="controller.activeOrder"
              ref="bottomSheetTarget"
              orderType="COMPLETED"
            />
          </div>
        </section>
      </template>

      <template #picked>
        <section class="flex flex-col gap-4 px-3">
          <div class="flex relative lg:flex-row flex-col-reverse gap-4">
            <div
              class="h-fit flex-1 sm:min-w-[24rem] max-h-[calc(100vh-20rem)] overflow-y-auto mb-[8rem] min-w-full grid lg:grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h-empty
                v-if="activeTabOrders.length === 0 && !onFetchProductLoading"
                content="No Data Available😥"
              ></h-empty>
              <div
                v-else
                v-for="order in activeTabOrders"
                :key="order?.order_details[0]?.order_id"
                @click="
                  ($event) => {
                    controller.activeOrder = order;
                    controller.showBottomSheet = true;
                  }
                "
                class="flex h-fit rounded shadow-sm items-center cursor-pointer justify-start transition-colors ease-in-out duration-300"
              >
                <p
                  class="font-semibold px-1.5 flex items-center justify-center text-light400"
                  title="Expand"
                >
                  <Icon name="mdi:progress-check" class="w-7 h-7" />
                </p>
                <div
                  class="px-2.5 py-1.5 flex bg-light400 rounded-r-sm flex-auto items-start justify-between gap-8"
                >
                  <div>
                    <h3 class="font-extrabold mb-1.5 rounded text-primary">
                      {{ order.order_details[0].order_id }}
                    </h3>
                    <h4 class="font-semibold text-md text-neutral300">
                      from {{ order.user.first_name }} +
                      {{ order.user.last_name }}
                    </h4>
                    <p class="font-medium text-sm text-neutral300">
                      {{ order.delivery_provider.name }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end">
                    <h2 class="font-extrabold text-lg text-neutral300">
                      {{ getTotalPrice(order.order_details) }} {{ $t("etb") }}
                    </h2>
                    <h4 class="font-semibold text-sm text-neutral300">
                      {{ order.created_at + " " + $t("ec") }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <card-order-detail
              v-model:showBottomSheet="controller.showBottomSheet"
              v-model:order="controller.activeOrder"
              ref="bottomSheetTarget"
              orderType="PICKED"
            />
          </div>
        </section>
      </template>
      <template #delivered>
        <section class="flex flex-col gap-4 px-3">
          <div class="flex relative lg:flex-row flex-col-reverse gap-4">
            <div
              class="h-fit flex-1 sm:min-w-[24rem] max-h-[calc(100vh-20rem)] overflow-y-auto mb-[8rem] min-w-full grid lg:grid-cols-1 md:grid-cols-2 gap-4"
            >
              <h-empty
                v-if="activeTabOrders.length === 0 && !onFetchProductLoading"
                content="No Data Available😥"
              ></h-empty>
              <div
                v-else
                v-for="order in activeTabOrders"
                :key="order?.order_details[0]?.order_id"
                @click="
                  ($event) => {
                    controller.activeOrder = order;
                    controller.showBottomSheet = true;
                  }
                "
                class="flex h-fit rounded shadow-sm items-center cursor-pointer justify-start transition-colors ease-in-out duration-300"
              >
                <p
                  class="font-semibold px-1.5 flex items-center justify-center text-light400"
                  title="Expand"
                >
                  <Icon name="mdi:progress-check" class="w-7 h-7" />
                </p>
                <div
                  class="px-2.5 py-1.5 flex bg-light400 rounded-r-sm flex-auto items-start justify-between gap-8"
                >
                  <div>
                    <h3 class="font-extrabold mb-1.5 rounded text-primary">
                      {{ order.order_details[0].order_id }}
                    </h3>
                    <h4 class="font-semibold text-md text-neutral300">
                      from {{ order.user.first_name }} +
                      {{ order.user.last_name }}
                    </h4>
                    <p class="font-medium text-sm text-neutral300">
                      {{ order.delivery_provider.name }}
                    </p>
                  </div>
                  <div class="flex flex-col items-end">
                    <h2 class="font-extrabold text-lg text-neutral300">
                      {{ getTotalPrice(order.order_details) }} {{ $t("etb") }}
                    </h2>
                    <h4 class="font-semibold text-sm text-neutral300">
                      {{ order.created_at + " " + $t("ec") }}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            <card-order-detail
              v-model:showBottomSheet="controller.showBottomSheet"
              v-model:order="controller.activeOrder"
              ref="bottomSheetTarget"
              orderType="DELIVERED"
            />
          </div>
        </section>
      </template>
    </h-tab>

    <h-loading
      v-if="onFetchProductLoading"
      :showLoading="onFetchProductLoading"
    ></h-loading>
  </main>
</template>
<script setup lang="ts">
import { useAuth } from "~~/store/auth";
import fetchProductOrderBySupplier from "@/apollo/query/product/order/fetchProductOrderBySupplierID.gql";
import useCustomQuery from "~~/composables/useCustomQuery";
import { onClickOutside } from "@vueuse/core";
import { computed } from "@vue/reactivity";
import QrcodeVue from "qrcode.vue";
const QrcodeValue = ref();
const route = useRoute();
const storeId = computed(() => {
  return route.params?.storeId;
});

const searchString = ref("");
const getTotalPrice = (input: any) => {
  let price = 0;
  console.log(input);
  input.forEach((product: any) => {
    let discount = product.discount ? product.discount : 0;

    const selling_price = product.unit_price - discount;

    let special_discount = product?.special_discount_rate
      ? product?.special_discount_rate / 100
      : 0;

    const with_discount = selling_price * (1 - special_discount);

    price += with_discount * product.quantity;

    console.log(product.unit_price);
  });

  return price;
};

const { uid } = useAuth();
const variable = computed(() => {
  return {
    order_detail: {
      physical_product: {
        store: { supplier_id: { _eq: uid } },
        store_id: { _eq: storeId.value },
      },
    },
    where: {
      ...(searchString.value
        ? {
            _or: [
              ...(Number.isInteger(Number(searchString.value))
                ? [{ id: { _eq: searchString.value } }]
                : []),
              { delivery_provider: { name: { _iregex: searchString.value } } },
              {
                user: {
                  _or: [
                    { first_name: { _iregex: searchString.value } },
                    { last_name: { _iregex: searchString.value } },
                  ],
                },
              },
            ],
          }
        : {}),
      with_delivery: { _eq: true },
      order_details: {
        physical_product: {
          store: { supplier_id: { _eq: uid } },
          store_id: { _eq: storeId.value },
        },
      },
    },
  };
});

const activeTabOrders = ref<
  Array<{
    customer_id: string;
    user: {
      first_name: string;
      last_name: string;
    };
    with_delivery: boolean;
    transaction_key: string;
    created_at: string;
    delivery_provider: {
      name: string;
    };
    order_details: {
      status: string;
      order_id: string;
      unit_price: number;
      quantity: number;
      discount: number;
      special_discount_rate: number | number;
      physical_product: {
        id: number;
        title: string;
        store: {
          name: string;
        };
      };
    }[];
  }>
>([]);

const orders = ref<
  Array<{
    customer_id: string;
    user: {
      first_name: string;
      last_name: string;
    };
    with_delivery: boolean;
    transaction_key: string;
    created_at: string;
    delivery_provider: {
      name: string;
    };
    order_details: {
      id: number;
      status: string;
      order_id: string;
      unit_price: number;
      quantity: number;
      discount: number;
      special_discount_rate: number | number;
      physical_product: {
        id: number;
        title: string;
        store: {
          name: string;
        };
      };
    }[];
  }>
>([]);

const {
  onResult: onFetchProductOrderResult,
  onError: onFetchProductOrderError,
  loading: onFetchProductLoading,
} = useCustomQuery(fetchProductOrderBySupplier, variable);

onFetchProductOrderResult((result) => {
  orders.value = result.data.product_order;
});

onFetchProductOrderError((error) => {
  console.log({ error });
});

const currentTab = ref("pending");

const tabs = computed(() => [
  {
    text: "New_order",
    icon: "mdi:progress-check",
    badge: currentTab.value === "pending" && activeTabOrders.value.length,
  },
  {
    text: "delivered",
    icon: "mdi:progress-check",
    badge: currentTab.value === "delivered" && activeTabOrders.value.length,
  },
  {
    text: "picked",
    icon: "mdi:progress-check",
    badge: currentTab.value === "picked" && activeTabOrders.value.length,
  },
  {
    text: "completed",
    icon: "uil:check-circle",
    badge: currentTab.value === "completed" && activeTabOrders.value.length,
  },
]);

const controller = ref<{ activeOrder: any; showBottomSheet: boolean }>({
  activeOrder: null,
  showBottomSheet: false,
});

const bottomSheetTarget = ref(null);
onClickOutside(bottomSheetTarget, (event) => {
  controller.value.showBottomSheet = false;
});

definePageMeta({
  validate: (route) => {
    const { role } = useAuth();
    if (role === "supplier") return true;
    else return false;
  },
});

// const displayLoading = ref(true);
const handleTabChange = (tabSelected: string) => {
  if (currentTab.value) currentTab.value = tabSelected;
  if (orders.value) {
    activeTabOrders.value = orders.value.filter((order) => {
      if (tabSelected === "New_order") {
        let isAtLeastOnePending = false;
        order.order_details.forEach((o_detail) => {
          if (o_detail.status === "pending") {
            isAtLeastOnePending = true;
            return;
          }
        });

        return isAtLeastOnePending ? true : false;
      }
      if (tabSelected === "completed") {
        let isAllCompleted = true;
        if (order.order_details.length === 0) {
          isAllCompleted = false;
        } else
          order.order_details.forEach((o_detail) => {
            if (o_detail.status !== tabSelected) {
              isAllCompleted = false;
              return;
            }
          });

        if (isAllCompleted) return order.order_details;
        else return false;
      }

      if (tabSelected === "picked") {
        let isAllPicked = true;
        if (order.order_details.length === 0) {
          isAllPicked = false;
        } else
          order.order_details.forEach((o_detail) => {
            if (o_detail.status !== "picked") {
              isAllPicked = false;
              return;
            }
          });

        if (isAllPicked) return order.order_details;
        else return false;
      }
      if (tabSelected === "delivered") {
        let isAllDelivered = true;
        if (order.order_details.length === 0) {
          isAllDelivered = false;
        } else
          order.order_details.forEach((o_detail) => {
            if (o_detail.status !== "delivered") {
              isAllDelivered = false;
              return;
            }
          });

        if (isAllDelivered) return order.order_details;
        else return false;
      }
    });

    controller.value.activeOrder = activeTabOrders.value[0];
    console.log({ activeTabOrders: activeTabOrders.value }, " value");

    // displayLoading.value = false;
  }
};
</script>
