package com.shirdheen.employee.employee_creator_app_project.service;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Sort;
import org.springframework.data.util.ReflectionUtils;
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

    public List<Employee> filterEmployees(EmploymentType employmentType, ContractType contractType) {
        if (employmentType != null && contractType != null) {
            return employeeRepository.findByEmploymentTypeAndContractType(employmentType, contractType);
        } else if (employmentType != null) {
            return employeeRepository.findByEmploymentType(employmentType);
        } else if (contractType != null) {
            return employeeRepository.findByContractType(contractType);
        } else {
            return getAllEmployees();
        }
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

    public Employee updateEmployee(Long id, Map<String, Object> updates) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);

        if (optionalEmployee.isEmpty()) {
            throw new EntityNotFoundException("Employee not found with id: " + id);
        }

        Employee existingEmployee = optionalEmployee.get();

        // Looping through provided fields and update them dynamically
        updates.forEach((key, value) -> {
            try {
                Field field = Employee.class.getDeclaredField(key);
                field.setAccessible(true);
                ReflectionUtils.setField(field, existingEmployee, value);
            } catch (NoSuchFieldException e) {
                throw new IllegalArgumentException("Field '" + key + "' not found in Employee entity.");
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Failed to update field: " + key, e);
            }
        });

        return employeeRepository.save(existingEmployee);
    }

    public void deleteEmployee(Long id) {
        Optional<Employee> optionalEmployee = employeeRepository.findById(id);

        if (optionalEmployee.isEmpty()) {
            throw new EntityNotFoundException("Cannot delete. Employee not found with id: " + id);
        }

        Employee employee = optionalEmployee.get();

        if (employee.isOngoing()) {
            throw new IllegalStateException("Cannot delete an ongoing employee");
        }

        employeeRepository.deleteById(id);
    }
}
