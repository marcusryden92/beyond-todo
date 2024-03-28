import { useParams } from "react-router-dom";
import { useState, useEffect, useRef, useContext } from "react";
import { addTask } from "../services/useTasksApi";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import anime from "animejs";
import Task from "../components/Task";
import { myContext } from "../context/Context";

export default function Main() {
  const navigate = useNavigate();
  const param = useParams();
  const username = param.user;
  const taskInput = useRef();
  const { fetchTasks, tasks } = myContext();

  useEffect(() => {
    fetchTasks();

    const intervalID = setInterval(legsMoving, 20000);
    return () => clearInterval(intervalID);
  }, []);

  function handleAdd(e) {
    e.preventDefault();

    if (taskInput.current.value) {
      const newTask = taskInput.current.value.trim();
      addTask(newTask, fetchTasks);
      taskInput.current.value = "";
    }
  }

  async function handleLogout() {
    // const url = "http://localhost:3000/logout";
    const url = "https://centipe-do-list-server.vercel.app/logout";

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        console.log("res STATUS: " + res.status);
        navigate("/");
      } else {
        alert("Failed to logout");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function legsMoving() {
    anime({
      targets: ".legs",
      marginLeft: [
        { value: ".5em", easing: "easeOutSine", duration: 200 },
        { value: "0", easing: "easeInOutQuad", duration: 200 },
        { value: ".5em", easing: "easeOutSine", duration: 200 },
        { value: "0", easing: "easeInOutQuad", duration: 200 },
      ],
      marginRight: [
        { value: ".5em", easing: "easeOutSine", duration: 200 },
        { value: "0", easing: "easeInOutQuad", duration: 200 },
        { value: ".5em", easing: "easeOutSine", duration: 200 },
        { value: "0", easing: "easeInOutQuad", duration: 200 },
      ],
      delay: anime.stagger(60, { grid: [20, 20], from: "center" }),
    });
  }

  return (
    <main className=" bg-main w-full h-screen  bg-bg overflow-hidden">
      <div className=" mx-auto ">
        <div className=" mx-auto max-w-[45em] pt-6  px-10 ">
          {/* ANTENNAS */}
          <div className="flex justify-between -mx-4 h-16 -mb-4">
            <div className=" w-[20%]  border-solid border-border border-r-borderThickness border-t-borderThickness border-bug rounded-tr-lg"></div>
            <div className=" w-[20%]  border-solid border-border border-l-borderThickness border-t-borderThickness rounded-tl-lg  border-bug"></div>
          </div>

          {/* HEAD */}
          <div className=" bg-bug rounded-tl-[4em] rounded-tr-[4em] flex items-center  border-b-0 overflow-hidden text-text py-4">
            {/* EYE */}
            <div className=" w-[3em] bg-eyes h-[6em] rounded-tr-full rounded-br-full"></div>
            <div className=" mx-auto p-4 w-[80%] text-center">
              <h1 className="text-3xl sm:text-6xl font-extrabold uppercase font-todo tracking-wider">
                {username}
              </h1>
              <p className=" text-base sm:text-xl font-bold mb-4 uppercase">
                You have a {tasks.length}-i-pede
              </p>

              <form
                onSubmit={(e) => handleAdd(e)}
                className="flex rounded-full overflow-hidden "
              >
                <input
                  type="text"
                  placeholder="Add a task for a longer-pede"
                  ref={taskInput}
                  className=" text-sm sm:text-base flex-1 px-4 py-2 bg-bugSecondary h-full rounded-tl-full rounded-bl-full sm:placeholder:opacity-100 w-full"
                />
                <button className=" bg-bugSecondary brightness-110 w-10 flex justify-center items-center">
                  <IoMdAdd />
                </button>
              </form>
            </div>
            {/* EYE */}
            <div className=" w-[3em] bg-eyes h-[6em] rounded-tl-full rounded-bl-full"></div>
          </div>
        </div>

        {/* body */}
        <div className=" mx-auto w-full overflow-scroll pb-48 h-[68vh] px-10 ">
          <ul className="text-left mx-auto">
            {tasks
              ? tasks.map((task, index) => (
                  <Task key={index} index={index} task={task} />
                ))
              : ""}
          </ul>

          {/* BUTT */}
          <div className=" mx-auto bg-bug p-6 rounded-bl-[4em] rounded-br-[4em] flex justify-center border-solid border-t-2 border-bugSecondary max-w-[40em]">
            <button
              onClick={handleLogout}
              className=" py-2 text-text font-semibold rounded-full bg-bugSecondary  hover:bg-eyes hover:text-bg transition duration-200 px-4"
            >
              LOG OUT
            </button>
          </div>
          <div className=" w-4 h-4 bg-bug mx-auto"></div>
        </div>
      </div>
    </main>
  );
}
