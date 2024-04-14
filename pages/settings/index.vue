<template>
  <div class="flex md:flex-row flex-col gap-6 m-6" v-if="loadForm">
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
    <form @submit.prevent="onSubmit" class="w-full">
      <div>
        <h-text-field
          name="first_name"
          label="first_name"
          rules="required"
          :placeholder="$t('first_name')"
        />
        <h-text-field
          name="last_name"
          label="last_name"
          rules="required"
          :placeholder="$t('last_name')"
        />
        <h-text-field
          name="email"
          label="email"
          rules="required"
          :placeholder="$t('email')"
        />
        <h-text-field
          name="phone_number"
          label="phone_number"
          rules="required"
          :placeholder="$t('phone_number')"
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
    <UserUpdatePassword class="w-full" />
  </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import userQuery from "@/apollo/query/fetchUserData.gql";
import updateUserData from "@/apollo/query/updateUserData.gql";
import { storeToRefs } from "pinia";
import { useAuth } from "~~/store/auth";

const { uid, token } = storeToRefs(useAuth());
const { handleSubmit, setValues } = useForm();
const isLoading = ref(false);
const { onError: userError, result: userResult } = useCustomQuery(userQuery, {
  user_id: uid.value,
});

const {
  mutate: updateUser,
  onError: updateError,
  onDone: updateResult,
} = useCustomMutation(updateUserData);
updateError((error) => {
  isLoading.value = false;
  showNotification(false, "Error Occurred While Updating");
  console.log(error);
});
updateResult((result) => {
  showNotification(true, "Update Successful");
  isLoading.value = false;
  console.log(result);
});
userError((error) => {
  showNotification(false, "Error Occurred While Fetching UserData");

  isLoading.value = false;
  console.log(error);
});

const loadForm = ref(false);
watch(userResult, (user) => {
  if (user?.user) {
    setValues({
      first_name: user?.user.first_name,
      last_name: user?.user.last_name,
      email: user?.user.email,
      phone_number: user?.user.phone_number,
    });
    loadForm.value = true;
  }
});
const onSubmit = handleSubmit(
  (value) => {
    isLoading.value = true;
    updateUser({
      token: token.value,
      fname: value.first_name,
      lname: value.last_name,
      phone: value.phone_number,
      email: value.email,
      user_id: uid.value,
    });
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
