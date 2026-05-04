import Button from "./Button";

export default function SignupContainer() {
    return (
        <section id='signupContainer'>
            <h1>Register Company</h1>    
            <section id="formContainer">
                <label for="nameInput" className="formLabel">Company name:</label>
                <input type="text" id="nameInput" className="formInput"></input>
            </section>
            <Button/>
        </section>
    )
}