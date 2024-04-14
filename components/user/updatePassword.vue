<template>
  <div>
    <h-loading
      :show-loading="isLoading"
      loading-text="Updating Profile"
    ></h-loading>

    <h-notification
      @close="messageShow = false"
      :success="messageStatus"
      v-model="messageShow"
      >{{ messageContent }}
    </h-notification>
    <form @submit.prevent="onSubmit">
      <div>
        <h-text-field
          name="password"
          label="password"
          rules="required"
          type="password"
          :placeholder="$t('password')"
        />
        <h-text-field
          name="confirm_password"
          label="confirm_password"
          rules="confirmPassword:password"
          type="password"
          :placeholder="$t('confirm_password')"
        />

        <h-button
          btn-name="update"
          type="submit"
          rounded-class="rounded-sm"
          class="capitalize w-fit ml-auto"
          :gradient="false"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import updatePassword from "@/apollo/query/updateUserPassword.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid, token } = storeToRefs(useAuth());
const { handleSubmit } = useForm();
const isLoading = ref(false);
const {
  onDone: updatePasswordResult,
  onError: updateError,
  mutate: updatePass,
} = useCustomMutation(updatePassword);
updateError((error) => {
  isLoading.value = false;
  showNotification(false, "Password Update Error");
  console.log(error);
});
updatePasswordResult((result) => {
  isLoading.value = false;
  showNotification(true, "Password Update Successful");
});
const onSubmit = handleSubmit(
  (value) => {
    isLoading.value = true;
    updatePass({ pass: value.password, token: token.value });
  },
  (error) => {
    console.log("ERROR", error);
  }
);
const messageStatus = ref(false);
const messageShow = ref(false);
const messageContent = ref("");
const showNotification = (status, message) => {
  messageShow.value = true;
  messageStatus.value = status;
  messageContent.value = message;
};
</script>
