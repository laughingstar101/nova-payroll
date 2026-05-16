import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import vectorBg from '../assets/hero-page-bg.png';

export default function Hero() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('./company-register');
    };

    return (
        <div className="h-screen flex flex-col items-center overflow-hidden relative bg-secondary-colour3">
            <img 
                src={vectorBg} 
                className="absolute inset-0 w-full h-full object-cover z-0 select-none" 
                alt="background"
            />
            
            <div className='bg-primary-colour w-full z-10 justify-between items-center py-4 px-20 shadow-xl md:flex hidden'>
                <img src={logoImg} className="h-15 select-none" alt="logo" />
                <button 
                    onClick={handleRegisterClick} 
                    className='hover:cursor-pointer text-complementary-colour text-xl font-hero! uppercase bg-secondary-colour2 py-2 px-4 rounded-3xl hover:scale-105 hover:shadow-md hover:shadow-black transition-scale duration-100'
                >
                    register
                </button>
            </div>
            
            <div className="flex-1 z-10 flex flex-col md:justify-center justify-normal items-baseline 2xl:mr-180 xl:mr-160 lg:mr-100 md:mr-70 2xl:w-150 md:w-110 w-full md:p-0 pr-60 pl-6 mt-12">
                <span>
                    <span className='text-white text-shadow-sm text-shadow-black text-7xl font-hero! text-left'>n</span>
                    <span className='text-complementary-colour text-shadow-sm text-shadow-black text-7xl font-hero! text-left'>o</span>
                    <span className='text-white text-shadow-sm text-shadow-black text-7xl font-hero! text-left'>v</span>
                    <span className='text-white text-shadow-sm text-shadow-black text-7xl font-hero! text-left'>a</span>
                </span>
                <p className='text-complementary-colour text-shadow-sm text-shadow-black text-6xl font-hero! text-left'>Payroll System</p>
                <p className='text-white text-xl font-hero! text-left mt-2'>
                    Use our system to launch your company's payroll management to new heights!
                </p>
                <button 
                    onClick={handleRegisterClick} 
                    className='md:hidden flex mt-6 hover:cursor-pointer text-complementary-colour text-xl font-hero! uppercase bg-secondary-colour2 py-2 px-4 rounded-3xl hover:scale-105 hover:shadow-md hover:shadow-black transition-scale duration-100'
                >
                    register
                </button>
            </div>
        </div>
    );
}