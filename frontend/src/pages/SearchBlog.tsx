import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import Blogcard from '../component/Blogcard';
import { useRecoilState } from 'recoil';
import {search_data, search_data_txt } from '../store/atoms/Datarecoil';
import { Post } from '../store/Interface_data';


export default function SearchBlog() {
  const [inpval, setinpval] = useRecoilState(search_data_txt);
  const [blog, setblog] = useRecoilState(search_data);
  const [flag,setflag]=useState<{txt:string,state:Boolean}>({txt:"",state:false});

  useEffect(() => {if (inpval === "") {setblog([]);setflag({txt:"",state:false})}}, [inpval]);

  const Data = async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (e.type === 'keydown' && (e as React.KeyboardEvent<HTMLInputElement>).key === 'Enter' && inpval.trim() !== "") {
      const res = await axios.post(`${BACKEND_URL}/blogdetails/search_by_tags`, { txt: inpval }, { headers: { 'Authorization': localStorage.getItem("token") } });
      const data =await res.data;
      setblog(data);
      if(data.length===0){setflag({txt:inpval,state:true})}
    } 
    else if (e.type === 'change'){setinpval((e as React.ChangeEvent<HTMLInputElement>).target.value);}
  };

  function capitalizeFirstLetter(s:string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  return (
    <React.Fragment >
      <div  className="fixed top-20 bg-white z-20 w-full lg:w-[calc(100vw-16.666667%)]">
        <div className="mx-3 sm:mx-16 flex flex-col gap-4 mt-5">
          <span className="text-2xl font-bold">Search By Tag Name</span>
          <input onChange={Data} onKeyDown={Data} value={inpval} className="border border-2 border-black rounded-2xl h-10 p-5 sm:p-6 font-semibold text-xl capitalize" type="text" placeholder="Type tag name.click Enter"/>
        </div>
      </div>
      <div className="z-10 mt-28 flex justify-center p-3 sm:p-6">

        { blog.length!==0 &&
        <div className="flex flex-col gap-3 w-10/12">
          {blog.map((val: Post) => (
            <Blogcard key={val.id} savedBy={val.savedBy} authorId={val.authorId} author={{ name: val.author.name, userImage: val.author.userImage }} id={val.id} title={val.title} content={val.content} image={val.image} createdAt={val.createdAt} tags={val.tags}/>))}
        </div>}

        {(flag.txt!=="" && flag.state && blog.length===0) && 
          <div className='sm:text-xl font-medium justify-text pl-5 py-10'>No post with tag name <span className='font-bold'>"{capitalizeFirstLetter(flag.txt)}"</span> found. </div>
        }

      </div>
      </React.Fragment>
    );
}


{/*
  const location = useLocation();

  const handleScroll = debounce(() => {
    console.log('Scroll event:', window.scrollY); // Debugging log
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  }, 10);


  useEffect(() => {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
      console.log('Restoring scroll position:', scrollPosition);
      window.scrollTo(0, parseInt(scrollPosition, 10));
    }

    const scrollHandler = () => {
      console.log('Handling scroll'); // Additional debugging log
      handleScroll();
    };

    window.addEventListener('scroll', scrollHandler);
    console.log('Adding scroll event listener');

    return () => {
      console.log('Removing scroll event listener');
      window.removeEventListener('scroll', scrollHandler);
      handleScroll.cancel();
    };
  }, [location]);
  */}