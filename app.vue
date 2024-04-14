<template>
  <h-loading v-if="loading" :show-loading="loading" />
  <main v-else class="min-w-screen min-h-screen font-nunito">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>
<script setup lang="ts">
import fetchSupplierStatus from "@/apollo/query/fetchSupplierStatus.gql";
import useCustomQuery from "./composables/useCustomQuery";
import { useAuth } from "./store/auth";

const router = useRouter();
const loading = ref(true);

const { uid, setReviewMessage, setReviewStatus, role } = useAuth();

const { onResult, onError } = useCustomQuery(fetchSupplierStatus, { uid });

onResult(async (data: any) => {
  if (data.data.users_by_pk) {
    if (
      data.data.users_by_pk.status === "pending" ||
      data.data.users_by_pk.status === "suspended"
    ) {
      setReviewMessage(data.data.users_by_pk.reason);
      setReviewStatus(data.data.users_by_pk.status);
      loading.value = false;
      await router.replace({ name: "review" });
    } else if (data.data.users_by_pk.status === "verified") {
      loading.value = false;
    } else {
      loading.value = false;
      if (useRoute().path != "/chats")
        window.location.href = "http://localhost:3000";
    }
  } else {
    loading.value = false;
    if (useRoute().path != "/chats")
      window.location.href = "http://localhost:3000";
  }
});
onError((error) => {
  console.log(error);
  loading.value = false;
});
</script>
