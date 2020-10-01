import _, { property } from 'lodash';
import { compareAsc, format } from 'date-fns'

const container = document.querySelector("#container");
const sidebar = document.querySelector("#sidebar");


const navbar = document.createElement("div");
navbar.setAttribute("id","bar");

const project_heading = document.createElement("div");
project_heading.setAttribute("class","projectHead");

const pinBoard = document.createElement("div");
pinBoard.setAttribute("id","pinBoard");

const project_button = document.createElement('button');
project_button.setAttribute("class","side_button");
project_button.textContent = "+ New Project";

const todo_button = document.createElement("button");
todo_button.setAttribute("class","side_button");
todo_button.textContent = "+ Add Task";

let projects = [];
let current_project;

class Project {
    constructor(name, todos)
    {
        this.name = name;
        this.todos = todos
    }

    add_todo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todo) {
        let index = this.todos.indexOf(todo)
        if(index > -1)
        {
            this.todos.splice(index, 1);
        }
    }
    createDom() {
        project_nav_dom(this);
    }

    render() {
        pinRun(this.todos);
    }
}


class Working {
    constructor(name, todos)
    {
        this.name = name;
        this.todos = todos
    }

    add_todo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todo) {
        let index = this.todos.indexOf(todo)
        if(index > -1)
        {
            this.todos.splice(index, 1);
        }
    }

    createDom() {
        working_side_dom(this);
    }

    render() {
        pinRun(this.todos);
    }
}


class Todo {
    constructor(name, date, explanation, details, parent)
    {
        this.name = name;
        this.date = date;
        this.explanation = explanation;
        this.details = details;
        this.parent = parent;
    }

    render() {
        todo_pin_dom(this);
    }

    removeParent() {
        console.log(this.parent);
        this.parent.removeTodo(this);
    }

    renderDetails() {
        todo_detail_dom(this);
    }
}


//Creates Dom for class Project also listenes for project click !!divide them
function project_nav_dom(project) {
    let div = document.createElement('button');
    div.setAttribute("class","projects");
    let lab = document.createElement("label");
    lab.textContent = project.name;
    div.appendChild(lab);
    navbar.appendChild(div);
    div.addEventListener("click",e => {
        console.log(project);
        console.log(current_project);
        current_project = project;
        project.render();
    });
    return;
}
/*
function project_ask() {
    let name = prompt("Enter a project name: ");
    return name;
}
*/

function clearPage() {
    pinBoard.innerHTML = "";
    project_heading.innerHTML = "";
}

function project_ask() {
    let div = document.createElement("div");
    div.setAttribute("class","askForm");
    let name = document.createElement("input");
    let button = document.createElement("button");
    button.setAttribute("type","button");
    button.setAttribute("class","formButton");
    button.textContent = "Add Project";
    name.setAttribute("type","text");
    name.setAttribute("placeHolder","Name");
    name.setAttribute("class","strForm");
    let formHead = document.createElement("h2");
    formHead.textContent = "New Project";
    div.appendChild(formHead);
    div.appendChild(name);
    div.appendChild(button);
    clearPage();
    pinBoard.appendChild(div);
    button.addEventListener("click",() => {
        return project_run(name.value);
    });
}

function project_run(name) {
    if(name === "") return;
    let proje = new Project(name, []);
    proje.createDom();
    current_project = proje;
    current_project.render();
    projects.push(proje);
    return;
}


function todo_ask() {
    let div = document.createElement("div");
    div.setAttribute("class","askForm");
    let name = document.createElement("input");
    name.setAttribute("type","text");
    name.setAttribute("placeHolder","Name");
    name.setAttribute("class","strForm");
    let details = document.createElement("input");
    details.setAttribute("type","text");
    details.setAttribute("placeHolder","All Details...");
    details.setAttribute("id","details");
    let formHead = document.createElement("h2");
    formHead.textContent = "New Task";
    let date = document.createElement("input");
    date.setAttribute("type","date");
    let explanation = document.createElement("input");
    explanation.setAttribute("type","text");
    explanation.setAttribute("placeHolder","Explanation");
    explanation.setAttribute("class","strForm");
    let button = document.createElement("button");
    button.setAttribute("class","formButton");
    button.textContent = "Add Task";
    div.appendChild(formHead);
    div.appendChild(name);
    div.appendChild(explanation);
    div.appendChild(date);
    div.appendChild(details);
    div.appendChild(button);
    clearPage();
    let h2 = document.createElement("h1");
    h2.setAttribute("class","projectHead");
    h2.textContent = current_project.name;
    project_heading.appendChild(h2);
    pinBoard.appendChild(div);
    button.addEventListener("click", () => {
        return todo_run([name.value, date.value, explanation.value, details.value]);
    });
}

//Adds todo to current project and rerenders the project
function todo_run(arr) {
    let todo = new Todo(arr[0],arr[1],arr[2], arr[3],current_project);
    current_project.add_todo(todo);
    clearPage();
    current_project.render();
    return;
}

function todo_pin_dom(todo) {
    let div = document.createElement('div');
    div.setAttribute("class","todos");
    let h4 = document.createElement("h4");
    h4.textContent = todo.name;
    let date = document.createElement("p");
    date.textContent = todo.date;
    let explanation = document.createElement("p");
    explanation.textContent = todo.explanation;
    let detail_button = document.createElement("button");
    detail_button.textContent = "Details";
    let delete_button = document.createElement("button");
    delete_button.textContent = "X";
    let work_button = document.createElement("button");
    work_button.textContent = "Work";
    div.appendChild(h4);
    div.appendChild(date);
    div.appendChild(explanation);
    div.appendChild(detail_button);
    div.appendChild(work_button);
    div.appendChild(delete_button);
    pinBoard.appendChild(div);
    work_button.addEventListener("click", () => working.add_todo(todo));
    //todo.delete_button = delete_button;
    delete_button.addEventListener("click", () => todo_remove(div,todo));
    detail_button.addEventListener("click", () => todo.renderDetails() );

}

function todo_remove(div,todo)
{
    current_project.removeTodo(todo);
    todo.removeParent();
    pinBoard.removeChild(div);
}

function todo_detail_dom(todo)
{
    let div = document.createElement("div");
    div.setAttribute("id","todoDetail");
    let name = document.createElement("div");
    name.setAttribute("class","projectaltHead");
    name.textContent = todo.name;
    let date = document.createElement("div");
    date.setAttribute("class","lines");
    date.textContent = "Date: "+todo.date;
    let explanation = document.createElement("div");
    explanation.setAttribute("class","lines");
    explanation.textContent = "Explanation: "+todo.explanation;
    let details = document.createElement("div");
    details.textContent = "Details: "+todo.details;
    details.setAttribute("class","lines");
    let back = document.createElement("button");
    back.setAttribute("class","formButton");
    back.textContent = "Back";
    div.appendChild(back);
    div.appendChild(name);
    div.appendChild(date);
    div.appendChild(explanation);
    div.appendChild(details);
    let h2 = document.createElement("h1");
    h2.setAttribute("class","projectHead");
    h2.textContent = current_project.name;
    clearPage();
    project_heading.appendChild(h2);
    pinBoard.appendChild(div);
    back.addEventListener("click", () => current_project.render());
}

function working_side_dom(element) {
    let div = document.createElement('button');
    div.setAttribute("class","side_button");
    let lab = document.createElement("label");
    lab.textContent = element.name;
    div.appendChild(lab);
    sidebar.appendChild(div);
    div.addEventListener("click",e => {
        console.log(element);
        current_project = element;
        pinBoard.innerHTML = "";
        element.render();
    });
    return;
}


function pinRun(todos) {
    let h2 = document.createElement("h1");
    h2.setAttribute("class","projectHead");
    h2.textContent = current_project.name;
    clearPage();
    project_heading.appendChild(h2);
    todos.forEach(todo => todo.render());
    return;
}


//default project daily
let daily = new Project("Daily", []);
project_nav_dom(daily);
current_project = daily;
let laundry = new Todo("Laundry","2020-10-01","clean clothes","take all clothes put into machine",current_project);
let cook = new Todo("Dinner","2020-10-01","Cook chicken","slice onions marinarate chicken",current_project);
current_project.add_todo(laundry);
current_project.add_todo(cook);
daily.render();
projects.push(daily);

const working = new Working("Currently Working",[]);
working.createDom();

project_button.addEventListener("click", project_ask);
todo_button.addEventListener("click", todo_ask);


sidebar.appendChild(project_button);
sidebar.appendChild(todo_button);

container.appendChild(navbar);
container.appendChild(project_heading);
container.appendChild(pinBoard);