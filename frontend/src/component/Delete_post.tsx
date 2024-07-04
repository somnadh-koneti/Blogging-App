import { useRecoilState, useRecoilValue } from "recoil"
import { allblogs, dataAtom, home_data, profile_saved } from "../store/atoms/Datarecoil"
import { BACKEND_URL } from "../config";
import axios from "axios";

interface data{
    post_id:string,
    author_id:string
}

export default function Delete_post(props:data) {

    const user_id=useRecoilValue(home_data);
    const [AllBlogs,setAllBlogs]=useRecoilState(allblogs);
    const [Saved_post,setSaved_post]=useRecoilState(profile_saved)
    const [User_post,setUser_post]=useRecoilState(dataAtom)

    const clicked=async()=>{
        const res= await axios.put(`${BACKEND_URL}/blogdetails/blog_delete`,{id:props.post_id},{headers: {'Authorization': localStorage.getItem("token")}})
        if(res.data.val===true)
            {
                setAllBlogs(AllBlogs.filter(post=> !(post.id===props.post_id)))
                setSaved_post(Saved_post.filter(post=> !(post.id===props.post_id)))
                setUser_post({...User_post,posts:User_post.posts.filter(post=> !(post.id===props.post_id))})
            }
        else{alert("Failed to delete,Retry.")}
    }

return (
    <div>
        {(user_id.id===props.author_id) &&
        <svg id="trashBinIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500 hover:cursor-pointer" onClick={clicked}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2m4 0v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6m4-6v6"/>
        </svg>}

    </div>
)}
