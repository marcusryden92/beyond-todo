export async function handleLogin(e, name, password, setStatus, navigate) {
  e.preventDefault();

  const userData = {
    username: name,
    password: password,
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

    setStatus(response.status);
    if (response.ok) {
      console.log(response.status);
      navigate(`/main/${name}`);
    }
  } catch (err) {
    console.error("Error updating data:", err);
  }
}
