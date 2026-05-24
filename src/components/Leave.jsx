import { supabase } from "../utils/supabase/supabase";
import profileImg from '../assets/profile-empty.png'
import logoImg from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Leave() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("User not found. Redirecting..");
                navigate("/");
                return;
            }

            try {
                // 1. Fetch employee using the logged‑in user's email
                const { data: employeeData, error: employeeError } = await supabase
                    .from("Employee")
                    .select("employee_name, type, employee_company")
                    .eq("employee_email", user.email)
                    .single();

                if (employeeError) throw employeeError;
                setEmployee(employeeData);

                // 2. Fetch the company using the employee_company foreign key
                if (employeeData.employee_company) {
                    const { data: companyData, error: companyError } = await supabase
                        .from("Company")
                        .select("id, company_name, company_email")
                        .eq("id", employeeData.employee_company)
                        .single();

                    if (companyError) throw companyError;
                    setCompany(companyData);
                } else {
                    console.warn("Employee has no associated company");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setEmployee(null);
                setCompany(null);
                alert("Error fetching data from database.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
            <div className='bg-primary-colour w-full grid grid-cols-3 py-4 px-4'>
                <a onClick={async () => { navigate("/dashboard"); }}
                    className="flex items-center gap-2 text-white text-xl cursor-pointer text-center justify-self-start hover:underline pl-4 mt-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="m368-417 202 202-90 89-354-354 354-354 90 89-202 202h466v126H368Z" />
                    </svg>
                    back
                </a>
                <img src={logoImg} className="h-15 justify-self-center" height='30'></img>
                <img onClick={() => navigate("/profile")} src={profileImg} className="h-15 hover:cursor-pointer justify-self-end"></img>
            </div>
            <p className='text-5xl mb-12 text-white font-hero! text-center'>Leave Application</p>
            <div className="container bg-primary-colour mx-auto flex flex-col items-center mt-12 px-12 py-8 rounded-md shadow-xl">
                {employee == null || !employee && (
                    <p>Employee doesn't exist</p>
                )}
            </div>
        </div>
    )
}