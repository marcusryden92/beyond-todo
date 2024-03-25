import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getTasks, deleteTask, editTask, addTask } from "../services/useTasksApi";
import Task from "../components/Task";
import { IoMdAdd } from "react-icons/io";
import anime from "animejs";

export default function Main() {
	const [tasks, setTasks] = useState([]);
	const param = useParams();
	const username = param.user;
	const [editIndex, setEditIndex] = useState(null);
	const taskInput = useRef();

	function addLocalTask() {
		const newTask = taskInput.current.value.trim();
		addTask(newTask);
		if (newTask !== "") {
			if (editIndex !== null) {
				const updatedTask = [...tasks];
				updatedTask[editIndex] = newTask;
				setEditIndex(null);
			} else {
				setTasks([...tasks, newTask]);
			}
			taskInput.current.value = "";
		}
	}

	function logout() {
		// Implement your logout logic here
		console.log("Logged out");
	}

	useEffect(() => {
		async function fetchTasks() {
			const tasks = await getTasks();
			setTasks(tasks);
		}
		fetchTasks();

		const intervalID = setInterval(legsMoving, 20000);
		return () => clearInterval(intervalID);
	}, []);


	
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
					{/* antennas */}
					<div className="flex justify-between -mx-4 h-16 -mb-4">
						<div className=" w-[20%]  border-solid border-border border-r-borderThickness border-t-borderThickness border-bug rounded-tr-lg"></div>
						<div className=" w-[20%]  border-solid border-border border-l-borderThickness border-t-borderThickness rounded-tl-lg  border-bug"></div>
					</div>

					{/* head */}
					<div className=" bg-bug rounded-tl-[4em] rounded-tr-[4em] flex items-center  border-b-0 overflow-hidden text-text py-4">
						<div className=" w-[3em] bg-eyes h-[6em] rounded-tr-full rounded-br-full"></div>
						<div className=" mx-auto p-4 w-[80%] text-center">
							<h1 className="text-3xl sm:text-6xl font-extrabold uppercase font-todo tracking-wider">
								{username}
							</h1>
							<p className=" text-base sm:text-xl font-bold mb-4 uppercase">
								You have a {tasks.length}pede
							</p>
							<div className="flex rounded-full overflow-hidden">
								<input
									type="text"
									placeholder="Add something todo for a longer-pede"
									ref={taskInput}
									className=" text-sm sm:text-base flex-1 px-4 py-2 bg-bugSecondary h-full "
								/>

								<button
									onClick={addLocalTask}
									className=" bg-bugSecondary brightness-110 w-10 flex justify-center items-center"
								>
									{editIndex !== null ? (
										"UPDATE TODO"
									) : (
										<IoMdAdd />
									)}
								</button>
							</div>
						</div>
						<div className=" w-[3em] bg-eyes h-[6em] rounded-tl-full rounded-bl-full"></div>
					</div>
				</div>

				{/* body */}
				<div className=" mx-auto w-full overflow-scroll pb-16 h-[68vh] px-10 ">
					<ul className="text-left mx-auto">
						{tasks
							? tasks.map((tasks, index) => (
									<Task index={index} tasks={tasks} />
							  ))
							: ""}
					</ul>

					{/* bytt */}
					<div className=" mx-auto bg-bug p-4 rounded-bl-[4em] rounded-br-[4em] flex justify-center border-solid border-t-2 border-bugSecondary max-w-[40em]">
						<button
							onClick={logout}
							className=" py-2 text-white font-semibold rounded-full bg-bugSecondary  hover:bg-eyes hover:text-bg transition duration-200 px-4"
						>
							LOG OUT
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
