import { Routes,Navigate, Route, useLocation } from "react-router-dom";
import Auth from "../pages/auth";
import NavBar from "../layout/navbar/navBar";
import Dashboard from "../pages/dasboard";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const UserRouter = () => {
    const location = useLocation();
    const isLogin=useSelector((config:RootState)=>config.user.isAuthenticated)
    const showNavBar = location.pathname !== "/login";

    return (
        <>
            {showNavBar && <NavBar />}
            <Routes>
                <Route path="/" element={isLogin ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={isLogin ? <Navigate to="/" /> : <Auth />} />
            </Routes>
        </>
    );
}

export default UserRouter;