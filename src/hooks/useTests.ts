import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  RootState,
  fetchTests,
  fetchAllGroups,
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
  selectAvailableGroupsForTest,
  selectAllGroups,
} from "../redux";
import { Test } from "../types/reduxTypes";

export const useTests = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tests = useSelector(selectAllTests);
  const currentTest = useSelector(selectCurrentTest);
  const loading = useSelector(selectTestsLoading);
  const error = useSelector(selectTestsError);
  const allGroups = useSelector(selectAllGroups);

  // ✅ Исправление: Получаем доступные группы **только для выбранного теста**
  const availableGroups = useSelector((state: RootState) =>
    selectAvailableGroupsForTest(state, currentTest?.id ?? "")
  );

  // ✅ Загрузка тестов и всех групп **один раз при монтировании**
  useEffect(() => {
    if (tests.length === 0) {
      dispatch(fetchTests())
        .unwrap()
        .catch((error) =>
          console.error("❌ [useTests] Fehler beim Abrufen der Tests:", error)
        );
    }

    if (allGroups.length === 0) {
      dispatch(fetchAllGroups())
        .unwrap()
        .catch((error) =>
          console.error("❌ [useTests] Fehler beim Abrufen der Gruppen:", error)
        );
    }
  }, [dispatch, tests.length, allGroups.length]); // ✅ Добавили `tests.length` и `allGroups.length`

  // ✅ Принудительная загрузка тестов
  const fetchAllTests = useCallback(() => {
    dispatch(fetchTests())
      .unwrap()
      .catch((error) =>
        console.error("❌ [useTests] Fehler beim Abrufen der Tests:", error)
      );
  }, [dispatch]);

  // ✅ Группы загружаются **только если передан testId**
  const fetchGroups = useCallback(
    (testId: string) => {
      if (!testId) return;
      dispatch(fetchAllGroups()) // 🔹 **Фикс:** Загружаем группы только если `testId` пустой
        .unwrap()
        .catch((error) =>
          console.error("❌ [useTests] Fehler beim Abrufen der Gruppen:", error)
        );
    },
    [dispatch]
  );

  const createNewTest = useCallback(
    (data: Partial<Test>) => {
      dispatch(createTest(data))
        .unwrap()
        .catch((error) =>
          console.error("❌ [useTests] Fehler beim Erstellen des Tests:", error)
        );
    },
    [dispatch]
  );

  const updateExistingTest = useCallback(
    (testId: string, data: Partial<Test>) => {
      dispatch(updateTest({ testId, data }))
        .unwrap()
        .catch((error) =>
          console.error(
            "❌ [useTests] Fehler beim Aktualisieren des Tests:",
            error
          )
        );
    },
    [dispatch]
  );

  const deleteExistingTest = useCallback(
    (testId: string) => {
      dispatch(deleteTest(testId))
        .unwrap()
        .catch((error) =>
          console.error("❌ [useTests] Fehler beim Löschen des Tests:", error)
        );
    },
    [dispatch]
  );

  const copyExistingTest = useCallback(
    (testId: string) => {
      dispatch(copyTest(testId))
        .unwrap()
        .catch((error) =>
          console.error("❌ [useTests] Fehler beim Kopieren des Tests:", error)
        );
    },
    [dispatch]
  );

  // ✅ Исправлено: Теперь загружаем группы **только для конкретного теста**
  const updateTestGroupAccess = useCallback(
    async (testId: string, groupId: string, action: "add" | "remove") => {
      if (!testId || !groupId || !["add", "remove"].includes(action)) {
        console.warn("⚠️ Ungültige Parameter für updateTestGroupAccess:", {
          testId,
          groupId,
          action,
        });
        return;
      }

      try {
        console.log(
          `📡 [useTests] Aktualisiere Gruppen für Test ${testId}, Aktion: ${action}`
        );

        await dispatch(updateTestGroups({ testId, groupId, action })).unwrap();

        console.log(
          `✅ [useTests] Gruppen für Test ${testId} erfolgreich aktualisiert`
        );

        // 🔹 **Фикс:** Вместо `fetchAllGroups()` загружаем **только группы для теста**
        fetchGroups(testId);
      } catch (error) {
        console.error(
          "❌ [useTests] Fehler beim Aktualisieren der Gruppen:",
          error
        );
      }
    },
    [dispatch, fetchGroups] // 🔹 **Исправлено:** Добавлен `fetchGroups`
  );

  const setSelectedTest = useCallback(
    (test: Test | null) => {
      dispatch(setCurrentTest(test));
    },
    [dispatch]
  );

  return {
    tests,
    availableGroups,
    allGroups,
    loading,
    error,
    currentTest,
    fetchAllTests,
    fetchGroups,
    createNewTest,
    updateExistingTest,
    deleteExistingTest,
    copyExistingTest,
    updateTestGroupAccess,
    setSelectedTest,
  };
};
