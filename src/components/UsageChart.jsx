import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import DataService from '../services/DataService';

export default function UsageChart({ data }) {
  const [activeTab, setActiveTab] = useState('users');
  const [timeframe, setTimeframe] = useState('daily');
  const [chartType, setChartType] = useState('line');
  
  // Prepare data with proper date formatting
  const formatChartData = (rawData) => {
    if (!rawData) return [];
    
    return rawData.map(item => {
      // For daily data, format the date nicely
      const displayDate = item.date ? 
        new Date(item.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 
        item.month || '';
        
      return {
        name: displayDate,
        users: item.users,
        sessions: item.sessions,
        duration: item.duration
      };
    });
  };
  
  // Handle timeframe changes and fetch corresponding data
  const handleTimeframeChange = async (newTimeframe) => {
    setTimeframe(newTimeframe);
    // In a real app, we'd fetch new data here
  };
  
  const chartData = formatChartData(data);
  
  // Get chart color based on metric
  const getChartColor = (metric) => {
    switch(metric) {
      case 'users': return '#3B82F6'; // blue
      case 'sessions': return '#10B981'; // green
      case 'duration': return '#8B5CF6'; // purple
      default: return '#3B82F6';
    }
  };
  
  // Render appropriate chart based on type
  const renderChart = () => {
    if (!chartData.length) {
      return (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }
    
    const ChartComponent = chartType === 'line' ? LineChart : 
                          chartType === 'bar' ? BarChart : 
                          AreaChart;
    
    const DataComponent = chartType === 'line' ? Line :
                         chartType === 'bar' ? Bar :
                         Area;
    
    return (
      <ResponsiveContainer width="100%" height={350}>
        <ChartComponent data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => new Intl.NumberFormat().format(value)}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <DataComponent
            type="monotone"
            dataKey={activeTab}
            name={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            stroke={getChartColor(activeTab)}
            fill={getChartColor(activeTab)}
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };
  
  return (
    <div>
      {/* Chart Controls */}
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <div className="flex space-x-1 mb-3 sm:mb-0">
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'users' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'sessions' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
            onClick={() => setActiveTab('sessions')}
          >
            Sessions
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'duration' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
            onClick={() => setActiveTab('duration')}
          >
            Duration
          </button>
        </div>
        
        <div className="flex space-x-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-l-lg ${chartType === 'line' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium ${chartType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
            <button 
              className={`px-3 py-1 text-sm font-medium rounded-r-lg ${chartType === 'area' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
              onClick={() => setChartType('area')}
            >
              Area
            </button>
          </div>
          
          <select 
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500"
            value={timeframe}
            onChange={(e) => handleTimeframeChange(e.target.value)}
          >
            <option value="daily">Last 7 Days</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      
      {/* Chart Visualization */}
      {data ? renderChart() : (
        <div className="animate-pulse h-80">
          <div className="h-full bg-gray-200 rounded"></div>
        </div>
      )}
    </div>
  );
}
