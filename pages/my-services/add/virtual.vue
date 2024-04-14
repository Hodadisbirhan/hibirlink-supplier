<template>
  <main class="w-full">
    <h-loading :show-loading="showLoading" loading-text="Adding Service..." />

    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <div
      class="w-full py-5 flex flex-col gap-5 items-center justify-center min-h-[calc(100vh-3.7rem)] max-w-7xl mx-auto"
    >
      <h1
        class="w-full text-center text-base md:text-lg xl:text-2xl font-bold text-neutral200"
      >
        {{ $t("add_virtual_service") }}
      </h1>

      <h-stepper
        @submit="handleAddService"
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'media', value: $t('media') },
        ]"
        :validation-schema="dynamicSchema"
        line-class="w-[5rem] lg:w-[20rem] min-w-[6rem] md:w-[15rem]"
      >
        <template #basics="{ state, index }">
          <template v-if="state === index">
            <div
              class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 w-full gap-x-6 gap-y-3 mt-5 px-5"
            >
              <h-text-field
                class="w-full mx-auto"
                name="service_trade_name"
                type="text"
                label="service_trade_name"
                :placeholder="$t('service_trade_name')"
              ></h-text-field>

              <h-select
                class="w-full mx-auto"
                :items="category"
                name="category"
                label="category"
                v-model="categoryAt"
              ></h-select>
              <h-text-field
                class="w-full mx-auto"
                name="phone_number"
                leading-text="+251"
                type="tel"
                label="phone_number"
                placeholder="933-704-978"
              ></h-text-field>
              <h-text-field
                class="w-full mx-auto"
                name="web_link"
                type="text"
                label="web_link_optional"
                placeholder="http://"
              ></h-text-field>

              <div class="flex flex-col w-full mt-1">
                <label
                  for="IDForLicense"
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  >{{ $t("license") }} ({{ $t("optional") }})</label
                >
                <h-file-upload
                  name="license"
                  id="IDForLicense"
                  :limit="1"
                  accept="image/*"
                  size="1 mb"
                />
              </div>

              <div class="flex flex-col w-full mt-1 mb-10">
                <h-rich-text
                  label="service_detail"
                  toolbar="minimal"
                  name="service_detail"
                />
              </div>
              <div>
                <div
                  class="flex w-full items-center my-5 transition-all duration-300 ease-in-out"
                >
                  <p
                    v-if="accountList.length > 0"
                    class="flex-1 font-bold cursor-pointer transition-all duration-300 ease-in-out text-primaryvar4"
                  >
                    Social Accounts
                  </p>
                  <p
                    @click="showPopUp = !showPopUp"
                    class="w-fit font-semibold text-neutral300/60 hover:text-neutral300/80 cursor-pointer transition-all duration-300 ease-in-out border-2 border-primaryvar1 hover:border-primary/20 rounded-lg border-opacity-20 py-1 px-2"
                  >
                    Add Social Account
                  </p>
                </div>
                <div class="flex fl flex-wrap gap-4 w-full my-5">
                  <div
                    v-for="account in accountList"
                    :key="account.key"
                    class="flex flex-wrap items-center text-sm gap-2 w-fit border border-primaryvar1 rounded-full border-opacity-50 py-2 px-4"
                  >
                    <p class="font-bold text-primaryvar2">{{ account.key }}:</p>

                    <span class="text-neutral-500 font-semibold"
                      >{{ account.value }}
                    </span>

                    <Icon
                      @click="() => removeAccount(account)"
                      name="material-symbols:cancel-outline-rounded"
                      class="rounded-tr-md rounded-bl-md w-5 h-5 -mr-1 text-red cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
                    />
                  </div>
                </div>

                <h-dialog
                  v-model="showPopUp"
                  @close="showPopUp = !showPopUp"
                  @form-submit="addSocialMedialAccount"
                  title="add_social_account"
                  content="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sit vero
        molestiae pariatur."
                >
                  <template #content>
                    <h-select
                      class="mt-2"
                      :items="['Facebook', 'Instagram', 'Telegram']"
                      name="social_media_type"
                      label="social_media_type"
                    />

                    <div class="-mt-2">
                      <h-text-field
                        name="social_media_link"
                        :placeholder="$t('social_media_link')"
                        rules="required"
                        type="text"
                        label="social_media_link"
                      />
                    </div>

                    <HButton
                      type="submit"
                      class="mt-5 w-full"
                      rounded-class="rounded-md"
                      :gradient="false"
                      btn-name-class="font-bold"
                      btn-name="add_social_account"
                    ></HButton>
                  </template>
                </h-dialog>
              </div>
            </div>
          </template>
        </template>
        <template #media="{ state, index }">
          <template v-if="state === index">
            <div
              class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 w-full gap-x-6 gap-y-3 my-10 px-5 pb-10"
            >
              <div class="flex flex-col w-full mt-1">
                <label
                  for="IDForLogo"
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  >{{ $t("brand") }}
                </label>
                <h-file-upload
                  name="logo"
                  id="IDForLogo"
                  :limit="1"
                  accept="image/*"
                  size="1 mb"
                />
              </div>

              <div class="flex flex-col w-full mt-1">
                <label
                  for="IDForOtherMedia"
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  >{{ $t("other_medias") }} ({{ $t("optional") }})</label
                >
                <h-file-upload
                  name="other_media"
                  id="IDForOtherMedia"
                  :limit="4"
                  accept="image/*"
                  size="1 mb"
                />
              </div>
            </div>
          </template>
        </template>
      </h-stepper>
    </div>
  </main>
</template>

<script setup lang="ts">
import fetchVirtualServiceCategories from "@/apollo/query/service/virtual/fetchCategory.gql";
import addVirtualService from "@/apollo/mutation/service/virtual/addVirtualService.gql";
import { useAuth } from "@/store/auth";

const showLoading = ref<boolean>(false);
const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
interface AccountInterface {
  key?: string;
  value?: string;
}
const accountList = ref<Array<AccountInterface>>([]);
const showPopUp = ref(false);

interface CategoryInterface {
  id: number;
  logo: string;
  primary: {
    id: number;
    translation_contents: {
      language_type: string;
      name: string;
    }[];
  };
}

const categoryResult = ref<Array<CategoryInterface>>([]);
const { locale } = useI18n();

const categoryAt = ref<{ id: number; name?: string } | undefined>();
let category = computed(() => {
  return categoryResult.value.map((category) => {
    return {
      id: category.id,
      name: category.primary.translation_contents.find((lng) => {
        return lng.language_type === locale.value;
      })?.name,
    };
  });
});

watch(locale, () => {
  if (categoryAt.value)
    categoryAt.value = category.value.find((cat) => {
      return cat.id === categoryAt.value?.id;
    });
});

const {
  mutate: addService,
  onDone: onAddServiceDone,
  onError: onAddServiceError,
} = useCustomMutation(addVirtualService);

const { onResult: onCategoryFetchResult, onError: onCategoryFetchError } =
  useCustomQuery(fetchVirtualServiceCategories);

onCategoryFetchResult((data) => {
  const categoryFetchedResult = data.data
    .virtual_service_categories as Array<CategoryInterface>;
  categoryResult.value = categoryFetchedResult;
});

onCategoryFetchError((error) => {
  console.log(error);
});

onAddServiceDone((data) => {
  showLoading.value = false;
  showNotification(true, "You have successfully added a Service.");
  const router = useRouter();
  router.push({ name: "my-services-index-virtual" });
});

onAddServiceError((error) => {
  showLoading.value = false;
  showNotification(false, "Error : " + error);
});

const addSocialMedialAccount = (account: {
  social_media_type: string;
  social_media_link: string;
}) => {
  const { social_media_type: key, social_media_link: value } = account;

  let ignorePush = false;
  accountList.value.forEach((acc) => {
    if (acc.key === key) {
      acc.value = value;
      ignorePush = true;
      return;
    }
  });
  if (!ignorePush)
    accountList.value?.push({
      key,
      value,
    });

  // hide the popup
  showPopUp.value = false;
};

const removeAccount = (account: AccountInterface) => {
  accountList.value = accountList.value.filter((acc) => acc !== account);
};

const dynamicSchema = computed(() => [
  {
    service_trade_name: "required",
    category: "required",
    phone_number: "required|phoneNumber",
    service_detail: "required",
  },
  {
    logo: "required",
  },
]);

const handleAddService = async (value: any) => {
  showLoading.value = true;
  const { uploadImages } = useFirebaseClient();

  const licenseImageURL = ref<string>("");
  const otherMediaImagesUrl = ref<Array<string>>([]);
  const logoImageUrl = ref<string>("");
  const { uid } = useAuth();

  if (value.license) {
    const { urls: urlsLicense, error: errorLicense } = await uploadImages(
      value.license,
      "images/services/virtual"
    );

    if (urlsLicense) {
      licenseImageURL.value = urlsLicense[0];
    }
  }
  if (value.other_media) {
    const { urls: urlsOtherImage, error: errorOtherImage } = await uploadImages(
      value.other_media,
      "images/services/virtual"
    );

    if (urlsOtherImage) {
      otherMediaImagesUrl.value = urlsOtherImage;
    }
  }
  if (value.logo) {
    const { urls: urlsLogo, error: errorLogo } = await uploadImages(
      value.logo,
      "images/services/virtual"
    );

    if (urlsLogo) {
      logoImageUrl.value = urlsLogo[0];
    }
  }

  const object = {
    title: value.service_trade_name,
    description: value.service_detail,
    logo: logoImageUrl.value || null,
    category_id: value.category.id,
    service_owner: uid,
    license: licenseImageURL.value || null,
    web_link: value.web_link,
    phone_number: value.phone_number,
    virtual_service_media: {
      data:
        otherMediaImagesUrl.value?.map((img) => {
          return { url: img };
        }) || null,
    },
    social_media: accountList.value.length ? accountList.value : null,
  };

  addService({ object });
};

const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
</script>
