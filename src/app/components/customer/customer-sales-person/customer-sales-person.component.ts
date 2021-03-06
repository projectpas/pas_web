﻿import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { EmployeeService } from '../../../services/employee.service';
import { VendorService } from '../../../services/vendor.service';
import {  getObjectById, editValueAssignByCondition, getValueByFieldFromArrayofObject } from '../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { DBkeys } from '../../../services/db-Keys';
import { CommonService } from '../../../services/common.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { any } from 'underscore';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-customer-sales-person',
    templateUrl: './customer-sales-person.component.html',
    styleUrls: ['./customer-sales-person.component.scss'],
    animations: [fadeInOut]
})
/** anys component*/
export class CustomerSalesPersonComponent implements OnInit {
    @Input() savedGeneralInformationData;
    @Input() editGeneralInformationData;
    @Input() editMode;
    //@Input() employeeListOriginal: any = [];
    @Input() expertiseTitles;
    @Input() selectedCustomerTab: string = '';
    @Output() tab = new EventEmitter();
    isSpinnerVisible: Boolean = false;
    employeeList: any[];
    employeeTypeList: any[];
    employeeListOriginal: any[];
    id: number;
    customerSalesId: number;
    customerName: any;
    customerCode: any;
    numberValidate = "^\d+$";
    globalSettings: any = {};
    global_lang: any;
    csrOriginalList: any;
    csrList: any;
    agentsOriginalList: any;
    agentList: any[];
    salesPersonOriginalList: any;
    primarySPList: any[] = [];
    secondarySPList: any[] = [];
    secondarySPListFilterData: any[];
    primarySPListFilterData: any[];
    nextOrPreviousTab: string;
    isAgentSameAsPSalesPeson: Boolean = false;
    disableSave: boolean = true;
    isFirstSave: boolean = true;
    arayExpTitleIds:any[] = [];
    editGeneralInformationDataOriginal: any;
    savedGeneralInformationDataOriginal: any;
    modal: NgbModalRef;
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    @ViewChild("salesPersonForm",{static:false}) formdata;
    stopmulticlicks: boolean;
    salesInfo = {
        primarySalesPersonId: undefined,
        secondarySalesPersonId: undefined,
        primarySalesPersonName: "",
        secondarySalesPersonName: "",
        csrId: "",
        saId: undefined,
        annualRevenuePotential: "",
        annualQuota: "",
    }
    PSPinfo = [];
    SSPinfo = [];
    CSRinfo = [];
    Agentinfo = [];
    constructor(public vendorservice: VendorService, public customerService: CustomerService, 
        public employeeService: EmployeeService,
        private commonService: CommonService,
        private authService: AuthService,
        private alertService: AlertService,
        private localStorage: LocalStoreManager,
        private modalService: NgbModal,
        private router: ActivatedRoute
    ) {
        this.id = this.router.snapshot.params['id'];
    }

    ngOnInit() {
        if (this.editMode) {
            this.editGeneralInformationDataOriginal = this.editGeneralInformationData;
            this.customerCode = this.editGeneralInformationData.customerCode;
            this.customerName = this.editGeneralInformationData.name;

        } else {
            this.savedGeneralInformationDataOriginal = this.savedGeneralInformationData;
            //this.id = this.savedGeneralInformationData.customerId;
            this.customerCode = this.savedGeneralInformationData.customerCode;
            this.customerName = this.savedGeneralInformationData.name;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
          if (property == 'selectedCustomerTab') {
            if (changes[property].currentValue != {} && changes[property].currentValue == 'Sales') {
                this.getExpertiseTypes();
                this.getGlobalSettings();                

                if (this.editMode) {
                    this.disableSave = true;
                    this.id = this.editGeneralInformationData.customerId
                    this.salesInfo = {
                        ...this.editGeneralInformationData,
                        customerSalesId : this.editGeneralInformationData.customerSalesId,
                    };

                    const salesPrimaryPerson = {
                        employeeId: this.salesInfo.primarySalesPersonId,
                        name: this.salesInfo.primarySalesPersonName
                    }
                    
                    this.salesInfo.primarySalesPersonId = salesPrimaryPerson;
                    const salesSecondaryPerson  = {
                        employeeId: this.salesInfo.secondarySalesPersonId,
                        name: this.salesInfo.secondarySalesPersonName
                    }
                    this.salesInfo.secondarySalesPersonId = salesSecondaryPerson;
        
                    this.customerCode = this.editGeneralInformationDataOriginal.customerCode;
                    this.customerName = this.editGeneralInformationDataOriginal.name;
        
                } else {
                    this.id = this.savedGeneralInformationData.customerId;
                    this.customerCode = this.savedGeneralInformationDataOriginal.customerCode;
                    this.customerName = this.savedGeneralInformationDataOriginal.name;
                }                
            }
          }
        }
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    getSalesInfoByCustomerId(id) {		
        if(id > 0)
        {
            this.isSpinnerVisible = true;
            this.customerService.getSalesInfo(id).subscribe(res => {
                if(res)
                {
                    this.isFirstSave = false;
                    this.editGeneralInformationData = res;
                
                    this.id = this.editGeneralInformationData.customerId
                    this.customerSalesId = this.editGeneralInformationData.customerSalesId;

                    this.salesInfo = {
                        ...this.editGeneralInformationData,
                        csrId: getObjectById('employeeId', this.editGeneralInformationData.csrId, this.csrOriginalList),
                        saId: getObjectById('employeeId', this.editGeneralInformationData.saId, this.agentsOriginalList),
                        csrName: this.editGeneralInformationData.csrName,
                        agentName: this.editGeneralInformationData.agentName,
                        customerSalesId : this.editGeneralInformationData.customerSalesId,
                    };
                    const salesPrimaryPerson = {
                        employeeId: this.salesInfo.primarySalesPersonId,
                        name: this.salesInfo.primarySalesPersonName
                    }
                    this.salesInfo.primarySalesPersonId = salesPrimaryPerson;
    
                    const salesSecondaryPerson  = {
                        employeeId: this.salesInfo.secondarySalesPersonId,
                        name: this.salesInfo.secondarySalesPersonName
                    }
                    this.salesInfo.secondarySalesPersonId = salesSecondaryPerson;
                }
                this.isSpinnerVisible = false;
            },error => {this.isSpinnerVisible = false;});
        }
	}

    getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    checkSameAsSalesPerson(value,content)
    {  
        if(this.salesInfo.saId.employeeId > 0)
        {
            if(this.salesInfo.primarySalesPersonId.employeeId != undefined && value != undefined)
            {           
                const primarySalesPersonId =  this.salesInfo.primarySalesPersonId.employeeId;
                const agentId =  value.employeeId;
                if (value.employeeId == this.salesInfo.primarySalesPersonId.employeeId)
                    this.isAgentSameAsPSalesPeson = true;
                else
                    this.isAgentSameAsPSalesPeson = false;
            }
            if(this.salesInfo.primarySalesPersonId.employeeId || this.salesInfo.secondarySalesPersonId.employeeId){
                if(this.salesInfo.primarySalesPersonId.employeeId > 0 || this.salesInfo.secondarySalesPersonId.employeeId > 0){
                    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });												                   
                }
            }
        }     
    }

    
    
    filterPrimary(event) {
        let data;
        if (!this.editMode) {
            if (this.salesInfo.secondarySalesPersonId !== undefined && this.salesInfo.secondarySalesPersonId !== '' && this.salesInfo.secondarySalesPersonId !== null) {
                data = this.primarySPListFilterData;
            } else {
                data = this.salesPersonOriginalList;
            }
        } 
        else {
            if (this.salesInfo.secondarySalesPersonId !== undefined) {
                data = [...this.salesPersonOriginalList.filter(x => {
                    if (this.salesInfo.secondarySalesPersonId.employeeId !== x.employeeId) {
                        return x;
                    }
                })]
            } else {
                data = this.salesPersonOriginalList;
            }
        } 
        this.PSPinfo = [{employeeId: 0, employeeExpertiseId: 0, employeeCode: "", name: "-- Select --"}]
       //this.primarySPList = data;
        // const primarySPData = [...data.filter(x => {
        //     return x.name.toLowerCase().includes(event.query.toLowerCase())
        // })]
        //this.primarySPList = primarySPData;
        this.primarySPList = [...this.PSPinfo, ...data.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })];
    }

   

    filterSecondary(event) {
        let data;
        if (!this.editMode) {
            if (this.salesInfo.primarySalesPersonId !== undefined && this.salesInfo.primarySalesPersonId !== '' && this.salesInfo.primarySalesPersonId !== null) {
                data = this.secondarySPListFilterData;
            } else {
                data = this.salesPersonOriginalList;
            }
        } else {
            if (this.salesInfo.primarySalesPersonId !== undefined) {
                data = [...this.salesPersonOriginalList.filter(x => {
                    if (this.salesInfo.primarySalesPersonId.employeeId !== x.employeeId) {
                        return x;
                    }
                })]
            } else {
                data = this.salesPersonOriginalList;
            }
        }       
        this.SSPinfo = [{employeeId: 0, employeeExpertiseId: 0, employeeCode: "", name: "-- Select --"}]
        // this.secondarySPList = data;
        // const secondarySPData = [...data.filter(x => {
        //     return x.name.toLowerCase().includes(event.query.toLowerCase())
        // })]
        // this.secondarySPList = secondarySPData;
        this.secondarySPList = [...this.SSPinfo, ...data.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })];
    }

    
    filterCSR(event) {
        this.csrList = this.csrOriginalList;
        this.CSRinfo = [{employeeId: 0, employeeExpertiseId: 0, employeeCode: "", name: "-- Select --"}]

        // const CSRData = [...this.csrOriginalList.filter(x => {
        //     return x.name.toLowerCase().includes(event.query.toLowerCase())
        // })]       
        //this.csrList = CSRData;
        this.csrList =[...this.CSRinfo, ...this.csrOriginalList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })];
    }
    
    filterAgents(event) {
        this.agentList = this.agentsOriginalList;
        this.Agentinfo = [{employeeId: 0, employeeExpertiseId: 0, employeeCode: "", name: "-- Select --"}]

        // const agentData = [...this.agentsOriginalList.filter(x => {
        //     return x.name.toLowerCase().includes(event.query.toLowerCase())
        // })]
        // this.agentList = agentData;
        this.agentList =[...this.Agentinfo, ...this.agentsOriginalList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })];        
    }

    selectedSalesPerson(object, type) {
        if (type === 'PrimarySalesPerson') {
            this.secondarySPListFilterData = [...this.salesPersonOriginalList.filter(x => {
                if (object.employeeId !== x.employeeId) {
                    return x;
                }
            })]

        } else if (type === 'SecondarySalesPerson') {
            this.primarySPListFilterData = [...this.salesPersonOriginalList.filter(x => {
                if (object.employeeId !== x.employeeId) {
                    return x;
                }
            })]
        }
    }

    saveSalesInformation() {
        this.isSpinnerVisible = true;
        if(!this.salesInfo.primarySalesPersonId.employeeId){
            this.alertService.showMessage(
                'Alert',
                `Please Select Primary Sales Person`,
                MessageSeverity.error
            );
            this.isSpinnerVisible = false;
            return;            
        }       
        this.customerService.updatesalesinfo({
            ...this.salesInfo,
            customerSalesId: this.customerSalesId == undefined ? 0 : this.customerSalesId,
            CustomerId: this.id,            
            primarySalesPersonId: editValueAssignByCondition('employeeId', this.salesInfo.primarySalesPersonId),
            secondarySalesPersonId: editValueAssignByCondition('employeeId', this.salesInfo.secondarySalesPersonId),
            csrId: editValueAssignByCondition('employeeId', this.salesInfo.csrId),
            saId: editValueAssignByCondition('employeeId', this.salesInfo.saId),
            annualQuota: this.salesInfo.annualQuota == '' || this.salesInfo.annualQuota == undefined ? 0 : this.salesInfo.annualQuota,
            annualRevenuePotential : this.salesInfo.annualRevenuePotential == '' || this.salesInfo.annualRevenuePotential == undefined ? 0 : this.salesInfo.annualRevenuePotential,
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: this.currentUserMasterCompanyId,
        }, this.id).subscribe(            
            res => 
            {
                this.isSpinnerVisible = false;
                if(res.statusCode == 500) {
                    //this.saveFailedHelper(res.message)
                    this.isSpinnerVisible = false;
                }
                else{
                    this.customerSalesId = res.customerSalesId;                    
                    this.alertService.showMessage(
                        'Success',
                        `${this.isFirstSave ? 'Saved' : 'Updated'} Customer Sales Infromation Successfully `,
                        MessageSeverity.success
                    );
                }
                this.isFirstSave = false;
                this.disableSave = true;
                //this.formdata.reset();
            }
        ),error => {this.isSpinnerVisible = false;}}
        
    formatannualRevenuePotential(val) {
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.salesInfo.annualRevenuePotential = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.salesInfo.annualRevenuePotential;
        }

    }

    formatannualQuota(val) {
        if (val) {

            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.salesInfo.annualQuota = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return this.salesInfo.annualQuota;
        }
    }
    
    backClick() {
        this.tab.emit('Shipping');
    }

    nextClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        //if (this.formdata.form.dirty) {
        if(!this.disableSave == true) {
            let content = this.tabRedirectConfirmationModal;
            this.modal = this.modalService.open(content, { size: 'sm' });
        }
        else {
            this.formdata.reset();
            this.stopmulticlicks = true;
            if (this.nextOrPreviousTab == 'Next') {
              this.tab.emit('Warnings');
            }
            if (this.nextOrPreviousTab == 'Previous') {
              this.tab.emit('Shipping');
            }
            setTimeout(() => {
                this.stopmulticlicks = false;
            }, 500)
        }
    }

    redirectToTab(){
        if(!this.disableSave)
        {
        this.saveSalesInformation();
        }    
        this.dismissModel();
        this.formdata.reset();
        if(this.nextOrPreviousTab == "Next"){
            this.tab.emit('Warnings');
        }
        if(this.nextOrPreviousTab == "Previous"){
            this.tab.emit('Shipping');
        }
    }

    dismissModel() {
        this.modal.close();
        this.formdata.reset();
        if(this.nextOrPreviousTab == "Next"){
            this.tab.emit('Warnings');
        }
        if(this.nextOrPreviousTab == "Previous"){
            this.tab.emit('Shipping');
        }
    }

    saveAgentSalesInformation(){
        if(!this.disableSave){
            this.modal.close();
            this.saveSalesInformation();            
        } 
    }

    dismissAgentModel(){
        this.modal.close();
        this.salesInfo.saId = undefined;
    }

    private saveFailedHelper(error: any) {
            this.isSpinnerVisible = false;
            this.alertService.stopLoadingMessage();
            this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
            this.alertService.showStickyMessage(error, null, MessageSeverity.error);
            setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }
    getExpertiseTypes() {
        this.isSpinnerVisible = true;
	    this.commonService.getSalesExpertise(this.currentUserMasterCompanyId).subscribe(res => {
            if(res)
            {
                this.expertiseTitles = res;
                this.getAllSalesEmployeeListByExpertiseTitle(this.expertiseTitles)
            }
			this.isSpinnerVisible = false;
		},error => {this.isSpinnerVisible = false;});
    }

    enableSave() {
		this.disableSave = false;
	}
    
    getAllSalesEmployeeListByExpertiseTitle(jobTitles) {  
             

        this.isSpinnerVisible = true;
        const CSRid = getValueByFieldFromArrayofObject('empExpCode', 'CSR', this.expertiseTitles);
        const Salesid = getValueByFieldFromArrayofObject('empExpCode', 'SALES', this.expertiseTitles);
       const Agentsid = getValueByFieldFromArrayofObject('empExpCode', 'AGENT', this.expertiseTitles);
        
        if(CSRid[0] && CSRid[0].employeeExpertiseId && CSRid[0].employeeExpertiseId > 0)
            this.arayExpTitleIds.push(CSRid[0].employeeExpertiseId);
        
        if(Salesid[0] && Salesid[0].employeeExpertiseId && Salesid[0].employeeExpertiseId > 0)
            this.arayExpTitleIds.push(Salesid[0].employeeExpertiseId);

        if(Agentsid[0] && Salesid[0].employeeExpertiseId && Salesid[0].employeeExpertiseId > 0)
            this.arayExpTitleIds.push(Agentsid[0].employeeExpertiseId);

        this.commonService.getAllSalesEmployeeListByExpertiseIds(this.arayExpTitleIds).subscribe(res => {
            if(res)
            {
                if( CSRid[0] && CSRid[0].employeeExpertiseId && CSRid[0].employeeExpertiseId > 0)
                {
                this.csrOriginalList = res.filter(x => {
                    if (CSRid[0].employeeExpertiseId == x.EmployeeExpertiseId) {
                        return x;
                    } 
                })}
                
                if( Agentsid[0] && Agentsid[0].employeeExpertiseId && Agentsid[0].employeeExpertiseId > 0)
                {
                this.agentsOriginalList = res.filter(x => {
                    if (Agentsid[0].employeeExpertiseId == x.EmployeeExpertiseId) {
                        return x;
                    }
                })
                }

                if( Salesid[0] && Salesid[0].employeeExpertiseId && Salesid[0].employeeExpertiseId > 0)
                {
                this.salesPersonOriginalList = res.filter(x => {
                    if (Salesid[0].employeeExpertiseId == x.EmployeeExpertiseId) {
                        return x;
                    }
                })
                }

                if (this.id) {
                    this.getSalesInfoByCustomerId(this.id)
                }

                this.arayExpTitleIds = [];
            }
            this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible = false})
    }
}

