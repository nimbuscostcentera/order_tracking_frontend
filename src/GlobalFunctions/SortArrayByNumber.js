export default function SortArrayByNumber(order, Array, field) {
  const sortedArray = [...Array];

  if (order === "Asc") {
    sortedArray.sort((a, b) => (parseFloat(a[field]) - parseFloat(b[field])));
  } else if (order === "Desc") {
    sortedArray.sort((a, b) => (parseFloat(b[field]) - parseFloat(a[field])));
  }
  return sortedArray
}