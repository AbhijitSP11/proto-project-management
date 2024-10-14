"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import AuthProvider from "./authProvider";
import ClientProvider from "./ClientProvider";
import ChatBot from "@/components/chatbot";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="relative flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-100">
    <Sidebar />
    <main
      className={`flex w-full flex-col transition-all duration-300 ${
        isSidebarCollapsed ? "ml-0" : "ml-0 md:ml-64"
      }`}
    >
      <div className={`fixed top-0 z-10 transition-all duration-300 ${
        isSidebarCollapsed ? "w-full" : "w-full md:w-[calc(100%-16rem)]"
      }`}>
        <Navbar />
      </div>
      <div className="flex-1 overflow-auto mt-16 p-4"> 
        {children}
      </div>
      <div className="w-full">
        <ChatBot />
      </div>
    </main>
  </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <ClientProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </ClientProvider>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;