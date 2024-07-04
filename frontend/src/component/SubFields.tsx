import { NavLink } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { field_val } from '../store/atoms/Datarecoil';
interface values{
    name:string,
    link:string,
}
export default function SubFields(props:values) {

    const [clicked,setclicked]=useRecoilState(field_val);

    return (
    <NavLink to={props.link}>
        <div onClick={()=>{setclicked(props.name)}} className={`text-xl pt-2 font-medium cursor-pointer text-center rounded-2xl h-12 
                hover:tracking-wide  hover:bg-gray-200 hover:shadow-xl  ${clicked===props.name ? ' text-slate-500' : ''}`} >{props.name}</div>
    </NavLink>
    )
}
