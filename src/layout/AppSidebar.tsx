import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  MemberIcon,
  VolunteerIcon,
  WingIcon,
  GroupIcon,
  PlusIcon,
  TaskIcon,
  ChatIcon,
  ListIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { FormDefinition } from "../features/forms/formsSlice";

type Role = "admin" | "volunteer" | string;

type SubItem = {
  name: string;
  path: string;
  pro?: boolean;
  new?: boolean;
  role?: Role[]; // ✅ role on sub-item (empty/undefined => visible to all)
};

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubItem[];
  role?: Role[]; // ✅ role on top level (empty/undefined => visible to all)
};

const canSee = (allowed: Role[] | undefined, userRole?: Role) =>
  !allowed || allowed.length === 0 || !!userRole && allowed.includes(userRole);



const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [dynamicForm, setDynamicForm] = useState<FormDefinition[]>([])
  const { user } = useSelector((state: RootState) => state.auth);
  const userRole = user?.role as Role | undefined;

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Auto-open submenu if a VISIBLE sub-item matches the current route
  useEffect(() => {
    let submenuMatched = false;
    (["main", "others"] as const).forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (!canSee(nav.role, userRole)) return; // top-level role gate

        const visibleSubItems = (nav.subItems || []).filter((s) =>
          canSee(s.role, userRole)
        );
        if (visibleSubItems.length === 0) return;

        visibleSubItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: menuType, index });
            submenuMatched = true;
          }
        });
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  }, [location, isActive, userRole]);

  // Measure submenu height on open
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const { formsList, loading, error } =
    useSelector((state: RootState) => state.forms);
  useEffect(() => {
    setDynamicForm(formsList)
  }, [formsList])


  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };


  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
      subItems: [{ name: "Home", path: "/", pro: false, role: [] }],
      role: ["admin", "volunteer"],
    },
    {
      icon: <TaskIcon />,
      name: "All Forms Submission",
      subItems: [...dynamicForm.map(form => ({ name: form.formName, path: `/forms/submissions/${form._id}`, pro: false, role: ["admin", "volunteer"] }))],
      role: ["admin", "volunteer"],
    },
    {
      icon: <WingIcon />,
      name: "Wing",
      subItems: [
        { name: "Create Wing", path: "/wing/add", pro: false, role: ["admin"] },
        { name: "All Wings", path: "/wing/list", pro: false, role: ["admin"] },
      ],
      role: ["admin"],
    },
    {
      icon: <PlusIcon />,
      name: "Visions",
      subItems: [
        { name: "Create Vision", path: "/visions/add", pro: false, role: ["admin"] },
        { name: "All Visions", path: "/visions/list", pro: false, role: ["admin"] },
      ],
      role: ["admin"],
    },
    {
      icon: <VolunteerIcon />,
      name: "Volunteers",
      subItems: [
        { name: "All Volunteers", path: "/volunteers/", pro: false, role: ["admin"] },
        { name: "Create Volunteer", path: "/volunteers/add", pro: false, role: ["admin"] },
      ],
      role: ["admin"],
    },
    {
      icon: <MemberIcon />,
      name: "Members",
      subItems: [{ name: "All Members", path: "/members/", pro: false, role: [] }],
      role: ["admin", "volunteer"],
    },
    {
      icon: <GroupIcon />,
      name: "Booth Team",
      subItems: [{ name: "All Booth Team", path: "/booth-team", pro: false, role: ["admin"] }],
      role: ["admin"],
    },
    {
      icon: <GridIcon />,
      name: "Locations",
      subItems: [
        { name: "All Locations", path: "/locations", pro: false, role: ["admin"] },
        { name: "Create State", path: "/locations/create-state", pro: false, role: ["admin"] },
        { name: "Create District", path: "/locations/create-district", pro: false, role: ["admin"] },
        { name: "Create Legislative Assembly", path: "/locations/create-assembly", pro: false, role: ["admin"] },
        { name: "Create Booth", path: "/locations/create-booth", pro: false, role: ["admin"] },
      ],
      role: ["admin"],
    },
    {
      icon: <TaskIcon />,
      name: "Candidate Applications",
      subItems: [{ name: "All Applications", path: "/candidate-applications", pro: false, role: ["admin"] }],
      role: ["admin"],
    },
    {
      icon: <ChatIcon />,
      name: "Campaigns",
      subItems: [{ name: "All Campaigns", path: "/campaigns", pro: false, role: ["admin"] }],
      role: ["admin"],
    },
    {
      icon: <ListIcon />,
      name: "Data Fill",
      subItems: [
        { name: "Create Form", path: "/forms/create", pro: false, role: ["admin",] },
        { name: "All Forms", path: "/forms/list", pro: false, role: ["admin"] },
        // { name: "View Submissions", path: "/forms/submissions", pro: false, role: ["admin", "volunteer"] },
      ],
      role: ["admin", "volunteer"],
    },
  ];

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        // Gate top-level menu by its role
        if (!canSee(nav.role, userRole)) return null;

        const visibleSubItems = (nav.subItems || []).filter((s) =>
          canSee(s.role, userRole)
        );

        // If it has subItems but none are visible, hide the whole menu
        const shouldShow =
          (nav.subItems ? visibleSubItems.length > 0 : true) && canSee(nav.role, userRole);

        if (!shouldShow) return null;

        const isOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${isOpen ? "menu-item-active" : "menu-item-inactive"
                  } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                  }`}
              >
                <span
                  className={`menu-item-icon-size  ${isOpen ? "menu-item-icon-active" : "menu-item-icon-inactive"
                    }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-500" : ""
                      }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                    }`}
                >
                  <span
                    className={`menu-item-icon-size ${isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                      }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isOpen
                    ? `${subMenuHeight[`${menuType}-${index}`] || "auto"}px`
                    : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {visibleSubItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={`menu-dropdown-item ${isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                          }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div className=" flex flex-col items-center gap-2">
              <img
                className="brightness-0 dark:brightness-100"
                src="/images/logo/app-logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <h2 className="text-2xl font-semibold text:gray-800 dark:text-gray-300">
                Aam Admi Party
              </h2>
            </div>
          ) : (
            <img
              src="/images/logo/app-logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="brightness-0 dark:brightness-100"
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots className="size-6" />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
