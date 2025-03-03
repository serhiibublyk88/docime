import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectError, resetError } from "./redux";
import { useAppDispatch } from "./hooks";
import { AlertMessage} from "./components";
import { ProtectedRoute, GuestOnlyRoute } from "./routes";
import { SideNavController } from "./controllers";
import { roles } from "./constants";

import {
  HomePage,
  LoginPage,
  RegisterPage,
  TestsPage,
  TestPage,
  ResultsPage,
  AdminDashboard,
  GroupsPage,
  CreateTestPage,
  ManageResultsPage,
  NotFoundPage,
  AccessDeniedPage,
} from "./pages";


export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const error = useSelector(selectError);

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
        <SideNavController />
        <div className="container-fluid" style={{ marginTop: "60px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<GuestOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole={roles.USER} />}>
              <Route path="/tests" element={<TestsPage />} />
              <Route path="/test/:id" element={<TestPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Route>
            <Route
              element={<ProtectedRoute requiredRole={roles.TEST_CREATOR} />}
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/groups" element={<GroupsPage />} />
              <Route path="/admin/tests" element={<TestsPage />} />
              <Route path="/admin/create-test" element={<CreateTestPage />} />
              <Route path="/admin/results" element={<ManageResultsPage />} />
            </Route>
            <Route path="/access-denied" element={<AccessDeniedPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
};
