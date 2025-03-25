import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectError, resetError } from "./redux";
import { useAppDispatch } from "./hooks";
import { AlertMessage } from "./components";
import { ProtectedRoute, GuestOnlyRoute } from "./routes";
import { SideNavController } from "./controllers";
import { roles } from "./constants";
import { useState } from "react";
import { Question } from "./types/reduxTypes";

import {
  HomePage,
  LoginPage,
  RegisterPage,
  TestsPage,
  TestPage,
  UserResultsPage,
  AvailableTests,
  GroupsPage,
  GroupPage,
  CreateTestPage,
  TestResultsPage,
  NotFoundPage,
  AccessDeniedPage,
  TestAttemptPage,
} from "./pages";

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const error = useSelector(selectError);

  
  const [questions, setQuestions] = useState<Question[]>([]);

  
  const handleAddQuestion = (questionData: Omit<Question, "id">) => {
    const newQuestion: Question = {
      id: (questions.length + 1).toString(),
      ...questionData,
    };
    setQuestions([...questions, newQuestion]);
  };

  return (
    <>
      {error && (
        <AlertMessage
          message={error}
          type="danger"
          onClose={() => dispatch(resetError())}
        />
      )}

      <BrowserRouter>
        <SideNavController onAddQuestion={handleAddQuestion} />

        <div className="container-fluid" style={{ marginTop: "60px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<GuestOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole={roles.USER} />}>
              <Route path="/tests" element={<AvailableTests />} />
              <Route path="/test/:id" element={<TestPage />} />
              <Route path="/test/:id/attempt" element={<TestAttemptPage />} />
              <Route path="/results" element={<UserResultsPage />} />
            </Route>
            <Route
              element={<ProtectedRoute requiredRole={roles.TEST_CREATOR} />}
            >
              <Route path="/admin/groups" element={<GroupsPage />} />
              <Route path="/admin/groups/:id" element={<GroupPage />} />
              <Route path="/admin/tests" element={<TestsPage />} />
              <Route path="/admin/tests/create" element={<CreateTestPage />} />
              <Route
                path="/admin/tests/:testId/edit"
                element={<CreateTestPage />}
              />
              <Route path="/admin/results" element={<TestResultsPage />} />
            </Route>
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};
