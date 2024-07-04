

interface buttontext{
    text:string
    onClick: () => Promise<void>;
    status? :boolean | undefined
}
export default function Button(props:buttontext) { 
return (
    <div className=" flex justify-center items-center pt-6 ">
        <button onClick={props.onClick} disabled={props.status} type="button" className=" w-full h-11 text-white bg-gray-800 hover:bg-gray-900 
        focus:outline-none focus:ring-4 
        focus:ring-gray-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 
        dark:bg-gray-800 dark:hover:bg-gray-700 
        dark:focus:ring-gray-700 dark:border-gray-700">{props.text}</button>

    </div>
)
}
