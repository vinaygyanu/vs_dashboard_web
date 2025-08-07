import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import SummaryCards from './components/SummaryCards';
import UserActivityTable from './components/UserActivityTable';
import UsageChart from './components/UsageChart';
import RealTimeActivityFeed from './components/RealTimeActivityFeed';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import DataService from './services/DataService';
import AuthService from './services/AuthService';
import './App.css'
import './styles/HeaderDropdown.css'
import UserList from './components/UserList';
import Signup from './components/Signup';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    summaryData: null,
    usageData: null,
    userActivity: null,
    anomalies: null,
    systemStatus: null,
  });
  const [activeTab, setActiveTab] = useState('overview');
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get current user data when component mounts
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  // Handle clicks outside the user menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);
  
  // Handle escape key to close the profile modal
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && showUserProfile) {
        setShowUserProfile(false);
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    // Auto-focus the close button when modal opens
    if (showUserProfile) {
      const closeButton = document.querySelector('.modal-close-btn');
      if (closeButton) {
        setTimeout(() => closeButton.focus(), 100);
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showUserProfile]);

  // Fetch all data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // You could fetch all at once with getAllData()
        // or fetch individually for more granular loading states
        const summaryData = await DataService.getSummaryData();
        const usageData = await DataService.getUsageData('daily');
        const userActivity = await DataService.getUserActivity();
        const anomalies = await DataService.getAnomalies();
        const systemStatus = await DataService.getSystemStatus();

        setDashboardData({
          summaryData,
          usageData,
          userActivity,
          anomalies,
          systemStatus
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Dark Header with gradient */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h1 className="text-2xl font-bold">Activity Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">{currentDate}</div>
            {currentUser && (
              <div className="relative flex items-center gap-4 user-menu-container">
                <div 
                  className="flex items-center bg-gray-800 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-gray-600"
                  onClick={() => setShowUserMenu(prev => !prev)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-medium shadow-sm">
                    {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="ml-2 text-sm font-medium text-blue-100">
                    Welcome, {currentUser?.displayName || currentUser?.username}
                  </span>
                  <svg 
                    className={`w-4 h-4 ml-2 text-gray-300 transform transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 user-dropdown z-10">
                    <div className="dropdown-header">
                      {currentUser?.role && (
                        <div className="dropdown-role">{currentUser.role}</div>
                      )}
                      <div className="dropdown-header-info">
                        <div className="dropdown-avatar">
                          {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="dropdown-name">{currentUser?.displayName || currentUser?.username}</div>
                        {currentUser?.email && <div className="dropdown-email">{currentUser.email}</div>}
                      </div>
                    </div>
                    <div className="dropdown-menu">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowUserProfile(prev => !prev);
                        }}
                        className="dropdown-menu-item"
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="dropdown-menu-item-text">View Profile</span>
                      </button>
                      
                      {currentUser?.company && (
                        <button className="dropdown-menu-item">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m4-4h1m-1 4h1" />
                          </svg>
                          <span className="dropdown-menu-item-text">{currentUser.company}</span>
                        </button>
                      )}
                      
                      <div className="dropdown-menu-divider"></div>
                      
                      <button
                        onClick={async () => {
                          await AuthService.logout();
                          window.location.href = '/login';
                        }}
                        className="dropdown-menu-item danger"
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="dropdown-menu-item-text">Logout</span>
                      </button>
                    </div>
                    <div className="dropdown-footer">
                      Last login: {new Date(currentUser?.lastLogin).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Enhanced with classy background */}
      <main className="flex-grow bg-gradient-to-br">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8 flex gap-4 border-b pb-2">
            <button className={`tab-btn${activeTab==='overview'?' active':''}`} onClick={()=>setActiveTab('overview')} style={activeTab==='overview'?{background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',fontWeight:700,boxShadow:'0 2px 8px #6366f122',borderRadius:8}:{background:'none',color:'#6366f1',fontWeight:600,borderRadius:8}}>
              Overview
            </button>
            <button className={`tab-btn${activeTab==='analytics'?' active':''}`} onClick={()=>setActiveTab('analytics')} style={activeTab==='analytics'?{background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',fontWeight:700,boxShadow:'0 2px 8px #6366f122',borderRadius:8}:{background:'none',color:'#6366f1',fontWeight:600,borderRadius:8}}>
              Analytics
            </button>
            <button className={`tab-btn${activeTab==='activity'?' active':''}`} onClick={()=>setActiveTab('activity')} style={activeTab==='activity'?{background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',fontWeight:700,boxShadow:'0 2px 8px #6366f122',borderRadius:8}:{background:'none',color:'#6366f1',fontWeight:600,borderRadius:8}}>
              Activity
            </button>
            <button className={`tab-btn${activeTab==='feed'?' active':''}`} onClick={()=>setActiveTab('feed')} style={activeTab==='feed'?{background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',fontWeight:700,boxShadow:'0 2px 8px #6366f122',borderRadius:8}:{background:'none',color:'#6366f1',fontWeight:600,borderRadius:8}}>
              Feed
            </button>
            <button className={`tab-btn${activeTab==='users'?' active':''}`} onClick={()=>setActiveTab('users')} style={activeTab==='users'?{background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',fontWeight:700,boxShadow:'0 2px 8px #6366f122',borderRadius:8}:{background:'none',color:'#6366f1',fontWeight:600,borderRadius:8}}>
              User List
            </button>
          </div>
          {/* Tab Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full opacity-30"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <span className="mt-4 text-sm font-medium text-neutral-600">Loading dashboard data...</span>
            </div>
          ) : (
            <>
              {showUserProfile && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-modal-overlay"
                  onClick={(e) => {
                    // Close when clicking outside the modal
                    if (e.target === e.currentTarget) {
                      setShowUserProfile(false);
                    }
                  }}
                >
                  <div 
                    className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-modal-appear" 
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="profile-modal-title"
                  >
                    <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600 text-white p-5 flex justify-between items-center modal-header">
                      <h3 className="text-xl font-medium flex items-center" id="profile-modal-title">
                        <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        User Profile
                      </h3>
                      <button 
                        onClick={() => setShowUserProfile(false)}
                        className="modal-close-btn focus:outline-none"
                        aria-label="Close profile modal"
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-6">
                      <UserProfile />
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-minimal shadow-minimal p-6 mb-6 card-dashboard">
                  <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-xl text-neutral-700">Dashboard Overview</h2>
                    <span className="text-xs text-neutral-400">
                      Last updated: {new Date(dashboardData.summaryData?.lastUpdated).toLocaleTimeString()}
                    </span>
                  </div>
                  <SummaryCards data={dashboardData.summaryData} />
                </div>
              )}
              {activeTab === 'analytics' && (
                <div className="bg-white rounded-minimal shadow-minimal p-6 mb-6 card-analytics">
                  <h2 className="text-xl text-neutral-700 mb-6 border-b pb-3">Usage Analytics</h2>
                  <UsageChart data={dashboardData.usageData} />
                </div>
              )}
              {activeTab === 'activity' && (
                <div className="bg-white rounded-minimal shadow-minimal p-6 mb-6 card-activity">
                  <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-xl text-neutral-700">User Activity</h2>
                    <div className="flex space-x-2">
                      {dashboardData.anomalies && dashboardData.anomalies.length > 0 && (
                        <span className="bg-error-light text-error-dark text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
                          <span className="h-1.5 w-1.5 bg-error rounded-full mr-1"></span>
                          {dashboardData.anomalies.length} Anomalies
                        </span>
                      )}
                    </div>
                  </div>
                  <UserActivityTable data={dashboardData.userActivity} />
                </div>
              )}
              {activeTab === 'feed' && (
                <div className="bg-white rounded-minimal shadow-minimal p-6 card-feed">
                  <RealTimeActivityFeed />
                </div>
              )}
              {activeTab === 'users' && (
                <div className="bg-white rounded-minimal shadow-minimal p-6 card-user-list">
                  <h2 className="text-xl text-neutral-700 mb-6 border-b pb-3">User List</h2>
                  <UserList />
                </div>
              )}
            {/* End tab content */}
            </>
          )}
        </div>
      </main>

      {/* Footer - Classy gradient */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-neutral-400 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          © {new Date().getFullYear()} User Activity Dashboard
        </div>
      </footer>
    </div>
  );
}

// Create router with React Router v7
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Navigate to="/login" />
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "*",
    element: <Navigate to="/login" />
  }
]);

// Wrap Dashboard component with routing in App
function App() {
  return <RouterProvider router={router} />;
}

export default App
