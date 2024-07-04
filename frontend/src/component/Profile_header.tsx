import { useRecoilState, useRecoilValue } from 'recoil'
import { profile_state, dataAtom } from '../store/atoms/Datarecoil'
import Blg_circle from './Blg_circle'
import { useState } from 'react';
import Profile_edit from './Profile_edit';

export default function Profile_header() {
    const data=useRecoilValue(dataAtom)
    const [val,setval]=useRecoilState(profile_state);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };




return (
    <div className="mt-5">
    
        <div className="flex items-center justify-between mx-2 sm:mx-5 bg-slate-100 rounded-3xl">
            <div className="flex items-center font-semibold">
            <Blg_circle name={data.name} image={data.userImage} 
                image_name_style={"text-2xl text-white capitalize rounded-full bg-orange-700 text-center pt-1 md:pt-2 w-10 h-10 md:w-12 md:h-12"} 
                image_style={"rounded-full object-cover w-10 h-10 md:w-12 md:h-12"} name_style={"pl-1 sm:text-xl capitalize"}/>
            </div>
            <div className="px-4">
            <svg onClick={toggleMenu} xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 hover:cursor-pointer hover:w-7 hover:h-7" viewBox="0 0 24 24" width="24" height="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="gray"/>
            </svg>
            </div>
        </div>

        <div className="bg-slate-100 rounded px-4  text-md sm:text-lg  font-semibold flex justify-between  mx-5 sm:mx-20 md:mx-40">
            <div className="text-center">
                <div>{data.posts.length === 1 && Object.keys(data.posts[0]).length === 0 ? 0 : data.posts.length}</div>
                <div>posts</div>
            </div>
            <div className="text-center">
                <div>{data.following.length === 1 && Object.keys(data.following[0]).length === 0 ? 0 : data.following.length} </div>
                <div>Followers</div>
            </div>
            <div className="text-center">
                <div>{data.followedBy.length === 1 && Object.keys(data.followedBy[0]).length === 0 ? 0 : data.followedBy.length}</div>
                <div>Following</div>
            </div>
        </div>

        <div className="flex border-b border-slate-300 mt-6">
            <div className={`w-1/3 flex justify-center  ${val===0 ? 'border-b border-black' : ''} `}>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>{setval(0)}} className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:cursor-pointer" viewBox="0 0 24 24" width="24" height="24">
                    <rect x="4" y="4" width="16" height="1.5" rx="1" ry="1"/>
                    <rect x="4" y="8.5" width="16" height="1.5" rx="1" ry="1"/>
                    <rect x="4" y="13" width="16" height="1.5" rx="1" ry="1"/>
                    <rect x="4" y="18" width="16" height="1.5" rx="1" ry="1"/>

                    <rect x="4" y="4" width="1.5" height="15" rx="0.5" ry="0.5"/>
                    <rect x="9" y="4" width="1.5" height="15" rx="0.5" ry="0.5"/>
                    <rect x="14" y="4" width="1.5" height="15" rx="0.5" ry="0.5"/>
                    <rect x="18.5" y="4" width="1.5" height="15" rx="0.5" ry="0.5"/>
                </svg>
            </div>
            <div className={`w-1/3 flex justify-center  ${val===1 ? 'border-b border-black' : ''} `}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" onClick={()=>{setval(1)}} className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:cursor-pointer">
                    <circle cx="12" cy="8" r="4" fill="white" />
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
                </svg>
            </div>

            <div className={`w-1/3 flex justify-center  ${val===2 ? 'border-b border-black' : ''} `}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" onClick={()=>{setval(2)}} className="w-8 h-8 sm:w-9 sm:h-9 pt-1 sm:pt-2 text-gray-600 hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5c0-1.1046.8954-2 2-2h10c1.1046 0 2 .8954 2 2v16l-7-4-7 4V5z"/>
                </svg>   
            </div>
        </div>

        {/* for Edit slide bar down.*/}

        {isMenuOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-10 " onClick={toggleMenu}></div>)}
        <div className={`fixed top-0 right-0 mt-20 h-full sm:h-4/5 w-full bg-white z-20 transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} transition-transform`}>

            <div className="flex items-center justify-end p-3">
                <button onClick={toggleMenu} className="focus:outline-none">
                    <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <Profile_edit/>

        </div>

    </div>
)
}
