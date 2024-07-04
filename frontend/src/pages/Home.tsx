import { Outlet } from 'react-router-dom'
import Fields from './Fields'
import '../App.css';
import Header from '../component/Header';
import { useSetRecoilState} from 'recoil';
import { home_data } from '../store/atoms/Datarecoil';
import { useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export default function Home() {
  const setdata=useSetRecoilState(home_data);
  useEffect(()=>{
        const fetchPost = async () => {
          const res= await axios.get(`${BACKEND_URL}/blogdetails/home_page_details`,{headers: {'Authorization': localStorage.getItem("token")}})
            setdata(await res.data);
          }
    fetchPost();
  },[setdata])

  return (
    <div className='flex flex-col h-screen'>
    
      <Header/>

      <div className='h-full flex mt-20 '>
        <div className='fixed left-0 h-[calc(100vh-4rem)] w-2/12 p-3 border-r-2 border-slate-200 hidden lg:block'>
          <Fields/>
        </div>

        <div className='fixed overflow-y-auto w-full h-[calc(100vh-5rem)] lg:w-10/12 lg:ml-[16.666667%]'>
          <Outlet/>
        </div>
      </div>

    </div>
  )
}


