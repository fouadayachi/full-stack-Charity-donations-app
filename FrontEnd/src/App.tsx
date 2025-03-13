import { Navigate, Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import Auth from "./pages/auth";
import EventPage from "./pages/eventPage";
import GetHelp from "./pages/getHelp";
import Impact from "./pages/impact";
import ShowCasePage from "./pages/ShowCasePage";
import useAuthStore from "./store/useAuthStore";

function App() {
  const {checkAuth,isCheckingAuth,authenticated} = useAuthStore();
  

  useEffect(() => {
    checkAuth();
  },[]);

  if(isCheckingAuth && !authenticated){
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className=" animate-spin" size={60} />
      </div>
    );
  }

  return (
    <>
    <ToastContainer />
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Impact />} path="/impact" />
      <Route element={<EventPage />} path="/event/:id" />
      <Route element={<ShowCasePage />} path="/showcase/:id" />
      <Route element={<GetHelp />} path="/getHelp" />
      <Route element={authenticated ? <Navigate to={"/"}/>:<Auth />} path="/Login" />
    </Routes>
    </>
    
  );
}

export default App;
