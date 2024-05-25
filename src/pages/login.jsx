import React from "react";
import {auth , provider} from "../firebase-config"
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from "react-router-dom";

export default function Login({setIsAuth}) {
    let navigate = useNavigate()         

    //sign in 
        const signInWithGoogle = async () => {
            const result = await signInWithPopup(auth, provider)
                console.log(result)
                localStorage.setItem("isAuth" , true)
                setIsAuth(true)
                navigate("/") // or window.location.pathname = "/"
            } /* console.log("sign in was unsuccessful") */
       
    
    return (
        <>
            <p className="p-el"> LOGIN </p>
            <section className="login-body">
                <div>sign in with google</div>
                <button /* className = "login-with-google-btn" */ onClick={signInWithGoogle} >google sign in </button>
            </section>
        </>

    )
}