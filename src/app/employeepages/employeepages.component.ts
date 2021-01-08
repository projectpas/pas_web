import { Component } from "@angular/core";
import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { EmployeeService } from '../services/employee.service';

@Component({
    selector: 'quickapp-pro-employee',
    templateUrl: './employeepages.component.html'
})
/** Vendorpages component*/
export class EmployeePagesComponent {

	otherurl: any;
	currentUrl: string;

	public items: MenuItem[];
	home: MenuItem;

	constructor(private router: ActivatedRoute, private route: Router, private employeeService: EmployeeService )

	{
		this.employeeService.bredcrumbObjChangeObject$.subscribe(value => {
			//debugger
			this.otherurl = value;
			this.loadmethod(this.otherurl);

		});
	}

	ngOnInit() {
		this.currentUrl = this.route.url;
		this.loadmethod(this.currentUrl)

	}

	loadmethod(url) {

		this.currentUrl = url;
		
		if (this.currentUrl) {
			if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-list')) {
			
				this.items = [
					{ label: 'Employee' },
					{ label: 'Employee List' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information')) {
				
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}	else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}
		}
		if (this.otherurl) {
			if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-list')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Employee List' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}

			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}

			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure-edit')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Edit Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}

			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}

			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}
			else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure')) {
				this.items = [
					{ label: 'Employee' },
					{ label: 'Create Employee' }
				];
			}
			}

		}


	}
