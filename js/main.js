const task_input = document.querySelector("input");
const date_input = document.querySelector(".schedule-date"); // added date input
const add_btn = document.querySelector(".add-task-button");
const todos_list_body = document.querySelector(".todos-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", () => {
  showAllTodos();
  if (!todos.length) {
    displayTodos([]);
  }
});

//get random unique id
function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
function init() { 
  const catWrapper = document.querySelector('.cat_wrapper')
  const wrapper = document.querySelector('.wrapper')
  const cat = document.querySelector('.cat')
  const head = document.querySelector('.cat_head')
  const legs = document.querySelectorAll('.leg')
  const pos = {
    x: null,
    y: null
  }

  const walk = () =>{
    cat.classList.remove('first_pose')
    legs.forEach(leg=>leg.classList.add('walk'))
  }

  const handleMouseMotion = e =>{
    pos.x = e.clientX
    pos.y = e.clientY
    walk()
  }

  const handleTouchMotion = e =>{
    if (!e.targetTouches) return
    pos.x = e.targetTouches[0].offsetX
    pos.y = e.targetTouches[0].offsetY
    walk()
  }

  const turnRight = () =>{
    cat.style.left = `${pos.x - 90}px`
    cat.classList.remove('face_left')
    cat.classList.add('face_right')
  }

  const turnLeft = () =>{
    cat.style.left = `${pos.x + 10}px`
    cat.classList.remove('face_right')
    cat.classList.add('face_left')
  }

  const decideTurnDirection = () =>{
    cat.getBoundingClientRect().x < pos.x ?
      turnRight()
      :
      turnLeft()
  }

  const headMotion = () =>{
    pos.y > (wrapper.clientHeight - 100) ?
      head.style.top = '-15px'
      :
      head.style.top = '-30px'
  }

  const jump = () =>{
    catWrapper.classList.remove('jump')
    if (pos.y < (wrapper.clientHeight - 250)) {
      setTimeout(()=>{
        catWrapper.classList.add('jump')
      },100)
    } 
  }

  const decideStop = ()=>{
    if (cat.classList.contains('face_right') && pos.x - 90 === cat.offsetLeft ||
        cat.classList.contains('face_left') && pos.x + 10 === cat.offsetLeft) {
      legs.forEach(leg=>leg.classList.remove('walk'))    
    }
  }
  
  setInterval(()=>{
    if (!pos.x || !pos.y) return
    decideTurnDirection()
    headMotion()
    decideStop()
  },100)

  setInterval(()=>{
    if (!pos.x || !pos.y) return
    jump()
  },1000)

  document.addEventListener('mousemove', handleMouseMotion)
  document.addEventListener('mousemove', handleTouchMotion)
}

window.addEventListener('DOMContentLoaded', init)


//add todo//
function addToDo(task_input, date_input, priority) {
  let task = {
    id: getRandomId(),
    task: task_input.value.length > 14 ? task_input.value.slice(0, 14) + "..." : task_input.value,
    dueDate: date_input.value,
    priority: priority.toLowerCase(), // Convert to lowercase for consistency
    completed: false,
    status: "pending",
  };
  todos.push(task);
}

task_input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && task_input.value.length > 0) {
    addToDo(task_input, date_input); // Added date input
    saveToLocalStorage();
    task_input.value = "";
    showAllTodos();
  }
});


add_btn.addEventListener("click", () => {
  const priority_select = document.querySelector(".priority-select"); // Add this line
  const priority = priority_select.value; // Add this line

  if (task_input.value === "") {
    showAlertMessage("Please enter a task", "error");
  } else {
    addToDo(task_input, date_input, priority); // Added date input and priority
    saveToLocalStorage();
    showAllTodos();
    task_input.value = "";
    date_input.value = ""; // Added date input
    priority_select.value = "medium"; // Reset priority select
    showAlertMessage("Task added successfully", "success");
  }
});

delete_all_btn.addEventListener("click", clearAllTodos);

//show all todos
function showAllTodos() {
  todos_list_body.innerHTML = "";
  if (todos.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
    return;
  }

  todos.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}

//save todos to local storage
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//show alert message
function showAlertMessage(message, type) {
  let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}

//delete todo
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  showAlertMessage("Todo deleted successfully", "success");
  showAllTodos();
}

//edit todo
function editTodo(id) {
  let todo = todos.find((todo) => todo.id === id);
  task_input.value = todo.task;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  saveToLocalStorage();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Todo updated successfully", "success");
  });
}

//clear all todos
function clearAllTodos() {
  if (todos.length > 0) {
    todos = [];
    saveToLocalStorage();
    showAlertMessage("All todos cleared successfully", "success");
    showAllTodos();
  } else {
    showAlertMessage("No todos to clear", "error");
  }
}

function toggleStatus(id) {
  let todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  console.log("todo", todo);
  saveToLocalStorage();
  displayTodos(todos);
}

function filterTodos(status) {
  let filteredTodos;
  switch (status) {
    case "all":
      filteredTodos = todos;
      break;
    case "pending":
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed);
      break;
  }
  displayTodos(filteredTodos);
}

function filterTodosByPriority(priority) {
  let filteredTodos;
  switch (priority) {
      case 'all':
          filteredTodos = todos;
          break;
      case "high":
          filteredTodos = todos.filter(todo => todo.priority === 'high');
          break;
      case "medium":
          filteredTodos = todos.filter(todo => todo.priority === 'medium');
          break;
      case "low":
          filteredTodos = todos.filter(todo => todo.priority === 'low');
          break;      
  }
  displayTodos(filteredTodos);
}

function displayTodos(todosArray) {
  todos_list_body.innerHTML = "";
  if (todosArray.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
    return;
  }
  todosArray.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <td>${todo.completed ? "Completed" : "Pending"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
  
}
