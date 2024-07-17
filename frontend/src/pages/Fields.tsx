import { useNavigate } from 'react-router-dom';
import SubFields from '../component/SubFields';
import { useSetRecoilState } from 'recoil';
import { logoutVal } from '../store/atoms/Datarecoil';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export default function Fields() {  
    const navigate=useNavigate();
    const token=useSetRecoilState(logoutVal)

    const data=[{name:"Blogs",link:""},{name:"Following",link:"Following"},{name:"Create Blog",link:"CreatePost"},{name:"Search Blogs",link:"SearchBlog"},{name:"Profile",link:"Profile"}]

    return (
    <div className='w-full h-full flex flex-col pb-10'>

        <div className="flex flex-col gap-6 flex-grow ">
        {data.map((val,index)=>( <SubFields key={index} name={val.name} link={val.link}/>))}
        </div>

        {/* "search"<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <circle cx="11" cy="11" r="7" stroke="black" stroke-width="2" fill="none" />
                        <line x1="16.65" y1="16.65" x2="22" y2="22" stroke="black" stroke-width="2" />
                    </svg>
        
        "create" <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="30" height="100">
                    <rect x="5" y="5" width="90" height="90" rx="25" ry="25" fill="#000" />
                    <rect x="15" y="15" width="70" height="70" rx="20" ry="20" fill="#fff" />
                    <line x1="50" y1="25" x2="50" y2="75" stroke="#000" stroke-width="5" />
                    <line x1="25" y1="50" x2="75" y2="50" stroke="#000" stroke-width="5" />
                </svg>
*/}

        <div className='text-center'>
        <button className="bg-red-100 text-xl font-medium w-full h-12 hover:bg-red-400 rounded-xl hover:tracking-wide  hover:shadow-xl hover:shadow-red-200 hover:text-white "
            onClick={async()=>{token(true); localStorage.removeItem("token"); navigate("/");await axios.get(`${BACKEND_URL}/userdetails/jwtlogout`);}}>logout</button>
        </div>
    </div>
    )
}
