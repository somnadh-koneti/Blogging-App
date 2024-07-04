import Logo_saved from './Logo_saved';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { Post } from '../store/Interface_data';
import { useRecoilState } from 'recoil';
import { dataAtom, profile_saved } from '../store/atoms/Datarecoil';
import { useState } from 'react';

interface saved{
    savedBy:boolean,
    Post_id:string,
    props_val:Post
}

export default function Blg_logo_saved(props:saved) {
    const [save,setsave]=useState(props.savedBy)

    const [Saved_data,setSaved_data]=useRecoilState(profile_saved);
    const [data_Allposts,setData_Allposts]=useRecoilState(dataAtom);

    const onclk_save=async()=>{

        if(save){
            const res= await axios.post(`${BACKEND_URL}/blogdetails/unSave_Post`,{Post_id:props.Post_id},{headers: {'Authorization': localStorage.getItem("token")}})
            const data= res.data;
            if(data.val){
                setsave(!save)
                const updatedPosts =data_Allposts. posts.map(post => 
                    post.id === props.Post_id ? { ...post, savedBy: !props.savedBy } : post
                );
                setData_Allposts({...data_Allposts,posts:updatedPosts});
                setSaved_data(Saved_data.filter(post => !(post.savedBy && post.id === props.Post_id)));
            }
        }
        else{
            const res= await axios.post(`${BACKEND_URL}/blogdetails/Save_Post`,{Post_id:props.Post_id},{headers: {'Authorization': localStorage.getItem("token")}})
            const data= res.data;
            if(data.val){
                setsave(!save)
                const updatedPosts =data_Allposts. posts.map(post => 
                    post.id === props.Post_id ? { ...post, savedBy: !props.savedBy } : post
                );
                setData_Allposts({...data_Allposts,posts:updatedPosts});
                setSaved_data([{...props.props_val,savedBy:true},...Saved_data])
            }
        }  
    }
return (
    <>
        <Logo_saved savedBy={save} save_clk={onclk_save}/>
    </>
)
}
