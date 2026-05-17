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
                    .select('employee_name')
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

    if (loading) {
        return (
            <div className='min-w-screen h-full flex justify-center items-center'>
                <div className="loader"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
            <TopBar/>
            <div className="container m-auto flex flex-col gap-4 items-center py-8 rounded-xl bg-primary-colour shadow-xl">
                <img className='w-40' src={profileImg}></img>
                <p className='text-4xl text-white font-hero!'>Username</p>
            </div>
        </div>
    )
}