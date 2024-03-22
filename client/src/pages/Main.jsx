import { useParams } from "react-router-dom";

export default function Main() {
	const param = useParams();
	const username = param.user;
  
	return (
		<>
			<h1>{username}</h1>
			{/* Add a button to add a task */}
			<ul>
				{/* map through the list and display items */}
				{/* here is a list-item component with a remove-button and edit-button */}
			</ul>
		</>
	);
}
