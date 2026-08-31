import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { BottomNav } from "../components/BottomNav";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-black text-white font-sans antialiased selection:bg-yellow-400 selection:text-black">
      <Header />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}