import { supabase } from "../utils/supabase/supabase";
import profileImg from '../assets/profile-empty.png'
import logoImg from '../assets/logo.png'
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Leave() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [leaveData, setLeaveData] = useState({
        leave_type: 'Annual Leave',
        details: ''
    });
    const [employeeList, setEmployeeList] = useState([]);

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
                    .select("id, employee_name, type, employee_company")
                    .eq("employee_email", user.email)
                    .single();

                if (employeeError) throw employeeError;
                setEmployee(employeeData);

                // fetch all employees for hr display
                const { data: employeeListData, error: employeeListError } = await supabase
                    .from("Employee")
                    .select("id, employee_name, employee_email, type")
                    .eq("employee_company", employeeData.employee_company)
                    .neq("type", 'HR');

                if (employeeListError) throw employeeListError;
                setEmployeeList(employeeListData);

            } catch (error) {
                console.error("Error fetching data:", error);
                setEmployee(null);
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

    const handleLeaveSubmit = async () => {
        const { data, error } = await supabase
            .from("Leave")
            .insert({
                employee_id: employee.id,
                leave_type: leaveData.leave_type,
                details: leaveData.details,
                status: "UNAPPROVED"
            });
        if (error) {
            console.error("Error adding to table", error);
            alert("Could not add leave application. Please try again later.");
        };
        alert("Leave application submitted. Please wait for approval by HR.");
        console.log(data);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLeaveData(prev => ({ ...prev, [name]: value}));
        console.log(leaveData);
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
                <img src={logoImg} className="h-15 justify-self-center md:visible invisible" height='30'></img>
                <img onClick={() => navigate("/profile")} src={profileImg} className="h-15 hover:cursor-pointer justify-self-end"></img>
            </div>
            <p className='text-5xl text-white font-hero! text-center mt-8'>Leave Application</p>
            <div className="container bg-primary-colour mx-auto flex flex-col items-center px-12 py-8 rounded-md shadow-xl mt-6">
                <p className="text-white text-2xl text-center">Hello, {employee.employee_name} !</p>
                {employee && employee.type !== "HR" && (
                    <div className="w-full">
                        <form className="mx-auto w-fit flex flex-col gap-4" onSubmit={handleLeaveSubmit}>
                            <div className="flex gap-2 mt-8 md:flex-row flex-col md:items-center justify-center">
                                <p className="text-white text-lg">Leave type</p>
                                <select name="leave_type" className="bg-gray-100 px-2 py-1" onChange={handleInputChange}>
                                    <option value="Annual Leave">Annual Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Rest Day">Rest Day</option>
                                    <option value="Public Holida Leavey">Public Holiday Leave</option>
                                    <option value="Maternity Leave">Maternity Leave</option>
                                    <option value="Paternity Leave">Paternity Leave</option>
                                    <option value="Hospitalization Leave">Hospitalization Leave</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-white text-lg">Details</p>
                                <textarea onChange={handleInputChange} name="details" className="bg-white w-full px-2 resize-y h-24" placeholder="Your text here"></textarea>
                            </div>
                            <button type="submit" className="mt-4 uppercase bg-complementary-colour text-3xl w-full pt-2! pb-2! cursor-pointer hover:scale-105 transition-all">Submit</button>
                        </form>
                    </div>
                )}
                {employee && employee.type == 'HR' && (
                    <div className="w-full">

                    </div>
                )}
                {employee == null || !employee && (
                    <p>Employee doesn't exist</p>
                )}
            </div>
        </div>
    )
}