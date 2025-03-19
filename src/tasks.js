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
        const emptyMessage = document.querySelector(".empty-tasks");
        const completed = document.querySelector(".completed");
        tasks.push(task);
        saveTasksToStorage(tasks);
        displayTask(task);

        if (emptyMessage) {
            emptyMessage.remove();
        }

        if (completed) {
            completed.remove();
        }       
    }
}

function displayTask(task) {
    const taskItem = document.createElement("li");
    taskItem.setAttribute("task-id", task.id);
    taskItem.classList.toggle("completed-task", task.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => updateTask(task.id));

    const label = document.createElement("label");
    label.htmlFor = task.id;
    label.textContent = task.text;

    const edit = document.createElement("img");
    edit.setAttribute("src", editIcon);
    edit.classList.add("edit-task");
    edit.addEventListener("click", () => editTask(task.id));

    const trash = document.createElement("img");
    trash.setAttribute("src", trashIcon);
    trash.classList.add("delete-task");
    trash.addEventListener("click", () => deleteTask(task.id));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(label);
    taskItem.appendChild(edit);
    taskItem.appendChild(trash);

    if (task.completed) {
        completedTaskList.prepend(taskItem);
    } else {
        taskList.appendChild(taskItem);
    }
}

function saveTasksToStorage (taskArr) {
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

function getProjectTasks () {
    return getTasksFromStorage().filter(task => task.projectId === getCurrentProject())
}

function listTasks() {
    taskList.innerHTML = "";
    completedTaskList.innerHTML = "";

    const taskArr = getProjectTasks();
    const completedListHeader = document.querySelector(".completed-list-header");

    if (taskArr.length === 0) {
        if (completedListHeader) completedListHeader.style.display = "none";
        
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-tasks");
        emptyMessage.textContent = "Looks like we don't have any tasks here yet.";
        taskList.appendChild(emptyMessage);
        return;
    }

    taskArr.forEach(displayTask);

    if (taskArr.every(task => task.completed)) {
        const completedMessage = document.createElement("p");
        completedMessage.classList.add("completed");
        completedMessage.textContent = "All done! 🎉";
        taskList.appendChild(completedMessage);
    }
    if (taskArr.some(task => task.completed)) {
        if (completedListHeader) completedListHeader.style.display = "block";
    } else {
        if (completedListHeader) completedListHeader.style.display = "none";
    }
}
    

function updateTask(id) {
    const taskArr = getTasksFromStorage();
    const task = taskArr.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed; // Toggle completion
    }

    saveTasksToStorage(taskArr);

    const taskItem = document.querySelector(`li[task-id="${id}"]`);
        if (taskItem) {
            taskItem.classList.toggle("completed-task", task.completed);
        }

    if (task.completed) {
        setTimeout(() => {
            listTasks();
        }, 1000); 
    } else {
        listTasks(); 
    }
}

function editTask(id) {
    const taskArr = getTasksFromStorage();
    const task = taskArr.find(task => task.id === id);
    const taskEdit = prompt("what do you need to do?", task.text);
    if (taskEdit !== null && taskEdit.trim() !== "") {
        task.text = taskEdit;
        saveTasksToStorage(taskArr);
        listTasks();
    }
}

function deleteTask(id, bulk = false) {
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


export { taskArea, taskBtn, getProjectTasks, listTasks, createTask, editTask, updateTask, deleteTask}
    

