//I gave up the function where I was using the DOMContentLoaded
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
  let flag = null; //this flag is marking if a task was edited
  let editingIndex = null; //this variable is used to save the value of the index for the edited task so I can update the task. 
  //If I didn't use it, the addTask function did not see the value of the index

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
          `; //I added the Redo button, if you want to retake a task
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
        `;//I added the Edit button
        ProgressTasksList.appendChild(li);
      }
    });
  }

  //The edit Task function. This function is called when I click on the Edit button
  function editTask(index){
    const taskToEdit = tasks[index]; //a new variable to save the text from the fields
    //take the text from the fields and write it in form when it is open
    taskTitle.value = taskToEdit.title;
    taskDescription.value = taskToEdit.description;
    taskAssignee.value = taskToEdit.assignee;
    //show the dialog
    favDialog.showModal();
    flag = 1; //mnark that the task was edited
    editingIndex = index; //save the index value
  }

  //I modified this function to upload a task if it is modified
  function addTask() {
      const title = taskTitle.value.trim();
      const description = taskDescription.value.trim();
      const assignee = taskAssignee.value.trim();
    //if the task wasn't modified and it is a new task it will pe added to the application
    if (flag == null){
      const newTask = { title, description, assignee, completed: false };
      tasks.push(newTask);
      saveTasks();
      showTasks();
      closeTaskForm();
    //if the task was modified the application will upload the new version of the task  
    }else if(flag !== null){
    tasks[editingIndex].title = title;
    tasks[editingIndex].description = description;
    tasks[editingIndex].assignee = assignee;
    saveTasks();
    showTasks();
    closeTaskForm();
    }
  }

  function completeTask(index) {
    tasks[index].completed = true;
    saveTasks();
    showTasks();
  }

  //I added this function to move the task from done to not completed ( completed = false )
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
    }else if (event.target.classList.contains("redo-button")){ //add event listener for redo button
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
    }else if (event.target.classList.contains("edit-button")) { //add event listener for edit button
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

