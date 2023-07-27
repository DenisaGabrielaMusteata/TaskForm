document.addEventListener('DOMContentLoaded', function () {
  const showButton = document.getElementById("dialogbtn");
  const favDialog = document.getElementById("taskForm");
  const addTaskForm = document.getElementById("addTaskForm");
  const taskTitle = document.getElementById("title");
  const taskDescription = document.getElementById("description");
  const taskAssignee = document.getElementById("assignee");

  const inProgressTasksList = document.getElementById("inProgressTasks");
  const completedTasksList = document.getElementById("completedTasks");
  const cancelButton = document.getElementById("cancelFormButton");

  let tasks = [];

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function showTasks() {
    inProgressTasksList.innerHTML = "";
    completedTasksList.innerHTML = "";

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
      
        ${
          task.completed
            ? '<span class="completed"></span>'
            : '<input type="checkbox" class="complete-button" data-index="' +
              index +
              '"></input>'
        }
        <span>${task.title}</span>
        <span>${task.description}</span> 
        <button class="delete-button" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
       
      `;
      
      

      if (task.completed) {
        completedTasksList.appendChild(li);
        
      } else {
        inProgressTasksList.appendChild(li);
        
      }
    });
    
  }

  function addTask() {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const assignee = taskAssignee.value.trim();

    const newTask = { title, description, assignee, completed: false };
    tasks.push(newTask);
    saveTasks();
    showTasks();
    closeTaskForm();
  }

  function completeTask(index) {
    tasks[index].completed = true;
    saveTasks();
    showTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    showTasks();
  }

  function openTaskForm() {
    favDialog.showModal();
  }

  function cancelForm(){
    favDialog.close();
  }

  function closeTaskForm() {
    favDialog.close();
    addTaskForm.reset();
  }

  showButton.addEventListener("click", openTaskForm);
  cancelButton.addEventListener("click",cancelForm);

  addTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
  });

  completedTasksList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const index = parseInt(event.target.getAttribute("data-index"));
      deleteTask(index);
    }
  });

  inProgressTasksList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const index = parseInt(event.target.getAttribute("data-index"));
      deleteTask(index);
    } else if (event.target.classList.contains("complete-button")) {
      const index = parseInt(event.target.getAttribute("data-index"));
      completeTask(index);
    }
  });


  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    showTasks();
  }
});
