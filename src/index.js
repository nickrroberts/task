
// TODO: 1. organize app better 2. make mobile responsive 3. fade out effect upon task completion 4. Intro UX to guide people to create projects and tasks

import "./style.css";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";
import {projectName, addProjectButton, projects, projectInfo, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject, displayProject, editProject, deleteProject} from "./projects.js";
import {taskArea, taskBtn, getProjectTasks, listTasks, createTask, editTask, updateTask, deleteTask} from "./tasks.js";


//Listeners


document.addEventListener("DOMContentLoaded", function () {
    const projectsArr = getProjects();
    if (!getCurrentProject() && projectsArr.length > 0) {
        const defaultProject = projectsArr[0];
        localStorage.setItem("currentProject", defaultProject.id);
        projectName.textContent = defaultProject.name;
    } else if (getCurrentProject()) {
        const savedProject = getProjectFromStorage(getCurrentProject());
        if (savedProject) {
            projectName.textContent = savedProject.name;
        }
    }
    document.querySelector(".edit-project").src = editIcon;
    document.querySelector(".delete-project").src = trashIcon;
    listProjects(getProjects());
    listTasks();
}); 

projects.addEventListener("click", (event) => {
    const target = event.target;
    if (target.hasAttribute("project-id")) {
        const id = target.getAttribute("project-id")
        localStorage.setItem("currentProject", id)
        displayProject(getProjectFromStorage(id));
        listTasks();   
    }
})

addProjectButton.addEventListener('click', () => {
    createProject();
})

projectInfo.addEventListener("click", (event) => {
    const target = event.target;
    const deletableTasks = getProjectTasks();

    if (target.classList.contains("edit-project")) {
        editProject(getCurrentProject());
    }
    if (target.classList.contains("delete-project")) {
        deleteProject(getCurrentProject());
        if ( getCurrentProject() !== "none") {
            listTasks();
        }

        if ( getCurrentProject() == "none") {
            //Display empty state
            console.log("No current project")
        }
        
        for (let task of deletableTasks) {
            deleteTask(task.id, true);
        }
    }
});

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
