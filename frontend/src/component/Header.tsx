import { useState } from 'react';
import Fields from '../pages/Fields';
import Blg_circle from './Blg_circle';
import { useRecoilValue } from 'recoil';
import { home_data } from '../store/atoms/Datarecoil';



export default function Header() {

    const user_dtls=useRecoilValue(home_data);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
    <header className="fixed top-0 left-0 w-full h-20 border-b-2 border-slate-200 flex items-center justify-between px-4 lg:px-10 bg-white z-20">
        <div className="text-2xl lg:text-4xl font-bold text-cyan-900 flex-grow">BlogSphere</div>

        <div className="hidden lg:flex items-center text-lg font-semibold">
            <Blg_circle name={user_dtls.name} image={user_dtls.userImage} 
                image_name_style={"text-2xl font-semibold capitalize text-white rounded-full bg-orange-700 text-center pt-2 w-10 h-10 md:w-12 md:h-12"} 
                image_style={"rounded-full object-cover w-10 h-10 md:w-12 md:h-12"} name_style={"pl-4 capitalize"}/>
        </div>

        <div className="lg:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
        </div>

      {/* Mobile Menu */} {/* is menu open lg:hidden removed on below.*/}
        {isMenuOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-10 " onClick={toggleMenu}></div>)}

        <div className={`fixed top-0 left-0 h-full w-64 bg-white z-20 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform`}>

            <div className="flex items-center justify-between p-4 border-b-2 border-slate-200">
                <div className="text-2xl font-bold text-cyan-900">BlogSphere</div>
                <button onClick={toggleMenu} className="focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            <div className="p-4">

                <div className="flex items-center mb-4">
                    <Blg_circle name={user_dtls.name} image={user_dtls.userImage} 
                        image_name_style={"text-2xl font-semibold capitalize text-white rounded-full bg-orange-700 text-center pt-1 md:pt-2 w-10 h-10 md:w-12 md:h-12"} 
                        image_style={"rounded-full object-cover w-10 h-10 md:w-12 md:h-12"} name_style={"pl-4 capitalize"}/>
                </div>
                <div className=' h-[calc(100vh-8rem)]  '><Fields/></div>
                
            </div>
        </div>
    </header>
    )};


