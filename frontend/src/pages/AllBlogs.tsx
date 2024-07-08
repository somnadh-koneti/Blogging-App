import { useRecoilState,  } from "recoil";
import { allblogs } from "../store/atoms/Datarecoil";
import Blogcard from '../component/Blogcard';
import { useEffect, useMemo, useState } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Post } from "../store/Interface_data";

export default function () {
  const [blog,setblog]=useRecoilState(allblogs);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    let isMounted = true;
        const fetchPost = async () => {
          const res_AllBlogs= await axios.get(`${BACKEND_URL}/blogdetails/blog`,{headers: {'Authorization': localStorage.getItem("token")}})
          if (isMounted) {
            const fetchedData = await res_AllBlogs.data;
            if (JSON.stringify(fetchedData) !== JSON.stringify(blog)) {setblog(fetchedData)}
            setLoading(false)}
          }
    fetchPost();
    return () => {isMounted = false};
  },[])

  const outval=useMemo(()=>{return blog},[blog])
  
  if (loading) {return <div className="h-full w-full flex justify-center items-center text-xl">Loading...</div>;}
    
  if (blog.length===0) {return <div>No posts, to dispaly.</div>;}

  return (
      <div className="flex justify-center p-3 sm:p-6">
        <div className="flex flex-col gap-3 w-10/12 ">
          {outval.map((val: Post) => (
            <Blogcard key={val.id} savedBy={val.savedBy} authorId={val.authorId} author={{name:val.author.name,userImage:val.author.userImage}} id={val.id} title={val.title} content={val.content} image={val.image} createdAt={val.createdAt} tags={val.tags}/>))}
        </div>
      </div>
  )
}
