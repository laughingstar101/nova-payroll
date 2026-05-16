import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import vectorBg from '../assets/hero-page-bg.png';

export default function Hero() {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('./company-register');
    };

    return (
        <div className="h-screen flex flex-col items-center overflow-hidden relative">
            {/* Background image covering full area */}
            <img 
                src={vectorBg} 
                className="absolute inset-0 w-full h-full object-cover z-0" 
                alt="background"
            />
            
            {/* Header – stays at top */}
            <div className='bg-primary-colour w-full z-10 flex justify-between items-center py-4 px-20 shadow-xl'>
                <img src={logoImg} className="h-15" alt="logo" />
                <button 
                    onClick={handleRegisterClick} 
                    className='hover:cursor-pointer text-complementary-colour text-xl uppercase bg-secondary-colour2 h-12 px-2'
                >
                    Register
                </button>
            </div>
            
            {/* Content – centered, no overflow */}
            <div className="flex-1 z-10 flex flex-col items-center justify-center px-4">
                <p className='text-white text-6xl font-hero text-center'>Nova Payroll System</p>
                <p className='text-white text-lg font-hero text-center mt-4'>
                    Use our system to launch your company's payroll management to new heights!
                </p>
            </div>
        </div>
    );
}