import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import CreatePost from './pages/CreatePost'
import { useRecoilValue } from 'recoil'
import Blogid from './component/Blogid'
import AllBlogs from './pages/AllBlogs'
import Following from './pages/Following'
import SearchBlog from './pages/SearchBlog'
import User_specific_blog from './component/User_specific_blog'
import Profile from './pages/Profile'
import { logoutVal } from './store/atoms/Datarecoil'


export const routesConfig = [
    { index: true, element: <AllBlogs /> },
    { path: "Following", element: <Following /> },
    { path: "Following/userSpecificDetails/:id", element: <User_specific_blog /> },
    { path: "Following/blog/:id", element: <Blogid /> },
    { path: "Following/userSpecificDetails/:id/blog/:id", element: <Blogid /> },

    { path: "CreatePost", element: <CreatePost /> },

    { path: "SearchBlog", element: <SearchBlog /> },
    { path: "SearchBlog/userSpecificDetails/:id", element: <User_specific_blog /> },
    { path: "SearchBlog/blog/:id", element: <Blogid /> },
    { path: "SearchBlog/userSpecificDetails/:id/blog/:id", element: <Blogid /> },

    { path: "blog/:id", element: <Blogid /> },
    
    { path: "UserCreated/blog/:id", element: <Blogid /> },

    { path: "userSpecificDetails/:id", element: <User_specific_blog /> },
    { path: "userSpecificDetails/:id/blog/:id", element: <Blogid /> },

    { path: "Profile", element: <Profile /> },
    { path: "Profile/userSpecificDetails/:id", element: <User_specific_blog /> },
    { path: "Profile/blog/:id", element: <Blogid /> },
    { path: "Profile/userSpecificDetails/:id/blog/:id", element: <Blogid /> },
];

const App=()=> {
  const lg_val=useRecoilValue(logoutVal);
  console.log()

  return (
    <div>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signin/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/home" element={(!lg_val)?<Home/>:<Signin/>}>
          { routesConfig.map((child, j) => (<Route key={j} path={child.path} element={child.element} index={child.index} />))}
        </Route>
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
    </div>
  )}

export default App

{/*<Route path="/home" element={(!lg_val)?<Home/>:<Signin/>}>
          <Route index element={<AllBlogs/>}/>
          <Route path="Following" element={<Following />}/>
          <Route path="CreatePost" element={<CreatePost/>}/>
          <Route path="UserCreated" element={<UserCreated />}/>
          <Route path="SearchBlog" element={<SearchBlog />}/>
          <Route path="blog/:id" element={<Blogid />}/>
          <Route path="UserCreated/blog/:id" element={<Blogid />}/>
          <Route path="user_specific_details/:id/blog/:id" element={<Blogid />}/>
          <Route path="user_specific_details/:id" element={<User_specific_blog />}/>
    </Route>
    
    export const routesConfig = [
  { path: "/home", element: <Home />, children: [
    { index: true, element: <AllBlogs /> },
    { path: "Following", element: <Following /> },
    { path: "Following/userSpecificDetails/:id", element: <User_specific_blog /> },
    { path: "Following/blog/:id", element: <Blogid /> },
    { path: "Following/userSpecificDetails/:id/blog/:id", element: <Blogid /> }
]}];
    
    */}
