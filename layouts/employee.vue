<template>
  <main class="w-full min-h-screen flex flex-col font-nunito bg-light300">
    <section
      class="flex-1 min-h-full relative overflow-x-hidden pt-[3.7rem] w-full"
    >
      <nav
        class="w-full h-[3.7rem] fixed top-0 left-0 right-0 bg-light400 bg-opacity-0 flex items-center justify-between z-50 gap-8 backdrop-blur px-6"
      >
        <NuxtLink :to="{ name: 'index' }">
          <Logo class="scale-[0.71] -ml-3" />
        </NuxtLink>
        <div
          class="flex-1 flex justify-end items-center xl:gap-16 gap-8 text-dark200"
        >
          <ul class="lg:flex hidden items-center gap-8">
            <NuxtLink
              :class="{
                'router-link-active':
                  /^\/store-employee(?!(\/chat|\/products|\/account|\/store|\/discount))/i.test(
                    route.path
                  ),
              }"
              :to="{ path: '/store-employee' }"
              class="relative cursor-pointer flex items-center justify-center w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
              >{{ $t("orders") }}</NuxtLink
            >
            <NuxtLink
              :class="{
                'router-link-active': /^\/store-employee\/products/i.test(
                  route.path
                ),
              }"
              :to="{ name: 'store-employee-store' }"
              class="relative cursor-pointer flex items-center justify-center w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
              >{{ $t("store") }}</NuxtLink
            >

            <NuxtLink
              v-if="store.role == 'store_manager'"
              :class="{
                'router-link-active': /^\/store-employee\/discount/i.test(
                  route.path
                ),
              }"
              :to="{ name: 'store-employee-discount' }"
              class="relative cursor-pointer flex items-center justify-center w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
              >{{ $t("discount") }}</NuxtLink
            >

            <NuxtLink
              :class="{
                'router-link-active': /^\/store-employee\/chat/i.test(
                  route.path
                ),
              }"
              :to="{ name: 'store-employee-chats' }"
              class="relative cursor-pointer flex items-center justify-center w-[6.7rem] h-8 font-semibold before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-300 after:duration-300 before:rounded-sm after:rounded-sm"
              >{{ $t("chat") }}</NuxtLink
            >
          </ul>

          <ul class="flex items-center xl:gap-10 gap-8">
            <li class="w-[0.15rem] h-5 rounded-full bg-neutral500"></li>
            <li
              class="font-bold text-sm hover:text-primary transition-colors duration-300 ease-in-out cursor-pointer flex items-center"
              @click="
                () => {
                  if (locale === 'en') locale = 'am';
                  else locale = 'en';
                }
              "
            >
              <Icon name="ion:language" /> {{ locale === "en" ? "Eng" : "አማ" }}
            </li>

            <div
              class="group relative p-1 flex items-center justify-center transition-colors"
            >
              <Icon
                name="uil:user"
                class="w-6 h-6 text-dark200 group-hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
              />
              <Icon
                name="ic:round-keyboard-arrow-down"
                class="w-5 h-5 text-neutral200 group-hover:text-primary cursor-pointer group-hover:rotate-180 transition-all ease-in-out duration-200"
              />

              <div
                class="absolute hidden top-14 group-hover:flex group-hover:top-8 w-64 right-0 h-fit rounded flex-col items-center gap-4 p-4 bg-light400 shadow-[0px_0px_16px_6px_rgba(120,120,120,0.09)] transition-transform ease-in-out duration-300"
              >
                <div
                  class="absolute -top-2 right-2 rotate-45 w-5 h-5 bg-light400"
                ></div>
                <h6 class="font-bold text-neutral300">{{ store.email }}</h6>
                <h6 class="font-bold text-neutral300">{{ store.role }}</h6>

                <h-button
                  btn-name="sign_out"
                  @click="handleLogout"
                  type="button"
                  btn-class="min-w-[10rem] text-light400"
                />

                <hr class="w-full py-1" />

                <h3 class="text-neutral300 font-semibold">
                  {{ $t("my") }}
                  <span class="text-primary">{{ $t("hibirlink") }}</span>
                </h3>

                <div class="flex flex-col items-start gap-1.5 w-full">
                  <nuxt-link :to="{ name: 'store-employee-account' }">
                    <span
                      class="text-neutral300 font-medium hover:font-semibold hover:text-primaryvar1 transition-all ease-in-out duration-200"
                      >{{ $t("account") }}</span
                    ></nuxt-link
                  >
                </div>
              </div>
            </div>

            <div
              @click="
                () => {
                  openNav = true;
                }
              "
              class="pb-1 lg:hidden block"
            >
              <Icon
                name="ci:menu-alt-02"
                class="w-8 h-8 mt-2 text-dark200 hover:text-primary cursor-pointer transition-colors ease-in-out duration-200"
              />
            </div>
          </ul>
        </div>
      </nav>

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

    <footer class="px-4 divide-y w-full bg-light200">
      <div
        class="container flex flex-col justify-between py-10 mx-auto space-y-8 lg:flex-row lg:space-y-0"
      >
        <div class="lg:w-1/3">
          <nuxt-link
            rel="noopener noreferrer"
            :to="{ name: 'index' }"
            class="flex justify-start items-end gap-3 lg:justify-start"
          >
            <img src="/favicon.svg" class="self-end" />
            <h3 class="text-xl font-bold text-dark200 self-end">
              {{ $t("hibirlink") }}
            </h3>
          </nuxt-link>
        </div>
        <div
          class="grid grid-cols-2 text-sm gap-x-3 gap-y-8 lg:w-2/3 sm:grid-cols-4"
        >
          <div class="space-y-3 self-center text-sm text-dark100">
            <h3 class="tracking-wide uppercase font-semibold">
              {{ $t("products") }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("physical") }} {{ $t("products") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("digital") }} {{ $t("products") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("sell_on_hibirlink")
                }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("employees") }}</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3 text-sm text-dark100">
            <h3 class="tracking-wide uppercase font-semibold">
              {{ $t("services") }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("real_time") }} {{ $t("services") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#"
                  >{{ $t("virtual") }} {{ $t("services") }}</a
                >
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("provide_services")
                }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("employees") }}</a>
              </li>
            </ul>
          </div>
          <div class="space-y-3 text-sm text-dark100">
            <h3 class="uppercase font-semibold">
              {{ $t("auction") }}
            </h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("closed") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("open") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("setup") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("participate")
                }}</a>
              </li>
            </ul>
          </div>

          <div class="space-y-3 text-sm text-dark100">
            <h3 class="uppercase font-semibold">{{ $t("delivery") }}</h3>
            <ul class="space-y-1">
              <li>
                <a rel="noopener noreferrer" href="#">{{
                  $t("join_hibirlink_delivery")
                }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("partners") }}</a>
              </li>
              <li>
                <a rel="noopener noreferrer" href="#">{{ $t("employees") }}</a>
              </li>
            </ul>
          </div>

          <div class="space-y-3 text-sm text-dark100">
            <div class="uppercase font-semibold">
              {{ $t("social_media") }}
            </div>
            <div class="flex justify-start space-x-3">
              <a
                rel="noopener noreferrer"
                href="mailto:hibirlink@gmail.com"
                title="email"
                class="flex items-center p-1"
              >
                <Icon name="majesticons:mail" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon name="mdi:twitter" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon name="mdi:linkedin" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Facebook"
                class="flex items-center p-1"
              >
                <Icon name="mdi:facebook" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Instagram"
                class="flex items-center p-1"
              >
                <Icon name="ri:instagram-fill" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon name="ion:logo-tiktok" class="w-6 h-6 text-dark200" />
              </a>
              <a
                rel="noopener noreferrer"
                href="#"
                title="Twitter"
                class="flex items-center p-1"
              >
                <Icon
                  name="ic:baseline-telegram"
                  class="w-6 h-6 text-dark200"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        class="py-6 text-sm text-dark200 flex items-center justify-center gap-x-8 gap-y-4"
      >
        <span>©2023 hibirlink.com, All rights reserved</span>
        <a rel="noopener noreferrer" href="#" class="hover:underline">
          Privacy policy
        </a>
        <a rel="noopener noreferrer" href="#" class="hover:underline">
          Terms of service
        </a>
        <a rel="noopener noreferrer" href="#" class="hover:underline">
          Help center
        </a>
      </div>
    </footer>
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
