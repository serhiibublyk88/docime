import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  LoginPage,
  RegisterPage,
  TestsPage,
  TestPage,
  ResultsPage,
  AdminDashboard,
  GroupsPage,
  ManageTestsPage,
  ManageResultsPage,
  NotFoundPage,
  AccessDeniedPage,
} from "./pages";
import { Header } from "./components";
import { ProtectedRoute, GuestOnlyRoute } from "./routes";
import { roles } from "./constants";

export const App = () => {
  useEffect(() => {
    const handleResize = () => {};

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div className="main-content container-fluid">
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
          <Route element={<ProtectedRoute requiredRole={roles.TEST_CREATOR} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/groups" element={<GroupsPage />} />
            <Route path="/admin/tests" element={<ManageTestsPage />} />
            <Route path="/admin/results" element={<ManageResultsPage />} />
          </Route>
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
