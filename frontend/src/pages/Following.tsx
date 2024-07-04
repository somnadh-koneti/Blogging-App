import { useEffect, useState } from 'react'
import Blogcard from '../component/Blogcard';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { Post } from '../store/Interface_data';

export default function Following() {

  const [blog,setblog]=useState([])
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(()=>{

    let isMounted = true;
        const fetchPost = async () => {
            const res= await axios.get(`${BACKEND_URL}/blogdetails/following`,{headers: {'Authorization': localStorage.getItem("token")}})
            if (isMounted) {
              setblog(await res.data);
              setLoading(false);} 
        }
    fetchPost();
    return () => {isMounted = false};
  },[])

  if (loading) {return <div className='h-full w-full flex justify-center items-center text-xl'>Loading...</div>;}
    
  if (blog.length===0) {return <div className='sm:text-xl font-medium flex justify-center py-24 sm:py-44 px-6'>No posts to display,Start following the users.</div>;}

  return (
      <div className="flex justify-center p-3 sm:p-6">
        <div className="flex flex-col gap-3 w-10/12 ">
          {blog.map((val: Post) => (
            <Blogcard key={val.id} savedBy={val.savedBy} authorId={val.authorId} author={{name:val.author.name,userImage:val.author.userImage}} id={val.id} title={val.title} content={val.content} image={val.image} createdAt={val.createdAt} tags={val.tags}/>))}
        </div>
      </div>
  )}
