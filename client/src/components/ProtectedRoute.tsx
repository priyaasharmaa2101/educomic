import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin size-8 border-4 border-purple-500 border-t-transparent rounded-full" />
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    return <>{children}</>;
};

export default ProtectedRoute;