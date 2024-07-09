import { Link, useNavigate } from "react-router-dom"
import LabelledInput from "./LabelledInput"
import { useEffect, useState } from "react"
import { signup_inp } from "@somnadh/blog";
import Button from "./Button";
import axios from "axios";
import { BACKEND_URL } from "../config";


export default function () {

    const navigate=useNavigate();

    const [suInp,setsuInp]=useState<signup_inp>({email:"",name:"",password:""});
    const [retypass,setretypass]=useState<string>("");


    const [redname,setredname]=useState<boolean>(true);
    const [redemail,setredemail]=useState<boolean>(true);
    const [redpswd,setredpswd]=useState<boolean>(true);
    const [reddupemail,setreddupemail]=useState<boolean>(true);
    const [redretypass,setredretypass]= useState<boolean>(true);

    const [onbtn, setonbtn] = useState<boolean>();


    useEffect(()=>{let val1=setTimeout(()=>{ validation("name");},2*1000); return ()=>{clearTimeout(val1)}},[suInp.name])
    useEffect(()=>{let val3=setTimeout(()=>{ validation("email");},2*1000); return ()=>{clearTimeout(val3)}},[suInp.email])
    useEffect(()=>{let val4=setTimeout(()=>{ validation("password");},1*1000); return ()=>{clearTimeout(val4)}},[suInp.password])
    useEffect(()=>{ if(retypass!=="" && suInp.password===""){setredretypass(true)};
        let val4=setTimeout(()=>{ if(suInp.password!==""){
        if(retypass===suInp.password )
        {setredretypass(true)}
        else{if(retypass!==""){setredretypass(false)}}}},1*1000); return ()=>{clearTimeout(val4)};},[retypass,suInp.password])

    useEffect(()=>{
        if(reddupemail===true && redname===true && redemail===true 
            && redpswd===true && redretypass===true && suInp.name!==""  && suInp.email!=="" && suInp.password!=="" && retypass!=="" )
            {setonbtn(false)}
            else{setonbtn(true)}
    },[reddupemail,redname,redpswd,redemail,redretypass,suInp.email,suInp.name,suInp.password,retypass])


    if(suInp.name==='' && !redname){setredname(true)}
    if(suInp.email==='' && !redemail){setredemail(true)}
    if(suInp.email==='' && !reddupemail){setreddupemail(true)}
    if(suInp.password==='' && !redpswd){setredpswd(true)}
    if(retypass==='' && !redretypass){setredretypass(true)}
    
    async function signupdata(){
        const dataup=await axios.post(`${BACKEND_URL}/userdetails/signup`,suInp)
        if(dataup.data ==='Done'){
            alert("Account created.");
            navigate("/");
        }
        else{
            alert(dataup.data);
        }
    }

    async function validation(value:string){
        const val=await axios.post(`${BACKEND_URL}/typeddetails/${value}`, suInp)

            if( val.data.value==="name")
            {
                if(val.data.message==="1" ){setredname(true)}
                else{if(suInp.name!==""){setredname(false);}}
            }
            if( val.data.value==="email")
            {
                if(val.data.message==="1"){setredemail(true);setreddupemail(true)}
                if(val.data.message==="2"){setreddupemail(false);setredemail(true)}
                if(val.data.message==="0" && suInp.email!==''){setredemail(false)}
            }
            if( val.data.value==="password")
            {
                if(val.data.message==="1"){ setredpswd(true)}
                else{ if(suInp.password!==''){setredpswd(false);}}
            }
    }

return (
    <div className=" h-screen flex justify-center items-center">
    <div className="w-11/12 sm:w-3/5 md:2/5 lg:w-2/5 xl:w-1/2">

        <div className="text-center pb-8">
            <div className="text-3xl sm:text-4xl font-bold">Create an account</div>
            <div className="text-lg">Already have an account? <Link className="underline pl-1" to={"/"}>Login</Link></div>
        </div>

        <LabelledInput label="Username" placeholder="Enter your name." inp_type="text"
            onChange={(e)=>{setsuInp({...suInp,name:e.target.value})}} />
        { !redname && suInp.name!="" ? <div className="text-sm font-medium text-left py-2 text-red-500">* Min 2char, Max 12char.</div>:<></>}

        <LabelledInput label="Email" placeholder="Enter email." inp_type="email"
            onChange={(e)=>{setsuInp({...suInp,email:e.target.value})}}/>
        { !redemail && suInp.email!="" ? <div className="text-sm font-medium text-left py-2 text-red-500">* Enter vaild email.</div>: 
            !reddupemail && suInp.email!="" ? <div className="text-sm font-medium text-left py-2 text-red-500">* Email already taken!.</div>:<></>}


        <LabelledInput label="Password" placeholder="Enter password" inp_type="password"
            onChange={(e)=>{setsuInp({...suInp,password:e.target.value})}}/>
        { !redpswd && suInp.password!="" ?<div className="text-sm font-medium text-left py-2 text-red-500">* Min 1(uppercase, lowercase, number, special char), Min 8char, Max 32char.</div>:<></>}


        <LabelledInput label="Re-type password" placeholder="Re-enter password" inp_type="password"
            onChange={(e)=>setretypass(e.target.value)}/>
        { !redretypass && retypass!="" ?<div className="text-sm font-medium text-left py-2 text-red-500">* Password doesn't match</div>:<></>}


        <Button onClick={signupdata} text={"Signup"} status={onbtn}/>


    </div>
    </div>
)
}
