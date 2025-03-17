import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SideNavProps } from "../../../types/uiTypes";
import styles from "./SideNav.module.css";

export const SideNav = ({
  position = "left",
  items,
  isOpen,
  onClose,
}: SideNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1199);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1199);
      if (!isMobile && position === "right") onClose();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, onClose, isMobile]);

  const handleClick = (
    e: React.MouseEvent,
    path: string,
    onAddClick?: () => void,
    isPlusIcon?: boolean // ✅ Добавляем флаг
  ) => {
    e.stopPropagation();

    if (onAddClick && isPlusIcon) {
      onAddClick();
      if (isMobile && position === "left" && path === "/admin/tests") {
        onClose();
      }
    } else if (path) {
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
      className={`${styles.sideNav} position-fixed vh-100 shadow bg-dark
      ${position === "left" ? "start-0" : "end-0"}`}
    >
      <div className="d-flex flex-column pt-3">
        {items.map(({ label, path, icon, addIcon, onAddClick }) => (
          <div
            key={path || label}
            className={`d-flex align-items-center p-3 ${styles.navItem} ${
              position === "left" && location.pathname === path
                ? styles.active
                : ""
            }`}
            onClick={
              position === "right" && onAddClick
                ? undefined
                : (e) => handleClick(e, path)
            }
          >
            {position === "left" ? (
              <>
                {icon && (
                  <span className="d-flex icon align-items-center me-3">
                    {icon}
                  </span>
                )}
                {/* ✅ Клик по кнопке ведёт на страницу */}
                <button
                  className="d-flex align-items-center border-0 bg-transparent p-0 flex-grow-1"
                  onClick={(e) => handleClick(e, path)}
                >
                  <span className="text-start">{label}</span>
                </button>
                {/* ✅ Клик по плюсик вызывает `onAddClick` */}
                {addIcon && (
                  <span
                    className="ms-auto add-icon"
                    onClick={(e) => handleClick(e, path, onAddClick, true)}
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
                    onClick={(e) => handleClick(e, path, onAddClick, true)}
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
