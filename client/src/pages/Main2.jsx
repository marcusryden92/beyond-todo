import React, { useRef, useState } from "react";

export default function TodoListComponent({ username }) {
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const todoInput = useRef();

  function addTodo() {
    const newTodo = todoInput.current.value.trim();
    if (newTodo !== "") {
      if (editIndex !== null) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = newTodo;
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        setTodos([...todos, newTodo]);
      }
      todoInput.current.value = "";
    }
  }

  function removeTodo(index) {
    const updatedTodos = [...todos];
    updatedTodos.splice(index, 1);
    setTodos(updatedTodos);
    if (editIndex === index) {
      setEditIndex(null);
    }
  }

  function editTodo(index) {
    todoInput.current.value = todos[index];
    setEditIndex(index);
  }

  function logout() {
    // Implement your logout logic here
    console.log("Logged out");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg text-center shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Hello {username}, you have {todos.length}{" "}
        {todos.length === 1 ? "task" : "tasks"}
      </h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          placeholder="Enter your todo"
          ref={todoInput}
        />
      </div>
      <button
        onClick={addTodo}
        className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
      >
        {editIndex !== null ? "UPDATE TODO" : "ADD TODO"}
      </button>
      <ul className="text-left">
        {todos.map((todo, index) => (
          <li
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200"
          >
            <span>{todo}</span>
            <div>
              <button
                onClick={() => editTodo(index)}
                className="text-blue-500 hover:text-blue-700 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => removeTodo(index)}
                className="text-pink-500 hover:text-pink-700 mr-2"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={logout}
        className="w-full py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg shadow-lg"
      >
        LOG OUT
      </button>
    </div>
  );
}
