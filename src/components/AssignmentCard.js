function AssignmentCard({ assignment, onDelete, onToggleComplete }) {
  const today = new Date();
  const due = new Date(assignment.dueDate);
  const daysUntil = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

  // Determine colors based on urgency
  let cardStyle = 'bg-white border-blue-500'; // Default
  
  if (daysUntil < 0 || daysUntil <= 1) {
    cardStyle = 'bg-red-50 border-red-500';
  } else if (daysUntil <= 3) {
    cardStyle = 'bg-orange-50 border-orange-500';
  } else if (daysUntil <= 7) {
    cardStyle = 'bg-yellow-50 border-yellow-500';
  }

  // --- THE FADE LOGIC ---
  // If completed, we override the colors to be grey and faded
  if (assignment.completed) {
    cardStyle = 'bg-gray-200 border-gray-400 opacity-60 grayscale';
  }

  return (
    <div className={`${cardStyle} border-l-8 p-4 rounded-lg shadow-md mb-4 relative transition-all duration-500`}>
      <div className="flex justify-between items-start">
        
        {/* Info Side: Text gets a line-through if completed */}
        <div className={assignment.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
          <h3 className="text-xl font-bold">{assignment.title}</h3>
          <p className="text-gray-600">{assignment.course}</p>
          <p className="text-sm mt-2 font-medium">
            Due: {new Date(assignment.dueDate).toLocaleDateString()}
          </p>
        </div>
        
        {/* Action Side */}
        <div className="flex flex-col items-end gap-10">
          <button
            onClick={() => onDelete(assignment._id)}
            className="text-gray-400 hover:text-red-600 font-bold text-xl"
          >
            ✕
          </button>

          {/* THE CHECKMARK: Stays green if completed */}
          <button
            onClick={onToggleComplete}
            className={`font-bold text-4xl transition-colors ${
              assignment.completed ? 'text-green-600' : 'text-gray-300 hover:text-green-400'
            }`}
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssignmentCard;