import { useRef } from "react";

export default function LoginForm() {
	const loginPassword = useRef();
	const loginUsername = useRef();

	async function login() {
		const userData = {
			username: loginUsername.current.value,
			password: loginPassword.current.value,
		};

		try {
			const response = await fetch("http://localhost:3000/login", {
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
		const loginUsername = useRef();
	}

	return (
		<form className="bg-stone-500 flex flex-col gap-4 p-24">
			<input
				type="text"
				placeholder="name"
				ref={loginUsername}
				className="border rounded-md max-w-[10rem] p-2"
			></input>
			<input
				type="text"
				placeholder="password"
				className="border rounded-md max-w-[10rem] p-2"
				ref={loginPassword}
			></input>
			<div className="flex flex-col gap-4">
				<button
					type="submit"
					onClick={() => login()}
					className="bg-pink-200 max-w-[5rem] rounded-md p-1 "
				>
					Login
				</button>
			</div>
		</form>
	);
}
