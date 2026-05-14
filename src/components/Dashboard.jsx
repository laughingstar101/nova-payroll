import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../utils/supabase/supabase";
import TopBar from "./TopBar";

export default function Dashboard() {
    const [company, setCompany] = useState(null);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amountToAddEmployee, setAmountToAddEmployee] = useState(0);
    const [employeeList, setEmployeeList] = useState([]);
    const [nextId, setNextId] = useState(1);

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

    const handleAmountChange = (e) => {
        const value = parseInt(e.target.value, 10) || 0;
        setAmountToAddEmployee(value);
    }

    const addEmployee = () => {
        const count = amountToAddEmployee;
        const newEmployees = [];
        for (let i = 0; i < amountToAddEmployee; i++) {
            newEmployees.push({
                id: nextId + i,
                name: '',
                email: '',
                role: ''
            });
        }
        setEmployeeList([...employeeList, ...newEmployees]);
        setNextId(nextId + count);
        setAmountToAddEmployee(0);
    }

    const handleEmployeeChange = (id, field, value) => {
        setEmployeeList(prevList => prevList.map(emp => emp.id === id ? { ...emp, [field]: value } : emp))
    }

    const deleteEmployee = (id) => {
        setEmployeeList(prevList => prevList.filter(emp => emp.id !== id));
    }

    const submitEmployees = async () => {
        const incomplete = employeeList.some(emp => !emp.name || !emp.email || !emp.role);
        if (incomplete) {
            alert("Please fill in all fields for each employee.");
            return;
        }
        // add supabase create
        const { error } = await supabase
            .from('Employee')
            .insert(employeeList.map(emp => ({
                employee_name: emp.name,
                employee_email: emp.email,
                role: emp.role,
                employee_company: company.id
            })));

        if (error) alert("Error submitting employees: ", error.message)
        else alert (`${employeeList.length} employees added.`);
    }

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
                        <p className="text-white text-3xl font-bold">Welcome back, HR</p>
                        <div className="w-full mt-4 flex md:flex-row flex-col md:gap-0 gap-2 justify-between">
                            <p className="text-white text-lg">Amount of employees: {employeeList.length}</p>
                            <div className="flex gap-4 md:flex-row flex-col">
                                <p className="text-white text-lg">Amount to add employees</p>
                                <div className="flex gap-2">
                                    <input 
                                        className="bg-white w-15 pl-4 rounded-md" 
                                        placeholder="0" 
                                        type="number"
                                        value={amountToAddEmployee}
                                        onChange={handleAmountChange}
                                    />
                                    <button className="cursor-pointer bg-complementary-colour rounded-sm px-2 hover:scale-110 hover:shadow-md shadow-black transition-all" onClick={addEmployee}>Add</button>
                                </div>
                            </div>
                        </div>
                        <table className="table-auto w-full mt-8 border-secondary-colour bg-complementary-colour2 p-4">
                            <thead>
                                <tr>
                                    <th className="text-white sm:text-xl text-md uppercase text-center py-2 bg-secondary-colour2">id</th>
                                    <th className="text-white sm:text-xl text-md uppercase text-center py-2 bg-secondary-colour2">name</th>
                                    <th className="text-white sm:text-xl text-md uppercase text-center py-2 bg-secondary-colour2">email</th>
                                    <th className="text-white sm:text-xl text-md uppercase text-center py-2 bg-secondary-colour2">role</th>
                                    <th className="text-white sm:text-xl text-md uppercase text-center py-2 bg-secondary-colour2">actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeList.map(emp => (
                                    <tr key={emp.id} className="border-b border-gray-500 border-r">
                                        <td>
                                            <div className="text-center">{emp.id}</div>
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="bg-gray-100 w-full px-2 py-1 border-r-2"
                                                placeholder=""
                                                value={emp.name}
                                                onChange={(e) => handleEmployeeChange(emp.id, 'name', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="email" 
                                                className="bg-gray-100 w-full px-2 py-1 border-r-2"
                                                placeholder=""
                                                value={emp.email}
                                                onChange={(e) => handleEmployeeChange(emp.id, 'email', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input 
                                                type="text" 
                                                className="bg-gray-100 w-full px-2 py-1"
                                                placeholder=""
                                                value={emp.role}
                                                onChange={(e) => handleEmployeeChange(emp.id, 'role', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button 
                                                className="bg-red-700 text-white px-2 py-1 hover:bg-red-800 w-full"
                                                onClick={() => deleteEmployee(emp.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {employeeList.length > 0 && (
                            <button
                                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:scale-105 hover:shadow-md shadow-black hover:cursor-pointer transition-all" 
                                onClick={submitEmployees}
                                >Save All Employees
                            </button>
                        )}
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