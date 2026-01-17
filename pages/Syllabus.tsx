import React, { useState } from 'react';
import { UserData, Subject } from '../types';
import { updateSyllabusTopic, addSubject, deleteSubject, addTopic, deleteTopic } from '../services/storage';
import { ChevronDown, ChevronRight, Check, Plus, Trash2, BookOpen, Layers } from 'lucide-react';

interface SyllabusProps {
  data: UserData;
  onUpdate: (newData: UserData) => void;
}

export const Syllabus: React.FC<SyllabusProps> = ({ data, onUpdate }) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [addingTopicTo, setAddingTopicTo] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  const toggleSubject = (id: string) => {
    setExpandedSubjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Handlers ---

  const handleSubjectAdd = () => {
    if (newSubjectName.trim()) {
        const updated = addSubject(data.userId, newSubjectName.trim());
        onUpdate(updated);
        setNewSubjectName('');
        setIsAddingSubject(false);
    }
  };

  const handleSubjectDelete = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (confirm('Delete this subject and all its topics?')) {
          const updated = deleteSubject(data.userId, id);
          onUpdate(updated);
      }
  };

  const handleTopicAdd = (subjectId: string) => {
      if (newTopicName.trim()) {
          const updated = addTopic(data.userId, subjectId, newTopicName.trim());
          onUpdate(updated);
          setNewTopicName('');
          setAddingTopicTo(null);
      }
  };

  const handleTopicDelete = (subjectId: string, topicId: string) => {
      if (confirm('Delete this topic?')) {
          const updated = deleteTopic(data.userId, subjectId, topicId);
          onUpdate(updated);
      }
  };

  const updateTopic = (subjectId: string, topicId: string, field: 'completed' | 'prelimsRevisions' | 'mainsRevisions', value: any) => {
    const updatedData = updateSyllabusTopic(data.userId, subjectId, topicId, { [field]: value });
    onUpdate(updatedData);
  };

  const handleRevisionChange = (subjectId: string, topicId: string, field: 'prelimsRevisions' | 'mainsRevisions', delta: number, currentValue: number) => {
      const newValue = Math.max(0, currentValue + delta);
      updateTopic(subjectId, topicId, field, newValue);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Syllabus Tracker</h1>
          <p className="text-slate-500 mt-1">Manage subjects, track topics, and monitor revision cycles.</p>
        </div>
        <button 
            onClick={() => setIsAddingSubject(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
            <Plus size={20} />
            <span>Add Subject</span>
        </button>
      </div>

      {isAddingSubject && (
          <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm flex items-center gap-2 animate-fade-in-down">
              <input 
                type="text" 
                autoFocus
                placeholder="Subject Name (e.g., Computer Aptitude)"
                className="flex-1 p-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubjectAdd()}
              />
              <button onClick={handleSubjectAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
              <button onClick={() => setIsAddingSubject(false)} className="text-slate-500 px-3 py-2 hover:bg-slate-100 rounded-lg">Cancel</button>
          </div>
      )}

      <div className="space-y-4">
        {data.syllabus.map((subject) => {
          const completedCount = subject.topics.filter(t => t.completed).length;
          const totalCount = subject.topics.length;
          const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
          const isExpanded = !!expandedSubjects[subject.id];

          return (
            <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200">
              {/* Subject Header */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 group"
                onClick={() => toggleSubject(subject.id)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        {subject.name}
                        <button 
                            onClick={(e) => handleSubjectDelete(e, subject.id)}
                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                            title="Delete Subject"
                        >
                            <Trash2 size={14} />
                        </button>
                    </h3>
                    <p className="text-sm text-slate-500">{completedCount}/{totalCount} concepts cleared</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-24 md:w-32 hidden sm:block">
                     <div className="w-full bg-slate-200 rounded-full h-1.5">
                        <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                        />
                     </div>
                  </div>
                </div>
              </div>

              {/* Topics List */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-2 sm:p-4">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    <th className="pb-3 pl-2 w-10">Done</th>
                                    <th className="pb-3">Topic</th>
                                    <th className="pb-3 text-center w-32">Prelims Rev.</th>
                                    <th className="pb-3 text-center w-32">Mains Rev.</th>
                                    <th className="pb-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="space-y-2">
                                {subject.topics.map((topic) => (
                                    <tr key={topic.id} className="bg-white border border-slate-200 rounded-lg group hover:border-blue-300 transition-colors">
                                        <td className="p-3 rounded-l-lg">
                                            <button
                                                onClick={() => updateTopic(subject.id, topic.id, 'completed', !topic.completed)}
                                                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${topic.completed ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 hover:border-blue-500'}`}
                                            >
                                                {topic.completed && <Check size={14} />}
                                            </button>
                                        </td>
                                        <td className="p-3 font-medium text-slate-700">
                                            <span className={topic.completed ? 'text-slate-400 line-through' : ''}>{topic.name}</span>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-md py-1 px-2 w-fit mx-auto">
                                                <button onClick={() => handleRevisionChange(subject.id, topic.id, 'prelimsRevisions', -1, topic.prelimsRevisions)} className="text-slate-400 hover:text-blue-600 text-lg leading-none pb-0.5 px-1">-</button>
                                                <span className={`text-sm font-bold w-6 ${topic.prelimsRevisions > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{topic.prelimsRevisions}</span>
                                                <button onClick={() => handleRevisionChange(subject.id, topic.id, 'prelimsRevisions', 1, topic.prelimsRevisions)} className="text-slate-400 hover:text-blue-600 text-lg leading-none pb-0.5 px-1">+</button>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-md py-1 px-2 w-fit mx-auto">
                                                <button onClick={() => handleRevisionChange(subject.id, topic.id, 'mainsRevisions', -1, topic.mainsRevisions)} className="text-slate-400 hover:text-purple-600 text-lg leading-none pb-0.5 px-1">-</button>
                                                <span className={`text-sm font-bold w-6 ${topic.mainsRevisions > 0 ? 'text-purple-600' : 'text-slate-400'}`}>{topic.mainsRevisions}</span>
                                                <button onClick={() => handleRevisionChange(subject.id, topic.id, 'mainsRevisions', 1, topic.mainsRevisions)} className="text-slate-400 hover:text-purple-600 text-lg leading-none pb-0.5 px-1">+</button>
                                            </div>
                                        </td>
                                        <td className="p-3 rounded-r-lg text-right">
                                            <button 
                                                onClick={() => handleTopicDelete(subject.id, topic.id)}
                                                className="text-slate-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Topic UI */}
                    <div className="mt-4">
                        {addingTopicTo === subject.id ? (
                            <div className="flex gap-2 max-w-md">
                                <input 
                                    type="text" 
                                    autoFocus
                                    placeholder="New topic name..."
                                    className="flex-1 p-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
                                    value={newTopicName}
                                    onChange={(e) => setNewTopicName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleTopicAdd(subject.id)}
                                />
                                <button onClick={() => handleTopicAdd(subject.id)} className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">Add</button>
                                <button onClick={() => setAddingTopicTo(null)} className="text-slate-500 px-2 text-sm hover:underline">Cancel</button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setAddingTopicTo(subject.id)}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition-colors py-1"
                            >
                                <Plus size={16} />
                                <span>Add Topic</span>
                            </button>
                        )}
                    </div>
                </div>
              )}
            </div>
          );
        })}
        {data.syllabus.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <Layers className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-medium text-slate-900">No subjects yet</h3>
                <p className="text-slate-500 mb-4">Get started by adding your first subject.</p>
                <button 
                    onClick={() => setIsAddingSubject(true)}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Add a Subject
                </button>
            </div>
        )}
      </div>
    </div>
  );
};