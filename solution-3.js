const fs = require('fs').promises; // Using promises for cleaner async/await syntax

const queue = [];

// Function to acquire a lock on the file
async function acquireLock(fileName) {
  while (queue.includes(fileName)) {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for 100ms
  }
  queue.push(fileName);
}

// Function to release the lock on the file
function releaseLock(fileName) {
  const index = queue.indexOf(fileName);
  if (index !== -1) {
    queue.splice(index, 1);
  }
}

async function readFile(fileName) {
  return parseInt(await fs.readFile(fileName, 'utf8'));
}

async function writeFile(fileName, newValue) {
  await fs.writeFile(fileName, newValue.toString());
}

// Function to update the file value (combines read and write with locking)
async function updateFile(fileName) {
  try {
    await acquireLock(fileName);

    const currentValue = await readFile(fileName);
    console.log("Current value in file:", currentValue);

    const newValue = currentValue + 5;
    await writeFile(fileName, newValue);

    const finalValue = await readFile(fileName);
    console.log("New value in file:", finalValue, "\n");
  } catch (err) {
    console.error("Error updating file:", err);
  } finally {
    releaseLock(fileName);
  }
}

const fileName = "data.txt";

(async () => {
  const promises = [updateFile(fileName), updateFile(fileName)];
  await Promise.all(promises);

  process.exit(0);
})();
