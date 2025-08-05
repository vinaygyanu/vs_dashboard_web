import React from 'react';

export default function SummaryCards({ data }) {
  // Define card configurations - icons and colors remain constant
  const cardConfig = [
    { 
      key: 'totalUsers',
      label: 'Total Users', 
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300/20'
    },
    { 
      key: 'activeUsers',
      label: 'Active Users', 
      icon: (
        <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'green',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300/20'
    },
    { 
      key: 'loginsToday',
      label: 'Logins Today', 
      icon: (
        <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      color: 'purple',
      bgGradient: 'from-purple-50 to-fuchsia-50',
      borderColor: 'border-purple-300/20'
    },
    { 
      key: 'anomalies',
      label: 'Anomalies', 
      icon: (
        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'red',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-300/20'
    },
  ];
  
  // Format the last update time if available
  const formatLastUpdated = () => {
    if (!data || !data.lastUpdated) return 'Not available';
    
    // Create a relative time formatter (e.g., "5 minutes ago")
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const now = new Date();
    const lastUpdated = new Date(data.lastUpdated);
    const diffInMinutes = Math.round((lastUpdated - now) / (1000 * 60));
    
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(diffInMinutes, 'minute');
    } else {
      const diffInHours = Math.round(diffInMinutes / 60);
      return rtf.format(diffInHours, 'hour');
    }
  };
  // If data is not available yet, show placeholder loading cards
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {cardConfig.map((config, idx) => (
          <div 
            key={idx}
            className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-200 flex flex-col justify-between animate-pulse`}
          >
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {cardConfig.map((config, idx) => {
        const value = data[config.key] !== undefined ? data[config.key] : 0;
        
        // Format large numbers with commas
        const formattedValue = typeof value === 'number' ? 
          new Intl.NumberFormat().format(value) : 
          value;
            
        return (
          <div 
            key={idx} 
            className={`bg-gradient-to-br ${config.bgGradient} rounded-xl shadow-minimal p-6 ${config.borderColor} border-l-4 flex flex-col justify-between hover:shadow-minimal-lg transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">{config.label}</h3>
                <p className={`text-4xl font-bold mt-2 text-${config.color}-600`}>
                  {formattedValue}
                </p>
              </div>
              <div className={`rounded-full bg-${config.color}-100/50 p-3 backdrop-blur-sm`}>
                {config.icon}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100/50">
              <p className="text-xs text-gray-500">
                Last updated {formatLastUpdated()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
