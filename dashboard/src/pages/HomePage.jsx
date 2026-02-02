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
  ChevronRight,
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

// Navigation configuration - single source of truth
const NAVIGATION_ITEMS = {
  main: [
    {
      id: "Dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      id: "Add Project",
      label: "Add Project",
      icon: FolderGit,
    },
    {
      id: "Add Skill",
      label: "Add Skill",
      icon: PencilRuler,
    },
    {
      id: "Add Uses",
      label: "Add Uses",
      icon: LayoutGrid,
    },
    {
      id: "Add Timeline",
      label: "Add Timeline",
      icon: History,
    },
  ],
  communication: [
    {
      id: "Messages",
      label: "Messages",
      icon: MessageSquareMore,
      badge: true,
    },
  ],
  profile: [
    {
      id: "Account",
      label: "Account",
      icon: User,
    },
  ],
};

const HomePage = () => {
  const [active, setActive] = useState("Dashboard");
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
    }
    if (!isAuthenticated) {
      navigateTo("/login");
    }
  }, [isAuthenticated]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    setSidebarWidth(isSidebarCollapsed ? "w-64" : "w-20");
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
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 max-[900px]:h-[100px]">
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

          <div className="flex items-center gap-4 md:grow-0 sm:ml-16 sm:mt-5">
            <img
              src={user && user.avatar && user.avatar.url}
              alt="avatar"
              className="w-20 h-20 rounded-full max-[900px]:hidden"
            />
            <h1 className="text-4xl max-[900px]:text-2xl">
              Welcome back, {user.fullName}
            </h1>
          </div>
        </header>

        {/* Main Content - Original Switch Logic */}
        {(() => {
          switch (active) {
            case "Dashboard":
              return <Dashboard />;
              break;
            case "Add Project":
              return <AddProject />;
              break;
            case "Add Skill":
              return <AddSkill />;
              break;
            case "Add Uses":
              return <AddSoftwareApplications />;
              break;
            case "Add Timeline":
              return <AddTimeline />;
              break;
            case "Messages":
              return <Messages />;
              break;
            case "Account":
              return <Account />;
              break;
            default:
              return <Dashboard />;
              break;
          }
        })()}
      </div>
    </div>
  );
};

export default HomePage;