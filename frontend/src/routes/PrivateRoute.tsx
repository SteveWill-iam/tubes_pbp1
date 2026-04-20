import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {    
  const { token, admin } = useSelector((state: RootState) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && admin && !allowedRoles.includes(admin.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};
