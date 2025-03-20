import createIcon from "./assets/create.svg";

const addProjectButton = document.getElementById("new-proj");
const projectName = document.getElementById("project-name");
const projects = document.getElementById("projects");
const projectInfo = document.getElementById("project-info");

function Project (name) {
    this.id = crypto.randomUUID();
    this.description = "";
    this.name = name;
}

function createProject() {

    const projectInput = document.createElement("input");
    projectInput.type = "text";
    projectInput.placeholder = "Enter project title";
    projectInput.classList.add("project-input");
    projectInput.setAttribute("type", "text");

    const enterBtn = document.createElement("img");
    enterBtn.src = createIcon;
    enterBtn.setAttribute("id", "enter-btn");

    const container = projectName.parentNode;
    container.insertBefore(projectInput, projectName);
    container.insertBefore(enterBtn, projectName);

    const editIconEl = document.querySelector(".edit-project");
    const deleteIconEl = document.querySelector(".delete-project");
    if (editIconEl) {
        editIconEl.style.display = "none";
    }
    if (deleteIconEl) {
        deleteIconEl.style.display = "none";
    }

    projectInput.focus();

    let finished = false; 

    function finishCreatingProject() {
        if (finished) return;
        finished = true;

        let projectTitle = projectInput.value.trim();
        if (projectTitle === "") {
            projectTitle = "My project";
        }
        
        const project = new Project(projectTitle);
        
        const projectItem = document.createElement("li");
        projectItem.textContent = project.name;
        projectItem.setAttribute("project-id", project.id);
        projects.appendChild(projectItem);

        const projArr = getProjects();
        projArr.push(project);
        saveProjectsToStorage(projArr);
        listProjects(projArr);
        localStorage.setItem("currentProject", project.id);
        displayProject(project);

        projectInput.remove();
        enterBtn.remove();

        if (editIconEl) {
            editIconEl.style.display = "";
        }
        if (deleteIconEl) {
            deleteIconEl.style.display = "";
        }
    }

    enterBtn.addEventListener("click", finishCreatingProject);

    projectInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            finishCreatingProject();
        }
    });

    projectInput.addEventListener("blur", finishCreatingProject);
}

function getProjects() {
    const storage = localStorage.getItem("projects");
    if (storage !== null) {
        const projectsList = JSON.parse(storage);
        return projectsList;
    }
    return [];
}

function listProjects (arr) {
    projects.innerHTML = "";
    arr.map(item => {
        const displayItem = document.createElement("li");
        displayItem.setAttribute("project-id", item.id);
        displayItem.textContent = item.name;
        projects.appendChild(displayItem);
    })
}

function getProjectFromStorage (projectId) {   
    return getProjects().find(item => item.id === projectId);
}

function saveProjectsToStorage (projArr) {
    localStorage.setItem("projects", JSON.stringify(projArr));
}

function getCurrentProject() {
    return localStorage.getItem("currentProject");
}

function displayProject (project) {
    if (project) {
        projectName.textContent = project.name;
    }
}

function editProject(id) {
    const projArr = getProjects();
    const project = projArr.find(project => project.id === id);
    if (!project) return;

    const projectNameElement = document.getElementById("project-name");
    
    // Create an input field with the current project title
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = project.name;
    editInput.classList.add("project-edit-input");

    // Hide the h1 and insert the input field
    projectNameElement.style.display = "none";
    projectNameElement.parentNode.insertBefore(editInput, projectNameElement);
    editInput.focus();

    let finished = false;

    function finishEditing() {
        if (finished) return;
        finished = true;

        let newTitle = editInput.value.trim();
        if (newTitle === "") {
            newTitle = "My project";
        }
        project.name = newTitle;
        saveProjectsToStorage(projArr);
        displayProject(project);
        listProjects(projArr);
        editInput.remove();
        projectNameElement.style.display = "block";
    }

    // Finish editing on Enter key
    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            finishEditing();
        }
    });
    // And on blur as well
    editInput.addEventListener("blur", finishEditing);
}

function deleteProject(id) {
    if (!confirm("Are you sure you want to delete this project? You will lose all tasks associated with it.")) {
        return false;
    }
    
    const projArr = getProjects();
    const deleteIndex = projArr.findIndex(project => project.id === id);
    
    if (deleteIndex !== -1) {
        projArr.splice(deleteIndex, 1);
        saveProjectsToStorage(projArr);
    }

    if (projArr.length > 0) {
        localStorage.setItem("currentProject", projArr[0].id);
        displayProject(projArr[0]);
    } else {
        localStorage.setItem("currentProject", "none");
    }

    listProjects(projArr);

    return true;
}

export {projectName, addProjectButton, projects, projectInfo, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject, displayProject, editProject, deleteProject};