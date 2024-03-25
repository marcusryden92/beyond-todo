export async function getTasks(setTasks) {
  const url = "http://localhost:3000/tasks";
  const res = await fetch(url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const tasks = await res.json();
    setTasks(tasks);
    return;
  } else {
    console.error("HTTP error:", res.status);
  }
}

export async function deleteTask(task, fetchTasks) {
  const url = "http://localhost:3000/task";
  console.log(task);
  const res = await fetch(url, {
    method: "DELETE",
    withCredentials: true,
    body: JSON.stringify(task),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    // const contentType = res.headers.get("content-type");
    // if (contentType && contentType.includes("application/json")) {
    //   const tasks = await res.json();
    //   return tasks;
    // } else {
    //   // Handle non-JSON response here, for example:
    //   const textResponse = await res.text();
    //   return textResponse;
    // }

    fetchTasks();
  } else {
    console.error("HTTP error:", res.status);
    // Log the actual response text
    const errorText = await res.text();
    console.error("Response text:", errorText);
  }
}

export async function editTask() {
  return;
}

export async function addTask(task, fetchTasks) {
  const url = "http://localhost:3000/task";
  console.log(task);

  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ task: task }),
    withCredentials: true,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    fetchTasks();
    console.log("added task");
  } else {
    console.error("Error adding task:", res.status);
  }
}
