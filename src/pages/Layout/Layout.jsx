import React from "react";
import AppRoutes from "../../routes/AppRoutes";
import Header from "../../components/Header/Header";
import SideNav from "../../components/SideNav/SideNav";
import { useAuth } from "../../routes/Authenticator";
const Layout = () => {
  const { isAuthenticated } = useAuth();
  return (
    <div className="app-container min-vh-100">
      {isAuthenticated ? (
        <div className="d-flex flex-column h-100">
          <Header />
          <div className="d-flex flex-grow-1">
            <SideNav />
            <main className="flex-grow-1 p-4 overflow-auto">
              <AppRoutes />
            </main>
          </div>
        </div>
      ) : (
        <main className="w-100 min-vh-100">
          <AppRoutes />
        </main>
      )}
    </div>
  );
};
export default Layout;
