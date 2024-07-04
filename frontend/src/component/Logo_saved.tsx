
interface logo{
    savedBy: boolean,
    save_clk:()=>void,
}

export default function Logo_saved(props:logo) {

return (
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill={props.savedBy ? "gray" : "none"} viewBox="0 0 24 24" stroke="currentColor"
            className="w-6 h-6 sm:w-7 sm:h-7 text-gray-500 hover:cursor-pointer" onClick={props.save_clk}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5c0-1.1046.8954-2 2-2h10c1.1046 0 2 .8954 2 2v16l-7-4-7 4V5z"/>
        </svg>
    </div>
)
}
