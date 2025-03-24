import { useNavigate, useParams } from "react-router-dom";
import {
  Employee,
  useAddEmployee,
  useFetchEmployeeById,
  useUpdateEmployee,
} from "../../api/employeeApi";
import { useAppSelector } from "../../redux/hooks";
import { useForm } from "react-hook-form";
import styles from "./EmployeeForm.module.scss";
import { useEffect } from "react";
import LoadingSpinner from "../../subcomponents/LoadingSpinner/LoadingSpinner";

const defaultValues: Partial<Employee> = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  residentialAddress: "",
  contractType: "PERMANENT",
  employmentType: "FULL_TIME",
  startDate: "",
  finishDate: "",
  ongoing: false,
  salary: 0,
  hoursPerWeek: 0,
};

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numericId = id ? parseInt(id, 10) : undefined;

  const selectedEmployee = useAppSelector(
    (state) => state.employees.selectedEmployee
  );

  const { data: fetchedEmployee, isLoading: isFetchingEmployee } =
    useFetchEmployeeById(numericId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Employee>({
    defaultValues: selectedEmployee || defaultValues,
  });

  useEffect(() => {
    if (!selectedEmployee && fetchedEmployee) {
      reset(fetchedEmployee);
    }
  }, [fetchedEmployee, selectedEmployee, reset]);

  const contractType = watch("contractType");

  useEffect(() => {
    if (contractType === "CONTRACT") {
      setValue("ongoing", false);
    }
  }, [contractType, setValue]);

  const addEmployeeMutation = useAddEmployee();
  const updateEmployeeMutation = useUpdateEmployee();

  const onSubmit = (data: Employee) => {
    const { id, onProbation, hasWorkAnniversary, ...cleaned } = data;

    const filteredUpdates = Object.fromEntries(
      Object.entries(cleaned).filter(([_, v]) => v !== undefined)
    );

    if (numericId) {
      updateEmployeeMutation.mutate(
        { id: numericId, updates: filteredUpdates },
        {
          onSuccess: () => {
            console.log("Employee updated successfully.");
            navigate("/employees");
          },
          onError: (error) => {
            console.error("Error updating employee:", error);
          },
        }
      );
    } else {
      addEmployeeMutation.mutate(data, {
        onSuccess: () => navigate("/employees"),
      });
    }
  };

  const handleCancel = () => {
    reset();
    navigate("/employees");
  };

  if (numericId && isFetchingEmployee) return <LoadingSpinner />;

  return (
    <div className={styles.employeeFormContainer}>
      <h2>{numericId ? "Edit Employee" : "Add New Employee"} </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formRow}>
          <input
            {...register("firstName", { required: true })}
            placeholder="First Name"
          />
          {errors.firstName && <p>First name is required</p>}
        </div>

        <div className={styles.formRow}>
          <input
            {...register("middleName")}
            placeholder="Middle Name (optional)"
          />
        </div>

        <div className={styles.formRow}>
          <input
            {...register("lastName", { required: true })}
            placeholder="Last Name"
          />
          {errors.lastName && <p>Last name is required</p>}
        </div>

        <div className={styles.formRow}>
          <input
            {...register("email", { required: true })}
            placeholder="Email"
          />
          {errors.email && <p>Email is required</p>}
        </div>

        <div className={styles.formRow}>
          <input
            {...register("mobileNumber", { required: true })}
            placeholder="Mobile Number"
          />
          {errors.mobileNumber && <p>Mobile number is required</p>}
        </div>

        <div className={styles.formRow}>
          <input
            {...register("residentialAddress")}
            placeholder="Residential Address"
          />
        </div>

        <div className={styles.formRow}>
          <label>Contract Type</label>
          <select {...register("contractType", { required: true })}>
            <option value="PERMANENT">Permanent</option>
            <option value="CONTRACT">Contract</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <label>Employment Type</label>
          <select {...register("employmentType", { required: true })}>
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
          </select>
        </div>

        <div className={styles.formRow}>
          <label>Start Date</label>
          <input type="date" {...register("startDate", { required: true })} />
          {errors.startDate && <p>Start date is required</p>}
        </div>

        <div className={styles.formRow}>
          <label>Finish Date</label>
          <input type="date" {...register("finishDate")} />
        </div>

        <div className={`${styles.formRow} ${styles.checkboxField}`}>
          <label className={styles.checkboxWrapper}>
            <input
              type="checkbox"
              {...register("ongoing")}
              disabled={contractType === "CONTRACT"}
            />
            Ongoing
          </label>
        </div>

        <div className={styles.formRow}>
          <label>Salary</label>
          <input
            type="number"
            {...register("salary", { required: true, min: 1 })}
            placeholder="Salary"
          />
          {errors.salary && <p>Salary must be a positive number</p>}
        </div>

        <div className={styles.formRow}>
          <label>Hours per Week</label>
          <input
            type="number"
            {...register("hoursPerWeek", { required: true, min: 1 })}
            placeholder="Hours per week"
          />
          {errors.hoursPerWeek && <p>Hours must be a positive number</p>}
        </div>

        <div className={styles.formButtons}>
          <button type="submit">{selectedEmployee ? "Update" : "Save"}</button>
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
