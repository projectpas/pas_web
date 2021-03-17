import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { EmployeeService } from '../../../services/employee.service';
import { AtaMainService } from '../../../services/atamain.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { MenuItem } from 'primeng/api';
import { CreditTermsService } from '../../../services/Credit Terms.service';
import { CommonService } from '../../../services/common.service';
import { AuthService } from '../../../services/auth.service';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
declare var $: any;

@Component({
	selector: 'app-customer-create',
	templateUrl: './customer-steps-primeng.component.html',
	styleUrls: ['./customer-steps-primeng.component.scss']
})
export class CustomerStepsPrimengComponent {
	moduleName:any="Customer";
	referenceId:any;
	activeMenuItem: number = 1;
	currentTab: string = 'General';
	savedGeneralInformationData: any;
	savedSalesInformationData: any;
	countryListOriginal: any[];
	//creditTermsListOriginal: any[];
	customerId: number;
	editMode: boolean = false;
	customerListOriginal: { customerId: any; name: any; }[];
	customerallListOriginal: { customerId: any; name: any; }[];
	editGeneralInformationData: any;
	//employeeListOriginal: any[];
	isDisabledSteps: boolean = false;
	search_ataChapterList: any;
	search_ataChapterList1: any;
	add_ataChapterList: any;
	ataListDataValues: any[] = [];
	contactList: any;
	breadcrumbs: MenuItem[];
	jobTitles: Object; 
	customerIdList: any[] = [];
	arrayCustlist:any[] = [];
	isView:boolean=true;
	isShowGeneralInfo
	constructor(private customerService: CustomerService,
		private acRouter: ActivatedRoute,
		public employeeService: EmployeeService,
		private atamain: AtaMainService,
		private alertService: AlertService,
		private route: Router,
		location: Location,
		private commonservice: CommonService,
		public creditTermService: CreditTermsService,
		private authService: AuthService,
	) {
		this.isView=this.authService.checkPermissionCustomer([ModuleConstants.CustomerList+'.'+PermissionConstants.View]);
	}

	isShowTab(value){
		
		var isShow=this.authService.ShowTab('Create Customer',value);
		return isShow;
	
	}
	ngOnInit() {
		this.customerId = this.acRouter.snapshot.params['id'];
		this.getAllCountries();
		this.loadcustomerData()
		this.breadcrumbs = [
			{ label: 'Customers' },
		];
		if (this.customerId) {			
			this.editMode = true;
			this.breadcrumbs = [...this.breadcrumbs, {
				 label: this.editMode ? 'Edit Customer' : 'Create Customer' 
			}]
		}else{
			this.breadcrumbs = [...this.breadcrumbs, {
				label: this.editMode ? 'Edit Customer' : 'Create Customer' 
		   }]
		}

		if(localStorage.getItem('currentTab')){
            this.changeOfTab(localStorage.getItem('currentTab'))
        } else{
            // localStorage.removeItem('currentTab')
        }
	}
	changeOfTab(value) {
		if (value === 'General') {
			this.currentTab = 'General';
			this.activeMenuItem = 1;

		} else if (value === 'Contacts') {
			this.currentTab = 'Contacts';
			this.activeMenuItem = 2;

		} else if (value === 'AircraftInfo') {
			this.currentTab = 'AircraftInfo';
			this.activeMenuItem = 3;
		} else if (value === 'Atachapter') {
			this.currentTab = 'Atachapter';
			this.activeMenuItem = 4;
			this.getAllATAChapter();
			if (this.customerId > 0) { 
				this.getMappedContactByCustomerId(this.customerId);
				this.getMappedATAByCustomerId(this.customerId);
			}
			else {
				this.getMappedContactByCustomerId(this.savedGeneralInformationData.customerId);
				this.getMappedATAByCustomerId(this.savedGeneralInformationData.customerId);
				}
		} else if (value === 'Financial') {
			this.currentTab = 'Financial';
			this.activeMenuItem = 5;
		} else if (value === 'Billing') {
			this.currentTab = 'Billing';
			this.activeMenuItem = 6;
		} else if (value === 'Shipping') {
			this.currentTab = 'Shipping';
			this.activeMenuItem = 7;
		} else if (value === 'Sales') {		
			this.currentTab = 'Sales';
			this.activeMenuItem = 8;
		} else if (value === 'Warnings') {
			this.currentTab = 'Warnings';
			this.activeMenuItem = 9;
		} else if (value === 'Documents') {
			this.referenceId=this.customerId; 
			this.referenceId=this.referenceId? this.referenceId :this.editGeneralInformationData.customerId;
			this.currentTab = 'Documents';
			this.activeMenuItem = 10;
		}
		localStorage.setItem('currentTab', value);
	}
	generalInformationData(data) {
		this.savedGeneralInformationData = data;
		this.isDisabledSteps = true;
	}

	updateInformationData(data) {
		if (data !== undefined && this.editGeneralInformationData) {
			this.editMode = false;
			this.editGeneralInformationData = undefined;
		}

		setTimeout(() => {
			this.editGeneralInformationData = data;
			this.editMode = true;
		})
	}

	getAllCountries() {
		this.commonservice.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name','',true,20).subscribe(res => {
			this.countryListOriginal = res;
		})
	}

	//Need to Delete Afert verify
	// getAllCountries1old() {
	// 	this.customerService.getCountrylist().subscribe(res => {
	// 		this.countryListOriginal = res[0];
	// 	})
	// }
	
	  loadcustomerData(strText = '') {
		if(this.customerId > 0)
			this.arrayCustlist.push(this.customerId);
		if(this.arrayCustlist.length == 0) {			
			this.arrayCustlist.push(0); }
		this.commonservice.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name',strText,true,20,this.arrayCustlist.join()).subscribe(response => {
			this.customerListOriginal = response;
			this.customerallListOriginal = response;
		},err => {
			const errorLog = err;
			this.errorMessageHandler(errorLog);		
		});
		if (this.customerId) {
			this.isDisabledSteps = true;
		}
	}	 

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
	}
	async getJobTitles() {
		await this.commonservice.getJobTitles(this.currentUserMasterCompanyId).subscribe(res => {
			this.jobTitles = res;
		})
	}

	getAllATAChapter() {
		this.atamain.getAtaMainList().subscribe(res => {
			const responseData = res[0];
			// used to get the complete object in the value 
			this.add_ataChapterList = responseData.map(x => {
				return {
					value: x,
					label: x.ataChapterCode + ' - ' + x.ataChapterName
				}
			})
			// used to get the id for the value 
			this.search_ataChapterList = responseData.map(x => {
				return {
					value: x.ataChapterId,
					label: x.ataChapterCode + '-' + x.ataChapterName
				}
			})

			this.search_ataChapterList1 = responseData.map(x => {
				return {
					value: x.ataChapterId,
					label: x.ataChapterName,
					code: x.ataChapterCode
				}
			})

		});
	}

	saveCustomerContactATAMapped(ATAMappingData) {
		const data = ATAMappingData;
		this.customerService.postCustomerATAs(data).subscribe(res => {

			this.getMappedContactByCustomerId(data[0].CustomerId)
			this.getMappedATAByCustomerId(data[0].CustomerId)
			this.alertService.showMessage(
				'Success',
				'ATA chapter Info saved successfully',
				MessageSeverity.success
			);
		}, error => {
			this.getMappedContactByCustomerId(data[0].CustomerId)
			this.getMappedATAByCustomerId(data[0].CustomerId)

			this.alertService.showMessage(
				'Failed',
				error.error,
				MessageSeverity.error
			);
		})
	}

	getFinanceInfoByCustomerId(customerId) {		
		this.customerService.getFinanceInfoByCustomerId(customerId).subscribe(res => {
			this.savedGeneralInformationData = res;
		})
	}

	getSalesInfoByCustomerId(customerId) {		
		this.customerService.getSalesInfo(customerId).subscribe(res => {
			if(res)
			{
				this.savedGeneralInformationData = res;
			}
		})
	}

	getMappedATAByCustomerId(customerId) {
		
		this.customerService.getATAMappedByCustomerId(customerId).subscribe(res => {
			this.ataListDataValues = res;
		})
	}
	getMappedContactByCustomerId(customerId) {

		this.customerService.getContactsByCustomerId(customerId).subscribe(res => {
			const responseData: any = res;
			this.contactList = responseData.map(x => {
				return {
					label: x.firstName, value: x.contactId
				}
			})
		})
	}

	errorMessageHandler(log) {
		const errorLog = log;
		var msg = '';
		if(errorLog.message) {
		  if (errorLog.error && errorLog.error.errors.length > 0) {
					for (let i = 0; i < errorLog.error.errors.length; i++){
						msg = msg + errorLog.error.errors[i].message + '<br/>'
					}
				}
				this.alertService.showMessage(
                    errorLog.error.message,
					msg,
					MessageSeverity.error
				);
		   }
		   else {
			this.alertService.showMessage(
				'Error',
				log.error,
				MessageSeverity.error
			); }
	}

	expandShipping: any;
}
