import * as React from "react";
import {
  BadgeDollarSign,
  Command,
  FilePlus2,
  LayoutDashboard,
  Settings2,
  Store,
  TrendingUp,
  Truck,
  UserPlus2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";
import { NavMain } from "./nav-main";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "react-i18next";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const data = {
    navMain: [
      { title: t("sidebar.dashboard"), url: "/", icon: LayoutDashboard },
      {
        title: t("sidebar.createOrder"),
        url: "/createOrder",
        icon: FilePlus2,
      },
      { title: t("sidebar.inventory"), url: "/inventory", icon: Store },
      { title: t("sidebar.customers"), url: "/customers", icon: UserPlus2 },
      { title: t("sidebar.suppliers"), url: "/suppliers", icon: Truck },
      { title: t("sidebar.expenses"), url: "/expenses", icon: BadgeDollarSign },
      { title: t("sidebar.reports"), url: "/reports", icon: TrendingUp },
      { title: t("sidebar.settings"), url: "/settings", icon: Settings2 },
    ],
    user: {
      name: "zain",
      email: "zain@gmail.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Apprex Systems</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="text-2xl tracking-normal">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
        <ThemeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
