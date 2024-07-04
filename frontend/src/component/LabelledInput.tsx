import { ChangeEvent } from "react"


interface labelledinputtype{
    label:string,
    placeholder:string,
    inp_type:string,
    onChange: (e:ChangeEvent<HTMLInputElement>)=> void;
}

export default function LabelledInput(props:labelledinputtype) {
return (
    <div className="pb-3">
        <label  className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">{props.label}</label>
        <input onChange={props.onChange} type={props.inp_type} className="bg-gray-50 border border-gray-300 text-gray-900 text-lg rounded-lg 
                                                                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                                                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                                                                dark:text-white 
                                                                dark:focus:ring-blue-500 
                                                                dark:focus:border-blue-500" placeholder={props.placeholder} required />
    </div>
)
}
