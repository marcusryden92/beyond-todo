const pool = require("./db");

// *************************-TASKS-**************************

// Reads the whole table
function readTasks() {
	return async (_, res) => {
		try {
			const tasks = await pool.query("SELECT * FROM tasks");
			res.json(tasks.rows);
		} catch (error) {
			console.error(error);
		}
	};
}

// Creates a new task
function createTask(task_id, user_id, text) {
	return async (req, res) => {
		const result = await pool.query(`INSERT INTO tasks (task_id, user_id, text) VALUES (?, ?, ?)`, [
			task_id,
			user_id,
			text,
		]);
		return result;
	};
}

// Returns an object of a task
async function getTask(task_id) {
	try {
		const result = await pool.query("SELECT * FROM tasks WHERE task_id = $1", [task_id]);
		return result.rows[0];
	} catch (error) {
		console.error("Error executing query in getTask:", error);
		throw error;
	}
}


// *************************-USERS-**************************

// Returns an object of the user row
async function findUserByUsername(user_name) {
	try {
		const result = await pool.query("SELECT * FROM users WHERE user_name = $1", [user_name]);
		return result.rows[0]; // Assuming there's only one user with the provided username
	} catch (error) {
		console.error("Error executing query in findUseByUsername:", error);
		throw error; // Re-throw the error to be handled by the caller
	}
}


// Creates a new user 
async function addUser(user) {
	try {
		const { user_id, username, hashedPassword } = user;
		const result = await pool.query(
			`INSERT INTO users (user_id, user_name, password) 
          VALUES ($1, $2, $3)`,
			[user_id, username, hashedPassword]
		);
		return user;
	} catch (error) {
		console.error("Error executing query in addUser", error);
		throw error; // Re-throw the error to be handled by the caller
	}
}





// app.post("/todos", async(req, res), () => {
//   const { task_id, user_id, text } = req.body;
//   createTask(task_id, user_id, text);
// });

module.exports = { readTasks, createTask, findUserByUsername, addUser };
