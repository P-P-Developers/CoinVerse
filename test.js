// Find Duplicate Elements in an Array

let a = [5,8,2,9,1,4,3];
let Duplicate = [];

// for(let i=0;i<a.length;i++){
//     for(let j=i+1;j<a.length;j++){
//         if(a[i]===a[j] && i !=j){
//             Duplicate.push(a[i])
//         }
//     }
// }

// SORT WITH OUT METHOD


let Sort = [];

for(let i=0;i<a.length;i++){
    for(let j=i+1;j<a.length;j++){
        if(a[i]>a[j]){
            let temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
    }
}

console.log(a);
