const addProjectButton = document.getElementById("new-proj");
// const deleteProjectButton
const projectInfo = document.getElementById("project-info");
const projectName = document.getElementById("project-name");
const projects = document.getElementById("projects");


function Project (name) {
    this.id = crypto.randomUUID();
    this.description = "";
    this.name = name;
}

function createProject () {
    const name = prompt("Project name");
    if (name !== null) {
        const project = new Project(name);
        const projectItem = document.createElement("li");
        projectItem.textContent = project.name;
        projectItem.setAttribute("project-id", project.id);
        projects.appendChild(projectItem);
        const projArr = getProjects();
        projArr.push(project);
        localStorage.setItem("projects", JSON.stringify(projArr));
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

export function displayProject (project) {
    if (project) {
        projectName.textContent = project.name;
    }
}

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
        listProjects(projArr);
    }
}

const projectsArr = getProjects();
if (!getCurrentProject() && projectsArr.length > 0) {
    const defaultProject = projectsArr[0];
    localStorage.setItem("currentProject", defaultProject.id);
    projectName.textContent = defaultProject.name; // Set default project title
} else if (getCurrentProject()) {
    const savedProject = getProjectFromStorage(getCurrentProject());
    if (savedProject) {
        projectName.textContent = savedProject.name;
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


export {projectName, addProjectButton, projects, Project, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject};