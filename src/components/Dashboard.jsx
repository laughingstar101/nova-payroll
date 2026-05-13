import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase/supabase";
import TopBar from "./TopBar";

export default function Dashboard() {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompany = async () => {
            const { data: { user }} = await supabase.auth.getUser();
            // if user dont exist
            if (!user) { 
                // go back to register
                navigate("/");
                return;
            }
            const { data, error } = await supabase
                .from("Company")
                .select("company_name, company_email, company_id")
                .eq("company_id", user.id)
                .single();
            if (error) {
                console.error("Error fetching company: ", error);
                navigate("/");
            } else {
                setCompany(data);
                console.log(data)
            }
            setLoading(false);
        };
        fetchCompany();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-w-screen h-full flex justify-center items-center">
                <div className="loader"></div>
            </div>
        )
    }

    return (
        <div>
            <TopBar/>
            <a onClick={async () => {
                await supabase.auth.signOut();
                navigate("/");
            }} className="flex items-center gap-2 text-white text-xl cursor-pointer text-center hover:underline pl-4 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m368-417 202 202-90 89-354-354 354-354 90 89-202 202h466v126H368Z"/></svg>
                back to register
            </a>
            <h1>Hello world</h1>
            <p className="text-white">{company.company_name}</p>
        </div>
    );
}