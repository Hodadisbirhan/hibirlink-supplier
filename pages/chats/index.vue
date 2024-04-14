<template>
  <main class="h-[calc(100vh-6rem)] flex flex-col gap-4">
    <div class="flex-1 w-full flex items-center gap-4">
      <!-- <button type="button">
        <Icon
          name="material-symbols:arrow-back-rounded"
          class="w-7 h-7 text-neutral200 hover:text-dark100"
        />
      </button> -->
      <div>
        <div class="font-bold text-dark100 line-clamp-1">
          {{
            result?.user?.first_name
              ? result?.user?.first_name + " " + result?.user?.last_name
              : ""
          }}
        </div>
        <div class="text-neutral200 font-medium line-clamp-1">
          <!-- last seen {{ new Date().toString().slice(0, 21) }} -->
        </div>
      </div>
      <h-menu
        leading_icon="bx:dots-vertical-rounded"
        @optionClicked.stop="handleAction"
        class="ml-auto self-end"
        :menu="{
          id: 'chat-id',
          actions: [MenuActions.CLEARHISTORY, MenuActions.DELETECHAT],
        }"
      />
    </div>

    <div ref="chatList" class="flex-auto h-full overflow-y-auto">
      <ul class="w-full" v-for="message in result?.message" :key="message?.id">
        <li class="flex items-end gap-1" v-if="message.receiver_id == uid">
          <img
            src="https://source.unsplash.com/50x50/?portrait"
            alt=""
            class="w-8 h-8 border rounded-full bg-neutral300 border-neutral500"
          />
          <div class="">
            <p
              class="bg-neutral600 xl:max-w-lg max-w-sm p-3 rounded-r-lg rounded-tl-lg my-1.5"
            >
              {{ message?.message }}
            </p>
            <small>{{ formatDateUtils(message?.updated_at) }}</small>
          </div>
        </li>

        <li class="self-end flex flex-col gap-0.5 items-end mt-4" v-else>
          <p
            class="bg-primaryvar3 xl:max-w-lg max-w-sm p-3 rounded-r-lg rounded-tl-lg my-1.5"
          >
            {{ message?.message }}
          </p>
          <small class="">{{ formatDateUtils(message?.updated_at) }}</small>
        </li>
      </ul>
    </div>

    <div
      class="flex-1 flex items-end gap-4 bg-light400 p-3 rounded shadow-[0px_0px_24px_8px_rgba(220,220,220,0.3)]"
    >
      <Icon
        name="mdi:paperclip-plus"
        class="text-neutral200 w-6 h-6 hover:text-primary cursor-pointer"
      />

      <textarea
        v-model="message"
        ref="chatField"
        :rows="1"
        @keyup="handleKeyup($event)"
        class="textarea resize-ta ring-0 w-full appearance-none resize-none border-none outline-none focus:border-none focus:outline-none"
        placeholder="Write a message..."
      ></textarea>

      <button type="button" class="cursor-pointer" @click="sendMessage">
        <Icon
          name="fluent:send-48-filled"
          class="w-7 h-7 text-neutral200 hover:text-primary"
        />
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import fetchMessage from "@/apollo/query/chat/fetchMessages.gql";
import sendMessageQl from "@/apollo/query/chat/sendMessage.gql";
import makeAllSeen from "@/apollo/query/chat/makeAllSeen.gql";
import { useAuth } from "@/store/auth";
import { storeToRefs } from "pinia";
import { watch } from "vue";
const { uid, setRefetchUserChat } = useAuth();
const route = useRoute();
const user_id = computed(() => {
  return route.query.id;
});

const {
  mutate: makeSeen,
  onDone: seenDone,
  onError: seenError,
} = useCustomMutation(makeAllSeen);
watchEffect(() => {
  makeSeen({ user_id: uid, sender_id: user_id.value });
});
seenError((error) => {
  console.log(error);
});
seenDone((res) => {
  setRefetchUserChat(true);
  console.log(res);
});
const variable = computed(() => {
  return { supplier_id: uid, user_id: user_id.value };
});
const { result, onError, refetch } = useCustomQuery(fetchMessage, variable);
onError((error) => {
  console.log(error);
});

enum MenuActions {
  CLEARHISTORY = "Clear History",
  DELETECHAT = "Delete Chat",
}
enum MessageType {
  ME = "me",
  OTHER = "other",
}
interface Messages {
  type: MessageType;
  contents: Array<string | undefined>;
  date: Date | string;
}

const chatField = ref();
const chatList = ref();
function calcHeight(value: any) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  // min-height + lines x line-height + padding + border
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
  return newHeight;
}
const handleKeyup = (event: any) => {
  chatField.value.style.height = calcHeight(chatField.value.value) + "px";
};
const {
  mutate: sendMessageMutation,
  onError: messageSendError,
  onDone: messageSendDone,
} = useCustomMutation(sendMessageQl);
messageSendError((error) => {
  console.log(error);
});
messageSendDone((result) => {
  setRefetchUserChat(true);
  message.value = "";
  refetch();
  setTimeout(() => {
    chatList.value.scrollTop = chatList.value.scrollHeight + 100000;
  }, 1000);
});
const message = ref<string>();
const sendMessage = () => {
  if (message.value) {
    sendMessageMutation({
      receiver_id: user_id.value,
      sender_id: uid,
      message: message.value,
    });
  }
};

const messages = computed(() => {
  if (result.value?.message) {
    return result.value?.message.map((msg: any) => {
      const date = msg.updated_at.substring(0, 16).split("T");
      return {
        type: uid == msg.receiver_id ? MessageType.ME : MessageType.OTHER,
        content: msg.message,
        date: date[0] + " - " + date[1],
      };
    });
  }

  return null;
});

watch(messages, (newResult) => {
  if (newResult) {
    setTimeout(() => {
      chatList.value.scrollTop = chatList.value.scrollHeight + 100000;
    }, 1000);
  }
});

const handleAction = (id: string, action: MenuActions) => {};

definePageMeta({
  layout: "chat",
});
</script>
