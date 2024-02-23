
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";

function Signup(){

     const dispatch=useDispatch();
     const navigate=useNavigate()

      const [loginData,setLoginData]=useState({
        email:'',
        password:''
      });

      function handleUserInput(e){
        const {name,value}=e.target;
        
        setLoginData({
            ...loginData,
            [name]:value
        })
      }

      //handle submit form
     async function loginAccount(event){
        event.preventDefault();
        
        if(!loginData.email || !loginData.password){
            toast.error('Please fill all the fields')
            return;
        }

        //dispatch create account action
        const response=await dispatch(login(loginData));
        console.log(response)
        if(response?.payload?.success){
             navigate('/');
        setLoginData({
            email:'',
            password:''
        })
        }
      }

    return(
        <HomeLayout>
            <div className="h-[90vh] flex items-center justify-center">
                <form encType="application/x-www-form-urlencoded" onSubmit={loginAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Login Page</h1>

                     <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input
                         type="email"
                         required
                         name="email"
                         id="email"
                         placeholder="Enter your email .."
                         className="bg-transparent px-2 py-1 border"
                         onChange={handleUserInput}
                         value={loginData.email}
                         />
                     </div>

                     <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input
                         type="password"
                         required
                         name="password"
                         id="password"
                         placeholder="Enter your password .."
                         className="bg-transparent px-2 py-1 border"
                         onChange={handleUserInput}
                         value={loginData.password}
                         />
                     </div>

                     <button type="submit" className="mt-2 bg-yellow-600 rounded-lg font-semibold text-lg py-2 hover:bg-yellow-500 transition-all ease-in-out">
                        Login
                     </button>
                     <p className="text-center">Do not have account? <Link to="/signup" className="text-accent link">Signup</Link>
                     </p>
                     
                </form>

            </div>
        </HomeLayout>
    )
}

export default Signup;