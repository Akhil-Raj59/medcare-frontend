import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import authService from "./services/authService";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from "./components";
import background from "./assets/background.png";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const headerExcludedPages = [];
  const footerExcludedPages = [];
  const authPages = ["/login", "/signup"];

  const shouldShowHeader = !headerExcludedPages.includes(location.pathname);
  const shouldShowFooter = !footerExcludedPages.includes(location.pathname);
  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    const token = authService.getToken();
  
    if (!token) {
      dispatch(logout());
      setLoading(false);
      return;
    }
  
    const fetchUser = async () => {
      try {
        const userdata = await authService.getCurrentUser();
  
        if (userdata) {
          dispatch(login(userdata));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, [dispatch]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f7f7f7] text-gray-800">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-t-4 border-[#2196f3] border-solid rounded-full animate-spin"></div>
          <p className="absolute text-gray-800 text-lg top-16 left-1/2 transform -translate-x-1/2">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      <div
        className={`flex-grow flex flex-col ${isAuthPage ? "bg-cover bg-center" : "bg-[#f7f7f7]"}`}
        style={isAuthPage ? { backgroundImage: `url(${background})` } : {}}
      >
        {shouldShowHeader && <Header />}

        <main className="flex-grow">
          <Outlet context={{ user }} />
        </main>
      </div>

      {shouldShowFooter && <Footer />}
    </div>
  );
}

export default App;
