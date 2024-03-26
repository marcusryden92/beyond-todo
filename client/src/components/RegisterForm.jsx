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
		<div className=" w-full h-screen bg-bg pt-20">
			<form className="max-w-md mx-auto bg-bg p-8 rounded-lg text-center grid gap-4">
				<h1 className="block text-bug font-todo uppercase text-5xl mb-4">sign up</h1>
				<input
					ref={registerUsername}
					id="name"
					type="text"
					placeholder="Username"
					className="w-full p-2  bg-bg  border-bug border-solid border-b-4 "
				/>

				<input
					ref={registerPassword}
					id="password"
					type="password"
					placeholder="Password"
					className="w-full p-2 bg-bg  border-bug border-solid border-b-4"
				/>
				<button
					onClick={(e) => {
						handleLogin(e);
					}}
					type="submit"
					className="w-full py-2 rounded-full font-semibold bg-bug hover:brightness-125 transition duration-200 text-text font-todo mt-8"
				>
					Sign up
				</button>
				<p className="text-bug">
					Already a member?{" "}
					<Link to="/" className="text-eyes hover:underline">
						Log in!
					</Link>
				</p>
			</form>
		</div>
	);
}
