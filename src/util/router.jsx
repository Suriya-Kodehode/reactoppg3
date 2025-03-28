import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import App from "../App.jsx";
import RegisterPage from "../pages/registerPage.jsx";
import LoginPage from "../pages/loginPage.jsx";
import ProfilePage from "../pages/profilePage.jsx";
import { getFromLocalStorage } from "./localStorage.jsx";

const isAuthenticated = () => Boolean(getFromLocalStorage("jwtToken"));
const ProtectedRoute= ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/login" replace/>
}
const token = localStorage.getItem("jwtToken");
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <p>An unexpected error occurred.</p>,
        children: [
            {
                index: true,
                element: <RegisterPage />,
            },
            {
                path: "/login",
                element: isAuthenticated() ? <Navigate to="/profile" replace/> : <LoginPage/>,
            },
            {
                path: "/profile",
                element: <ProtectedRoute element={<ProfilePage/>}/>
            }
        ]
    },
    {
        path: "*",
        element: <p>Page not found</p>
    }

])

const AppRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}
export default AppRouter;