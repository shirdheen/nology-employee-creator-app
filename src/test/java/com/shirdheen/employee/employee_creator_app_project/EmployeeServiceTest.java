package com.shirdheen.employee.employee_creator_app_project;

import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.shirdheen.employee.employee_creator_app_project.repository.EmployeeRepository;
import com.shirdheen.employee.employee_creator_app_project.service.EmployeeService;

class EmployeeServiceTest {
    
    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }
}
