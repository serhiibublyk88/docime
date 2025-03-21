import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AppDispatch,
  getTests, // ✅ заменили fetchTests на getTests
  fetchAllGroups,
  createTest,
  updateTest,
  deleteTest,
  copyTest,
  updateTestGroups,
  setCurrentTest,
  changeTestStatus,
  selectAllTest, // ✅ заменили selectAllTests на selectAllTest
  selectTestsLoading,
  selectTestsError,
  selectCurrentTest,
  selectAllGroups,
} from "../redux";
import { Test } from "../types/reduxTypes";

export const useTests = () => {
  const dispatch = useDispatch<AppDispatch>();

  const tests = useSelector(selectAllTest);
  const currentTest = useSelector(selectCurrentTest);
  const loading = useSelector(selectTestsLoading);
  const error = useSelector(selectTestsError);
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
          acc[test.id] = test.availableForGroups.map((g) => ({
            id: g.id,
            name: g.name,
          }));
          return acc;
        }, {} as Record<string, { id: string; name: string }[]>)
      );
    }
  }, [tests]);

  const fetchAllTests = useCallback(() => {
    dispatch(getTests()).catch(() => {}); // ✅ заменили fetchTests на getTests
  }, [dispatch]);

  const fetchAllGroupsList = useCallback(() => {
    dispatch(fetchAllGroups()).catch(() => {});
  }, [dispatch]);

  const createNewTest = useCallback(
    (data: Partial<Test>) => {
      dispatch(createTest(data)).catch(() => {});
    },
    [dispatch]
  );

  const updateExistingTest = useCallback(
    (testId: string, data: Partial<Test>) => {
      dispatch(updateTest({ testId, data })).catch(() => {});
    },
    [dispatch]
  );

  const deleteExistingTest = useCallback(
    (testId: string) => {
      dispatch(deleteTest(testId)).catch(() => {});
    },
    [dispatch]
  );

  const copyExistingTest = useCallback(
    (testId: string) => {
      dispatch(copyTest(testId)).catch(() => {});
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
      dispatch(setCurrentTest(test));
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
