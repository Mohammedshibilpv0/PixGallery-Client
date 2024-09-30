import { Routes, Route, useLocation } from "react-router-dom";
import Auth from "../pages/auth";
import NavBar from "../layout/navbar/navBar";
import Dashboard from "../pages/dasboard";

const UserRouter = () => {
    const location = useLocation();
    const showNavBar = location.pathname !== "/login";

    return (
        <>
            {showNavBar && <NavBar />}
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Auth />} />
            </Routes>
        </>
    );
}

export default UserRouter;