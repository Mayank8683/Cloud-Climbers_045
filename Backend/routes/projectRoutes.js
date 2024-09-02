const { Router } = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const Project = require("../models/projectModel");

const projectRouter = Router();

// Helper function to handle errors
const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).send({ data: { error: true, message: "server error" } });
};

// Get all projects
projectRouter.get("/projects", async (req, res) => {
  try {
    const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 });
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Get a single project by ID
projectRouter.get("/project/:id", async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(422)
      .send({ data: { error: true, message: "Id is required" } });

  try {
    const data = await Project.find({ _id: mongoose.Types.ObjectId(id) }).sort({
      order: 1,
    });
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Create a new project
projectRouter.post("/project", async (req, res) => {
  const projectSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = projectSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const data = await new Project(value).save();
    res.send({
      data: {
        title: data.title,
        description: data.description,
        updatedAt: data.updatedAt,
        _id: data._id,
      },
    });
  } catch (e) {
    if (e.code === 11000) {
      return res
        .status(422)
        .send({ data: { error: true, message: "Title must be unique" } });
    } else {
      handleErrors(res, e);
    }
  }
});

// Update an existing project
projectRouter.put("/project/:id", async (req, res) => {
  const { id } = req.params;
  const projectSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = projectSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const data = await Project.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { ...value },
      { upsert: true }
    );
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Delete a project
projectRouter.delete("/project/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Project.deleteOne({ _id: mongoose.Types.ObjectId(id) });
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Add a task to a project
projectRouter.post("/project/:id/task", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(500).send("Server error");

  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const [{ task }] = await Project.find(
      { _id: mongoose.Types.ObjectId(id) },
      { "task.index": 1 }
    ).sort({ "task.index": 1 });

    const countTaskLength = [
      task.length,
      task.length > 0 ? Math.max(...task.map((o) => o.index)) : task.length,
    ];

    const data = await Project.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      {
        $push: {
          task: {
            ...value,
            stage: "Requested",
            order: countTaskLength[0],
            index: countTaskLength[1] + 1,
          },
        },
      }
    );
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Get a specific task from a project
projectRouter.get("/project/:id/task/:taskId", async (req, res) => {
  const { id, taskId } = req.params;
  if (!id || !taskId) return res.status(500).send("Server error");

  try {
    const data = await Project.find(
      { _id: mongoose.Types.ObjectId(id) },
      {
        task: {
          $filter: {
            input: "$task",
            as: "task",
            cond: {
              $in: ["$$task._id", [mongoose.Types.ObjectId(taskId)]],
            },
          },
        },
      }
    );
    if (data[0].task.length < 1)
      return res.status(404).send({ error: true, message: "Record not found" });
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Update a specific task in a project
projectRouter.put("/project/:id/task/:taskId", async (req, res) => {
  const { id, taskId } = req.params;
  if (!id || !taskId) return res.status(500).send("Server error");

  const taskSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(),
    description: Joi.string().required(),
  });

  const { error, value } = taskSchema.validate(req.body);
  if (error) return res.status(422).send(error);

  try {
    const data = await Project.updateOne(
      {
        _id: mongoose.Types.ObjectId(id),
        task: { $elemMatch: { _id: mongoose.Types.ObjectId(taskId) } },
      },
      {
        $set: {
          "task.$.title": value.title,
          "task.$.description": value.description,
        },
      }
    );
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Delete a task from a project
projectRouter.delete("/project/:id/task/:taskId", async (req, res) => {
  const { id, taskId } = req.params;
  if (!id || !taskId) return res.status(500).send("Server error");

  try {
    const data = await Project.updateOne(
      { _id: mongoose.Types.ObjectId(id) },
      { $pull: { task: { _id: mongoose.Types.ObjectId(taskId) } } }
    );
    res.send(data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Update todos
projectRouter.put("/project/:id/todo", async (req, res) => {
  const todo = [];

  for (const key in req.body) {
    for (const index in req.body[key].items) {
      req.body[key].items[index].stage = req.body[key].name;
      todo.push({
        name: req.body[key].items[index]._id,
        stage: req.body[key].items[index].stage,
        order: index,
      });
    }
  }

  try {
    for (const item of todo) {
      await Project.updateOne(
        {
          _id: mongoose.Types.ObjectId(req.params.id),
          task: { $elemMatch: { _id: mongoose.Types.ObjectId(item.name) } },
        },
        { $set: { "task.$.order": item.order, "task.$.stage": item.stage } }
      );
    }
    res.send(todo);
  } catch (error) {
    handleErrors(res, error);
  }
});

module.exports = projectRouter;
