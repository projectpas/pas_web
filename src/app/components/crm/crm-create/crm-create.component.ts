import { Component, OnInit, ViewChild } from '@angular/core';

import { Location } from "@angular/common";
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';

import { Router, ActivatedRoute } from '@angular/router';
import { CrmService } from '../../../services/crm.service';
import { CustomerService } from '../../../services/customer.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

import { EmployeeService } from '../../../services/employee.service';
import { AtaMainService } from '../../../services/atamain.service';
import {  Inject, Input, Output, EventEmitter, ElementRef } from '@angular/core';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { CreditTermsService } from '../../../services/Credit Terms.service';
import { CommonService } from '../../../services/common.service';
import { fadeInOut } from '../../../services/animations';
import { emailPattern, urlPattern } from '../../../validations/validation-pattern';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { MenuItem } from 'primeng/api';
import { DBkeys } from '../../../services/db-Keys';
import { getObjectByValue, getPageCount, getObjectById,getValueByFieldFromArrayofObject, getValueFromObjectByKey, editValueAssignByCondition, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';


@Component({
	selector: 'app-crm-create',
	templateUrl: './crm-create.component.html',
	styleUrls: ['./crm-create.component.scss'],
animations: [fadeInOut]
})
export class CrmCreateComponent {
	@Output() triggeNTAETab  = new EventEmitter<any>();
	@Input() isViewMode: boolean = false;
	@Output() saveCrmData = new EventEmitter<any>();
	@Output() editCrm = new EventEmitter<any>();
	@Input() crmList;
	
	
	countryListOriginal: any[];
   
	creditTermsListOriginal: any[];
	customerNames: { customerId: any; name: any; }[];
	customerCodes: { customerId: any; name: any; }[];
	emailPattern = emailPattern();
	local: any;
	allcustomerclassificationInfo;
	reportList;
	loadingIndicator: boolean;
	dataSource: MatTableDataSource<any>;
	length: number;
	selectedColumn:any;
	countrycollection: any[];
	editMode: boolean = false;
	customerListOriginal: { customerId: any; name: any; }[];
	crmId:number=0;
	globalSettings: any = {};
	
	modal: NgbModalRef;
	allCountryinfo: any[];
	contactList: any;
	isEdit: boolean = false;
	breadcrumbs: MenuItem[];
	jobTitles: Object; 
	defaultwithVendor: any[];
	alldata: any;
	id: number;
	isNTAEDisabledSteps = true;
	selectedTab: string = "";
	selectedNTAETabId: any;
	editData: any;
	changeName: boolean = false;
	customerTypeId: number;
	customertypes: any[];
	reports:any[];
	customerPhone: string;
	email:string;
	address1:string;
	address2:string;
	city:string;
	stateOrProvince: string;
	postalCode:string;
	countryId:number;
	parentId:string;
	country:any;
	createdBy:string;
	updatedBy:string;
	isCustomerNameAlreadyExists: boolean = false;
	disableAccountType: boolean = false;
	masterCompanyId:number;
	isActive:boolean;
	creditLimit:number;
	creditTermsId:number;
	primarySalesPersonId:number;
	csrId:number;
	secondarySalesPersonId:number;
	annualQuota:string;
	customerPhoneExt:string;
	customerClassificationIds:any;
	warnings:string;
	YTDRevenueTY:number;
	YTDRevenueLY:number;
	isDeleted:boolean;
	accountsReceivables:string;
	DSO:string;
	ReportId:number;
	AddressId:number;
	customerCode:string;
	name:string;	
	addressId:number;
	primarySalesPersonName:string;
	secondarySalesPersonNamae:string;
	csrList: any;
	primarySPList: any[] = [];
	secondarySPList: any[] = [];
	parentCustomer = [];
	_creditTermsList: any[];
	disableSaveParentName: boolean;
	disableSaveCustomerName: boolean;
	selectedActionName: any;
	global_lang: string;
	secondarySPListFilterData: any[];
    primarySPListFilterData: any[];
	public defaultSaveObj: any = {};
	public checkValue: boolean = false;
	public domasticWireValue: boolean = false;
    public internationalValue: boolean = false;
    @ViewChild('crmForm',{static:false}) crmForm: NgForm;
	public checkStyle: boolean = false;
	public domesticWireStyle: boolean = false;
	public internationalStyle: boolean = false;
	isCustomerCodeAlreadyExists: boolean = false;
	ntaeTableColumns: any[];
	currentNTAETab: string = 'Activities';
	activeNTAEMenuItem: number = 1;
	cols: any[];
	selectedColumns: any[] = [];
	
	activeMenuItem: number = 1;
	dealHeaders = [
        { field: 'dealName', header: 'Deal Name' },
        { field: 'openDate', header: 'Open Date' },
        { field: 'closingDate', header: 'Closing Date' },
        { field: 'accountName', header: 'Account Name' },
		{ field: 'accountContact', header: 'Account Contact' },
		{ field: 'probability', header: 'Probability' },
        { field: 'expectedRevenue', header: 'Expected Revenue' },
        { field: 'dealStage', header: 'Deal Stage' },
		{ field: 'outCome', header: 'Outcome' },
	
		{ field: 'source', header: 'Source' },
        { field: 'followup', header: 'Follow Up' },
        { field: 'salesPerson', header: 'Salesperson' },
       
	]
	selectedColumnsDeals=this.dealHeaders;

    headers = [
        { field: 'accountName', header: 'Account Name' },
        { field: 'accountType', header: 'Accont Type' },
        { field: 'parent', header: 'Parent' },
        { field: 'city', header: 'City' },
        { field: 'country', header: 'Country' },
        { field: 'contact', header: 'Contact' },
        { field: 'contactPhone', header: 'Contact Phone' },
        { field: 'salesPerson', header: 'Sales Person' },
        { field: 'assignedDate', header: 'Assigned Date' },
        { field: 'csr', header: 'CSR' },
        { field: 'ytdRevenue', header: 'YTD Revenue(TY)' },
        { field: 'ytdRevenue', header: 'YTD Revenue(LY)' },
        { field: 'quota', header: 'Quota' }
    ]

	constructor(private crmService: CrmService,
		private customerService: CustomerService,
		private authService: AuthService,
		private acRouter: ActivatedRoute,
		public employeeService: EmployeeService,
		private alertService: AlertService,
		private route: Router,
		private modalService: NgbModal,
		private activeModal: NgbActiveModal,
		private commonService: CommonService,
		public creditTermService: CreditTermsService,
		private localStorage: LocalStoreManager,
	) {
		
		this.cols = [
			{ field: 'siteName', header: 'Site Name' },
			{ field: 'address1', header: 'Address1' },
			{ field: 'address2', header: 'Address2' },
			{ field: 'city', header: 'City' },
			{ field: 'stateOrProvince', header: 'State/Prov' },
			{ field: 'postalCode', header: 'Postal Code' },
			{ field: 'countryName', header: 'Country' },
			{ field: 'isPrimayPayment', header: 'IsPrimary' }
		];
		this.selectedColumns = this.cols;
		
		this.dataSource = new MatTableDataSource();

	}
	crmInfo = {
        customerTypeId: null,
        customerPhone: '',
        email: "",
        address1: "",
        address2: "",
        city: "",
        stateOrProvince: "",
		postalCode: "",
		countryId:null,
		parentId:"",
		country:'',
		createdBy:"",
		updatedBy:"",
	
		masterCompanyId:null,
		isActive:true,
		creditLimit:"",
		creditTermsId:null,
		primarySalesPersonId:null,
		csrId:null,
		secondarySalesPersonId:null,
		annualQuota:"",
		customerPhoneExt:"",
	
		warnings:"",
		YTDRevenueTY:null,
		YTDRevenueLY:null,
        primarySalesPersonName: "",
        secondarySalesPersonName: "",
		customerClassificationIds:[],
		isDeleted:false,
		accountsReceivables:"",
		DSO:"",
		ReportId:null,
		AddressId:null,
		customerCode:"",
		name:"",
		addressId:"",

    }
	ngOnInit() {
		this.getAllCountries();
		this.getAllCustomerTypes();
		this.getAllCustomers();
		this.getJobTitles();
		this.getSalesPersonList();
		this.getAllCustomerClassification();
		this.getAllcreditTermList();
		this.getAllReports();
		this.getAllCrmData();
		this.getAllCreditTerms();
		this.breadcrumbs = [
			{ label: 'Crm' },
		];
	
	}

	

	get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}
	formatCreditLimit(val) {
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.crmInfo.creditLimit = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.crmInfo.creditLimit;
        }

    }

	onClearParent() {
        this.crmInfo.parentId = undefined;
    }
	getAllCustomerTypes() {
        this.customerService.getCustomerTypes().subscribe(res => {
            const responseData = res[0];
            this.customertypes = responseData;
        })
	}
	

	selectedCustomerCode() {
        this.isCustomerCodeAlreadyExists = true;
    }
	
	async getAllCustomerClassification() {
        await this.commonService.smartDropDownList('CustomerClassification', 'CustomerClassificationId', 'Description').subscribe(res => {
            this.allcustomerclassificationInfo = res;
        });

	}
	getAllcreditTermList() {
        this.commonService.smartDropDownList('CreditTerms', 'CreditTermsId', 'Name').subscribe(res => {
            this.crmList = res;
        })
	}
	getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }
	
	async  getCustomerClassificationByCustomerId() {
        await this.customerService.getCustomerClassificationMapping(this.id).subscribe(res => {
            this.crmInfo.customerClassificationIds = res.map(x => x.customerClassificationId);
        });
	}
	
	async getAllReports() {
		await this.commonService.smartDropDownList('Report', 'ReportId', 'ReportName').subscribe(res => {
			this.reportList = res;
		});
	
	}
	
	changeOfNTAETab(value) {
        if (value === 'Activites') {
            this.currentNTAETab = 'Activities';
            this.activeNTAEMenuItem = 1;
        } else if (value === 'Notes') {
            this.currentNTAETab = 'Notes';
            this.activeNTAEMenuItem = 2;
        } else if (value === 'Follow Ups') {
            this.currentNTAETab = 'Follow Ups';
            this.activeNTAEMenuItem = 3;
        } else if (value == "Communication") {
            this.currentNTAETab = 'Communication';
            this.activeNTAEMenuItem = 4;
        }

	}

	filterCustomerCode(event) {
        this.customerCodes = this.crmList;
        this.customerCodes = [...this.crmList.filter(x => {
            return x.customerCode.toLowerCase().includes(event.query.toLowerCase())
        })]
    }
	filterPrimary(event) {
        let data;
        if (!this.editMode) {
            if (this.crmInfo.secondarySalesPersonId !== undefined && this.crmInfo.secondarySalesPersonId !== '' && this.crmInfo.secondarySalesPersonId !== null) {
                data = this.primarySPListFilterData;
            } else {
                data = this.crmList;
            }
        } else {


            if (this.crmInfo.secondarySalesPersonId !== undefined) {
                data = [...this.crmList.filter(x => {
                    if (this.crmInfo.secondarySalesPersonId.employeeId !== x.employeeId) {
                        return x;
                    }
                })]
            } else {
                data = this.crmList;
            }


        }
 
        this.primarySPList = data;

        const primarySPData = [...data.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.primarySPList = primarySPData;
    }

	filterSecondary(event) {
        let data;
        if (!this.editMode) {
            if (this.crmInfo.primarySalesPersonId !== undefined && this.crmInfo.primarySalesPersonId !== '' && this.crmInfo.primarySalesPersonId !== null) {
                data = this.secondarySPListFilterData;
            } else {
                data = this.crmList;
            }
        } else {
            if (this.crmInfo.primarySalesPersonId !== undefined) {
                data = [...this.crmList.filter(x => {
                    if (this.crmInfo.primarySalesPersonId.employeeId !== x.employeeId) {
                        return x;
                    }
                })]
            } else {
                data = this.crmList;
            }

        }

        this.secondarySPList = data;

        const secondarySPData = [...data.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.secondarySPList = secondarySPData;
	}
	filterCustomerParentNames(event) {
        this.parentCustomer = this.crmList;
        this.parentCustomer = [...this.crmList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
    }
	filterCSR(event) {
        this.csrList = this.crmList;

        const CSRData = [...this.crmList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.csrList = CSRData;
	}
	filterCreditTerm(event) {
        this._creditTermsList = this.crmList;

        const CREDITTERMDATA = [...this.crmList.filter(x => {
            return x.label.toLowerCase().includes(event.query.toLowerCase())
        })]
        this._creditTermsList = CREDITTERMDATA;
    }
	selectedParentName(event) {
        if (this.changeName == false) {
            if (event.name === this.crmInfo.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
        else {
            if (event.name === this.crmInfo.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
	}
	checkWithName(event) {
        if (this.changeName == false) {
            if (event === this.crmInfo.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
        else {
            if (event === this.crmInfo.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
    }
	selectedSalesPerson(object, type) {
        if (type === 'PrimarySalesPerson') {
            this.secondarySPListFilterData = [...this.crmList.filter(x => {
                if (object.employeeId !== x.employeeId) {
                    return x;
                }
            })]


        } else if (type === 'SecondarySalesPerson') {
            this.primarySPListFilterData = [...this.crmList.filter(x => {
                if (object.employeeId !== x.employeeId) {
                    return x;
                }
            })]
        }
	}

	checkCustomerCodeExist(value) {
        this.isCustomerCodeAlreadyExists = false;
        for (let i = 0; i < this.crmList.length; i++) {
            if (this.crmInfo.customerCode == this.crmList[i].customerCode || value == this.crmList[i].customerCode) {
                this.isCustomerCodeAlreadyExists = true;
              
                return;
            }
        }
    }

	checkCustomerNameExist(value) {
        this.changeName = true;
        this.isCustomerNameAlreadyExists = false;
        this.disableSaveCustomerName = false;
        if (value != this.crmInfo.name) {
            for (let i = 0; i < this.crmList.length; i++) {
                if (this.crmInfo.name == this.crmList[i].name || value == this.crmList[i].name) {
                    this.isCustomerNameAlreadyExists = true;
                   
                    this.disableSaveCustomerName = true;
                    this.selectedActionName = event;
                    return;
                }
            }
        }
    }

	selectedCustomerName() {
        this.isCustomerNameAlreadyExists = true;
    }


	getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
	public applyFilter(filterValue: string) {
		this.dataSource.filter = filterValue;
	}
	private refresh() {
		this.applyFilter(this.dataSource.filter);
	}

	
	filterCountries(event) {
        this.countrycollection = this.countryListOriginal;
        this.countrycollection = [...this.countryListOriginal.filter(x => {
            return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
        })]
	}
	filterCustomerNames(event) {
        this.customerNames = this.crmList;
        this.customerNames = [...this.crmList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
	}


	selectedCustomerType(event) {
        if (event == 1 || event == 3) {
            this.crmInfo.customerTypeId = 3;
            this.disableAccountType = true;
        }
        else {
            this.disableAccountType = false;

        }


    }


	saveCrm(){
        if(this.crmForm.invalid) {
            this.alertService.showMessage('CRM', "Please enter required highlighted fields ", 
            MessageSeverity.error);
			
		}
		else {
			const crmInfoObj = {

customerTypeId:this.crmInfo.customerTypeId?this.getCustomerTypeId(this.crmInfo.customerTypeId):null,
   reports:this.crmInfo.ReportId?this.getReportId(this.crmInfo.ReportId):0,
name: this.crmInfo.name?this.getCustomerName(this.crmInfo.name):"",
customerCode:this.crmInfo.customerCode?this.getCustomerCode(this.crmInfo.customerCode):"",
 parentId:this.crmInfo.parentId?this.getParentId(this.crmInfo.parentId):0,
 customerClassificationIds:
 this.crmInfo.customerClassificationIds?this.getCustomerClassificationIds(this.crmInfo.customerClassificationIds):[],
address1:this.crmInfo.address1 ? this.crmInfo.address1 : '',
 address2:this.crmInfo.address2 ? this.crmInfo.address2 : '',
city:this.crmInfo.city ? this.crmInfo.city : '',
stateOrProvince:this.crmInfo.stateOrProvince ? this.crmInfo.stateOrProvince : '',
postalCode:this.crmInfo.postalCode ? this.crmInfo.postalCode : '',
countryId:this.crmInfo.countryId?this.getCountryId(this.crmInfo.countryId):0,

customerPhone:this.crmInfo.customerPhone ? this.getCustomerPhone(this.crmInfo.customerPhone) : "",
email:this.crmInfo.email ? this.crmInfo.email : '',
primarySalesPersonId:this.crmInfo.primarySalesPersonId?this.getPrimarySalesPersonId(this.crmInfo.primarySalesPersonId):null,
secondarySalesPersonId:this.crmInfo.secondarySalesPersonId?this.getSecondarySalesPersonId(this.crmInfo.secondarySalesPersonId):null,
csrId:this.crmInfo.csrId?this.getCsrId(this.crmInfo.csrId):null,
YTDRevenueTY:this.crmInfo.YTDRevenueTY?this.crmInfo.YTDRevenueTY:null,
YTDRevenueLY:this.crmInfo.YTDRevenueLY?this.crmInfo.YTDRevenueLY:null,
annualQuota:this.crmInfo.annualQuota?this.crmInfo.annualQuota:null,
accountsReceivables:this.crmInfo.accountsReceivables?this.crmInfo.accountsReceivables:null,
creditLimit: this.crmInfo.creditLimit ? this.crmInfo.creditLimit : '',
creditTermsId: this.crmInfo.creditTermsId ? this.crmInfo.creditTermsId : null,
DSO:this.crmInfo.DSO?this.crmInfo.DSO:'',
warnings:this.crmInfo.warnings ? this.crmInfo.warnings : '',	
createdBy: this.userName,
updatedBy: this.userName
			}
	
		if (!this.isEdit) {

            this.crmService.newAction({
				...crmInfoObj, 
				countryId: getValueFromObjectByKey('countries_id', this.crmInfo.countryId),

				createdBy: this.userName, updatedBy: this.userName, masterCompanyId: 1
			}).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Customer General Information Sucessfully `,
                    MessageSeverity.success
                );
                this.saveCrmData.emit(res);
                this.editData = res;
                this.isEdit = true;
            })

        } else {
            this.crmService.updateAction({
                ...crmInfoObj,
                name: editValueAssignByCondition('name', this.crmInfo.name),
				 customerCode: editValueAssignByCondition('customerCode', this.crmInfo.customerCode),

				 primarySalesPersonId: editValueAssignByCondition('primarySalesPersonId', this.crmInfo.primarySalesPersonId),
				 secondarySalesPersonId: editValueAssignByCondition('secondarySalesPersonId', this.crmInfo.secondarySalesPersonId),

                country: getValueFromObjectByKey('nice_name', this.crmInfo.country),
			     createdBy: this.userName, updatedBy: this.userName, masterCompanyId: 1
            }).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Upated  Customer General Information Sucessfully `,
                    MessageSeverity.success
                );
                this.editCrm.emit(res);
                this.id = res.customerId;
                this.editData = res;

                this.isEdit = true;
            })
        }
    }

	}

    getCustomerTypeId(obj) {
		if (obj.customerTypeId) {
			return obj.customerTypeId;
		} else {
			return this.crmInfo.customerTypeId;
		}
    }
    getReportId(obj) {
		if (obj.ReportId) {
			return obj.ReportId;
		} else {
			return 0;
		}
    }
    getCustomerName(obj) {
		if (obj.name) {
			return obj.name;
		} else {
			return "";
		}
    }
    getCustomerCode(obj) {
		if (obj.customerCode) {
			return obj.customerCode;
		} else {
			return 0;
		}
    }
    getParentId(obj) {
		if (obj.parentId) {
			return obj.parentId;
		} else {
			return this.crmInfo.parentId;
		}
    }
    getCustomerClassificationIds(obj) {
		if (obj.customerClassificationIds) {
			return obj.customerClassificationIds;
		} else {
			return this.crmInfo.customerClassificationIds;
		}
    }
    getCountryId(obj) {
		if (obj.countryId) {
			return obj.countryId;
		} else {
			return obj;
		}
    }
    getCsrId(obj) {
		if (obj.csrId) {
			return obj.csrId;
		} else {
			return 0;
		}
    }
    getPrimarySalesPersonId(obj) {
		if (obj.primarySalesPersonId) {
		
			return obj.primarySalesPersonId;
			
		} else {
			return 0;
			
		}

    }
    getSecondarySalesPersonId(obj) {
		if (obj.secondarySalesPersonId) {
			return obj.secondarySalesPersonId;
		} else {
			return 0;
		}
    }

    getCustomerPhone(obj) {
		if (obj.customerPhone) {
			return obj.customerPhone;
		} else {
			return this.crmInfo.customerPhone;
		}
	}

	patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }

    }

	getAllCountries() {
		this.customerService.getCountrylist().subscribe(res => {
			this.countryListOriginal = res[0];
		})
	}



	getAllCreditTerms() {
		this.commonService.smartDropDownList('CreditTerms', 'CreditTermsId', 'Name').subscribe(res => {
			this.creditTermsListOriginal = res;

		})
	}

	getAllCustomers() {
		this.customerService.getCustomers().subscribe(res => {
			this.customerListOriginal = res[0];

		})
	}



	getSalesPersonList() {
  
         const id = getValueByFieldFromArrayofObject('jobTitle', 'Sales', this.jobTitles);

        if (id !== undefined) {
            this.commonService.getEmployeesByCategory(id[0].jobTitleId).subscribe(res => {

                this.crmList = res;
            })
        }
    }

	async getJobTitles() {
		await this.commonService.getJobTitles().subscribe(res => {
			this.jobTitles = res;
		})
	}

	getAllCrmData() {
		this.customerService.getallCustomers().subscribe(res => {
			this.crmList = res[0];
		})
		
	}


}

