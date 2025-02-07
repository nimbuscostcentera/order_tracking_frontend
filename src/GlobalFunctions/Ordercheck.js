const Ordercheck=(array,field)=>{
  console.log(array,field ,"sorting func")
    let isAscending = true;
  let isDescending = true;

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i][field] > array[i + 1][field]) {
      isAscending = false;
    }
    if (array[i][field] < array[i + 1][field]) {
      isDescending = false;
    }
  }

  if (isAscending) return "Asc";
  if (isDescending) return "Desc";
}

export default Ordercheck;