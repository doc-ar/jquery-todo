$(document).ready(function () {
  // Function to fetch and display all todo items
  function fetchTodoList() {
    $.ajax({
      url: "https://dummyjson.com/todos",
      type: "GET",
      dataType: "json",
      success: function (data) {
        $("#todo-list").empty(); // Clear the current list before repopulating
        data.todos.forEach(function (item) {
          // Create a new list item for each task
          const listItem = $("<li></li>");
          const taskText = $("<span></span>").text(item.todo); // Assuming the task text is in the 'todo' field
          const editButton = $("<button></button>")
            .addClass("edit-btn")
            .text("Edit");
          const deleteButton = $("<button></button>")
            .addClass("delete-btn")
            .text("Delete");

          // Append the task text and buttons to the list item
          listItem.append(taskText);
          listItem.append(editButton);
          listItem.append(deleteButton);

          // Append the list item to the todo list
          $("#todo-list").append(listItem);

          // Edit Button Click Handler
          editButton.on("click", function () {
            const newName = prompt("Edit task:", item.todo);
            if (newName && newName !== item.todo) {
              // Update the task using the API
              $.ajax({
                url: `https://dummyjson.com/todos/${item.id}`,
                type: "PUT",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                  todo: newName,
                  completed: item.completed,
                }),
                success: function (updatedItem) {
                  taskText.text(updatedItem.todo);
                },
                error: function (xhr, status, error) {
                  console.error("Error updating task:", error);
                },
              });
            }
          });

          // Delete Button Click Handler
          deleteButton.on("click", function () {
            // Delete the task using the API
            $.ajax({
              url: `https://dummyjson.com/todos/${item.id}`,
              type: "DELETE",
              success: function () {
                listItem.remove();
              },
              error: function (xhr, status, error) {
                console.error("Error deleting task:", error);
              },
            });
          });
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data: ", error);
      },
    });
  }

  // Initially fetch and populate the list
  fetchTodoList();

  // Handle adding new tasks
  $("#add-btn").on("click", function () {
    const newTask = $("#todo-input").val().trim();
    if (newTask) {
      // Create a new task on the server
      $.ajax({
        url: "https://dummyjson.com/todos/add",
        type: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          todo: newTask,
          completed: false,
          userId: 5, // You can customize the userId if needed
        }),
        success: function (newItem) {
          // Append the new item to the list
          const listItem = $("<li></li>");
          const taskText = $("<span></span>").text(newItem.todo);
          const editButton = $("<button></button>")
            .addClass("edit-btn")
            .text("Edit");
          const deleteButton = $("<button></button>")
            .addClass("delete-btn")
            .text("Delete");

          listItem.append(taskText);
          listItem.append(editButton);
          listItem.append(deleteButton);
          $("#todo-list").append(listItem);

          // Edit Button Click Handler
          editButton.on("click", function () {
            const newName = prompt("Edit task:", newItem.todo);
            if (newName && newName !== newItem.todo) {
              // Update the task using the API
              $.ajax({
                url: `https://dummyjson.com/todos/${newItem.id}`,
                type: "PUT",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({
                  todo: newName,
                  completed: newItem.completed,
                }),
                success: function (updatedItem) {
                  taskText.text(updatedItem.todo);
                },
                error: function (xhr, status, error) {
                  console.error("Error updating task:", error);
                },
              });
            }
          });

          // Delete Button Click Handler
          deleteButton.on("click", function () {
            // Delete the task using the API
            $.ajax({
              url: `https://dummyjson.com/todos/${newItem.id}`,
              type: "DELETE",
              success: function () {
                listItem.remove();
              },
              error: function (xhr, status, error) {
                console.error("Error deleting task:", error);
              },
            });
          });

          // Clear input after adding task
          $("#todo-input").val("");
        },
        error: function (xhr, status, error) {
          console.error("Error adding task:", error);
        },
      });
    }
  });
});
