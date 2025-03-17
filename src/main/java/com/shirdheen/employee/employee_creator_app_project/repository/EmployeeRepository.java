package com.shirdheen.employee.employee_creator_app_project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shirdheen.employee.employee_creator_app_project.model.Employee;
import com.shirdheen.employee.employee_creator_app_project.model.EmploymentType;
import com.shirdheen.employee.employee_creator_app_project.model.ContractType;
import java.time.LocalDate;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    //Find employee by email
    Optional<Employee> findByEmail(String email);

    // Check if an email already exists
    boolean existsByEmail(String email);

    // Find all employees by contract type
    List<Employee> findByContractType(ContractType contractType);
    
    // Find all employees by employment type
    List<Employee> findByEmploymentType(EmploymentType employmentType);

    // Find employees who started on a specific date
    List<Employee> findByStartDate(LocalDate startDate);

    // Find employees whose start date is after a given date
    List<Employee> findByStartDateAfter(LocalDate date);

    // Find employees whose start date is after a given date
    List<Employee> findByStartDateBefore(LocalDate date);

    // Find employees with a salary greater than a given amount
    List<Employee> findBySalaryGreaterThan(Double salary);

    // Find employees with a salary between two values
    List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary);

    // Find employees who work a specific number of hours per week
    List<Employee> findByHoursPerWeek(Integer hours);

    // Find all employees who have not finished their contract (i.e., ongoing)
    List<Employee> findByOngoingTrue();
}
