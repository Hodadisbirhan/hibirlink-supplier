<template>
  <main
    class="min-w-full h-full flex flex-col gap-y-8 items-center justify-top mx-auto">
    <header class="flex items-center justify-center">
      <div
        class="relative flex flex-col items-end gap-y-2"
        v-for="(step, i) in steps"
        :key="step.key">
        <div class="flex items-center">
          <hr
            class="h-[2px] overflow-hidden outline-none border-none"
            :class="[
              state > i
                ? 'bg-primary/90'
                : state == i
                  ? 'bg-primary/90'
                  : 'bg-neutral500/80',
              i == 0 ? 'w-0' : props.lineClass,
            ]" />
          <div
            class="w-5 h-5 rounded-full flex items-center justify-center"
            :class="
              state > i
                ? 'bg-primary'
                : state == i
                  ? 'bg-light400 border-[5px] border-primary'
                  : 'bg-neutral300 border-[5px] border-light400'
            ">
            <Icon
              name="material-symbols:check-circle"
              :class="state > i ? 'flex' : 'hidden'"
              class="w-5 h-5 text-light400" />
          </div>
        </div>
        <h4
          class="text-neutral300 font-semibold absolute -right-[70px] text-sm text-center w-40 top-6">
          {{ step.value }}
        </h4>
      </div>
    </header>

    <form
      @submit.prevent="onSubmit"
      class="w-full my-3">
      <slot
        :name="steps[state].key"
        :state="state"
        :index="state">
      </slot>

      <footer class="w-full flex items-center justify-between">
        <h-button
          btn-name="previous"
          rounded-class="rounded-sm"
          type="button"
          class="capitalize"
          @click="onStepDown(-1)"
          v-if="state > 0"
          :gradient="false">
        </h-button>

        <div class="gap-2 flex ml-auto my-2">
          <div
            v-if="!isForAdd"
            class="flex flex-row justify-end mb-7">
            <h-button
              btn-name="update"
              type="submit"
              rounded-class="rounded-sm"
              class="capitalize"
              :gradient="false">
            </h-button>
          </div>
          <h-button
            :btn-name="steps.length - 1 == state ? 'done' : 'next'"
            :type="isForAdd ? 'submit' : 'button'"
            @click="isForAdd ? null : next()"
            v-if="state < steps.length"
            rounded-class="rounded-sm"
            class="capitalize"
            :gradient="false">
            <Icon
              name="material-symbols:check-circle"
              v-if="steps.length - 1 == state"
              class="w-5 h-5 text-primary" />
          </h-button>
        </div>
      </footer>
    </form>
  </main>
</template>
<script setup lang="ts">
import { useForm } from "vee-validate";

type Step = {
  key: string;
  value: string;
};
interface Props {
  steps: Step[];
  lineClass?: string;
  validationSchema?: any;
  isForAdd?: boolean;
  initialValue?: any;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  isForAdd: true,
  lineClass:
    "3xl:w-[14rem] 2xl:w-[12rem] xl:w-[10rem] lg:w-[8rem]  md:w-[6rem] w-[4rem]",
});

const state = ref(0);

const emit = defineEmits(["submit"]);
const currentSchema = computed(() => {
  return props.validationSchema[state.value];
});
const { handleSubmit, setValues } = useForm({
  keepValuesOnUnmount: true,
  validationSchema: currentSchema,
});
const initialValueComputed = computed(() => {
  return props.initialValue;
});

// if (initialValueComputed.value) {
//   setValues(initialValueComputed.value);
// }
watch(
  initialValueComputed,
  (newValue) => {
    if (newValue) setValues(newValue);
  },
  { immediate: true }
);

const onSubmit: any = handleSubmit(
  (values) => {
    if (props.isForAdd) {
      if (props.steps.length - 1 === state.value) {
        emit("submit", values);
        return;
      }
      state.value += 1;
    } else {
      emit("submit", values, state.value);
    }
  },
  (error) => {
    console.log(error);
  }
);

const onStepDown = (value: number) => {
  if (state.value >= 1) state.value += value;
};

const next = () => {
  if (state.value < props.steps.length - 1) state.value += 1;
};
</script>
