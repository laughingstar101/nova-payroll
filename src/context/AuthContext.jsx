import { createContext, useEffect, useState, useContext, cloneElement } from "react";
import { supabase } from "../utils/supabase/supabase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(undefined);

    const SignUpNewCompany = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });
        if (error) {
            console.log("Error signup: ", error)
            return { success: false, error};
        }
        return { success: true, data} ;
    };

    return (
        <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
    );
};

export const UserAuth = () => {
    return useContext(AuthContext);
}

