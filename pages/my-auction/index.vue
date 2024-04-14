<template>
  <div class="coming-soon-page">
    <div class="logo"></div>
    <h1 class="text-4xl font-bold mb-4">Coming Soon</h1>
    <p class="text-xl text-gray-600 mb-8">
      We're currently working on something awesome. Stay tuned!
    </p>
    <div class="countdown flex space-x-8 text-3xl font-bold">
      <div class="countdown-item">
        <span class="countdown-number">{{ days }}</span>
        <span class="countdown-label">Days</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">{{ hours }}</span>
        <span class="countdown-label">Hours</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">{{ minutes }}</span>
        <span class="countdown-label">Minutes</span>
      </div>
      <div class="countdown-item">
        <span class="countdown-number">{{ seconds }}</span>
        <span class="countdown-label">Seconds</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const launchDate = new Date("2023-05-01");
    const now = ref(new Date());
    const days = computed(() =>
      Math.floor((launchDate - now.value) / (1000 * 60 * 60 * 24))
    );
    const hours = computed(() =>
      Math.floor(
        ((launchDate - now.value) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
    );
    const minutes = computed(() =>
      Math.floor(((launchDate - now.value) % (1000 * 60 * 60)) / (1000 * 60))
    );
    const seconds = computed(() =>
      Math.floor(((launchDate - now.value) % (1000 * 60)) / 1000)
    );

    const startCountdown = () => {
      setInterval(() => {
        now.value = new Date();
      }, 1000);
    };

    onMounted(() => {
      startCountdown();
    });

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  },
};
</script>

<style>
.coming-soon-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  width: 150px;
  height: 150px;
  background-color: #ffffff;
  border-radius: 50%;
  margin-bottom: 2rem;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.countdown-number {
  font-size: 4rem;
}

.countdown-label {
  font-size: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}
</style>
