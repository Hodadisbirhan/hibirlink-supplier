<template>
  <div class="flex flex-col gap-2 my-2">
    <span class="text-sm text-neutral300 font-semibold">{{
      $t("per_week")
    }}</span>
    <div class="flex flex-row flex-wrap gap-5">
      <h-check-box
        :label="$t('monday')"
        value="Monday"
        id="monday"
        v-model="days"
      />
      <h-check-box
        :label="$t('tuesday')"
        value="Tuesday"
        id="tuesday"
        v-model="days"
      />
      <h-check-box
        :label="$t('wednesday')"
        value="Wednesday"
        id="wednesday"
        v-model="days"
      />
      <h-check-box
        :label="$t('thursday')"
        value="Thursday"
        id="thursday"
        v-model="days"
      />
      <h-check-box
        :label="$t('friday')"
        value="Friday"
        id="friday"
        v-model="days"
      />
      <h-check-box
        :label="$t('saturday')"
        value="Saturday"
        id="saturday"
        v-model="days"
      />
      <h-check-box
        :label="$t('sunday')"
        value="Sunday"
        id="sunday"
        v-model="days"
      />
    </div>
    <span v-if="errorDay" class="text-red text-sm">{{ errorDay }}</span>
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";
const { value: valueDay, errorMessage: errorDay } = useField(
  "working_day",
  "required",
  { keepValueOnUnmount: true }
);
const days: any = ref([]);
if (valueDay.value) {
  days.value = Object.values(valueDay.value);
}

watch(days, (newValue) => {
  if (newValue) valueDay.value = newValue;
});
</script>
