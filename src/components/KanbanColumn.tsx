import { useState } from 'react';
import { Column } from '../types/kanban';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  column: Column;
  onAddTask: (columnId: string, title: string, description: string) => void;
  onEditTask: (columnId: string, taskId: string, title: string, description: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string, columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetColumnId: string) => void;
}

export default function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddTask = () => {
    if (newTitle.trim()) {
      onAddTask(column.id, newTitle, newDescription);
      setNewTitle('');
      setNewDescription('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewTitle('');
    setNewDescription('');
    setIsAdding(false);
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      case 'doing':
        return 'bg-gradient-to-r from-blue-500 to-blue-600';
      case 'done':
        return 'bg-gradient-to-r from-green-500 to-green-600';
      default:
        return 'bg-gradient-to-r from-purple-500 to-purple-600';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col min-h-[500px] w-80 flex-shrink-0">
      <div className={`${getColumnColor(column.id)} text-white px-4 py-3 rounded-lg mb-4 shadow-sm`}>
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{column.title}</h2>
          <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-sm font-semibold">
            {column.tasks.length}
          </span>
        </div>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, column.id)}
        className="flex-1 space-y-3 overflow-y-auto pr-1"
      >
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={(id, title, description) => onEditTask(column.id, id, title, description)}
            onDelete={(id) => onDeleteTask(column.id, id)}
            onDragStart={(e, taskId) => onDragStart(e, taskId, column.id)}
          />
        ))}

        {isAdding && (
          <div className="bg-white rounded-lg p-4 shadow-md border-2 border-blue-300">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Título da tarefa"
              autoFocus
            />
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Descrição (opcional)"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddTask}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Adicionar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full px-4 py-2 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Tarefa
        </button>
      )}
    </div>
  );
}
