const fs = require('fs');
const filePath = 'tasks.json';

// Get command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log("Please provide a command (add, list, update, delete, mark-in-progress, mark-done, etc.)");
  process.exit(1);
}

const command = args[0];
const params = args.slice(1);

// ADD Command
if (command === 'add') {
  const description = params.join(' ');
  if (!description) {
    console.log("Please provide a task description.");
    process.exit(1);
  }
  addTask(description);
}

// LIST Command
else if (command === 'list') {
  const statusFilter = params[0]; // could be undefined
  listTasks(statusFilter);
}

// MARK-IN-PROGRESS Command
else if (command === 'mark-in-progress') {
  const id = parseInt(params[0]);
  if (isNaN(id)) {
    console.log("Please provide a valid task ID.");
    process.exit(1);
  }
  updateTaskStatus(id, "in-progress");
}

// MARK-DONE Command
else if (command === 'mark-done') {
  const id = parseInt(params[0]);
  if (isNaN(id)) {
    console.log("Please provide a valid task ID.");
    process.exit(1);
  }
  updateTaskStatus(id, "done");
}

else if(command === 'update'){
    const id = parseInt(params[0]);
    const newDescription = params.slice(1).join(' ');
    if (isNaN(id) || !newDescription) {
    console.log("Usage: update <id> \"new description\"");
    process.exit(1);
  }
    updateTask(id,newDescription);
}

// DELETE command
else if (command === 'delete') {
  const id = parseInt(params[0]);
  if (isNaN(id)) {
    console.log("Please provide a valid task ID.");
    process.exit(1);
  }
  deleteTask(id);
}


// If unknown command
else {
  console.log(`Unknown command: ${command}`);
  process.exit(1);
}

// Function to add a new task
function addTask(description) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  let tasks = JSON.parse(data);

  const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const now = new Date().toISOString();

  const newTask = {
    id: nextId,
    description: description,
    status: "todo",
    createdAt: now,
    updatedAt: now
  };

  tasks.push(newTask);
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  console.log(`Task added successfully (ID: ${nextId})`);
}

// Function to list tasks (all or by status)
function listTasks(filterStatus) {
  if (!fs.existsSync(filePath)) {
    console.log("No tasks found.");
    return;
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  const tasks = JSON.parse(data);

  let filteredTasks = tasks;
  if (filterStatus) {
    filteredTasks = tasks.filter(task => task.status === filterStatus);
  }

  if (filteredTasks.length === 0) {
    console.log("No tasks to display.");
    return;
  }

  filteredTasks.forEach(task => {
    console.log(`[${task.id}] (${task.status}) ${task.description}`);
  });
}

// Function to update task status
function updateTaskStatus(id, newStatus) {
  if (!fs.existsSync(filePath)) {
    console.log("No tasks found.");
    return;
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  let tasks = JSON.parse(data);

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  tasks[index].status = newStatus;
  tasks[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  console.log(`Task ID ${id} marked as ${newStatus}.`);
}

function updateTask(id,newDescription){
    if (!fs.existsSync(filePath)) {
        console.log("No tasks found.");
        return;
    }
    const data = fs.readFileSync(filePath,'utf-8');
    let tasks = JSON.parse(data);
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
    }
    tasks[index].description = newDescription;
    tasks[index].updatedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
    console.log(`Task ID with ${id} updated successfully .`);
}


// Delete Task
function deleteTask(id) {
  if (!fs.existsSync(filePath)) {
    console.log("No tasks found.");
    return;
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  let tasks = JSON.parse(data);

  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) {
    console.log(`Task with ID ${id} not found.`);
    return;
  }

  tasks.splice(index, 1);
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
  console.log(`Task ID ${id} deleted successfully.`);
}


