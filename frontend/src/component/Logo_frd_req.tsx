import { useRecoilValue } from 'recoil'
import {home_data } from '../store/atoms/Datarecoil'

interface logo{
    frd: boolean,
    frd_clk:()=>void,
    authorId:string
}

export default function Logo_frd_req(props:logo) {
    const hide=useRecoilValue(home_data)

return (
    <div>
        {hide.id!==props.authorId &&
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 hover:cursor-pointer " onClick={props.frd_clk}>
            <circle cx="12" cy="8" r="4" fill="white" />
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            {!props.frd?<path d="M21 9h-3v-3a1 1 0 00-2 0v3h-3a1 1 0 000 2h3v3a1 1 0 002 0v-3h3a1 1 0 000-2z" fill="currentColor" transform="scale(1.2) translate(-1 -2)"/>
            :<path d="M20 9h-6a1 1 0 000 2h6a1 1 0 000-2z" fill="currentColor" transform="scale(1.2) translate(-2 -2)"/>}
        </svg>}

    </div>
)}
