import logoImg from '../assets/logo.png'

export default function TopBar() {
    return (
        <section id='topBar'>
            <img src={logoImg} id='headerLogo' height='60'></img>
        </section>
    )
}