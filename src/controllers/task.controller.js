const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const task = await Task.create({
            title, description, assignedTo, priority, createdBy: req.user.id,
        });

        res.status(201).json({ success: true, message: "Task created successfully", task, });
    } catch (error) { res.status(500).json({ success: false, message: error.message, }); }
};

// GET ALL TASKS
exports.getTasks = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const status = req.query.status;
        const priority = req.query.priority;
        const assignedTo = req.query.assignedTo;

        const skip = (page - 1) * limit;

        let filter = {};

        if (req.user.role === "ADMIN") {
            filter = {};
        } else if (req.user.role === "MANAGER") {
            filter.createdBy = req.user.id;
        } else {
            filter.assignedTo = req.user.id;
        }

        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignedTo) filter.assignedTo = assignedTo;

        const tasks = await Task.find(filter)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalTasks = await Task.countDocuments(filter);

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// GET SINGLE TASK
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role");

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.status(200).json({
            success: true,
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE TASK STATUS
exports.updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You can update only your assigned tasks",
            });
        }

        const validTransitions = {
            TODO: ["IN_PROGRESS"],
            IN_PROGRESS: ["IN_REVIEW"],
            IN_REVIEW: ["DONE"],
            DONE: [],
        };

        if (!validTransitions[task.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot move from ${task.status} to ${status}`,
            });
        }

        task.status = status;
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task status updated",
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (
            req.user.role === "MANAGER" &&
            task.createdBy.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can update only your created tasks",
            });
        }

        const {
            title,
            description,
            assignedTo,
            status,
            priority,
        } = req.body;

        if (title) task.title = title;
        if (description) task.description = description;
        if (assignedTo) task.assignedTo = assignedTo;
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        if (
            req.user.role === "MANAGER" &&
            task.createdBy.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: "You can delete only your created tasks",
            });
        }

        await Task.findByIdAndDelete(taskId);

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};