<template>
  <section
    class="flex flex-col min-h-[calc(100vh-3.7rem)] items-center justify-center min-w-full py-5">
    <h-loading
      :show-loading="isLoading"
      loading-text="Adding A Store"></h-loading>

    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h1
      v-if="initialData"
      class="font-bold text-primary text-xl w-full my-2 text-center">
      Edit Product
    </h1>
    <div
      v-if="initialData"
      class="max-w-7xl flex items-center justify-center w-full">
      <h-stepper
        :steps="[
          { key: 'basics', value: 'Basics' },
          { key: 'location', value: 'Location' },
        ]"
        :validation-schema="dynamicSchema"
        @submit="submit"
        :is-for-add="false"
        :initial-value="initialData"
        class="w-full"
        line-class="lg:w-[20rem] min-w-[6rem] md:w-[15rem] xs:w-[10rem]">
        <template #basics="{ state, index }">
          <template v-if="state == index">
            <div
              class="grid flex-1 grid-cols-1 justify-center md:grid-cols-2 gap-x-6 gap-y-3 mt-10 mb-5 px-5">
              <div>
                <h-text-field
                  name="store_name"
                  label="store_name"
                  rules="required"
                  id="store_name"
                  :placeholder="$t('store_name')" />
                <h-text-field
                  name="phone_number"
                  label="phone_number"
                  rules="required"
                  type="number"
                  placeholder="933..."
                  leading-text="+251" />

                <h-text-field
                  name="main_category"
                  label="main_category"
                  rules="required"
                  :placeholder="$t('main_category')" />

                <div class="group max-w-[300px]">
                  <label
                    class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                    for="license">
                    {{ $t("license") }} ({{ $t("optional") }})
                  </label>
                  <h-file-upload
                    :limit="1"
                    accept="image/*"
                    size="1 mb"
                    type="image"
                    id="license"
                    name="license" />
                </div>
              </div>

              <div
                class="bg-light400/50 text-primary font-bold text-lg shadow-sm rounded h-fit p-4 pb-6 pt-2">
                <h1 class="py-2">{{ $t("payment_information") }}</h1>
                <div
                  v-if="haveAssociatedBank.length"
                  class="flex gap-x-2 gap-y-2 my-4 text-sm flex-wrap">
                  <div
                    v-for="(info, index) in haveAssociatedBank"
                    :key="index"
                    @click="setFormValue(index)"
                    class="px-2 pr-8 py-1 shadow-sm relative cursor-pointer flex gap-2">
                    <input
                      type="radio"
                      :value="info.account"
                      v-model="selectedAccount"
                      :id="info.account"
                      name="radio" />
                    <label
                      :for="info.account"
                      class="font-bold text-primary"
                      >{{ info.paymentType }} :
                    </label>
                    <label
                      :for="info.account"
                      class="font-normal text-neutral300"
                      >{{ info.account }}</label
                    >
                    <Icon
                      name="ic:outline-arrow-outward"
                      class="w-5 h-5 fill-primary absolute top-0 right-1" />
                  </div>
                  <div
                    class="px-2 pr-8 py-1 shadow-sm relative cursor-pointer flex gap-2"
                    @click="paymentInfoReset">
                    <input
                      type="radio"
                      id="others"
                      value="other"
                      v-model="selectedAccount"
                      name="radio" />
                    <label
                      for="others"
                      class="font-bold text-primary"
                      >Others
                    </label>
                    <Icon
                      name="ic:outline-arrow-outward"
                      class="w-5 h-5 fill-primary absolute top-0 right-1" />
                  </div>
                </div>
                <div v-show="newAccount">
                  <h-text-field
                    name="first_name"
                    :placeholder="$t('first_name')"
                    label="first_name"
                    v-model:model-value="FirstName" />
                  <h-text-field
                    name="last_name"
                    :placeholder="$t('last_name')"
                    label="last_name"
                    v-model:model-value="LastName" />
                  <h-select
                    :items="paymentMethod"
                    name="payment_method"
                    label="payment_method"
                    rules="required"
                    v-model:model-value="AccType" />
                  <h-text-field
                    name="account_number"
                    :placeholder="$t('account_number')"
                    type="number"
                    rules="required"
                    label="account_number"
                    v-model:model-value="Account" />
                </div>
              </div>
            </div> </template
        ></template>
        <template #location="{ state, index }"
          ><template v-if="state == index">
            <product-location
              :location-data="locationData"
              :city-id="cityId"
              :sub-city-id="subCityId"
              :location="latLng" />
          </template>
        </template>
      </h-stepper>
    </div>
  </section>
</template>
<script setup lang="ts">
import associatedBank from "@/apollo/query/product/realTime/selectAssociatedBank.gql";
import updateStoreBasicNewAccount from "@/apollo/mutation/product/realTime/updateStoreBasicNewAccount.gql";
import updateStoreBasicWithExistingAccount from "@/apollo/mutation/product/realTime/updateBasicStoreWithExistingAccount.gql";
import getStoreQl from "@/apollo/query/product/realTime/fetchStoreForEdit.gql";
import bankSelect from "@/apollo/query/banks.gql";
import locations from "@/apollo/query/fetchLocations.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";
const { storeId } = useRoute().params as { storeId: number };
const { uid } = storeToRefs(useAuth());
const selectedAccount = ref();
const FirstName = ref("");
const LastName = ref("");
const AccType = ref("");
const Account = ref("");
const cityId = ref();
const subCityId = ref();
const latLng = ref();
const router = useRouter();
const newAccount = ref(false);
const loading = ref(false);
const { result: associatedBankResult, error: associatedBankError } =
  useCustomQuery(associatedBank, { supplier_id: uid.value });

const { result: bankAccountTypes, error: bankAccountTypesError } =
  useCustomQuery(bankSelect);
const { result: locationResult, error: locationError } =
  useCustomQuery(locations);
const { result: storeResult, error: storeError } = useCustomQuery(getStoreQl, {
  store_id: storeId,
});
const accountId = ref();
const initialData = computed(() => {
  const data = storeResult.value?.store;
  if (data) {
    cityId.value = data.sub_city.city_region_id;
    subCityId.value = data.sub_city.id;
    latLng.value = { lat: data.latitude, lng: data.longitude };
    selectedAccount.value = data.bank_account.account_number;
    accountId.value = data.account_id;
    FirstName.value = data.bank_account.first_name;
    LastName.value = data.bank_account.last_name;
    AccType.value = data.bank_account.bank_type;
    Account.value = data.bank_account.account_number;
    return {
      store_name: data.name,
      phone_number: data.phone_number,
      main_category: data.category,
      license: data.licence,
      location_detail: data.description,
    };
  }
  return null;
});

watchEffect(() => {
  console.log(initialData.value);
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
  mutate: updateStoreBasicMutation,
  onDone: onUpdateStoreBasicMutationComplete,
  onError: onUpdateStoreBasicMutationError,
} = useCustomMutation(updateStoreBasicNewAccount);
const {
  mutate: updateStoreBasicWithExistingAccountMutation,
  onDone: onUpdateStoreBasicWithExistingAccountMutationComplete,
  onError: onUpdateStoreBasicWithExistingAccountMutationError,
} = useCustomMutation(updateStoreBasicWithExistingAccount);
onUpdateStoreBasicWithExistingAccountMutationComplete((result) => {
  showNotification(true, "Store Add Successful");
  isLoading.value = false;
  router.replace({ name: "my-products-index" });
});
onUpdateStoreBasicWithExistingAccountMutationError((error) => {
  showNotification(false, "Error While Updating A Store");
  console.log(error);
  isLoading.value = false;
});

onUpdateStoreBasicMutationComplete((result) => {
  showNotification(true, "Store Edit Successful");
  isLoading.value = false;
  router.replace({ name: "my-products-index" });
});
onUpdateStoreBasicMutationError((error) => {
  if (error.message.includes("account_number"))
    showNotification(false, "Account Number already taken");
  else showNotification(false, "Error While Updating A Store");
  console.log(error);
  isLoading.value = false;
});

const haveAssociatedBank = computed(() => {
  const data = associatedBankResult.value?.supplier?.bank_account ?? null;
  console.log(data);
  if (data && data.length > 0) {
    return data.map((banks: any) => {
      const account = banks;
      console.log(account);
      return {
        id: account.id,
        fname: account.first_name,
        lname: account.last_name,
        paymentType: account.bank_type,
        account: account.account_number,
      };
    });
  }

  return [];
});

const setFormValue = (index: number) => {
  accountId.value = haveAssociatedBank.value[index].id;
  FirstName.value = haveAssociatedBank.value[index].fname;
  LastName.value = haveAssociatedBank.value[index].lname;
  AccType.value = haveAssociatedBank.value[index].paymentType;
  Account.value = haveAssociatedBank.value[index].account;
  newAccount.value = false;
};

const paymentInfoReset = () => {
  newAccount.value = true;
  accountId.value = null;
  FirstName.value = "";
  LastName.value = "";
  AccType.value = "";
  Account.value = "";
};

const isLoading = ref(false);
const submit = async (value: any, state: number) => {
  console.log(value);
  isLoading.value = true;
  if (state == 0) {
    let license: any;
    if (typeof value.license == "string") license = value.license;
    else {
      const { uploadImages } = useFirebaseClient();
      const { urls, error } = await uploadImages(value.license, "images/store");
      if (error || !urls) {
        showNotification(false, "Error While Uploading License");
        isLoading.value = false;
        return;
      } else license = urls[0];
    }
    if (accountId.value) {
      updateStoreBasicWithExistingAccountMutation({
        store_id: storeId,
        set: {
          name: value.store_name,
          phone_number: value.phone_number.toString(),
          category: value.main_category,
          licence: license,
          account_id: accountId.value,
        },
      });
    } else
      updateStoreBasicMutation({
        user_id: uid.value,
        store_name: value.store_name,
        phone: value.phone_number.toString(),
        category: value.main_category,
        license: license,
        account_num: value.account_number,
        bank_type: value.payment_method,
        fname: value.first_name,
        lname: value.last_name,
        store_id: storeId,
      });
  }
  if (state == 1) {
    updateStoreBasicWithExistingAccountMutation({
      store_id: storeId,
      set: {
        subcity_id: value.sub_city.id,
        description: value.location_detail,
        latitude: value.map_location.lat,
        longitude: value.map_location.lng,
      },
    });
  }
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
