import { Outlet, Link, useNavigate } from 'react-router-dom'
import PrimaryPanel from '../components/PrimaryPanel';
import SecondaryPanel from '../components/SecondaryPanel';

const InnerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex relative overflow-hidden">
      {/* Background effects */}
      {/* Sidebar */}
      <PrimaryPanel handleLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-grow p-8 bg-gray-900/80 backdrop-blur-sm text-white relative z-10">
        <Outlet />
      </main>

      {/* Secondary panel */}
      <SecondaryPanel />
    </div>
  )
}

export default InnerLayout