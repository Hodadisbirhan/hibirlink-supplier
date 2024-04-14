<template>
  <div class="mb-4">
    <p class="text-neutral400 font-semibold group-hover:font-bold mb-1 text-sm">
      {{ $t(label) }}
    </p>
    <QuillEditor
      :class="props.quillClass ? props.quillClass : 'min-h-[5.2rem]'"
      theme="snow"
      :toolbar="toolbar || 'essential'"
      v-model:content="quillContent"
      :placeholder="placeholder"
      @update:content="quillValueChange" />
    <p class="px-1 py-2 text-sm text-red font-body">
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
<script setup lang="ts">
import { Delta, QuillEditor } from "@vueup/vue-quill";
import { useField } from "vee-validate";
interface QuillPropsInterface {
  quillClass?: string;
  placeholder?: string;
  toolbar?: string;

  name: string;
  rules?: string;
  label: string;
}
const props = defineProps<QuillPropsInterface>();

const { value: quillValue, errorMessage } = useField(props.name, props.rules);
const quillContent = ref();
const _quillValue = quillValue.value as { ops: Array<any> };
if (_quillValue) {
  quillContent.value = new Delta(_quillValue);
}

const quillValueChange = (delta: Delta) => {
  if (quillContent.value.ops[0].insert === "\n") {
    quillValue.value = null;
  } else {
    quillValue.value = delta;
  }
};
</script>
