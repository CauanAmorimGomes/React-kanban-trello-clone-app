import { useState } from 'react';
import { Column, DragItem } from './types/kanban';
import KanbanColumn from './components/KanbanColumn';

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'A Fazer',
    tasks: [
      {
        id: '1',
        title: 'Estudar React',
        description: 'Revisar hooks e componentes funcionais',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Implementar autenticação',
        description: 'Adicionar login e registro de usuários',
        createdAt: new Date('2024-01-16'),
      },
    ],
  },
  {
    id: 'doing',
    title: 'Em Progresso',
    tasks: [
      {
        id: '3',
        title: 'Desenvolver API REST',
        description: 'Criar endpoints para CRUD de tarefas',
        createdAt: new Date('2024-01-14'),
      },
    ],
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: [
      {
        id: '4',
        title: 'Configurar projeto',
        description: 'Setup inicial com Vite e Tailwind CSS',
        createdAt: new Date('2024-01-13'),
      },
    ],
  },
];

export default function App() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [dragItem, setDragItem] = useState<DragItem | null>(null);

  const handleAddTask = (columnId: string, title: string, description: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: Date.now().toString(),
                  title,
                  description,
                  createdAt: new Date(),
                },
              ],
            }
          : col
      )
    );
  };

  const handleEditTask = (
    columnId: string,
    taskId: string,
    title: string,
    description: string
  ) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.id === taskId ? { ...task, title, description } : task
              ),
            }
          : col
      )
    );
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== taskId),
            }
          : col
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, taskId: string, columnId: string) => {
    setDragItem({ taskId, sourceColumnId: columnId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    
    if (!dragItem) return;

    const { taskId, sourceColumnId } = dragItem;

    if (sourceColumnId === targetColumnId) {
      setDragItem(null);
      return;
    }

    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find((col) => col.id === sourceColumnId);
      const targetColumn = newColumns.find((col) => col.id === targetColumnId);

      if (!sourceColumn || !targetColumn) return prevColumns;

      const taskToMove = sourceColumn.tasks.find((task) => task.id === taskId);
      if (!taskToMove) return prevColumns;

      sourceColumn.tasks = sourceColumn.tasks.filter((task) => task.id !== taskId);
      targetColumn.tasks = [...targetColumn.tasks, taskToMove];

      return newColumns;
    });

    setDragItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-md">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
              <p className="text-sm text-gray-500">Gerencie suas tarefas de forma visual</p>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
              A Fazer: {columns.find((c) => c.id === 'todo')?.tasks.length || 0}
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Em Progresso: {columns.find((c) => c.id === 'doing')?.tasks.length || 0}
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Concluído: {columns.find((c) => c.id === 'done')?.tasks.length || 0}
            </span>
          </div>
          <div className="text-gray-500">
            Arraste e solte para mover tarefas entre colunas
          </div>
        </div>
      </footer>
    </div>
  );
}
