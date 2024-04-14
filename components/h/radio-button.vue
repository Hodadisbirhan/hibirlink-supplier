<template>
  <div class="flex items-center gap-2 w-min">
    <input
      type="radio"
      :id="props.id"
      v-model="radioModal"
      class="appearance-none checked:ring-1 ring-offset-2 border-green400 border-1 active:bg-green400 cursor-pointer focus:ring-green400 focus:text-green400 checked:text-green400"
      :value="props.id"
      :name="props.name"
    />
    <label
      :for="props.id"
      class="text-sm whitespace-nowrap cursor-pointer font-semibold"
      >{{ props.label }}</label
    >
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  id: String,
  label: String,
  name: {
    type: String,
    required: true,
  },
  value: String,
  modelValue: String,
});
const emit = defineEmits(["update:modelValue"]);

const radioModal = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>
