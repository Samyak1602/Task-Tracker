# Task Tracker CLI

A simple command-line tool to manage your tasks using a local JSON file.

## Features

- Add new tasks
- List all tasks or filter by status (`todo`, `in-progress`, `done`)
- Update task descriptions
- Mark tasks as in-progress or done
- Delete tasks

## Usage

Run the CLI with Node.js:

```sh
node task-cli.js <command> [arguments]
```

### Commands

- `add <description>`  
  Add a new task with the given description.

- `list [status]`  
  List all tasks, or filter by status (`todo`, `in-progress`, `done`).

- `update <id> <new description>`  
  Update the description of a task by its ID.

- `mark-in-progress <id>`  
  Mark a task as in-progress.

- `mark-done <id>`  
  Mark a task as done.

- `delete <id>`  
  Delete a task by its ID.

## Example

```sh
node task-cli.js add "Write documentation"
node task-cli.js list
node task-cli.js mark-done 1
node task-cli.js delete 1
```

## Data Storage

Tasks are stored in a local `tasks.json` file in the project directory.

---

