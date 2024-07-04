import { ChangeEvent, useState } from "react"

interface data{
    label:string,
    type:string,
    onChange: (e:ChangeEvent<HTMLInputElement>)=> void;
    access?:boolean,
    correct?:boolean,
    value?:string
}
export default function Profile_edit_input(props:data) {
    const [show,setshow]=useState<boolean>(false);
return (
    <div className={`flex flex-col items-center w-full px-6 sm:px-0 sm:w-2/3 md:w-1/2 ${props.access?'opacity-50':""}`}>
        <div className="flex justify-between items-center self-start w-full">
            <div className="flex items-center  gap-1">
                <span className='text-xl font-semibold '>{props.label}</span>
                {(props.type==="password") &&
                    <svg className="w-5 h-5 hover:cursor-pointer" onClick={()=>{setshow(!show)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        {(show)?"":<path strokeWidth="2" d="M4 4l16 16" />}
                    </svg> 
                }
            </div>
            <div className="flex items-center">
                {(props.label==="Current password" && !props.correct) && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="10" cy="10" r="9" fill="green" />
                        <path stroke="#fff" strokeLinecap="round" strokeWidth="2" d="M6 10l3 3 6-6" />
                </svg>}
            </div>
        </div>

        <input readOnly={props.access} value={props.value} type={(!show)?props.type:"text"} onChange={props.onChange} className='w-full pl-2 border-b border-black text-xl focus:outline-none focus:border-b'/>
    </div>
)
}
