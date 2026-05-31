import Hero from "./components/Hero";
// import { useEffect } from "react";
// import { supabase } from "./utils/supabase/supabase";
// import { useNavigate } from "react-router-dom";

export default function App() {
    // const navigate = useNavigate();

    // useEffect(() => {
    //     const { data: { subscription }} = supabase.auth.onAuthStateChange((event, session) => {
    //         if (session?.user) {
    //             navigate('/dashboard')
    //         } 
    //     });
    //     return () => subscription.unsubscribe();
    // }, [navigate])

    return <Hero/>
}