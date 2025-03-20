import { useDeleteEmployee, useFetchEmployees } from "../../api/employeeApi";
import styles from "./EmployeeList.module.scss";

const EmployeeList = () => {
  const { data: employees, isLoading, error } = useFetchEmployees();
  const deleteEmployee = useDeleteEmployee();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee.mutate(id);
    }
  };

  if (isLoading) return <p>Loading employees...</p>;
  if (error)
    return <p style={{ color: "red" }}>Oops, error fetching employees.</p>;

  return (
    <div className={styles.employeeList}>
      <h2>Employee List</h2>
      <button className={styles.addEmployeeButton}>Add employee</button>

      {employees && employees.length > 0 ? (
        <div className={styles.employeeCards}>
          {employees.map((employee) => (
            <div key={employee.id} className={styles.employeeCard}>
              <div className={styles.employeeInfo}>
                <strong>
                  {employee.firstName} {employee.lastName}
                </strong>
                <p>
                  {employee.contractType} -{" "}
                  {employee.ongoing
                    ? "Ongoing"
                    : `${calculateYears(
                        employee.startDate,
                        employee.finishDate
                      )} years`}
                </p>
                <p>{employee.email}</p>
              </div>

              <div className={styles.employeeActions}>
                <button className={styles.editButton}>Edit</button>
                <span>|</span>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );
};

const calculateYears = (
  startDate: string,
  finishDate?: string | null
): number => {
  const start = new Date(startDate);
  const end = finishDate ? new Date(finishDate) : new Date();
  return end.getFullYear() - start.getFullYear();
};

export default EmployeeList;
