import "./style.css";
import {projectName, current, addProjectButton, projects, Project, createProject, getProjects, listProjects, getProjectFromStorage} from "./projects.js";
import { taskList, taskBtn, Task, createTask, listTasks} from "./tasks.js";


// Run the initialization function on page load


projects.addEventListener("click", (event) => {
    const target = event.target;
    if (target.hasAttribute("project-id")) {
        const id = target.getAttribute("project-id")
        localStorage.setItem("currentProject", id)
        const project = getProjectFromStorage(id);
        if (project) {
            projectName.textContent = project.name;
        }
        listTasks();   
    }
})
