import "./style.css";
import "./projects.js";
import "./tasks.js";
import editIcon from "./assets/edit.svg";
import trashIcon from "./assets/trash.svg";


import { displayProject, projects, getProjectFromStorage } from "./projects.js";
import { listTasks } from "./tasks.js";

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
    document.querySelector(".edit-project").src = editIcon;
    document.querySelector(".delete-project").src = trashIcon;
    listTasks();
});


// TODO: 1. Add checkboxes to tasks 2. Add completion capability for projects and tasks 3. let people delete and edit stuff 4. mobile responsive 5. Intro UX to guide people to create projects and tasks
