import Logo_frd_req from './Logo_frd_req'
import axios from 'axios'
import { BACKEND_URL } from '../config'
import { useRecoilState } from 'recoil'
import { dataAtom } from '../store/atoms/Datarecoil'
import { FollowedBy, profile_frd_card_data } from '../store/Interface_data'
import { useState } from 'react'

interface data{
    author_id:string,
    frd_req:boolean,
    props_data:profile_frd_card_data
}
export default function Blg_logo_frd_req(props:data) {
    const[frd_val,setfrd_val]=useState(props.frd_req)

    const [data_frd,setdta_frd]=useRecoilState(dataAtom)

    const onclk_frd=async()=>{
        
        if(frd_val){
            const res= await axios.post(`${BACKEND_URL}/blogdetails/unfollow_friend`,{id:props.author_id},{headers: {'Authorization': localStorage.getItem("token")}})
            const data= res.data;
            if(data.val){
                setfrd_val(false)
                setdta_frd({...data_frd,followedBy:data_frd.followedBy.filter(val=> !(val.following.id===props.author_id)),following:data_frd.following.map(val=> val.id===props.author_id?{ ...val, isFollowingMe: !props.frd_req,following:[]}:val)})
            }
        }
        else{
            const res= await axios.post(`${BACKEND_URL}/blogdetails/connect_friends`,{id:props.author_id},{headers: {'Authorization': localStorage.getItem("token")}})
            const data= res.data;
            if(data.val){
                setfrd_val(true)
                const newValue:FollowedBy={following:{id: props.props_data.id,name:props.props_data.name,userImage:props.props_data.image}}
                setdta_frd({...data_frd,followedBy:[...data_frd.followedBy,newValue],following:data_frd.following.map(val=> val.id===props.author_id?{ ...val, isFollowingMe: true,following:[{followedById:data_frd.id}]}:val)})
            }
        }
    }
return (
    <div>
        <Logo_frd_req  frd_clk={onclk_frd} frd={frd_val} authorId={props.author_id}/>
    </div>
)
}
