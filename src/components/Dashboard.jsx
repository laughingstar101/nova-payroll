import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase/supabase";
import TopBar from "./TopBar";

export default function Dashboard() {
    const [company, setCompany] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate("/");
                return;
            }

            try {
                // 1. Fetch employee using the logged‑in user's email
                const { data: employeeData, error: employeeError } = await supabase
                    .from("Employee")
                    .select("employee_name, employee_email, type, employee_company")
                    .eq("employee_email", user.email)
                    .single();

                if (employeeError) throw employeeError;
                setEmployee(employeeData);

                // 2. Fetch the company using the employee_company foreign key
                if (employeeData.employee_company) {
                    const { data: companyData, error: companyError } = await supabase
                        .from("Company")
                        .select("company_name, company_email")
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
                // Do NOT redirect – just show a friendly message
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-w-screen h-full flex justify-center items-center">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div>
            <TopBar />
            <a
                onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/");
                }}
                className="flex items-center gap-2 text-white text-xl cursor-pointer text-center hover:underline pl-4 mt-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                    <path d="m368-417 202 202-90 89-354-354 354-354 90 89-202 202h466v126H368Z" />
                </svg>
                back to register
            </a>
            <h1>Hello world</h1>
            {employee ? (
                <>
                    <p className="text-white">Employee: {employee.employee_name}</p>
                    <p className="text-white">Type: {employee.type}</p>
                </>
            ) : (
                <p className="text-yellow-300">Employee data not found.</p>
            )}
            {company ? (
                <p className="text-white">Company: {company.company_name}</p>
            ) : (
                <p className="text-yellow-300">Company data not found.</p>
            )}
        </div>
    );
}