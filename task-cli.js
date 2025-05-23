//Get command line arguments (skip first 2: 'node' and 'task-cli.js')
const fs = require('fs');
const filePath = 'tasks.json';

const args = process.argv.slice(2);

//check if user provided a command
if(args.length == 0){
    console.log("Please provide a command (add,list,update,delete,etc.)");
    process.exit(1);
}

//Extract the command and parameters
const command = args[0];
const params = args.slice(1);

if(command === 'add'){
    const description = params.join(' ');
    if(!description){
        console.log("Please provide a task description.");
        process.exit(1);
    }
    addTask(description);
}

function addTask(description){
    if(!fs.existsSync(filePath)){
        fs.writeFileSync(filePath,'[]');
    }
    //Read existing tasks
    const data = fs.readFileSync(filePath,'utf-8');
    let tasks = JSON.parse(data);
    //Generate uinque ID
    const nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
    const now = new Date().toISOString();

    //Create new task
    const newTask = {
        id: nextId,
        description : description,
        status : "todo",
        createdAt : now,
        updatedAt : now,
    };

    //Add task and write to file
    tasks.push(newTask);
    fs.writeFileSync(filePath,JSON.stringify(tasks,null,2));
    console.log(`Task added successfully (ID:${nextId})`);
}

if(command === 'list'){
    const status = params[0];
    listTasks(status);
}

function listTasks(filterStatus){
    if(!fs.existsSync(filePath)){
        console.log("No tasks found.");
        return;
    }
    const data = fs.readFileSync(filePath,'utf-8');
    const tasks = JSON.parse(data);

    let filteredTasks = tasks;
    if(filterStatus){
        filteredTasks = tasks.filter(task => task.status === filterStatus);
    }

    if(filteredTasks.length === 0){
        console.log("No tasks to display.");
        return;
    }

    filteredTasks.forEach(task=>{
        console.log(`[${task.id}] (${task.status}) ${task.description}`);
    });
}

if(command === 'mark-in-progress'){
    const id = parseInt(params[0]);
    if(isNaN(id)){
        console.log("Please provide a valid task ID.");
        process.exit(1);
    }
    updateTaskStatus(id,"in-progress");
}

if(command === 'mark-done'){
    const id = parseInt(params[0]);
    if(isNaN(id)){
        console.log("Please provide a valid task ID.");
        process.exit(1);
    }
    updateTaskStatus(id,"done");
}

else{
    console.log(`Unknown command: ${command}`);
    process.exit(1);
}

