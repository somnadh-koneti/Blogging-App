import {  useEffect, useState } from "react";
import LabelledInput from "../component/LabelledInput";
import Button from "../component/Button";
import { signin_inp } from "@somnadh/blog";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useSetRecoilState } from "recoil";
import { logout_val } from "../store/atoms/Datarecoil";


export default function Signin() {
  const navigate=useNavigate();
  const setls_val=useSetRecoilState(logout_val);
  
  const [sginInput,setsginInput]=useState<signin_inp>({email:"",password:""});

  const [onbtn, setonbtn] = useState<boolean>(true);

  useEffect(()=>{
    let val=setTimeout(()=>{ if(sginInput.email!=="" && sginInput.password!==""){setonbtn(false)}
      else{setonbtn(true)}},1.5*1000)
      return ()=>{clearTimeout(val)}
  },[sginInput])


  async function sendsignin(){
    try{
      const res= await axios.post(`${BACKEND_URL}/userdetails/signin`,sginInput)
      const data= res.data;

      if (data.message==="valid")
      {
        setls_val(false);
        localStorage.setItem("token",data.token);
        navigate("/home");
      }
      else{
        alert(data.message)}
  }
  catch(e){
    alert("An error occurred while signing in. Please try again later.")
  }
}
  return (
    <div className="bg-gray-300 w-full h-screen flex flex-col justify-center items-center">

        <div className="font-bold tracking-wide leading-relaxed flex-wrap pb-14 text-2xl md:text-3xl">
        To the Blogging Community, welcome back!.
        </div>
        <div className=" w-96">
          <LabelledInput label={"Email"} placeholder={"Enter valid email."} inp_type={"text"} onChange={(e)=>{
          setsginInput({...sginInput,email:e.target.value})}} />
          <LabelledInput label={"Password"} placeholder={"Enter valid password"} inp_type={"password"} onChange={(e)=>{
          setsginInput({...sginInput,password:e.target.value})}} />

          <Button onClick={sendsignin} text={"Signin"} status={onbtn}/>

          <div className="text-center pt-4">Don't have an account?<Link to={"/Signup"} className="underline pl-2">Signup</Link></div>
        </div>

    </div>
  )
}