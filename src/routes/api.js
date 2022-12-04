const express = require('express');
const UsersController = require("../controllers/UsersController");
const TaskController = require("../controllers/TaskController");
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware');


const router = express.Router();

// user path
router.post("/registration", UsersController.registration);
router.post("/login", UsersController.login);
router.post("/profileUpdate", AuthVerifyMiddleware, UsersController.profileUpdate);
router.get("/profileDetails", AuthVerifyMiddleware, UsersController.profileDetails);

// Recover Password path 
router.get("/RecoverVerifyEmail/:email",UsersController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",UsersController.RecoverVerifyOTP);
router.post("/RecoverResetPass",UsersController.RecoverResetPass);
// task path 
router.post("/createTask", AuthVerifyMiddleware, TaskController.CreateTask);
router.get("/deleteTask/:id", AuthVerifyMiddleware, TaskController.DeleteTask);
router.get("/updateTaskStatus/:id/:status", AuthVerifyMiddleware, TaskController.UpdateTaskStatus);
router.get("/listTaskByStatus/:status", AuthVerifyMiddleware, TaskController.ListTaskByStatus);
router.get("/taskStatusCount", AuthVerifyMiddleware, TaskController.TaskStatusCount);

module.exports = router;