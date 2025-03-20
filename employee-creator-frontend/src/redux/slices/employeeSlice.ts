import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../../api/employeeApi";

// Defines the shape of the Redux store for employees
interface EmployeeState {
  selectedEmployee: Employee | null;
}

// Initialises Redux state
const initialState: EmployeeState = {
  selectedEmployee: null,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      state.selectedEmployee = action.payload;
    },
  },
});

export const { setSelectedEmployee } = employeeSlice.actions;
export default employeeSlice.reducer;
