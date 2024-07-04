import { NavLink, useNavigate } from 'react-router-dom';

export default function To_go_back() {
    const navigate=useNavigate();

return (
    <>
        <NavLink  to={'..'} onClick={(e) => {e.preventDefault(); navigate(-1);}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6"/>
                    <path d="M9 12H21"/>
                </svg>
            </NavLink>
    </>
)
}
