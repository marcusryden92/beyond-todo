import { useParams } from "react-router-dom";

export default function Main() {
  const param = useParams();
  const username = param.user;

  // fetch the user from database
  async function getUser() {
    const url = "http://localhost:3000/tasks";
    const res = await fetch(url, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return JSON.parse(res.body);
  }

  // get all tasks connected to said user

  return (
    <>
      <h1>{username}</h1>
      {/* Add a button to add a task */}
      <ul>
        <button
          className="rounded-md bg-red-200 px-4 py-2 border"
          onClick={() => getUser()}
        >
          REQ
        </button>
        {/* map through the list and display items */}
        {/* here is a list-item component with a remove-button and edit-button */}
      </ul>
    </>
  );
}
