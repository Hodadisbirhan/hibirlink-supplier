<template>
  <main class="w-full py-3 relative">
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h-confirm-action
      v-if="showConfirmationModal"
      @confirmation="confirmationAction" />
    <h-loading
      v-if="loading"
      :show-loading="loading" />

    <div class="w-full h-14"></div>
    <h-empty
      v-if="!loading && !realtimeServices.length"
      content="You Do not have any Realtime Services">
    </h-empty>
    <card-service
      class="mb-5"
      v-else
      v-for="service in realtimeServices"
      :key="service.id"
      :id="service.id"
      :title="service.title"
      :availability="service.availability"
      :status="service.status"
      :images="getImages(service.media, service.logo)"
      :license="license"
      :score="service.user_rate.total_rate.avg.rate"
      :description="descriptionValue(service.description.ops)"
      @menu-selected="handleSelectedMenu" />

    <div class="w-full h-8"></div>
    <HButton
      @click="handleAddService"
      type="button"
      btn-name="add_realtime_service"
      class="w-fit fixed bottom-20 right-7"
      leading-icon="mdi:puzzle-plus"
      :gradient="false"
      rounded-class="rounded-md"
      leading-icon-class="bg-primary"
      btn-class="overflow-hidden bg-darkblue text-light400"
      btn-name-class="px-2 font-bold" />
  </main>
</template>

<script lang="ts" setup>
import fetchRealtimeServices from "~/apollo/query/service/realtime/fetchRealtimeServices.gql";
import deleteServices from "~/apollo/mutation/service/realtime/deleteProduct.gql";
import { useAuth } from "~~/store/auth";

const { uid } = useAuth();
const { loading, result, onError, refetch } = useCustomQuery(
  fetchRealtimeServices,
  {
    supplier_id: uid,
  }
);

let license = ref<Array<{ licensed: boolean; img: null | string }>>([]);

const descriptionValue = (value: Array<{ insert: string }>) => {
  let description = "";
  value.forEach((value) => {
    description += value.insert;
  });

  return description;
};

const getImages = (
  media: Array<{ id: number; url: string; type: string }>,
  logo: string
) => {
  const urls = media.map((image) => {
    return { type: image.type, url: image.url };
  });

  return [{ url: logo, type: "image" }, ...urls];
};

const realtimeServices = computed(() => {
  return result.value ? result.value.supplier.realtime_services : [];
});

onError((error) => {
  console.log(error);
});

const router = useRouter();
const handleAddService = () => {
  router.push({ name: "my-services-add-realtime" });
};

interface Option {
  id: number;
  action: string;
}

const handleSelectedMenu = (value: Option) => {
  if (value.action == "edit") {
    router.push({
      name: "my-services-edit-realtime-service_id",
      params: { service_id: value.id },
    });
  } else if (value.action == "delete") {
    serviceToDeleteId.value = value.id;
    showConfirmationModal.value = true;
  }
};

const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
const showNotification = (status: boolean, message: string) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
const {
  mutate: deleteService,
  onDone: onDeleteComplete,
  onError: onDeleteError,
} = useCustomMutation(deleteServices);
onDeleteComplete((res) => {
  refetch();
  serviceToDeleteId.value = null;
  showNotification(true, "Service Delete Success");
});

onDeleteError((error) => {
  console.log(error);
  serviceToDeleteId.value = null;
  showNotification(
    false,
    error.message.includes("foreign")
      ? "U cant delete this service as it is occupied"
      : "Service Delete Error"
  );
});
const serviceToDeleteId = ref();
const showConfirmationModal = ref(false);
const confirmationAction = (response: any) => {
  showConfirmationModal.value = false;
  if (response.accept) {
    console.log(serviceToDeleteId.value);
    deleteService({ service_id: serviceToDeleteId.value });
  } else {
    serviceToDeleteId.value = null;
  }
};
</script>
