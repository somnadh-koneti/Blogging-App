import { useEffect, useRef, useState } from "react"
import Profile_edit_input from "./Profile_edit_input"
import { profile_edit } from "../store/Interface_data";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useRecoilState } from "recoil";
import { dataAtom, home_data } from "../store/atoms/Datarecoil";

export default function Profile_edit() {

    const [User_data,setUser_data]=useRecoilState(home_data);
    const [blog_data,setblog_data]=useRecoilState(dataAtom)

    const [Newdata,setNewdata]=useState<profile_edit>({name:User_data.name,CurrPass:'',NewPass:'',RetyPass:'',image:{base64:null,name:null}});

//------check Curr_password and verify----------
    const [Access_type,setAccess_type]=useState<boolean>(true);

    useEffect(()=>{let psd=setTimeout(()=>{check_psd()},0*1000); return ()=>{clearTimeout(psd)}},[Newdata.CurrPass])

    if(Newdata.CurrPass==='' && !Access_type){setAccess_type(true)}

    async function check_psd(){ 
        const res_data= await axios.post(`${BACKEND_URL}/blogdetails/Check_password`,{CurrPass:Newdata.CurrPass},{headers: {'Authorization': localStorage.getItem("token")}})
        if(res_data.data.msg==="1"){setAccess_type(false)}
        if(res_data.data.msg==="0"){if(Newdata.CurrPass!==""){setAccess_type(true);}}
    }
//-------------------
    const [redname,setredname]=useState<boolean>(true);
    const [redNewpswd,setredNewpswd]=useState<boolean>(true);
    const [redretypass,setredretypass]= useState<boolean>(true);
    const [redSamedata,setredSamedata]=useState<boolean>(true);


    useEffect(()=>{let val1=setTimeout(()=>{ validation("name");},1*1000); return ()=>{clearTimeout(val1)}},[Newdata.name])
    useEffect(()=>{let val4=setTimeout(()=>{ validation("password");},1*1000); return ()=>{clearTimeout(val4)}},[Newdata.NewPass])
    useEffect(()=>{ if(Newdata.RetyPass!=="" && Newdata.NewPass===""){setredretypass(true)};
        let val4=setTimeout(()=>{ if(Newdata.NewPass!==""){
        if(Newdata.RetyPass===Newdata.NewPass )
        {setredretypass(true)}
        else{if(Newdata.RetyPass!==""){setredretypass(false)}}}},0*1000); return ()=>{clearTimeout(val4)};},[Newdata.RetyPass,Newdata.NewPass])

    if(Newdata.name==='' && !redname){setredname(true)}
    if(Newdata.NewPass==='' && !redNewpswd){setredNewpswd(true)}
    if(Newdata.RetyPass==='' && !redretypass){setredretypass(true)}
    if(Newdata.NewPass==='' && !redSamedata){setredSamedata(true)}


    async function validation(value:string){
        const val=await axios.post(`${BACKEND_URL}/typeddetails/${value}`, Newdata)

            if( val.data.value==="name")
            {
                if(val.data.message==="1" ){setredname(true)}
                else{if(Newdata.name!==""){setredname(false);}}
            }
            if( val.data.value==="password")
            {
                if(val.data.message==="1")
                    { 
                        setredNewpswd(true)
                        if(Newdata.CurrPass===Newdata.NewPass){setredSamedata(false)}
                        else{setredSamedata(true)}
                    }
                else{ if(Newdata.NewPass!==''){setredNewpswd(false);}}
            }
    }
//-----image code-------------

const fileInputRef = useRef<HTMLInputElement | null>(null);

const truncatedName = Newdata.image?.name?.length && Newdata.image.name.length > 30 ? `${Newdata.image.name.slice(0, 30)}...` : Newdata.image?.name;

const imagefile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
            setNewdata({...Newdata,image:{base64:reader.result as string,name:file.name}});
            };
        }}
const clearImage=()=>{
    setNewdata({...Newdata,image:{base64:null,name:null}})
    if (fileInputRef.current) {fileInputRef.current.value = '';}
    }

//-----------------------------------submit-------------------------------------------------------
const [userbtn,setuserbtn]=useState<boolean>(true);
const [passbtn,setpassbtn]=useState<boolean>(true);

useEffect(()=>{
    if(Newdata.name!==User_data.name && redname && Newdata.name!=="")
    {setuserbtn(false)}
    else{setuserbtn(true)}
},[Newdata.name,redname])

useEffect(()=>{
    if(!Access_type && redNewpswd && redSamedata && redretypass && Newdata.NewPass!=="" &&  Newdata.RetyPass!=="" && Newdata.NewPass===Newdata.RetyPass)
        {setpassbtn(false)}
    else{setpassbtn(true)}
},[Access_type,redNewpswd,redSamedata,redretypass,Newdata.NewPass,Newdata.RetyPass])

const userSubmit=async()=>{
    const res_data= await axios.put(`${BACKEND_URL}/blogdetails/upt_username`,{username:Newdata.name},{headers: {'Authorization': localStorage.getItem("token")}})
    setUser_data({...User_data,name:Newdata.name})
    setblog_data({...blog_data,name:Newdata.name})
    alert(res_data.data.msg);
}
const passSubmit=async()=>{
    const res_data= await axios.put(`${BACKEND_URL}/blogdetails/upt_password`,{password:Newdata.NewPass},{headers: {'Authorization': localStorage.getItem("token")}})
    setNewdata({...Newdata,CurrPass:"",NewPass:"",RetyPass:""})
    setredNewpswd(true);setredretypass(true);setredSamedata(true);setpassbtn(true);setAccess_type(true)
    alert(res_data.data.msg);

}
const imageSubmit=async()=>{
    const res_data= await axios.put(`${BACKEND_URL}/blogdetails/upt_image`,{image:Newdata.image.base64},{headers: {'Authorization': localStorage.getItem("token")}})
    setUser_data({...User_data,userImage:Newdata.image.base64})
    setblog_data({...blog_data,userImage:Newdata.image.base64})
    clearImage();
    alert(res_data.data.msg);
}

return (
    <div className='flex flex-col items-center gap-1'>

        <div className="flex flex-col items-center w-full">
            <Profile_edit_input value={Newdata.name} label={"Username"} type={"text"} onChange={(e)=>{setNewdata({...Newdata,name:e.target.value})}}/>
            { !redname && Newdata.name!=="" ? <div className="text-sm font-medium text-red-500">*Min 2char, Max 12char.</div>:<></>}
        </div>
        <div className="flex w-full px-6 mb-2 sm:px-0 sm:w-2/3 md:w-1/2 justify-center">
            <button disabled={userbtn} onClick={userSubmit} className="border bg-sky-500 text-white w-3/5 sm:w-1/2 h-9 text-center sm:text-md rounded-lg"> Save username</button>
        </div>


        <div className="flex flex-col items-center w-full">
            <Profile_edit_input label={"Current password"} type={"password"}correct={Access_type} value={Newdata.CurrPass} onChange={(e)=>{setNewdata({...Newdata,CurrPass:e.target.value})}}/>
            { Access_type && Newdata.CurrPass!=="" ? <div className="text-sm font-medium text-red-500">*Enter correct password.</div>:<></>}
        </div>
        <div className="flex flex-col items-center w-full">
            <Profile_edit_input label={"New password"} type="password" access={Access_type} value={Newdata.NewPass} onChange={(e)=>{setNewdata({...Newdata,NewPass:e.target.value})}}/>
            { !Access_type && !redNewpswd && Newdata.NewPass!=="" ?<div className="text-sm font-medium text-center px-6 text-red-500">*Min 1(uppercase, lowercase, number, special char), Min 8char, Max 32char.</div>:<></>}
            { !Access_type && !redSamedata && Newdata.NewPass!=="" ?<div className="text-sm font-medium text-left text-red-500">*Enter diffrent password from current password</div>:<></>}
        </div>
        <div className="flex flex-col items-center w-full">
            <Profile_edit_input label={"Re-type password"} type="password" access={Access_type} value={Newdata.RetyPass} onChange={(e)=>{setNewdata({...Newdata,RetyPass:e.target.value})}}/>
            { !Access_type && !redretypass && Newdata.RetyPass!=="" ?<div className="text-sm font-medium text-left text-red-500">*Password doesn't match</div>:<></>}
        </div>
        <div className="flex w-full px-6 mb-2 sm:px-0 sm:w-2/3 md:w-1/2 justify-center">
            <button disabled={passbtn} onClick={passSubmit} className="border bg-sky-500 text-white w-3/5 sm:w-1/2 h-9 text-center sm:text-md rounded-lg"> Save password</button>
        </div>

        <div className="flex flex-col w-full px-6 pt-1 sm:px-0 sm:w-2/3 md:w-1/2 gap-1">
            <div className="flex items-center">
                <span className='text-xl font-semibold'>Edit picture</span>
                <div className=" w-14 h-14 rounded-full ml-10">
                    <label>
                        <div className="bg-slate-300 flex items-center justify-center w-14 h-14 border-2 border-black rounded-full text-2xl cursor-pointer">+</div>
                        <input type="file" accept=".jpg, .jpeg, .png" className="hidden" onChange={imagefile} ref={fileInputRef}/>
                    </label>
                </div>
            </div>
            <div className="flex flex-col flex-wrap gap-2">
                <div className="">{truncatedName }</div>
                <div>{Newdata.image?.base64 ? <div className="flex gap-2"><button onClick={clearImage} className="border bg-sky-500 text-white w-24 h-7 sm:w-32 sm:h-8 text-center rounded-lg">Clear</button>
                                                    <button onClick={imageSubmit} className="border bg-sky-500 text-white w-24 h-7 sm:w-32 sm:h-8 text-center  rounded-lg">Save</button></div> :""}</div>
            </div>
        </div>
        
    </div>
)}

