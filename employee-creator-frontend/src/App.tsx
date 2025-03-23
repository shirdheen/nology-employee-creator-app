import { Navigate, Route, Routes } from "react-router-dom";
import EmployeeList from "./components/EmployeeList/EmployeeList";
import EmployeeForm from "./components/EmployeeForm/EmployeeForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
      </Routes>
    </>
  );
}

export default App;
