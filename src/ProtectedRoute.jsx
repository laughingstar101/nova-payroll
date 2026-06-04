import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase/supabase";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }}) => {
            setSession(session);
        });
    }, []);

    return session ? children : <Navigate to="/" />
}