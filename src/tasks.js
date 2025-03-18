import { getCurrentProject } from "./projects";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";

const taskArea = document.getElementById("task-area");
const taskList = document.getElementById("task-list");
const taskBtn = document.getElementById("new-task");
const completedTaskList = document.getElementById("completed-tasks");

function Task (text, projectId) {
    this.id = crypto.randomUUID();
    this.text = text;
    this.projectId = projectId;
    this.completed = false;
}

function createTask () {
    const taskText = prompt("What do you need to do?");
    if (taskText !== null) {
        const task = new Task(taskText, getCurrentProject());
        const tasks = getTasksFromStorage();
        tasks.push(task);
        saveTasksToStorage(tasks);
        displayTask(task);
    }
}

function displayTask(task) {
    const taskItem = document.createElement("li");
    const checkbox = document.createElement("input");
    const label = document.createElement("label")
    const edit = document.createElement("img");
    const trash = document.createElement("img");
    taskItem.setAttribute("task-id", task.id);
    checkbox.type = "checkbox";
    label.htmlFor = checkbox.getAttribute("task-id")
    label.textContent = task.text;
    edit.setAttribute("src", editIcon);
    edit.classList.add("edit-task");
    trash.setAttribute("src", trashIcon);
    trash.classList.add("delete-task");
    taskItem.appendChild(checkbox);
    taskItem.appendChild(label);
    taskItem.appendChild(edit);
    taskItem.appendChild(trash);
    if (task.completed === false) {
        taskList.appendChild(taskItem)
    }
    if (task.completed === true) {
        checkbox.setAttribute("checked", "checked")
        completedTaskList.prepend(taskItem)
    }
}

export function saveTasksToStorage (taskArr) {
    localStorage.setItem("tasks", JSON.stringify(taskArr));
}

function getTasksFromStorage () {
    const storage = localStorage.getItem("tasks");
    if (storage !== null) {
        const tasksList = JSON.parse(storage);
        return tasksList;
    }
    return [];
}

export function getProjectTasks () {
    return getTasksFromStorage().filter(task => task.projectId === getCurrentProject())
}

export function listTasks () {
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";
    const taskArr = getProjectTasks();
    for (let task of taskArr) {
        displayTask(task);
    }
}

function updateTask(id) {
    const taskArr = getTasksFromStorage();
    const task = taskArr.find(task => task.id === id);

    if (task) {
        if (task.completed === true) {
            task.completed = false; 
        }
        else if (task.completed === false) {
            task.completed = true;
        }
    }

    console.log(task);
    saveTasksToStorage(taskArr);
    listTasks();
}

export function editTask(id) {
    const taskArr = getTasksFromStorage();
    const task = taskArr.find(task => task.id === id);
    const taskEdit = prompt("what do you need to do?", task.text);
    if (taskEdit !== null && taskEdit.trim() !== "") {
        task.text = taskEdit;
        saveTasksToStorage(taskArr);
        listTasks();
    }
}

export function deleteTask(id, bulk = false) {
    if (!bulk && !confirm("Are you sure you want to delete this task?")) {
        return;
    }

    const taskArr = getTasksFromStorage();
    const newTasks = taskArr.filter(task => task.id !== id);

    if (newTasks.length !== taskArr.length) { 
        saveTasksToStorage(newTasks);
        listTasks();
    } else {
        console.warn(`Task with ID ${id} not found.`);
    }
}

taskArea.addEventListener("click", (event) => {
    const target = event.target;

    if (target.tagName === "INPUT" && target.type === "checkbox") {
        const taskItem = target.closest("li");
        if (taskItem) {
            updateTask(taskItem.getAttribute("task-id"));
        }
    }
});

taskBtn.addEventListener("click", () => {
    createTask();
})

document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("edit-task")) {
        editTask(target.closest("li").getAttribute("task-id"));
    }
    if (target.classList.contains("delete-task")) {
        deleteTask(target.closest("li").getAttribute("task-id"))
    }
});

    

