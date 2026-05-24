import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import APIDetails from "./pages/APIDetails";
import IncidentDetails from "./pages/IncidentDetails";
import NotFound from "./pages/NotFound";
import AddAPI from "./pages/AddAPI";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/api/:id" element={<APIDetails />} />
          <Route path="/incident/:id" element={<IncidentDetails />} />
          <Route path="/add-api" element={<AddAPI />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
