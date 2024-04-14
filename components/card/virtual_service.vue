<template>
  <div
    class="w-full mx-2 rounded hover:shadow-[0px_0px_24px_8px_rgba(120,120,120,0.2)] transition-all ease-in-out duration-300 cursor-pointer p-1 bg-light400/30 py-3"
  >
    <div
      class="flex gap-4 group sm:flex-row flex-col items-center bg-transparent px-2 text-xs"
    >
      <div class="w-full sm:w-[100px] h-[200px] md:w-[200px]">
        <h-swiper :images="images" />
      </div>

      <div class="flex-1 flex relative text-neutral300">
        <div class="flex-1">
          <div class="flex gap-3 items-center py-3">
            <h2 class="font-bold text-sm text-neutral200">{{ title }}</h2>
          </div>

          <div class="flex gap-x-6 gap-y-2 py-1 items-center flex-wrap">
            <div class="flex gap-3 items-center">
              <p>Score :</p>
              <Icon name="mdi:crown" class="w-5 h-5 text-orange" />
              <p class="text-neutral200 font-bold">{{ score ?? 0 }}</p>
            </div>
          </div>
          <a :href="web_link">{{ web_link }}</a>
          <hr class="my-3 mt-6" />

          <h2 class="font-bold text-sm mb-1">Product Detail</h2>
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
          @optionClicked="handleClick"
          leading_icon="ph:dots-three-outline-vertical-fill"
          :menu="{ id: id.toString(), actions: ['edit', 'delete'] }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
interface Images {
  type?: string;
  url: string;
}
interface Props {
  id: number;
  title: string;
  images: Images[];
  score?: number | null | undefined;
  web_link: string;
  description: string;
}
const props = defineProps<Props>();

const expand = ref(props.description.length > 200);
const isLongDescription = ref(props.description.length > 200);

const router = useRouter();
const emit = defineEmits(["menuSelected"]);
const handleClick = (value: any) => {
  emit("menuSelected", value);
};
</script>
