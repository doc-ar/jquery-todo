$(document).ready(function () {
  const apiUrl = "http://localhost:3000/todos";

  // Function to send an AJAX request
  function sendRequest(url, method, data, successCallback, errorCallback) {
    $.ajax({
      url,
      type: method,
      headers: { "Content-Type": "application/json" },
      data: data ? JSON.stringify(data) : null,
      success: successCallback,
      error: errorCallback || function (xhr, status, error) {
        console.error(`Error with ${method} request:`, error);
      },
    });
  }

  // Function to render a todo item
  function createTodoItem(item) {
    const listItem = $("<li></li>");
    const taskText = $("<span></span>").text(item.todo);
    const editButton = $("<button>Edit</button>").addClass("edit-btn");
    const deleteButton = $("<button>Delete</button>").addClass("delete-btn");
    const completeCheckbox = $("<input type='checkbox'>")
      .prop("checked", item.completed)
      .on("change", function () {
        sendRequest(
          `${apiUrl}/${item._id}`,
          "PUT",
          { todo: item.todo, completed: $(this).is(":checked") },
          () => console.log("Task status updated.")
        );
      });

    editButton.on("click", function () {
      const newName = prompt("Edit task:", item.todo);
      if (newName && newName !== item.todo) {
        sendRequest(`${apiUrl}/${item._id}`, "PUT",
          { todo: newName, completed: item.completed },
          (updatedItem) => taskText.text(updatedItem.todo.todo)
        );
      }
    });

    deleteButton.on("click", function () {
      sendRequest(
        `${apiUrl}/${item._id}`,
        "DELETE",
        null,
        () => listItem.remove()
      );
    });

    listItem.append(completeCheckbox, taskText, editButton, deleteButton);
    return listItem;
  }

  // Function to fetch and render the todo list
  function fetchTodoList() {
    sendRequest(apiUrl, "GET", null, (data) => {
      $("#todo-list").empty();
      data.forEach((item) => $("#todo-list").append(createTodoItem(item)));
    });
  }

  // Add new task handler
  $("#add-btn").on("click", function () {
    const newTask = $("#todo-input").val().trim();
    if (newTask) {
      sendRequest(
        apiUrl,
        "POST",
        { todo: newTask, completed: false },
        () => {
          $("#todo-input").val("");
          fetchTodoList();
        }
      );
    }
  });

  // Initial fetch of the todo list
  fetchTodoList();
});
