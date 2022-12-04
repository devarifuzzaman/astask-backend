const TaskModel = require("../models/TaskModel");

//Create a new Task
exports.CreateTask = (req, res) => {
 let reqBody = req.body;
 reqBody.email = req.headers['email'];
 TaskModel.create(reqBody, (err, data) => {
  if (err) {
   res.status(400).json({ status: "Failed to Create task", data: err });
  }
  else {
   res.status(200).json({ status: "Success", data: data });
  }
 })
}

//Delete tasks

exports.DeleteTask = (req, res) => {
 let id = req.params.id;
 let Query = { _id: id };

 TaskModel.remove(Query, (err, data) => {
  if (err) {
   res.status(400).json({ status: "Failed", data: err });
  }
  else {
   res.status(200).json({ status: "Success", data: data });
  }
 })
}


//update a task Status
exports.UpdateTaskStatus = (req, res) => {
 let id = req.params.id;
 let status = req.params.status;
 let Query = { _id: id };
 let reqBody = { status: status };
 TaskModel.updateOne(Query, reqBody, (err, data) => {
  if (err) {
   res.status(400).json({ status: "Failed to Update task", data: err });
  }
  else {
   res.status(200).json({ status: "Success", data: data });
  }
 })
}

// List task by status 

exports.ListTaskByStatus = (req, res) => {
 let status = req.params.status;
 let email = req.headers['email'];
 TaskModel.aggregate([
  { $match: { status: status, email: email } },
  {
   $project: {
    _id: 1, title: 1, description: 1, status: 1,
    createDate: {
     $dateToString: {
      date: "$createDate",
      format: "%d-%m-%Y"
     }
    }
   }
  }
 ], (err, data) => {
  if (err) {
   res.status(400).json({ status: "Failed", data: err });
  }
  else {
   res.status(200).json({ status: "Success", data: data });
  }
 })
}


// List task count by status 

exports.TaskStatusCount = (req, res) => {
 let email = req.headers['email'];
 TaskModel.aggregate([
  { $match: { email: email } },
  { $group: { _id: "$status", sum: { $count: {} } } }
 ], (err, data) => {
  if (err) {
   res.status(400).json({ status: "Failed", data: err });
  }
  else {
   res.status(200).json({ status: "Success", data: data });
  }
 })
}