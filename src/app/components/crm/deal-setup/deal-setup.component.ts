import { Component, OnInit, ViewChild } from '@angular/core';
import { PriorityService } from '../../../services/priority.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { NgForm } from '@angular/forms';
declare var $ : any;
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { GlAccount } from '../../../models/GlAccount.model';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition,getValueByFieldFromArrayofObject, formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { AuthService } from '../../../services/auth.service';
import { CommonService } from '../../../services/common.service';
import { DatePipe } from '@angular/common';

import { CrmService } from '../../../services/crm.service';
import {  Inject, Input, Output, EventEmitter, ElementRef } from '@angular/core';
@Component({
	selector: 'app-deal-setup',
	templateUrl: './deal-setup.component.html',
	styleUrls: ['./deal-setup.component.scss'],
	providers: [DatePipe]
})


export class DealSetupComponent implements OnInit {

	@Output() saveDealData = new EventEmitter<any>();
	@Output() editDeal = new EventEmitter<any>();
	@Input() dealList;
	

	allCustomers: any = [];
	jobTitles: Object; 
	
	 dealNames: any[];
	 dealNamesList:any[];
	customerNames: { customerId: any; name: any; }[];
	customerListOriginal: { customerId: any; name: any; }[];
	changeName: boolean = false;
	selectedActionName: any;
	crmDealId: number;
	customerId: number;
	masterCompanyId: number;
	isActive:boolean=false;
	isDeleted:boolean=false;
	createdBy:string;
	updatedBy:string;
	createdDate:  Date = new Date();
	updatedDate: Date = new Date();
	primarySalesPersonId:number;
	isDealNameAlreadyExists: boolean = false;
	dealNumber:string;
	name:string;
	dealName:string;
	isCustomerNameAlreadyExists: boolean = false;
	dealOwnerId:number;
	dealSource:string;
	closingDate: Date = new Date();
	openDate: Date = new Date();
	expectedRevenue:number;
	competitors:string;
	probability:number;
	dealStageId:number;
	dealLossReasonId:number;
	isDealOutComeWon:string;
	outCome:number;
	memo:string;
	dealLossReasonIds:any[];
	isEdit: boolean = false;
	editData: any;
	id: number;
	customertypes: any[];
	disableSaveCustomerName: boolean;
	

	
	currentNTAETab: string = 'Activities';
	activeNTAEMenuItem: number = 1;
	isNTAEDisabledSteps = true;
	
	sourceItemMaster: any;
	isSpinnerVisible: boolean = true;
	CustomerType: any;
	ItemMasterId: any;

	constructor(private route: Router,

		private crmService: CrmService,
		public priority: PriorityService,
		private alertService: AlertService,
		public glAccountService: GlAccountService,
		private authService: AuthService,
		private customerService: CustomerService,
		private commonService: CommonService,
		private _actRoute: ActivatedRoute,
	
		private datePipe: DatePipe) {
	}

	dealInfo = {
        crmDealId: null,
        customerId: null,
        masterCompanyId: null,
        isActive: false,
        isDeleted: false,
        createdBy: "",
        updatedBy: "",
		createdDate: "",
		updatedDate:null,
		primarySalesPersonId:null,
		dealNumber:'',
		dealName:"",
		dealOwnerId:"",
	
		dealSource:null,
		closingDate:true,
		openDate:"",
		expectedRevenue:null,
		competitors:null,
		probability:null,
		dealStageId:null,
		dealLossReasonId:"",
		isDealOutComeWon:"",
		name:"",
	
		outCome:"",
		memo:null,	
		dealLossReasonIds:[],
		dealInfo: null
    }


	ngOnInit() {
		
		this.loadcustomerData();
		this.getSalesPersonList();
		this.getAllCustomers();

		
	}


	changeOfNTAETab(value) {
        if (value === 'Activities') {
            this.currentNTAETab = 'Activities';
            this.activeNTAEMenuItem = 1;
        } else if (value === 'Notes') {
            this.currentNTAETab = 'Notes';
            this.activeNTAEMenuItem = 2;
        } else if (value === 'Follow Ups') {
            this.currentNTAETab = 'Follow Ups';
            this.activeNTAEMenuItem = 3;
        } 

    }
	
	getAllCustomerTypes() {
        this.customerService.getCustomerTypes().subscribe(res => {
            const responseData = res[0];
            this.customertypes = responseData;
        })
	}



	saveDeal(){
		
	
		if (!this.isEdit) {

            this.crmService.newDeal({
                ...this.dealInfo,
			
                createdBy: this.userName, updatedBy: this.userName, masterCompanyId: 1
            }).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Customer General Information Sucessfully `,
                    MessageSeverity.success
                );
                this.saveDealData.emit(res);
                this.editData = res;
                this.isEdit = true;
            })

        } else {
            this.crmService.updateDeal({
                ...this.dealInfo,
                dealName: editValueAssignByCondition('name', this.dealInfo.dealName),
				
			     createdBy: this.userName, updatedBy: this.userName, masterCompanyId: 1
            }).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Upated  Customer General Information Sucessfully `,
                    MessageSeverity.success
                );
                this.editDeal.emit(res);
                this.id = res.customerId;
                this.editData = res;

                this.isEdit = true;
            })
        }

	}


	checkDealNameExist(value) {
        this.changeName = true;
        this.isDealNameAlreadyExists = false;
        this.disableSaveCustomerName = false;
        if (value != this.dealInfo.dealName) {
            for (let i = 0; i < this.dealNamesList.length; i++) {
                if (this.dealInfo.dealName == this.dealNamesList[i].dealName || value == this.dealNamesList[i].dealName) {
                    this.isDealNameAlreadyExists = true;
                   
                    this.disableSaveCustomerName = true;
                    this.selectedActionName = event;
                    return;
                }
            }
        }
    }

	selectedDealName() {
        this.isDealNameAlreadyExists = true;
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

                this.dealList = res;
            })
        }
    }
	filterDealNames(event) {
        this.dealNames = this.dealNamesList;
        this.dealNames = [...this.dealNamesList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
	}

	
	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	getAllDealNames() {
        this.crmService.getDealNames().subscribe(res => {
            const responseData = res[0];
            this.dealNamesList = responseData;
        })
	}
	loadcustomerData() {
		this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name',this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.allCustomers = response;
		});
	}
	selectedCustomerName() {
        this.isCustomerNameAlreadyExists = true;
    }

	filterCustomerNames(event) {
        this.customerNames = this.dealList;
        this.customerNames = [...this.dealList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
	}

	checkCustomerNameExist(value) {
        this.changeName = true;
        this.isCustomerNameAlreadyExists = false;
        this.disableSaveCustomerName = false;
        if (value != this.dealInfo.name) {
            for (let i = 0; i < this.dealList.length; i++) {
                if (this.dealInfo.name == this.dealList[i].name || value == this.dealList[i].name) {
                    this.isCustomerNameAlreadyExists = true;
                   
                    this.disableSaveCustomerName = true;
                    this.selectedActionName = event;
                    return;
                }
            }
        }
    }
	
	filterNames(event) {
		this.customerNames = this.allCustomers;

		if (event.query !== undefined && event.query !== null) {
			const customers = [...this.allCustomers.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.customerNames = customers;
		}
	}

	
	private onDataLoadFailed(error: any) { }

	
}



