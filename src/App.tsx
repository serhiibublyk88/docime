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
  CreateTestPage,
  ManageResultsPage,
  NotFoundPage,
  AccessDeniedPage,
} from "./pages";
import { ProtectedRoute, GuestOnlyRoute } from "./routes";
import { SideNavController } from "./components/navigation/SideNavController";
import { roles } from "./constants";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* ✅ Теперь `SideNavController` сам вызывает `useSideNav()` */}
      <SideNavController />

      {/* ✅ Основной контейнер */}
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
            <Route path="/admin/tests" element={<TestsPage />} />
            <Route path="/admin/create-test" element={<CreateTestPage />} />
            <Route path="/admin/results" element={<ManageResultsPage />} />
          </Route>
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
