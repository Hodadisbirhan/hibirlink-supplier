<template>
  <main class="w-full flex flex-col gap-4 py-6">
    <h-notification
      :message="message"
      v-model="show_notification"
      :success="success"
      class="z-50"
    />
    <h-modal
      v-model="is_open_modal"
      v-if="employee_by_id"
      contentParentClass="h-[90%] mx-auto  w-[60%]"
      subParentClass="flex items-center justify-center"
    >
      <template #content>
        <div
          class="flex h-full items-end justify-center text-center sm:items-center sm:p-0"
        >
          <section
            class="flex flex-col bg-light300 w-full h-full rounded-md px-3 py-3"
          >
            <h1
              class="text-xl w-full text-center font-bold text-darkblue uppercase"
            >
              The Detail of Employee
            </h1>
            <div class="grid grid-cols-2 justify-items-center py-[2rem] gap-5">
              <span class="text-darkblue font-semibold">Name:</span>
              <span
                >{{ employee_by_id.first_name }}
                {{ employee_by_id.last_name }}</span
              >
              <span class="text-darkblue font-semibold">Email:</span>
              <span>{{ employee_by_id.email }}</span>
              <span class="text-darkblue font-semibold">Phone:</span>
              <span>{{ employee_by_id.phone_number }}</span>
              <span class="text-darkblue font-semibold">Role:</span>
              <span>{{ employee_by_id.role }}</span>
              <span class="text-darkblue font-semibold">Created At:</span>
              <span>{{ new Date(employee_by_id.created_at) }}</span>
            </div>

            <div
              class="flex flex-col gap-3"
              v-if="employee_by_id.managedStore?.length > 0"
            >
              <hr />
              <h2 class="text-lg font-semibold text-darkblue">
                Store Assign to {{ employee_by_id.email }}
              </h2>
              <div
                class="flex w-[70%] mx-auto justify-end"
                v-if="selected_store.length > 0"
              >
                <h-button
                  type="button"
                  btn-name="delete"
                  :is-loading="loading"
                  @click="handleDeallocate(employee_by_id.id)"
                ></h-button>
              </div>
              <ul
                class="flex flex-col gap-2 w-full items-center overflow-y-auto h-[10rem]"
              >
                <li
                  v-for="{ store } in employee_by_id.managedStore"
                  class="flex flex-row items-center gap-3 w-[70%] bg-light300 rounded px-3 border-[0.1px] py-1"
                  :class="{
                    'border-primaryvar2': selected_store.includes(store.id),
                  }"
                  :key="store.id"
                >
                  <input
                    type="checkbox"
                    :value="store.id"
                    name="store"
                    v-model="selected_store"
                  />

                  <div class="flex flex-col gap-2">
                    <p class="text-darkblue font-semibold">{{ store.name }}</p>
                    <div class="flex flex-row gap-1">
                      <Icon
                        name="uil:location-point"
                        class="text-base text-neutral400"
                      ></Icon>
                      <span class="text-xs font-semibold text-neutral400">
                        {{ store.sub_city.region_city.translate.to[1].name }}

                        {{ store.sub_city.translate.to[1].name }}
                      </span>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div v-else>
              <span>He has no Store Still Assigned</span>
            </div>
          </section>
        </div>
      </template>
    </h-modal>

    <h-dialog
      title="confirmation_message"
      titleClass="text-red font-bold"
      :hideClosIcon="true"
      @form-submit="handleDelete"
      v-model="dialogData.showDelete"
    >
      <template #content>
        <div class="w-full flex justify-end items-center gap-4 pt-6">
          <h-button
            type="button"
            btn-name="no"
            @click="handleDelete(false)"
            class="w-fit"
            :gradient="false"
            rounded-class="rounded-md"
            btn-class="overflow-hidden border-2 border-darkblue text-darkblue hover:bg-darkblue hover:text-light400"
            btn-name-class="font-bold w-16"
          />
          <h-button
            type="button"
            btn-name="yes"
            @click="handleDelete(true)"
            class="w-fit"
            :gradient="false"
            rounded-class="rounded-md"
            btn-class="overflow-hidden border-2 border-red text-red hover:bg-red hover:text-light400"
            btn-name-class="font-bold w-16"
          />
        </div>
      </template>
    </h-dialog>

    <h-dialog
      title="Store Assign"
      v-model="dialogData.showReasignStore"
      @form-submit="handleStoreManagment"
      class="h-[100vh]"
    >
      <template #content>
        <div class="w-full bg-light400 rounded">
          <span class="text-lg font-semibold -mb-1 inline-block"
            >{{ selected_email }}
          </span>

          <div class="flex justify-between items-center">
            <p class="text-xs font-semibold text-neutral300">
              You Can Assign A multiple Store
            </p>
            <span class="text-xs mb-2 block"
              >{{ selected_store.length }} stores selected</span
            >
          </div>

          <ul class="flex flex-col gap-1 max-h-[20rem] overflow-y-auto">
            <li
              v-for="store in stores(selected_email)"
              class="flex flex-row items-center gap-3 bg-light300 rounded px-3 border-[0.1px] py-1"
              :class="{
                'border-primaryvar2': selected_store.includes(store.id),
              }"
              :key="store.id"
            >
              <input
                type="checkbox"
                :value="store.id"
                name="store"
                v-model="selected_store"
              />

              <div class="flex flex-col gap-2">
                <p class="text-darkblue font-semibold">{{ store.name }}</p>
                <div class="flex flex-row gap-1">
                  <Icon
                    name="uil:location-point"
                    class="text-base text-neutral400"
                  ></Icon>
                  <span class="text-xs font-semibold text-neutral400">
                    {{ store.sub_city.region_city.translate.to[1].name }}

                    {{ store.sub_city.translate.to[1].name }}
                  </span>
                </div>
              </div>
            </li>
          </ul>
          <div class="flex flex-row w-full justify-end mt-2">
            <h-button type="submit" btnName="Assign " :is-loading="loading">
            </h-button>
          </div>
        </div>
      </template>
    </h-dialog>

    <h-dialog
      title="assign_work_store"
      @form-submit="handleReasign"
      v-model="dialogData.showReasignRole"
    >
      <template #content>
        <div class="w-full flex flex-col items-center py-3">
          <h-select
            class="w-full"
            name="role"
            label="Role"
            :items="['store_manager', 'guest']"
          />
          <h-button
            type="submit"
            btn-name="assign_work_store"
            class="w-fit ml-auto"
            :gradient="false"
            rounded-class="rounded-md"
            btn-class="overflow-hidden bg-darkblue text-light400"
            btn-name-class="px-2 font-bold"
            :is-loading="loading"
            @click="reasignRole"
          />
        </div>
      </template>
    </h-dialog>

    <h-dialog
      :title="is_add ? 'Add Employee' : 'Edit Employee'"
      v-model="dialogData.showAdd"
      @form-submit="handleAdd"
      class="overflow-y-auto max-h-screen"
      :set-value="setEmployeeForEdit"
    >
      <template #content>
        <div class="w-full flex flex-col items-center py-3">
          <h-select
            class="w-full"
            name="role"
            label="Assign Role"
            :items="['guest', 'store_manager']"
          />
          <h-text-field
            name="first_name"
            label="first_name"
            placeholder="Abebe"
            rules="required"
            type="text"
          />
          <h-text-field
            name="last_name"
            label="last_name"
            placeholder="Kebede"
            rules="required"
            type="text"
          />
          <h-text-field
            name="email"
            label="email"
            :disabled="email_disable"
            placeholder="abebekebede@email.com"
            rules="email"
            type="text"
          />
          <h-text-field
            name="phone"
            label="phone"
            placeholder="0900000000"
            rules="phoneNumber"
            leading-text="+251"
            type="text"
          />
          <h-button
            type="submit"
            :is-loading="loading"
            loading-text="adding..."
            loading-text-class="text-light400"
            :btn-name="is_add ? 'add_employee' : 'update_employee'"
            class="w-fit ml-auto"
            :gradient="false"
            rounded-class="rounded-md"
            btn-class="overflow-hidden bg-darkblue text-light400"
            btn-name-class="px-2 font-bold"
          />
        </div>
      </template>
    </h-dialog>

    <div class="flex items-center justify-end gap-4 flex-wrap">
      <span>Filter by Store</span>
      <h-select
        :items="stores_array_name()"
        label=""
        v-model="store_name"
      ></h-select>
      <h-text-field
        name="search"
        leading-icon="fluent:table-search-20-filled"
        placeholder="search"
        type="text"
        v-model="search"
        class="max-w-md"
      />
      <h-button
        @click="
          ($event) => {
            email_disable = false;
            dialogData.showAdd = true;
            setEmployeeForEdit = {
              first_name: '',
              last_name: '',
              email: '',
              phone: '',
              role: '',
            };
            is_add = true;
          }
        "
        type="button"
        btn-name="add_employee"
        class="w-fit mb-4"
        leading-icon="uil:user-plus"
        :gradient="false"
        rounded-class="rounded-md"
        leading-icon-class="bg-primary"
        btn-class="overflow-hidden bg-darkblue text-light400"
        btn-name-class="px-2 font-bold"
      />
    </div>
    <h-table
      class="pb-32"
      v-if="employee_result"
      :loading="loadingToFetchEmployer"
      :headers="header"
      :body="employee_result"
      @click:row="click_row"
      header-class="bg-darkblue text-light300 py-2 rounded-sm px-1 border-b"
      body-class="py-3 border-b border-neutral500 px-1 font-bold text-neutral100"
    >
      <template #employee_name="{ item }">
        {{ item.first_name }} {{ item.last_name }}
      </template>
      <template #email="{ item }">
        {{ item.email }}
      </template>
      <template #phone="{ item }">
        {{ item.phone_number }}
      </template>
      <template #role="{ item }">
        {{ item.role }}
      </template>
      <template #action="{ item }">
        <div @click.stop="() => {}">
          <div>
            <h-employee-menu
              leading_icon="pepicons-pop:dots-x"
              @optionClicked="handleAction"
              class="z-30"
              :menu="{
                id: { email: item.email, id: item.id },
                actions: ['reasign', 'edit', 'delete', 'assign store'],
              }"
            />
          </div>
        </div>
      </template>
    </h-table>
    <div
      v-if="employee_result && employee_result.length < 1"
      class="flex items-center justify-center font-semibold text-primaryvar2"
    >
      No Result
    </div>
    <div
      v-else-if="employeeFetchError"
      class="flex flex-col justify-center items-center"
    >
      <a href="#" class="text-primaryvar4 font-semibold">Refresh</a>
    </div>
    <h-pagination
      class="w-full"
      :items-per-page="10"
      :offset="offset"
      :total-data="total_employee"
      v-if="total_employee"
      @update:offset="getOffset"
    />
  </main>
</template>

<script setup lang="ts">
import add_employee from "~/apollo/mutation/employee/add_employee.gql";
import fetch_employee from "~/apollo/query/employee/fetch_employee_by_supplier.gql";
import useCustomQuery from "~~/composables/useCustomQuery";
import fetch_employee_by_email from "~/apollo/query/employee/fetch_employee_by_email.gql";
import useCustomMutation from "~~/composables/useCustomMutation";
import update_employe_by_email from "~/apollo/mutation/employee/update_employee_by_email.gql";
import delete_employee_mutation from "~/apollo/mutation/employee/delete_employee.gql";
import fetch_store from "~/apollo/query/store/fetch_stores.gql";
import assign_store_to_employee from "~/apollo/mutation/store/assign_store_to_employee.gql";
import fetch_employee_by_id from "~/apollo/query/employee/fetch_employee_by_id.gql";
import deallocate_store from "~/apollo/mutation/store/deallocate_store.gql";
const _hibirlink = useCookie("_hibirlink");
const search = ref("");
const setEmployeeForEdit: any = ref(null);
const email_disable = ref(false);
const enable_query = ref(false);
const fetch_employee_by_email_variable: any = ref(null);
const fetch_employee_by_id_variable: any = ref(null);
const employee_by_id: any = ref();
const edited_employee_email: any = ref(null);
const selected_email = ref("");
const message = ref("");
const loading = ref(false);
const show_notification = ref(false);
const success = ref(false);
const is_add = ref(true);
const selected_store = ref([]);
const allStore: any = ref([]);
const selected_employee_id = ref("");
const offset = ref(0);
const store_name = ref("All");
const is_open_modal = ref(false);
const enable_by_id_query = ref(false);
const variable = computed(() => {
  console.log(_hibirlink.value.uid);

  if (search.value) {
    if (store_name.value != "" && store_name.value != "All")
      return {
        where: {
          manager_id: { _eq: _hibirlink.value.uid },
          _or: [
            {
              first_name: {
                _iregex: search.value.trim(),
              },
            },
            {
              last_name: {
                _iregex: search.value.trim(),
              },
            },
            {
              email: {
                _iregex: search.value.trim(),
              },
            },
            {
              phone_number: {
                _iregex: search.value.trim(),
              },
            },
          ],
          store_managed_bies: {
            store: {
              name: {
                _eq: store_name.value,
              },
            },
          },
        },
        limit: 10,
        offset: offset.value,
      };
    else
      return {
        where: {
          manager_id: { _eq: _hibirlink.value.uid },
          _or: [
            {
              first_name: {
                _iregex: search.value.trim(),
              },
            },
            {
              last_name: {
                _iregex: search.value.trim(),
              },
            },
            {
              email: {
                _iregex: search.value.trim(),
              },
            },
            {
              phone_number: {
                _iregex: search.value.trim(),
              },
            },
          ],
        },
        limit: 10,
        offset: offset.value,
      };
  } else {
    if (store_name.value != "" && store_name.value != "All") {
      // offset.value = 0;
      console.log(store_name.value);
      return {
        where: {
          manager_id: { _eq: _hibirlink.value.uid },

          store_managed_bies: {
            store: {
              name: {
                _eq: store_name.value,
              },
            },
          },
        },
        limit: 10,
        offset: offset.value,
      };
    } else
      return {
        where: { manager_id: { _eq: _hibirlink.value.uid } },
        limit: 10,
        offset: offset.value,
      };
  }
});

const {
  mutate: addEmployee,
  onDone: onAddEmployeeResult,
  onError: onAddEmployeeError,
} = useCustomMutation(add_employee);
const {
  mutate: update_employee,
  onError: onUpdateEmployeeError,
  onDone: onUpdateEmployeeResult,
} = useCustomMutation(update_employe_by_email);
const {
  mutate: deleteEmployee,
  onDone: onDeletedEmployee,
  onError: onDeleteEmployeeError,
} = useCustomMutation(delete_employee_mutation);
const {
  mutate: assignEmployee,
  onDone: onAssignEmployee,
  onError: onAssignEmployeeError,
} = useCustomMutation(assign_store_to_employee);
const {
  mutate: deallocateStore,
  onDone: onDeallocateStore,
  onError: onDeallocateStoreError,
} = useCustomMutation(deallocate_store);
const {
  error: fetch_employee_by_email_error,
  onResult: onFetchEmployeeByEmailSuccess,
  onError: onFetchEmployeeByEmailError,
  loading: fetch_employee_by_email_loading,
} = useCustomQuery(
  fetch_employee_by_email,
  fetch_employee_by_email_variable,
  0,
  enable_query
);
const {
  loading: fetch_store_loading_error,
  onResult: onFetchStoreResult,
  onError: onFetchStoreError,
} = useCustomQuery(fetch_store, {
  where: { supplier_id: { _eq: _hibirlink.value.uid } },
});

const {
  error: employeeFetchError,
  loading: loadingToFetchEmployer,
  refetch: refetchEmployee,
  result,
  fetchMore: fetchMoreEmployee,
  onError: onFetchEmployeeError,
  onResult: onFetchEmployeeResult,
} = useCustomQuery(fetch_employee, variable, 500);

const {
  onResult: onFetchEmployeeByIDResult,
  onError: onFetchEmployeeByIDError,
  loading: fetch_employee_by_id_loading,
} = useCustomQuery(
  fetch_employee_by_id,
  fetch_employee_by_id_variable,
  0,
  enable_by_id_query
);

const employee_result = computed(() => {
  // console.log(result.value?.users);
  return result.value?.users;
});
const total_employee = computed(() => {
  return result.value?.total_employee?.count.count;
});

//const supplier_email = "hodadisbirhan80@gmail.com";

type Dialog = {
  showAdd: boolean;
  showReasignRole: boolean;
  showReasignStore: boolean;
  showDelete: boolean;
  param: string | null;
};

const dialogData = reactive<Dialog>({
  showAdd: false,
  showReasignRole: false,
  showDelete: false,
  showReasignStore: false,
  param: null,
});

const handleAction = ({
  id,
  action,
}: {
  id: { email: string; id: string };
  action: string;
}) => {
  console.log(id, action);
  console.log(id);
  if (action == "reasign") {
    dialogData.showReasignRole = true;
    selected_email.value = id.email;
    edited_employee_email.value = id.email;
  } else if (action == "delete") {
    dialogData.showDelete = true;
    selected_email.value = id.email;
  } else if (action === "edit") {
    is_add.value = false;
    fetch_employee_by_email_variable.value = {
      where: { email: { _eq: id.email } },
    };
    enable_query.value = true;
  } else if (action === "assign store") {
    selected_email.value = id.email;
    dialogData.showReasignStore = true;
    selected_store.value = [];
    selected_employee_id.value = id.id;
  }

  dialogData.param = id.email;
};

const click_row = (value: any) => {
  console.log(value);
  selected_store.value = [];
  fetch_employee_by_id_variable.value = { employee_id: value };
  enable_by_id_query.value = true;
};

const handleAdd = (formData: Object) => {
  console.log(formData);
  loading.value = true;
  if (is_add.value) {
    addEmployee({
      Employee: {
        email: formData?.email,
        first_name: formData?.first_name,
        last_name: formData?.last_name,
        manager_id: _hibirlink.value?.uid,
        phone_number: formData.phone,
        sender_email: _hibirlink.value?.email,
        role: formData.role,
      },
    });
  } else {
    update_employee({
      email: edited_employee_email.value,
      set: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || edited_employee_email.value,
        role: formData.role,
        phone_number: formData.phone,
      },
    });
  }

  // dialogData.showAdd = false;
};
const handleStoreManagment = (formData: any) => {
  if (selected_store.value.length > 0) {
    loading.value = true;
    const objects = selected_store.value.map((element) => {
      return {
        employe_id: selected_employee_id.value,
        store_id: element,
      };
    });

    assignEmployee({
      objects,
    });
  }
};

const handleDeallocate = (employee_id) => {
  console.log(employee_id);

  loading.value = true;
  deallocateStore({
    where: {
      _and: [
        { store_id: { _in: selected_store.value } },
        { employe_id: { _eq: employee_id } },
      ],
    },
  });
};

onAddEmployeeResult((result: any) => {
  if (result.data.add_employer.status === 400) {
    message.value = result.data.add_employer.message;
    success.value = false;
    console.log(result);
  } else {
    console.log(result);
    message.value = "employee added Sucessfully";
    success.value = true;
    dialogData.showAdd = false;
    refetchEmployee();
  }

  show_notification.value = true;
  loading.value = false;
});

onAddEmployeeError((error: any) => {
  console.log(error);
  success.value = false;
  message.value = "oops! Some error happen please try again";
  show_notification.value = true;
  loading.value = false;
});

onFetchEmployeeError((error) => {
  console.log(error);
});

const handleReasign = (formData: Object) => {
  console.log(edited_employee_email.value);
  update_employee({
    email: edited_employee_email.value,
    set: {
      role: formData.role,
    },
  });
  dialogData.showReasignRole = false;
  dialogData.param = null;
};

const handleDelete = (confirmed: boolean) => {
  console.log(confirmed, dialogData.param);
  if (confirmed) {
    deleteEmployee({ employee_email: selected_email.value });
    // delete employee here
  }
  dialogData.showDelete = false;
  dialogData.param = null;
};

onFetchEmployeeByEmailError((error) => {
  enable_query.value = false;
  console.log(error);
});

onFetchEmployeeByEmailSuccess((result) => {
  if (result.data.employee?.length > 0) {
    console.log(result);
    const employee = result.data.employee[0];
    if (employee.id === employee.email) {
      email_disable.value = false;
      console.log("disabled");
    } else {
      email_disable.value = true;
    }

    setEmployeeForEdit.value = {
      role: employee.role,
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone: employee.phone_number,
      email: employee.email,
    };
    edited_employee_email.value = employee.email;

    dialogData.showAdd = true;
  }

  enable_query.value = false;
});
onFetchEmployeeByIDResult((result) => {
  console.log(
    result.data.user,
    "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999"
  );
  is_open_modal.value = true;
  employee_by_id.value = result.data.user;
  enable_by_id_query.value = false;
});
onFetchEmployeeByIDError((error) => {
  console.log(error);
  enable_by_id_query.value = false;
});

onUpdateEmployeeResult((result) => {
  loading.value = false;
  message.value = "Updated successfully";
  success.value = true;
  dialogData.showAdd = false;
  refetchEmployee();
});
onUpdateEmployeeError((error) => {
  loading.value = false;
  message.value = `${error}`;
  success.value = false;
  show_notification.value = true;
});
onDeletedEmployee((result) => {
  console.log("the deleted: ", result.data);
  if (result.data) {
    message.value = "deleted Successfully";
    success.value = true;
    show_notification.value = true;
    refetchEmployee();
  }
});
onDeleteEmployeeError((error) => {
  console.log(error);

  message.value = `${error}`;
  success.value = false;
  show_notification.value = true;
});
onDeallocateStore((result) => {
  console.log(result.data);
  loading.value = false;
  enable_by_id_query.value = true;
});
onDeallocateStoreError((error) => {
  loading.value = false;
  console.log(error);
});
onFetchStoreResult((result) => {
  if (result.data?.store.length > 0) {
    allStore.value = result.data?.store;
  }
  console.log(result.data);
});
onFetchStoreError((error) => {
  console.log(error.graphQLErrors);
});

onAssignEmployee((result) => {
  loading.value = false;
  dialogData.showReasignStore = false;
  console.log(result);
  refetchEmployee();
});

onAssignEmployeeError((error) => {
  loading.value = false;
  console.log(error);
});

const stores_array_name = () => {
  return [
    "All",
    ...allStore.value.map((value: any) => {
      return value.name;
    }),
  ];
};

const stores = (id: any) => {
  if (employee_result.value?.length > 0) {
    let single_employee = employee_result.value.find((element: any) => {
      return element.email === id;
    });
    console.log(single_employee.store_managed_by, " -----------------");
    let assigned_stored_id = single_employee.store_managed_by.map(
      (value: any) => {
        return value.store_id;
      }
    );

    //console.log(assigned_stored_id, "RoleIDs");

    return allStore.value.filter((value: any) => {
      return !assigned_stored_id.includes(value.id);
    });
  }
  return allStore.value;
};
const getOffset = (value: number) => {
  offset.value = value;
};

watch([store_name, search], (name, newSearch) => {
  offset.value = 0;
});
// dummy data
const header = ["employee_name", "email", "phone", "role", "action"];
const handle = () => {};
</script>
