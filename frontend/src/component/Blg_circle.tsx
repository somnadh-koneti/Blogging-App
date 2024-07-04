interface val{
    name:string,
    image: string| null|undefined,
    name_style: string,
    image_style:string,
    image_name_style: string
}

export default function Blg_circle(props:val) {
return (
    <>
    {props.image ? (<div><img src={props.image} className={props.image_style} alt="error" /></div>) : 
                (<div className={props.image_name_style}>{props.name[0]}</div>)}
            <div className={props.name_style}>{props.name}</div>
    </>
)
}
