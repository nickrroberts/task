const addProjectButton = document.getElementById("new-proj");
const projectName = document.getElementById("project-name");
const projects = document.getElementById("projects");
const projectInfo = document.getElementById("project-info");



function Project (name) {
    this.id = crypto.randomUUID();
    this.description = "";
    this.name = name;
}

function createProject () {
    const name = prompt("Project name");
    if (name !== null && name.trim() !== "") {
        const project = new Project(name);

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

    }  
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
    const projEdit = prompt("Project name", project.name);
    if (projEdit !== null && projEdit.trim() !== "") {
        project.name = projEdit;
        saveProjectsToStorage(projArr);
        displayProject(project);
        listProjects(projArr);
    }
}

function deleteProject(id) {
    if (confirm("Are you sure you want to delete this project? You will lose all tasks associated with it.")) {
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

        // Update project list in the UI
        listProjects(projArr);
    }
}




export {projectName, addProjectButton, projects, projectInfo, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject, displayProject, editProject, deleteProject};