import Quote from "../component/Quote";
import Signupbox from "../component/Signupbox";

export default function Signup() {
  return (
    <div className="grid xl:grid-cols-2">
      <div className=""><Signupbox/></div>
      <div className="hidden xl:block"><Quote/></div>
    </div>
  )
}
