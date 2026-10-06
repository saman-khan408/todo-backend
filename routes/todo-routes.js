import express from 'express';
import {createTodo,getTodos,getTodoById,updateTodo,toggleTodo,deleteTodo } from '../controllers/todo-controller.js';

const route = express.Router();

route.post('/add',createTodo)
route.get('/',getTodos)
route.get('/:id',getTodoById)
route.put('/:id',updateTodo)
route.patch('/:id/toggle',toggleTodo)
route.delete('/:id',deleteTodo )

export default route;