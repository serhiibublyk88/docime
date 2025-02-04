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
} from "./pages";
import Header from "./components/layout/Header";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestOnlyRoute from "./routes/GuestOnlyRoute";
import { TEST_CREATOR, USER } from "./constants/roles";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<HomePage />} />

        {/* Гостевые маршруты */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Маршруты для пользователей с ролью USER */}
        <Route element={<ProtectedRoute requiredRole={USER} />}>
          <Route path="/tests" element={<TestsPage />} />
          <Route path="/test/:id" element={<TestPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Route>

        {/* Маршруты для пользователей с ролью TEST_CREATOR */}
        <Route element={<ProtectedRoute requiredRole={TEST_CREATOR} />}>
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
