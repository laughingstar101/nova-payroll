import profileImg from '../assets/profile-empty.png'

export default function Profile() {
    return (
        <div className="min-h-screen flex flex-col bg-linear-to-br from-secondary-colour3 to-secondary-colour2">
            <div className="container m-auto flex flex-col gap-4 items-center py-8 rounded-xl bg-primary-colour shadow-xl">
                <img className='w-40' src={profileImg}></img>
                <p className='text-4xl text-white font-hero!'>Username</p>
            </div>
        </div>
    )
}