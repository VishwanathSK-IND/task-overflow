const namePage = document.getElementById("namePage");
const plannerPage = document.getElementById("plannerPage");

const nameInput = document.getElementById("nameInput");
const startBtn = document.getElementById("startBtn");
const nameMsg = document.getElementById("nameMsg");

const guideBtn = document.getElementById("guideBtn");
const guideSection = document.getElementById("guideSection");

const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const taskMsg = document.getElementById("taskMsg");

const totalEl = document.getElementById("total");
const completedEl = document.getElementById("completed");
const pendingEl = document.getElementById("pending");

let tasks = [];

guideBtn.addEventListener("click", function () {
    guideSection.classList.toggle("hidden");
});

startBtn.addEventListener("click", function () {
    const userName = nameInput.value.trim();

    if (userName === "") {
        nameMsg.innerText = "Please enter your name.";
        return;
    }

    nameMsg.innerText = "";
    welcomeText.innerText = "Hi " + userName;

    namePage.classList.add("hidden");
    plannerPage.classList.remove("hidden");

    tasks = [];
    renderTasks();
    updateSummary();
});

logoutBtn.addEventListener("click", function () {
    tasks = [];
    localStorage.removeItem("taskflowTasks");

    taskList.innerHTML = "";
    taskInput.value = "";
    priorityInput.value = "";
    nameInput.value = "";

    plannerPage.classList.add("hidden");
    namePage.classList.remove("hidden");
});

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();
    const taskPriority = priorityInput.value;

    if (taskText === "" || taskPriority === "") {
        taskMsg.innerText = "Enter task and select priority.";
        return;
    }

    taskMsg.innerText = "";

    const newTask = {
        id: Date.now(),
        text: taskText,
        priority: taskPriority,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateSummary();

    taskInput.value = "";
    priorityInput.value = "";
});

function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function (task) {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task";

        if (task.completed) {
            taskDiv.classList.add("completed");
        }

        const taskText = document.createElement("span");
        taskText.innerText = task.text;

        const priorityTag = document.createElement("span");
        priorityTag.className = "priority " + task.priority;
        priorityTag.innerText = task.priority;

        const doneBtn = document.createElement("button");
        doneBtn.innerText = "Done";
        doneBtn.addEventListener("click", function () {
            toggleTask(task.id);
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id);
        });

        taskDiv.append(taskText, priorityTag, doneBtn, deleteBtn);
        taskList.appendChild(taskDiv);
    });
}

function toggleTask(id) {
    tasks.forEach(function (task) {
        if (task.id === id) {
            task.completed = !task.completed;
        }
    });

    saveTasks();
    renderTasks();
    updateSummary();
}

function deleteTask(id) {
    tasks = tasks.filter(function (task) {
        return task.id !== id;
    });

    saveTasks();
    renderTasks();
    updateSummary();
}

function updateSummary() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    totalEl.innerText = total;
    completedEl.innerText = completed;
    pendingEl.innerText = pending;
}

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}
