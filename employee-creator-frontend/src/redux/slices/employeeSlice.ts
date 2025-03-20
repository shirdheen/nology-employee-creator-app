import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employee } from "../../api/employeeApi";

// Defines the shape of the Redux store for employees
interface EmployeeState {
  selectedEmployee: Employee | null; // Stoes the currently selected employee or null if no employee is selected
}

// Initialises Redux state
const initialState: EmployeeState = {
  selectedEmployee: null, // State starts with null
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    // actions that modify the state
    // Updates the selectedEmployee state
    setSelectedEmployee: (state, action: PayloadAction<Employee | null>) => {
      // Takes a payload which is either an Employee or null
      state.selectedEmployee = action.payload;
    },
  },
}); //State is updated directly

export const { setSelectedEmployee } = employeeSlice.actions; // So that the components can dispatch it
export default employeeSlice.reducer; // Exports the reducer so that it can be added to the Redux store
