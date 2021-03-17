import { Component, OnInit } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from 'src/app/services/auth.service';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
import { PermissionMaster } from 'src/app/components/user-role/ModuleHierarchyMaster.model';

@Component({
    selector: 'app-employee-steps-prime-ng',
    templateUrl: './employee-steps-prime-ng.component.html',
    styleUrls: ['./employee-steps-prime-ng.component.scss']
})
/** employee-steps-primeNg component*/
export class EmployeeStepsPrimeNgComponent implements OnInit{ 

	ifvalue: boolean;
	generalcollection: any;
	collection: any;
	currentUrl: any;
	items: {}[];
	editMode: boolean = false;
	msgs: Message[] = [];
	breadcrumbs: MenuItem[];
	activeIndex: number;
	isEditMode: boolean = false;
	showComponentPTab: boolean;
    isDisabledSteps: boolean = false;
	employeeId: any;
	isView:boolean=true;
    /** employee-steps-primeNg ctor */
	constructor(private router: ActivatedRoute,
		private acRouter: ActivatedRoute	, private route: Router, public employeeService: EmployeeService,private authService:AuthService) {
		let currentUrl = this.route.url;
		this.employeeService.alertChangeObject$.subscribe(value => {
			this.showComponentPTab = value;

		});
		this.employeeService.indexObjChangeObject$.subscribe(value => {
			this.activeIndex = value;

		});
		this.isView=this.authService.checkPermission(ModuleConstants.Employee+'.'+PermissionConstants.View);
	}

	ngOnInit() {
		// ?this.acRouter.snapshot.paramMap.get('id') :
		this.showComponentPTab = this.employeeService.ShowPtab;
		this.currentUrl = this.route.url;
		//debugger


	
		if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-list')) {
			this.employeeService.isEditMode=false;
			this.activeIndex = 0;

		}else{
			this.employeeService.isEditMode=true;
		}
		 if ( this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information')) {
			this.activeIndex = 0;
            this.isDisabledSteps = true;
			this.showComponentPTab = true;
			this.getEmployeeId();
		}
		else if ( this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification')) {
			this.showComponentPTab = true;
			this.activeIndex = 1;
			this.getEmployeeId();
		}

		else if ( this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training')) {
			this.showComponentPTab = true;
			this.activeIndex = 2;
			this.getEmployeeId();
		}

		else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure')) {
			this.showComponentPTab = true;
			this.activeIndex = 3;
			this.getEmployeeId();
		}
		// if(this.showComponentPTab ==true){

		
		this.items = [{
			label: 'General Information',
            step:1,
            index:0,
			command: (event: any) => {
				this.activeIndex = 0;
				this.msgs.length = 0;
				this.msgs.push({ severity: 'info', summary: 'General Information', detail: event.label });
				if(this.employeeService.isEditMode==true){
					let emp = this.acRouter.params.subscribe( params => console.log(params) );					 
					this.employeeId = this.employeeService.employeeId;
					this.route.navigateByUrl(`/employeesmodule/employeepages/app-employee-general-information-edit/${this.employeeId}`);
				}else{

					this.route.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
				}

			}
		},
		{
			label: 'Certification',
            step:2,
            index:1,
			command: (event: any) => {
				this.activeIndex = 1;
				this.msgs.length = 0;
				this.msgs.push({ severity: 'info', summary: 'Contacts', detail: event.label });
				if(this.employeeService.isEditMode==true){
					let emp=	this.acRouter.params.subscribe( params => console.log(params) );
					this.employeeId = this.employeeService.employeeId;
					this.route.navigateByUrl(`/employeesmodule/employeepages/app-employee-certification-edit/${this.employeeId}`);
				}else{

					this.route.navigateByUrl('/employeesmodule/employeepages/app-employee-certification');
				}
			
			}
		},
		{
			label: 'Training',
            step:3,
            index:2,
			command: (event: any) => {
				this.activeIndex = 2;
				this.msgs.length = 0;
				this.msgs.push({ severity: 'info', summary: 'Financial Information', detail: event.label });

				if(this.employeeService.isEditMode==true){
					 let emp=	this.acRouter.params.subscribe( params => console.log(params) );
					 this.employeeId = this.employeeService.employeeId;
					this.route.navigateByUrl(`/employeesmodule/employeepages/app-employee-training-edit/${this.employeeId}`);
				}else{

					this.route.navigateByUrl('/employeesmodule/employeepages/app-employee-training');
				}
			}
		},
		{
            label: 'Management Structure',
            step:4,
            index:3,
			command: (event: any) => {
				this.activeIndex = 3;
				this.msgs.length = 0;
				this.msgs.push({ severity: 'info', summary: 'Management Structure', detail: event.label });
				if(this.employeeService.isEditMode==true){
					let emp=	this.acRouter.params.subscribe( params => console.log(params) );
					this.employeeId = this.employeeService.employeeId;					
					this.route.navigateByUrl(`/employeesmodule/employeepages/app-employees-management-structure-edit/${this.employeeId}`);
				}else{

					this.route.navigateByUrl('/employeesmodule/employeepages/app-employees-management-structure');
				}
			}
		}
	];
	// }
}

getEmployeeId(){
		let emp=	this.acRouter.params.subscribe( params => console.log(params) );	
		 this.employeeId = this.employeeService.employeeId;
		if(this.employeeId)
		this.employeeService.isEditMode=true;
}

}