import axios from 'axios';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../config';

import Blogcard from './Blogcard';
import To_go_back from './To_go_back';
import Blg_circle from './Blg_circle';
import Blg_logo_frd_req from './Blg_logo_frd_req';
import { Post } from '../store/Interface_data';


export default function User_specific_blog() {
    const { id } = useParams<{ id: string }>();
    const [specPost, setspecPost] = useState<{isFriend:boolean,post_data:any[]}>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;
        const fetchPost = async () => {
            const res= await axios.get(`${BACKEND_URL}/blogdetails/specific_userId_blog/${id}`,{headers: {'Authorization': localStorage.getItem("token")}})
            if (isMounted) {
                setspecPost(await res.data);
                setLoading(false);} 
        }
    fetchPost();
    return () => {isMounted = false};
    },[id]);


    if (loading) {return <div>Loading...</div>;}
    
    if (!specPost) {return <div>Post not found</div>;}

    if (!specPost || specPost.post_data.length === 0) {return <div>No posts available</div>;}
    const data:{author:{name:string,userImage:string|null},authorId:string}=specPost.post_data[0];

return(
    <div>
        <div className='my-1 flex'>
            <To_go_back/>
        </div>

        <div className='flex justify-center'> 
            <div className=' flex items-center font-semibold bg-slate-100 rounded-xl w-11/12'>
                <Blg_circle name={data.author.name} image={data.author.userImage} 
                    image_name_style={"text-2xl text-white capitalize rounded-full bg-orange-700 text-center pt-1 md:pt-2 w-10 h-10 md:w-12 md:h-12"} 
                    image_style={"rounded-full object-cover w-10 h-10 md:w-12 md:h-12"} name_style={"pl-1 text-xl capitalize"}/>
                <div className='pl-4'><Blg_logo_frd_req author_id={data.authorId} frd_req={specPost.isFriend} props_data={{id:data.authorId,name:data.author.name,image:data.author.userImage,frd:specPost.isFriend}}/></div>
            </div>
        </div>
        
        <div className="flex justify-center p-3 sm:p-6">
            <div className="flex flex-col gap-3 w-10/12 ">
                {specPost.post_data.map((val: Post) => (
                <Blogcard key={val.id} savedBy={val.savedBy} authorId={val.authorId} author={{name:val.author.name,userImage:val.author.userImage}} id={val.id} title={val.title} content={val.content} image={val.image} createdAt={val.createdAt} tags={val.tags}/>))}
            </div>
        </div>
    </div>
)}