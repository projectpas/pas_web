import { Component } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { PageHeaderComponent } from '../../../../shared/page-header.component';
import * as $ from 'jquery';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { ReceivingCustomerWorkService } from '../../../../services/receivingcustomerwork.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { CustomerService } from '../../../../services/customer.service';
import { Condition } from '../../../../models/condition.model';
import { ConditionService } from '../../../../services/condition.service';
import { VendorService } from '../../../../services/vendor.service';
import { BinService } from '../../../../services/bin.service';
import { SiteService } from '../../../../services/site.service';
import { Site } from '../../../../models/site.model';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { EmployeeService } from '../../../../services/employee.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { NgbActiveModal, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { getObjectById } from '../../../../generic/autocomplete';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
@Component({
    selector: 'app-customer-work-edit',
    templateUrl: './customer-work-edit.component.html',
    styleUrls: ['./customer-work-edit.component.scss'],
    animations: [fadeInOut]
})

export class CustomerWorkEditComponent {
    firstCollection: any[];
    allEmployeeinfo: any[] = [];
    loadingIndicator: boolean;
    dataSource: any;
    disableSavepartNumber: boolean;
    selectedActionName: any;
    itemclaColl: any[] = [];
    allPartnumbersInfo: any[] = [];
    partCollection: any[];
    isSaving: boolean;
    isDeleteMode: boolean;
    isEditMode: boolean = false;
    modal: any;
    Active: string;
    allComapnies: MasterCompany[];
    auditHisory: any[];
    allRecevinginfo: any[] = [];
    allActions: any[] = [];
    customerId: any;
    customerNames: any[];
    customerReferenceNames: any[];
    customerNamecoll: any;
    selectedColumns: any;
    cols: any;
    disableSavepartDescription: boolean;
    descriptionbyPart: any[] = [];
    allConditionInfo: Condition[];
    allCustomer: any[];
    allVendorList: any[];
    chargeName: any;
    allEmpActions: any[] = [];
    sourceAction: any;
    showRestrictQuantity: boolean;
    showFreeQuantity: boolean;
    showNormalQuantity: boolean;
    allWareHouses: any[];
    customerContactList: any[];
    allLocations: any[];
    allShelfs: any[];
    allBins: any[];
    allSites: Site[];
    allManagemtninfo: any[] = [];
    maincompanylist: any[] = [];
    disableSaveCusCode: boolean;
    CustomerInfoByName: any[] = [];
    disableSaveCusName: boolean;
    showLable: boolean;
    sourcereceivingEdit: any = {};
    sourceTimeLife: any = {};
    collectionofstockLineTimeLife: any;
    value: number;
    collectionofstockLine: any;

    parentManagementInfo: any[] = [];
    childManagementInfo: any[] = [];
    bulist: any[] = [];
    divisionlist: any[] = [];
    departmentList: any[] = [];
    partListData: any[] = [];
    custcodes: { customerId: any; name: any; }[];
    localCollection: any;
    employeeName: any;

    constructor(private router: Router, private conditionService: ConditionService, public workFlowtService1: LegalEntityService, private siteService: SiteService, private binService: BinService, private vendorservice: VendorService, public employeeService: EmployeeService, private alertService: AlertService, public itemser: ItemMasterService, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, public receivingCustomerWorkService: ReceivingCustomerWorkService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private customerservices: CustomerService, private workOrderService: WorkOrderService) {
        this.dataSource = new MatTableDataSource();

        if (this.receivingCustomerWorkService.listCollection && this.receivingCustomerWorkService.isEditMode == true) {

            this.showLable = true;
            this.sourcereceving = this.receivingCustomerWorkService.listCollection;
            this.sourcereceving.serialNumber = this.receivingCustomerWorkService.listCollection.serialNumber;
            this.sourcereceving.name = this.receivingCustomerWorkService.listCollection.customer.name;
            if (this.sourcereceving.serialNumber) {
                this.sourcereceving.isSerialized = true;
            }

            if (this.sourcereceving.serialNumber == null) {
                this.sourcereceving.isSerialized = false;
            }
            if (this.sourcereceving.siteId) {
                this.binService.getWareHouseDate(this.sourcereceving.siteId).subscribe( //calling and Subscribing for WareHouse Data
                    results => this.onDataLoadWareHouse(results), //sending WareHouse
                    error => this.onDataLoadFailed(error)
                );
            }
            if (this.sourcereceving.warehouseId) {
                this.binService.getLocationDate(this.sourcereceving.warehouseId).subscribe( //calling and Subscribing for Location Data
                    results => this.onDataLoadLocation(results), //sending Location
                    error => this.onDataLoadFailed(error)
                );
            }
            if (this.sourcereceving.locationId) {
                this.binService.getShelfDate(this.sourcereceving.locationId).subscribe( //calling and Subscribing for Location Data
                    results => this.onDataLoadShelf(results), //sending Location
                    error => this.onDataLoadFailed(error)
                );
            }

            if (this.sourcereceving.shelfId) {
                this.binService.getBinDataById(this.sourcereceving.shelfId).subscribe(
                    results => this.onDataLoadBin(results), //sending Location
                    error => this.onDataLoadFailed(error));
            }

            if (this.sourcereceving.timeLifeDate) {
                this.sourcereceving.timeLifeDate = new Date(this.sourcereceving.timeLifeDate);
            }
            else {
                this.sourcereceving.timeLifeDate = new Date();
            }

            if (this.sourcereceving.manufacturingDate) {
                this.sourcereceving.manufacturingDate = new Date(this.sourcereceving.manufacturingDate);
            }
            else {
                this.sourcereceving.manufacturingDate = new Date();
            }
            if (this.sourcereceving.tagDate) {
                this.sourcereceving.tagDate = new Date(this.sourcereceving.tagDate);
            }
            else {
                this.sourcereceving.tagDate = new Date();
            }

            if (this.sourcereceving.expirationDate) {
                this.sourcereceving.expirationDate = new Date(this.sourcereceving.expirationDate);
            }
            else {
                this.sourcereceving.expirationDate = new Date();
            }
        }
    }
    ngOnInit(): void {
        this.sourcereceving.isCustomerStock = true;
         this.employeedata();
        this.loadData();
        this.ptnumberlistdata();
        this.Receveingcustomerlist();
        this.loadDataForCondition();
        this.customerList();
        this.loadItemmasterData();
        this.vendorList();
        this.loadSiteData();
        this.loadManagementdata();
        this.loadManagementdataForTree();
        if (!this.sourcereceving.receivingCustomerWorkId) {
            this.sourcereceving.receivingCustomerNumber = 'Creating';
            this.sourcereceving.expirationDate = new Date();
            this.sourcereceving.tagDate = new Date();
            this.sourcereceving.manufacturingDate = new Date();
            this.sourcereceving.timeLifeDate = new Date();

        }
        else {
            this.sourcereceivingEdit.receivingCustomerWorkId = this.sourcereceving.receivingCustomerWorkId;
        }

    }

    sourcereceving: any = {};
    sourcerecevingForWorkOrder: any = {};
    ngAfterViewInit() {

    }
    public allWorkFlows: any[] = [];


    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.employeeService.getEmployeeList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onDataLoadSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allEmpActions = allWorkFlows;
    }
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {

       
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

        this.auditHisory = auditHistory;


        this.modal = this.modalService.open(content, { size: 'lg' });

        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;

    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }
    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourcereceving = rowData;
            this.sourcereceving.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourcereceving.isActive == false;
            this.receivingCustomerWorkService.updateReason(this.sourcereceving).subscribe(
                response => this.saveCompleted(this.sourcereceving),
                error => this.saveFailedHelper(error));
            alert(e);
        }
        else {
            this.sourcereceving = rowData;
            this.sourcereceving.updatedBy = this.userName;
            this.Active = "Active";
            this.sourcereceving.isActive == true;
            this.receivingCustomerWorkService.updateReason(this.sourcereceving).subscribe(
                response => this.saveCompleted(this.sourcereceving),
                error => this.saveFailedHelper(error));
            alert(e);
        }

    }

    open(content) {

        this.isEditMode = false;
        this.isDeleteMode = false;

        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourcereceving.isActive = true;
        this.chargeName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }


    openDelete(content, row) {

        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourcereceving = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openEdit(content, row) {
        
        this.isEditMode = true;
       
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourcereceving = row; if (this.sourcereceving.timeLifeDate) {
            this.sourcereceving.timeLifeDate = new Date(this.sourcereceving.timeLifeDate);
        }
        else {
            this.sourcereceving.timeLifeDate = new Date();
        }

        if (this.sourcereceving.manufacturingDate) {
            this.sourcereceving.manufacturingDate = new Date(this.sourcereceving.manufacturingDate);
        }
        else {
            this.sourcereceving.manufacturingDate = new Date();
        }
        if (this.sourcereceving.tagDate) {
            this.sourcereceving.tagDate = new Date(this.sourcereceving.tagDate);
        }
        else {
            this.sourcereceving.tagDate = new Date();
        }

        if (this.sourcereceving.expirationDate) {
            this.sourcereceving.expirationDate = new Date(this.sourcereceving.expirationDate);
        }
        else {
            this.sourcereceving.expirationDate = new Date();
        }
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    filterCodes(event) {
        this.custcodes = this.allCustomer;
        this.custcodes = [...this.allCustomer.filter(x => {
            return x.customerCode.toLowerCase().includes(event.query.toLowerCase())
        })]

    }
    editItemAndCloseModel(content) {
        this.isSaving = true;
       
        if (!this.sourcereceving.receivingCustomerWorkId) {
          
            this.sourcereceving.createdBy = this.userName;
            this.sourcereceving.updatedBy = this.userName;
            this.sourceTimeLife.createdBy = this.userName;
            this.sourceTimeLife.updatedBy = this.userName;
            this.sourcereceving.masterCompanyId = 1;
            this.sourcereceving.isActive = true;

            this.sourcerecevingForWorkOrder = this.sourcereceving;
            console.log(this.sourcereceving);
            if ((this.sourceTimeLife != null) || (this.sourceTimeLife != "null")) {
                if (this.sourceTimeLife.timeLife) {
                    this.receivingCustomerWorkService.newStockLineTimeLife(this.sourceTimeLife).subscribe(data => {
                        this.collectionofstockLineTimeLife = data;
                        this.sourcereceving.timeLifeCyclesId = data.timeLifeCyclesId;
                        this.value = 1;
                        if (this.sourcereceving.isSerialized == null || this.sourcereceving.isSerialized == false) {
                            this.sourcereceving.serialNumber = '';
                            this.sourcereceving.certifiedBy = '';
                            this.sourcereceving.tagDate = '';
                            this.sourcereceving.tagType = '';
                            this.sourcereceving.partCertificationNumber = '';
                        }
                        switch (this.sourcereceving.traceableToType) {
                            case '1':
                                this.sourcereceving.traceableTo = this.sourcereceving.traceableToCustomerId;
                                break;
                            case '2':
                                this.sourcereceving.traceableTo = this.sourcereceving.traceableToOther;
                                break;
                            case '3':
                                this.sourcereceving.traceableTo = this.sourcereceving.traceableToVendorId;
                                break;
                            case '4':
                                this.sourcereceving.traceableTo = this.sourcereceving.traceableToCompanyId;
                                break;
                        }
                        switch (this.sourcereceving.obtainFromType) {
                            case '1':
                                this.sourcereceving.obtainFrom = this.sourcereceving.obtainFromCustomerId;
                                break;
                            case '2':
                                this.sourcereceving.obtainFrom = this.sourcereceving.obtainFromOther;
                                break;
                            case '3':
                                this.sourcereceving.obtainFrom = this.sourcereceving.obtainFromVendorId;
                                break;
                            case '4':
                                this.sourcereceving.obtainFrom = this.sourcereceving.obtainFromCompanyId;
                                break;
                        }
                        console.log(this.sourcereceving);
                        this.receivingCustomerWorkService.newReason(this.sourcereceving).subscribe(
                            role => this.saveSuccessHelper(role,content),
                            error => this.saveFailedHelper(error));
                        this.sourcereceving = {};
                       // this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');

                    }

                    )
                }
                else {
                    this.receivingCustomerWorkService.newReason(this.sourcereceving).subscribe(
                        role => this.saveSuccessHelper(role,content),
                        error => this.saveFailedHelper(error));
                    this.sourcereceving = {};
                   // this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');

                }
            }
        }

        else {

            this.sourcereceving.updatedBy = this.userName;
            this.sourcereceving.createdBy = this.userName;
            this.sourcereceving.masterCompanyId = 1;
            this.receivingCustomerWorkService.updateReason(this.sourcereceving).subscribe(
                response => this.saveCompleted(this.sourcereceving),
                error => this.saveFailedHelper(error));
            if (this.sourcereceving.timeLifeCyclesId) {
                console.log("Update Timelife");
                this.receivingCustomerWorkService.updateStockLineTimelife(this.sourceTimeLife).subscribe(data => {
                    this.collectionofstockLine = data;
                    this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');

                    
                })

            }
            else {
             

                this.receivingCustomerWorkService.newStockLineTimeLife(this.sourceTimeLife).subscribe(data => {
                    this.collectionofstockLine = data;

                    this.value = 1;
                    this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');

                  
                })
            }
            this.sourcereceving = {};
             }
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourcereceving.updatedBy = this.userName;
        this.receivingCustomerWorkService.deleteReason(this.sourcereceving.receivingCustomerWorkId, this.userName).subscribe(

            response => this.saveCompleted(this.sourceAction),
            error => this.saveFailedHelper(error));
        this.modal.close();
    }
    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }

        this.loadData();
    }

    private saveSuccessHelper(role?: true,content?:any) {
        this.isSaving = false;

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })


        //this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');
        //this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

       // this.loadData();

    }
    CreateWorkOrderModel() {
       // this.workOrderService. = this.sourcerecevingForWorkOrder.partNumber; //Storing Row Data  and saving Data in Service that will used in StockLine Setup
        this.modal.close();
        this.router.navigateByUrl('/workordersmodule/workorderspages/app-work-order-add');

    }
    GotoList() {
        this.modal.close();
        this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');
        this.loadData();
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.router.navigateByUrl('receivingmodule/receivingpages/app-customer-works-list');
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    private Receveingcustomerlist() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.receivingCustomerWorkService.getReceiveCustomerList().subscribe(
            results => this.onDataLoadrecevingSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }

    private onDataLoadrecevingSuccessful(getEmployeeCerficationList: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getEmployeeCerficationList;
        this.allRecevinginfo = getEmployeeCerficationList;
    }

    private employeedata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.employeeService.getEmployeeList().subscribe(
            results => this.onempDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );



        this.selectedColumns = this.cols;

    }

    private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = getEmployeeCerficationList;
        this.allEmployeeinfo = getEmployeeCerficationList;
    }

    filterfirstName(event) {

        this.firstCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let firstName = this.allEmployeeinfo[i].firstName;
            if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.firstCollection.push(firstName);
            }
        }
    }
    private onptnmbersSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allPartnumbersInfo = allWorkFlows;
    }


    private ptnumberlistdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemser.getPrtnumberslistList().subscribe(
            results => this.onptnmbersSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    filterNames(event) {

        this.customerNames = [];
        if (this.allCustomer) {
            if (this.allCustomer.length > 0) {
                for (let i = 0; i < this.allCustomer.length; i++) {
                    let name = this.allCustomer[i].name;
                    if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                        this.customerNames.push(name);
                    }
                }
            }
        }
    }
    filterReferenceNames(event) {

        this.customerReferenceNames = [];
        if (this.allCustomer) {
            if (this.allCustomer.length > 0) {
                for (let i = 0; i < this.allCustomer.length; i++) {
                    let name = this.allCustomer[i].name;
                    if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                        this.customerReferenceNames.push(name);
                    }
                }
            }
        }
    }

    filterpartItems(event) {

        this.partCollection = [];
        this.itemclaColl = [];
        if (this.allPartnumbersInfo) {
            if (this.allPartnumbersInfo.length > 0) {

                for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                    let partName = this.allPartnumbersInfo[i].partNumber;
                    if (partName) {
                        if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.itemclaColl.push([{
                                "partId": this.allPartnumbersInfo[i].itemMasterId,
                                "partName": partName
                            }]),

                                this.partCollection.push(partName);
                        }
                    }
                }
            }
        }
    }
    private onitemmasterSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.allActions = allWorkFlows;
    }
    private loadItemmasterData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemser.getItemMasterList().subscribe(
            results => this.onitemmasterSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    partnmId(event) {
        //
        if (this.itemclaColl) {
            //for (let i = 0; i < this.itemclaColl.length; i++) {
            //	if (event == this.itemclaColl[i][0].partName) {
            //		this.sourcereceving.partId = this.itemclaColl[i][0].partId;
            //		this.selectedActionName = event;
            //	}
            //}
            this.itemser.getDescriptionbypart(event).subscribe(
                results => this.onpartnumberloadsuccessfull(results[0]),
                error => this.onDataLoadFailed(error)
            );
        }
    }
    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }

    }
    customerNameId(event) {
       
        if (this.allCustomer) {
            for (let i = 0; i < this.allCustomer.length; i++) {
                if (event == this.allCustomer[i].name) {
                    this.sourcereceving.customerId = this.allCustomer[i].customerId;

                    //this.sourcereceving.customerCode = this.allCustomer[i].customerCode;
                    this.sourcereceving.customerCode = getObjectById('customerId', this.allCustomer[i].customerId, this.allCustomer);
                   console.log(this.sourcereceving.customerCode)
                    this.selectedActionName = event;
                    this.getAllCustomerContact(this.allCustomer[i].customerId);
                }
            }
            this.customerservices.getDescriptionbypart(event).subscribe(
                results => this.oncustomernumberloadsuccessfull(results[0]),
                error => this.onDataLoadFailed(error)
            );
        }
    }

    customerReferenceNameId(event) {
       
        if (this.allCustomer) {
            for (let i = 0; i < this.allCustomer.length; i++) {
                if (event == this.allCustomer[i].name) {
                    this.sourcereceving.customerReference = this.allCustomer[i].customerId;

                    
                }
            }
           
        }
    }

    getAllCustomerContact(id) {
        // get Customer Contatcs 
        
		this.customerservices.getContacts(id).subscribe(res => {
			this.customerContactList = res[0]
		})
	}
    customerContactChange(customerContact) {
        for (let i = 0; i < this.customerContactList.length; i++) {
            if (customerContact == this.customerContactList[i].contactId) {
                this.sourcereceving.workPhone = this.customerContactList[i].workPhone;
            }
        }
    }

    eventHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    //alert("Action Name already Exists");
                    this.disableSavepartNumber = true;

                }
                else {
                    this.disableSavepartNumber = false;
                    this.sourcereceving.partDescription = "";
                    this.disableSavepartDescription = false;
                }
            }

        }
    }
    private onpartnumberloadsuccessfull(allWorkFlows: any[]) {
        //this.descriptionbyPart = allWorkFlows[0]
        this.sourcereceving.manufacturerId = allWorkFlows[0].manufacturerId;
        this.sourcereceving.manufacturer = allWorkFlows[0].manufacturer.name;
        this.sourcereceving.partDescription = allWorkFlows[0].partDescription;
        this.sourcereceving.isSerialized = allWorkFlows[0].isSerialized;
        this.sourcereceving.isTimeLife = allWorkFlows[0].isTimeLife;
        if (this.sourcereceving.isSerialized == true) {
            this.showRestrictQuantity = true;
            this.showFreeQuantity = false;
            this.showNormalQuantity = false;
        }
        else {
            this.showRestrictQuantity = false;
            this.showFreeQuantity = true;
            this.showNormalQuantity = false;

        }
        
        if (this.sourcereceving.isTimeLife == true) {
            this.sourceTimeLife.timeLife = true;
        }

        else {
            this.sourceTimeLife.timeLife = false;
        }
    }

    private oncustomernumberloadsuccessfull(allWorkFlows: any[]) {
        //this.descriptionbyPart = allWorkFlows[0]
        //this.sourcereceving.partDescription = allWorkFlows[0].partDescription;
        //this.sourcereceving.isSerialized = allWorkFlows[0].isSerialized;
        //if (this.sourcereceving.isSerialized == true) {
        //    this.showRestrictQuantity = true;
        //    this.showFreeQuantity = false;
        //    this.showNormalQuantity = false;
        //}
        //else {
        //    this.showRestrictQuantity = false;
        //    this.showFreeQuantity = true;
        //    this.showNormalQuantity = false;

        //}
        //this.sourcereceving.timeLife = allWorkFlows[0].isTimeLife;
    }


    private onDataLoadSuccessfulForCondition(getConditionList: Condition[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getConditionList;
        this.allConditionInfo = getConditionList;
    }
    private loadDataForCondition() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.conditionService.getConditionList().subscribe(
            results => this.onDataLoadSuccessfulForCondition(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onCustomerDataLoadSuccessful(allCustomerFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allCustomerFlows;
        this.allCustomer = allCustomerFlows;

    }
    private customerList() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.customerservices.getWorkFlows().subscribe(
            results => this.onCustomerDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    private onVendorDataLoadSuccessful(allVendorWorkFlows: any[]) {
        //debugger;
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allVendorWorkFlows;
        this.allVendorList = allVendorWorkFlows;
    }
    private vendorList() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.vendorservice.getVendorList().subscribe(
            results => this.onVendorDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    siteValueChange(data) //Site Valu Selection in Form
    {

        this.allWareHouses = [];
        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];
        this.sourcereceving.warehouseId = null
        this.sourcereceving.locationId = 0;
        this.sourcereceving.shelfId = 0;
        this.sourcereceving.binId = 0;
        this.binService.getWareHouseDate(this.sourcereceving.siteId).subscribe( //calling and Subscribing for WareHouse Data
            results => this.onDataLoadWareHouse(results), //sending WareHouse
            error => this.onDataLoadFailed(error)
        );
    }
    private onDataLoadWareHouse(getWarehousList: any) { //Storing WareHouse Data

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allWareHouses = getWarehousList; //cha
        //this.warehouseId = this.allWareHouses.warehouseId;
    }
    wareHouseValueChange(warehouseId) {

        this.allLocations = [];
        this.allShelfs = [];
        this.allBins = [];

        this.sourcereceving.locationId = 0;
        this.sourcereceving.shelfId = 0;
        this.sourcereceving.binId = 0;
        this.binService.getLocationDate(warehouseId).subscribe( //calling and Subscribing for Location Data
            results => this.onDataLoadLocation(results), //sending Location
            error => this.onDataLoadFailed(error)
        );
    }
    private onDataLoadLocation(getLocationList: any) { //Storing WareHouse Data

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allLocations = getLocationList; //cha
        //this.locationId = this.allWareHouses.locationId;
    }
    locationValueChange(locationId) {
        this.allShelfs = [];
        this.allBins = [];
        this.sourcereceving.shelfId = 0;
        this.sourcereceving.binId = 0;

        this.binService.getShelfDate(locationId).subscribe( //calling and Subscribing for Location Data
            results => this.onDataLoadShelf(results), //sending Location
            error => this.onDataLoadFailed(error)
        );
    }

    private onDataLoadShelf(getShelfList: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allShelfs = getShelfList; //cha
    }
    shelfValueChange(binId) {
        this.allBins = [];
        this.sourcereceving.binId = 0;

        this.binService.getBinDataById(binId).subscribe(
            results => this.onDataLoadBin(results), //sending Location
            error => this.onDataLoadFailed(error));
    }
    private onDataLoadBin(getBinList: any) {
        this.loadingIndicator = false;
        this.allBins = getBinList; //cha
    }
    binValueSelect(data) {
        //All the data in structure
    }

    private loadSiteData()  //retriving SIte Information
    {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.siteService.getSiteList().subscribe(   //Getting Site List Hear
            results => this.onSaiteDataLoadSuccessful(results[0]), //Pasing first Array and calling Method
            error => this.onDataLoadFailed(error)
        );
    }
    private onSaiteDataLoadSuccessful(getSiteList: Site[]) { //Storing Site Data
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getSiteList; //need
        this.allSites = getSiteList; //Contain first array of Loaded table Data will put in Html as [value]
    }
    private onManagemtntdataLoad(getAtaMainList: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getAtaMainList;
        this.allManagemtninfo = getAtaMainList;
        for (let i = 0; i < this.allManagemtninfo.length; i++) {

            if (this.allManagemtninfo[i].parentId == null) {
                this.maincompanylist.push(this.allManagemtninfo[i]);

            }
        }
    }
    private loadManagementdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.workFlowtService1.getManagemententity().subscribe(
            results => this.onManagemtntdataLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }
    empnameId(event) {
        //
        if (this.allEmployeeinfo) {
            for (let i = 0; i < this.allEmployeeinfo.length; i++) {
                if (event == this.allEmployeeinfo[i].firstName) {
                    this.sourcereceving.employeeId = this.allEmployeeinfo[i].employeeId;
                    this.selectedActionName = event;
                }
            }
        }
    }



    private loadManagementdataForTree() {
		this.workFlowtService1.getManagemententity().subscribe(
			results => this.onManagemtntdataLoadTree(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}

	private onManagemtntdataLoadTree(managementInfo: any[]) {
		//console.log(managementInfo);
		this.allManagemtninfo = managementInfo;
		this.parentManagementInfo = managementInfo;
		this.childManagementInfo = managementInfo;
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == null) {
				this.bulist = [];
				this.divisionlist = [];
				this.departmentList = [];
				this.maincompanylist.push(this.allManagemtninfo[i]);
			}
		}
	}

	getBUList(companyId) {
		this.sourcereceving.managementStructureId = companyId;
		this.bulist = [];
		this.divisionlist = [];
		this.departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == companyId) {
				this.bulist.push(this.allManagemtninfo[i]);
			}
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentCompanyId = companyId;
			this.getParentBUList(this.partListData[i]);
			if (this.partListData[i].childList) {
				for (let j = 0; j < this.partListData[i].childList.length; j++) {
					this.partListData[i].childList[j].childCompanyId = companyId;
					this.getChildBUList(this.partListData[i].childList[j]);
				}
			}
		}

	}

	getDivisionlist(buId) {
		this.sourcereceving.managementStructureId = buId;
		this.divisionlist = [];
		this.departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == buId) {
				this.divisionlist.push(this.allManagemtninfo[i]);
			}
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentbuId = buId;
			this.getParentDivisionlist(this.partListData[i]);
			if (this.partListData[i].childList) {
				for (let j = 0; j < this.partListData[i].childList.length; j++) {
					this.partListData[i].childList[j].childbuId = buId;
					this.getChildDivisionlist(this.partListData[i].childList[j]);
				}
			}
		}
	}

	getDepartmentlist(divisionId) {
		this.sourcereceving.managementStructureId = divisionId;
		this.departmentList = [];
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].parentId == divisionId) {
				this.departmentList.push(this.allManagemtninfo[i]);
			}
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentDivisionId = divisionId;
			this.getParentDeptlist(this.partListData[i]);
			if (this.partListData[i].childList) {
				for (let j = 0; j < this.partListData[i].childList.length; j++) {
					this.partListData[i].childList[j].childDivisionId = divisionId;
					this.getChildDeptlist(this.partListData[i].childList[j]);
				}
			}
		}
	}

	getDepartmentId(departmentId) {
		this.sourcereceving.managementStructureId = departmentId;
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentDeptId = departmentId;
		}
		for (let i = 0; i < this.partListData.length; i++) {
			this.partListData[i].parentDeptId = departmentId;
			this.getParentDeptId(this.partListData[i]);
			if (this.partListData[i].childList) {
				for (let j = 0; j < this.partListData[i].childList.length; j++) {
					this.partListData[i].childList[j].childDeptId = departmentId;
					this.getChildDeptId(this.partListData[i].childList[j]);
				}
			}
		}
	}

	getParentBUList(partList) {
		partList.managementStructureId = partList.parentCompanyId;
		partList.parentBulist = []
		partList.parentDivisionlist = [];
		partList.parentDepartmentlist = [];
		for (let i = 0; i < this.parentManagementInfo.length; i++) {
			if (this.parentManagementInfo[i].parentId == partList.parentCompanyId) {
				partList.parentBulist.push(this.parentManagementInfo[i]);
			}
		}
	}

	getParentDivisionlist(partList) {
		partList.managementStructureId = partList.parentbuId;
		partList.parentDivisionlist = [];
		partList.parentDepartmentlist = [];
		for (let i = 0; i < this.parentManagementInfo.length; i++) {
			if (this.parentManagementInfo[i].parentId == partList.parentbuId) {
				partList.parentDivisionlist.push(this.parentManagementInfo[i]);
			}
		}
	}

	getParentDeptlist(partList) {
		partList.managementStructureId = partList.parentDivisionId;
		partList.parentDepartmentlist = [];
		for (let i = 0; i < this.parentManagementInfo.length; i++) {
			if (this.parentManagementInfo[i].parentId == partList.parentDivisionId) {
				partList.parentDepartmentlist.push(this.parentManagementInfo[i]);
			}
		}
	}

	getParentDeptId(partList) {
		partList.managementStructureId = partList.parentDeptId;
	}

	getChildBUList(partChildList) {
		partChildList.managementStructureId = partChildList.childCompanyId;
		console.log(partChildList.managementStructureId);

		partChildList.childBulist = [];
		partChildList.childDivisionlist = [];
		partChildList.childDepartmentlist = [];
		for (let i = 0; i < this.childManagementInfo.length; i++) {
			if (this.childManagementInfo[i].parentId == partChildList.childCompanyId) {
				partChildList.childBulist.push(this.childManagementInfo[i]);
			}
		}
	}

	getChildDivisionlist(partChildList) {
		partChildList.managementStructureId = partChildList.childbuId;
		partChildList.childDivisionlist = [];
		partChildList.childDepartmentlist = [];
		for (let i = 0; i < this.childManagementInfo.length; i++) {
			if (this.childManagementInfo[i].parentId == partChildList.childbuId) {
				partChildList.childDivisionlist.push(this.childManagementInfo[i]);
			}
		}
	}

	getChildDeptlist(partChildList) {
		partChildList.managementStructureId = partChildList.childDivisionId;
		partChildList.childDepartmentlist = [];
		for (let i = 0; i < this.childManagementInfo.length; i++) {
			if (this.childManagementInfo[i].parentId == partChildList.childDivisionId) {
				partChildList.childDepartmentlist.push(this.childManagementInfo[i]);
			}
		}
	}

	getChildDeptId(partChildList) {
		partChildList.managementStructureId = partChildList.childDeptId;
	}

    editItemExpertiesCloseModel() {}
    filterEmployeeNames($event) {}
}