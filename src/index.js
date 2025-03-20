import "./style.css";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";
import {projectName, addProjectButton, projects, projectInfo, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject, displayProject, editProject, deleteProject} from "./projects.js";
import {taskArea, taskBtn, getProjectTasks, listTasks, createTask, editTask, updateTask, deleteTask} from "./tasks.js";

//Listeners

document.addEventListener("DOMContentLoaded", function () {
    const projectsArr = getProjects();
    const main = document.querySelector("main");
    const nav = document.querySelector("nav");
    const navToggle = document.getElementById("nav-toggle");
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

    document.querySelector(".edit-project").src = editIcon;
    document.querySelector(".delete-project").src = trashIcon;
    listProjects(getProjects());
    listTasks();

    // Check if viewport is mobile
    function isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    // Function to update the nav toggle icon based on screen size
    function updateNavToggleIcon() {
        if (isMobile()) {
            navToggle.src = "./assets/mobile-open.svg";
        } else {
            navToggle.src = "./assets/menu.svg";
        }
    }

    // Run the check on window resize
    window.addEventListener("resize", updateNavToggleIcon);

    // Ensure the correct initial icon is displayed on page load
    updateNavToggleIcon();

    navToggle.addEventListener("click", () => {
        if (isMobile()) {
            nav.classList.toggle("nav-expanded");

            if (nav.classList.contains("nav-expanded")) {
                navToggle.src = "./assets/mobile-close.svg";
            } else {
                navToggle.src = "./assets/mobile-open.svg";
            }
        } else {
            nav.classList.toggle("nav-shrink");

            if (nav.classList.contains("nav-shrink")) {
                navToggle.src = "./assets/expand.svg";
                main.style.gridTemplate = "1fr / 3rem 1fr"; 
                nav.style.width = "2rem";
                nav.style.padding = "1rem";
            } else {
                navToggle.src = "./assets/menu.svg";
                main.style.gridTemplate = ""; 
                container.style.padding = ""; 
                nav.style.width = ""; 
                nav.style.padding = ""; 
            }
        }
    });

    // Close mobile navbar when a project is tapped
    projectList.addEventListener("click", () => {
        if (isMobile() && nav.classList.contains("nav-expanded")) {
            nav.classList.remove("nav-expanded");
            navToggle.src = "./assets/mobile-open.svg";
        }
    });
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
});

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
            clearState();
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

function clearState () {
    const container = document.getElementById("container");
    const emptyStateDiv = document.createElement("div");
    const emptyMessage = document.createElement("h3");
    const emptyStateCreateProjectBtn = document.createElement("button");
    const nav = document.querySelector("nav");

    document.querySelectorAll(".empty-state-div").forEach(el => el.remove());

    emptyStateDiv.classList.add("empty-state-div");

    emptyMessage.classList.add("empty-state");
    emptyMessage.textContent = "Welcome to Task. We don't have any projects! Let's make one.";

    emptyStateCreateProjectBtn.classList.add("new-btn", "animated-gradient-btn");
    emptyStateCreateProjectBtn.setAttribute("id", "empty-proj-btn");
    emptyStateCreateProjectBtn.textContent = "Create project";

    projectName.style.display = "none";
    taskArea.style.display = "none";
    taskBtn.style.display = "none";
    nav.style.display = "none";

    container.appendChild(emptyStateDiv)
    emptyStateDiv.appendChild(emptyMessage);
    emptyStateDiv.appendChild(emptyStateCreateProjectBtn);

    emptyStateCreateProjectBtn.addEventListener("click", () => {
        const previousProject = getCurrentProject();
        createProject();
        
        // Check if a new project was actually created
        const newProject = getProjectFromStorage(getCurrentProject());
        
        if (!newProject || getCurrentProject() === previousProject) {
            // If no new project was created, reapply the empty state
            return clearState();
        }

        // Otherwise, restore the UI
        nav.style.display = "flex";
        createInitialProject();
        emptyMessage.remove();
        emptyStateCreateProjectBtn.remove();
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