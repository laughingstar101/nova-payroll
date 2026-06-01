import { useNavigate } from "react-router-dom";
import profileImg from '../assets/profile-empty.png';
import logoImg from '../assets/logo.png';
import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabase/supabase";

export default function Attendance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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
    });
    const [hasCheckedIn, setHasCheckedIn] = useState(false);
    const [hasCheckedOut, setHasCheckedOut] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    // const [scanning, setScanning] = useState(false);
    const scannerRef = useRef(null);
    const [showScanner, setShowScanner] = useState(false);
    const scannerContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("User not found. Redirecting..");
                navigate("/");
                return;
            }
            try {
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
                alert("Error fetching data from database.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear();
                scannerRef.current = null;
            }
        }
    }, [navigate]);

    const stopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
        setShowScanner(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (scannerContainerRef.current && !scannerContainerRef.current.contains(event.target)) {
                stopScan();
            }
        };
        if (showScanner) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showScanner]);

    const handleCheckIn = async () => {
        setActionLoading(true);
        try {
            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const { data, error } = await supabase
                .from("Attendance")
                .insert({
                    employee_id: employee.id,
                    check_in: now.toISOString(),
                    date: today,
                    status_hours: 'PENDING'
                })
                .select()
                .single();
            if (error) throw error;
            setAttendance(data);
            setHasCheckedIn(true);
            alert("Checked in successfully.");
        } catch (error) {
            console.log("Full error object:", error);
            alert("Failed to check in. Please try again later.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCheckOut = async () => {
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
            const newStatus = durationHours >= 9 ? 'NORMAL' : 'INSUFFICIENT HOURS';

            const { error } = await supabase
                .from("Attendance")
                .update({
                    check_out: now.toISOString(),
                    work_duration: intervalLiteral,
                    status_hours: newStatus
                })
                .eq('id', attendance.id);
            if (error) throw error;
            setAttendance(prev => ({
                ...prev,
                check_out: now.toISOString(),
                work_duration: intervalLiteral,
                status_hours: newStatus
            }));
            setHasCheckedOut(true);
            alert("Checked out successfully.");
        } catch (error) {
            console.error(error);
            alert("Failed to check out. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    // QR scan handler
    const startScan = () => {
        if (scannerRef.current) {
            scannerRef.current.clear();
            scannerRef.current = null;
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '-';
        return new Date(isoString).toLocaleTimeString('en-GB', {
            timeZone: 'Asia/Kuala_Lumpur',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

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
                <a onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-white text-xl cursor-pointer justify-self-start hover:underline pl-4 mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="m368-417 202 202-90 89-354-354 354-354 90 89-202 202h466v126H368Z" />
                    </svg>
                    back
                </a>
                <img src={logoImg} className="h-15 justify-self-center md:visible invisible" alt="logo" />
                <img onClick={() => navigate("/profile")} src={profileImg} className="h-15 hover:cursor-pointer justify-self-end" alt="profile" />
            </div>
            <div className="container bg-primary-colour mx-auto flex flex-col items-center px-12 py-8 rounded-md shadow-xl mt-6">
                <section className="flex flex-col items-center gap-4 w-full">
                    <p className="text-white text-3xl text-center font-bold">
                        Attendance Records for {employee.employee_name}
                    </p>
                    <div className="grid grid-cols-[1fr_auto_1fr] gap-4 w-full">
                        <span className="flex gap-2 items-center text-white justify-self-start"></span>
                        <p className="text-white text-2xl text-center">{todayDate}</p>
                        <span className="flex gap-2 items-center text-white justify-self-end"></span>
                    </div>
                    {!isWeekday && (
                        <section className="flex flex-col gap-2">
                            <p className="text-white text-2xl text-center">No attendance for {todayDate}</p>
                            <img alt="no work" src="https://media.makeameme.org/created/yay-no-work-cctoqg.jpg" />
                        </section>
                    )}
                    {isWeekday && (
                        <section className="flex flex-col items-center gap-2">
                            <p className="text-white text-2xl text-center">Attendance for {todayDate}</p>
                            <div className="relative">
                                {!hasCheckedIn && !hasCheckedOut && (
                                    <>
                                        <button onClick={handleCheckIn} className="bg-green-400 text-3xl p-2 cursor-pointer hover:scale-105 transition-all">
                                            Check In
                                        </button>
                                        <button onClick={startScan} className="bg-blue-500 text-white text-xl p-2 rounded-lg hover:cursor-pointer hover:scale-110 transition-all">
                                            Scan QR
                                        </button>
                                    </>
                                )}
                                {hasCheckedIn && !hasCheckedOut && (
                                    <>
                                        <button onClick={handleCheckOut} className="bg-red-400 text-3xl p-2 cursor-pointer hover:scale-105 transition-all">
                                            Check Out
                                        </button>
                                        <button onClick={startScan} className="bg-blue-500 text-white text-xl p-2 rounded-lg">
                                            Scan QR
                                        </button>
                                    </>
                                )}
                                {showScanner && (
                                    <div className="absolute z-50 bg-white p-4 rounded-lg shadow-xl" style={{ top: 'auto', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px' }} ref={scannerContainerRef}>
                                        <div id="qr-reader" style={{ width: '250px' }}></div>
                                        <button onClick={stopScan} className="mt-2 bg-red-500 text-white px-3 py-1 rounded w-full">Cancel</button>
                                    </div>
                                )}
                            </div>
                            {hasCheckedIn && hasCheckedOut && (
                                <div className="text-white text-center space-y-1">
                                    <p>Checked in: {formatTime(attendance.check_in)}</p>
                                    <p>Checked out: {formatTime(attendance.check_out)}</p>
                                    <p>Work duration: {attendance.work_duration}</p>
                                    <p>Status: {attendance.status}</p>
                                </div>
                            )}
                            {actionLoading && <p className="text-white">Processing...</p>}
                        </section>
                    )}
                </section>
            </div>
        </div>
    );
}