<template>
  <main
    class="relative w-screen h-screen flex justify-center bg-light300 font-nunito"
  >
    <nav
      ref="mobileNavTarget"
      class="min-h-full flex flex-col items-start justify-between lg:bg-light400 lg:bg-opacity-40 bg-light400 bg-opacity-100 space-y-4 lg:w-60 lg:static absolute top-0 left-0 bottom-0 z-50 overflow-x-hidden pt-8 pb-4 transition-all ease-in-out duration-500"
      :class="[showMobileDrawer ? 'w-60' : 'w-0']"
    >
      <div
        class="lg:hidden absolute top-3 left-4"
        @click="
          () => {
            showMobileDrawer = false;
          }
        "
      >
        <Icon
          name="ic:round-arrow-back-ios"
          class="w-7 h-7 text-neutral400 hover:text-primaryvar1 cursor-pointer transition-colors ease-in-out duration-200"
        />
      </div>
      <ul class="space-y-4 pr-4 w-full">
        <div class="flex items-center flex-col p-6 pb-8 w-full mx-auto">
          <Icon name="uil:user" class="w-7 h-7 text-primaryvar1" />
          <div class="flex flex-col mx-auto max-w-full">
            <h2 class="mt-1 font-semibold text-dark200 text-center">
              {{ userName }}
            </h2>
            <p class="text-xs text-center truncate">
              {{ userEmail }}
            </p>
          </div>
        </div>

        <h3 class="px-6 text-neutral400 font-semibold">{{ $t("menu") }}</h3>
        <NuxtLink
          :to="{ name: 'index' }"
          @click="
            () => {
              showMobileDrawer = false;
            }
          "
          class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
        >
          <Icon
            name="uil:analytics"
            class="active_icon w-5 h-5 text-neutral-400 group-hover:text-primaryvar1 transition-colors ease-in-out duration-200"
          />
          <p>{{ $t("analysis") }}</p>
        </NuxtLink>

        <details>
          <summary
            @click="() => (nestedNav.services = !nestedNav.services)"
            :class="{
              'text-primaryvar1': /(?:my-services)/.test(route.name),
            }"
            class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200 outline-none"
          >
            <Icon
              name="mingcute:service-fill"
              :class="[
                /(?:my-services)/.test(route.name)
                  ? 'text-primaryvar1'
                  : 'text-neutral-400',
              ]"
              class="active_icon w-5 h-5 group-hover:text-primaryvar1 transition-colors ease-in-out duration-200"
            />
            <p class="whitespace-nowrap">{{ $t("myservices") }}</p>

            <Icon
              name="uil:angle-right-b"
              :class="[
                nestedNav.services ? 'rotate-90' : 'rotate-0',
                /(?:my-services)/.test(route.name)
                  ? 'text-primaryvar1'
                  : 'text-neutral-400',
              ]"
              class="w-5 h-5 transition-colors ease-in-out duration-200"
            />
          </summary>
          <div class="pl-8 space-y-1">
            <NuxtLink
              :to="{ name: 'my-services-index' }"
              @click="
                () => {
                  showMobileDrawer = false;
                }
              "
              class="flex items-center px-6 py-2 w-full space-x-3 rounded text-dark200 hover:text-primary font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
            >
              <p class="whitespace-nowrap">{{ $t("myservices") }}</p>
            </NuxtLink>

          </div>
        </details>

        <details>
          <summary
            @click="() => (nestedNav.products = !nestedNav.products)"
            :class="{ 'text-primaryvar1': /(?:my-products)/.test(route.name) }"
            class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200 outline-none"
          >
            <Icon
              name="ep:goods"
              :class="[
                /(?:my-products)/.test(route.name)
                  ? 'text-primaryvar1'
                  : 'text-neutral-400',
              ]"
              class="active_icon w-5 h-5 group-hover:text-primaryvar1 transition-colors ease-in-out duration-300"
            />
            <p class="whitespace-nowrap">{{ $t("myproducts") }}</p>

            <Icon
              name="uil:angle-right-b"
              :class="[
                nestedNav.products ? 'rotate-90' : 'rotate-0',
                /(?:my-products)/.test(route.name)
                  ? 'text-primaryvar1'
                  : 'text-neutral-400',
              ]"
              class="w-5 h-5 text-neutral-400 transition-colors ease-in-out duration-300"
            />
          </summary>
          <div class="pl-8 space-y-1">
            <NuxtLink
              :to="{ name: 'my-products-index' }"
              @click="
                () => {
                  showMobileDrawer = false;
                }
              "
              class="flex items-center px-6 py-2 w-full space-x-3 rounded text-dark200 hover:text-primary font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
            >
              <p class="whitespace-nowrap">{{ $t("myproducts") }}</p>
            </NuxtLink>
            <NuxtLink
              :to="{ name: 'my-products-special-discount' }"
              @click="
                () => {
                  showMobileDrawer = false;
                }
              "
              class="flex items-center px-6 py-2 w-full space-x-3 rounded text-dark200 hover:text-primary font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
            >
              <p class="whitespace-nowrap">{{ $t("special_discount") }}</p>
            </NuxtLink>
            <NuxtLink
              :to="{ name: 'my-products-orders-and-payment' }"
              @click="
                () => {
                  showMobileDrawer = false;
                }
              "
              class="flex items-center px-6 py-2 w-full space-x-3 rounded text-dark200 hover:text-primary font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
            >
              <p class="whitespace-nowrap">{{ $t("orders_and_payment") }}</p>
            </NuxtLink>
          </div>
        </details>

        <NuxtLink
          :to="{ name: 'my-auction' }"
          @click="
            () => {
              showMobileDrawer = false;
            }
          "
          class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
        >
          <Icon
            name="ri:auction-line"
            class="active_icon w-5 h-5 text-neutral-400 group-hover:text-primaryvar1 transition-colors ease-in-out duration-200"
          />
          <p class="whitespace-nowrap">{{ $t("myauction") }}</p>
        </NuxtLink>

        <NuxtLink
          :to="{ name: 'employees-index' }"
          @click="
            () => {
              showMobileDrawer = false;
            }
          "
          class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
        >
          <Icon
            name="clarity:employee-line"
            class="active_icon w-5 h-5 text-neutral-400 group-hover:text-primaryvar1 transition-colors ease-in-out duration-200"
          />
          <p>{{ $t("employees") }}</p>
        </NuxtLink>

        <NuxtLink
          :to="{ name: 'chats' }"
          @click="
            () => {
              showMobileDrawer = false;
            }
          "
          class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
        >
          <Icon
            name="heroicons:chat-bubble-oval-left-ellipsis"
            class="active_icon w-5 h-5 text-neutral-400 group-hover:text-primaryvar1 transition-colors ease-in-out duration-200"
          />
          <p>{{ $t("chats") }}</p>
        </NuxtLink>

        <hr class="w-full mx-2 border-neutral600 lg:hidden block" />
        <a
          href="http://localhost:3000/services"
          class="relative cursor-pointer mx-6 pl-4 lg:hidden flex items-center justify-start text-neutral200 hover:text-primaryvar1 w-[6.7rem] h-8 font-medium before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-500 after:duration-500 before:rounded-sm after:rounded-sm"
          >{{ $t("services") }}</a
        >
        <a
          href="http://localhost:3000/services"
          class="relative cursor-pointer mx-6 pl-4 lg:hidden flex items-center justify-start text-neutral200 hover:text-primaryvar1 w-[6.7rem] h-8 font-medium before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-500 after:duration-500 before:rounded-sm after:rounded-sm"
          >{{ $t("products") }}</a
        >
        <a
          href="http://localhost:3000/services"
          class="relative cursor-pointer mx-6 pl-4 lg:hidden flex items-center justify-start text-neutral200 hover:text-primaryvar1 w-[6.7rem] h-8 font-medium before:contnet-[''] after:contnet-[''] before:absolute after:absolute before:left-0 after:right-0 before:bottom-0 after:top-0 before:w-0 hover:before:w-full after:w-0 hover:after:w-full before:h-0 hover:before:h-full after:h-0 hover:after:h-full before:border-b-2 after:border-t-2 before:border-l-2 after:border-r-2 before:border-transparent hover:before:border-primary after:border-transparent hover:after:border-primary before:transition-all after:transition-all before:ease-in-out after:ease-in-out before:duration-500 after:duration-500 before:rounded-sm after:rounded-sm"
          >{{ $t("auction") }}</a
        >
      </ul>

      <div class="w-full space-y-3">
        <hr class="w-full mx-4 border-neutral600" />
        <NuxtLink
          :to="{ name: 'settings' }"
          @click="
            () => {
              showMobileDrawer = false;
            }
          "
          class="group relative flex items-center px-6 py-2 w-full space-x-3 rounded-r-md text-dark200 font-medium text-md hover:bg-light200 cursor-pointer transition-colors ease-in-out duration-200"
        >
          <Icon
            name="tabler:settings-2"
            class="active_icon w-5 h-5 text-neutral-400 group-hover:text-primaryvar1 transition-colors ease-in-out duration-200"
          />
          <p>{{ $t("settings") }}</p>
        </NuxtLink>
      </div>
    </nav>

    <section
      class="relative flex-1 min-h-screen flex flex-col justify-start overflow-y-auto overflow-x-hidden gap-3"
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

      <section class="flex-1 px-3">
        <slot />
      </section>
      <footer
        class="bg-light400 bg-opacity-50 h-fit py-2 flex items-center justify-center flex-col gap-2"
      >
        <div class="text-neutral300 font-semibold">
          <a rel="noopener noreferrer" href="#" class="hover:underline">
            Privacy policy
          </a>
          <span class="font-bold px-1">-</span>
          <a rel="noopener noreferrer" href="#" class="hover:underline">
            Terms of service
          </a>
        </div>
        <div class="text-sm text-neutral300">
          ©2023 hibirlink.com, All rights reserved
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.router-link-active,
.router-link-active .active_icon {
  color: #306ee8;
}

.router-link-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: #306ee8;
  height: 80%;
  margin: auto;
  width: 1px;
  transition: all 0.5s ease;
}
</style>

<script setup lang="ts">
import Logo from "~/assets/icons/logo.svg";
import { useAuth } from "~~/store/auth";
import { storeToRefs } from "pinia";
import logout from "@/apollo/mutation/logout.gql";

const { locale } = useI18n();
const route = useRoute();
const nestedNav = reactive({ products: false, services: false });
const showMobileDrawer = ref<boolean>(false);
const mobileNavTarget = ref(null);

const { email, name } = storeToRefs(useAuth());

const userName = ref<string>(name.value);
const userEmail = ref<string>(email.value);

watchEffect(() => {
  userName.value = name.value;
  userEmail.value = email.value;
});

const isLoading = ref<boolean>(false);
const {
  mutate: logOut,
  onError: onLogoutError,
  onDone: onLogoutResult,
} = useCustomMutation(logout);

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
  showMobileDrawer.value = false;
});
</script>
