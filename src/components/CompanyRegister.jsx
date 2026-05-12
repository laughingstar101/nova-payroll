import TopBar from "./TopBar.jsx";
import styles from './CompanyRegister.module.css'
import { useState } from "react";
import { supabase } from '../utils/supabase/supabase.js'

export default function CompanyRegister() {
    const [companyFormData, setCompanyFormData] = useState({
        companyName: '',
        companyEmail: '',
        companyPassword: ''
    })
    const [passwordVisBtn, setVis] = useState(false) // true = visible, false = hidden
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyFormData(prev => ({ ...prev, [name]: value }));
    };

    async function handleSubmit(event) {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (companyFormData.companyName === '' || companyFormData.companyEmail === '' || companyFormData.companyPassword === '') {
            alert("Please fill in form");
            setIsSubmitting(false);
            return;
        }

        console.log('Company registration data:', companyFormData)
        const { error } = await supabase.auth.signUp({
            email: companyFormData.companyEmail,
            password: companyFormData.companyPassword,
            options: {
                data: {
                    companyName: companyFormData.companyName
                }
            }
        })
        
        if (error) {
            if (error.status === 429) {
                alert("Too many registration attempts. Please wait a few minutes before trying again.");
            } else {
                console.error('Signup error:', error.message)
            }
        }
        setIsSubmitting(false)
    }

    return (
        <div className={styles.signup}>
            <TopBar />
            <section className={styles.signupContainer}>
                {!isLogin ? (
                    <section>
                        <h1 className="text-5xl">Register Company!</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full!">
                            <input 
                                placeholder="Company Name"
                                name="companyName"
                                type="text" 
                                className="bg-amber-50 w-full h-12! pl-2.5! mt-12!"
                                value={companyFormData.companyName} 
                                onChange={handleInputChange}
                            />
                            <input 
                                placeholder="Company Email"
                                name="companyEmail"
                                type="email" 
                                className="bg-amber-50 w-full h-12! pl-2.5! mt-12!"
                                value={companyFormData.companyEmail} 
                                onChange={handleInputChange}
                            />
                            <span className="flex w-full mt-12! items-center bg-secondary-colour">
                                <input 
                                    placeholder="Password"
                                    name="companyPassword"
                                    type={passwordVisBtn ? "text" : "password"} 
                                    className="bg-amber-50 w-full h-12! pl-2.5!"
                                    value={companyFormData.companyPassword} 
                                    onChange={handleInputChange}
                                />
                                {passwordVisBtn ? (
                                    <svg
                                        className="w-15"
                                        onClick={() => setVis(!passwordVisBtn)} 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        height="40px" 
                                        width="40px"
                                        viewBox="0 -960 960 960"
                                        fill="#e3e3e3">
                                        <path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z"/>
                                    </svg>
                                ) : (
                                    <svg 
                                        className="w-15"
                                        onClick={() => setVis(!passwordVisBtn)} 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        height="40px" 
                                        viewBox="0 -960 960 960" 
                                        width="40px" 
                                        fill="#e3e3e3">
                                        <path d="m634-422-48.67-48.67q20.34-63-27-108-47.33-45-107.66-26.66L402-654q17-10 36.83-14.67 19.84-4.66 41.17-4.66 72.33 0 122.83 50.5T653.33-500q0 21.33-5 41.5T634-422Zm128.67 128-46-45.33Q762-373 796.17-414.17q34.16-41.16 52.5-85.83-50-107.67-147.84-170.5-97.83-62.83-214.16-62.83-37.67 0-76.34 6.66Q371.67-720 346-710l-51.33-52q37-16.33 87.66-27.17Q433-800 483.33-800q145.67 0 264 82.17Q865.67-635.67 920-500q-25 62.33-64.83 114.5-39.84 52.17-92.5 91.5ZM808-61.33 640-226.67q-35 13-76.17 19.84Q522.67-200 480-200q-147.67 0-266.33-82.17Q95-364.33 40-500q20.33-52.33 54.67-100.5 34.33-48.17 82-90.17L56-812l46.67-47.33 750 750-44.67 48ZM222.67-644q-34.34 26.67-65.34 66.33-31 39.67-46.66 77.67 50.66 107.67 150.16 170.5t224.5 62.83q28.67 0 56.34-3.5 27.66-3.5 45-9.83L532-335.33q-11 4.33-25 6.5-14 2.16-27 2.16-71.67 0-122.5-50.16Q306.67-427 306.67-500q0-13.67 2.16-27 2.17-13.33 6.5-25l-92.66-92Zm309.66 125.67Zm-127.66 63.66Z"/>
                                    </svg>
                                )}
                            </span>
                            <button type="submit" className="bg-complementary-colour text-3xl w-full pt-2! pb-2! cursor-pointer hover:scale-105 transition-all mt-12!">REGISTER</button>
                            <p onClick={() => setIsLogin(true)} className="text-white mt-12! hover:cursor-pointer hover:text-cyan-300">Have company? Login</p>
                        </form>
                    </section>
                ) : (
                    <section className='flex flex-col items-center w-full!'>
                        <h1 className="text-5xl">Login Company</h1>
                        <form onSubmit={handleSubmit} className='flex flex-col items-center justify-end w-full mt-12! gap-12'>
                            <input placeholder="Enter email" className="bg-amber-50 w-full h-12! pl-2.5!"></input>
                            <span className="flex w-full items-center bg-secondary-colour">
                                <input 
                                    placeholder="Password"
                                    type={passwordVisBtn ? "text" : "password"} 
                                    className="bg-amber-50 w-full h-12! pl-2.5!"
                                />
                                {passwordVisBtn ? (
                                    <svg 
                                        className="w-15"
                                        onClick={() => setVis(!passwordVisBtn)} 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        height="40px" 
                                        width="40px"
                                        viewBox="0 -960 960 960"
                                        fill="#e3e3e3">
                                        <path d="M607.5-372.5Q660-425 660-500t-52.5-127.5Q555-680 480-680t-127.5 52.5Q300-575 300-500t52.5 127.5Q405-320 480-320t127.5-52.5Zm-204-51Q372-455 372-500t31.5-76.5Q435-608 480-608t76.5 31.5Q588-545 588-500t-31.5 76.5Q525-392 480-392t-76.5-31.5ZM214-281.5Q94-363 40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200q-146 0-266-81.5ZM480-500Zm207.5 160.5Q782-399 832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q113 0 207.5-59.5Z"/>
                                    </svg>
                                ) : (
                                    <svg 
                                        className="w-15"
                                        onClick={() => setVis(!passwordVisBtn)} 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        height="40px" 
                                        viewBox="0 -960 960 960" 
                                        width="40px" 
                                        fill="#e3e3e3">
                                        <path d="m634-422-48.67-48.67q20.34-63-27-108-47.33-45-107.66-26.66L402-654q17-10 36.83-14.67 19.84-4.66 41.17-4.66 72.33 0 122.83 50.5T653.33-500q0 21.33-5 41.5T634-422Zm128.67 128-46-45.33Q762-373 796.17-414.17q34.16-41.16 52.5-85.83-50-107.67-147.84-170.5-97.83-62.83-214.16-62.83-37.67 0-76.34 6.66Q371.67-720 346-710l-51.33-52q37-16.33 87.66-27.17Q433-800 483.33-800q145.67 0 264 82.17Q865.67-635.67 920-500q-25 62.33-64.83 114.5-39.84 52.17-92.5 91.5ZM808-61.33 640-226.67q-35 13-76.17 19.84Q522.67-200 480-200q-147.67 0-266.33-82.17Q95-364.33 40-500q20.33-52.33 54.67-100.5 34.33-48.17 82-90.17L56-812l46.67-47.33 750 750-44.67 48ZM222.67-644q-34.34 26.67-65.34 66.33-31 39.67-46.66 77.67 50.66 107.67 150.16 170.5t224.5 62.83q28.67 0 56.34-3.5 27.66-3.5 45-9.83L532-335.33q-11 4.33-25 6.5-14 2.16-27 2.16-71.67 0-122.5-50.16Q306.67-427 306.67-500q0-13.67 2.16-27 2.17-13.33 6.5-25l-92.66-92Zm309.66 125.67Zm-127.66 63.66Z"/>
                                    </svg>
                                )}
                            </span>
                            <button type="submit" className="bg-complementary-colour text-3xl w-full pt-2! pb-2! cursor-pointer hover:scale-105 transition-all">LOGIN</button>
                        </form>
                        <p onClick={() => setIsLogin(false)} className="text-white mt-12! hover:cursor-pointer hover:text-cyan-300">Back to register</p>
                    </section>
                )}
                </section>
        </div>
    )
}