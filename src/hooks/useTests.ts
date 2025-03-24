import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  getTests,
  fetchAllGroups,
  addTest,
  editTest,
  removeTest,
  duplicatTest,
  updateTestGroups,
  setCurrentTest,
  changeTestStatus,
  selectAllTest,
  selectTestLoading,
  selectTestError,
  selectSelectedTest,
  selectAllGroups,
} from "../redux";
import { Test, TestPayload, QuestionType } from "../types/reduxTypes";

// ✅ Маппер типов с бэка (string) в QuestionType
const mapBackendToFrontendType = (type: string): QuestionType => {
  switch (type) {
    case "single-choice":
      return "single";
    case "multiple-choice":
      return "multiple";
    case "number-input":
      return "number";
    case "text-input":
      return "text";
    default:
      return "single";
  }
};

export const useTests = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tests = useSelector(selectAllTest);
  const currentTest = useSelector(selectSelectedTest);
  const loading = useSelector(selectTestLoading);
  const error = useSelector(selectTestError);
  const allGroups = useSelector(selectAllGroups);

  const [selectedGroups, setSelectedGroups] = useState<
    Record<string, { id: string; name: string }[]>
  >({});

  useEffect(() => {
    if (currentTest) {
      setSelectedGroups((prev) => ({
        ...prev,
        [currentTest.id]: currentTest.availableForGroups.map((g) => ({
          id: g.id,
          name: g.name,
        })),
      }));
    }
  }, [currentTest]);

  useEffect(() => {
    if (tests.length) {
      setSelectedGroups(
  tests.reduce((acc, test) => {
    acc[test.id] = (test.availableForGroups ?? []).map((g) => ({
      id: g.id,
      name: g.name,
    }));
    return acc;
  }, {} as Record<string, { id: string; name: string }[]>)
);

    }
  }, [tests]);

  const fetchAllTests = useCallback(() => {
    dispatch(getTests()).catch(() => {});
  }, [dispatch]);

  const fetchAllGroupsList = useCallback(() => {
    dispatch(fetchAllGroups()).catch(() => {});
  }, [dispatch]);

  const createNewTest = useCallback(
    (data: TestPayload) => {
      dispatch(addTest(data)).catch(() => {});
    },
    [dispatch]
  );

  const updateExistingTest = useCallback(
    (testId: string, data: TestPayload) => {
      dispatch(editTest({ testId, testData: data })).catch(() => {});
    },
    [dispatch]
  );

  const deleteExistingTest = useCallback(
    (testId: string) => {
      dispatch(removeTest(testId)).catch(() => {});
    },
    [dispatch]
  );

  const copyExistingTest = useCallback(
    async (testId: string): Promise<Test | undefined> => {
      try {
        const copied = await dispatch(duplicatTest(testId)).unwrap();
        if (!copied?.questions) return copied;

        const mapped: Test = {
          ...copied,
          questions: copied.questions.map((q) => ({
            ...q,
            type: mapBackendToFrontendType(q.type),
          })),
        };

        return mapped;
      } catch {
        return undefined;
      }
    },
    [dispatch]
  );

  const handleGroupChange = useCallback(
    (testId: string, groupId: string) => {
      setSelectedGroups((prev) => {
        const updatedGroups = prev[testId] || [];
        const group = allGroups.find((g) => g.id === groupId);
        if (!group) return prev;

        return {
          ...prev,
          [testId]: updatedGroups.some((g) => g.id === groupId)
            ? updatedGroups.filter((g) => g.id !== groupId)
            : [...updatedGroups, { id: group.id, name: group.name }],
        };
      });
    },
    [allGroups]
  );

  const applyGroupChanges = useCallback(
    async (testId: string) => {
      if (!testId || !selectedGroups[testId]) return;

      await dispatch(
        updateTestGroups({
          testId,
          groupIds: selectedGroups[testId].map((g) => g.id),
        })
      ).unwrap();

      setSelectedGroups((prev) => ({
        ...prev,
        [testId]: selectedGroups[testId],
      }));
    },
    [dispatch, selectedGroups]
  );

  const toggleTestStatus = useCallback(
    (testId: string, currentStatus: "active" | "inactive") => {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      dispatch(changeTestStatus({ testId, status: newStatus }));
    },
    [dispatch]
  );

  const setSelectedTest = useCallback(
    (test: Test | null) => {
      if (test && test.questions) {
        const mappedTest: Test = {
          ...test,
          questions: test.questions.map((q) => ({
            ...q,
            type: mapBackendToFrontendType(q.type),
          })),
        };
        dispatch(setCurrentTest(mappedTest));
      } else {
        dispatch(setCurrentTest(test));
      }
    },
    [dispatch]
  );

  return {
    tests,
    allGroups,
    selectedGroups,
    loading,
    error,
    currentTest,
    fetchAllTests,
    fetchAllGroupsList,
    createNewTest,
    updateExistingTest,
    deleteExistingTest,
    copyExistingTest,
    setSelectedTest,
    handleGroupChange,
    applyGroupChanges,
    toggleTestStatus,
  };
};
