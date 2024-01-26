
import { useState } from "react";
import toast from "react-hot-toast";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { createAccount } from "../Redux/Slices/AuthSlice";

function Signup(){

     const dispatch=useDispatch();
     const navigate=useNavigate()
   
      const [previewImage,setPreviewImage]=useState("")

      const [signupData,setSignupData]=useState({
        fullname:'',
        email:'',
        password:'',
        avatar:''
      });

      function handleUserInput(e){
        const {name,value}=e.target;
        setSignupData({
            ...signupData,
            [name]:value
        })
      }

      //function to get image and set image to preview
      function getImage(event){
        event.preventDefault();
        
        //getting the image
        const uploadedImage=event.target.files[0]

        if(uploadedImage){
            setSignupData({
                ...signupData,
                avatar:uploadedImage
            });

            const fileReader=new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener('load',function(){
                setPreviewImage(this.result)
            })
        }
      }

      //handle submit form
     async function createNewAccount(event){
        event.preventDefault();
        if(!signupData.fullname || !signupData.email || !signupData.password || !signupData.avatar){
            toast.error('Please fill all the fields')
            return;
        }
        //validate fullname
        if(signupData.fullname.length<5){
            toast.error("Name must be atleast 5 character long")
            return;
        }
        //validate email
        if(!signupData.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)){
            toast.error('Please enter a valid email Id')
            return;
        }
        //validate password
        if(!signupData.password.match(/^(?=.*\d)(?=.*[a-zA-Z]).{8,12}$/)){
            toast.error('Password must be contain atleast one alpha and one number within 4-8 char')
            return;
        }

        const formData=new FormData();
        formData.append("fullname",signupData.fullname);
        formData.append("email",signupData.email);
        formData.append("password",signupData.password);
        formData.append("avatar",signupData.fullname);

        //dispatch create account action
        const response=await dispatch(createAccount(formData));
        console.log(response)
        if(response?.payload?.success){
             navigate('/');
        setSignupData({
            fullname:'',
            email:'',
            password:'',
            avatar:''
        })
        }
           
        setPreviewImage('')

      }
    return(
        <HomeLayout>
            <div className="h-[90vh] flex items-center justify-center">
                <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]">
                    <h1 className="text-center text-2xl font-bold">Registration Page</h1>

                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {previewImage?(
                        <img  src={previewImage} className="w-24 h-24 rounded-full m-auto"/>
                          ):(
                            <BsPersonCircle className="w-24 h-24 rounded-full m-auto"/>
                          )
                         }
                    </label>
                    <input
                     type="file" 
                     onChange={getImage}
                     className="hidden"
                     name="image_uploads"
                     id="image_uploads"
                     accept=".jpg, .jpeg, .png, .svg"/>

                     <div className="flex flex-col gap-1">
                        <label htmlFor="fullname" className="font-semibold">Name</label>
                        <input
                         type="text"
                         required
                         name="fullname"
                         id="fullname"
                         placeholder="Enter your name .."
                         className="bg-transparent px-2 py-1 border"
                         onChange={handleUserInput}
                         value={signupData.fullname}
                         />
                     </div>
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
                         value={signupData.email}
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
                         value={signupData.password}
                         />
                     </div>

                     <button type="submit" className="mt-2 bg-yellow-600 rounded-lg font-semibold text-lg py-2 hover:bg-yellow-500 transition-all ease-in-out">
                        Create account
                     </button>

                     <p className="text-center">Do not have account? <Link to="/login" className="text-accent link">Login</Link>
                     </p>
                     
                </form>

            </div>
        </HomeLayout>
    )
}

export default Signup;