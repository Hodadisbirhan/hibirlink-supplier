import { useAuth } from "@/store/auth";
import { storeToRefs } from "pinia";
export default defineNuxtRouteMiddleware((to, from) => {
  const { token, uid, role } = storeToRefs(useAuth());
  console.log(to);

  if (token.value && uid.value) {
    if (to.path == "/chats") {
      return true;
    } else if (
      (role.value == "guest" || role.value == "store_manager") &&
      to.path.includes("store-employee")
    ) {
      return true;
    } else if (role.value == "guest" || role.value == "store_manager") {
      return navigateTo({ path: "/store-employee" });
    } else if (
      role.value == "supplier" &&
      !to.path.includes("store_employee")
    ) {
      return true;
    } else if (role.value == "supplier") {
      return navigateTo("/");
    }
  } else {
    const _cookie = useCookie("_hibirlink").value;
    if (_cookie) {
      const { token, uid } = JSON.parse(JSON.stringify(_cookie)) as {
        token: string;
        uid: string;
        manager_id: string;
      };

      if (token && uid) {
        console.log(to);
        const { setUID, setToken, role } = useAuth();

        setUID(uid);
        setToken(token);
        return true;
      } else {
        window.location.href = "http://localhost:3000";
      }
    } else {
      window.location.href = "http://localhost:3000";
    }
  }
  return true;
});
