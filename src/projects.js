const addProjectButton = document.getElementById("new-proj");
// const deleteProjectButton
const projectName = document.getElementById("project-name");
const projects = document.getElementById("projects");

function Project (name) {
    this.id = crypto.randomUUID();
    this.description = "";
    this.name = name;
}

function createProject () {
    const name = prompt("Project name");
    const project = new Project(name);
    const projectItem = document.createElement("li");
    projectItem.textContent = project.name;
    projectItem.setAttribute("project-id", project.id);
    projects.appendChild(projectItem);
    const projArr = getProjects();
    projArr.push(project);
    localStorage.setItem("projects", JSON.stringify(projArr));
    
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

function getCurrentProject() {
    return localStorage.getItem("currentProject");
}

// function deleteProject () {

// }

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


listProjects(getProjects());


export {projectName, addProjectButton, projects, Project, createProject, getProjects, listProjects, getProjectFromStorage, getCurrentProject};