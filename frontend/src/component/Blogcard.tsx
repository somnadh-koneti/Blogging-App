import { NavLink } from "react-router-dom";
import Tags from "./Tags";
import Blogcard_txt from "./Blogcard_txt";
import Blg_circle from "./Blg_circle";
import Blg_logo_saved from "./Blg_logo_saved";
import { Post } from "../store/Interface_data";
import Delete_post from "./Delete_post";

export default function Blogcard(props:Post) {

    const txt=props.content;
    const wordsPerMinute = 200;
    const wordCount = txt.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    const date = new Date(props.createdAt);

    const authorRoute = `/userSpecificDetails/${props.authorId}`;

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const currentPath = window.location.pathname;
        if (currentPath.includes(authorRoute)) {
            e.preventDefault();
            return;
        }}; 

return (
    <div>

    <div className=" flex items-center justify-between text-base w-full p-2">
            <div className="flex items-center gap-1">
                <NavLink className="flex items-center" to={`userSpecificDetails/${props.authorId}`} onClick={handleClick}>
                    <Blg_circle name={props.author.name} image={props.author.userImage} 
                        image_name_style={"text-lg font-semibold capitalize text-white rounded-full bg-orange-700 text-center pt-1 w-9 h-9 "} 
                        image_style={"rounded-full object-cover w-9 h-9"} name_style={"text-sm sm:text-base pl-1 pr-1 capitalize"}/>
                </NavLink>
                <div className="h-1 w-1 bg-slate-500 rounded-full inline-block align-middle"></div> 
                <span className="text-xs sm:text-sm pl-1 text-slate-500">{date.toDateString()}</span>
            </div>
        <div className="sm:hidden flex gap-1 sm:gap-3 items-bottom">
            <Delete_post author_id={props.authorId} post_id={props.id}/>
            <Blg_logo_saved savedBy={props.savedBy} Post_id={props.id} props_val={props}/>   
        </div>
    </div>

    <NavLink to={`blog/${props.id}`}>
        <div className=" sm:hidden bg-gray-100 w-full p-2 rounded-lg">
            <div className=" flex justify-center">
                {props.image!==null? <img src={props.image} className=" w-full  h-48 object-cover rounded-lg " alt="error" /> :
                    <div className="w-full  h-40 bg-slate-200 rounded-lg"></div> }
            </div>
            <div  className=" text-justify overflow-hidden pt-1 ">
                <Blogcard_txt title={props.title}/>
            </div>
        </div>
    </NavLink>

    <NavLink to={`blog/${props.id}`}>
        <div className="hidden sm:flex justify-between bg-gray-100 w-full h-44 p-3 rounded-lg">
            <div  className=" mr-20 text-justify overflow-hidden w-3/4">
                <Blogcard_txt title={props.title} content={props.content}/>
            </div>
            <div className="w-1/2 h-40 flex justify-center">
                {props.image!==null ? <img src={props.image} className="  h-full object-cover rounded-lg self-end" alt="error" /> :
                    <div className="w-full  h-40 bg-slate-200 rounded-lg"></div>}
            </div>
        </div>
    </NavLink>

    <div className="hidden sm:flex justify-between p-3" >
        <div className="hidden sm:flex ">
            <div className="grid gap-2 grid-cols-2">
                {props.tags.map((tag,index)=> <Tags key={index} text={tag}/>)}
            </div>

            <div className="px-4 flex underline underline-offset-4 decoration-slate-00">
                <div className="h-1 w-1 mt-3 mr-1 bg-slate-500 rounded-full inline-block align-middle"></div> 
                <div>{readingTime} Min Read </div>
            </div>
        </div>

        <div className="flex gap-1 sm:gap-3 items-top">
            <Delete_post author_id={props.authorId} post_id={props.id}/>
            <Blg_logo_saved savedBy={props.savedBy} Post_id={props.id} props_val={props}/>
        </div>
    </div>
    </div>
)
}

// -- iterating the router routes logic-----
{/*
    function routeExists(path: string, routes: typeof routesConfig): boolean {
    for (const route of routes) {
        if (route.path && matchPath({ path: route.path, end: false }, path)) {return true;}

        if (route.children) {
            for (const child of route.children) {
            if (child.path && matchPath({ path: child.path, end: true }, path)) {return true;}
        }}}
    return false;
    }

        const routeIsValid = routeExists(authorRoute, routesConfig); 

        if (!routeIsValid) {
            e.preventDefault();
            alert('Route does not exist');
        }
    */}

