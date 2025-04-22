import db from '../database/db.js'

export const getAllTodos = (req, res) => {
  const { id: userId } = req;

  db.all('SELECT * FROM todos WHERE userId = (?)', userId, async (err, todos) => {
    if (err) {
      return res.status(500).json({ error: "Database Error" });
    }
    const todosWithTasks = todos.map(todo => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM tasks WHERE todoId = ?', [todo.id], (err, tasks) => {
          if (err) return reject(err);
          todo.tasks = tasks; // Attach tasks to the todo
          resolve(todo);
        });
      });
    });

    Promise.all(todosWithTasks)
      .then(todos => {
        return res.status(200).json({ data: todos, message: "Success" });
      })
      .catch(err => {
        return res.status(500).json({ error: "Error fetching tasks" });
      })
  })

}

export const addTodo = (req, res) => {
  // destructing values for database Insert
  const { id: userId } = req;
  const { title, tasks } = req.body;

  if (!title) return res.status(400).json({ error: "Title is required" });

  db.run(
    // first:adding todo to todos table
    'INSERT INTO todos (title,userId) VALUES (?,?)',
    // db query params
    [title, userId],
    function (err) {
      if (err) {
        console.log(err.message)
        return res.status(500).json({ error: "Database Error" })
      }

      // second:adding tasks to tasks table and giving it userId
      // as it's a foreign key 
      const todoId = this.lastID;
      if (Array.isArray(tasks) && tasks.length > 0) {
        // defining tasks query
        const stmt = db.prepare('INSERT INTO tasks (todoId,task) VALUES (?,?)');

        for (const task of tasks) {
          const text = task.task;
          stmt.run(todoId, text);
        }

        stmt.finalize((stmtErr) => {
          if (stmtErr) {
            console.log(err.message)
            return res.status(500).json({ error: "Failed to insert tasks" })
          }
        })
        res.status(201).json({ id: todoId, title, userId, tasks });
      } else {
        res.status(201).json({ id: todoId, title, userId, tasks: [] });
      }
    }
  )
}

export const updateTodoTaskCompletion = (req, res) => {
  const { taskId } = req.params;
  const { completed } = req.body;

  db.run(
    "UPDATE tasks SET completed = ? WHERE id = ?",
    [completed==1?0:1, taskId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "Error updating task" });

      }
      return res.status(203).json({ task: this, message: "updated successfully" });
    }
  )
}

export const updateTodoTaskTitle = (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  db.run(
    'UPDATE tasks SET task = ? WHERE id = ?',
    [title, taskId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "Error updating task" });
      }
      return res.status(203).json({ task: this, message: "updated successfully" });
    }
  )
}

export const deleteTodoTask = (req, res) => {
  const { taskId } = req.params;

  db.run(
    'DELETE FROM tasks WHERE id = ?',
    [taskId],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "Error deleting task" });
      }
      return res.status(204).json({ task: this, message: "deleted successfully" });
    }
  )
}

export const updateTodo = (req, res) => {
  () => console.log('edit todo for user')
}

export const deleteTodo = (req, res) => {
  () => console.log('remove todo for user')
}
