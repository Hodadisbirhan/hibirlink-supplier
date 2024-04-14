<template>
  <div class="flex items-center gap-2 w-min">
    <input
      type="checkbox"
      :id="props.id"
      class="appearance-none w-4 h-4 checked:ring-1 accent-primary ring-offset-2 rounded-[0.2rem] text-light150 border-primary border-1 active:bg-primary focus:ring-primary focus:text-primary checked:text-primary cursor-pointer"
      v-model="checkboxModel"
      :value="props.id"
    />
    <label
      :for="props.id"
      v-if="props.label"
      :class="props.class"
      class="text-sm font-semibold cursor-pointer text-neutral300"
      >{{ props.label }}</label
    >
  </div>
</template>
<script lang="ts" setup>
interface PropsInterface {
  id: string;
  label?: string;
  value?: string;
  modelValue: Array<string | number>;
  class?: string;
}
const props = defineProps<PropsInterface>();

const emit = defineEmits(["update:modelValue"]);

const checkboxModel = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
