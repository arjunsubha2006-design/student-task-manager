
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") {
      return !task.completed;
    }

    if (currentFilter === "completed") {
      return task.completed;
    }

    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "toggle-btn";
    toggleBtn.textContent = task.completed ? "✓" : "";

    if (task.completed) {
      toggleBtn.classList.add("done");
    }

    toggleBtn.title = task.completed
      ? "Mark as pending"
      : "Mark as completed";

    toggleBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    span.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.appendChild(toggleBtn);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;

  taskCount.textContent =
    `Total: ${total} | Pending: ${pending} | Completed: ${completed}`;
}

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.filter === filter
    );
  });
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    addTask();
  }
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    filterTasks(button.dataset.filter);
  });
});

filterTasks("all");
