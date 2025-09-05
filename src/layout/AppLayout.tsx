import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

// ⬇️ Added imports (from newer code)
import packageInfo from "../../package.json";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllForms } from "../features/forms/formsApi";
import type { AppDispatch } from "../features/store";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // ⬇️ Added state for version tooltip
  const [commitMessage, setCommitMessage] = useState<string | null>(null);

  // ⬇️ Redux dispatch (load all forms once)
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchAllForms());
  }, [dispatch]);

  // ⬇️ Fetch version details (commit message)
  useEffect(() => {
    fetch("/version-details.json")
      .then((response) => response.json())
      .then((data) => setCommitMessage(data.lastCommit))
      .catch(() => setCommitMessage(null));
  }, []);

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

        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 overflow-x-auto">
          <Outlet />
        </div>

        {/* ⬇️ Version footer from newer code */}
        <div className="text-right mr-5 text-xs text-gray-500 dark:text-gray-400 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="inline-block relative group cursor-help">
            <span>Version {packageInfo.version}</span>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-pre-wrap max-w-md w-max">
              <div className="font-semibold mb-1">What's New in {packageInfo.version}:</div>
              {commitMessage?.split('\n').map((line, i) => (
                <div key={i} className="mb-1 text-left">
                  {line}
                </div>
              )) || "No changes recorded"}
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
