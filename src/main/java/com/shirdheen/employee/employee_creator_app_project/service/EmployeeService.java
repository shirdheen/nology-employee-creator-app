package com.shirdheen.employee.employee_creator_app_project.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.shirdheen.employee.employee_creator_app_project.model.ContractType;
import com.shirdheen.employee.employee_creator_app_project.model.Employee;
import com.shirdheen.employee.employee_creator_app_project.model.EmploymentType;
import com.shirdheen.employee.employee_creator_app_project.repository.EmployeeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class EmployeeService {
    
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "lastName"));
    }

    public List<Employee> getEmployeesByEmploymentType(EmploymentType type) {
        return employeeRepository.findByEmploymentType(type);
    }

    public List<Employee> getEmployeesByContractType(ContractType type) {
        return employeeRepository.findByContractType(type);
    }

    public List<Employee> searchEmployees(String keyword) {
        return employeeRepository.searchEmployees(keyword.toLowerCase());
    }

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new IllegalStateException("Email already in use: " + employee.getEmail());
        }

        if (employee.getFinishDate() != null && employee.getStartDate().isAfter(employee.getFinishDate())) {
            throw new IllegalArgumentException("Start date must be before finish date");
        }
        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);

        if (optionalEmployee.isEmpty()) {
            throw new EntityNotFoundException("Cannot delete. Employee not found with id: " + id);
        }

        Employee employee = optionalEmployee.get();

        if(employee.isOngoing()) {
            throw new IllegalStateException("Cannot delete an ongoing employee");
        }

        employeeRepository.deleteById(id);
    }
}
