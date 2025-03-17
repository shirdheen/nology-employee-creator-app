import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Employee {
  id: number;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  residentialAddress: string;
  contractType: "PERMANENT" | "CONTRACT";
  startDate: string;
  finishDate?: string | null;
  ongoing: boolean;
  employmentType: "FULL_TIME" | "PART_TIME";
  salary: number;
  hoursPerWeek: number;
}

// Defines the shape of the Redux store for employees
interface EmployeeState {
  employees: Employee[]; // Stores the list of employees
  loading: boolean; // Indicates if an API request is in progress
  error: string | null; // Error filed stores any error messages
}

// Initialises Redux state
const initialState: EmployeeState = {
  employees: [], // Empty array
  loading: false, // API requests are not happening yet
  error: null, // No errors initially
};

const API_URL = "http://localhost:8080/api/employees";

// Fetches employee data
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data; // Returns the fetched employees
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch employees"
      ); // Stores the error message in Redux
    }
  }
);

// Sends a POST request to the API to add a new employee
export const addEmployee = createAsyncThunk(
  "employees/addEmployee",
  async (newEmployee: Employee, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, newEmployee); // newEmployee is passed as the request body
      return response.data; // Returns the newly created employee
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add employee"); // Stores the error message
    }
  }
);

// Sends a DELETE request to remove an employee by ID
export const deleteEmployee = createAsyncThunk(
  "employees/deleteEmployee",
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id; // Returns the deleted employee's id (so that we can remove it from Redux state)
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete employee"
      ); // Stores the error message
    }
  }
);

// action.payload is the data returned by an action when it is dispatched; it contains the information that is used to update the Redux state

// Creating a Redux slice - manages the employee state
// state: the data it manages
// actions: function that changes the state
// reducers: rules for updating the state
const employeeSlice = createSlice({
  name: "employees", // Unique name for the slice
  initialState, // Initial state of the slice
  reducers: {}, // Reducer functions to update the state
  extraReducers: (builder) => {
    // Handles async actions like createAsyncThunk
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true; // Before fetching data
        state.error = null;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action: PayloadAction<Employee[]>) => {
          state.loading = false;
          state.employees = action.payload; // Stores the fetched employees
        }
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string; // Saves the error message
      })
      .addCase(
        addEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.employees.push(action.payload); //Adds a new employee to the Redux store
        }
      )
      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.employees = state.employees.filter(
            (emp) => emp.id !== action.payload
          ); // Removes an employee from Redux store
        }
      );
  },
});

export default employeeSlice.reducer;
