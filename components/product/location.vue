<template>
  <main
    class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 w-full gap-x-6 gap-y-3 my-10 px-5"
  >
    <div class="flex flex-col">
      <h-select
        :items="cities"
        label="City / Region"
        name="region_or_administration"
        v-model="city"
      >
      </h-select>
      <h-select
        :items="subCity"
        label="Sub City"
        name="sub_city"
        v-model="sub_city_model"
      >
      </h-select>

      <h-text-area
        name="location_detail"
        label="Location Detail"
        placeholder="Location Detail"
      />
    </div>

    <div class="w-full">
      <h-interactive-geo-location
        v-if="center"
        :center="center"
        :maxZoom="20"
        :toTrackWithRealAddressLine="true"
        :isToAddLocation="true"
        @getLocation="getLocation"
        class="w-full h-full"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
const { value: mapValue } = useField("map_location");
const { value: subCityValue } = useField("sub_city", "required");
const { locale } = useI18n();

const props = defineProps({
  locationData: { type: Object },
  subCityId: { type: Number, required: false },
  cityId: { type: Number, required: false },
  location: { type: Object, required: false },
});

const cities = computed(() => {
  const tc = ref();
  const ts = ref();
  return props.locationData?.map((data: any) => {
    tc.value = data.original_language.translation_contents;
    const sub_cities = data.sub_cities.map((sub: any) => {
      ts.value = sub.original_language.translation_contents;
      return {
        id: sub.id,
        name: ts.value.find((lng: any) => {
          return lng.language_type == locale.value;
        }).name,
        latitude: sub.latitude,
        longitude: sub.longitude,
      };
    });
    return {
      id: data.id,
      name: tc.value.find((lng: any) => {
        return lng.language_type == locale.value;
      }).name,
      sub_city: sub_cities,
    };
  });
});

watch(locale, (newValue) => {
  if (city.value) {
    getSubCity(city.value.id);
  }
});

const { value } = useField("region_or_administration");
const { value: sub_city_value } = useField("sub-city");
const subCity = ref([]);
const sub_city_model = sub_city_value.value ? ref(sub_city_value.value) : ref();
const getSubCity = (id: number) => {
  city.value = cities.value.find((cty: any) => cty.id == id);
  subCity.value = cities.value.find((cty: any) => cty.id == id).sub_city;
  if (sub_city_model.value) {
    sub_city_model.value = subCity.value.find(
      (cty: any) => cty.id == sub_city_model.value.id
    );
  }
};
const city =
  props.cityId && !value.value
    ? ref(cities.value.find((cty: any) => cty.id == props.cityId))
    : ref(value.value);
if (city.value) {
  getSubCity(city.value.id);
}

const center = ref<Center>();

watch(city, (newValue, oldValue) => {
  if (newValue.id != oldValue?.id) {
    subCityValue.value = "";
    getSubCity(newValue.id);
  }
});

watch(sub_city_model, (newValue, oldValue) => {
  if (newValue && oldValue?.id != newValue.id) {
    mapValue.value = { lat: newValue.latitude, lng: newValue.longitude };
    center.value = { lat: newValue.latitude, lng: newValue.longitude };
  }
});

if (props.subCityId && !sub_city_value.value) {
 
  sub_city_model.value = city.value.sub_city.find(
    (cty: any) => cty.id == props.subCityId
  );
  getSubCity(city.value.id);
}

interface Center {
  lat: number;
  lng: number;
}

onMounted(() => {
  if (props.location && !mapValue.value) {
    const location = { lat: props.location.lat, lng: props.location.lng };
    mapValue.value = location;
    center.value = location;
 
  } else if (mapValue.value) {
    center.value = mapValue.value as { lat: number; lng: number };
    
  } else {
    navigator.geolocation.getCurrentPosition((pos) => {
      const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapValue.value = location;
      center.value = location;
    });
  }
});
const getLocation = (e: any) => {
  mapValue.value = e;
  center.value = e;
};
</script>
