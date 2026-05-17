import { useEffect, useState } from 'react'
import profileImg from '../assets/profile-empty.png'
import TopBar from './TopBar'
import { supabase } from '../utils/supabase/supabase'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("User not found. Redirecting..");
                navigate("/");
                return;
            }
            try {
                const { data, error } = await supabase
                    .from('Employee')
                    .select('employee_name, employee_email')
                    .eq('employee_email', user.email)
                    .single();

                if (error) throw error;
                setEmployee(data);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setEmployee(null);
                alert("Error fetching data from database. Please try again later.")
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate])

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    }

    const handleGoToResetPassword = () => {
        navigate('/update-password')
    }

    if (loading) {
        return (
            <div className='min-w-screen h-full flex justify-center items-center bg-linear-to-br from-secondary-colour3 to-secondary-colour2'>
                <div className="loader"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
            <TopBar/>
            <div className='flex flex-col items-center m-auto w-full'>
                <div className="container m-auto flex flex-col gap-4 items-center py-8 rounded-xl bg-primary-colour shadow-xl">
                    <p className='text-6xl mb-12 text-white font-hero!'>Profile</p>
                    <img className='w-40' src={profileImg}></img>
                    <p className='text-xl text-white'>Name: {employee.employee_name}</p>
                    <p className='text-white text-xl'>Email: {employee.employee_email}</p>
                    <button className='text-black text-lg bg-complementary-colour2 px-4 py-2 mt-4 rounded-lg hover:scale-110 transition-transform hover:shadow-md hover:shadow-black hover:cursor-pointer' onClick={handleGoToResetPassword}>Reset Password</button>
                    <p className='text-white mt-8 hover:underline hover:cursor-pointer' onClick={handleGoToDashboard}>Back to dashboard</p>
                </div>
            </div>
        </div>
    )
}