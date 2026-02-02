import { Link, useNavigate } from "react-router-dom";
import {
  FolderGit,
  History,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareMore,
  Package2,
  PanelLeft,
  PencilRuler,
  User,
  Award,
  ChevronRight,
  Settings,
  FileText,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import Dashboard from "./sub-components/Dashboard";
import AddSkill from "./sub-components/AddSkill";
import AddProject from "./sub-components/AddProject";
import AddSoftwareApplications from "./sub-components/AddSoftwareApplications";
import Account from "./sub-components/Account";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import Messages from "./sub-components/Messages";
import AddTimeline from "./sub-components/AddTimeline";
import Certifications from "./sub-components/Certifications";

// Navigation configuration - single source of truth
const NAVIGATION_ITEMS = {
  main: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      component: Dashboard,
    },
    {
      id: "add-project",
      label: "Add Project",
      icon: FolderGit,
      component: AddProject,
    },
    {
      id: "add-skill",
      label: "Add Skill",
      icon: PencilRuler,
      component: AddSkill,
    },
    {
      id: "add-uses",
      label: "Add Uses",
      icon: LayoutGrid,
      component: AddSoftwareApplications,
    },
    {
      id: "add-timeline",
      label: "Add Timeline",
      icon: History,
      component: AddTimeline,
    },
  ],
  communication: [
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquareMore,
      component: Messages,
      badge: true,
    },
  ],
  profile: [
    {
      id: "account",
      label: "Account",
      icon: User,
      component: Account,
    },
    {
      id: "certifications",
      label: "Certifications",
      icon: Award,
      component: Certifications,
    },
  ],
};

const HomePage = () => {
  const [active, setActive] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState("w-64");
  
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged Out!");
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      // Note: clearAllUserErrors function seems missing from imports
      // dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated, error, dispatch, navigateTo]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    setSidebarWidth(isSidebarCollapsed ? "w-64" : "w-20");
  };

  const ActiveComponent = () => {
    // Find the active component from navigation items
    const allItems = [
      ...NAVIGATION_ITEMS.main,
      ...NAVIGATION_ITEMS.communication,
      ...NAVIGATION_ITEMS.profile,
    ];
    const activeItem = allItems.find(item => item.id === active);
    return activeItem?.component || Dashboard;
  };

  const renderNavigationItem = (item, isMobile = false) => {
    const isActive = active === item.id;
    const Icon = item.icon;
    
    if (isMobile) {
      return (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-primary/10 text-primary border-l-4 border-primary"
              : "text-muted-foreground hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </div>
          {isActive && (
            <ChevronRight className="h-4 w-4 text-primary" />
          )}
        </button>
      );
    }

    // Desktop sidebar item
    return (
      <TooltipProvider key={item.id}>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActive(item.id)}
              className={`group relative flex items-center justify-center h-12 w-full transition-all duration-200 ${
                isSidebarCollapsed ? "px-0" : "px-4"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div className={`flex items-center w-full gap-3 ${
                isSidebarCollapsed ? "justify-center" : "justify-start"
              }`}>
                <div className={`relative flex items-center justify-center h-10 w-10 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                  {isActive && (
                    <div className="absolute -left-1 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  )}
                </div>
                
                {!isSidebarCollapsed && (
                  <span className={`font-medium transition-all duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {item.label}
                  </span>
                )}
              </div>
              
              {!isSidebarCollapsed && isActive && (
                <ChevronRight className="absolute right-4 h-4 w-4 text-primary animate-in slide-in-from-right-2" />
              )}
            </button>
          </TooltipTrigger>
          {isSidebarCollapsed && (
            <TooltipContent side="right">
              {item.label}
              {item.badge && <span className="ml-2 h-1.5 w-1.5 rounded-full bg-destructive" />}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 hidden flex-col border-r bg-card transition-all duration-300 ease-in-out sm:flex ${sidebarWidth} shadow-lg`}>
        {/* Sidebar Header */}
        <div className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0" : "justify-between px-6"} h-16 border-b`}>
          {!isSidebarCollapsed ? (
            <>
              <Link className="flex items-center gap-2 font-semibold text-xl">
                <Package2 className="h-6 w-6 text-primary" />
                <span>PortfolioHub</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8"
              >
                <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isSidebarCollapsed ? "rotate-180" : ""}`} />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Button>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-8 px-4">
            {/* Main Section */}
            <div>
              {!isSidebarCollapsed && (
                <h3 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Content Management
                </h3>
              )}
              <div className="space-y-1">
                {NAVIGATION_ITEMS.main.map(item => renderNavigationItem(item))}
              </div>
            </div>

            {/* Communication Section */}
            <div>
              {!isSidebarCollapsed && (
                <h3 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Communication
                </h3>
              )}
              <div className="space-y-1">
                {NAVIGATION_ITEMS.communication.map(item => renderNavigationItem(item))}
              </div>
            </div>

            {/* Profile Section */}
            <div>
              {!isSidebarCollapsed && (
                <h3 className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Profile & Settings
                </h3>
              )}
              <div className="space-y-1">
                {NAVIGATION_ITEMS.profile.map(item => renderNavigationItem(item))}
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer - User Profile & Logout */}
        <div className={`border-t p-4 ${isSidebarCollapsed ? "px-2" : "px-4"}`}>
          <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"} gap-3`}>
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar?.url || "/placeholder-avatar.jpg"}
                  alt={user?.fullName || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.fullName || "User"}</p>
                  <p className="text-xs text-muted-foreground truncate">Admin</p>
                </div>
              </div>
            )}
            
            {isSidebarCollapsed && (
              <img
                src={user?.avatar?.url || "/placeholder-avatar.jpg"}
                alt={user?.fullName || "User"}
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-8 w-8"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  Logout
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "sm:ml-20" : "sm:ml-64"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs w-80">
              <div className="flex items-center gap-2 mb-6">
                <Package2 className="h-6 w-6 text-primary" />
                <span className="font-semibold text-xl">PortfolioHub</span>
              </div>
              
              <nav className="space-y-2">
                {NAVIGATION_ITEMS.main.map(item => renderNavigationItem(item, true))}
                
                <div className="pt-4">
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Communication
                  </h3>
                  {NAVIGATION_ITEMS.communication.map(item => renderNavigationItem(item, true))}
                </div>
                
                <div className="pt-4">
                  <h3 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Profile & Settings
                  </h3>
                  {NAVIGATION_ITEMS.profile.map(item => renderNavigationItem(item, true))}
                </div>
                
                <div className="pt-6 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-between w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Logout</span>
                    </div>
                  </button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Search Bar */}
          <div className="flex flex-1 items-center gap-4">
            <div className="relative ml-auto flex-1 md:grow-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 pr-4 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </div>
        </header>

        {/* Page Header */}
        <div className="px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {NAVIGATION_ITEMS.main
                  .concat(NAVIGATION_ITEMS.communication)
                  .concat(NAVIGATION_ITEMS.profile)
                  .find(item => item.id === active)?.label || "Dashboard"}
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your portfolio and profile settings
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar?.url || "/placeholder-avatar.jpg"}
                alt={user?.fullName || "User"}
                className="h-12 w-12 rounded-full border-2 border-primary/20"
              />
              <div className="hidden md:block">
                <p className="font-semibold">Welcome back, {user?.fullName || "User"}</p>
                <p className="text-sm text-muted-foreground">Ready to build your portfolio</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;