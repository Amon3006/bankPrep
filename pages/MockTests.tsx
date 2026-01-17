import React, { useState } from 'react';
import { UserData, MockTestScore } from '../types';
import { addMockScore, deleteScore } from '../services/storage';
import { Plus, Trash2, TrendingUp, Calendar, Hash } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface MockTestsProps {
  data: UserData;
  onUpdate: (newData: UserData) => void;
}

export const MockTests: React.FC<MockTestsProps> = ({ data, onUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    provider: '',
    totalMarks: '100',
    obtainedMarks: '',
    percentile: '',
    quant: '',
    reasoning: '',
    english: '',
    ga: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newScore: Partial<MockTestScore> = {
      date: formData.date,
      provider: formData.provider,
      totalMarks: Number(formData.totalMarks),
      obtainedMarks: Number(formData.obtainedMarks),
      percentile: Number(formData.percentile),
      sectionScores: {
        quant: Number(formData.quant || 0),
        reasoning: Number(formData.reasoning || 0),
        english: Number(formData.english || 0),
        ga: Number(formData.ga || 0)
      }
    };
    const updated = addMockScore(data.userId, newScore);
    onUpdate(updated);
    setShowForm(false);
    // Reset form mostly, keep date/provider for convenience
    setFormData(prev => ({
        ...prev, 
        obtainedMarks: '', 
        percentile: '', 
        quant: '', 
        reasoning: '', 
        english: '', 
        ga: ''
    }));
  };

  const handleDelete = (id: string) => {
    if(confirm('Are you sure you want to delete this record?')) {
        const updated = deleteScore(data.userId, id);
        onUpdate(updated);
    }
  }

  // Prepare chart data (reversed to show chronological order left-to-right)
  const chartData = [...data.scores].reverse().map(s => ({
      date: new Date(s.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}),
      score: s.obtainedMarks,
      percentile: s.percentile
  }));

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mock Tests & Analytics</h1>
          <p className="text-slate-500">Log scores and analyze your performance trend.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {showForm ? 'Cancel' : <><Plus size={20} /> <span>Log New Score</span></>}
        </button>
      </div>

      {/* Add Score Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 animate-fade-in-down">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">New Mock Test Record</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Provider (e.g., Oliveboard)</label>
                <input required type="text" name="provider" value={formData.provider} onChange={handleInputChange} placeholder="Test Source" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                <input required type="number" name="totalMarks" value={formData.totalMarks} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
               <div className="md:col-span-4">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Sectional Scores</h3>
               </div>
               <div>
                 <label className="block text-sm text-slate-600 mb-1">Quant</label>
                 <input type="number" step="0.25" name="quant" value={formData.quant} onChange={handleInputChange} className="w-full p-2 border rounded bg-white" />
               </div>
               <div>
                 <label className="block text-sm text-slate-600 mb-1">Reasoning</label>
                 <input type="number" step="0.25" name="reasoning" value={formData.reasoning} onChange={handleInputChange} className="w-full p-2 border rounded bg-white" />
               </div>
               <div>
                 <label className="block text-sm text-slate-600 mb-1">English</label>
                 <input type="number" step="0.25" name="english" value={formData.english} onChange={handleInputChange} className="w-full p-2 border rounded bg-white" />
               </div>
               <div>
                 <label className="block text-sm text-slate-600 mb-1">General Awareness</label>
                 <input type="number" step="0.25" name="ga" value={formData.ga} onChange={handleInputChange} className="w-full p-2 border rounded bg-white" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Obtained Marks</label>
                    <input required type="number" step="0.25" name="obtainedMarks" value={formData.obtainedMarks} onChange={handleInputChange} className="w-full p-2 border-2 border-blue-100 rounded-lg focus:border-blue-500 outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Percentile</label>
                    <input required type="number" step="0.01" max="100" name="percentile" value={formData.percentile} onChange={handleInputChange} className="w-full p-2 border-2 border-blue-100 rounded-lg focus:border-blue-500 outline-none" />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 font-medium">Save Score</button>
            </div>
          </form>
        </div>
      )}

      {/* Analytics Chart */}
      {chartData.length > 1 && (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Performance Trajectory</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" stroke="#64748b" tickMargin={10} />
                        <YAxis yAxisId="left" stroke="#3b82f6" orientation="left" domain={[0, 'auto']} />
                        <YAxis yAxisId="right" stroke="#8b5cf6" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="score" stroke="#3b82f6" name="Score" strokeWidth={2} activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="percentile" stroke="#8b5cf6" name="Percentile" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
         </div>
      )}

      {/* Score History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">History</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Provider</th>
                        <th className="p-4 text-center">Score</th>
                        <th className="p-4 text-center">Percentile</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {data.scores.map((score) => (
                        <tr key={score.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 flex items-center gap-2">
                                <Calendar size={16} className="text-slate-400" />
                                {new Date(score.date).toLocaleDateString()}
                            </td>
                            <td className="p-4 font-medium">{score.provider}</td>
                            <td className="p-4 text-center">
                                <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold">
                                    {score.obtainedMarks}/{score.totalMarks}
                                </span>
                            </td>
                            <td className="p-4 text-center font-semibold text-purple-600">
                                {score.percentile}%
                            </td>
                            <td className="p-4 text-right">
                                <button 
                                    onClick={() => handleDelete(score.id)}
                                    className="text-slate-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {data.scores.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                No mock tests recorded yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};