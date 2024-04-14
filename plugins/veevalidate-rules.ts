import { configure, defineRule } from "vee-validate";

export default defineNuxtPlugin((nuxtApp) => {
  configure({
    validateOnBlur: true,
    validateOnChange: true,
    validateOnInput: true,
    validateOnModelUpdate: true,
  });

  defineRule("required", (value, target, ctx) => {
    if (value && value.toString().trim()) return true;
    else return splitCamelCaseString(ctx.field) + " is required";
  });

  defineRule("email", (value: string, target, ctx) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value.trim()))
      return true;
    else return splitCamelCaseString(ctx.field) + " is invalid";
  });

  defineRule("phoneNumber", (value: string, target, ctx) => {
    if (
      /\d{9}/.test(value.toString().trim()) &&
      value.toString().trim().length === 9
    )
      return true;
    else return splitCamelCaseString(ctx.field) + " is invalid";
  });
  defineRule("password", (value, target, ctx) => {
    if (value && value.toString().length > 5) return true;
    else return splitCamelCaseString(ctx.field) + " must be 6+ chars";
  });
  defineRule("confirmPassword", (value, target: string, ctx) => {
    if (ctx.form[target] != value) return "Password does't match";
    else return true;
  });
  defineRule("endTime", (value, target: string, ctx) => {
    const time1 = ctx.form[target] as string;
    const time2 = value as string;
    const [h1, m1] = time1?.split(":")?.map(Number);
    const [h2, m2] = time2?.split(":")?.map(Number);
    const totalMinutes1 = h1 * 60 + m1;
    const totalMinutes2 = h2 * 60 + m2;
    if (totalMinutes1 < totalMinutes2) return true;
    else return splitCamelCaseString(ctx.field) + " must have higher value.";
  });

  defineRule("price", (value, target, ctx) => {
    if (value != undefined && value?.toString()?.trim()) {
      if (Number(value) > 0) return true;
      else return splitCamelCaseString(ctx.field) + " can not be less than 1";
    } else return splitCamelCaseString(ctx.field) + " is Required";
  });
  defineRule("minOrder", (value, target, ctx) => {
    if (value != undefined && value?.toString()?.trim()) {
      if (Number(value) > 0)
        if (ctx.form[target] < value) return "Minimum order exceeds amount";
        else return true;
      else return splitCamelCaseString(ctx.field) + " can not be less than 1";
    } else return true;
  });
  defineRule("amount", (value, target, ctx) => {
    if (value != undefined && value?.toString()?.trim()) {
      if (Number(value) > 0) return true;
      else return splitCamelCaseString(ctx.field) + " can not be less than 1";
    } else return splitCamelCaseString(ctx.field) + " is Required";
  });
  defineRule("discount", (value, target, ctx) => {
    if (value != undefined && value?.toString()?.trim()) {
      if (Number(ctx.form[target]) > Number(value)) return true;
      else return splitCamelCaseString(ctx.field) + " should be < price";
    } else return true;
  });
  defineRule("special_discount", (value, target, ctx) => {
    if (value != undefined && value?.toString()?.trim()) {
      if (Number(value) > 0 && Number(value) < 100) return true;
      else return splitCamelCaseString(ctx.field) + " should be in range 1-100";
    } else return true;
  });
  defineRule("start_date", (value, target: string, ctx) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    const date1 = new Date(mm + "-" + dd + "-" + yyyy);
    const date2 = new Date((value as string).replace("/", "-"));

    if (date1 < date2) return true;
    else
      return (
        splitCamelCaseString(ctx.field) + " the day selected is already passed"
      );
  });
  defineRule("end_date", (value, target: string, ctx) => {
    const date1 = new Date((ctx.form[target] as string).replace("/", "-"));
    const date2 = new Date((value as string).replace("/", "-"));

    if (date1 < date2) return true;
    else
      return (
        splitCamelCaseString(ctx.field) + " must have greater than start date."
      );
  });
});

const splitCamelCaseString = (str: string): string => {
  const words = str.split("_");
  const titleCaseWords = words?.map(
    (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)
  );
  const titleCaseString = titleCaseWords?.join(" ");

  return titleCaseString;
};
