import { useNavigate } from "react-router-dom";
import {
  Employee,
  useDeleteEmployee,
  useFetchEmployees,
  useFilterEmployees,
} from "../../api/employeeApi";
import styles from "./EmployeeList.module.scss";
import { useAppDispatch } from "../../redux/hooks";
import { setSelectedEmployee } from "../../redux/slices/employeeSlice";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../subcomponents/LoadingSpinner/LoadingSpinner";

const EmployeeList = () => {
  const [employmentType, setEmploymentType] = useState<string>("");
  const [contractType, setContractType] = useState<string>("");

  const { data: employees, isLoading, error } = useFetchEmployees();
  const deleteEmployee = useDeleteEmployee();
  const {
    data: filteredEmployees,
    refetch: refetchFiltered,
    isFetching,
  } = useFilterEmployees({ employmentType, contractType });

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
    navigate(`/employee-form/${employee.id}`);
  };

  useEffect(() => {
    refetchFiltered();
  }, [employmentType, contractType, refetchFiltered]);

  const employeesToRender =
    employmentType || contractType ? filteredEmployees : employees;

  if (isLoading) return <LoadingSpinner />;

  if (error)
    return (
      <p className={styles.errorMessage}>Oops, error fetching employees.</p>
    );

  return (
    <div className={styles.employeeList}>
      <h2>Employee List</h2>

      <div className={styles.filterControls}>
        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
        >
          <option value="">All employment types</option>
          <option value="FULL_TIME">Full-time</option>
          <option value="PART_TIME">Part-time</option>
        </select>

        <select
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
        >
          <option value="">All contract types</option>
          <option value="PERMANENT">Permanent</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </div>

      <button className={styles.addEmployeeButton} onClick={handleAdd}>
        Add employee
      </button>

      {isLoading ? (
        <p>Loading employees...</p>
      ) : error ? (
        <p style={{ color: "red" }}>Oops, error fetching employees.</p>
      ) : employeesToRender && employeesToRender.length > 0 ? (
        <div className={styles.employeeCards}>
          {employeesToRender.map((employee) => (
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
                  {getContractExpiryBanner(employee) && (
                    <span className={styles.contractExpiryBadge}>
                      {getContractExpiryBanner(employee)}
                    </span>
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

const getContractExpiryBanner = (employee: Employee): string | null => {
  if (employee.contractType !== "CONTRACT") return null;
  if (!employee.finishDate) return null;

  const today = new Date();
  const finishDate = new Date(employee.finishDate);
  // getTime() returns the time in milliseconds
  const diffTime = finishDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "❌ Contract Expired";
  } else {
    return `📅 Contract expires in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
  }
};

export default EmployeeList;
