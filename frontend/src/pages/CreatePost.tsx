import { useEffect, useRef, useState } from "react";
import Tags from "../component/Tags";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { pstdata } from "@somnadh/blog";



export default function CreatePost() {


  const [tagsval,settagsval]=useState("");  

  const [postval,setpostval]=useState<pstdata>({title:"",content:"",image:{base64:null,name:null},tags:[]});

  const [redtags,setredtags]=useState<boolean>(false);
  const [redtitle,setredtitle]=useState<boolean>(false);
  const [redcontent,setredcontent]=useState<boolean>(false);

  useEffect(()=>{
    const val=postval.tags.length;
    if(val<=5 && val!==0){setredtags(true)}
    else{setredtags(false)}
  },[postval.tags])

  useEffect(()=>{
    const val=postval.title.length;
    if(val>=10 && val<=100){setredtitle(true)}
    else{setredtitle(false)}
  },[postval.title])

  useEffect(()=>{
    const val=postval.content.length;
    if(val>=20 && val<=1000){setredcontent(true)}
    else{setredcontent(false)}
  },[postval.content])

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const truncatedName = postval.image?.name?.length && postval.image.name.length > 30 ? `${postval.image.name.slice(0, 30)}...` : postval.image?.name;

  const imagefile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              setpostval({...postval,image:{base64:reader.result as string,name:file.name}});
            };
        }}
  const clearImage=()=>{
    setpostval({...postval,image:{base64:null,name:null}})
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
  }}

  const tagsData = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter' &&tagsval.trim() !== "") {
        e.preventDefault();
        if(!postval.tags.includes(tagsval.trim().toLowerCase()))
        {setpostval({...postval,tags:[...postval.tags,tagsval.trim().toLowerCase()]})} 
        settagsval("");
    } else if (e.type === 'change') {
      if(((e as React.ChangeEvent<HTMLInputElement>).target.value).length<=15)
        {settagsval(((e as React.ChangeEvent<HTMLInputElement>).target.value));}
    }};
  const submit=async()=>
    {
      try{
        const res= await axios.post(`${BACKEND_URL}/blogdetails/blog_create`,postval,{headers: {'Authorization': localStorage.getItem("token")}})
        if(res.data.msg!==false)
          { alert("Post created.") 
            setpostval({title:"",content:"",image:{base64:null,name:null},tags:[]})
            setredtags(false);setredcontent(false);setredtitle(false);
          }
        else{alert("Failed to create.")}
    }
      catch(e){alert("An error occurred.")}
    }
    
  return (
      <div className="flex flex-col gap-6  items-center p-8">
      
      <div className="w-11/12 sm:w-4/5 ">
        <textarea className="sm:text-lg w-full h-32 p-4 rounded-lg border border-2 border-slate-400 resize-none"
          value={postval.title} onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>{setpostval({...postval,title:e.target.value})}} placeholder="Title"></textarea>
        {(!redtitle ) && <span className="text-red-500 flex justify-end">*Min 10char,Max 100char </span> }
      </div>

      <div className="w-11/12 sm:w-4/5 ">
        <textarea className="sm:text-lg w-full h-52  p-4 rounded-lg border border-2 border-slate-400 resize-none"
          value={postval.content} onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>{setpostval({...postval,content:e.target.value})}} placeholder="Type your story here..."></textarea>
        {(!redcontent) && <span className="text-red-500 flex justify-end">*Min 20char,Max 1000char </span> }
      </div>

      <div className="w-11/12 sm:w-4/5 flex flex-col gap-4">
        <div className="sm:flex">
          <input onChange={tagsData} onKeyDown={tagsData} className="rounded-lg border border-2 border-slate-400 w-full sm:w-2/5 h-12 p-2" value={tagsval}  type="text" placeholder="Type tags.Click enter." />
          {(!redtags) && <span className="text-red-500 flex justify-end sm:items-center">*Min 1tag,Max 5tags </span> }
        </div>
        <div className="flex gap-2 flex-wrap">
          {postval.tags.map((val,index) => (
          <div key={index} className="flex">
            <Tags text={val}/>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{setpostval({...postval,tags:postval.tags.filter(data=> !(data===val))})}} className="w-2.5 h-2.5 sm:w-3 sm:h-3 hover:cursor-pointer"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          </div>
          ))}
        </div>
      </div>

      <div className=" bg-blue-100 w-4/5 sm:w-3/5 md:w-2/5 h-64 border border-slate-600 rounded-xl border-2 flex flex-col justify-center items-center gap-y-4">
        <div className="pt-4 pr-4 sm:text-3xl font-semibold sm:font-bold">Upload image</div>
        <div className=" w-14 h-14 rounded-full">
          <label>
              <div className="bg-slate-300 flex items-center justify-center w-14 h-14 border-2 border-black rounded-full text-2xl cursor-pointer">+</div>
              <input type="file" accept=".jpg, .jpeg, .png" className="hidden" onChange={imagefile} ref={fileInputRef}/>
          </label>
        </div>
        <div className="text-center">{truncatedName }</div>
        <div>{postval.image?.base64 ? <button onClick={clearImage} className="bg-blue-500 text-white rounded w-32 h-7 text-center">Clear</button> :""}</div>
      </div>

      <div className="w-11/12 sm:w-4/5 pt-5 flex justify-start">
        <button onClick={submit} disabled={(redcontent && redtags && redtitle)?false:true} className="bg-blue-500 text-white rounded w-full sm:w-56 h-8 text-center">Create post</button>
      </div>

      </div>
  )
}
