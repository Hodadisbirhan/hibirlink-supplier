<template>
  <main
    class="flex max-w-[1200px] divide-x-2 bg-light400 rounded-md shadow-sm justify-center items-start gap-6 min-h-full mx-auto p-5"
  >
    <div class="flex-1 sm:min-w-[28rem] lg:max-w-md max-w-full space-y-2">
      <h-text-field
        name="search"
        placeholder="Search"
        leading-icon="ph:magnifying-glass"
        v-model="search"
      />
      <div
        class="space-y-4 h-[calc(100vh-9.3rem)] overflow-auto"
        v-if="allMessage"
      >
        <NuxtLink
          :to="{ path: `/chats`, query: { id: user?.id } }"
          class="flex items-center gap-x-4 cursor-pointer h-fit p-2 rounded w-full"
          v-for="user in allMessage"
          :key="user?.id"
          :class="[
            activeChat == user?.id ? 'bg-primaryvar4' : 'hover:bg-primaryvar7',
          ]"
        >
          <div class="relative flex-shrink-0">
            <div
              class="w-14 h-14 border rounded-full bg-neutral300 border-neutral500 flex items-center justify-center"
            >
              <span class="text-xl font-bold text-white">{{
                user?.first_name?.toUpperCase()?.charAt(0)
              }}</span>
            </div>
          </div>

          <div class="h-full flex flex-col">
            <div class="font-bold text-dark100 line-clamp-1">
              {{ user?.first_name }} {{ user?.last_name }}
            </div>
            <div class="text-xs font-medium text-dark300/70">
              {{ user?.email }}
            </div>
            <div class="text-neutral200 text-sm font-medium line-clamp-1">
              {{
                compare_message({
                  receiver: user?.receiver,
                  sender: user?.sender,
                })
                  ? compare_message({
                      receiver: user?.receiver,
                      sender: user?.sender,
                    })?.message
                  : ""
              }}
            </div>
          </div>
          <div class="flex flex-col justify-between items-end h-full ml-auto">
            <p class="text-neutral200/60 font-medium text-xs truncate">
              {{
                compare_message({
                  receiver: user?.receiver,
                  sender: user?.sender,
                })
                  ? formatDateUtils(
                      compare_message({
                        receiver: user?.receiver,
                        sender: user?.sender,
                      })?.created_at
                    )
                  : ""
              }}
            </p>
            <div
              v-if="false"
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
const { uid, setRefetchUserChat } = useAuth();
const { refetchUserChat } = storeToRefs(useAuth());
const search = ref("");
const variable = computed(() => {
  return {
    messageWhere: {
      _or: [{ sender_id: { _eq: uid } }, { receiver_id: { _eq: uid } }],
    },
    where: {
      id: { _neq: uid },
      ...(search.value
        ? {_or:[
            {first_name: { _iregex: search.value }},{last_name: { _iregex: search.value }},{email: { _iregex: search.value }}]
          }:{
            messages: {
              _or: [{ sender_id: { _eq: uid } }, { receiver_id: { _eq: uid } }],
            },
          }),
    },
  };
});

const { result, onError, refetch } = useCustomQuery(
  fetchChatUsersGql,
  variable
);

onError((error) => {
  console.log(error);
});

const allMessage = computed(() => result.value?.users);

watchEffect(() => {
  console.log(allMessage);
});

const compare_message = (message: any) => {
  if (message?.receiver?.length && message?.sender?.length) {
    if (message?.receiver[0]?.created_at >= message?.sender[0]?.created_at) {
      return message?.receiver[0];
    } else {
      return message?.sender[0];
    }
  } else if (message?.receiver?.length) {
    return message?.receiver[0];
  } else if (message?.sender?.length) {
    return message?.sender[0];
  } else return null;
};

// watch(refetchUserChat, (newVl) => {
//   if (newVl) {
//     refetch();
//     setRefetchUserChat(false);
//   }
// });

// watchEffect(() => {
//   allMessage.value?.forEach((msg: any) => {
//     if (msg.sender_id === uid) {
//       messages[msg.receiver_id] = {
//         message: msg.message,
//         name: msg.user.first_name + " " + msg.user.last_name,
//         time: msg.created_at.substring(0, 16).split("T"),
//         notification: false,
//       };
//     } else if (msg.receiver_id === uid) {
//       messages[msg.sender_id] = {
//         message: msg.message,
//         name: msg.userBySenderId.first_name + " " + msg.user.last_name,
//         time: msg.created_at.substring(0, 16).split("T"),
//         notification: !msg.seen,
//       };
//     }
//   });
// });

const messages = <any>reactive({});

// allMessage.value?.forEach((msg: any) => {
//   if (msg.sender_id === uid) {
//     messages[msg.receiver_id] = {
//       message: msg.message,
//       name: msg.user.first_name + " " + msg.user.last_name,
//       time: msg.created_at,
//       seen: msg.seen,
//     };
//   } else if (msg.receiver_id === uid) {
//     messages[msg.sender_id] = {
//       message: msg.message,
//       name: msg.userBySenderId.first_name + " " + msg.user.last_name,
//       time: msg.created_at,
//       seen: msg.seen,
//     };
//   }
// });

const route: any = useRoute();
const activeChat = computed(() => route?.query?.id ?? null);
useHead({
  title: "Chat",
});

definePageMeta({
  layout: "chat",
});
</script>
