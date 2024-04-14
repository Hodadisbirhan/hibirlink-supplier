<template>
  <main class="w-full">
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h-loading
      v-if="showLoadingForMutation"
      :show-loading="showLoadingForMutation"
    />
    <h-loading v-if="showLoading.value" :show-loading="showLoading.value" />

    <div
      v-if="service"
      class="w-full py-5 flex flex-col gap-5 items-center justify-center min-h-[calc(100vh-3.7rem)] max-w-7xl mx-auto"
    >
      <h1
        class="w-full text-center text-base md:text-lg xl:text-2xl font-bold text-neutral200"
      >
        {{ $t("edit_realtime_service") }}
      </h1>

      <h-stepper
        :isForAdd="false"
        @submit="handleUpdateService"
        :steps="[
          { key: 'basics', value: $t('basics') },
          { key: 'media', value: $t('media') },
          {
            key: 'address',
            value: $t('address'),
          },
        ]"
        :validation-schema="dynamicSchema"
        :initial-value="initialValue"
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
                />
              </div>

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
            </div>

            <div class="flex flex-col px-5 w-full mt-24 md:mt-10">
              <h-rich-text
                quillClass="min-h-[10rem]"
                label="service_detail"
                toolbar="minimal"
                name="service_detail"
              />
            </div>

            <div class="flex flex-col px-5 w-full">
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
              class="grid grid-cols-1 w-full gap-x-6 gap-y-3 my-10 px-5 pb-10"
            >
              <h-image-editor
                @notifyImageDelete="handleImageDelete"
                v-if="service && service.media.length"
                :mutate-gql="deleteImages"
                :image="service.media"
              />

              <div class="flex flex-col w-full mt-1">
                <label
                  for="IDForOtherMedia"
                  class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm"
                  >{{ $t("other_medias") }} ({{ $t("optional") }})</label
                >
                <h-file-upload
                  name="other_media"
                  id="IDForOtherMedia"
                  @exceed:limit="exceedLimit"
                  :limit="4 - service.media.length ?? 0"
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
              :initialData="initialData"
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

                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span class="text-primaryvar2 font-bold">
                    Location description :</span
                  >
                  <p class="font-bold text-neutral300">
                    {{ location.description }}
                  </p>
                </div>

                <div class="flex absolute bottom-2 right-2 gap-2 font-bold">
                  <p
                    @click="() => handleEditLocation(location, index)"
                    name="material-symbols:cancel-outline-rounded"
                    class="rounded-tr-md text-primary rounded-bl-md cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
                  >
                    Edit
                  </p>

                  <p
                    @click="() => handleRemoveLocation(location, index)"
                    name="material-symbols:cancel-outline-rounded"
                    class="rounded-tr-md rounded-bl-md text-red cursor-pointer shrink-0 transition-colors ease-in-out duration-300"
                  >
                    Delete
                  </p>
                </div>
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
import fetchRealtimeServiceByID from "@/apollo/query/service/realtime/fetchRealtimeServiceByID.gql";
import updateBasicRealtimeService from "@/apollo/mutation/service/realtime/updateBasicRealtimeService.gql";
import addRealtimeServiceMedia from "@/apollo/mutation/service/realtime/addRealtimeServiceMedia.gql";
import deleteImages from "@/apollo/mutation/service/realtime/deleteImages.gql";
import deleteLocationByID from "@/apollo/mutation/service/realtime/deleteLocation.gql";
import updateLocationByPK from "@/apollo/mutation/service/realtime/updateLocation.gql";
import addLocationOne from "@/apollo/mutation/service/realtime/addLocation.gql";

const route = useRoute();
const initialData = ref<{
  id?: number;
  city_id: number;
  sub_city_id: number;
  description: string;
  directions: { lat?: number; lng?: number };
}>();

const service_id = computed(() => {
  const _routeParams = route.params as { service_id: string };
  return Number(_routeParams.service_id);
});

const currentMapValue = ref<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
const handleUpdateVModel = (e: any) => {
  currentMapValue.value = e;
};

const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");

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

const exceedLimit = (msg: any) => {
  showNotification(
    false,
    "allowed image to upload is " + (msg - service.value.media.length)
  );
};
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
  mutate: updateBasics,
  onError: onUpdateBasicsError,
  onDone: onUpdateBasicsDone,
} = useCustomMutation(updateBasicRealtimeService);

const {
  mutate: addServiceMedia,
  onDone: onAddRealtimeServiceMediaDone,
  onError: onAddRealtimeServiceMediaError,
} = useCustomMutation(addRealtimeServiceMedia);

const {
  mutate: deleteLocation,
  onDone: onDeleteLocationDone,
  onError: onDeleteLocationError,
} = useCustomMutation(deleteLocationByID);

const {
  mutate: updateLocation,
  onDone: onUpdateLocationDone,
  onError: onUpdateLocationError,
} = useCustomMutation(updateLocationByPK);

const {
  mutate: addLocation,
  onDone: onAddLocationDone,
  onError: onAddLocationError,
} = useCustomMutation(addLocationOne);

const {
  onResult: onLocationFetchResult,
  onError: onLocationFetchError,
  loading: loadingLocations,
} = useCustomQuery(fetchLocations);
const {
  onResult: onCategoryFetchResult,
  onError: onCategoryFetchError,
  loading: loadingCategories,
} = useCustomQuery(fetchRealtimeServiceCategories);
const {
  result,
  onError: onFetchServiceError,
  refetch: refetchService,
  loading,
} = useCustomQuery(fetchRealtimeServiceByID, { service_id: service_id.value });

const showLoading = computed(() => {
  return loading || loadingCategories || loadingLocations;
});

const showLoadingForMutation = ref<boolean>(false);

onUpdateBasicsDone((data) => {
  showLoadingForMutation.value = false;
  showNotification(true, "Basics Updated Successfully");
});

onUpdateBasicsError((error) => {
  showLoadingForMutation.value = false;
  showNotification(false, error + "");
});

onAddRealtimeServiceMediaDone((data) => {
  showLoadingForMutation.value = false;
  showNotification(true, "Media added Successfully");
  refetchService();
});

onAddRealtimeServiceMediaError((error) => {
  showLoadingForMutation.value = false;
});

onDeleteLocationDone((data) => {
  console.log(data);
});

onDeleteLocationError((error) => {
  console.log(error);
});

onUpdateLocationDone((data) => {
  showNotification(true, "Location Updated Successfully");
  refetchService();
});

onUpdateLocationError((error) => {
  console.log(error);
});

onAddLocationDone((data) => {
  showNotification(true, "Location Added Successfully");
  refetchService();
});

onAddLocationError((error) => {
  console.log(error);
});

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

const service = computed(() => {
  return result.value ? result.value.service : null;
});

onFetchServiceError((error) => {
  console.log(error);
});

watch(service, (new_value, oldValue) => {
  if (new_value) {
    {
      categoryAt.value = category.value.find((cat) => {
        return cat.id === new_value.category_id;
      });

      if (new_value.address) {
        locationList.value = [];
        new_value.address.map(
          (address: {
            description: string;
            id: number;
            latitude: number;
            longitude: number;
            sub_city: { id: number; region_city: { id: number } };
          }) => {
            const city = {
              id: address.sub_city.region_city.id,
              name: location.value.find(
                (city: any) => city.id === address.sub_city.region_city.id
              )?.original_language.translation_contents[1].name,
            };

            const subCity = {
              id: address.sub_city.id,
              name: location.value
                .find(
                  (city: any) => city.id === address.sub_city.region_city.id
                )
                ?.sub_cities.find(
                  (sub_city: any) => sub_city.id === address.sub_city.id
                )?.original_language.translation_contents[1].name,
            };

            const directions = {
              lat: address.latitude,
              lng: address.longitude,
            };

            handleAddLocation({
              id: address.id,
              city,
              subCity,
              description: address.description,
              directions,
            });
          }
        );
      }
    }
  }
});

const initialValue = computed(() => {
  if (service.value) {
    return {
      service_trade_name: service.value.title,
      phone_number: service.value.phone_number,
      license: service.value.license,
      logo: service.value.logo,
      service_detail: service.value.description,
      working_day: service.value.availability.per_week,
      start_time: service.value.availability.per_day.start_time,
      end_time: service.value.availability.per_day.end_time,
    };
  } else {
    return {};
  }
});

interface LocationInterface {
  id?: number;
  city: { id: number; name: string | undefined };
  subCity: { id: number; name: string | undefined };
  description: string;
  directions: { lng?: number; lat?: number };
  addType?: string;
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
    logo: "required",
  },
  {},
  {
    region_or_administration: !locationList.value.length && "required",
    sub_city: !locationList.value.length && "required",
    location_detail: !locationList.value.length && "required",
  },
]);

const handleAddLocation = (location: LocationInterface) => {
  const { id, city, subCity, description, directions, addType } = location;

  if (addType) {
    let ignorePush = false;
    locationList.value.forEach((loc) => {
      if (loc.description === description && loc.directions === directions) {
        showNotification(false, "Location Already Set");
        ignorePush = true;
        return;
      }
    });
    if (!ignorePush) {
      if (addType === "update") {
        const object = {
          subcity_id: subCity.id,
          longitude: directions.lng,
          latitude: directions.lat,
          description: description,
        };
        updateLocation({ location_id: id, object });
      }
      if (addType === "add_location") {
        const object = {
          service_id: service_id.value,
          subcity_id: subCity.id,
          longitude: directions.lng,
          latitude: directions.lat,
          description: description,
        };
        addLocation({ object });
      }
    }
  }

  if (addType === undefined) {
    locationList.value?.push({
      id,
      city,
      subCity,
      description,
      directions: directions,
    });
  }
};
const handleRemoveLocation = (location: LocationInterface, index: number) => {
  const locId = location.id;
  locationList.value = locationList.value.filter(
    (loc, _index: number) => _index !== index
  );

  if (locId) {
    deleteLocation({ location_id: locId });
  }
};

const handleEditLocation = (location: LocationInterface, index: number) => {
  if (
    initialData.value?.description ||
    initialData.value?.city_id ||
    initialData.value?.sub_city_id
  )
    return;
  initialData.value = {
    id: location.id,
    city_id: location.city.id,
    sub_city_id: location.subCity.id,
    description: location.description,
    directions: location.directions,
  };

  locationList.value = locationList.value.filter((loc) => loc !== location);
};

const handleUpdateService = async (value: any, state: number) => {
  const { uploadImages } = useFirebaseClient();
  showLoadingForMutation.value = true;
  if (state === 0) {
    const licenseImageURL = ref<string>("");
    const logoImageUrl = ref<string>("");

    if (value.license) {
      if (typeof value.license === "string") {
        licenseImageURL.value = value.license;
      } else {
        const { urls: urlsLicense, error: errorLicense } = await uploadImages(
          value.license,
          "images/services/realtime"
        );
        if (urlsLicense) {
          licenseImageURL.value = urlsLicense[0];
        }
      }
    }

    if (value.logo) {
      if (typeof value.logo === "string") {
        logoImageUrl.value = value.logo;
      } else {
        const { urls: urlsLogo, error: errorLogo } = await uploadImages(
          value.logo,
          "images/services/realtime"
        );
        if (urlsLogo) {
          logoImageUrl.value = urlsLogo[0];
        }
      }
    }

    const object = {
      title: value.service_trade_name,
      description: value.service_detail,
      logo: logoImageUrl.value || null,
      category_id: value.category.id,
      license: licenseImageURL.value || null,
      availability: {
        per_week: value.working_day,
        per_day: { start_time: value.start_time, end_time: value.end_time },
      },
      phone_number: value.phone_number,
    };

    updateBasics({ service_id: service_id.value, object });
  }

  if (state === 1) {
    const otherMediaImagesUrl = ref<Array<string>>([]);
    if (value.other_media) {
      const { urls: urlsOtherImage, error: errorOtherImage } =
        await uploadImages(value.other_media, "images/services/realtime");
      if (urlsOtherImage) {
        otherMediaImagesUrl.value = urlsOtherImage;
      }
    }

    const object =
      otherMediaImagesUrl.value?.map((img) => {
        return { url: img, service_id: service_id.value };
      }) || null;

    if (object.length) addServiceMedia({ object });
    else showLoadingForMutation.value = false;
  }

  if (state === 2) {
    showLoadingForMutation.value = false;
  }
};

const handleImageDelete = () => {
  showNotification(true, "Image(s) deleted Successfully");
  refetchService();
};

const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
</script>
