import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Employee {
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

  onProbation?: boolean;
  hasWorkAnniversary?: boolean;
}

const API_URL = "http://localhost:8080/api/employees";

// Fetch all employees
export const useFetchEmployees = () => {
  return useQuery({
    // Fetches and caches data
    queryKey: ["employees"], // Key is used to store the API response in React Query's cache
    // Helps invalidate or refetch this data later
    queryFn: async () => {
      const response = await axios.get<Employee[]>(API_URL);
      return response.data;
    }, // Function that makes the API request (uses axios)
    staleTime: 5000, // Won't refetch the data for 5 seconds after it's first fetched
  });
};

// Add a new employee
export const useAddEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Used for operations that modify data (PUT, POST, DELETE)
    mutationFn: async (newEmployee: Employee) => {
      const response = await axios.post<Employee>(API_URL, newEmployee);
      return response.data;
    }, // Sends a POST request to create a new employee
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    }, // React Query refetches the list of employees to reflect the change
    onError: (error: any) => {
      const message = getErrorMessage(error);
      console.error("Error adding employee: ", message);
      alert(message);
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: number;
      updates: Partial<Employee>;
    }) => {
      console.log("Attempting to update employee with ID:", id);
      console.log("Update payload:", updates);
      console.log("PATCH URL:", `${API_URL}/${id}`);

      const response = await axios.patch(`${API_URL}/${id}`, updates, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("Mutation succeeded, invalidating employee query cache");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },

    onError: (error: any) => {
      const message = getErrorMessage(error);
      console.error("Error updating employee: ", message);
      alert(message);
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    }, // Sends a DELETE request to remove an employee
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        // Instead of waiting for the server response, we immediately update the cache by filtering out the deleted employee (faster UI updates)
        ["employees"],
        (oldData: Employee[] | undefined) =>
          oldData ? oldData.filter((emp) => emp.id !== id) : []
      );
    },
    onError: (error: any) => {
      const message = getErrorMessage(error);
      console.error("Error deleting employee: ", message);
      alert(message);
    },
  });
};

const getErrorMessage = (error: any): string => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong"
  );
};
