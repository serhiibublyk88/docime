import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SideNav.module.css";
import { SideNavProps } from "../../../types/uiTypes"; 

export const SideNav = ({
  position = "left",
  items,
  isMobile = false,
  isOpen,
  onClose,
}: SideNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.sideNav} position-fixed vh-100 shadow ${
        position === "left" ? "start-0" : "end-0"
      } ${isMobile && !isOpen ? "d-none" : ""}`}
    >
      {items.map((item) => (
        <div
          key={item.path} 
          className={`${styles.navItem} d-flex align-items-center p-4 ps-4 ${
            location.pathname === item.path ? styles.active : ""
          }`}
          onClick={() => handleNavigation(item.path)}
        >
          {item.icon && (
            <span className="d-flex icon align-items-center me-3">
              {item.icon}
            </span>
          )}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// поделючение пример
// import { useState } from "react";
// import { FaHome, FaListAlt, FaUser } from "react-icons/fa";
// import SideNav from "../../components/layout/SideNav/SideNav";

// const menuItems = [
//   { label: "Home", path: "/", icon: <FaHome /> },
//   { label: "Tests", path: "/tests", icon: <FaListAlt /> },
//   { label: "Profile", path: "/profile", icon: <FaUser /> },
// ];

// const [isMenuOpen, setIsMenuOpen] = useState(true);
