import { useState } from 'react';
import axios from 'axios'; // 1. Added this import

function AddAssignment({ onAddAssignment }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [priority, setPriority] = useState('medium');

  // 2. Added 'async' here because talking to a server takes time
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newAssignment = {
      title,
      course,
      dueDate,
      estimatedHours: Number(estimatedHours),
      priority,
      completed: false
    };

    try {
      // 3. POST = "Add". We send the data to your server on port 5050
      const response = await axios.post('http://localhost:5050/api/assignments', newAssignment);
      
      // 4. If successful, the server sends back the assignment (now with an ID)
      // We pass THAT to the main App so it shows up on the screen
      onAddAssignment(response.data);

      // Clear the form
      setTitle('');
      setCourse('');
      setDueDate('');
      setEstimatedHours('');
      setPriority('medium');
      
      console.log("Success! Server saved the data.");
    } catch (error) {
      console.error("Error saving to server:", error);
      alert("Make sure your server is running on port 5050!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Add New Assignment</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Assignment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="p-2 border rounded"
        />
        
        <input
          type="text"
          placeholder="Category (e.g., CS 101, Personal)"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          className="p-2 border rounded"
        />
        
        <div className="flex flex-col">
         <label className="text-xs font-semibold text-gray-500 mb-1 ml-1">
           Due Date
         </label>
         <input
             type="date"
             value={dueDate}
             onChange={(e) => setDueDate(e.target.value)}
             required
             className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <input
          type="number"
          placeholder="Estimated Hours"
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(e.target.value)}
          required
          min="0"
          step="0.5"
          className="p-2 border rounded"
        />
        
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        
        <button 
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Assignment
        </button>
      </div>
    </form>
  );
}

export default AddAssignment;