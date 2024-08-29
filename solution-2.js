const fs = require('fs').promises; // Using promises for cleaner async/await syntax

let isBlocked = false;

// Function to read the current value from the file
async function readFile(fileName) {
  return parseInt(await fs.readFile(fileName, 'utf8'));
}

// Function to write a new value to the file
async function writeFile(fileName, newValue) {
  await fs.writeFile(fileName, newValue.toString());
}

// Function to update the file value (combines read and write)
async function updateFile(fileName) {
  if (isBlocked) {
    console.log("Process is blocked, skipping update");
    return;
  }
  try {
    isBlocked = true;
    const currentValue = await readFile(fileName);
    console.log("Current value in file:", currentValue);

    const newValue = currentValue + 5;
    await writeFile(fileName, newValue);

    const finalValue = await readFile(fileName);
    console.log("New value in file:", finalValue, "\n");
  } catch (err) {
    console.error("Error updating file:", err);
  } finally {
    isBlocked = false;
  }
}

const fileName = "data.txt";

(async () => {
  const promises = [updateFile(fileName), updateFile(fileName)]
  await Promise.all(promises);

  process.exit(0);
})();
