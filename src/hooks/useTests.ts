import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  fetchTests,
  fetchAllGroups, // ✅ Загружаем все группы
  createTest,
  updateTest,
  deleteTest,
  copyTest,
  updateTestGroups,
  setCurrentTest,
  selectAllTests,
  selectTestsLoading,
  selectTestsError,
  selectCurrentTest,
  selectAllGroups, // ✅ Получаем группы корректно
} from "../redux";
import { Test } from "../types/reduxTypes";

export const useTests = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tests = useSelector(selectAllTests) || [];
  const allGroups = useSelector(selectAllGroups) || []; // ✅ Корректный селектор групп
  const loading = useSelector(selectTestsLoading);
  const error = useSelector(selectTestsError);
  const currentTest = useSelector(selectCurrentTest);

  /// 🔄 **Загрузка тестов и групп при монтировании**
  useEffect(() => {
    if (tests.length === 0) {
      console.warn("Lade Tests...");
      dispatch(fetchTests())
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Abrufen der Tests:", error);
        });
    }

    if (allGroups.length === 0) {
      console.warn("Lade Gruppen...");
      dispatch(fetchAllGroups())
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Abrufen der Gruppen:", error);
        });
    }
  }, [dispatch, tests.length, allGroups.length]);

  /// 🔄 **Принудительная загрузка тестов**
  const fetchAllTests = useCallback(() => {
    console.warn("Erzwinge Test-Aktualisierung...");
    dispatch(fetchTests())
      .unwrap()
      .catch((error) => {
        console.error("Fehler beim Abrufen der Tests:", error);
      });
  }, [dispatch]);

  /// 🔄 **Принудительная загрузка групп**
  const fetchGroups = useCallback(() => {
    console.warn("Erzwinge Gruppen-Aktualisierung...");
    dispatch(fetchAllGroups())
      .unwrap()
      .catch((error) => {
        console.error("Fehler beim Abrufen der Gruppen:", error);
      });
  }, [dispatch]);

  /// ✨ **Создание нового теста**
  const createNewTest = useCallback(
    (data: Partial<Test>) => {
      dispatch(createTest(data))
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Erstellen des Tests:", error);
        });
    },
    [dispatch]
  );

  /// ✨ **Обновление теста**
  const updateExistingTest = useCallback(
    (testId: string, data: Partial<Test>) => {
      dispatch(updateTest({ testId, data }))
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Aktualisieren des Tests:", error);
        });
    },
    [dispatch]
  );

  /// ❌ **Удаление теста**
  const deleteExistingTest = useCallback(
    (testId: string) => {
      dispatch(deleteTest(testId))
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Löschen des Tests:", error);
        });
    },
    [dispatch]
  );

  /// 📑 **Копирование теста**
  const copyExistingTest = useCallback(
    (testId: string) => {
      dispatch(copyTest(testId))
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Kopieren des Tests:", error);
        });
    },
    [dispatch]
  );

  /// 🔄 **Обновление доступных групп**
  const updateTestGroupAccess = useCallback(
    (testId: string, groupId: string, action: "add" | "remove") => {
      if (!testId || !groupId || !["add", "remove"].includes(action)) {
        console.warn("Ungültige Parameter für updateTestGroupAccess:", {
          testId,
          groupId,
          action,
        });
        return;
      }

      dispatch(updateTestGroups({ testId, groupId, action }))
        .unwrap()
        .catch((error) => {
          console.error("Fehler beim Aktualisieren der Testgruppen:", error);
        });
    },
    [dispatch]
  );

  /// 🎯 **Выбор текущего теста**
  const setSelectedTest = useCallback(
    (test: Test | null) => {
      dispatch(setCurrentTest(test));
    },
    [dispatch]
  );

  return {
    tests,
    allGroups, // ✅ Получаем корректные группы
    loading,
    error,
    currentTest,
    fetchAllTests,
    fetchGroups, // ✅ Отдельная загрузка групп
    createNewTest,
    updateExistingTest,
    deleteExistingTest,
    copyExistingTest,
    updateTestGroupAccess,
    setSelectedTest,
  };
};
