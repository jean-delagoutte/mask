// ProtectedRoute.js
import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function PrivateRoute({ children}) {
  const [userContext,] = useContext(UserContext);
  const isAuthenticated = userContext.token != null && !!userContext.details;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function UnAuthRoute({ children }) {
  const [userContext,] = useContext(UserContext);
  const isAuthenticated = userContext.token != null && !!userContext.details;
  return isAuthenticated ? <Navigate to="/profile" /> : children;
}

export {PrivateRoute, UnAuthRoute};
