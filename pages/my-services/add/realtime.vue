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
        {{ $t("add_realtime_service") }}
      </h1>

      <h-stepper
        @submit="handleAddService"
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'media', value: $t('media') },
          {
            key: 'address',
            value: $t('address'),
          },
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
              <br class="hidden md:block" />

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
                  type="image"
                />
              </div>

              <div class="flex flex-col w-full mt-1">
                <h-rich-text
                  label="service_detail"
                  toolbar="minimal"
                  name="service_detail"
                />
              </div>
            </div>

            <div class="flex flex-col px-5 w-full mt-24 md:mt-5">
              <h1 class="text-xl text-primary font-bold">
                {{ $t("working_time") }}
              </h1>
              <service-availability />
              <span class="text-sm text-neutral300 font-semibold mt-2 mb-1">
                {{ $t("per_day") }}</span
              >
              <div class="flex gap-5">
                <h-text-field
                  class="max-w-[15rem] w-full"
                  name="start_time"
                  type="time"
                  placeholder="Start Time"
                  label="start_time"
                ></h-text-field>
                <h-text-field
                  class="max-w-[15rem] w-full"
                  name="end_time"
                  type="time"
                  placeholder="End Time"
                  label="end_time"
                ></h-text-field>
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
                  type="image"
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
                  type="image"
                />
              </div>
            </div>
          </template>
        </template>
        <template #address="{ state, index }">
          <template v-if="state === index">
            <service-location
              @update_v_model="handleUpdateVModel"
              :v_model="currentMapValue"
              :location="location"
              @addLocation="handleAddLocation"
            />
            <div class="w-full flex flex-wrap gap-5 mb-10">
              <div
                v-for="(location, index) in locationList"
                :key="location.city.id"
                class="items-center max-w-xs w-full relative px-3 py-4 text-sm gap-2 shadow-sm bg-light400 rounded-sm border-opacity-50"
              >
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-primaryvar2 font-bold"> City :</span>
                  <p class="font-bold text-neutral300">
                    {{ location.city.name }}
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-primaryvar2 font-bold"> Sub City :</span>
                  <p class="font-bold text-neutral300">
                    {{ location.subCity.name }}
                  </p>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-primaryvar2 font-bold">
                    Location description :</span
                  >
                  <p class="font-bold text-neutral300">
                    {{ location.description }}
                  </p>
                </div>

                <Icon
                  @click="() => handleRemoveLocation(location, index)"
                  name="material-symbols:cancel-outline-rounded"
                  class="rounded-tr-md absolute top-2 right-2 rounded-bl-md w-5 h-5 -mr-1 text-red cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
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
import fetchLocations from "@/apollo/query/fetchLocations.gql";
import fetchRealtimeServiceCategories from "@/apollo/query/service/realtime/fetchRealtimeServiceCategories.gql";
import addRealtimeService from "@/apollo/mutation/service/realtime/addRealtimeService.gql";
import { useAuth } from "@/store/auth";
import { useField } from "vee-validate";

const currentMapValue = ref<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
const showLoading = ref<boolean>(false);
const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");

const handleUpdateVModel = (e: any) => {
  currentMapValue.value = e;
};

interface AddressInterface {
  id: number;
  original_language: {
    translation_contents: {
      language_type: string;
      name: string;
    }[];
  };

  sub_cities: {
    id: number;
    latitude: number;
    longitude: number;
    original_language: {
      translation_contents: {
        language_type: string;
        name: string;
      }[];
    };
  }[];
}

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

const location = ref<Array<AddressInterface>>([]);
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
} = useCustomMutation(addRealtimeService);

const { onResult: onLocationFetchResult, onError: onLocationFetchError } =
  useCustomQuery(fetchLocations);
const { onResult: onCategoryFetchResult, onError: onCategoryFetchError } =
  useCustomQuery(fetchRealtimeServiceCategories);

onLocationFetchResult((data) => {
  const locationFetchedResult = data.data.cities as Array<AddressInterface>;
  location.value = locationFetchedResult;
});

onLocationFetchError((error) => {
  console.log(error);
});

onCategoryFetchResult((data) => {
  const categoryFetchedResult = data.data
    .realtime_service_categories as Array<CategoryInterface>;
  categoryResult.value = categoryFetchedResult;
});

onCategoryFetchError((error) => {
  console.log(error);
});

onAddServiceDone((data) => {
  showLoading.value = false;
  showNotification(true, "You have successfully added a Service.");
  const router = useRouter();
  router.push({ name: "my-services-index" });
});

onAddServiceError((error) => {
  showLoading.value = false;
  showNotification(false, "Error : " + error);
});

interface LocationInterface {
  city: { id: number; name: string };
  subCity: { id: number; name: string };
  description: string;
  directions: { lng?: number; lat?: number };
}
const locationList = ref<Array<LocationInterface>>([]);

const dynamicSchema = computed(() => [
  {
    service_trade_name: "required",
    category: "required",
    phone_number: "required|phoneNumber",
    service_detail: "required",
    working_day: "required",
    start_time: "required",
    end_time: "required|endTime:start_time",
  },
  {
    logo: "required",
  },
  {
    region_or_administration: !locationList.value.length && "required",
    sub_city: !locationList.value.length && "required",
    location_detail: !locationList.value.length && "required",
  },
]);

const handleAddLocation = (location: LocationInterface) => {
  const { city, subCity, description, directions } = location;

  let ignorePush = false;
  locationList.value.forEach((loc) => {
    if (
      loc.description === description &&
      loc.directions.lat === directions.lat
    ) {
      ignorePush = true;
      showNotification(false, "Location Already Exist.");
      return;
    }
  });

  if (!ignorePush)
    locationList.value?.push({
      city,
      subCity,
      description,
      directions: directions,
    });
};
const handleRemoveLocation = (location: LocationInterface, index: number) => {
  locationList.value = locationList.value.filter(
    (loc, _index: number) => _index !== index
  );
};

const handleAddService = async (value: any) => {
  showLoading.value = true;
  const { uploadImages } = useFirebaseClient();

  const licenseImageURL = ref<string>("");
  const otherMediaImagesUrl = ref<Array<string>>([]);
  const logoImageUrl = ref<string>("");
  const { uid } = useAuth();

  if (
    value.region_or_administration?.id &&
    value.sub_city?.id &&
    value.location_detail
  )
    handleAddLocation({
      city: {
        id: value.region_or_administration.id,
        name: value.region_or_administration.name,
      },
      subCity: {
        id: value.sub_city.id,
        name: value.sub_city.name,
      },
      description: value.location_detail,
      directions: {
        lat: currentMapValue.value.lat,
        lng: currentMapValue.value.lng,
      },
    });

  if (value.license) {
    const { urls: urlsLicense, error: errorLicense } = await uploadImages(
      value.license,
      "images/services/realtime"
    );

    if (urlsLicense) {
      licenseImageURL.value = urlsLicense[0];
    }
  }
  if (value.other_media) {
    const { urls: urlsOtherImage, error: errorOtherImage } = await uploadImages(
      value.other_media,
      "images/services/realtime"
    );

    if (urlsOtherImage) {
      otherMediaImagesUrl.value = urlsOtherImage;
    }
  }
  if (value.logo) {
    const { urls: urlsLogo, error: errorLogo } = await uploadImages(
      value.logo,
      "images/services/realtime"
    );

    if (urlsLogo) {
      logoImageUrl.value = urlsLogo[0];
    }
  }

  const serviceAddressData = ref<
    {
      subcity_id: number;
      longitude: number | undefined;
      latitude: number | undefined;
      description: string;
    }[]
  >([]);

  if (locationList.value.length > 0) {
    serviceAddressData.value = locationList.value.map((_location) => {
      return {
        subcity_id: _location.subCity.id,
        longitude: _location.directions.lng,
        latitude: _location.directions.lat,
        description: _location.description,
      };
    });
  }

  const object = {
    title: value.service_trade_name,
    description: value.service_detail,
    logo: logoImageUrl.value || null,
    category_id: value.category.id,
    service_owner: uid,
    license: licenseImageURL.value || null,
    availability: {
      per_week: value.working_day,
      per_day: { start_time: value.start_time, end_time: value.end_time },
    },
    phone_number: value.phone_number,
    realtime_service_media: {
      data:
        otherMediaImagesUrl.value?.map((img) => {
          return { url: img };
        }) || null,
    },
    service_addresses: {
      data: serviceAddressData.value,
    },
  };

  addService({ object });
};

const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
</script>
