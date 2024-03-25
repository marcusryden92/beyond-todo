export async function handleCreateUser(
  e,
  name,
  password,
  navigate,
  handleLogin,
  setStatus
) {
  if (name === "" || password === "") {
    alert("Please enter a username and password");
    return;
  } else {
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
      const json = await response.json();
      console.log("Data updated successfully:", json);
      handleLogin(e, name, password, setStatus, navigate);
    } catch (err) {
      console.error("Error updating data:", err);
    }
  }
}
