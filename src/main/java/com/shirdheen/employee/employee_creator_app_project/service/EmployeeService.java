package com.shirdheen.employee.employee_creator_app_project.service;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.validation.Validator;

import org.springframework.data.domain.Sort;
import org.springframework.data.util.ReflectionUtils;
import org.springframework.stereotype.Service;

import com.shirdheen.employee.employee_creator_app_project.model.ContractType;
import com.shirdheen.employee.employee_creator_app_project.model.Employee;
import com.shirdheen.employee.employee_creator_app_project.model.EmploymentType;
import com.shirdheen.employee.employee_creator_app_project.repository.EmployeeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;

@Service
@Transactional
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final Validator validator;

    public EmployeeService(EmployeeRepository employeeRepository, Validator validator) {
        this.employeeRepository = employeeRepository;
        this.validator = validator;
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll(Sort.by(Sort.Direction.ASC, "lastName"));
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Employee not found with id: " + id));
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

                Class<?> fieldType = field.getType();

                Object convertedValue = value;
                
                // Convert enums
                if (fieldType.isEnum() && value instanceof String) {
                    @SuppressWarnings("unchecked")
                    Class<? extends Enum<?>> enumClass = (Class<? extends Enum<?>>) fieldType;
                    @SuppressWarnings("unchecked")
                    Object enumValue  = Enum.valueOf(enumClass.asSubclass(Enum.class), value.toString());
                    convertedValue = enumValue;
                }

                // Convert LocalDate
                if (fieldType.equals(LocalDate.class) && value instanceof String) {
                    convertedValue = LocalDate.parse(value.toString());
                }

                // Convert Integer
                if ((fieldType.equals(Integer.class) || fieldType.equals(int.class))) {
                    if (value instanceof Number) {
                        convertedValue = ((Number) value).intValue();
                    } else if (value instanceof String) {
                        convertedValue = Integer.parseInt((String) value);
                    }
                }

                if ((fieldType.equals(Double.class) || fieldType.equals(double.class))) {
                    if (value instanceof Number) {
                        convertedValue = ((Number) value).doubleValue();
                    } else if (value instanceof String) {
                        convertedValue = Double.parseDouble((String) value);
                    } else {
                        throw new RuntimeException("Unsupported type for salary: " + value.getClass().getName());
                    }
                }

                if ((fieldType.equals(Boolean.class) || fieldType.equals(boolean.class)) && value instanceof Boolean) {
                    convertedValue = value;
                }

                ReflectionUtils.setField(field, existingEmployee, convertedValue);

            } catch (NoSuchFieldException e) {
                throw new IllegalArgumentException("Field '" + key + "' not found in Employee entity.");
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Failed to update field: " + key, e);
            }
        });

        var violations = validator.validate(existingEmployee);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException("Validation failed during update", violations);
        }

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
