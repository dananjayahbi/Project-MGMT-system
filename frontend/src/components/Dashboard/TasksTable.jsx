import React from 'react';
import { 
    Chip,
    IconButton,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";

function TasksTable({ selectedProject, selectedProjectTasks }) {

    //console.log(selectedProject)
    //console.log(selectedProjectTasks)
  return (
    <div className="col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Tasks for Project: {selectedProject ? selectedProject.projectName : ''}</h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full dark:text-slate-300">
            {/* Table header */}
            <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
              <tr>
                <th className="p-2">
                  <div className="font-semibold text-left">Task ID</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Task Name</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Description</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Task Group</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Status</div>
                </th>
                <th className="p-2">
                  <div className="font-semibold text-center">Actions</div>
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
              {/* Row */}
              {selectedProjectTasks.map((task) => (
                <tr>
                    <td className="p-2">
                        <div className="text-slate-800 dark:text-slate-100">{task.taskID}</div>
                    </td>
                    <td className="p-2">
                        <div className="text-center text-emerald-500">{task.taskName}</div>
                    </td>
                    <td className="p-2">
                        <div className="text-center">{task.description}</div>
                    </td>
                    <td className="p-2">
                        <div className="text-center text-sky-500">{task.taskGroupNo}</div>
                    </td>
                    <td className="p-2 text-center">
                        {(() => {
                        const statusColors = {
                            requested: 'primary',
                            processing: 'warning', 
                            reviewing: 'info', 
                            cnacelled: 'warning', 
                            completed: 'success', 
                        };

                        const color = statusColors[task.status.toLowerCase()];

                        return color ? (
                            <Chip label={task.status} color={color} />
                        ) : (
                            <Chip label={task.status} color="error" />
                        );
                        })()}
                    </td>
                    <td className="p-2">
                        <div className="text-center">
                        <IconButton onClick={()=>{handleUpdate(Project._id)}}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={()=>{handleDelete(Project._id, Project.projectName)}}>
                            <DeleteIcon />
                        </IconButton>
                        </div>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TasksTable;