export async function getTasks() {
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
    return tasks;
  } else {
    console.error("HTTP error:", res.status);
  }
}

export async function deleteTask(task) {
  const url = "http://localhost:3000/task";
  const res = await fetch(url, {
    method: "PUT",
    withCredentials: true,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (res.ok) {
    const tasks = await res.json();
    return tasks;
  } else {
    console.error("HTTP error:", res.status);
  }
}

export async function editTask() {
  return;
}

export async function addTask(task) {
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
    console.log("added task");
  } else {
    console.error("Error adding task:", res.status);
  }
}
