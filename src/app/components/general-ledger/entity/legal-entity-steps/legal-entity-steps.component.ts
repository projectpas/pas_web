import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { MenuItem } from 'primeng/api';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../../services/customer.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { CommonService } from '../../../../services/common.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
// import { CommonDocumentsComponent } from '../../../common-components/common-documents/common-documents.component';
// CommonDocumentsComponent
@Component({
	selector: 'app-legal-entity-create',
	templateUrl: './legal-entity-steps.component.html',
	styleUrls: ['./legal-entity-steps.component.scss']
})
/** customer-steps-primeng component*/
export class LegalEntityStepsComponent { 
	activeMenuItem: number = 1;
	currentTab: string = 'General';
	savedGeneralInformationData: any;
	countryListOriginal: any[] = [];
	creditTermsListOriginal: any[];
	entityId: number;
	editMode: boolean = false;
	customerListOriginal: { customerId: any; name: any; }[];

	customerallListOriginal: { customerId: any; name: any; }[];
	editGeneralInformationData: any;
	employeeListOriginal: any[];
	isDisabledSteps: boolean = false;
	search_ataChapterList: any;
	add_ataChapterList: any;
	ataListDataValues: any[] = [];
	contactList: any;
	breadcrumbs: MenuItem[];

    loadingIndicator: boolean;
    // allCurrencyInfo: any[];
    sourceLegalEntity: any = {};
    parentLegalEntity: any = {};
    allCountryinfo: any[];
    countrycollection: any[];
    disablesave: boolean;
    selectedCountries: any;
    allATAMaininfo: any[] = [];
    cols: any[];
    selectedColumns: any[];
    selectedColumns1: any[];
    dataSource: MatTableDataSource<{}>;

    isEditMode: boolean = false;
	isDeleteMode: boolean;
	public sourceAction: any = [];
	public GeneralInformationValue: boolean = true;
	public LockboxValue: boolean = false;
	public domesticWireValue: boolean = false;
	public internationalValue: boolean = false;
	public GeneralInformationStyle: boolean = true;
	public LockboxStyle: boolean = false;
	public domesticWireStyle: boolean = false;
	public internationalStyle: boolean = false;
	ACHStyle: boolean;
	ACHValue: boolean;
	entityName: string;
    Active: string;
	entityViewFeilds: any = {};
	moduleName:any="LegalEntity"
	constructor(private customerService: CustomerService,
		private acRouter: ActivatedRoute, private router: Router,
		private alertService: AlertService,
        location: Location,
		private commonservice: CommonService,
        public legalEntityService: LegalEntityService,
	) {		
		// console.log(location.path());
	}

	ngOnInit() { 
		this.entityId = this.acRouter.snapshot.params['id'];   
        if (this.entityId) {
			this.isDisabledSteps = true;
			this.editMode = true;
			// if(!this.router.url.includes('generalledgermodule/generalledgerpage/app-legal-entity-edit/')){
				this.getEntityDataById(this.entityId);
			// }
		// }else{
			// localStorage.removeItem('currentLETab')
		}
        this.sourceLegalEntity.isBalancingEntity = true;
          this.GeneralInformation();
        this.sourceLegalEntity = {};
        this.sourceLegalEntity.isBalancingEntity = true;
        this.sourceLegalEntity.isActive = true;

		this.breadcrumbs = [
			{ label: 'Legal Entity' },
            { label: this.editMode ? 'Edit Legal Entity' : 'Create Legal Entity' },
		];
		
    }
	generalInformation:any={};
	getEntityDataById(id) {
        this.legalEntityService.getEntityDataById(id).subscribe(res => {
			if(localStorage.getItem('currentLETab')){
				this.changeOfTab(localStorage.getItem('currentLETab'))
			}
this.updateInformationData(res)
        }, err => {
        })
    } 
	changeOfTab(value) {
		// console.log("value",value)
		if (value === 'General') {
			this.currentTab = 'General';
			this.activeMenuItem = 1;
        } else if (value === 'Contacts') {
			this.currentTab = 'Contacts';
			this.activeMenuItem = 2;
		} else if (value === 'Banking') {
            this.currentTab = 'Banking';
			this.activeMenuItem = 3;
		} else if (value === 'Billing') {
			this.currentTab = 'Billing';
			this.activeMenuItem = 4;
		} else if (value === 'Shipping') {
			this.currentTab = 'Shipping';
			this.activeMenuItem = 5;
		}  else if (value === 'Documents') {
			this.currentTab = 'Documents';
			this.activeMenuItem = 6;
		}  
		 else if (value === 'CommonDocuments') {
			this.currentTab = 'CommonDocuments';
			this.activeMenuItem = 7;
			this.referenceId=this.entityId;
		}  
		if(	this.editMode = true){
			localStorage.setItem('currentLETab', value);  
		}
    }
	referenceId:any;
    GeneralInformation() {
        this.GeneralInformationValue = true;
        this.LockboxValue = false;
        this.domesticWireValue = false;
        this.internationalValue = false;
        this.ACHValue = false;
        this.GeneralInformationStyle = true;
        this.LockboxStyle = false;
        this.domesticWireStyle = false;
        this.internationalStyle = false;
        this.ACHStyle = false;
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
			this.isDisabledSteps = true;
		})
	}
	saveCustomerContactATAMapped(ATAMappingData) {
		const data = ATAMappingData;
		this.customerService.postCustomerATAs(data).subscribe(res => {
			this.alertService.showMessage(
				'Success',
				'Saved ATA Mapped Data Successfully ',
				MessageSeverity.success
			);
		}, error => {
			this.alertService.showMessage(
				'Failed',
				error.error,
				MessageSeverity.error
			);
		})

	}
}