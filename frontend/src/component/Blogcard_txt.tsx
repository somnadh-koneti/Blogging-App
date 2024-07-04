interface data{
    title:string,
    content?:string| undefined
}
export default function Blogcard_txt(props:data) {
    return (
        <div>
            <div className="text-base md:text-lg break-words  font-bold tracking-normal capitalize  pb-1 ">{props.title.length>100?props.title.slice(0,100)+"...": props.title}</div>
            {props.content ? (<div className="text-base break-words">{props.content.length > 200 ? `${props.content.slice(0, 200)}....` : props.content}</div>) : null}
        </div>
    )
}
