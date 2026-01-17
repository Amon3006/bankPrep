import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from 'recharts';
import { UserData } from '../types';
import { CheckCircle2, Trophy, ListTodo, TrendingUp } from 'lucide-react';

interface DashboardProps {
  data: UserData;
}

const COLORS = ['#3b82f6', '#e2e8f0']; // Blue for completed, Slate for remaining

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  
  const stats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    
    data.syllabus.forEach(subject => {
      subject.topics.forEach(topic => {
        totalTopics++;
        if (topic.completed) completedTopics++;
      });
    });

    const completionPercentage = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);
    
    // Recent scores (last 5)
    const recentScores = [...data.scores]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-5);
      
    // Format for chart
    const scoreData = recentScores.map(s => ({
      date: new Date(s.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      score: s.obtainedMarks,
      total: s.totalMarks
    }));

    const bestScore = data.scores.length > 0 
      ? Math.max(...data.scores.map(s => s.obtainedMarks)) 
      : 0;

    return {
      totalTopics,
      completedTopics,
      completionPercentage,
      scoreData,
      bestScore,
      pendingTasks: data.tasks.filter(t => !t.completed).length
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Syllabus</p>
            <p className="text-2xl font-bold text-slate-900">{stats.completionPercentage}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Best Score</p>
            <p className="text-2xl font-bold text-slate-900">{stats.bestScore}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Tests Taken</p>
            <p className="text-2xl font-bold text-slate-900">{data.scores.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <ListTodo size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-slate-900">{stats.pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 w-full">Syllabus Completion</h3>
            <div className="w-full h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie
                        data={[
                            { name: 'Completed', value: stats.completedTopics },
                            { name: 'Remaining', value: stats.totalTopics - stats.completedTopics }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {
                            [0, 1].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                        }
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-slate-800">{stats.completionPercentage}%</span>
                </div>
            </div>
            <div className="flex gap-4 text-sm text-slate-600 mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Done</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                    <span>To Do</span>
                </div>
            </div>
        </div>

        {/* Score Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 col-span-1 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Score Trend</h3>
            {stats.scoreData.length > 0 ? (
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stats.scoreData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 'auto']} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="score" 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6 }} 
                                name="Obtained Marks"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    No mock tests recorded yet.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};