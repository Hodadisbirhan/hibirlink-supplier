<template>
  <div
    class="w-full mx-2 rounded hover:shadow-[0px_0px_24px_8px_rgba(120,120,120,0.2)] transition-all ease-in-out duration-300 cursor-pointer p-1 bg-white py-3"
  >
    <div class="flex gap-4 group items-center bg-white px-2 text-xs">
      <div class="w-[100px] h-[200px] md:w-[200px]">
        <h-swiper :images="images" />
      </div>
      <div class="flex-1 flex text-neutral300">
        <div class="flex-1">
          <div class="flex gap-3 items-center py-3">
            <h2 class="font-bold text-sm text-neutral200">{{ title }}</h2>
          </div>
          <div class="flex items-center gap-5 py-1">
            <p class="font-bold text-neutral200">
              {{ availability?.per_week.length }}/7 days
            </p>
            <p class="text-neutral300 font-semibold">
              {{ convertTimeToAM_PM(availability.per_day.start_time) }} -
              {{ convertTimeToAM_PM(availability.per_day.end_time) }}
            </p>
            <div
              class="flex gap-1 items-center px-2 py-1 border rounded-full"
              :class="
                status === 'pending'
                  ? 'border-orange text-orange'
                  : 'border-primary text-primary'
              "
            >
              <Icon
                :name="
                  status === 'pending'
                    ? 'mdi:progress-clock'
                    : 'material-symbols:done-all'
                "
                class="w-4 h-4"
                :class="status === 'pending' ? 'text-orange' : 'text-primary'"
              />
              <p class="font-bold">{{ status }}</p>
            </div>
          </div>
          <div class="py-2">
            <h2 class="font-bold py-2">Working Days</h2>
            <div class="flex gap-x-5 flex-wrap gap-y-1 items-center">
              <div
                v-for="day in availability.per_week"
                :key="day"
                class="flex gap-1 items-center"
              >
                <Icon
                  name="material-symbols:done"
                  class="w-5 h-5 text-primaryvar1"
                />
                <p>{{ day }}</p>
              </div>
              <div
                v-if="discount"
                class="px-5 my-1 w-fit font-semibold bg-primary text-light300 rounded-sm"
              >
                {{ discount }}% off
              </div>
              <div class="flex gap-3 items-center">
                <p>Score :</p>
                <svg
                  width="18"
                  height="16"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.50342 9H9.50342M1.00342 1L2.50342 7H9.50342L11.0034 1L8.00342 4.5L6.00342 1L4.00342 4.5L1.00342 1Z"
                    stroke="#FFA046"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <p class="text-neutral200 font-bold">{{ score ?? 0 }}</p>
              </div>
            </div>
          </div>

          <hr class="my-2" />

          <h2 class="font-bold text-neutral200 text-sm mb-1">Service Detail</h2>
          <p class="py-1">
            {{ isLongDescription ? description.slice(0, 200) : description }}
          </p>
          <div
            v-if="expand"
            class="flex gap-1 items-center font-bold my-1 cursor-pointer"
            @click="isLongDescription = !isLongDescription"
          >
            <p>{{ isLongDescription ? "Show More" : "Show Less" }}</p>
            <Icon
              :name="
                isLongDescription
                  ? 'ic:round-keyboard-arrow-down'
                  : 'ic:round-keyboard-arrow-up'
              "
              class="w-5 h-5"
            />
          </div>
        </div>
        <h-menu
          @optionClicked="handleOptionClick"
          leading_icon="ph:dots-three-outline-vertical-fill"
          :menu="{ id: id.toString(), actions: ['edit', 'delete'] }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Images {
  type: string;
  url: string;
}
interface availability {
  per_week: Array<string>;
  per_day: { start_time: string; end_time: string };
}
interface Props {
  id: number;
  title: string;
  images: Images[];
  score: number | null;
  status: string;
  availability: availability;
  discount?: number;
  description: string;
}
const props = defineProps<Props>();
const expand = ref(props.description.length > 200);
const isLongDescription = ref(props.description.length > 200);

function convertTimeToAM_PM(time: string): string {
  let hour = parseInt(time.substring(0, 2));
  const minute = time.substring(3);

  let AM_PM = "AM";
  if (hour >= 12) AM_PM = "PM";
  if (hour === 0) hour = 12;
  if (hour > 12) hour -= 12;

  const hourString = hour.toString().padStart(2, "0");
  const AM_PMTimeString = `${hourString}:${minute} ${AM_PM}`;
  return AM_PMTimeString;
}

const emit = defineEmits(["menuSelected"]);
const handleClick = (value: any) => {
  emit("menuSelected", value);
};

const handleOptionClick = (value:any) => {
  emit("menuSelected", value);
  // const router = useRouter();
  // if (event.action === "edit") {
  //   router.push({
  //     name: "my-services-edit-realtime-service_id",
  //     params: { service_id: event.id },
  //   });
  // }
};
</script>
