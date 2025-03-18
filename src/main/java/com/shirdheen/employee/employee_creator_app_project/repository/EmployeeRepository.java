package com.shirdheen.employee.employee_creator_app_project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shirdheen.employee.employee_creator_app_project.model.Employee;
import com.shirdheen.employee.employee_creator_app_project.model.EmploymentType;
import com.shirdheen.employee.employee_creator_app_project.model.ContractType;


@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Check if an email already exists
    boolean existsByEmail(String email);

    // Find all employees by contract type
    List<Employee> findByContractType(ContractType contractType);
    
    // Find all employees by employment type
    List<Employee> findByEmploymentType(EmploymentType employmentType);

    @Query("SELECT e FROM Employee e WHERE LOWER(e.firstName) LIKE LOWER(CONCAT('%', : keyword, '%')) " + "OR LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%'))" + "OR LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Employee> searchEmployees(@Param("keyword") String keyword);
}
