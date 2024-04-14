<template>
  <div class="w-full flex flex-col gap-4">
    <div class="w-full flex flex-row flex-wrap justify-between">
      <h-check-box
        class="w-full min-w-[10rem]"
        v-model="selectAll"
        :label="isSelected ? 'Un mark all' : 'Mark all'"
        id="all"
        @click="
          isSelected ? deselectedAll() : selectAllFunction()
        "></h-check-box>

      <p
        v-show="isSelected"
        @click="deleteSelectedImage"
        class="text-red cursor-pointer hover:text-red">
        Delete Selected Image(s)
      </p>
    </div>
    <hr class="h-[1px] border-neutral100/10" />
    <div
      class="w-full h-[10rem] overflow-x-auto overflow-y-hidden border-green400 gap-3 flex mb-5">
      <div
        v-for="im in imageValue"
        class="w-[10rem] relative min-w-[10rem] h-full"
        :key="im.id">
        <span
          class="absolute top-2 right-2 h-[1.1rem] w-[1.1rem] rounded-sm bg-green-50 flex justify-center items-center">
          <h-check-box
            v-model="selected_Images"
            name="selectedImage"
            :id="`${im.id}`" />
        </span>
        <nuxt-img
          class="w-full h-full object-center object-cover"
          :src="im.url" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const selected_Images = ref<string[]>([]);
const selectAll = ref<string[]>([]);

interface ImageInterface {
  id: number;
  url: string;
  type?: string;
}

interface PropsInterface {
  image: Array<ImageInterface>;
  mutateGql: any;
}
const emit = defineEmits(["notifyImageDelete"]);
const props = defineProps<PropsInterface>();
const imageValue = computed(() => {
  return props.image;
});

selectAll.value = selected_Images.value.length > 0 ? ["all"] : [];

const isSelected = computed(() => {
  return selected_Images.value.length > 0;
});

watch(selected_Images, (newValue) => {
  selectAll.value = newValue.length > 0 ? ["all"] : [];
});

const selectAllFunction = () => {
  selected_Images.value = imageValue.value.map((e) => {
    return `${e.id}`;
  });
};
const deselectedAll = () => {
  selected_Images.value = [];
};

const {
  mutate: deleteImage,
  onDone: onDeleteImage,
  onError: onDeleteImageError,
} = useCustomMutation(props.mutateGql);

const deleteSelectedImage = () => {
  console.log(selected_Images);
  deleteImage({
    ids: selected_Images.value,
  });
};
interface ImageValueInterface {
  id: number;
  imageURL: string;
}

onDeleteImage((response) => {
  emit("notifyImageDelete");
  selected_Images.value = [];
});

onDeleteImageError((error) => {
  console.log(error);
});
</script>
