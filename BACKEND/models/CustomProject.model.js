const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newCustomProject = new Schema(
  {
    PID: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    deadline: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        required: true,
    },
    projectManagers: [{
        type: String,
        required: true,
    }],
    teamMembers: [{
        type: String,
        required: true,
    }],
    ProjectCategory: {
        type: String,
        required: true,
    },
    projectBudget: {
        type: Number,
        required: true,
    },
    attachments: [{
        type: String,
        required: true,
    }],
    status: {
      type: String,
      required: true,
    },
    notes: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CustomProjects = mongoose.model("CustomProjects", newCustomProject);

module.exports = CustomProjects;
