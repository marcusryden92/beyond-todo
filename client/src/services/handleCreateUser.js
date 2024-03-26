export async function handleCreateUser(
  e,
  name,
  password,
  navigate,
  handleLogin,
  setStatus,
  setDisplayError
) {
  const userData = {
    username: name,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.status === 409) {
      setDisplayError("username taken");
      return;
    }
    const json = await response.json();
    console.log("Data updated successfully:", json);
    handleLogin(e, name, password, setStatus, navigate);
  } catch (err) {
    console.error("Error updating data:", err);
  }
}
