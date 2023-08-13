
  const showButton = document.getElementById("dialogBtn");
  const favDialog = document.getElementById("taskForm");
  const addTaskForm = document.getElementById("addTaskForm");
  const taskTitle = document.getElementById("title");
  const taskDescription = document.getElementById("description");
  const taskAssignee = document.getElementById("assignee");

  const ProgressTasksList = document.getElementById("progressTasks");
  const completedTasksList = document.getElementById("completedTasks");
  const cancelButton = document.getElementById("cancelFormButton");

  let tasks = [];
  let flag = null;
  let editingIndex = null;

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function showTasks() {
    ProgressTasksList.innerHTML = "";
    completedTasksList.innerHTML = "";
  
    tasks.forEach((task, index) => {
      const li = document.createElement("li");
  
      if (task.completed) {
        li.innerHTML = `
          <span class="completed">Task title: ${task.title}</span>
          <br>
          <button class="delete-button" data-index="${index}">Delete task</button>
          <button class="redo-button" data-index="${index}">Redo task</button>
          `;
        completedTasksList.appendChild(li);
      } else {
        li.innerHTML = `
        <div class="task-container">
          <span>Task title: </span>
          <span>${task.title}</span>
          <br>
          <span>Task description: </span>
          <span>${task.description}</span>
          <br>
        </div>
          <button class="complete-button" data-index="${index}">Task completed</button>
          <button class="delete-button" data-index="${index}">Delete task</button>
          <button class="edit-button" data-index="${index}">Edit</button>
        `;
        ProgressTasksList.appendChild(li);
      }
    });
  }
  
  function editTask(index){
  
    const taskToEdit = tasks[index];

  // Fill the form fields with task details
  taskTitle.value = taskToEdit.title;
  taskDescription.value = taskToEdit.description;
  taskAssignee.value = taskToEdit.assignee;

  // Open the dialog for editing
  favDialog.showModal();

  console.log("task editat");
  flag = 1;
  editingIndex = index;
  }

  function addTask() {
      const title = taskTitle.value.trim();
      const description = taskDescription.value.trim();
      const assignee = taskAssignee.value.trim();
    if (flag == null){
      const newTask = { title, description, assignee, completed: false };
      tasks.push(newTask);
      saveTasks();
      showTasks();
      closeTaskForm();

    }else if(flag !== null){

    tasks[editingIndex].title = title;
    tasks[editingIndex].description = description;
    tasks[editingIndex].assignee = assignee;

    saveTasks();
    showTasks();
    closeTaskForm();
    console.log(title);
    }
  }

  


  function completeTask(index) {
    tasks[index].completed = true;
    saveTasks();
    showTasks();
  }

  function redoTask(index){
    tasks[index].completed = false;
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
    }else if (event.target.classList.contains("redo-button")){
      const index = parseInt(event.target.getAttribute("data-index"));
      redoTask(index);
    }
  });

  ProgressTasksList.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
      const index = parseInt(event.target.getAttribute("data-index"));
      deleteTask(index);
    } else if (event.target.classList.contains("complete-button")) {
      const index = parseInt(event.target.getAttribute("data-index"));
      completeTask(index);
    }else if (event.target.classList.contains("edit-button")) {
      console.log("Edit button clicked");
      const index = parseInt(event.target.getAttribute("data-index"));
      editTask(index);
    }
  });


  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    showTasks();
  }

