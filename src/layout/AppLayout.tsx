import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // sidebar width (expanded vs collapsed)
  const sidebarWidth = isExpanded || isHovered ? "w-[20%]" : "w-[8%]";
  const mobileSidebar = isMobileOpen ? "w-full" : sidebarWidth;


  return (
    <div className="flex w-screen min-h-screen">
      {/* Sidebar */}
      <div className={`${mobileSidebar} transition-all duration-300 ease-in-out`}>
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main content */}
      <div className={`flex-1 ${isMobileOpen ? 'w-full' : 'w-[80%]'}  bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out`}>
        <AppHeader />
        <div className="p-4 md:p-6">
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
