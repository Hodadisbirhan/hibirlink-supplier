<template>
  <main class="min-w-full min-h-full flex flex-col gap-6">
    <section>
      <h2 class="font-extrabold text-lg text-dark200">
        {{ $t("welcome") }}
      </h2>
      <p class="text-dark200 font-medium">
        {{ $t("welcome_description") }}
      </p>
    </section>

    <section
      class="flex items-center bg-gradient-to-r from-purple to-primary p-2 gap-2 rounded-md"
    >
      <div class="flex-1">
        <h2 class="font-extrabold text-light300">
          {{ $t("download_message") }}
        </h2>
        <p class="text-light200">
          {{ $t("download_description") }}
        </p>
      </div>
      <div class="flex md:flex-row flex-col">
        <button
          class="inline-flex items-center px-6 py-3 rounded-lg hover:bg-dark300 hover:text-light300 transition-colors ease-in-out duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="fill-current w-7 h-7 dark:text-gray-900"
          >
            <path
              d="M 5.4160156 2.328125 L 12.935547 10.158203 C 13.132547 10.363203 13.45925 10.363203 13.65625 10.158203 L 15.179688 8.5742188 C 15.405688 8.3392188 15.354312 7.956875 15.070312 7.796875 C 11.137313 5.571875 6.2620156 2.811125 5.4160156 2.328125 z M 3.140625 2.8476562 C 3.055625 3.0456562 3 3.2629063 3 3.5039062 L 3 20.591797 C 3 20.788797 3.044375 20.970625 3.109375 21.140625 L 11.576172 12.324219 C 11.762172 12.131219 11.762172 11.826813 11.576172 11.632812 L 3.140625 2.8476562 z M 17.443359 9.2578125 C 17.335484 9.2729375 17.233297 9.32375 17.154297 9.40625 L 15.015625 11.632812 C 14.829625 11.825812 14.829625 12.130219 15.015625 12.324219 L 17.134766 14.529297 C 17.292766 14.694297 17.546141 14.729188 17.744141 14.617188 C 19.227141 13.777188 20.226563 13.212891 20.226562 13.212891 C 20.725562 12.909891 21.007 12.443547 21 11.935547 C 20.992 11.439547 20.702609 10.981938 20.224609 10.710938 C 20.163609 10.676937 19.187672 10.124359 17.763672 9.3183594 C 17.664172 9.2623594 17.551234 9.2426875 17.443359 9.2578125 z M 13.296875 13.644531 C 13.165875 13.644531 13.034047 13.696328 12.935547 13.798828 L 5.4746094 21.566406 C 6.7566094 20.837406 11.328781 18.249578 15.050781 16.142578 C 15.334781 15.981578 15.386156 15.599281 15.160156 15.363281 L 13.65625 13.798828 C 13.55775 13.696328 13.427875 13.644531 13.296875 13.644531 z"
            ></path>
          </svg>
          <span class="flex flex-col items-start ml-4 leading-none">
            <span class="mb-1 text-xs">GET IT ON</span>
            <span class="font-semibold title-font">Google Play</span>
          </span>
        </button>
        <button
          class="inline-flex items-center px-5 py-3 rounded-lg hover:bg-dark300 hover:text-light300 transition-colors ease-in-out duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            class="fill-current w-7 h-7 dark:text-gray-900"
          >
            <path
              d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"
            ></path>
          </svg>
          <span class="flex flex-col items-start ml-4 leading-none">
            <span class="mb-1 text-xs">Download on the</span>
            <span class="font-semibold title-font">App Store</span>
          </span>
        </button>
      </div>
    </section>

    <section class="min-w-full flex lg:flex-row flex-col gap-6">
      <div class="flex-1 flex flex-col gap-6 p-4 rounded-md bg-light400">
        <h2 class="text-lg font-extrabold text-neutral300">
          {{ $t("sales_summary") }}
        </h2>
        <div class="flex flex-wrap gap-4">
          <div
            class="w-28 flex-1 h-36 items-center justify-center bg-primary bg-opacity-30 rounded-md flex flex-col gap-2 p-3"
          >
            <Icon
              name="icon-park-solid:stock-market"
              class="w-10 h-10 p-2 text-light300 bg-primaryvar1 rounded-full"
            />
            <h1 class="font-extrabold text-dark200">
              {{ totalIncome.toFixed(2) }} {{ $t("etb") }}
            </h1>
            <h3 class="text-dark300 text-sm font-semibold">
              {{ $t("total_income") }}
            </h3>
          </div>

          <div class="flex flex-1 flex-wrap gap-4">
            <div
              class="w-full h-36 items-center justify-center bg-purple bg-opacity-30 rounded-md flex flex-col gap-2 p-3"
            >
              <Icon
                name="icon-park-solid:market-analysis"
                class="w-10 h-10 p-2 text-light300 bg-purple rounded-full"
              />
              <h1 class="font-extrabold text-dark200">
                {{ (totalIncome * 0.03).toFixed(2) }} {{ $t("etb") }}
              </h1>
              <h3 class="text-dark300 text-sm font-semibold">
                {{ $t("fee") }}
              </h3>
            </div>
          </div>

          <div class="flex flex-1 flex-wrap gap-4">
            <div
              class="w-full h-36 items-center justify-center bg-orange bg-opacity-30 rounded-md flex flex-col gap-2 p-3"
            >
              <Icon
                name="fa6-regular:money-bill-1"
                class="w-10 h-10 p-2 text-light300 bg-orange rounded-full"
              />
              <h1 class="font-extrabold text-dark200">
                {{ (totalIncome * 0.01).toFixed(2) }} {{ $t("etb") }}
              </h1>
              <h3 class="text-dark300 text-sm font-semibold">
                {{ $t("tax") }}
              </h3>
            </div>
          </div>

          <div class="flex flex-1 flex-wrap gap-4">
            <div
              class="w-full h-36 items-center justify-center bg-lemon bg-opacity-30 rounded-md flex flex-col gap-2 p-3"
            >
              <Icon
                name="simple-icons:coinmarketcap"
                class="w-10 h-10 p-2 text-light300 bg-lemon rounded-full"
              />
              <h1 class="font-extrabold text-dark200">
                {{ (totalIncome * 0.04).toFixed(2) }} {{ $t("etb") }}
              </h1>
              <h3 class="text-dark300 text-sm font-bold">
                {{ $t("balance") }}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 flex flex-col gap-6 p-4 rounded-md bg-light400">
        <h2 class="text-lg font-extrabold text-neutral300">
          {{ $t("my_businesses") }}
        </h2>
        <div class="flex flex-wrap gap-4 h-fit">
          <div
            class="w-fit h-36 bg-primary bg-opacity-20 rounded-md flex flex-col gap-2 p-4 text-sm font-semibold text-neutral200"
          >
            <div class="flex items-center gap-2 pb-1">
              <Icon
                name="fluent:store-microsoft-16-filled"
                class="w-6 h-6 text-primary rounded-full"
              />
              <p class="font-bold">{{ $t("stores") }}</p>
            </div>
            <p c># {{ totalStore }} {{ $t("stores") }}</p>
            <p c># {{ totalRealTimeProduct }} {{ $t("products") }}</p>
            <p c># {{ totalEmployee }} {{ $t("employees") }}</p>
          </div>

          <div
            class="w-fit h-36 bg-purple bg-opacity-20 rounded-md flex flex-col gap-2 p-4 text-sm font-semibold text-neutral200"
          >
            <div class="flex items-center gap-2 pb-1">
              <Icon
                name="mingcute:service-fill"
                class="w-6 h-6 text-purple rounded-full"
              />
              <p class="font-bold">{{ $t("services") }}</p>
            </div>
            <p># {{ totalServices }} {{ $t("services") }}</p>
            <p># {{ totalRealTimeService }} {{ $t("realtime_service") }}</p>
            <p># {{ totalVirtualService }} {{ $t("virtual_service") }}</p>
          </div>

          <div
            class="w-fit h-h-36 bg-lemon bg-opacity-20 rounded-md flex flex-col gap-2 p-4 text-sm font-semibold text-neutral200"
          >
            <div class="flex items-center gap-2 pb-1">
              <Icon name="ep:goods" class="w-6 h-6 text-lemon rounded-full" />
              <p class="font-bold">{{ $t("products") }}</p>
            </div>
            <p># {{ totalProducts }} {{ $t("products") }}</p>
            <p># {{ totalRealTimeProduct }} {{ $t("realtime_product") }}</p>
            <p># {{ totalVirtualProduct }} {{ $t("virtual_product") }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full bg-light400 rounded-md p-4">
      <div class="flex items-center justify-between min-w-[1000px]">
        <h2 class="text-lg font-extrabold text-neutral400">
          {{ $t("customers") }}
        </h2>
        <!-- <p class="text-dark200 text-sm font-bold">
          360K {{ $t("total") }} {{ $t("customers") }}
        </p> -->
      </div>
      <!-- <div class="flex flex-wrap justify-around gap-16 pt-4">
        <apex-chart
          width="495"
          type="area"
          :options="options"
          :series="series"
        ></apex-chart>
        <apex-chart
          width="495"
          type="area"
          :options="options"
          :series="series"
        ></apex-chart>
      </div> -->
    </section>

    <section class="w-full bg-light400 rounded-md p-4">
      <div class="flex items-center justify-between min-w-[1000px]">
        <h2 class="text-lg font-extrabold text-neutral400">
          {{ $t("orders_in_stores") }}
        </h2>
        <div
          class="flex items-center font-bold text-neutral300 justify-end gap-4"
        >
          <small class="text-dark200"
            >{{ totalOrders }} {{ $t("total") }}</small
          >
          <small>-</small>
          <small class="text-purple"
            >{{ totalPickedOrders }} {{ $t("picked") }}</small
          >
          <small>-</small>
          <small class="text-primary"
            >{{ totalPendingOrders }} {{ $t("pending") }}</small
          >
          <small>-</small>
          <small class="text-lemon"
            >{{ totalCompletedOrders }} {{ $t("completed") }}</small
          >
          <small>-</small>
          <small class="text-red"
            >{{ totalUnpaidOrders }} {{ $t("unpaid") }}</small
          >
          <small>-</small>
          <small class="text-primary"
            >{{ totalDeliveredOrders }} {{ $t("delivered") }}</small
          >
        </div>
      </div>
      <h-table
        :headers="header"
        :body="body"
        header-class="bg-light400 text-neutral200 py-2 border-b"
        body-class="py-3 border-b-2  border-light300 border-opacity-100 font-bold text-neutral300"
      >
        <template #stores="{ item }">
          {{ item.name }}
        </template>
        <template #total="{ item }">
          {{ item.orders }}
        </template>
        <template #pending="{ item }">
          {{ item.pending }}
        </template>
        <template #picked="{ item }">
          {{ item.picked }}
        </template>
        <template #delivered="{ item }">
          {{ item.delivered }}
        </template>
        <template #unpaid="{ item }">
          {{ item.unpaid }}
        </template>

        <template #completed="{ item }">
          {{ item.completed }}
        </template>
      </h-table>
    </section>

    <!-- <section class="w-full bg-light400 rounded-md p-4">
      <div class="flex items-center justify-between min-w-[1000px]">
        <h2 class="text-lg font-extrabold text-neutral400">
          {{ $t("service_requests") }}
        </h2>
        <div
          class="flex items-center font-bold text-neutral300 justify-end gap-4"
        >
          <small class="text-dark200">360 {{ $t("total") }}</small>
          <small>-</small>
          <small class="text-purple">360 {{ $t("recent") }}</small>
          <small>-</small>
          <small class="text-primary">360 {{ $t("pending") }}</small>
          <small>-</small>
          <small class="text-lemon">360 {{ $t("completed") }}</small>
          <small>-</small>
          <small class="text-red">360 {{ $t("cancelled") }}</small>
        </div>
      </div>
      <h-table
        :headers="header"
        :body="body"
        header-class="bg-light400 text-neutral200 py-2 border-b"
        body-class="py-3 border-b-2  border-light300 border-opacity-100 font-bold text-neutral300"
      >
        <template #stores="{ item }">
          {{ item.stores }}
        </template>
        <template #total="{ item }">
          {{ item.total }}
        </template>
        <template #recent="{ item }">
          {{ item.recent }}
        </template>
        <template #pending="{ item }">
          {{ item.pending }}
        </template>
        <template #completed="{ item }">
          {{ item.completed }}
        </template>
        <template #cancelled="{ item }">
          {{ item.cancelled }}
        </template>
      </h-table>
    </section> -->
  </main>
</template>
<script setup lang="ts">
import ApexChart from "vue3-apexcharts";
import fetchAnalysis from "@/apollo/query/fetchAnalysis.gql";
import fetchOrderDataGql from "@/apollo/query/analysisTable.gql";
import { useAuth } from "~/store/auth";
const { uid } = useAuth();
const { locale, t } = useI18n();
const { result, onError } = useCustomQuery(fetchAnalysis, { user_id: uid });
onError((error) => {
  console.log(error);
});
const variable = computed(() => {
  return {
    where: { supplier_id: { _eq: uid } },
    where2: { physical_product: { store: { supplier_id: { _eq: uid } } } },
  };
});
const { result: fetchOrder, onError: fetchOrderError } = useCustomQuery(
  fetchOrderDataGql,
  variable
);
onError((error) => {
  console.log(error);
});
const totalStore = ref(0);
const totalEmployee = ref(0);
const totalServices = ref(0);
const totalProducts = ref(0);
const totalRealTimeProduct = ref(0);
const totalVirtualProduct = ref(0);
const totalRealTimeService = ref(0);
const totalVirtualService = ref(0);
const totalIncome = ref(0);

watch(result, (data) => {
  console.log(data);

  totalStore.value = data.supplier.store.total.count;
  totalEmployee.value = data.supplier.user.employee.total.count;
  totalServices.value =
    data.r_services.total.count + data.v_services.total.count;
  totalProducts.value =
    data.r_products.total.count + data.v_products.total.count;
  totalRealTimeProduct.value = data.r_products.total.count;
  totalVirtualProduct.value = data.v_products.total.count;
  totalVirtualService.value = data.v_services.total.count;
  totalRealTimeService.value = data.r_services.total.count;
  data.order_detail.map((orders: any) => {
    totalIncome.value +=
      orders.quantity *
      ((orders.unit_price - orders.discount ?? 0) -
        (orders.special_discount_rate
          ? (orders.unit_price - orders.discount ?? 0) *
            orders.special_discount_rate *
            0.01
          : 0));
  });
});

const fetchOrderData = ref({});
const body = ref([]);
const totalOrders = ref(0);
const totalPendingOrders = ref(0);
const totalCompletedOrders = ref(0);
const totalDeliveredOrders = ref(0);
const totalPickedOrders = ref(0);
const totalUnpaidOrders = ref(0);
watch(fetchOrder, (data) => {
  data.store.map((store: any) => {
    const key = store.name;
    fetchOrderData.value[key] = {
      name: key,
      orders: 0,
      pending: 0,
      completed: 0,
      picked: 0,
      delivered: 0,
      unpaid: 0,
    };
  });

  console.log(data);
  data.orders.map((order: any) => {
    totalOrders.value++;
    if (order.status == "pending") totalPendingOrders.value++;
    else if (order.status == "completed") totalCompletedOrders.value++;
    else if (order.status == "picked") totalPickedOrders.value++;
    else if (order.status == "unpaid") totalUnpaidOrders.value++;
    else if (order.status == "delivered") totalDeliveredOrders.value++;

    fetchOrderData.value[order?.physical_product?.store?.name]["orders"]++;
    fetchOrderData.value[order?.physical_product?.store?.name][order.status]++;
  });

  for (let key in fetchOrderData.value) {
    body.value.push(fetchOrderData.value[key]);
  }
});
const options = computed(() => {
  return {
    title: {
      text: t("stores") + " " + t("analysis"),
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "700",
        fontFamily: "'nunito'",
        color: "#737373",
      },
    },
    subtitle: {
      text: `345 ${t("customers")}`,
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 28,
      floating: false,
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        fontFamily: "nunito",
        color: "#477eeb",
      },
    },
    colors: ["#477eeb", "#8DCC7B", "#3D00BA"],
    chart: {
      id: "vuechart-example",
      stacked: true,
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  };
});
const series = ref([
  {
    type: "area",
    name: "store name 1",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
  {
    type: "area",
    name: "store name 2",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
  {
    type: "area",
    name: "store name 3",
    data: [30, 40, 45, 50, 49, 60, 70, 91],
  },
]);

const header = [
  "stores",
  "total",
  "pending",
  "picked",
  "delivered",
  "unpaid",
  "completed",
];

definePageMeta({
  middleware: "before-rul-entry",
});
</script>
