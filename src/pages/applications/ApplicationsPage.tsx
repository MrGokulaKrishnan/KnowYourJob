import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Building, MapPin, DollarSign, Calendar, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const COLUMNS = [
  { id: 'Saved', title: 'Saved' },
  { id: 'Applied', title: 'Applied' },
  { id: 'Viewed', title: 'Viewed' },
  { id: 'Recruiter Contacted', title: 'Recruiter' },
  { id: 'Interview', title: 'Interview' },
  { id: 'Offer', title: 'Offer' },
  { id: 'Rejected', title: 'Rejected' },
  { id: 'Withdrawn', title: 'Withdrawn' }
];

const INITIAL_DATA = [
  { id: 'app-1', title: 'Frontend Engineer', company: 'TechCorp', location: 'Remote', salary: '$120k-$140k', status: 'Applied', date: '2 days ago', match: 94 },
  { id: 'app-2', title: 'Full Stack Dev', company: 'Innovate AI', location: 'San Francisco, CA', salary: '$130k-$160k', status: 'Interview', date: '5 days ago', match: 88 },
  { id: 'app-3', title: 'React Developer', company: 'WebSolutions', location: 'Remote', salary: '$110k-$130k', status: 'Saved', date: '1 day ago', match: 91 },
];

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(INITIAL_DATA);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    setApplications(apps => apps.map(app => app.id === draggableId ? { ...app, status: newStatus } : app));
  };

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white">
      <div className="flex items-center justify-between p-6 shrink-0 border-b border-white/5">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gradient">Applications</h1>
          <span className="bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-400/20">{applications.length}</span>
        </div>
        <button className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {COLUMNS.map(col => {
              const colApps = applications.filter(a => a.status === col.id);
              return (
                <div key={col.id} className="flex flex-col w-80 shrink-0 h-full">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="font-bold text-neutral-300">{col.title}</h3>
                    <span className="text-xs bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full font-medium">{colApps.length}</span>
                  </div>

                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={clsx(
                          "flex-1 rounded-2xl p-2 transition-colors min-h-[150px] overflow-y-auto",
                          snapshot.isDraggingOver ? "bg-yellow-400/5 border-2 border-dashed border-yellow-400/30" : "bg-neutral-900/30 border-2 border-dashed border-transparent"
                        )}
                      >
                        {colApps.length === 0 && !snapshot.isDraggingOver && (
                          <div className="h-24 flex items-center justify-center text-neutral-600 text-sm font-medium border-2 border-dashed border-neutral-800 rounded-xl m-2">
                            Drop here
                          </div>
                        )}
                        {colApps.map((app, index) => (
                          <Draggable key={app.id} draggableId={app.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => navigate(`/applications/${app.id}`)}
                                className={clsx(
                                  "glass p-4 rounded-xl mb-3 cursor-pointer select-none",
                                  snapshot.isDragging ? "shadow-[0_0_30px_rgba(255,208,0,0.15)] border-yellow-400/50 scale-105 z-50" : "hover:border-white/20 border-white/5"
                                )}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h4 className="font-bold text-sm line-clamp-1">{app.title}</h4>
                                    <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1"><Building className="w-3 h-3"/> {app.company}</p>
                                  </div>
                                  <span className="badge-ai text-[10px] px-1.5 py-0.5 rounded border border-yellow-400/30 text-yellow-400 bg-yellow-400/10 font-bold">{app.match}% Match</span>
                                </div>
                                <div className="space-y-1.5 mt-3">
                                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <MapPin className="w-3.5 h-3.5" /> {app.location}
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                                    <DollarSign className="w-3.5 h-3.5" /> {app.salary}
                                  </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500">
                                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {app.date}</span>
                                  <button onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-white/10 rounded"><MoreVertical className="w-3.5 h-3.5"/></button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}

