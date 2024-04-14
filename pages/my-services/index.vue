<template>
  <main class="">
    <div
      class="sticky top-10 backdrop-blur-sm z-40 w-full flex items-center justify-center text-sm md:text-base gap-1 md:gap-5 py-3 border-b border-b-neutral400/20"
    >
      <div class="relative flex flex-col max-w-fit w-full text-center">
        <div
          class="flex w-fit items-center gap-2 mx-auto transition-colors duration-300 ease-in-out"
          :class="[
            currentPath === '/my-services' || currentPath === '/my-services/'
              ? 'text-primary'
              : 'text-neutral-500',
          ]"
        >
          <Icon name="uil:github" class="w-5 h-5"></Icon>
          <NuxtLink :to="{ name: 'my-services-index' }" class="font-bold">
          {{
            $t("realtime_service")
          }}</NuxtLink>
        </div>
        <span
          :class="[
            currentPath === '/my-services' || currentPath === '/my-services/'
              ? 'bg-primary'
              : 'bg-transparent',
          ]"
          class="absolute -bottom-[14px] rounded-full w-full h-1 transition-all duration-300 ease-in-out"
        ></span>
      </div>
      <div class="relative flex flex-col max-w-[11rem] w-full text-center">
        <div
          class="flex w-fit items-center gap-2 mx-auto transition-colors duration-300 ease-in-out"
          :class="[
            currentPath === '/my-services/virtual' ||
            currentPath === '/my-services/virtual/'
              ? 'text-primary'
              : 'text-neutral-500',
          ]"
        >
          <Icon name="uil:github" class="w-5 h-5"></Icon>
          <NuxtLink
            :to="{ name: 'my-services-index-virtual' }"
            class="font-bold"
            >{{ $t("virtual_service") }}</NuxtLink
          >
        </div>
        <span
          :class="[
            currentPath === '/my-services/virtual' ||
            currentPath === '/my-services/virtual/'
              ? 'bg-primary'
              : 'bg-transparent',
          ]"
          class="absolute -bottom-[14px] rounded-full w-full h-1 transition-all duration-300 ease-in-out"
        ></span>
      </div>
    </div>

    <NuxtPage />
  </main>
</template>

<script lang="ts" setup>
const route = useRoute();

const currentPath = ref<string>(route.path);

watch(
  () => route.path,
  () => {
    currentPath.value = route.path;
  }
);
</script>
