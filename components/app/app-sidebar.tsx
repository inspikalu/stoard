"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import StoardLogo from "@/public/icons/logo";
import {
  LayoutDashboard,
  ShieldCheck,
  PieChart,
  Users,
  BookOpenText,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation"; // Import usePathname from Next.js

const items = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Validators",
    url: "/validators",
    icon: ShieldCheck,
  },
  {
    title: "Distribution",
    url: "/distribution",
    icon: PieChart,
  },
  {
    title: "Participation",
    url: "/participation",
    icon: Users,
  },
  {
    title: "About",
    url: "/about",
    icon: BookOpenText,
  },
];

export function AppSidebar() {
  const pathname = usePathname(); // Get current path
  
  return (
    <Sidebar>
      <SidebarHeader className="w-full flex items-start justify-start md:items-start p-4">
        <div className="flex items-center gap-2"> 
        <StoardLogo size={"2rem"} /> <p>Stoard</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url || 
                                 (item.url !== '/' && pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={item.url}
                        className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                          isActive 
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <item.icon className={`${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground/70">Theme</span>
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}