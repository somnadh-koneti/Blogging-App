import { useNavigate } from 'react-router-dom';
import SubFields from '../component/SubFields';
import { useSetRecoilState } from 'recoil';
import { tokenval } from '../store/atoms/Datarecoil';

export default function Fields() {  
    const navigate=useNavigate();
    const token=useSetRecoilState(tokenval)

    const data=[{name:"Blogs",link:""},{name:"Following",link:"Following"},{name:"Create Blog",link:"CreatePost"},{name:"Search Blogs",link:"SearchBlog"},{name:"Profile",link:"Profile"}]

    return (
    <div className='w-full h-full flex flex-col pb-10'>

        <div className="flex flex-col gap-6 flex-grow ">
        {data.map((val,index)=>( <SubFields key={index} name={val.name} link={val.link}/>))}
        </div>

        <div className='text-center'>
        <button className="bg-red-100 text-xl font-medium w-full h-12 hover:bg-red-400 rounded-xl hover:tracking-wide  hover:shadow-xl hover:shadow-red-200 hover:text-white "
            onClick={()=>{token(""); localStorage.removeItem("token"); navigate("/")}}>logout</button>
        </div>
    </div>
    )
}
