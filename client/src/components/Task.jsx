import { useState, useRef, useContext } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { deleteTask, editTask } from "../services/useTasksApi";
import { myContext } from "../context/Context";

export default function Task(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [editingTask, setEditingTask] = useState(false);
  const editInput = useRef(null);
  const { fetchTasks } = myContext();

  console.log(props)

  function handleDelete() {
    deleteTask(props.task.task_id, fetchTasks);
  }

  function handleEditTask() {
    if (editInput.current) {
      editInput.current.value = props.task.task;
    }
  }

  function handleEdit() {
    setEditingTask((prev) => !prev);
    const editedTask = editInput.current.value;
    editTask(props.task.task_id, fetchTasks, editedTask);
    if (editInput.current) {
      editInput.current.value = "";
    }
  }

  return (
    <div className=" flex items-end relative max-w-[40em] mx-auto">
      <div className=" legs absolute -left-8 h-8 w-12 border-solid border-border border-l-borderThickness2 border-t-borderThickness2 rounded-tl-md  border-bug l-4 t-0 "></div>
      <div className=" legs absolute -right-8 h-8 w-12  border-solid border-border border-r-borderThickness2 border-t-borderThickness2 border-bug l-4 t-0 rounded-tr-md"></div>
      <li
        key={props.index}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ filter: isHovered ? "brightness(110%)" : "brightness(100%)" }}
        className=" flex justify-between items-center py-2 pl-6 border-solid border-t-2 border-y-bugSecondary  relative w-full bg-bug h-[3em] transition duration-200 overflow-hidden"
      >
        {editingTask ? (
          <input type="text" placeholder={props.task.task} ref={editInput} className=" text-sm sm:text-base rounded-full text-text text-semibold px-4 py-2 bg-bugSecondary h-full text-semibold " />
        ) : (
          <span className=" w-[80%] text-text font-semibold ">
            {props.task.task}
          </span>
        )}

        <div className=" pr-3 flex">
          {isHovered ? (
            <>
              {editingTask ? (
                <button
                  onClick={() => handleEdit(props.index)}
                  className="bg-bg  w-[2em] h-[2em] mr-2 rounded-full hover:bg-eyes hover:text-bg transition duration-200 flex justify-center items-center"
                >
                  <FaCheck />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleEditTask();
                    setEditingTask((prev) => !prev);
                  }}
                  className="bg-bg  w-[2em] h-[2em] mr-2 rounded-full hover:bg-eyes hover:text-bg transition duration-200 flex justify-center items-center"
                >
                  <MdEdit />
                </button>
              )}
              <button
                onClick={() => handleDelete(props.index)}
                className="bg-bg  w-[2em] h-[2em] mr-2 rounded-full hover:bg-eyes hover:text-bg transition duration-200 flex justify-center items-center"
              >
                <MdDelete />
              </button>
            </>
          ) : null}
        </div>
      </li>
    </div>
  );
}
