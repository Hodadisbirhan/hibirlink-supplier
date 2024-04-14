<template>
  <div class="my-5 mb-16">
    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <h-confirm-action
      v-if="showConfirmationModal"
      @confirmation="confirmationAction"
    />
    <h-empty
      v-if="!loading && !services.length"
      content="You Do not have any virtual Services"
    >
    </h-empty>
    <div v-else v-for="service in services" :key="service.id" class="my-6">
      <card-virtual-service
        :id="service.id"
        :title="service.title"
        :score="service.score"
        :images="service.images"
        :web_link="service.web_link"
        :description="service.description"
        @menu-selected="handleSelectedMenu"
      />
    </div>
    <h-button
      @click="addService"
      type="button"
      btn-name="add_virtual_service"
      class="w-fit fixed bottom-20 right-7"
      leading-icon="mdi:puzzle-plus"
      :gradient="false"
      rounded-class="rounded-md"
      leading-icon-class="bg-primary"
      btn-class="overflow-hidden bg-darkblue text-light400"
      btn-name-class="px-2 font-bold"
    />
  </div>
</template>
<script setup lang="ts">
import fetchServices from "@/apollo/query/service/virtual/fetchServices.gql";
import deleteServices from "@/apollo/mutation/service/virtual/deleteProduct.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid } = storeToRefs(useAuth());
const router = useRouter();
const { result, error, loading, refetch } = useCustomQuery(fetchServices, {
  supplier_id: uid.value,
});
watchEffect(() => {
  console.log(error.value);
});
const services = computed(() => {
  const data = result.value?.supplier?.services;
  if (data) {
    return data.map((element: any) => {
      var imageData = [];
      imageData.push({ type: "images", url: element.logo });
      var description = "";

      element.description.ops.map((txt: any) => {
        description += txt.insert + " ";
      });
      if (element.images) {
        element.images.map((img: any) => {
          imageData.push({ type: "image", url: img.url });
        });
      }
      return {
        id: element.id,
        title: element.title,
        score: element.total_rate.rate.avg.rate,
        images: imageData,
        web_link: element.web_link,
        description: description,
      };
    });
  }
  return [];
});
const addService = () => {
  router.push({
    name: "my-services-add-virtual",
  });
};
interface Option {
  id: number;
  action: string;
}
const handleSelectedMenu = (value: Option) => {
  if (value.action == "edit") {
    router.push({
      name: "my-services-edit-virtual-service_id",
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
    deleteService({ service_id: serviceToDeleteId.value });
  } else {
    serviceToDeleteId.value = null;
  }
};
</script>
