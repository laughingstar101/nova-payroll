import { useNavigate } from "react-router-dom";
import profileImg from '../assets/profile-empty.png'
import logoImg from '../assets/logo.png'
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase/supabase";

export default function Attendance() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true); // CHANGE BACK TO TRUE
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState(null);
    const [todayDate] = useState(() => {
        const now = new Date();
        return now.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    });
    const [isWeekday] = useState(() => {
        const day = new Date().getDay();
        return day >= 1 && day <= 5;
    })
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

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

                const today = new Date().toISOString().split('T')[0];
                const { data: attendanceData, error: attendanceError } = await supabase
                    .from("Attendance")
                    .select('*')
                    .eq('employee_id', employeeData.id)
                    .eq('date', today)
                    .limit(1)
                    .maybeSingle();

                if (attendanceError) throw attendanceError;
                setAttendance(attendanceData || null);

                if (attendanceData?.check_in) setHasCheckedIn(true);
                if (attendanceData?.check_out) setHasCheckedOut(true);

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

    const handleCheckIn = async () => {
        setActionLoading(true);

        try {
            const { data:lateData, error:lateError } = await supabase 
                .from("Company")
                .select("work_start_time")
                .eq('id', employee.employee_company)
                .single();

            if (lateError) throw lateError;

            const workStartTime = lateData.work_start_time;
            const now = new Date();
            const checkInTimeStr = now.toLocaleTimeString('en-GB', { hour12: false });
            
            const isLate = checkInTimeStr > workStartTime;
            const onTimeStatus = isLate ? "LATE" : "ON TIME";

            const today = now.toISOString().split('T')[0];
            const { data , error } = await supabase
                .from("Attendance")
                .insert({
                    employee_id: employee.id,
                    check_in: now.toISOString(),
                    date: today,
                    status: 'PENDING',
                    status_on_time: onTimeStatus
                })
                .select()
                .single();
            
            if (error) throw error;
            setAttendance(data);
            setHasCheckedIn(true);
            alert(`Checked in successfully. You are ${isLate ? 'LATE' : 'ON TIME'}`);
        } catch (error) {
            console.error(error);
            alert("Failed to check in. Please try again later.");
        } finally {
            setActionLoading(false);
        }
    }

    const handleCheckOut = async () => {
        if (!attendance) return;
        setActionLoading(true);

        try {
            const now = new Date();
            const checkInTime = new Date(attendance.check_in);
            const durationMs = now - checkInTime;
            const totalSeconds = Math.floor(durationMs / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const intervalLiteral = `${hours} hours ${minutes} minutes ${seconds} seconds`;
            const durationHours = durationMs / (1000 * 60 * 60);
            const statusHours = durationHours >= 9 ? 'NORMAL' : 'INSUFFICIENT HOURS';

            const { error } = await supabase
                .from("Attendance")
                .update({
                    check_out: now.toISOString(),
                    work_duration: intervalLiteral,
                    status_hours: statusHours
                })
                .eq('id', attendance.id);
                
            if (error) throw error;
            
            setAttendance(prev => ({
                ...prev,
                check_out: now.toISOString(),
                work_duration: intervalLiteral,
                status_hours: statusHours
            }));
            setHasCheckedOut(true);
            alert("Checked out successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to check out. Please try again.");
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
                <div className="loader"></div>
            </div>
        );
    }

    const formatTime = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Kuala_Lumpur',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
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
            <div className="container bg-primary-colour mx-auto flex flex-col items-center px-12 py-8 rounded-md shadow-xl mt-6">
                <section className="flex flex-col items-center gap-4 w-full">
                    <p className="text-white text-3xl text-center font-bold">Attendance Records for {employee.employee_name}</p>
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full">
                        <span className= "flex gap-2 items-center text-white justify-self-start hover:cursor-pointer hover:underline"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>Last</span>
                        <p className="text-white text-2xl text-center">{todayDate}</p>
                        <span className="flex gap-2 items-center text-white justify-self-end hover:cursor-pointer hover:underline">Next<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/></svg></span>
                    </div>
                    {!isWeekday && (
                        <section className="flex flex-col gap-2">
                            <p className="text-white text-2xl text-center">No attendance for {todayDate}</p>
                            <img alt="no work image" src="https://media.makeameme.org/created/yay-no-work-cctoqg.jpg"/>
                        </section>
                    )}
                    {isWeekday && (
                        <section>
                            <p className="text-white text-2xl text-center">Attendance for {todayDate}</p>
                            {!hasCheckedIn && !hasCheckedOut && (
                                <button onClick={handleCheckIn} className="bg-green-400 text-3xl p-2 cursor-pointer hover:scale-105 transition-all">Check In</button>
                            )}
                            {hasCheckedIn && !hasCheckedOut && (
                                <button onClick={handleCheckOut} className="bg-red-400 text-3xl p-2 cursor-pointer hover:scale-105 transition-all">Check Out</button>
                            )}
                            {hasCheckedIn && hasCheckedOut && (
                                <section>
                                    <p className="text-white text-md">Checked in on: {formatTime(attendance.check_in)}</p>
                                    <p className="text-white text-md">Checked out on: {formatTime(attendance.check_out)}</p>
                                    <p className="text-white text-md">Work duration: {attendance.work_duration}</p>
                                    <p className="text-white text-md">Status: {attendance.status}</p>
                                </section>
                            )}
                            {actionLoading && (
                                <p className="text-white">Processing...</p>
                            )}
                        </section>
                    )}
                </section>
            </div>
        </div>
    )
}