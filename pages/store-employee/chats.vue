<template>
  <main
    class="flex max-w-[1200px] divide-x-2 bg-light400 rounded-md shadow-sm justify-center items-start gap-6 min-h-full mx-auto p-5"
  >
    <div class="flex-1 sm:min-w-[28rem] lg:max-w-md max-w-full space-y-2">
      <h-text-field
        name="search"
        placeholder="Search"
        leading-icon="ph:magnifying-glass"
      />
      <div class="space-y-4 h-[calc(100vh-9.3rem)] overflow-auto">
        <NuxtLink
          :to="{ path: `/chats`, query: { id: id } }"
          class="flex items-center gap-x-4 cursor-pointer h-fit p-2 rounded w-full"
          v-for="id in Object.keys(messages)"
          :key="id"
          :class="[
            activeChat == id ? 'bg-primaryvar4' : 'hover:bg-primaryvar7',
          ]"
        >
          <div class="relative flex-shrink-0">
            
            <div class="w-14 h-14 border rounded-full bg-neutral300 border-neutral500 flex items-center justify-center">
                <span class="text-xl font-bold text-white">{{ messages[id].name.toUpperCase().charAt(0)  }}</span>
            </div>
              
          </div>

          <div class="h-full flex flex-col">
            <div class="font-bold text-dark100 line-clamp-1">
              {{ messages[id].name }}
            </div>
            <div class="text-neutral200 font-medium line-clamp-1">
              {{ messages[id].message }}
            </div>
          </div>
          <div class="flex flex-col justify-between items-end h-full ml-auto">
            <p class="text-neutral200 font-medium text-md truncate">
              {{ messages[id].time[0]+" "+messages[id].time[0] }}
            </p>
            <div
              v-if="messages[id].notification"
              class="bg-primary w-fit h-fit px-2 rounded-full font-medium text-light400 text-md"
            >
              1
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <div class="flex-auto px-4 min-h-full" v-if="activeChat"><NuxtPage /></div>
    <div class="flex-auto min-h-full" v-else></div>
  </main>
</template>

<script setup lang="ts">
import fetchChatUsersGql from "@/apollo/query/chat/fetchChatUsers.gql";
import { reactive, watchEffect } from "vue";
import { useAuth } from "~~/store/auth";

import { storeToRefs } from "pinia";
const { uid ,setRefetchUserChat} = useAuth();
const {refetchUserChat}  = storeToRefs(useAuth())
const { result, onError,refetch } = useCustomQuery(fetchChatUsersGql, {
  user_id: uid,
});
onError((error) => {
  console.log(error);
});

const allMessage = computed(() => result.value?.message);

watch(refetchUserChat , (newVl) => {
  if(newVl){
   refetch();
   setRefetchUserChat(false);}
})

watchEffect(() => {


  allMessage.value?.forEach((msg: any) => {
    if (msg.sender_id === uid) {
      messages[msg.receiver_id] = {
        message: msg.message,
        name: msg.user.first_name + " " + msg.user.last_name,
        time: msg.created_at.substring(0, 16).split("T"),
        notification: false,
      };
    } else if (msg.receiver_id === uid) {
      messages[msg.sender_id] = {
        message: msg.message,
        name: msg.userBySenderId.first_name + " " + msg.user.last_name,
        time: msg.created_at.substring(0, 16).split("T"),
        notification: !msg.seen,
      };
    }
  });
});

const messages = <any>reactive({});





const route: any = useRoute();
const activeChat = computed(() => route?.query?.id ?? null);
useHead({
  title: "Chat",
});

definePageMeta({
  layout: "chat",
});
</script>
