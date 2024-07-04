import { profile_frd_card_data } from '../store/Interface_data'
import Blg_circle from './Blg_circle'
import Blg_logo_frd_req from './Blg_logo_frd_req'



export default function Profile_frds_card(props:profile_frd_card_data) {
    return (
        <div className='flex items-center w-full justify-between bg-gray-100 rounded-3xl pr-3'>
            <div className='flex items-center'>
                <Blg_circle name={props.name} image={props.image} 
                    image_name_style={"text-2xl text-white capitalize rounded-full bg-orange-700 text-center pt-1 md:pt-1.5 w-10 h-10 md:w-11 md:h-11"} 
                    image_style={"rounded-full object-cover w-10 h-10 md:w-11 md:h-11"} name_style={"pl-1 sm:text-xl capitalize"}/>
                </div>
            <Blg_logo_frd_req author_id={props.id} frd_req={props.frd} props_data={props}/>
        </div>
    )
}
