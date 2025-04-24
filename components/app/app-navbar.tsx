"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  PieChart,
  Users,
  BookOpenText,
  Menu,
  X,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import StoardLogo from "@/public/icons/logo";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

export function AppNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:flex-1">
          <StoardLogo size={"1.5rem"} />
          <span className="font-semibold hidden sm:inline">Stoard</span>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/" && pathname.startsWith(item.url));
                return (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.url} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "gap-2 flex items-center justify-center",
                          isActive &&
                            "border-b-2 border-primary font-semibold shadow-none bg-transparent text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4 md:flex-1 md:justify-end">
          <ModeToggle />

          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent focus-visible:ring-0"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 p-4 border-b">
                  <StoardLogo size={"1.5rem"} />
                  <span className="font-semibold">Stoard</span>
                </div>
                <nav className="flex-1 flex flex-col gap-1 p-4">
                  {items.map((item) => {
                    const isActive =
                      pathname === item.url ||
                      (item.url !== "/" && pathname.startsWith(item.url));
                    return (
                      <Link
                        key={item.title}
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "border-b-2 border-primary font-semibold text-primary bg-transparent"
                            : "hover:underline hover:text-primary"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </Link>
                    );
                  })}
                </nav>
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}