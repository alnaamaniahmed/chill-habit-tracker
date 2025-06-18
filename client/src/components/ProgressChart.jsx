import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import { TrendingUp } from 'lucide-react';
export default function ProgressChart({habits}){
  const days = Array.from({length: 7}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const data = days.map(date => {
    const doneCount = habits.filter(h => h.records.some(r => r.date === date && r.done)).length;
    // Avoid division by zero
    const percent = habits.length > 0 
      ? Math.round((doneCount / habits.length) * 100) 
      : 0;
    return {
      date: date.slice(5),
      percent,
    };
  });

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-amber-600" />
        <h3 className="text-lg font-medium text-stone-900">Weekly Progress</h3>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#78716c', fontFamily: 'Inter' }}
            />
            <YAxis 
              unit="%" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 13, fill: '#78716c', fontFamily: 'Inter' }}
            />
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Completion']}
              labelStyle={{ color: '#1c1917', fontFamily: 'Inter' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #d6d3d1', 
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Inter'
              }}
            />
            <Bar 
              dataKey="percent" 
              fill="#d97706"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}