import "./style.css";
import "./projects.js";
import "./tasks.js";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";


import { projectName, addProjectButton, displayProject, projects, getProjectFromStorage, listProjects, saveProjectsToStorage, getProjects, createProject, getCurrentProject } from "./projects.js";
import { listTasks, getProjectTasks, deleteTask } from "./tasks.js";

const projectInfo = document.getElementById("project-info");

projects.addEventListener("click", (event) => {
    const target = event.target;
    if (target.hasAttribute("project-id")) {
        const id = target.getAttribute("project-id")
        localStorage.setItem("currentProject", id)
        displayProject(getProjectFromStorage(id));
        listTasks();   
    }
})

document.addEventListener("DOMContentLoaded", function() {
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
    listTasks();
});

function editProject(id) {
    const projArr = getProjects();
    const project = projArr.find(task => task.id === id);
    const projEdit = prompt("Project name", project.name);
    if (projEdit !== null && projEdit.trim() !== "") {
        project.name = projEdit;
        saveProjectsToStorage(projArr);
        displayProject(project);
        listProjects(projArr);
    }
}

function deleteProject (id) {
    if (confirm("Are you sure you want to delete this project? You will lose all tasks associated with it.")){
        const projArr = getProjects();
        const deleteIndex = projArr.findIndex(project => project.id === id);
        projArr.splice(deleteIndex, 1);
        localStorage.setItem("currentProject", projArr[0].id);
        saveProjectsToStorage(projArr);
        displayProject(projArr[0]);
        listTasks();
        listProjects(projArr);
        const deletableTasks = getProjectTasks();
        for (let task of deletableTasks) {
            deleteTask(task.id, true);
        }
    }
}


addProjectButton.addEventListener('click', () => {
    createProject();
})

projectInfo.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("edit-project")) {
        editProject(getCurrentProject());
    }
    if (target.classList.contains("delete-project")) {
        deleteProject(getCurrentProject());
    }
});


listProjects(getProjects());

// TODO: 1. Add checkboxes to tasks 2. Add completion capability for projects and tasks 3. let people delete and edit stuff 4. mobile responsive 5. Intro UX to guide people to create projects and tasks
