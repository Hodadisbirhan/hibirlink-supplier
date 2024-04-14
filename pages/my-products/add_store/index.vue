<template>
  <section
    class="flex flex-col min-h-[calc(100vh-3.7rem)] items-center justify-center min-w-full py-5"
  >
    <h-loading
      :show-loading="loading"
      loading-text="Adding A Store"
    ></h-loading>
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h1 class="font-bold text-primary text-xl w-full my-2 text-center">
      {{ $t("add_store") }}
    </h1>
    <div class="max-w-7xl flex items-center justify-center w-full">
      <h-stepper
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'location', value: $t('address') },
        ]"
        :validation-schema="dynamicSchema"
        @submit="submit"
        class="w-full"
        line-class="lg:w-[20rem] min-w-[6rem] md:w-[15rem] xs:w-[10rem]"
      >
        <template #basics="{ state, index }">
          <template v-if="state == index">
            <div
              class="grid flex-1 grid-cols-1 justify-center md:grid-cols-2 gap-x-6 gap-y-3 mt-10 mb-5 px-5"
            >
              <div>
                <h-text-field
                  name="store_name"
                  label="store_name"
                  rules="required"
                  :placeholder="$t('store_name')"
                />
                <h-text-field
                  name="phone_number"
                  label="phone_number"
                  rules="required"
                  type="number"
                  placeholder="933..."
                  leading-text="+251"
                />

                <h-text-field
                  name="main_category"
                  label="main_category"
                  rules="required"
                  :placeholder="$t('main_category')"
                />

                <div class="group max-w-[300px]">
                  <label
                    class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                    for="license"
                  >
                    {{ $t("license") }}
                  </label>
                  <h-file-upload
                    :limit="1"
                    accept="image/*"
                    size="1 mb"
                    id="license"
                    name="license"
                  />
                </div>
              </div>

              <div
                class="bg-light400/50 text-primary font-bold text-lg shadow-sm rounded h-fit p-4 pb-6 pt-2"
              >
                <h1 class="py-2">{{ $t("payment_information") }}</h1>
                <div
                  v-if="haveAssociatedBank.length"
                  class="flex gap-x-2 gap-y-2 my-4 text-sm flex-wrap"
                >
                  <div
                    v-for="(info, index) in haveAssociatedBank"
                    :key="index"
                    @click="setFormValue(index)"
                    class="px-2 pr-8 py-1 shadow-sm relative cursor-pointer flex gap-2"
                  >
                    <input
                      type="radio"
                      name="radio"
                      :value="info.account"
                      v-model="selectedRadio"
                    />
                    <span class="font-bold text-primary"
                      >{{ info.paymentType }} :
                    </span>
                    <span class="font-normal text-neutral300">{{
                      info.account
                    }}</span>
                    <Icon
                      name="ic:outline-arrow-outward"
                      class="w-5 h-5 fill-primary absolute top-0 right-1"
                    />
                  </div>
                  <div
                    class="px-2 pr-8 py-1 shadow-sm relative cursor-pointer flex gap-2"
                    @click="paymentInfoReset"
                  >
                    <input
                      type="radio"
                      name="radio"
                      value="other"
                      v-model="selectedRadio"
                    />
                    <span class="font-bold text-primary">Others </span>
                    <Icon
                      name="ic:outline-arrow-outward"
                      class="w-5 h-5 fill-primary absolute top-0 right-1"
                    />
                  </div>
                </div>
                <div v-show="newAccount">
                  <h-text-field
                    name="first_name"
                    :placeholder="$t('first_name')"
                    label="first_name"
                    v-model:model-value="FirstName"
                  />
                  <h-text-field
                    name="last_name"
                    :placeholder="$t('last_name')"
                    label="last_name"
                    v-model:model-value="LastName"
                  />
                  <h-select
                    :items="paymentMethod"
                    name="payment_method"
                    label="payment_method"
                    rules="required"
                    v-model:model-value="AccType"
                  />
                  <h-text-field
                    name="account_number"
                    :placeholder="$t('account_number')"
                    type="number"
                    rules="required"
                    label="account_number"
                    v-model:model-value="Account"
                  />
                </div>
              </div>
            </div> </template
        ></template>
        <template #location="{ state, index }"
          ><template v-if="state == index">
            <product-location :location-data="locationData" />
          </template>
        </template>
      </h-stepper>
    </div>
  </section>
</template>
<script setup lang="ts">
import associatedBank from "@/apollo/query/product/realTime/selectAssociatedBank.gql";
import addStore from "@/apollo/mutation/product/realTime/addStore.gql";
import bankSelect from "@/apollo/query/banks.gql";
import locations from "@/apollo/query/fetchLocations.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid } = storeToRefs(useAuth());
const selectedRadio = ref();
const FirstName = ref("");
const LastName = ref("");
const AccType = ref("");
const Account = ref("");
const newAccount = ref(false);
const loading = ref(false);
const router = useRouter();
const { result: associatedBankResult, error: associatedBankError } =
  useCustomQuery(associatedBank, { supplier_id: uid.value });

const { result: bankAccountTypes, error: bankAccountTypesError } =
  useCustomQuery(bankSelect);
const { result: locationResult, error: locationError } =
  useCustomQuery(locations);
watchEffect(() => {
  console.log("Location Error", locationError);
});
const locationData = computed(() => {
  return locationResult.value?.cities ?? [];
});
const paymentMethod = computed(() => {
  const data = bankAccountTypes.value?.bank_type ?? null;
  if (data) {
    return data.map((types: any) => {
      return types.name;
    });
  }
  return [];
});
const {
  mutate: addStoreMutation,
  onDone: onAddStoreMutationComplete,
  onError: onAddStoreMutationError,
} = useCustomMutation(addStore);
onAddStoreMutationComplete((result) => {
  loading.value = false;
  showNotification(true, "Store Add Successful");

  router.replace({ name: "my-products-index" });
});
onAddStoreMutationError((error) => {
  loading.value = false;
  showNotification(false, "Error While Adding A Store");
  console.log(error);
});

const haveAssociatedBank = computed(() => {
  const data = associatedBankResult.value?.supplier.bank_account ?? null;
  if (data && data.length > 0) {
    newAccount.value = false;
    return data.map((banks: any) => {
      const account = banks;
      return {
        id: account.id,
        fname: account.first_name,
        lname: account.last_name,
        paymentType: account.bank_type,
        account: account.account_number,
      };
    });
  }
  newAccount.value = true;
  return [];
});

const previousPaymentInfoId = ref(null);
const setFormValue = (index: number) => {
  previousPaymentInfoId.value = haveAssociatedBank.value[index].id;
  newAccount.value = false;
  FirstName.value = haveAssociatedBank.value[index].fname;
  LastName.value = haveAssociatedBank.value[index].lname;
  AccType.value = haveAssociatedBank.value[index].paymentType;
  Account.value = haveAssociatedBank.value[index].account;
};

const paymentInfoReset = () => {
  FirstName.value = "";
  LastName.value = "";
  AccType.value = "";
  Account.value = "";
  newAccount.value = true;
  previousPaymentInfoId.value = null;
};

const submit = async (value: any) => {
  loading.value = true;

  const { uploadImages } = useFirebaseClient();
  const license = await uploadImages(value.license, "images/store");
  if (license.error || !license.urls) {
    console.log(license.error);

    showNotification(false, "Error While Uploading License");

    return;
  }
  const variableWithPreviousBankAccount = {
    name: value.store_name,
    phone_number: value.phone_number + "",
    licence: license.urls[0],
    subcity_id: value.sub_city.id,
    longitude: value.map_location.lng,
    latitude: value.map_location.lat,
    category: value.main_category,
    supplier_id: uid.value,
    description: value.location_detail,
    account_id: previousPaymentInfoId.value,
  };
  const variableWithoutPreviousBankAccount = {
    name: value.store_name,
    phone_number: value.phone_number + "",
    licence: license.urls[0],
    subcity_id: value.sub_city.id,
    supplier_id: uid.value,
    longitude: value.map_location.lng,
    latitude: value.map_location.lat,
    description: value.location_detail,
    category: value.main_category,
    bank_account: {
      data: {
        user_id: uid.value,
        account_number: value.account_number,
        bank_type: value.payment_method,
        first_name: value.first_name,
        last_name: value.last_name,
      },
    },
  };

  if (previousPaymentInfoId.value)
    addStoreMutation({ object: variableWithPreviousBankAccount });
  else addStoreMutation({ object: variableWithoutPreviousBankAccount });
};

const dynamicSchema = [
  {
    store_name: "required",
    phone_number: "required|phoneNumber",
    payment_method: "required",
    account_number: "required",
    license: "required",
    first_name: "required",
    last_name: "required",
  },
  {
    region_or_administration: "required",
    sub_city: "required",
    location_detail: "required",
    map_location: "required",
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
    if (role === "supplier") return true;
    else return false;
  },
});
</script>
