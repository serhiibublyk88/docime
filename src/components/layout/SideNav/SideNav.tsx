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

  // ✅ Отслеживаем размер экрана
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // ✅ Если увеличиваем экран → закрываем бургер и показываем меню
      if (!newIsMobile && position === "right") {
        onClose(); // Закрываем бургер
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, onClose]);

  // ✅ Функция навигации (переход + закрытие меню на мобильных)
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  // ✅ Закрытие меню при клике вне него
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (target.closest("[data-menu-toggle]")) return;

      if (menuRef.current && !menuRef.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`${styles.sideNav} position-fixed vh-100 shadow 
      } ${position === "left" ? "start-0" : "end-0"}`}
    >
      <div className="d-flex flex-column pt-3">
        {items.map(({ label, path, icon, addIcon, onAddClick }) => (
          <div
            key={path}
            className={`d-flex align-items-center p-3 ${styles.navItem} ${
              location.pathname === path ? styles.active : ""
            }`}
          >
            {/* ✅ Переход по пункту меню */}
            <button
              className="d-flex align-items-center w-100 border-0 bg-transparent p-0"
              onClick={() => handleNavigation(path)}
            >
              {icon && (
                <span className="d-flex icon align-items-center me-3">
                  {icon}
                </span>
              )}
              <span>{label}</span>
            </button>

            {/* ✅ Плюсики: правильная обработка */}
            {addIcon && (
              <span
                className="ms-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAddClick) onAddClick();
                }}
              >
                {addIcon}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
