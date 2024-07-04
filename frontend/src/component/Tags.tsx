interface val{
    text:string,
}
export default function (props:val) {
return (
    <div className="inline-flex capitalize bg-gray-200 rounded-full px-3.5 py-1.5">
        {props.text}
    </div>
)}
