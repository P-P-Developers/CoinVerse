// let str = "ajay";
// let reversed = "";

// for (let i = str.length - 1; i >= 0; i--) {
//   reversed += str[i];
// }

// console.log(reversed); 


// function bubbleSort(arr) {
//   let n = arr.length;
//   for (let i = 0; i < n - 1; i++) {
//     // flag to check if any swap happened
//     let swapped = false;
//     for (let j = 0; j < n - 1 - i; j++) {
//       if (arr[j] > arr[j + 1]) {
//         // swap
//         [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
//         swapped = true;
//       }
//     }
//     // if no swap happened, array is already sorted
//     if (!swapped) break;
//   }
//   return arr;
// }
// console.log(bubbleSort([5, 3, 8, 4, 2])); // Output: [2, 3, 4, 5, 8]



let a = 5;
let b = 10;

[a, b] = [b, a];

 console.log(a); 
 console.log(b); 

 