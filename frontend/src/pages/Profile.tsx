import { useRecoilState, useRecoilValue, } from "recoil"
import Profile_header from "../component/Profile_header"
import Blogcard from "../component/Blogcard";
import { dataAtom, profile_saved, profile_state, profile_state_followers} from "../store/atoms/Datarecoil";
import Profile_frds_card from "../component/Profile_frds_card";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { FollowedBy, Following, Post } from "../store/Interface_data";


export default function Profile() {

  const [followers_data,setfollowers_data]=useRecoilState(profile_state_followers);
  const value=useRecoilValue(profile_state);

  const [loading, setLoading] = useState<boolean>(true);

  const [blog_saved,setblog_saved]=useRecoilState(profile_saved)
  const [data,setdata]=useRecoilState(dataAtom)
  
useEffect(()=>{
  let isMounted = true;
      const fetchPost = async () => {
        const res= await axios.get(`${BACKEND_URL}/blogdetails/blog_details`,{headers: {'Authorization': localStorage.getItem("token")}})
        const res_saved= await axios.get(`${BACKEND_URL}/blogdetails/savedPosts`,{headers: {'Authorization': localStorage.getItem("token")}})
        if (isMounted) {
          setdata(await res.data);
          setblog_saved(await res_saved.data);
          setLoading(false)}}
  fetchPost();
  return () => {isMounted = false};
},[setblog_saved,setdata])


if (loading) {return <div className="h-full w-full flex justify-center items-center text-xl">Loading...</div>;}

  return (
    <div >
      <div className="fixed top-20 bg-white z-20 w-full lg:w-[calc(100vw-16.666667%)]">
        <Profile_header/>
      </div>

      {(value===0 && data.posts.length===0) && <div className="z-10 mt-44 flex justify-center sm:text-xl font-medium py-16 w-full lg:w-[calc(100vw-24%)]">No posts were created, to dispaly.</div>}
      { (value===0 && data.posts.length!==0) &&  
      <div className="z-10 mt-44 flex justify-center  py-2 sm:py-6  w-full lg:w-[calc(100vw-24%)]">
        <div className="flex flex-col gap-3 w-10/12">
          {data.posts.map((val: Post) => (
            <Blogcard key={val.id} savedBy={val.savedBy} authorId={val.authorId} author={{ name: data.name, userImage: data.userImage }} id={val.id} title={val.title} content={val.content} image={val.image} createdAt={val.createdAt} tags={val.tags}/>))}
        </div>
      </div>
      }

      {value===1 && 
      <div className="z-10 mt-40 flex flex-col ">
        
        <div className="pt-4 sm:pt-7 md:pt-10 text-lg flex text-md font-semibold fixed bg-white z-5 w-full lg:w-[calc(100vw-16.666667%)]">
          <div className={`w-1/2  items-center text-center hover:cursor-pointer ${!followers_data ? 'text-slate-600 border-b border-black' : ''}`} onClick={()=>{setfollowers_data(false)}}>Followers</div>
          <div className={`w-1/2  items-center text-center hover:cursor-pointer ${followers_data ? 'text-slate-600 border-b border-black' : ''}`} onClick={()=>{setfollowers_data(true)}}>Following</div>
        </div>

        <div className=" flex justify-center mt-24 w-full ">

          {!followers_data &&<div className="w-full px-3 sm:w-5/12 lg:w-4/12 items-center text-center flex flex-col gap-4">
            {data.following.map(( following:Following) => (
                <Profile_frds_card key={following.id} name={following.name} image={following.userImage} id={following.id} frd={following.isFollowingMe} />))}
          </div>}

          {followers_data &&<div className="w-full px-3 sm:w-5/12 lg:w-4/12 items-center text-center flex flex-col gap-4">
            {data.followedBy.map(({ following }: FollowedBy) => (
                <Profile_frds_card key={following.id} name={following.name} image={following.userImage} id={following.id} frd={true} />))}
            </div>}
        </div>
      </div>}

      { (value===2 && blog_saved.length!==0) && 
      <div className="z-10 mt-44 flex justify-center  py-2 sm:py-6  w-full lg:w-[calc(100vw-24%)]">
      <div className="flex flex-col gap-3 w-10/12">
        {blog_saved.map((val: Post) => (
          <Blogcard key={val.id} savedBy={val.savedBy} authorId={val.authorId} author={{ name: val.author.name, userImage: val.author.userImage }} id={val.id} title={val.title} content={val.content} image={val.image} createdAt={val.createdAt} tags={val.tags}/>))}
      </div>
    </div>
      }

      {(value===2 && blog_saved.length===0) &&<div className="z-10 mt-44 sm:text-xl font-medium flex justify-center  py-16 w-full lg:w-[calc(100vw-24%)]">No posts were saved, to dispaly.</div>}

    </div>
    
  )
}
