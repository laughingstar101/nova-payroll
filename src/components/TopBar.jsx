import { useNavigate } from 'react-router-dom'
import logoImg from '../assets/logo.png'


export default function TopBar() {
    const navigate = useNavigate();
    
    return (
        <section className='bg-primary-colour flex justify-center w-full py-4'>
            <div className='mt-2 ml-8 hover:cursor-pointer w-fit fixed left-0 md:flex hidden' onClick={() => navigate("/")}>
                <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M226.67-186.67h140v-246.66h226.66v246.66h140v-380L480-756.67l-253.33 190v380ZM160-120v-480l320-240 320 240v480H526.67v-246.67h-93.34V-120H160Zm320-352Z"/></svg>
            </div>
            <img src={logoImg} className="justify-self-center h-15 w-fit"></img>
        </section>
    )
}