function twoSum(nums, target) {
    const numMap = new Map(); // Stores value -> index

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (numMap.has(complement)) {
            return [numMap.get(complement), i]; // Return the indices
        }

        numMap.set(nums[i], i);
    }

    return []; // Just in case, though the problem says one solution always exists
}

// Example usage:
const nums = [1, 5, 7, 2, 11, 8];
const target = 13;

const result = twoSum(nums, target);
console.log(result); // Output: [2, 4] → Because nums[2] + nums[4] = 7 + 6 = 13
