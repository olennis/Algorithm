const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function bst(array, num) {
  let pivot = array[Math.floor(array.length / 2)];
  console.log("array:", array, "pivot:", pivot);
  if (num === pivot) {
    return num;
  } else if (num > pivot) {
    return bst(array.splice(Math.floor(array.length / 2) + 1), num);
  } else if (num < pivot) {
    return bst(array.splice(0, Math.floor(array.length / 2)), num);
  }
}
bst(arr, 9);
