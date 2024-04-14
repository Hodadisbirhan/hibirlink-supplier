<template>
  <main
    class="min-h-screen w-full flex items-center justify-center max-w-md mx-auto"
  >
    <div v-if="reviewStatus === 'pending'">
      <h1 class="text-2xl font-bold mb-2 text-primary text-center">
        Information is Under Review
      </h1>
      <p>
        We wanted to inform you that we have received your submitted
        information, and it is currently
        <span class="text-lg font-bold text-orange">under review</span> . Our
        team is diligently examining the details you provided to ensure accuracy
        and compliance with our requirements.
      </p>
      <p>
        You can still visit the hibirlink site
        <a href="http://localhost:3000" class="text-primary">here</a>.
      </p>
    </div>
    <div v-if="reviewStatus === 'suspended'">
      <h1 class="text-2xl font-bold mb-2 text-red text-center">
        The provided info has been suspended
      </h1>
      <p>
        {{ reviewMessage }}
      </p>
      <p>
        Yoy can reapply to become a supplier again with the necessary
        information
        <a href="http://localhost:3000/register" class="text-primary">here</a>.
      </p>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { useAuth } from "~~/store/auth";
const { reviewMessage, reviewStatus } = useAuth();

definePageMeta({
  validate: (route) => {
    const { reviewMessage, reviewStatus } = useAuth();
    if (reviewStatus) return true;
    else return false;
  },
  layout: "custom",
});
</script>
