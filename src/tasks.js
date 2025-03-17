import { getCurrentProject } from "./projects";

const taskList = document.getElementById("task-list");
const taskBtn = document.getElementById("new-task");

function Task (text, projectId) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.projectId = projectId
}

function createTask () {
    const taskText = prompt("What do you need to do?");
    const task = new Task(taskText, getCurrentProject());
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks))
    const taskItem = document.createElement("p");
    taskItem.textContent = task.text;
    taskList.appendChild(taskItem);
}

function getTasks () {
    const storage = localStorage.getItem("tasks");
    if (storage !== null) {
        const tasksList = JSON.parse(storage);
        return tasksList;
    }
    return [];
}

function listTasks () {
    taskList.innerHTML = "";
    const taskArr = getTasks().filter(task => task.projectId === getCurrentProject());
    for (let task of taskArr) {
        const taskItem = document.createElement("p");
        taskItem.textContent = task.text;
        taskList.appendChild(taskItem);
    }
}

document.addEventListener("DOMContentLoaded", listTasks());

taskBtn.addEventListener("click", () => {
    createTask();
})

export { taskList, taskBtn, Task, createTask, listTasks}