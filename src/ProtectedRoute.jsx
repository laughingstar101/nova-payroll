import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }}) => {
            setSession(session);
            setLoading(false);
        });
    }, []);

    if (loading) return <div>Loading..</div>

    return session ? children : <Navigate to="/" />
}