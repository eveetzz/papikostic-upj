import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";

import AuthGuard from "./components/security/AuthGuard";
import { Index } from "./pages/Index";
import { Quiz } from "./pages/Quiz";
import { ProtectedLayout } from "./components/security/ProtectedLayout";
import { Admin } from "./pages/admin/AdminLayout";
import { ExamGuard } from "./components/security/ExamGuard"
import { DashboardAdmin } from "./pages/admin/DashboardAdmin";
import { ManageUser } from "./pages/admin/ManageUser";
import { TestResult } from "./pages/admin/TestResult";
import { TutorialScreen } from "./pages/TutorialScreen";
// import { DummyPage } from "./pages/admin/DummyPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthGuard>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />

            {/* Rute soal (hanya user) */}
            <Route element={<ProtectedLayout allowedRoles={["user"]} />}>
              <Route path="/Index" element={<Index />} />
              <Route path="/Tutorial" element={<TutorialScreen />} />
              <Route element={<ExamGuard />}>
                <Route path="/Quiz" element={<Quiz />} />
              </Route>
            </Route>

            {/* Rute dashboard admin */}
            <Route element={<ProtectedLayout allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<Admin />}>
                {/* Di sini Admin Dashboard Layout */}
                <Route path="dashboard" element={<DashboardAdmin />} />
                <Route path="manage-user" element={<ManageUser />} />
                {/* <Route path="dummy-page" element={<DummyPage />} /> */}
                <Route path="test-result" element={<TestResult />} />
              </Route>
            </Route>

            {/* Default */}
            <Route path="/" element={<div />} />

            {/* Redirect jika halaman tidak ditemukan */}
            <Route path="*" element={<Navigate to="/" />} />
            {/* </Route> */}
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </>
  );
}

export default App;
