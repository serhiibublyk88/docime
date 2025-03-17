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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1199);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(
    window.innerWidth >= 1199 && !!user?.role
  );
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(
    window.innerWidth >= 1199 &&
      location.pathname === "/admin/create-test" &&
      localStorage.getItem("rightMenuOpen") === "true"
  );
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [openQuestionType, setOpenQuestionType] = useState<
    "single" | "multiple" | "number" | "text" | null
  >(null);
  const [shouldShowRightBurger, setShouldShowRightBurger] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 1199;
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
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (isMobile && location.pathname === "/admin/create-test") {
      setIsLeftMenuOpen(false);
      setIsRightMenuOpen(false);
      setTimeout(() => setShouldShowRightBurger(true), 50);
    }
  }, [location.pathname, isMobile]);

  useEffect(() => {
    if (location.pathname !== "/admin/create-test") {
      setIsRightMenuOpen(false);
      setShouldShowRightBurger(false);
      localStorage.removeItem("rightMenuOpen");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user?.role !== undefined) {
      setIsLeftMenuOpen(window.innerWidth >= 1199);
    }
  }, [user]);

  const toggleMenu = useCallback(
    (menu: "left" | "right", event?: React.MouseEvent) => {
      event?.preventDefault();
      event?.stopPropagation();

      if (isMobile) {
        if (menu === "left") {
          setIsLeftMenuOpen((prev) => !prev);
          setIsRightMenuOpen(false);
        } else if (menu === "right") {
          setIsRightMenuOpen((prev) => !prev);
          setIsLeftMenuOpen(false);
        }
      } else {
        if (menu === "right") {
          if (location.pathname === "/admin/create-test") {
            setIsRightMenuOpen(true);
            localStorage.setItem("rightMenuOpen", "true");
          } else {
            setIsRightMenuOpen((prev) => !prev);
            localStorage.setItem("rightMenuOpen", String(!isRightMenuOpen));
          }
        }
      }
    },
    [
      isMobile,
      location.pathname,
      setIsLeftMenuOpen,
      setIsRightMenuOpen,
      isRightMenuOpen,
    ]
  );

  const toggleLeftMenu = useCallback(() => toggleMenu("left"), [toggleMenu]);
  const toggleRightMenu = useCallback(() => toggleMenu("right"), [toggleMenu]);

  const openQuestionModal = useCallback(
    (type: "single" | "multiple" | "number" | "text") => {
      setOpenQuestionType(type);
    },
    []
  );

  const handleAddClick = useCallback(
    (path: string) => {
      navigate(path);
      if (path === "/admin/create-test") {
        if (!isMobile) {
          setIsRightMenuOpen(true);
          localStorage.setItem("rightMenuOpen", "true");
        } else {
          setIsRightMenuOpen(false);
        }
      }
    },
    [navigate, isMobile]
  );

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

  const rightMenuItems = useMemo<MenuItem[]>(() => {
    if (location.pathname !== "/admin/create-test") return [];
    return [
      {
        label: "Einzelauswahl",
        path: "",
        icon: <FaCheck />,
        addIcon: <FaPlus />,
        onAddClick: () => openQuestionModal("single"),
      },
      {
        label: "Mehrfachauswahl",
        path: "",
        icon: <FaList />,
        addIcon: <FaPlus />,
        onAddClick: () => openQuestionModal("multiple"),
      },
      {
        label: "Zahleneingabe",
        path: "",
        icon: <FaHashtag />,
        addIcon: <FaPlus />,
        onAddClick: () => openQuestionModal("number"),
      },
      {
        label: "Texteingabe",
        path: "",
        icon: <FaFont />,
        addIcon: <FaPlus />,
        onAddClick: () => openQuestionModal("text"),
      },
    ];
  }, [location.pathname, openQuestionModal]); // ✅ Добавляем openQuestionModal в зависимости

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
    openQuestionType,
    setOpenQuestionType,
  };
};
