import { atom, selector} from 'recoil';
import { Data, Post, home_data_val} from '../Interface_data';

//    const [todo,settodo]=useRecoilState(displayval);

//------------------------Home.tsx && Profile_edit.tsx----------------------------

export const home_data=atom<home_data_val>({
    key:"home_val",
    default:{id:"",name:"",userImage: null|| ""}
})

//-------------------------profile.tsx----------------------------
export const profile_state = atom({
    key: 'profile_value',
    default: 0,
});

export const profile_state_followers = atom({
    key: 'profile_value_followers',
    default: false,
});

export const dataAtom = atom<Data>({
    key: 'dataAtom',
    default: {id: '',name: '',email: '',userImage: null,createdAt: '',followedBy: [],following: [],posts: []}
});

export const profile_saved=atom<Post[]>({
    key: 'profile_saved1',
    default: [],
});

//-------------Left side Field val-------------------------

const data=()=>{
    const currentPath = (window.location.pathname).split("/").filter(val=>!(val===""));
    if(currentPath.length===1){return "Blogs"}
    else{
        if(currentPath[1]==="CreatePost"){return "Create Blog"}
        else if(currentPath[1]==="SearchBlog"){return "Search Blogs"}
        else{return currentPath[1]}
    }    

}

export const field_val = atom({
    key: 'field',
    default: data(),
});
//---------------------SearchBlog------------------
export const search_data = atom({
    key: 'data_from_search',
    default: [],
});

export const search_data_txt = atom({
    key: 'text_data_search',
    default: "",
});

//------------------------home=:All_blogs--------------------
export const allblogs = atom<Post[]>({
    key: 'all_blogs',
    default:[]
});

//------------------------logout------------------
export const tokenval=atom<string>({
    key: 'token_val',
    default:""
});
export const logoutVal = selector<boolean>({
    key: 'logout_val',
    get: ({ get }) => {
    const tokenFromAtom = get(tokenval);
    const tokenFromLocalStorage = localStorage.getItem("token");
    if (tokenFromLocalStorage === tokenFromAtom && tokenFromAtom!=="" &&  tokenFromLocalStorage!==""){return false}
    else{return true}
    }
});