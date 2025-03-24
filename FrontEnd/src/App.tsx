import { Navigate, Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/auth";
import EventPage from "./pages/eventPage";
import GetHelp from "./pages/getHelp";
import Impact from "./pages/impact";
import ShowCasePage from "./pages/ShowCasePage";
import useAuthStore from "./store/useAuthStore";
import Admin from "./pages/Admin";
import EventsPage from "@/components/Admin/Events/EventsPage";
import { UsersPage } from "@/components/Admin/Users/UsersPage";
import { RequestsPage } from "@/components/Admin/Requests/RequestsPage";
import { ShowcasePage } from "@/components/Admin/ShowCase/ShowcasePage";
import { Dashboard } from "./components/Admin/Dashboard";
import { AddEventPage } from "./components/Admin/Events/AddEventPage";
import { AddShowcasePage } from "./components/Admin/ShowCase/AddShowcasePage";
import { MessagesPage } from "./components/Admin/Messages/MessagesPage";

function App() {
  const { checkAuth, isCheckingAuth, authenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth && !authenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="animate-spin" size={60} />
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
        <Route
          element={authenticated ? <Navigate to={"/"} /> : <Auth />}
          path="/Login"
        />

        <Route element={<Admin />} path="/admin">
          <Route index element={<Dashboard />} />
          <Route element={<ShowcasePage />} path="showcases" />
          <Route element={<MessagesPage />} path="messages" />
          <Route element={<AddShowcasePage />} path="showcases/addShowcase" />
          <Route element={<EventsPage />} path="events" />
          <Route element={<AddEventPage />} path="events/addEvent" />
          <Route element={<UsersPage />} path="users" />
          <Route element={<RequestsPage />} path="requests" />
        </Route>
      </Routes>
    </>
  );
}

export default App;
