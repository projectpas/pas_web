    import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeePagesComponent } from "./employeepages.component";
import { EmployeesListComponent } from "../shared/components/employee/employee-list/employees-list.component";
import { EmployeeGeneralInformationComponent } from "../shared/components/employee/employee-general-information/employee-general-information.component";
import { EmployeeCertificationComponent } from "../shared/components/employee/employee-certification/employee-certification.component";
import { EmployeeTrainingComponent } from "../shared/components/employee/employee-training/employee-training.component";
import { EmployeesManagementStructureComponent } from "../shared/components/employee/employee-management-structure/employees-management-structure.component";
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../services/auth-guard.service';

const employeePagesRoutes: Routes = [
    {
        path: 'employeepages',
        component: EmployeePagesComponent,
        children: [
			{ path: "app-employees-list", component: EmployeesListComponent, data: { title: "Employee's List" } },
            { path: "app-employee-general-information", component: EmployeeGeneralInformationComponent, data: { title: "Employee General Information" } },
            { path: "app-employee-general-information-edit/:id", component: EmployeeGeneralInformationComponent, data: { title: "Employee General Information" } },
            { path: "app-employee-certification", component: EmployeeCertificationComponent, data: { title: "Employee Certification" } },
            { path: "app-employee-certification-edit/:id", component: EmployeeCertificationComponent, data: { title: "Employee Certification" } },
            { path: "app-employee-training", component: EmployeeTrainingComponent, data: { title: "Employee Training" } },
            { path: "app-employee-training-edit/:id", component: EmployeeTrainingComponent, data: { title: "Employee Training" } },
            { path: "app-employees-management-structure", component: EmployeesManagementStructureComponent, data: { title: "Employee Management Structure"} },
            { path: "app-employees-management-structure-edit/:id", component: EmployeesManagementStructureComponent, data: { title: "Employee Management Structure"} }
          
        ]
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(employeePagesRoutes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthService, AuthGuard
    ]
})
export class EmployeepagesRoutingModule { }