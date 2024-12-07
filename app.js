function getUsersData() {
  return JSON.parse(localStorage.getItem("usersData")) || [];
}
function saveUsersData(usersData) {
  localStorage.setItem("usersData", JSON.stringify(usersData));
}
function signup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  if (!name || !email || !password) {
    Swal.fire("All fields are required!");
    return;
}
const usersData = getUsersData();
if (usersData.find((user) => user.email === email)) {
    Swal.fire("Email is already registered!");
    return;
  }
  usersData.push({ name, email, password, tasks: [] });
  saveUsersData(usersData);
//   alert("Signup successful!");
  
Swal.fire({
  title: "Signup successful!",
  showClass: {
    popup: `
      animate__animated
      animate__fadeInUp
      animate__faster
    `
  },
  hideClass: {
    popup: `
      animate__animated
      animate__fadeOutDown
      animate__faster
    `
  }
});
  showLogin();
}
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const user = getUsersData().find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    localStorage.setItem("currentUser", email);
    location.href = "dashboard.html";
  } else {
    Swal.fire("Invalid email or password!");
    // alert("Invalid email or password!");
  }
}
function showSignup() {
  document.getElementById("signup-form").classList.remove("hidden");
  document.getElementById("login-form").classList.add("hidden");
}
function showLogin() {
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
}
function logout() {
  localStorage.removeItem("currentUser");
  location.href = "index.html";
}
function loadDashboard() {
  const currentUserEmail = localStorage.getItem("currentUser");
  if (!currentUserEmail) {
    location.href = "auth.html";
    return;
  }
  const user = getUsersData().find((user) => user.email === currentUserEmail);
  if (!user) {
    alert("User not found!");
    Swal.fire({
        title: "User not found!",
        text: "",
        icon: "warning"
      });
    location.href = "auth.html";
    return;
  }
  document.getElementById("user-name").textContent = user.name;
  renderTasks(user.tasks);
}
function renderTasks(tasks) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    const parentDiv = document.createElement("div");
    parentDiv.className = "btn-div";
    const taskText =  document.createElement("span");
    taskText.className = "span-1";
    taskText.textContent = task;
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "btn small edit edit-btn";
    editButton.onclick = () => editTask(index);
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "btn small delete delete-btn";
    deleteButton.onclick = () => deleteTask(index);
    parentDiv.appendChild(editButton);
    parentDiv.appendChild(deleteButton);
    li.appendChild(taskText);
    li.appendChild(parentDiv);
    todoList.appendChild(li);
  });
}
function addTask() {
  const taskInput = document.getElementById("todoInput");
  const task = taskInput.value.trim();
  if (!task) {
    // alert("Task cannot be empty!");
    Swal.fire("Task cannot be empty!");
    return;
  }
  const currentUserEmail = localStorage.getItem("currentUser");
  const usersData = getUsersData();
  const user = usersData.find((user) => user.email === currentUserEmail);
  user.tasks.push(task);
  saveUsersData(usersData);
  renderTasks(user.tasks);
  taskInput.value = "";
}
function editTask(index) {
  const currentUserEmail = localStorage.getItem("currentUser");
  const usersData = getUsersData();
  const user = usersData.find((user) => user.email === currentUserEmail);
  const newTask = prompt("Edit your task:", user.tasks[index]);
  if (newTask !== null && newTask.trim() !== "") {
    user.tasks[index] = newTask.trim();
    saveUsersData(usersData);
    renderTasks(user.tasks);
  }
}
function deleteTask(index) {
  const currentUserEmail = localStorage.getItem("currentUser");
  const usersData = getUsersData();
  const user = usersData.find((user) => user.email === currentUserEmail);
  user.tasks.splice(index, 1);
  saveUsersData(usersData);
  renderTasks(user.tasks);
}

function clearAllTasks() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear all tasks!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform the task clearing logic
        const currentUserEmail = localStorage.getItem("currentUser");
        const usersData = getUsersData();
        const user = usersData.find((user) => user.email === currentUserEmail);
  
        // Clear all tasks for the user
        user.tasks = [];
        saveUsersData(usersData);
  
        // Re-render the task list (which will now be empty)
        renderTasks(user.tasks);
  
        // Show the auto-close success alert
        Swal.fire({
          title: "Cleared!",
          text: "All your tasks have been cleared.",
          icon: "success",
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
          }
        });
      }
    });
  }
  
if (document.title === "Dashboard") {
  window.onload = loadDashboard;
}