import { useNavigate } from "react-router-dom";
import { useDeleteEmployee, useFetchEmployees } from "../../api/employeeApi";
import styles from "./EmployeeList.module.scss";
import { useAppDispatch } from "../../redux/hooks";
import { setSelectedEmployee } from "../../redux/slices/employeeSlice";

const EmployeeList = () => {
  const { data: employees, isLoading, error } = useFetchEmployees();
  const deleteEmployee = useDeleteEmployee();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee.mutate(id);
    }
  };

  const handleAdd = () => {
    dispatch(setSelectedEmployee(null));
    navigate("/employee-form");
  };

  const handleEdit = (employee: any) => {
    dispatch(setSelectedEmployee(employee));
    navigate("/employee-form");
  };

  if (isLoading) return <p>Loading employees...</p>;
  if (error)
    return <p style={{ color: "red" }}>Oops, error fetching employees.</p>;

  return (
    <div className={styles.employeeList}>
      <h2>Employee List</h2>
      <button className={styles.addEmployeeButton} onClick={handleAdd}>
        Add employee
      </button>

      {employees && employees.length > 0 ? (
        <div className={styles.employeeCards}>
          {employees.map((employee) => (
            <div key={employee.id} className={styles.employeeCard}>
              <div className={styles.employeeInfo}>
                <div className={styles.bannerSection}>
                  {employee.ongoing && (
                    <span className={styles.ongoingBadge}>Ongoing</span>
                  )}
                  {employee.hasWorkAnniversary && (
                    <span className={styles.anniversaryBadge}>
                      🎉 Work Anniversary
                    </span>
                  )}

                  {employee.onProbation && (
                    <span className={styles.probationBadge}>🗒️ Probation</span>
                  )}
                </div>
                <strong>
                  {employee.firstName} {employee.lastName}
                </strong>
                <p>
                  {employee.contractType} -{" "}
                  {calculateYears(employee.startDate, employee.finishDate)}
                </p>
                <p>{employee.email}</p>
              </div>

              <div className={styles.employeeActions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </button>
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
): string => {
  const start = new Date(startDate);
  const end = finishDate ? new Date(finishDate) : new Date();

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const yearStr = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "";

  return [yearStr, monthStr].filter(Boolean).join(" ");
};

export default EmployeeList;
