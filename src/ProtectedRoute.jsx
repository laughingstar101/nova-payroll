import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="loader"></div>;
    }

    return session ? children : <Navigate to="/" replace />;
}