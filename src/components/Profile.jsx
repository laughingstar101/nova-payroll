import { useEffect, useState } from 'react'
import profileImg from '../assets/profile-empty.png'
import logoImg from '../assets/logo.png'
import { supabase } from '../utils/supabase/supabase'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

export default function Profile() {
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updateName, setUpdateName] = useState(false);
    const [newName, setNewName] = useState('');

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
                    .select('employee_name, employee_email, qr_token')
                    .eq('employee_email', user.email)
                    .single();

                if (error) throw error;
                setEmployee(data);
                setNewName(data.employee_name);
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

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    }

    async function handleResetName(e) {
        e.preventDefault();
        if (!newName.trim()) {
            alert("Name cannot be empty.")
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Session expired. Please log in again.");
            navigate("/");
            return;
        }
        const { data, error } = await supabase
            .from('Employee')
            .update({ employee_name: newName})
            .ilike('employee_email', user.email)
            .select();

        if (error) {
            console.error("Update error:", error);
            alert("Update failed: " + error.message);
            return;
        }

        if (!data || data.length === 0) {
            console.warn("No rows updated. Email may not match any record.");
            alert("No matching employee record found. Please contact support.");
            return;
        }

        console.log("Updated row:", data[0]);
        setEmployee(prev => ({ ...prev, employee_name: newName }));
        setUpdateName(false);
        alert("Name updated successfully.");
        }

    if (loading) {
        return (
            <div className='min-w-screen h-full flex justify-center items-center bg-linear-to-br from-secondary-colour3 to-secondary-colour2'>
                <div className="loader"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
            <div className='bg-primary-colour w-full grid grid-cols-3 py-4 px-4'>
                <a onClick={async () => { navigate(-1); }}
                    className="flex items-center gap-2 text-white text-xl cursor-pointer text-center justify-self-start hover:underline pl-4 mt-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                        <path d="m368-417 202 202-90 89-354-354 354-354 90 89-202 202h466v126H368Z" />
                    </svg>
                    back
                </a>
                <img src={logoImg} className="h-15 justify-self-center" height='30'></img>
            </div>
            <p className='text-5xl text-white font-hero! text-center mt-8'>Profile</p>
            <div className='flex flex-col items-center w-full mt-4'>
                <div className="container m-auto flex flex-col gap-4 items-center py-8 rounded-xl bg-primary-colour shadow-xl">
                    <div className='flex flex-col items-center gap-4'>
                        <div className='flex items-center gap-4'>
                            <img className='w-40' src={profileImg}></img>
                            <p className='text-white w-16 hover:cursor-pointer hover:underline'><span><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg></span>upload file</p>
                        </div>
                        <form onSubmit={handleResetName} className='w-full' id='profile-form'>
                            <p className='text-xl text-white text-left w-full'>Name: {employee.employee_name}</p>
                            {updateName && (
                                <div className='flex flex-col gap-4'>
                                    <input placeholder='New Name' value={newName} onChange={handleNameChange} className='bg-amber-50 w-full h-12! pl-2.5! mt-4'/>
                                    <button 
                                        className='text-black text-lg bg-complementary-colour2 px-4 py-2 rounded-lg hover:scale-105 transition-transform hover:shadow-md hover:shadow-black hover:cursor-pointer'
                                        type='submit'
                                        form='profile-form'
                                    >Submit</button>
                                </div>
                            )}
                        </form>
                        <p className='text-white text-xl text-left w-full'>Email: {employee.employee_email}</p>
                        <div className='flex gap-4'>
                            <button className='text-black text-lg bg-complementary-colour2 px-4 py-2 mt-4 rounded-lg hover:scale-105 transition-transform hover:shadow-md hover:shadow-black hover:cursor-pointer' onClick={() => navigate('/update-password')}>Reset Password</button>
                            <button 
                                className='text-black text-lg bg-complementary-colour2 px-4 py-2 mt-4 rounded-lg hover:scale-105 transition-transform hover:shadow-md hover:shadow-black hover:cursor-pointer'
                                onClick={() => {
                                    setUpdateName(!updateName);
                                }}
                                type={updateName ? 'submit' : 'button'}
                            >{updateName ? "Back" : "Update Name"}</button>
                        </div>
                        {employee?.qr_token && (
                            <div className="text-center flex flex-col items-center gap-4">
                                <p className="text-white">Your attendance QR code:</p>
                                <QRCodeSVG className='border-8 border-white' value={employee.qr_token} size={200} />
                            </div>
                        )}
                        <p 
                            className='hover:scale-110 hover:cursor-pointer transition-all bg-complementary-colour2 px-2 py-1' 
                                onClick={async () => { 
                                    if (confirm("Are you sure you want to log out?")) {
                                        await supabase.auth.signOut(); 
                                        navigate("/") 
                                    } else return
                                }}
                        >Log out</p>
                    </div>
                </div>
            </div>
        </div>
    )
}