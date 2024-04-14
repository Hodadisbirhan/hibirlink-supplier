<template>
  <main class="w-full h-full">
    <h3 class="font-extrabold text-neutral300 text-xl py-1.5 text-center">
      {{ $t("employees") }}
    </h3>

    <ul class="w-full flex justify-center gap-6 border-b-2 items-center">
      <NuxtLink
        :to="{ name: 'employees-index' }"
        :class="[
          /^\/employees(?!(\/service))+/i.test(route.path)
            ? 'before:w-full before:left-0 before:right-0 text-primaryvar1'
            : 'before:w-0 before:left-1/2 before:right-1/2 text-neutral200',
        ]"
        class="relative group py-2 px-2.5 font-bold group before:content-[''] before:absolute hover:before:left-0 hover:before:right-0 before:-bottom-0.5 before:bg-primaryvar1 before:h-[0.15rem] hover:before:w-full before:rounded-full before:transition-all before:ease-in-out before:duration-200 transition-colors ease-in-out duration-200"
      >
        <Icon
          name="ic:baseline-storefront"
          class="group-hover:text-primaryvar1"
        />
        {{ $t("in_stores") }}
      </NuxtLink>
      <!-- <NuxtLink
        :to="{ name: 'employees-index-service' }"
        :class="[
          /(?<=\/employees\/)service/.test(route.path)
            ? 'before:w-full before:left-0 before:right-0 text-primaryvar1'
            : 'before:w-0 before:left-1/2 before:right-1/2 text-neutral200',
        ]"
        class="relative group py-2 px-2.5 font-bold gorup before:content-[''] before:absolute hover:before:left-0 hover:before:right-0 before:-bottom-0.5 before:bg-primaryvar1 before:h-[0.15rem] hover:before:w-full before:rounded-full before:transition-all before:ease-in-out before:duration-200 transition-colors ease-in-out duration-200"
      >
        <Icon
          name="mingcute:service-fill"
          class="group-hover:text-primaryvar1"
        />
        {{ $t("in_services") }}
      </NuxtLink> -->
    </ul>

    <section class="flex-1 w-full h-max"><NuxtPage /></section>
  </main>
</template>

<style scoped>
/* .router-link-active {
  @apply before:w-full before:left-0 before:right-0 text-primaryvar1;
} */
</style>

<script setup lang="ts">
const route = useRoute();
</script>
