import { useRoutes, useLocation } from "react-router-dom";
import { Suspense } from "react";
import { AppSidebar } from "./app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import routes from "../routes";
import { useTranslation } from "react-i18next";
import { Skeleton } from "./ui/skeleton";
import LanguageToggle from "./LanguageToggle";

export default function AppContent() {
  const element = useRoutes(routes);
  const location = useLocation();
  const { t } = useTranslation();

  const titleMap: Record<string, string> = {
    "/": t("sidebar.dashboard"),
    "/createOrder": t("sidebar.createOrder"),
    "/inventory": t("sidebar.inventory"),
    "/customers": t("sidebar.customers"),
    "/suppliers": t("sidebar.suppliers"),
    "/expenses": t("sidebar.expenses"),
    "/reports": t("sidebar.reports"),
    "/settings": t("sidebar.settings"),
  };

  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* Sidebar */}
        <AppSidebar className="w-64" />
        {/* Main Content Area */}
        <SidebarInset className="flex-1">
          <header className="px-1 h-14 flex w-full justify-between items-center transition[width, height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
            <div className="flex items-center gap-2 px-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {location.pathname !== "/" && (
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbPage>
                        {titleMap[location.pathname] || "Page"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* <input type="text" className="bg-red-300" /> */}
              <LanguageToggle/>
            </div>
          </header>
          {/* Page Content */}
          <div className=" grid grid-cols-1 p-4">
            <Suspense fallback={<Skeleton />}>{element}</Suspense>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
