import { getCurrentProject, getProjects } from "./projects";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";
import createIcon from "./assets/create.svg";

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
    const newTask = document.createElement("li");
    const newTaskInput = document.createElement("input");
    const enterBtn = document.createElement("img");

    enterBtn.src = createIcon;
    enterBtn.setAttribute("id", "enter-btn");

    newTask.appendChild(newTaskInput);
    newTask.appendChild(enterBtn);
    taskList.appendChild(newTask);

    newTaskInput.setAttribute("type", "text")
    newTaskInput.focus();

    let taskRemoved = false;

    enterBtn.addEventListener("click", addTask);


    newTaskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); 
            addTask();
        }
    });

    newTaskInput.addEventListener("blur", () => {
        if (newTaskInput.value.trim() === "" && !taskRemoved && newTask.parentNode) {
            taskRemoved = true;
            newTask.remove();
        }
    });


    function addTask() {
        const taskText = newTaskInput.value;
        if (taskText !== "") {
            const task = new Task(taskText, getCurrentProject());
            const tasks = getTasksFromStorage();
            const emptyMessage = document.querySelector(".empty-tasks");
            const completed = document.querySelector(".completed");

            tasks.push(task);
            saveTasksToStorage(tasks);
            newTask.remove();
            displayTask(task);

            if (emptyMessage) {
                emptyMessage.remove();
            }

            if (completed) {
                completed.remove();
            }
        } else { 
            if (!taskRemoved && newTask.parentNode) {
                taskRemoved = true;
                newTask.remove();
            } 
        }
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
        taskList.appendChild(taskItem);
    }
    if (task.completed === true) {
        taskItem.classList.add("completed-task");
        checkbox.setAttribute("checked", "checked");
        completedTaskList.prepend(taskItem);
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

    if (taskArr.length === 0 && getProjects().length > 0) {
        if (completedListHeader) completedListHeader.style.display = "none";
        
        const emptyMessage = document.createElement("p");
        emptyMessage.classList.add("empty-tasks");
        emptyMessage.textContent = "Looks like we don't have any tasks here yet. Add one by clicking below.";
        taskList.appendChild(emptyMessage);
        return;
    }

    taskArr.forEach(displayTask);

    if (taskArr.every(task => task.completed) && getProjects().length > 0) {
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
    if (!task) return;  

    const taskItem = document.querySelector(`li[task-id="${id}"]`);
    if (!taskItem) return;

    const label = taskItem.querySelector("label");
    if (!label) return;

    label.style.display = "none";
    const editBtn = taskItem.querySelector(".edit-task");
    const deleteBtn = taskItem.querySelector(".delete-task");
    if (editBtn) editBtn.style.display = "none";
    if (deleteBtn) deleteBtn.style.display = "none";

    const enterBtn = document.createElement("img");
    enterBtn.src = createIcon;
    enterBtn.setAttribute("id", "enter-btn");

    const editInput = document.createElement("input");
   
    editInput.type = "text";
    editInput.value = task.text;
    editInput.classList.add("edit-input");


    taskItem.insertBefore(editInput, label);

    editInput.focus();

    function finishEditing() {
        const newText = editInput.value.trim();
        if (newText !== "") {
            task.text = newText;
            saveTasksToStorage(taskArr);
        } else {
            editInput.remove();
        }
        label.style.display = "block";
        if (editBtn) editBtn.style.display = "inline-block";
        if (deleteBtn) deleteBtn.style.display = "inline-block";
        listTasks();
    }

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEditing();
        }
    });

    editInput.addEventListener("blur", () => {
        finishEditing();
    });
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
    

