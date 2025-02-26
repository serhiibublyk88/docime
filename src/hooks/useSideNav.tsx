import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../redux";
import { roles } from "../constants";
import {
  FaUsers,
  FaFileAlt,
  FaChartBar,
  FaPlus,
  FaCheck,
  FaList,
  FaHashtag,
  FaFont,
} from "react-icons/fa";
import { MenuItem } from "../types/uiTypes";
import { SideNavHook } from "../types/hookTypes";

export const useSideNav = (): SideNavHook => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(
    window.innerWidth >= 768 && !!user?.role
  );
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [shouldShowRightBurger, setShouldShowRightBurger] = useState(false);

  // ✅ Плавное определение мобильной версии при изменении размера экрана
  useEffect(() => {
    let timeout: number | null = null;

    const handleResize = () => {
      if (timeout !== null) clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        const newIsMobile = window.innerWidth < 768;
        setIsMobile(newIsMobile);

        if (!newIsMobile) {
          setIsLeftMenuOpen(true);
          if (location.pathname === "/admin/create-test") {
            setIsRightMenuOpen(true);
          }
        } else {
          setIsLeftMenuOpen(false);
          setIsRightMenuOpen(false);
        }
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      if (timeout !== null) clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  // ✅ Закрываем левое меню при переходе на `/admin/create-test` (мобилка)
  useLayoutEffect(() => {
    if (isMobile && location.pathname === "/admin/create-test") {
      setIsLeftMenuOpen(false);
      setIsRightMenuOpen(false);
      setTimeout(() => setShouldShowRightBurger(true), 50);
    }
  }, [location.pathname, isMobile]);

  // ✅ Отключаем правое меню при уходе со страницы `/admin/create-test`
  useEffect(() => {
    if (location.pathname !== "/admin/create-test") {
      setIsRightMenuOpen(false);
      setShouldShowRightBurger(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user?.role !== undefined) {
      setIsLeftMenuOpen(window.innerWidth >= 768);
    }
  }, [user]);

  // ✅ Универсальная функция переключения меню (с перекрёстным закрытием)
  const toggleMenu = useCallback(
    (menu: "left" | "right") => {
      if (isMobile) {
        setIsLeftMenuOpen(menu === "left" ? (prev) => !prev : false);
        setIsRightMenuOpen(menu === "right" ? (prev) => !prev : false);
      } else if (menu === "right") {
        setIsRightMenuOpen(true);
      }
    },
    [isMobile]
  );

  const toggleLeftMenu = useCallback(() => toggleMenu("left"), [toggleMenu]);
  const toggleRightMenu = useCallback(() => toggleMenu("right"), [toggleMenu]);

  // ✅ Открываем правое меню при переходе (но только на десктопе)
  const handleAddClick = useCallback(
    (path: string) => {
      navigate(path);
      if (path === "/admin/create-test") {
        if (!isMobile) {
          setIsRightMenuOpen(true);
        } else {
          setIsRightMenuOpen(false);
        }
      }
    },
    [navigate, isMobile]
  );

  // ✅ Левое меню по ролям
  const leftMenuItems = useMemo<MenuItem[]>(() => {
    if (!user) return [];

    if (user.role === roles.TEST_CREATOR) {
      return [
        {
          label: "Gruppen",
          path: "/admin/groups",
          icon: <FaUsers />,
          addIcon: <FaPlus />,
          onAddClick: () => setIsGroupModalOpen(true),
        },
        {
          label: "Tests",
          path: "/admin/tests",
          icon: <FaFileAlt />,
          addIcon: <FaPlus />,
          onAddClick: () => handleAddClick("/admin/create-test"),
        },
        { label: "Ergebnisse", path: "/admin/results", icon: <FaChartBar /> },
      ];
    }

    if (user.role === roles.USER) {
      return [
        { label: "Tests", path: "/tests", icon: <FaFileAlt /> },
        { label: "Ergebnisse", path: "/results", icon: <FaChartBar /> },
      ];
    }

    return [];
  }, [user, handleAddClick]);

  // ✅ Правое меню
  const rightMenuItems = useMemo<MenuItem[]>(() => {
    if (location.pathname !== "/admin/create-test") return [];
    return [
      { label: "Einzelauswahl", path: "#single", icon: <FaCheck /> },
      { label: "Mehrfachauswahl", path: "#multiple", icon: <FaList /> },
      { label: "Zahleneingabe", path: "#number", icon: <FaHashtag /> },
      { label: "Texteingabe", path: "#text", icon: <FaFont /> },
    ];
  }, [location.pathname]);

  return {
    isMobile,
    isLeftMenuOpen,
    isRightMenuOpen,
    setIsLeftMenuOpen: toggleLeftMenu,
    setIsRightMenuOpen: toggleRightMenu,
    leftMenuItems,
    rightMenuItems,
    user,
    isGroupModalOpen,
    setIsGroupModalOpen,
    shouldShowBurgers: isMobile,
    shouldShowRightBurger,
  };
};
