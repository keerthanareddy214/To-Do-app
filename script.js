// Add Task
function addTask() {

    let taskInput = document.getElementById("taskInput");
    let dueDateInput = document.getElementById("dueDate");
   

    let taskText = taskInput.value.trim();
    let dueDate = dueDateInput.value;
     let priorityInput = document.getElementById("priority").value;

    if (taskText === "") {
        alert("Please enter a task");
        return;
    }

    createTask(taskText, dueDate, priorityInput, false);

    saveTasks();
    updateTaskCount();
    updateProgress();

    taskInput.value = "";
    dueDateInput.value = "";
}

// Create Task
function createTask(taskText, dueDate,priority, completed) {

    let li = document.createElement("li");

    li.innerHTML = `
        <span>
           <strong> ${taskText}</strong><br>
           <small>Priority: ${priority}</small><br>
            <small>Due: ${dueDate || "No Date"}</small>
        </span>

        <button onclick="completeTask(this)">✔</button>
        <button onclick="editTask(this)">✏️</button>
        <button onclick="deleteTask(this)">❌</button>
    `;

    if (priority === "High") {
        li.style.borderLeft = "5px solid red";
    }
    else if (priority === "Medium") {
        li.style.borderLeft = "5px solid orange";
    }
    else {
        li.style.borderLeft = "5px solid green";
    }

    if (dueDate && new Date(dueDate) < new Date()) {
        li.classList.add("overdue");
    }

    if (completed) {
        li.classList.add("completed");
    }

    document.getElementById("taskList").appendChild(li);
}

// Complete Task
function completeTask(button) {

    button.parentElement.classList.toggle("completed");

    saveTasks();
    updateProgress();
}

// Delete Task
function deleteTask(button) {

    button.parentElement.remove();

    saveTasks();
    updateTaskCount();
    updateProgress();
}

// Save Tasks
function saveTasks() {

    let tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {

        let priorityText =
            li.querySelectorAll("small")[0]
            .textContent.replace("Priority: ", "");

        let dueDateText =
            li.querySelectorAll("small")[1]
            .textContent.replace("Due: ", "");

        tasks.push({
            text: li.querySelector("strong").textContent,
            priority: priorityText,
            dueDate: dueDateText,
            completed: li.classList.contains("completed")
        });

        

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load Tasks
function loadTasks() {

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {

        createTask(
            task.text,
            task.dueDate,
            task.priority,
            task.completed
        );

    });

    updateTaskCount();
    updateProgress();
}

// Task Counter
function updateTaskCount() {

    let count =
        document.querySelectorAll("#taskList li").length;

    document.getElementById("taskCount").innerText =
        `Total Tasks: ${count}`;
}

function updateProgress() {

    let totalTasks =
        document.querySelectorAll("#taskList li").length;

    let completedTasks =
        document.querySelectorAll("#taskList li.completed").length;

    let percentage = 0;

    if(totalTasks > 0){
        percentage =
            Math.round((completedTasks / totalTasks) * 100);
    }

    document.getElementById("progressBar").value =
        percentage;

    document.getElementById("progressText").innerText =
        `Progress: ${percentage}%`;
}

function editTask(button) {

    let li = button.parentElement;

    let currentTask =
        li.querySelector("strong").textContent;

    let newTask =
        prompt("Edit Task:", currentTask);

    if (newTask && newTask.trim() !== "") {

        li.querySelector("strong").textContent =
            newTask.trim();

        saveTasks();
    }
}

// Search Tasks
function searchTasks() {

    let input =
        document.getElementById("searchInput")
        .value.toLowerCase();

    let tasks =
        document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        let text =
            task.innerText.toLowerCase();

        if (text.includes(input)) {
            task.style.display = "";
        } else {
            task.style.display = "none";
        }

    });
}

function filterTasks(type) {

    let tasks = document.querySelectorAll("#taskList li");

    tasks.forEach(task => {

        if (type === "all") {
            task.style.display = "";
        }

        else if (type === "completed") {

            if (task.classList.contains("completed")) {
                task.style.display = "";
            } else {
                task.style.display = "none";
            }
        }

        else if (type === "pending") {

            if (!task.classList.contains("completed")) {
                task.style.display = "";
            } else {
                task.style.display = "none";
            }
        }

    });
}

function checkOverdueTasks() {

    let today = new Date();

    document.querySelectorAll("#taskList li").forEach(li => {

        let dueDateText =
            li.querySelectorAll("small")[1]
            .textContent.replace("Due: ", "");

        let completed =
            li.classList.contains("completed");

        if (
            dueDateText !== "No Date" &&
            new Date(dueDateText) < today &&
            !completed
        ) {
            showNotification(
                "Task Overdue!",
                li.querySelector("strong").textContent
            );
        }

    });
}

function showNotification(title, task) {

    if (Notification.permission === "granted") {

        new Notification(title, {
            body: `"${task}" was not completed on time.`
        });

    }
}




// Dark Mode
function toggleDarkMode() {
     console.log("Button clicked");

    document.body.classList.toggle("dark");

    let btn =
        document.getElementById("themeBtn");

    if (document.body.classList.contains("dark")) {
        btn.innerHTML = "🌙 Dark Mode";
    }
    else {
        btn.innerHTML = "☀️ Light Mode";
    }

    localStorage.setItem(
        "darkMode",
        document.body.classList.contains("dark")
    );
}

// Load Everything
window.onload = function () {

    loadTasks();
    checkOverdueTasks();

    let btn =
        document.getElementById("themeBtn");

    if (
        localStorage.getItem("darkMode") === "true"
    ) {
        document.body.classList.add("dark");
         btn.innerHTML = "🌙 Dark Mode";
    }
    else {
        btn.innerHTML = "☀️ Light Mode";
    }
    if ("Notification" in window) {
    Notification.requestPermission();
}

};