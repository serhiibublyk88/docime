import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

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
} from "./pages";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Гостевые маршруты */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Маршруты для пользователей (user) */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:id" element={<TestPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>

        {/* Маршруты для создателей тестов (creator) */}
        <Route element={<ProtectedRoute requiredRole="creator" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/groups" element={<GroupsPage />} />
          <Route path="/admin/tests" element={<ManageTestsPage />} />
          <Route path="/admin/results" element={<ManageResultsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
