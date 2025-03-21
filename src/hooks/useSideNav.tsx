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
import { Question } from "../types/reduxTypes";

export const useSideNav = (
  onAddQuestion: (question: Omit<Question, "id">) => void
): SideNavHook => {
  const { user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const isCreateOrEditTestPage =
    location.pathname === "/admin/tests/create" ||
    /^\/admin\/tests\/[^/]+\/edit$/.test(location.pathname);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1199);
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(
    window.innerWidth >= 1199 && !!user?.role
  );
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);
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
        if (isCreateOrEditTestPage) {
          setIsRightMenuOpen(true);
        }
      } else {
        setIsLeftMenuOpen(false);
        setIsRightMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    // ✅ Вызов при первом монтировании
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [isCreateOrEditTestPage]);

  useLayoutEffect(() => {
    if (isMobile && isCreateOrEditTestPage) {
      setIsLeftMenuOpen(false);
      setIsRightMenuOpen(false);
      setTimeout(() => setShouldShowRightBurger(true), 50);
    }
  }, [isCreateOrEditTestPage, isMobile]);

  useLayoutEffect(() => {
    if (!isMobile && isCreateOrEditTestPage) {
      setShouldShowRightBurger(true);
    }
  }, [isMobile, isCreateOrEditTestPage]);

  useEffect(() => {
    if (!isCreateOrEditTestPage) {
      setIsRightMenuOpen(false);
      setShouldShowRightBurger(false);
      localStorage.removeItem("rightMenuOpen");
    }
  }, [isCreateOrEditTestPage]);

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
          if (isCreateOrEditTestPage) {
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
      isCreateOrEditTestPage,
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

  const handleSaveQuestion = useCallback(
    (question: Omit<Question, "id">) => {
      onAddQuestion(question);
      setOpenQuestionType(null);
    },
    [onAddQuestion]
  );

  const handleAddClick = useCallback(
    (path: string) => {
      navigate(path);
      const isTargetCreateOrEdit =
        path === "/admin/tests/create" ||
        /^\/admin\/tests\/[^/]+\/edit$/.test(path);

      if (isTargetCreateOrEdit) {
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
          onAddClick: () => handleAddClick("/admin/tests/create"),
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
    if (!isCreateOrEditTestPage) return [];
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
  }, [isCreateOrEditTestPage, openQuestionModal]);

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
    handleSaveQuestion,
  };
};
