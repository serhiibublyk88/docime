import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SideNav.module.css";
import { SideNavProps } from "../../../types/uiTypes";

export const SideNav = ({
  position = "left",
  items,
  isOpen,
  onClose,
}: SideNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (!isMobile && position === "right") onClose();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, onClose, isMobile]);

  
  const handleClick = (
    e: React.MouseEvent,
    path: string,
    onAddClick?: () => void
  ) => {
    if (onAddClick) {
      e.stopPropagation();
      onAddClick();
      if (isMobile && position === "left" && path === "/admin/tests") {
        onClose(); 
      }
    } else {
      navigate(path);
      if (isMobile) onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`${styles.sideNav} position-fixed vh-100 shadow 
      ${position === "left" ? "start-0" : "end-0"}`}
    >
      <div className="d-flex flex-column pt-3">
        {items.map(({ label, path, icon, addIcon, onAddClick }) => (
          <div
            key={path}
            className={`d-flex align-items-center p-3 ${styles.navItem} ${
              location.pathname === path ? styles.active : ""
            }`}
            onClick={
              position === "right" ? undefined : (e) => handleClick(e, path)
            }
          >
           
            {position === "left" ? (
              <>
                {icon && (
                  <span className="d-flex icon align-items-center me-3">
                    {icon}
                  </span>
                )}
                <button className="d-flex align-items-center border-0 bg-transparent p-0 flex-grow-1">
                  <span className="text-start">{label}</span>
                </button>
                {addIcon && (
                  <span
                    className="ms-auto add-icon"
                    onClick={(e) => handleClick(e, path, onAddClick)}
                  >
                    {addIcon}
                  </span>
                )}
              </>
            ) : (
              
              <>
                {addIcon && (
                  <span
                    className="me-3 add-icon"
                    onClick={(e) => handleClick(e, path, onAddClick)}
                  >
                    {addIcon}
                  </span>
                )}
                <button className="d-flex align-items-center flex-grow-1 border-0 bg-transparent p-0">
                  <span className="text-end flex-grow-1">{label}</span>
                </button>
                {icon && (
                  <span className="ms-3 d-flex icon align-items-center">
                    {icon}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
