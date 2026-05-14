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
                alert("User not found. Redirecting..");
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
                alert("Error fetching data from database.");
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

    const employeeCount = 0;

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-secondary-colour to-secondary-colour2">
            <TopBar />
            <div className="absolute md:top-6 top-22">
                <a onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
                    className="flex items-center gap-2 text-white text-xl cursor-pointer text-center hover:underline pl-4 mt-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="m368-417 202 202-90 89-354-354 354-354 90 89-202 202h466v126H368Z" />
                    </svg>
                    back to register
                </a>
            </div>
            <div className="container bg-primary-colour mx-auto flex flex-col items-center mt-12 px-12 py-8 rounded-md shadow-xl">
                {employee && employee.type === 'HR' && (
                    <section className="w-full flex flex-col items-center">
                        <p className="text-white text-2xl">Welcome back, HR</p>
                        <div className="w-full mt-4">
                            <p className="text-white text-lg">Amount of employees: {}</p>
                        </div>
                        <div className="grid grid-cols-4 w-full mt-8 border-secondary-colour gap-2 bg-white p-4 rounded-md">
                            <div className="text-white sm:text-xl text-md uppercase text-center py-2 rounded-md border-2 border-secondary-colour2 bg-cyan-700">Id</div>
                            <div className="text-white sm:text-xl text-md uppercase text-center py-2 rounded-md border-2 border-secondary-colour2 bg-cyan-700">Name</div>
                            <div className="text-white sm:text-xl text-md uppercase text-center py-2 rounded-md border-2 border-secondary-colour2 bg-cyan-700">Email</div>
                            <div className="text-white sm:text-xl text-md uppercase text-center py-2 rounded-md border-2 border-secondary-colour2 bg-cyan-700">Type</div>
                            <div className="bg-red-600">2</div>
                            <div className="bg-blue-600">3</div>
                            <div className="bg-yellow-400">4</div>
                            <div className="bg-white">1</div>
                            <div className="bg-blue-600">3</div>
                            <div className="bg-yellow-400">4</div>
                            <div className="bg-white">1</div>
                            <div className="bg-red-600">2</div>
                            <div className="bg-yellow-400">4</div>
                            <div className="bg-white">1</div>
                            <div className="bg-red-600">2</div>
                            <div className="bg-blue-600">3</div>
                            <div className="bg-white">1</div>
                            <div className="bg-red-600">2</div>
                            <div className="bg-blue-600">3</div>
                            <div className="bg-yellow-400">4</div>
                        </div>
                    </section>
                )} 
                {employee && employee.type !== 'HR' && (
                    <p className="text-white text-2xl">Welcome, {employee.employee_name}</p>
                )}
                {!employee && (
                    <p>Employee data loading...</p>
                )}
            </div>
        </div>
    );
}