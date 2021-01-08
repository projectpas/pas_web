
import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef, Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Vendor } from '../../../models/vendor.model';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { GMapModule } from 'primeng/gmap';
import * as $ from 'jquery';
import { getObjectByValue, getPageCount, getObjectById, getValueFromObjectByKey, editValueAssignByCondition, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { ConfigurationService } from '../../../services/configuration.service';
import { CommonService } from '../../../services/common.service';

import { CrmService } from '../../../services/crm.service';
import {  Inject, Output, EventEmitter, ElementRef } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';

declare const google: any;

@Component({
	selector: 'app-opportunity-setup',
 	templateUrl: './opportunity-setup.component.html',
 	styleUrls: ['./opportunity-setup.component.scss'],
	animations: [fadeInOut]
})
export class OpportunitySetupComponent implements OnInit, AfterViewInit {

	@Output() saveLeadData = new EventEmitter<any>();
	@Output() editLead = new EventEmitter<any>();
	@Input() leadList;


	countryListOriginal: any[];
	customerTypeId:number;
	email:string;
	address1:string;
	address2:string;
	city:string;
	stateOrProvince:string;
	postalCode:string;
	countryId:number;
	createdBy:string;
	updatedBy:string;
	updatedDate:Date=new Date();
	createdDate:Date=new Date();
	masterCompanyId:number;
	isActive:boolean=false;
	primarySalesPersonId:number;
	secondarySalesPersonId:number;
	annualRevenue:number;
	customerClassificationIds:any [];
	isDeleted:boolean=false;
	SourceId:number;
	SourceDescription:string;
	name:string;
	customerCode:string;
	Website:string;
	ContactTag:string;
	ContactName:string;
	IsDecisionMaker:boolean=true;
	DecisionMaker:string;
	NoOfEmployees:number;
	Competition:string;
	Memo:string;
	customerId:number;
	addressId:number;

	isEdit: boolean = false;
	editData: any;
	countrycollection: any[];
	primarySPList: any[] = [];
	secondarySPList: any[] = [];
	secondarySPListFilterData: any[];
	primarySPListFilterData: any[];
	editMode: boolean = false;

	modelValue: boolean;
	display: boolean;
	

	collection: any;
	action_name: any = "";
	allAddresses: any[];

	viewName: string = "Create";
	sub: any;
	local: any;
	isDepreciable: boolean = true;
	isIntangible:boolean=false;
	closeCmpny: boolean = true;
	service: boolean = false;
	
	selectedAircraftId: any;
	modelUnknown = false;
	canAddAircraft: boolean = false;
	updatedCollection: {};


	aircraftInformationHeaders = [
        { field: 'aircraft', header: 'Aircraft' },
        { field: 'model', header: 'Model' },
        { field: 'dashNumbers', header: 'Dash Numbers' },
        { field: 'inventory', header: 'Inventory' },
        { field: 'memo', header: 'Memo' },
       
    ]
    ataChapterHeaders = [
        { field: 'ataChapter', header: 'ATA Chapter' },
        { field: 'ataSubChapter', header: 'ATA Sub-Chapter' },
     
	]
	ataHeaders = [
		{ field: 'ataChapterName', header: 'ATA Chapter' },
		{ field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
	]
	

	showAdvancedSearchCard: boolean = false;
	showAdvancedSearchCardAtaChapter: boolean = false;
	
	selectedColumnsForAircraftInformation = this.aircraftInformationHeaders;
    selectedColumnsAtaChapter = this.ataChapterHeaders;

	siteName: any;
	
	country: any;
	
	selectedRowforDelete: any;
	@ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
	@ViewChild(MatSort,{static:false}) sort: MatSort;
	filteredBrands: any[];
	displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
	dataSource: MatTableDataSource<any>;
	allActions: any[] = [];
	allComapnies: MasterCompany[] = [];
	private isSaving: boolean;
	public sourceVendor: any = {};
	
	loadingIndicator: boolean;
	closeResult: string;
	selectedColumn: any[];
	selectedColumns: any[] = [];
	cols: any[];
	title: string = "Create";
	id: number;
	errorMessage: any;
	modal: NgbModalRef;
	actionName: string;
	Active: string = "Active";
	length: number;
	localCollection: any[] = [];
	public overlays: any[];
	allCountryinfo: any[];
	disablesave: boolean;
	
	selectedCountries: any;
	private isEditMode: boolean = false;
	private isDeleteMode: boolean = false;
	isEditPaymentInfo: boolean = false;
	pageSize: number = 10;
	@Input() vendorId: number = 0;
	@Input() isViewMode: boolean = false;
	isvendorEditMode: any;
	formData = new FormData();
	disableSave: boolean = true;
	loaderForPaymentCheck: boolean;
	constructor(private http: HttpClient, private commonService: CommonService,
		 
		 private authService: AuthService, private modalService: NgbModal,
		 private activeModal: NgbActiveModal, private _fb: FormBuilder,
		  private alertService: AlertService,
		  private crmService: CrmService,
		  private customerService: CustomerService,
		   public vendorService: VendorService) {
	
	}
	opportunityInfo = {
		customerTypeId:0,
		email:"",
		address1:"",
		address2:"",
		city:"",
		stateOrProvince:"",
		postalCode:"",
		countryId:0,
		createdBy:"",
		updatedBy:"",
		updatedDate:"",
		createdDate:"",
		masterCompanyId:0,
		isActive:true,
		primarySalesPersonId:0,
		
		secondarySalesPersonId:null,
		annualRevenue:0,
		customerClassificationIds:[],
		isDeleted:false,
		SourceId:0,
		SourceDescription:"",
		name:"",
		customerCode:"",
		Website:"",
		ContactTag:"",
		ContactName:"",
		IsDecisionMaker:true,
		DecisionMaker:"",
		NoOfEmployees:0,
		Competition:"",
		Memo:"",
		customerId:0,
		addressId:0,
    }


	ngOnInit() {

		this.getAllCountries();

	
	}

	ngAfterViewInit() {
	}
	public allWorkFlows: any[] = [];
	

	
	onTangible() {
       
        this.isDepreciable = true;
        this.isIntangible = false;
    }

	onIntangible() {
       
        this.isIntangible = true;
        this.isDepreciable = false;
      
	}
	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}
	addATAChapter(rowData) {
		

	}

	enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        
	}
	
	enableDisableAdvancedSearchAtaChapter(val) {
        this.showAdvancedSearchCardAtaChapter = val;
      
    }

	filterPrimary(event) {
        let data;
        if (!this.editMode) {
			if (this.opportunityInfo.secondarySalesPersonId !== undefined &&this.opportunityInfo.secondarySalesPersonId !== '' && this.opportunityInfo.secondarySalesPersonId !== null) {
                data = this.primarySPListFilterData;
            } else {
                data = this.leadList;
            }
        } else {


            if (this.opportunityInfo.secondarySalesPersonId !== undefined) {
                data = [...this.leadList.filter(x => {
                    if (this.opportunityInfo.secondarySalesPersonId.employeeId !== x.employeeId) {
                        return x;
                    }
                })]
            } else {
                data = this.leadList;
            }


        }
 
        this.primarySPList = data;

        const primarySPData = [...data.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.primarySPList = primarySPData;
    }

	selectedSalesPerson(object, type) {
        if (type === 'PrimarySalesPerson') {
            this.secondarySPListFilterData = [...this.leadList.filter(x => {
                if (object.employeeId !== x.employeeId) {
                    return x;
                }
            })]


        } else if (type === 'SecondarySalesPerson') {
            this.primarySPListFilterData = [...this.leadList.filter(x => {
                if (object.employeeId !== x.employeeId) {
                    return x;
                }
            })]
        }
	}


	getAllCountries() {
		this.customerService.getCountrylist().subscribe(res => {
			this.countryListOriginal = res[0];
		})
	}

	filterCountries(event) {
        this.countrycollection = this.countryListOriginal;
        this.countrycollection = [...this.countryListOriginal.filter(x => {
            return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
        })]
	}
	
	
	saveLead(){
		
	
		if (!this.isEdit) {

            this.crmService.newLead({
                ...this.opportunityInfo,
			
                createdBy: this.userName, updatedBy: this.userName, masterCompanyId: 1
            }).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Lead Data Sucessfully `,
                    MessageSeverity.success
                );
                this.saveLeadData.emit(res);
                this.editData = res;
                this.isEdit = true;
            })

        } else {
            this.crmService.updateLead({
                ...this.opportunityInfo,
				
			     createdBy: this.userName, updatedBy: this.userName, masterCompanyId: 1
            }).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Upated  Customer General Information Sucessfully `,
                    MessageSeverity.success
                );
                this.editLead.emit(res);
                this.id = res.customerId;
                this.editData = res;

                this.isEdit = true;
            })
        }

	}


	closeMyModel() {
		$("#addContactDetails").modal("hide");
		this.disableSave = true;
	}

	
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}
	

	



	
	openDelete(content, row) {
	
		console.log("rowww", row)
		if (!row.isPrimayPayment) {
			this.selectedRowforDelete = row;
			this.isEditMode = false;
			this.isDeleteMode = true;
			this.sourceVendor = row;
			this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
			this.modal.result.then(() => {
				console.log('When user closes');
			}, () => { console.log('Backdrop click') })
		} else {
			$('#deletePayment').modal('show');
		}
	}

	

	
	enableSave() {
		this.disableSave = false;

	}
}
