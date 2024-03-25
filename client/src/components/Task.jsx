import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

export default function Task(props) {
	function deleteLocalTask(index) {
		const updatedTasks = [...props.tasks];
		updatedTasks.splice(index, 1);

		if (editIndex === index) {
			setEditIndex(null);
		}
	}

	function editLocalTask(index) {
		taskInput.current.value = props.tasks[index];
		setEditIndex(index);
	}

	const [isHovered, setIsHovered] = useState(false);

	return (
		<div className=" flex items-end relative">
			<li
				key={props.tasks}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{ filter: isHovered ? "brightness(110%)" : "brightness(100%)" }}
				className=" flex justify-between items-center py-2 pl-6 border-solid border-t-2 border-y-bugSecondary  relative w-full bg-bug h-[3em] transition duration-200 overflow-hidden"
			>
				<span className=" w-[80%] text-text font-semibold ">{props.tasks.task}</span>
				<div className=" pr-3 flex">
					{isHovered ? (
						<>
							<button
								onClick={() => editLocalTask(props.index)}
								className="bg-bg w-[2em] h-[2em] mr-2 rounded-full hover:bg-blue-400  transition duration-200 flex justify-center items-center "
							>
								<MdEdit />
							</button>
							<button
								onClick={() => deleteLocalTask(props.index)}
								className="bg-bg  w-[2em] h-[2em] mr-2 rounded-full hover:bg-eyes hover:text-bg transition duration-200 flex justify-center items-center"
							>
								<MdDelete />
							</button>
						</>
					) : null}
				</div>
			</li>
			<div className=" legs absolute -left-8 h-8 w-12 border-solid border-border border-l-borderThickness2 border-t-borderThickness2 rounded-tl-md  border-bug l-4 t-0 "></div>
			<div className=" legs absolute -right-8 h-8 w-12  border-solid border-border border-r-borderThickness2 border-t-borderThickness2 border-bug l-4 t-0 rounded-tr-md"></div>
		</div>
	);
}
