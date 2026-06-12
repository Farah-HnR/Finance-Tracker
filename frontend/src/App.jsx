import { Routes, Route, Navigate } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("access_token");

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<div className="p-8 text-xl">Login page — coming soon</div>} />
      <Route path="/" element={<PrivateRoute><div className="p-8 text-xl">Dashboard — coming soon</div></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
