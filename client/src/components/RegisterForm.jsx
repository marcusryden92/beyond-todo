import { useRef } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm() {
	const registerPassword = useRef();
	const registerUsername = useRef();

	async function createUser() {
		const userData = {
			username: registerUsername.current.value,
			password: registerPassword.current.value,
		};
		console.log("hej");

		try {
			const response = await fetch("http://localhost:3000/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const json = await response.json();
			console.log("Data updated successfully:", json);
		} catch (err) {
			console.error("Error updating data:", err);
		}
	}

	return (
		<form className=" my-5 max-w-[800px] w-full mx-auto bg-white p-8 px-8 rounded-lg  text-center">
			<div className="items-center  flex flex-col py-2 text-black">
				<label>Username</label>
				<input
					className="w-1/2 rounded-lg bg-gray-200 mt-2 p-2 focus:border-violet-800 focus:bg-purple-200 focus:outline-none"
					type="text"
					ref={registerUsername}
				/>
			</div>
			<div className="items-center flex flex-col py-2 text-black">
				<label>Password</label>
				<input
					className="w-1/2  p-2 rounded-lg bg-gray-200 mt-2  focus:border-violet-800 focus:bg-purple-200 focus:outline-none"
					type="password"
					ref={registerPassword}
				/>
			</div>
			<div className="flex justify-between py-2">
				<p className="flex items-center">
					<input className="mr-2" type="checkbox" />
					Remember me
				</p>
				<Link to="#">
					<p>Forgot password</p>
				</Link>
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					createUser();
				}}
				className="hover:bg-pink-400 w-full my-5 py-2 bg-pink-500 shadow-lg shadow-pink-500/50 hover:shadow-pink-500/40 text-white font-semibold rounded-lg"
			>
				REISTER
			</button>
		</form>
	);
}
