import "./style.css";
import navOpen from "./assets/menu.svg";
import navClosed from "./assets/expand.svg";
import mobileOpen from "./assets/mobile-open.svg";
import mobileClosed from "./assets/mobile-close.svg";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";
import {projectName, addProjectButton, projects, projectInfo, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject, displayProject, editProject, deleteProject} from "./projects.js";
import {taskArea, taskBtn, getProjectTasks, listTasks, createTask, editTask, updateTask, deleteTask} from "./tasks.js";

const nav = document.querySelector("nav");
const navToggle = document.getElementById("nav-toggle");

//on DOM load

document.addEventListener("DOMContentLoaded", function () {
    const projectsArr = getProjects();
    const main = document.querySelector("main");
    const container = document.getElementById("container");
    const projectList = document.getElementById("projects");
    
    if (!getCurrentProject() && projectsArr.length > 0) {
        const defaultProject = projectsArr[0];
        localStorage.setItem("currentProject", projectsArr[0].id);
        projectName.textContent = projectsArr[0].name;
    }
    if (projectsArr.length === 0) {
        clearState();
    } else if (getCurrentProject()) {
        const savedProject = getProjectFromStorage(getCurrentProject());
        if (savedProject) {
            projectName.textContent = savedProject.name;
        }
    }
    document.getElementById("nav-toggle").src = navOpen;
    document.querySelector(".edit-project").src = editIcon;
    document.querySelector(".delete-project").src = trashIcon;
    listProjects(getProjects());
    listTasks();

    function updateNavToggleIcon() {
        if (isMobile()) {
            navToggle.src = mobileOpen;
        } else {
            navToggle.src = navOpen;
        }
    }

    window.addEventListener("resize", updateNavToggleIcon);
    updateNavToggleIcon();

    navToggle.addEventListener("click", () => {
        if (isMobile()) {
            nav.classList.toggle("nav-expanded");

            if (nav.classList.contains("nav-expanded")) {
                navToggle.src = mobileClosed;
            } else {
                navToggle.src = mobileOpen;
            }
        } else {
            nav.classList.toggle("nav-shrink");

            if (nav.classList.contains("nav-shrink")) {
                navToggle.src = navClosed;
                main.style.gridTemplate = "1fr / 3rem 1fr"; 
                nav.style.width = "2rem";
                nav.style.padding = "1rem";
            } else {
                navToggle.src = navOpen;
                main.style.gridTemplate = ""; 
                container.style.padding = ""; 
                nav.style.width = ""; 
                nav.style.padding = ""; 
            }
        }
    });

    // Close mobile navbar when a project is tapped
    projectList.addEventListener("click", () => {
        shutNavOnMobile();
    });
}); 

// listeners

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
    projectName.textContent = "";
    localStorage.setItem("currentProject", "none");
    shutNavOnMobile();
    listTasks();
    createProject();
    
});

projectInfo.addEventListener("click", (event) => {
    const target = event.target;
    const deletableTasks = getProjectTasks();

    if (target.classList.contains("edit-project")) {
        editProject(getCurrentProject());
    }
    if (target.classList.contains("delete-project")) {
        const deletionConfirmed = deleteProject(getCurrentProject());
        
        if (deletionConfirmed) {
            if (getCurrentProject() !== "none") {
                listTasks();
            } else if (getCurrentProject() === "none") {
                clearState();
                console.log("No current project");
            }
    
            for (let task of deletableTasks) {
                deleteTask(task.id, true);
            }
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
});


document.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("edit-task")) {
        editTask(target.closest("li").getAttribute("task-id"));
    }
    if (target.classList.contains("delete-task")) {
        deleteTask(target.closest("li").getAttribute("task-id"))
    }
});

// helpers

function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
}

function shutNavOnMobile () {
    if (isMobile() && nav.classList.contains("nav-expanded")) {
        nav.classList.remove("nav-expanded");
        navToggle.src = mobileOpen;
    }
}

function clearState () {
    const container = document.getElementById("container");
    const emptyStateDiv = document.createElement("div");
    const emptyMessage1 = document.createElement("h3");
    const emptyMessageSpan = document.createElement("span");
    const emptyMessage2 = document.createElement("p")
    const emptyStateCreateProjectBtn = document.createElement("button");
    const nav = document.querySelector("nav");

    document.querySelectorAll(".empty-state-div").forEach(el => el.remove());

    emptyStateDiv.classList.add("empty-state-div");

    emptyMessage1.classList.add("empty-state");
    emptyMessage1.textContent = "Welcome to ";
    
    emptyMessageSpan.textContent = "Task";
    
    emptyMessage2.textContent = "We don't have any projects! Let's make one.";

    emptyStateCreateProjectBtn.classList.add("new-btn", "animated-gradient-btn");
    emptyStateCreateProjectBtn.setAttribute("id", "empty-proj-btn");
    emptyStateCreateProjectBtn.textContent = "Create project";

    projectName.style.display = "none";
    taskArea.style.display = "none";
    taskBtn.style.display = "none";
    nav.style.display = "none";

    container.appendChild(emptyStateDiv)
    emptyStateDiv.appendChild(emptyMessage1);
    emptyMessage1.appendChild(emptyMessageSpan);
    emptyStateDiv.appendChild(emptyMessage2);
    emptyStateDiv.appendChild(emptyStateCreateProjectBtn);

    emptyStateCreateProjectBtn.addEventListener("click", () => {
        emptyStateDiv.remove();

        createProject();

        nav.style.display = "flex";
        projectName.style.display = "block";
        taskArea.style.display = "block";
        taskBtn.style.display = "block";

        createInitialProject();
        });
    }

function createInitialProject () {
    const newProject = getProjectFromStorage(getCurrentProject());
    if (newProject) {
        console.log
        projectName.style.display = "block";
        taskArea.style.display = "block";
        taskBtn.style.display = "block"; 
        displayProject(newProject);
        listTasks();
    }
}