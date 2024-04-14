import { useAuth } from "~~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { uid, role } = useAuth();
  console.log("Sdsdsdsds");
  if (uid) {
    console.log("Sdsdsdsds");

    if (
      (role == "guest" || role == "store_manager") &&
      to.path.includes("store_employee")
    ) {
      return true;
    } else if (role == "guest" || role == "store_manager") {
      return navigateTo({ name: "store-employee-index" });
    } else if (role == "supplier" && !to.path.includes("store_employee")) {
      return true;
    } else if (role == "supplier") {
      return navigateTo("/");
    }
  } else return abortNavigation();
  // return true
});
