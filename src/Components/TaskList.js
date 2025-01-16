import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import Swal from 'sweetalert2';
import './TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = async (newTask) => {
        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask),
        });
        const data = await response.json();
        setTasks([...tasks, data]);
    };

    const handleDeleteTask = async (id, taskName) => {
        Swal.fire({
            title: `Do you want to delete the task "${taskName}"?`,
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await fetch(`http://localhost:5000/api/tasks/${id}`, {
                    method: 'DELETE',
                });
                setTasks(tasks.filter(task => task.id !== id));
                Swal.fire('Deleted!', `"${taskName}" has been deleted.`, 'success');
            }
        });
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask) => {
        await fetch(`http://localhost:5000/api/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });
        setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
        setIsModalOpen(false);
    };

    return (
        <div className="task-container">
            <div className='header'>
                <div className='left-header'>
                    <h2>Tasks</h2>
                    <h3>All Tasks</h3>
                </div>

                <div className="top-bar">
                    <div className='buttons'>
                        <button onClick={() => setIsModalOpen(true)} className="new-task-btn">New Task</button>
                        <button onClick={() => window.location.reload()} className="refresh-btn">Refresh</button>
                    </div>
                    <input type="text" placeholder="Search" className="search-box" />
                </div>
            </div>

            <table className="task-table">
                <thead>
                    <tr>
                        <th>Assigned To</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Comments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td className='name'>{task.assignedTo}</td>
                            <td>{task.status}</td>
                            <td>{task.dueDate}</td>
                            <td>{task.priority}</td>
                            <td>{task.comments}</td>
                            <td>
                                <button onClick={() => handleEditTask(task)} className="edit-btn">Edit</button>
                                <button
                                    onClick={() => handleDeleteTask(task.id, task.assignedTo)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <TaskForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={selectedTask ? handleUpdateTask : handleAddTask}
                task={selectedTask}
            />
        </div>
    );
};

export default TaskList;
