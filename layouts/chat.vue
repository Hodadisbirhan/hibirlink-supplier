<!-- <template>
  <main>
    <NuxtPage></NuxtPage>
  </main>
</template> -->
<template>
  <main
    class="w-full min-h-screen flex flex-col font-nunito bg-light300 relative"
  >
    <nav
      class="w-full h-[3.5rem] sticky top-0 left-0 right-0 bg-light400 bg-opacity-20 px-3 flex items-center justify-between z-30 xl:gap-16 gap-8 backdrop-blur"
    >
      <div class="flex items-center justify-center gap-6">
        <div class="block lg:hidden" @click="() => (showMobileDrawer = true)">
          <Icon
            name="ci:menu-alt-04"
            class="w-8 h-8 mt-2 text-neutral200 hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
          />
        </div>
        <a href="http://localhost:3000/">
          <Logo class="scale-[0.71] -ml-3" />
        </a>
      </div>

      <div class="flex-1 flex justify-end items-center xl:gap-16 gap-4">
        <ul class="lg:flex hidden items-center xl:gap-16 gap-8">
          <a
            href="http://localhost:3000/services"
            class="relative cursor-pointer flex items-center justify-center text-neutral200 hover:text-primaryvar1 w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-500 after:duration-500 before:rounded-sm after:rounded-sm"
            >{{ $t("services") }}</a
          >
          <a
            href="http://localhost:3000/products"
            class="relative cursor-pointer flex items-center justify-center text-neutral200 hover:text-primaryvar1 w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-500 after:duration-500 before:rounded-sm after:rounded-sm"
            >{{ $t("products") }}</a
          >
          <a
            href="http://localhost:3000/next-rel"
            class="relative cursor-pointer flex items-center justify-center text-neutral200 hover:text-primaryvar1 w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-500 after:duration-500 before:rounded-sm after:rounded-sm"
            >{{ $t("auction") }}</a
          >
        </ul>

        <ul class="flex items-center xl:gap-10 md:gap-8 gap-6">
          <li class="w-[0.15rem] h-5 rounded-full bg-neutral500"></li>
          <li
            class="font-bold text-sm text-neutral200 hover:text-primary transition-colors duration-300 ease-in-out cursor-pointer flex items-end"
            @click="
              () => {
                if (locale === 'en') locale = 'am';
                else locale = 'en';
              }
            "
          >
            <Icon name="ion:language" /> {{ locale === "en" ? "Eng" : "አማ" }}
          </li>

          <!--  -->
          <h-button
            @click="handleLogout"
            type="button"
            btn-name="logout"
            rounded-class="rounded-sm"
            btn-name-class="font-bold"
            leading-icon-class="p-2"
            :isLoading="isLoading"
            class="min-w-[5rem]"
          />
          <!--  -->
        </ul>
      </div>
    </nav>
    <section class="flex-1 min-h-full relative overflow-x-hidden w-full">
      <div class="w-full min-h-full pb-16 px-5">
        <slot />
      </div>
    </section>

    <TransitionRoot as="template" :show="openNav" class="lg:hidden block">
      <Dialog as="div" class="relative z-50" @close="open = false">
        <TransitionChild
          as="template"
          enter="ease-in-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in-out duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-neutral300 bg-opacity-50 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10"
            >
              <TransitionChild
                as="template"
                enter="transform transition ease-in-out duration-300 sm:duration-300"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-300 sm:duration-300"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <DialogPanel
                  class="pointer-events-auto relative w-screen max-w-sm"
                >
                  <TransitionChild
                    as="template"
                    enter="ease-in-out duration-300"
                    enter-from="opacity-0"
                    enter-to="opacity-100"
                    leave="ease-in-out duration-300"
                    leave-from="opacity-100"
                    leave-to="opacity-0"
                  >
                    <div
                      class="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4"
                    ></div>
                  </TransitionChild>
                  <div
                    ref="mobileNavTarget"
                    class="flex h-full flex-col overflow-y-auto font-nunito bg-light300 py-6 shadow-xl"
                  >
                    <div
                      class="px-4 sm:px-6 flex flex-col items-center justify-center"
                    >
                      <NuxtLink
                        :to="{ name: 'index' }"
                        @click="
                          () => {
                            openNav = false;
                          }
                        "
                      >
                        <Logo
                          class="scale-[0.71] outline-none border-none focus:border-none focus:outline-none"
                        />
                      </NuxtLink>
                      <h3 class="text-neutral300 font-semibold">
                        We Link Everything.
                      </h3>
                    </div>
                    <ul
                      class="relative flex-1 mt-6 px-4 sm:px-6 flex flex-col gap-4"
                    >
                      <NuxtLink
                        :class="{
                          'router-link-active':
                            /^\/store-employee(?!(\/chat|\/store\/discount|\/account))/i.test(
                              route.path
                            ),
                        }"
                        :to="{ name: 'store-employee-index' }"
                        @click="
                          () => {
                            openNav = false;
                          }
                        "
                        class="relative h-11 rounded flex gap-2 items-center justify-start font-bold px-4 text-neutral300 before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
                      >
                        <Icon name="mingcute:service-fill" class="w-5 h-5" />
                        {{ $t("orders") }}</NuxtLink
                      >
                      <NuxtLink
                        :class="{
                          'router-link-active':
                            /^\/store-employee\/store/i.test(route.path),
                        }"
                        :to="{ name: 'store-employee-store' }"
                        @click="
                          () => {
                            openNav = false;
                          }
                        "
                        class="relative h-11 rounded flex gap-2 items-center justify-start text-neutral300 font-bold px-4 before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
                      >
                        <Icon name="ep:goods" class="w-5 h-5" />{{
                          $t("store")
                        }}</NuxtLink
                      >
                      <NuxtLink
                        v-if="store.role == 'store_manager'"
                        :class="{
                          'router-link-active':
                            /^\/store-employee\/discount/i.test(route.path),
                        }"
                        :to="{ name: 'store-employee-discount' }"
                        @click="
                          () => {
                            openNav = false;
                          }
                        "
                        class="relative h-11 rounded flex gap-2 items-center justify-start text-neutral300 font-bold px-4 before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
                      >
                        <Icon name="ep:goods" class="w-5 h-5" />{{
                          $t("discount")
                        }}</NuxtLink
                      >
                      <NuxtLink
                        :class="{
                          'router-link-active':
                            /^\/store-employee-\/chat/i.test(route.path),
                        }"
                        :to="{ name: 'store-employee-chat' }"
                        @click="
                          () => {
                            openNav = false;
                          }
                        "
                        class="relative h-11 rounded flex gap-2 items-center justify-start text-neutral300 font-bold px-4 before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
                      >
                        <Icon name="ri:auction-line" class="w-5 h-5" />{{
                          $t("chat")
                        }}</NuxtLink
                      >
                    </ul>
                    <hr class="w-3/4 self-center py-2" />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </main>
</template>

<style scoped>
.router-link-active {
  color: #306ee8;
  font-weight: 600;
}
.router-link-active::before {
  width: 100%;
  height: 100%;
  border-color: #306ee8;
  border-radius: 0.125rem;
}
.router-link-active::after {
  width: 100%;
  height: 100%;
  border-color: #306ee8;
  border-radius: 0.125rem;
}
</style>

<script setup lang="ts">
import Logo from "@/assets/icons/logo.svg";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useAuth } from "~~/store/auth";
import { createRegExp, exactly } from "magic-regexp";
import logout from "@/apollo/mutation/logout.gql";
console.log(createRegExp(exactly("store-employee")));

const { locale } = useI18n();
const route = useRoute();
const openNav = ref<boolean>(false);
const mobileNavTarget = ref(null);
const isLoading = ref<boolean>(false);
const userRole = ref("");

const {
  mutate: logOut,
  onError: onLogoutError,
  onDone: onLogoutResult,
} = useCustomMutation(logout);

const store = useAuth();
watchEffect(() => {
  userRole.value = store.role;
});

onLogoutResult((result) => {
  const { setToken, setUID, setName, setRole, setEmail } = useAuth();
  setToken("");
  setUID("");
  setName("");
  setRole("");
  setEmail("");
  isLoading.value = false;
  window.location.href = "http://localhost:3000";
});

onLogoutError((error) => {
  console.log("Log out Error: " + error);
});

const handleLogout = async () => {
  const { uid } = useAuth();
  isLoading.value = true;
  logOut({ uid });
};

onClickOutside(mobileNavTarget, (event) => {
  openNav.value = false;
});
</script>
