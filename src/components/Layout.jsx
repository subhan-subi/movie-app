import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
// import { Footer } from "../components/Footer";
import { BottomNav } from "../components/BottomNav";

export function MainLayout(){

  return (

    <>

      <Header />


      <main>
        <Outlet />
      </main>
     <BottomNav />




    </>

  );
}