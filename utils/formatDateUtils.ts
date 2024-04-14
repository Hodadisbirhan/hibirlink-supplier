export default (date: string) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return (
    new Date(date).toLocaleTimeString(undefined) +
    " " +
   new  Date(date).toLocaleDateString(undefined, options)
  );
};
