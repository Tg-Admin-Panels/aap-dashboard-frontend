import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllForms } from "../features/forms/formsApi";
import type { AppDispatch } from "../features/store";


const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // ⬇️ Redux dispatch (load all forms once)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchAllForms());
  }, [dispatch]);


  return (
    <div className="min-h-screen flex">
      <div className="fixed left-0 top-0 z-20 h-full">
        <AppSidebar />
        <Backdrop />
      </div>

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          } ${isMobileOpen ? "ml-0" : ""} w-full overflow-x-hidden`}
      >
        <AppHeader />

        <div className="min-h-[calc(100vh-60px)] p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 overflow-x-auto">
          <Outlet />
        </div>



      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
