package com.shirdheen.employee.employee_creator_app_project.dto;

import java.time.LocalDate;

import com.shirdheen.employee.employee_creator_app_project.model.ContractType;
import com.shirdheen.employee.employee_creator_app_project.model.Employee;
import com.shirdheen.employee.employee_creator_app_project.model.EmploymentType;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmployeeDto {
    private Long id;
    private String firstName;
    private String middleName;
    private String lastName;

    private String email;
    private String mobileNumber;
    private String residentialAddress;

    private ContractType contractType;
    private EmploymentType employmentType;

    private LocalDate startDate;
    private LocalDate finishDate;
    
    private Double salary;
    private Integer hoursPerWeek;

    private boolean onProbation;
    private boolean hasWorkAnniversary;

    private boolean ongoing;

    public EmployeeDto (Employee employee) {
        this.id = employee.getId();
        this.firstName = employee.getFirstName();
        this.middleName = employee.getMiddleName();
        this.lastName = employee.getLastName();

        this.email = employee.getEmail();
        this.mobileNumber = employee.getMobileNumber();
        this.residentialAddress = employee.getResidentialAddress();

        this.contractType = employee.getContractType();
        this.employmentType = employee.getEmploymentType();

        this.startDate = employee.getStartDate();
        this.finishDate = employee.getFinishDate();

        this.salary = employee.getSalary();
        this.hoursPerWeek = employee.getHoursPerWeek();

        this.onProbation = employee.isOnProbation();
        this.hasWorkAnniversary = employee.hasWorkAnniversaryThisMonth();

        this.ongoing = employee.isOngoing();
    }
}
