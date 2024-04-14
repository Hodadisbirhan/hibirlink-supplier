<template>
  <div
    class="w-full text-neutral-600 px-5 bg-white hover:shadow-[0px_0px_24px_8px_rgba(120,120,120,0.2)] transition-all ease-in-out duration-300 cursor-pointer p-1 rounded-md border-b-4 border-primaryvar1"
  >
    <div class="py-5 flex gap-2 items-center flex-col mx-auto w-full">
      <Icon
        v-if="status == 'verified'"
        name="mdi:storefront-check"
        class="w-16 h-24 text-primary"
      />
      <Icon
        v-if="status == 'pending'"
        name="mdi:store-clock"
        class="w-16 h-24 text-primary"
      />
      <Icon
        v-if="status == 'suspended'"
        name="mdi:store-alert"
        class="w-16 h-24 text-primary"
      />
      <h2 class="font-bold text-sm">{{ storeName }}</h2>
      <h2 v-if="business" class="font-semibold text-xs text-neutral-500">
        {{ business }}
      </h2>
    </div>
    <hr />
    <div class="py-2 text-xs flex justify-between items-center px-1">
      <p>Date : {{ date }}</p>

      <h-menu
        v-if="roler == 'supplier' && status !='suspended'"
        @click.stop="null"
        @optionClicked="handleClick"
        leading_icon="ph:dots-three-outline-fill"
        :menu="{ id: id.toString(), actions: ['edit', 'delete'] }"
      />
    </div>

    <div class="flex items-center text-xs gap-2 justify-between pb-3 pt-1">
      <div
        class="flex gap-1 items-center text-primary"
        v-if="status == 'verified'"
      >
        <Icon name="material-symbols:verified-outline" class="w-5 h-5" />
        <p>Verified</p>
      </div>
      <div
        class="flex gap-1 items-center text-orange"
        v-if="status == 'pending'"
      >
        <Icon name="fluent:shifts-pending-24-regular" class="w-5 h-5" />
        <p>Pending</p>
      </div>
      <div
        class="flex gap-1 items-center text-red"
        v-if="status == 'suspended'"
      >
        <Icon name="gg:unavailable" class="w-5 h-5" />
        <p>Suspended</p>
      </div>
      <div>
        <span class="text-orange">{{
          products / 100 > 1 ? (products / 1000).toFixed(0) + "K" : products
        }}</span>
        <span> Products</span>
      </div>
      <div>
        <span class="text-orange">{{
          employee / 100 > 1 ? (employee / 1000).toFixed(0) + "K " : employee
        }}</span>
        <span> Employee</span>
      </div>
    </div>
    <div class="flex items-center text-xs gap-2 justify-between pb-3 pt-1">
      <div>
        <span>Payment Method : </span><span>{{ bank.method }}</span>
      </div>
      <div>
        <span>Acc.number : </span><span>{{ bank.account }}</span>
      </div>
      <div></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {useAuth} from "~/store/auth";
const{role:roler} = useAuth();

interface Props {
  id: number;
  storeName: string;
  business: string;
  status: string;
  products: number;
  employee: number;
  date: string;
  role?: string;
  bank: object;
}
const props = defineProps<Props>();
const emit = defineEmits(["menuSelected"]);
const handleClick = (value: any) => {
  emit("menuSelected", value);
};
</script>
