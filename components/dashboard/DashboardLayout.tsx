import React from "react";
import Navbar from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  backgroundClassName?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  backgroundClassName = "bg-[#242424]",
}) => {
  return (
    <div className={`min-h-screen ${backgroundClassName} pt-20`}>
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;

