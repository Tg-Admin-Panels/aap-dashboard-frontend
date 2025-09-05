import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import packageInfo from '../../package.json';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllForms } from "../features/forms/formsApi";
import { AppDispatch } from "../features/store";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [commitMessage, setCommitMessage] = useState<string | null>(null);

  // sidebar width (expanded vs collapsed)
  const sidebarWidth = isExpanded || isHovered ? "w-[20%]" : "w-[8%]";
  const mobileSidebar = isMobileOpen ? "w-full" : sidebarWidth;
  const dispatch = useDispatch<AppDispatch>();

  // Load all forms (once)
  useEffect(() => {
    dispatch(fetchAllForms());
  }, [dispatch]);

  // Fetch version details
  useEffect(() => {
    fetch('/version-details.json')
      .then(response => response.json())
      .then(data => setCommitMessage(data.lastCommit))
      .catch(() => setCommitMessage(null));
  }, []);


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
        <div className="text-right mr-5 text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-block relative group cursor-help">
            <span>Version {packageInfo.version}</span>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-pre-wrap max-w-md w-max">
              <div className="font-semibold mb-1">Latest Release:</div>
              {commitMessage || 'No commit message available'}
            </div>
          </div>
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
