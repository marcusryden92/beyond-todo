import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm() {
	const loginPassword = useRef();
	const loginUsername = useRef();
	const [status, setStatus] = useState();
	const username = useRef();
	const navigate = useNavigate();

	async function checkSession() {
		const url = "http://localhost:3000/session";
		const res = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log(res.status);
		setStatus(res.status);
		return res.status;
	}

	useEffect(() => {
		console.log("usEffect running");

		if (status === 200) {
			console.log("Successful login detected");
			navigate(`/main/${loginUsername.current.value}`);
			return;
		}

		async function checkAuth() {
			if ((await checkSession()) === 200) {
				navigate(`/main/${loginUsername.current.value}`);
			}
			console.log(await checkSession());
		}

		checkAuth();
	});

	async function handleLogin(e) {
		e.preventDefault();

		const userData = {
			username: loginUsername.current.value,
			password: loginPassword.current.value,
		};

		try {
			const response = await fetch("http://localhost:3000/login", {
				method: "POST",
				withCredentials: true,
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});
			const json = await response.json();
			console.log("Data updated successfully:", json);
			setStatus(response.status);
		} catch (err) {
			console.error("Error updating data:", err);
		}
	}

	return (
		<div className=" w-full h-screen bg-bg pt-20">
			<form className="max-w-md mx-auto bg-bg p-8 rounded-lg text-center grid gap-4">
				<h1 className="block text-bug font-todo uppercase text-5xl mb-4">Log in</h1>
				<input
					ref={loginUsername}
					id="name"
					type="text"
					placeholder="Username"
					className="w-full p-2  bg-bg  border-bug border-solid border-b-4 "
				/>

				<input
					ref={loginPassword}
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
					Log in
				</button>
				<p className="text-bug">
					Not a member?{" "}
					<Link to="/signup" className="text-eyes hover:underline">
						Sign up!
					</Link>
				</p>
			</form>
		</div>
	);
}
