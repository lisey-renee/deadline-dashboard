import { useState, useEffect } from 'react';
import axios from 'axios';
import AddAssignment from './components/AddAssignment';
import AssignmentCard from './components/AssignmentCard';

function App() {
  const [assignments, setAssignments] = useState([]);
  const [sortBy, setSortBy] = useState('date'); 

  // --- UPDATED API URL ---
  const API_URL = 'https://deadline-dashboard.onrender.com/api/assignments';

  // 1. FETCH DATA
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(API_URL);
        setAssignments(response.data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };
    fetchAssignments();
  }, []);

  // 2. ACTIONS (Add, Delete, Toggle)
  const addAssignment = (assignment) => {
    setAssignments([...assignments, assignment]);
  };

  const deleteAssignment = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setAssignments(assignments.filter(a => a._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const toggleComplete = async (assignment) => {
    try {
      const updatedData = { ...assignment, completed: !assignment.completed };
      const response = await axios.put(`${API_URL}/${assignment._id}`, updatedData);
      setAssignments(assignments.map(a => a._id === assignment._id ? response.data : a));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // 3. MATH & LOGIC (Sorting and Counting)
  const totalPending = assignments.filter(a => !a.completed).length;
  const totalCompleted = assignments.filter(a => a.completed).length;

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.dueDate) - new Date(b.dueDate);
    } else {
      const priorityMap = { high: 1, medium: 2, low: 3 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
  });

  // 4. THE UI (The Face of the App)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">
          📚 Deadline Dashboard
        </h1>

        {/* STATS BAR */}
        <div className="flex gap-4 mt-6 mb-8">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-b-4 border-blue-500">
            <span className="text-gray-500 text-sm uppercase font-bold">Pending</span>
            <p className="text-2xl font-black text-blue-600">{totalPending}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border-b-4 border-green-500">
            <span className="text-gray-500 text-sm uppercase font-bold">Finished</span>
            <p className="text-2xl font-black text-green-600">{totalCompleted}</p>
          </div>
        </div>
        
        <AddAssignment onAddAssignment={addAssignment} />
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Assignments</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-600">Sort by:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded-md bg-white shadow-sm text-sm outline-none"
              >
                <option value="date">Due Soon</option>
                <option value="priority">Priority Level</option>
              </select>
            </div>
          </div>
          
          {sortedAssignments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-inner border-2 border-dashed">
              <p className="text-4xl mb-4">🎉</p>
              <h3 className="text-xl font-bold text-gray-700">All caught up!</h3>
              <p className="text-gray-500">Enjoy your free time or add a new goal above.</p>
            </div>
          ) : (
            sortedAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                onDelete={() => deleteAssignment(assignment._id)}
                onToggleComplete={() => toggleComplete(assignment)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;