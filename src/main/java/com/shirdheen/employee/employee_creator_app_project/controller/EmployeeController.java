package com.shirdheen.employee.employee_creator_app_project.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(new EmployeeDto(employee));
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        List<EmployeeDto> dtos = employees.stream().map(EmployeeDto::new).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<EmployeeDto>> filterEmployees(
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) ContractType contractType) {
        List<Employee> filteredEmployees = employeeService.filterEmployees(employmentType, contractType);
        List<EmployeeDto> dtos = filteredEmployees.stream().map(EmployeeDto::new).toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EmployeeDto>> searchEmployees(@RequestParam String keyword) {
        List<EmployeeDto> dtos = employeeService.searchEmployees(keyword).stream().map(EmployeeDto::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody Employee employee) {
        Employee savedEmployee = employeeService.createEmployee(employee);
        return ResponseEntity.status(HttpStatus.CREATED).body(new EmployeeDto(savedEmployee));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @RequestBody Map<String, Object> updates) {

        System.out.println("Updating employee with ID: " + id);
        System.out.println("Fields to update: " + updates.keySet());

        Employee updatedEmployee = employeeService.updateEmployee(id, updates);
        return ResponseEntity.ok(new EmployeeDto(updatedEmployee));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee with ID " + id + " deleted successfully.");
    }
}
