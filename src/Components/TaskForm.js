import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './TaskForm.css';

Modal.setAppElement('#root');

const TaskForm = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState({
    assignedTo: '',
    status: 'Not Started',
    dueDate: '',
    priority: 'Normal',
    comments: '',
  });

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (formData.assignedTo && formData.status && formData.priority) {
      onSave(formData);
      onClose();
      setFormData({
        assignedTo: '',
        status: 'Not Started',
        dueDate: '',
        priority: 'Normal',
        comments: '',
      });
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} className="modal" overlayClassName="overlay">
      <div className='header-modal'>
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label><span>*</span> Assigned To</label>
          <input type="text" name="assignedTo" value={formData.assignedTo} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label><span>*</span> Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label><span>*</span> Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Normal</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Discription</label>
        <textarea name="comments" value={formData.comments} onChange={handleChange}></textarea>
      </div>

      <div className="modal-buttons">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>
    </Modal>

  );
};

export default TaskForm;
