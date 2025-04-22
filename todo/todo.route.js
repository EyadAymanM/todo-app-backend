import { Router } from 'express';
import {
  addTodo,
  deleteTodo,
  deleteTodoTask,
  getAllTodos, updateTodo,
  updateTodoTaskCompletion,
  updateTodoTaskTitle
} from './todo.controller.js';
import { authorization } from '../middleware/authorization.js';

const router = Router();

router.use(authorization);
router.get('/', getAllTodos);
router.post('/', addTodo);
router.patch('/task/completed/:taskId', updateTodoTaskCompletion);
router.patch('/task/title/:taskId', updateTodoTaskTitle);
router.delete('/task/:taskId', deleteTodoTask);
router.patch('/:todoId', updateTodo);
router.delete('/:todoId', deleteTodo);

export default router;