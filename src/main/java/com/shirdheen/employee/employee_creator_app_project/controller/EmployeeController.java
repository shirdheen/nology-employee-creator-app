package com.shirdheen.employee.employee_creator_app_project.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shirdheen.employee.employee_creator_app_project.dto.EmployeeDto;
import com.shirdheen.employee.employee_creator_app_project.model.ContractType;
import com.shirdheen.employee.employee_creator_app_project.model.Employee;
import com.shirdheen.employee.employee_creator_app_project.model.EmploymentType;
import com.shirdheen.employee.employee_creator_app_project.service.EmployeeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    private final EmployeeService employeeService;
    private static final Logger logger = LoggerFactory.getLogger(EmployeeController.class);

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        logger.info("Fetching employee with ID: {}", id);
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(new EmployeeDto(employee));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        logger.info("Fetching all employees");
        List<Employee> employees = employeeService.getAllEmployees();
        List<EmployeeDto> dtos = employees.stream().map(EmployeeDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<EmployeeDto>> filterEmployees(
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) ContractType contractType) {
        logger.info("Filtering employees by employmentType: {} and contractType: {}", employmentType, contractType);
        List<Employee> filteredEmployees = employeeService.filterEmployees(employmentType, contractType);
        List<EmployeeDto> dtos = filteredEmployees.stream().map(EmployeeDto::new).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDto>> searchEmployees(@RequestParam String keyword) {
        logger.info("Searching employees with keyword: {}", keyword);
        List<EmployeeDto> dtos = employeeService.searchEmployees(keyword).stream().map(EmployeeDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody Employee employee) {
        logger.info("Creating new employee with email: {}", employee.getEmail());
        Employee savedEmployee = employeeService.createEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(new EmployeeDto(savedEmployee));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        logger.info("Updating employee with ID: {}", id);
        logger.debug("Fields to update: {}", updates.keySet());

        Employee updatedEmployee = employeeService.updateEmployee(id, updates);
        return ResponseEntity.ok(new EmployeeDto(updatedEmployee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        logger.warn("Deleting employee with ID: {}", id);
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee with ID " + id + " deleted successfully.");
    }
}
