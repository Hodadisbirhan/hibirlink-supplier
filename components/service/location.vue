<template>
  <main
    class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 w-full gap-x-6 gap-y-3 my-10 px-5"
  >
    <div class="flex flex-col">
      <h-select
        :items="cityList"
        label="region_city_administration"
        name="region_or_administration"
        v-model="regionAt"
      >
      </h-select>
      <h-select
        :items="subCityList || []"
        label="sub_city"
        name="sub_city"
        v-model="subCityAt"
      >
      </h-select>

      <h-text-area
        name="location_detail"
        :label="$t('location_detail') + '(' + $t('optional') + ')'"
        :placeholder="$t('location_detail')"
        v-model="locationDescription"
      />

      <p
        @click="onAddLocation"
        class="w-fit group ml-auto mt-2 font-bold text-neutral300/60 hover:text-neutral300 cursor-pointer transition-all duration-300 ease-in-out border-2 border-neutral300/40 hover:border-neutral300 rounded-lg border-opacity-20 py-1 px-2"
      >
        <Icon
          name="material-symbols:add-location-alt"
          class="w-5 h-5 text-neutral300/60 group-hover:text-neutral300 transition-colors duration-300 ease-in-out"
        />
        {{ $t(btnName) }}
      </p>
    </div>

    <div class="w-full z-0">
      <h-interactive-geo-location
        v-if="center"
        :center="center"
        :maxZoom="20"
        :toTrackWithRealAddressLine="true"
        :isToAddLocation="true"
        @getLocation="getLocation"
        class="w-full h-[20rem] mt-6 py-5"
      />
    </div>
  </main>
</template>
<script setup lang="ts">
import { useField } from "vee-validate";
const btnName = ref<string>("add_location");
const { value: mapValue } = useField("map_value");
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

interface PropsInterface {
  location: Array<AddressInterface>;
  v_model?: { lat: number; lng: number };
  initialData?: {
    id?: number;
    city_id: number;
    sub_city_id: number;
    description: string;
    directions: { lat?: number; lng?: number };
  };
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) btnName.value = "update";
    regionAt.value = cityList.value.find(
      (city) => city.id === newData?.city_id
    );

    setTimeout(() => {
      subCityAt.value = regionAt.value?.subCities.find(
        (sub_cities) => sub_cities.id === newData?.sub_city_id
      );
      locationDescription.value = newData?.description;
      setTimeout(() => {
        center.value = newData?.directions;
        mapValue.value = center.value;
      }, 50);
    }, 50);
  }
);
const props = defineProps<PropsInterface>();

const emits = defineEmits(["addLocation", "update_v_model"]);

interface CenterInterface {
  lat?: number;
  lng?: number;
}
const center = ref<CenterInterface>();
onMounted(() => {
  if (mapValue.value) {
    center.value = mapValue.value;
  } else
    navigator.geolocation.getCurrentPosition((pos) => {
      center.value = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapValue.value = center.value;
      emits("update_v_model", mapValue.value);
    });
});

const subCityList = ref<
  | { id: number; name?: string; latitude: number; longitude: number }[]
  | undefined
>([]);

const { locale } = useI18n();

const { value: subCityValue } = useField("sub_city", "required");
const { value: cityValue } = useField("region_or_administration", "required");
const { value: locationDetail } = useField("location_detail", "required");

const regionAt = ref<
  | {
      id: number;
      name?: string;
      subCities: {
        id: number;
        name?: string;
        latitude: number;
        longitude: number;
      }[];
    }
  | undefined
>(cityValue.value as any);

const subCityAt = ref<
  | {
      id: number;
      name?: string;
      latitude: number;
      longitude: number;
    }
  | undefined
>(subCityValue.value as any);

const directions = ref<{ lat: number; lng: number }>();
const locationDescription = ref<string | undefined>(locationDetail as any);

const cityList = computed(() => {
  return props.location.map((locations) => {
    return {
      id: locations.id,
      name: locations.original_language.translation_contents.find((lng) => {
        return lng.language_type === locale.value;
      })?.name,
      subCities: locations.sub_cities.map((subCities) => {
        return {
          id: subCities.id,
          latitude: subCities.latitude,
          longitude: subCities.longitude,
          name: subCities.original_language.translation_contents.find((lng) => {
            return lng.language_type === locale.value;
          })?.name,
        };
      }),
    };
  });
});

if (cityList.value && subCityList.value?.length === 0) {
  if (cityValue.value) {
    const { id } = cityValue.value as { id: number };
    subCityList.value = cityList.value.find((cities) => {
      return cities.id === id;
    })?.subCities;
  }
}

watch(locale, (newValue) => {
  if (cityValue.value) {
    const { id } = cityValue.value as { id: number };
    regionAt.value = cityList.value.find((cty) => cty.id === id);
    subCityList.value = cityList.value.find((cities) => {
      return cities.id === id;
    })?.subCities;

    if (subCityValue.value && subCityList.value) {
      const { id } = subCityValue.value as { id: number };
      subCityAt.value = subCityList.value.find((sub_city) => {
        return sub_city.id === id;
      });
    }
  }
});
watch(regionAt, (newValue, oldValue) => {
  if (newValue?.id !== oldValue?.id && newValue) {
    subCityValue.value = "";
    subCityList.value = newValue?.subCities;
  }
});

watch(subCityAt, (newValue) => {
  if (newValue) {
    center.value = {
      lat: newValue.latitude,
      lng: newValue.longitude,
    };

    directions.value = {
      lat: newValue.latitude,
      lng: newValue.longitude,
    };
    mapValue.value = directions.value;
    emits("update_v_model", mapValue.value);
  }
});

const onAddLocation = () => {
  if (regionAt.value && subCityAt.value && locationDescription.value) {
    emits("addLocation", {
      id: props.initialData?.id,
      city: regionAt.value,
      subCity: subCityAt.value,
      description: locationDescription.value,
      directions: mapValue.value,
      addType: btnName.value,
    });

    regionAt.value = undefined;
    subCityAt.value = undefined;
    locationDescription.value = undefined;

    btnName.value = "add_location";
  }
};

const getLocation = (e: any) => {
  center.value = e;

  directions.value = {
    lat: e.lat,
    lng: e.lng,
  };

  mapValue.value = directions.value;
  emits("update_v_model", mapValue.value);
};
</script>
