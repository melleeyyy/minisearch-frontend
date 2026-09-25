import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Images from "./pages/Images";
import Videos from "./pages/Videos";
import Answers from "./pages/Answers";
import Notifications from "./pages/Notifications";
import Activity from "./pages/Activity";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="app">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/answers" element={<Answers />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <BottomNavigation />
      </div>
    </HashRouter>
  );
}
