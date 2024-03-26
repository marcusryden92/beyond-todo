export async function handleLogin(
  e,
  name,
  password,
  setStatus,
  navigate,
  setBadCredentials
) {
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
    const json = await response.json();
    console.log("Data updated successfully:", json);
    setStatus(response.status);
    if (response.ok) {
      navigate(`/main/${name}`);
    } else {
      setBadCredentials(true);
    }
  } catch (err) {
    console.error("Error updating data:", err);
  }
}
