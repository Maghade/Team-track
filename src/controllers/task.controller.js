const Task = require("../models/Task");
exports.createTask = async (req, res) => {

    try {
        const {
            title,
            description,
            assignedTo,
        } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            createdBy: req.user.id
        });


        res.status(201).json({

            message: "Task created successfully",

            task,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};




exports.getTasks = async (req, res) => {

    try {

        // query params
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 5;

        const status = req.query.status;

        const skip = (page - 1) * limit;

        let filter = {}
         if (req.user.role === "ADMIN") {

            filter = {};

        }

        else if (req.user.role === "MANAGER") {
 filter.createdBy = req.user.id;

        }

        else {

            filter.assignedTo = req.user.id;

        }


        if (status) {

            filter.status = status;

        }

        const tasks = await Task.find(filter)

            .populate("assignedTo", "name email role")

            .populate("createdBy", "name email role")

            .skip(skip)

            .limit(limit)

            .sort({ createdAt: -1 });



        // total count
        const totalTasks = await Task.countDocuments(filter);



        res.status(200).json({

            currentPage: page,

            totalPages: Math.ceil(totalTasks / limit),

            totalTasks,

            tasks,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};



exports.updateTaskStatus = async (req, res) => {

    try {

        const { taskId } = req.params;

        const { status } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {

            return res.status(404).json({

                message: "Task not found",

            });

        }


        if (task.assignedTo.toString() !== req.user.id) {

            return res.status(403).json({

                message: "You can update only your assigned tasks",

            });

        }


        const validTransitions = {

            TODO: ["IN_PROGRESS"],

            IN_PROGRESS: ["DONE"],

            DONE: [],

        };


        if (!validTransitions[task.status].includes(status)) {

            return res.status(400).json({

                message: `Cannot move from ${task.status} to ${status}`,

            });

        }


        task.status = status;


        await task.save();

        res.status(200).json({

            message: "Task status updated",

            task,

        });

    } catch (error) {

        res.status(500).json({

            message: error.message,

        });

    }

};