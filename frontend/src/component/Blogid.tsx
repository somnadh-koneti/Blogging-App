import { useParams } from 'react-router-dom';
import Tags from './Tags';
import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import Blg_circle from './Blg_circle';
import Blg_logo_saved from './Blg_logo_saved';
import To_go_back from './To_go_back';
import { Post } from '../store/Interface_data';

export default function Blogid() {


    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post| null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        let isMounted = true;
        const fetchPost = async () => {
            const res= await axios.get(`${BACKEND_URL}/blogdetails/blog/${id}`,{headers: {'Authorization': localStorage.getItem("token")}})
            if (isMounted) {
                setPost(await res.data);
                setLoading(false);} 
        }
    fetchPost();
    return () => {isMounted = false};
    },[id]);

    const date = typeof post?.createdAt === 'string' ? new Date(post.createdAt) : post?.createdAt;

    if (loading) {return <div>Loading...</div>;}
    
    if (!post) {return <div>Post not found</div>;}

return (
<div className='py-1 px-2 sm:4 lg:px-6'>
        <div className='my-1 flex'>
            <To_go_back/>
        </div>

        <div className='flex flex-col gap-3'>
            <div className=' flex items-center justify-between bg-slate-100 rounded-xl '>
                <div className='flex items-center font-semibold'>
                        <Blg_circle name={post.author.name} image={post.author.userImage} 
                        image_name_style={"text-2xl text-white capitalize rounded-full bg-orange-700 text-center pt-1 md:pt-2 w-10 h-10 md:w-12 md:h-12"} 
                        image_style={"rounded-full object-cover w-10 h-10 md:w-12 md:h-12"} name_style={"pl-4 text-xl capitalize"}/>
                </div>
                <div className='flex gap-3'>
                    <Blg_logo_saved savedBy={post.savedBy} Post_id={post.id} props_val={post}/>
                </div>
            </div>

            <div className='text-slate-500'>
                    Posted on : {date?.toDateString()}
            </div>

            {post.image && <div className=' flex justify-center  '>
                <img src={post.image} className="object-cover rounded-lg sm:w-6/12 sm:h-6/12 lg:w-5/12 lg:h-5/12" alt="error" />
            </div>}

            <div className=''>
                <div className='font-bold text-xl sm:text-2xl tracking-wide text-justify capitalize break-words pb-3'>
                    {post?.title}
                </div>
                <div className='text-md sm:text-lg font-normal tracking-wide leading-relaxed text-justify whitespace-pre-line break-words pb-7 '>
                    {post.content}
                </div>
            </div>

            <div className='flex'>
                <div className="inline-block grid grid-cols-2 gap-2">
                    {post.tags.map((tag,index)=> <Tags key={index} text={tag}/>)}
                </div>
            </div>

        </div>
</div>
)
}
