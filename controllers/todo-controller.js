import Todo from "../models/todo-model.js";
import mongoose from "mongoose";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }
  const todo = await Todo.create({
    title,
    description,
  });
  return res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo,
  });
});

export const getTodos = asyncHandler(async (req, res) => {
  const { search, sort, page = 1, limit = 10 } = req.query;
  let query = {};
  if (search) {
    query.title = { $regex: search, $options: "i" };
  }
  // sorting
  let sortOption = {};
  if (sort === "asc") sortOption.createdAt = 1;
  else sortOption.createdAt = -1;

  //pagination
  const skip = (page - 1) * limit;
  const todos = await Todo.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(parseInt(limit));

  const totalTodos = await Todo.countDocuments(query);

  return res.status(200).json({
    success: true,
    messege: "Todos fetched successfully",
    total: totalTodos,
    page: Number(page),
    limit: Number(limit),
    data: todos,
  });
});

export const getTodoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await Todo.findById(id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Todo fetched successfully",
    data: todo,
  });
});

export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }
  if (!title || title.trim === "") {
    return res.status(400).json({
      success: false,
      message: "Title is required",
    });
  }
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    {
      title,
      description,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (updatedTodo) {
    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      data: updatedTodo,
    });
  }
});

export const toggleTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }
  const todo = await Todo.findById(id);
  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo id not found",
    });
  }
  todo.isCompleted = !todo.isCompleted;
  await todo.save();
  return res.status(200).json({
    success: true,
    message: "Todo status toggled",
    data: todo,
  });
});

export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo id",
    });
  }
  const deletedTodo = await Todo.findByIdAndDelete(id);
  if (!deletedTodo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: deletedTodo,
  });
});
