const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newFiverrProject = new Schema(
  {
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
    assignedTeamMembers: [{
        type: String,
        required: true,
    }],
    ProjectCategory: {
        type: String,
        required: true,
    },
    projectBudjet: {
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

const FiverrProjects = mongoose.model("FiverrProjects", newFiverrProject);

module.exports = FiverrProjects;
