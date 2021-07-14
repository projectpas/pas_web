import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges,ViewChild,ElementRef } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
declare var $ : any;
import { CommonService } from '../../../../services/common.service';
import { AddressModel } from '../../../../models/address.model';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CustomerService } from '../../../../services/customer.service';
import { getObjectById,editValueAssignByCondition, formatNumberAsGlobalSettingsModule, getValueFromObjectByKey, getObjectByValue, } from '../../../../generic/autocomplete';
import { Billing } from '../../../../models/work-order-billing.model';
import { getModuleIdByName } from '../../../../generic/enums';
import { WorkOrderQuoteService } from '../../../../services/work-order/work-order-quote.service';
import * as moment from 'moment';
import {
    WorkOrderLabor
} from '../../../../models/work-order-labor.modal';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { InvoiceTypeEnum } from 'src/app/components/sales/order/models/sales-order-invoice-type-enum';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'

 
@Component({
    selector: 'app-work-order-billing',
    templateUrl: './work-order-billing.component.html',
    styleUrls: ['./work-order-billing.component.scss'],
    animations: [fadeInOut]
})
export class WorkOrderBillingComponent implements OnInit {
    @Input() quotestatusofCurrentPart;
    @Input() employeesOriginalData;
    @Input() billingorInvoiceForm;
    @Input() savedWorkOrderData;
    @Input() isEditBilling = false;
    @Input() workOrderQuoteId = 0;
    @Input() taskList: any = [];
    @Input() quoteExclusionList;
    @Input() quoteMaterialList;
    @Input() quoteFreightsList;
    @Input() quoteChargesList;
    @Input() workOrderChargesList;
    @Input() quoteLaborList;
    @Input() buildMethodDetails: any = {};
    @Input() isViewMode: boolean = false;
    @Input() isView: boolean = false;
    @Output() saveWOBilling = new EventEmitter();
    @Output() updateWOBilling = new EventEmitter();
    @Input() workFlowWorkOrderId = 0;
    @Input() workFlowId;
    @Input() workOrderPartNumberId;
    @Input() labordata: any;
    @Input() workOrderLaborList: any;
    @Input() isbillingNotCreated = false;
    modal: NgbModalRef;
    salesOrderBillingInvoiceId: number;
    WObillingInvoicingId: number;
    salesOrderId:number;
    @ViewChild("printPost", { static: false }) public printPostModal: ElementRef;
    overAllMarkup: any;
    employeeList: any;
    //workOrderPartNumberId:number
    customerNamesList: Object;
    soldToCustomername:string;
    shipToCustomername:string;
    soldCustomerSiteList = [];
    shipCustomerSiteList = [];
    arrayCustlist: any[] = [];
    private onDestroy$: Subject<void> = new Subject<void>();
    siteList: any = [];
    shipToAttention;
    billing: Billing;
    soldCustomerAddress: any = new AddressModel();
    shipCustomerAddress: any = new AddressModel();
    showBillingForm: boolean = false;
    isMultipleSelected: boolean = false;
    isworkorderdetails: boolean = false;
    disableMagmtStruct: boolean = true;
    Iswocheckbox: boolean = true;
    workOrderShippingId:number;
    selectedQtyToBill:number;
    isSpinnerVisible = false;
    loginDetailsForCreate:any;
    invoiceStatus: string;
    managementStructure = {
        companyId: null,
        buId: null,
        divisionId: null,
        departmentId: null,
    }
    soldCustomerShippingOriginalData: any[];
    shipCustomerShippingOriginalData: any[];
    workOrderId: any;
    QouteDetails: any = {};
    shipViaList: Object;
    customerId: any;
    legalEntityList: any=[];
    businessUnitList: any;
    divisionList: any;
    departmentList: any;
    markUpList: any;
    invoiceTypeList: any;
    shipViaData: any;
    //isView: boolean = false;
    id: number;
    workFlowObject = {
        materialList: [],
        equipments: [],
        charges: [],
        exclusions: []
    }
    isQuote: boolean = true;
    isWorkOrder: boolean = false;
    labor = new WorkOrderLabor();
    employeeId:number;
    ItemMasterId:number;
    costPlusType: any;
    billingorInvoiceFormNew :any;
    workOrderBillingInvoiceId:number;
    workOrderMaterialList: any[];
    selectedColumns;
    headers = [];
    billingList: any[] = [];
    partSelected: boolean = false;
    cols = [
        { field: 'taskName', header: 'Task' },
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'provision', header: 'Provision' },
        { field: 'quantity', header: 'Qty Req', align: 1 },
        { field: 'uom', header: 'UOM' },
        { field: 'condition', header: 'Cond' },
        { field: 'stockType', header: 'Stk Type' },
        { field: 'unitCost', header: 'Unit Cost', align: 1 },
        { field: 'extendedCost', header: 'Ext. Cost', align: 1 }
    ];
    colums = [
        { field: 'taskName', header: 'Task' },
        { field: 'vendorName', header: 'Vendor Name' },
        { field: 'quantity', header: 'Qty' },
        { field: 'refNum', header: 'Ref Num' },
        { field: 'chargeType', header: 'Charge Type' },
        { field: 'description', header: 'Description' },
        { field: 'unitCost', header: 'Unit Cost' },
        { field: 'extendedCost', header: 'Extented Cost' },
    ];
    unitOfMeasuresList: any;
    conditions: any;
    currencyList:any=[];
    constructor(private commonService: CommonService, private workOrderService: WorkOrderService,
        private customerService: CustomerService, private quoteService: WorkOrderQuoteService, private alertService: AlertService,   private authService: AuthService,
        private modalService: NgbModal
    ) {
    }

    ngOnInit() {
        this.initColumns();
        if (this.workOrderQuoteId == 0) {
        }
        if (this.buildMethodDetails) {
            if (this.buildMethodDetails['materialBuildMethod'] != undefined || this.buildMethodDetails['materialBuildMethod'] != null) {
                this.costPlusType = this.buildMethodDetails['materialBuildMethod'].toString();
            }
        }
        const data = this.billingorInvoiceForm;
        this.billingorInvoiceFormNew = this.billingorInvoiceForm;
        this.workOrderId = this.savedWorkOrderData.workOrderId;
        this.getBillingList();
        this.getEmployeeList(this.workOrderId);
        this.customerId = editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId);
        this.employeeId= editValueAssignByCondition('value', this.savedWorkOrderData.employeeId);
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.quoteMaterialList && this.quoteMaterialList.length > 0) {
            this.overAllMarkup = Number(this.quoteMaterialList[0].headerMarkupId);
        }
        this.billingorInvoiceForm = this.billingorInvoiceForm;
        this.billingorInvoiceFormNew = this.billingorInvoiceForm;
        if (this.buildMethodDetails && this.quotestatusofCurrentPart == 'Approved') {
            if (this.buildMethodDetails['materialBuildMethod'] != undefined || this.buildMethodDetails['materialBuildMethod'] != null) {
                this.costPlusType = this.buildMethodDetails['materialBuildMethod'].toString();
            }
        }
    }

    getActive()
    {
    }

    ViewInvoice(rowData) {
        this.workOrderId = rowData.workOrderId;
        this.workOrderBillingInvoiceId = rowData.woBillingInvoicingId;
        this.invoiceStatus = rowData.invoiceStatus;
        this.loadInvoiceView();
    }
    loadInvoiceView() {
        this.WObillingInvoicingId = this.workOrderBillingInvoiceId;
        this.modal = this.modalService.open(this.printPostModal, { size: "lg", backdrop: 'static', keyboard: false });
    }
    onInvoiceLoad(invoiceStatus) 
    {
        this.invoiceStatus = invoiceStatus;
    }
    close() {
        this.modal.close();
    }
    CommonMethod()
    {
            this.loadcustomerData('');
            if (this.billingorInvoiceForm.soldToCustomerId) 
            {
                this.getSiteNames(this.customerId,this.billingorInvoiceForm.soldToSiteId);
            }
            if (this.billingorInvoiceForm.shipToCustomerId) 
            {
                this.getSiteNamesByShipCustomerId(this.billingorInvoiceForm.shipToCustomerId.customerId,this.billingorInvoiceFormNew.shipToSiteId);
            }
       
        this.getManagementStructureDetails(this.billingorInvoiceForm
                ? this.billingorInvoiceForm.managementStructureId
                : null, this.authService.currentUser ? this.authService.currentUser.employeeId : 0);
        this.getShipViaByCustomerId();
        this.getPercentageList();
        this.getInvoiceList();
        this.resetOtherOptions();
        this.getCurrencyList();
        this.resetMisCharges();
        this.resetMaterial();
        this.resetLaborOverHead();
        this.resetFreight();
        this.calculateTotalWorkOrderCost();
        this.calculateGrandTotal();
    }
    
    initColumns() {
        this.headers = [
            { field: "workOrderNumber", header: "WO Num", width: "100px" },
            { field: "partNumber", header: "PN", width: "100px" },
            { field: "partDescription", header: "PN Description", width: "100px" },
            { field: "qtyToBill", header: "Qty Shipped", width: "110px" },
            { field: "qtyBilled", header: "Qty Billed", width: "90px" },
            { field: "qtyRemaining", header: "Qty Rem", width: "90px" },
            { field: "status", header: "Status", width: "90px" },
        ];
        this.selectedColumns = this.headers;
    }
    getBillingList() {
        this.isSpinnerVisible = true;
        this.workOrderService
            .getBillingInvoiceList(this.workOrderId,this.workOrderPartNumberId)
            .subscribe((response: any) => {
                this.isSpinnerVisible = false;
                this.billingList = response[0];
                this.checkIsChecked();
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    disableCreateInvoiceBtn: boolean = true;
    checkIsChecked() {
        this.billingList.forEach(a => {
            a.workOrderBillingInvoiceChild.forEach(ele => {
                if (ele.selected)
                    this.disableCreateInvoiceBtn = false;
                else
                    this.disableCreateInvoiceBtn = true;
            });
        });
    }

    PerformBilling() {
        this.isMultipleSelected = true;
        this.partSelected = true;
        let lastworkOrderPartId: number;
        let lastworkOrderShippingId: number;

        if (this.isMultipleSelected) {
            this.billingList.filter(a => {
                for (let i = 0; i < a.workOrderBillingInvoiceChild.length; i++) {
                    if (a.workOrderBillingInvoiceChild[i].selected == true) {
                        lastworkOrderShippingId = a.workOrderBillingInvoiceChild[i].workOrderShippingId;
                        lastworkOrderPartId = a.workOrderBillingInvoiceChild[i].workOrderPartId;
                    }
                }
            });
        }
        this.showBillingForm = true;
    }
    billingCreateOrEdit(type) {
        this.isSpinnerVisible = true;
        this.workOrderService.getBillingEditData(this.workOrderId, this.workOrderPartNumberId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.isSpinnerVisible = false;
            this.billing = new Billing();
            this.billing = {
                ...res,
                shipDate: new Date(res.shipDate),
                printDate: new Date(res.printDate),
                woOpenDate: new Date(res.openDate),
                invoiceDate: new Date(res.invoiceDate),
                soldToCustomerId: { customerId: res.soldToCustomerId, customerName: res.soldToCustomer },
                shipToCustomerId: { customerId: res.shipToCustomerId, customerName: res.shipToCustomer },
                customerRef: res.customerReference,
                woType: res.workOrderType,
                shipAccountInfo: res.shippingAccountinfo,
            }

            this.billingorInvoiceForm=this.billing;
            this.Iswocheckbox = true;
            if(type =="workorder")
            {
                this.getbillingCostDataForWoOnly();
            }
            else
            {
                this.Getbillinginvoicingdetailsfromquote();
            }

        }, error => {
            this.isSpinnerVisible = false;
            this.errorHandling(error);
        })
    }
    PerformWorkBilling()
    {   
        this.isMultipleSelected = true;
        this.partSelected = true;
        this.showBillingForm = true;
        this.billingCreateOrEdit("workorder");
    }

    PerformQouteBilling()
    {   
        this.isMultipleSelected = true;
        this.partSelected = true;
        this.showBillingForm = true;
        this.billingCreateOrEdit("qoute");
        this.Getbillinginvoicingdetailsfromquote();
    }

    onSelectPartNumber(rowData) {
        if (rowData.workOrderPartId != 0 && rowData.workOrderShippingId != 0) {
            this.selectedQtyToBill = rowData.qtyToBill;
            this.partSelected = true;
            this.showBillingForm = true;
            this.isMultipleSelected = false;
            this.workOrderShippingId = rowData.workOrderShippingId;
            this.partSelected = true;
            this.showBillingForm = true;
        }
    }

    getBillingAndInvoicingForSelectedPart(partNumber, lastworkOrderShippingId) {
        this.isSpinnerVisible = true;
        this.selectedPartNumber = partNumber;
        this.workOrderService.getWorkOrderBillingByShipping(this.workOrderId, partNumber, lastworkOrderShippingId).subscribe(result => {
            this.isSpinnerVisible = false;
            if (result) {
                this.billingorInvoiceForm = result;
                this.billingorInvoiceForm.openDate = new Date(result.openDate);
                this.billingorInvoiceForm.printDate = new Date();
                this.billingorInvoiceForm.invoiceDate = new Date();
                this.billingorInvoiceForm.creditLimit = this.formateCurrency(result.creditLimit);
                this.billingorInvoiceForm.customerId = result.customerId;
            } else {
                this.billingorInvoiceForm = new WorkOrderBillingAndInvoicing();
            }
            this.getCurrencyList();
            this.getInvoiceList();
            this.getShipViaByCustomerId();
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    formateCurrency(amount) {
        return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
    }
    getbillingCostDataForWoOnly() {
        this.workOrderService.getbillingCostDataForWoOnly(this.workFlowWorkOrderId, this.billingorInvoiceForm.managementStructureId).subscribe(res => {
            if (res) {
                this.billingorInvoiceForm.materialCost = res.materialCost;
                this.billingorInvoiceForm.laborOverHeadCost = res.labourCost;
                this.billingorInvoiceForm.miscChargesCost = res.miscCharges;
                this.billingorInvoiceForm.freightCost = res.freightCost;
                this.billingorInvoiceForm.totalWorkOrderCost = res.totalCost;
                this.isWorkOrder=true;
                this.CommonMethod();
            }
        },
            err => {
                 this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
    }

    Getbillinginvoicingdetailsfromquote() {
        this.workOrderService.Getbillinginvoicingdetailsfromquote(this.workFlowWorkOrderId, this.workOrderPartNumberId).subscribe(res => {
            if (res) {
                this.QouteDetails ={};
                this.QouteDetails =res;
                this.billingorInvoiceForm.materialCost = res.materialFlatBillingAmount;
                this.billingorInvoiceForm.laborOverHeadCost = res.laborFlatBillingAmount;
                this.billingorInvoiceForm.miscChargesCost = res.chargesFlatBillingAmount;
                this.billingorInvoiceForm.freightCost = res.freightFlatBillingAmount;
                this.isWorkOrder=false;
                this.CommonMethod();
            }
        },
            err => {
                this.errorHandling(err);
            })
    }

    getCurrencyList() {
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'code',this.authService.currentUser.masterCompanyId, '', '').subscribe(
            results => {
                this.currencyList = results
            },
            err => {
                this.isSpinnerVisible = false;
                this.errorHandling(err);
            }
        );
    }

    getEmployeeList(woId) {
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName',this.authService.currentUser.masterCompanyId, this.currentUserMasterCompanyId)
            .subscribe(
                (employeeList: any[]) => {
                    this.employeeList = employeeList;
                    this.employeesOriginalData = employeeList;
                },
                err => {
                    this.errorHandling(err);
                }
            )
    }

    getPercentageList() {
        this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue',this.authService.currentUser.masterCompanyId, this.currentUserMasterCompanyId).subscribe(res => {
            this.markUpList = res;
        },
            err => {
                this.errorHandling(err);
            })
    }

    getInvoiceList() {
        this.commonService.smartDropDownList('InvoiceType', 'InvoiceTypeId', 'Description',this.authService.currentUser.masterCompanyId, this.currentUserMasterCompanyId).subscribe(res => {
            this.invoiceTypeList = res;
        },
            err => {
                this.errorHandling(err);
            })
    }

    getShipViaByCustomerId() {
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name', this.currentUserMasterCompanyId)
            .subscribe(
                (res) => {
                    this.shipViaList = res;
                },
                err => {
                    this.errorHandling(err);
                }
            )
    }

    filterEmployee(event): void {

        this.employeeList = this.employeesOriginalData;

        if (event.query !== undefined && event.query !== null) {
            const employee = [...this.employeesOriginalData.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.employeeList = employee;
        }
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    filterCustomerNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    }

    async loadcustomerData(strText = '') 
    {
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }
        if (this.customerId >0) 
        {
            this.arrayCustlist.push(this.customerId);
        }
        if (this.billingorInvoiceForm.shipToCustomerId) 
        {
            this.arrayCustlist.push(this.billingorInvoiceForm.shipToCustomerId.customerId);
        }
        this.isSpinnerVisible = true;
        await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.isSpinnerVisible = false;
            this.customerNamesList = response.map(x => {
                return {
                    customerName: x.label, customerId: x.value
                }
            });
        }, err => {
            this.isSpinnerVisible = false;
        });
    }
    onselectcustomergetsite(object) {
        const { customerId } = object;
        this.getSiteNamesByShipCustomerId(customerId, 0);

    }

    onselectcustomergetSoldsite(object) {
        const { customerId } = object;
        this.getSiteNames(customerId, 0);

    }
    async getSiteNamesBySoldCustomerId(object) {
        const { customerId } = object;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {

            this.soldCustomerShippingOriginalData = res[0];
            this.soldCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerDomensticShippingId

                }
            });
            this.soldCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.soldToSiteId = x.customerDomensticShippingId;
                        this.changeOfSoldSiteName(x.customerDomensticShippingId);
                    }
                }
            )
        },
            err => {
                this.errorHandling(err);
            })
    }

    changeOfSoldSiteName(value) {
        const data = getObjectById('customerDomensticShippingId', value, this.soldCustomerShippingOriginalData);
        if (data) {
            this.soldCustomerAddress.line1 = data.address1;
            this.soldCustomerAddress.line2 = data.address2;
            this.soldCustomerAddress.country = data.countryName;
            this.soldCustomerAddress.postalCode = data.postalCode;
            this.soldCustomerAddress.stateOrProvince = data.stateOrProvince;
            this.soldCustomerAddress.city = data.city;
        } else {
            this.soldCustomerAddress = new AddressModel();
        }
    }
    changeOfShipVia(value) {
        const data = getObjectById('shippingViaId', value, this.shipViaData);
        if (data) {
            this.billingorInvoiceForm.shipAccountInfo = data.shippingAccountInfo;
        }
    }
    changeOfShipSiteName(value) {
        const data = getObjectById('customerDomensticShippingId', value, this.shipCustomerShippingOriginalData);

        if (data) {
            this.shipCustomerAddress.line1 = data.address1;
            this.shipCustomerAddress.line2 = data.address2;
            this.shipCustomerAddress.country = data.countryName;
            this.shipCustomerAddress.postalCode = data.postalCode;
            this.shipCustomerAddress.stateOrProvince = data.stateOrProvince;
            this.shipCustomerAddress.city = data.city;
        } else {
            this.shipCustomerAddress = new AddressModel();
        }
    }

    clearAddress(type, value) {
        if (value === '' && type === 'SoldTo') {
            this.soldCustomerAddress = new AddressModel();
        } else if (value === '' && type === 'shipTo') {
            this.shipCustomerAddress = new AddressModel();
        }
    }
    BindManagementStructure() {
        this.selectedLegalEntity(this.authService.currentManagementStructure.levelId1,'onLoad');
        this.selectedBusinessUnit(this.authService.currentManagementStructure.levelId2,'onLoad');
        this.selectedDivision(this.authService.currentManagementStructure.levelId3,'onLoad');
        this.selectedDepartment(this.authService.currentManagementStructure.levelId4,'onLoad');
        this.managementStructure.companyId = this.authService.currentManagementStructure.levelId1;
        this.managementStructure.buId = this.authService.currentManagementStructure.levelId2;
        this.managementStructure.divisionId = this.authService.currentManagementStructure.levelId3;
        this.managementStructure.departmentId = this.authService.currentManagementStructure.levelId4;
    }

    getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
        empployid = empployid == 0 ? this.employeeId : empployid;
        editMSID = this.isEditBilling ? editMSID = id : 0;
        this.commonService.getManagmentStrctureData(id, empployid, editMSID,this.authService.currentUser.masterCompanyId).subscribe(response => {
            if (response) {
                const result = response;
                if (result[0] && result[0].level == 'Level1') {
                    this.legalEntityList = result[0].lstManagmentStrcture;
                    this.managementStructure.companyId = result[0].managementStructureId;
                    this.billingorInvoiceForm.managementStructureId = result[0].managementStructureId;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    this.managementStructure.companyId = 0;
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.legalEntityList = [];
                    this.businessUnitList = [];
                    this.divisionList = [];
                    this.departmentList = [];
                }
                if (result[1] && result[1].level == 'Level2') {
                    this.businessUnitList = result[1].lstManagmentStrcture;
                    this.managementStructure.buId = result[1].managementStructureId;
                    this.billingorInvoiceForm.managementStructureId = result[1].managementStructureId;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                } else {
                    if (result[1] && result[1].level == 'NEXT') {
                        this.businessUnitList = result[1].lstManagmentStrcture;
                    }
                    this.managementStructure.buId = 0;
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.divisionList = [];
                    this.departmentList = [];
                }

                if (result[2] && result[2].level == 'Level3') {
                    this.divisionList = result[2].lstManagmentStrcture;
                    this.managementStructure.divisionId = result[2].managementStructureId;
                    this.billingorInvoiceForm.managementStructureId = result[2].managementStructureId;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                } else {
                    if (result[2] && result[2].level == 'NEXT') {
                        this.divisionList = result[2].lstManagmentStrcture;
                    }
                    this.managementStructure.divisionId = 0;
                    this.managementStructure.departmentId = 0;
                    this.departmentList = [];
                }

                if (result[3] && result[3].level == 'Level4') {
                    this.departmentList = result[3].lstManagmentStrcture;;
                    this.managementStructure.departmentId = result[3].managementStructureId;
                    this.billingorInvoiceForm.managementStructureId = result[3].managementStructureId;
                } else {
                    this.managementStructure.departmentId = 0;
                    if (result[3] && result[3].level == 'NEXT') {
                        this.departmentList = result[3].lstManagmentStrcture;
                    }
                }
            }
        });
    }

    selectedLegalEntity(legalEntityId,from) {
        if (legalEntityId) {
            this.managementStructure.companyId = legalEntityId;
            this.billingorInvoiceForm.managementStructureId = legalEntityId;
            this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId,0,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.businessUnitList = res;
                this.managementStructure.buId = 0;
                this.managementStructure.divisionId = 0;
                this.managementStructure.departmentId = 0;
            })
        } 
    }

    getEmployeebylegalentity(id) {
    }

    selectedBusinessUnit(businessUnitId,from) {
        if (businessUnitId) {
            this.managementStructure.buId = businessUnitId;
            this.billingorInvoiceForm.managementStructureId = businessUnitId;
            this.commonService.getManagementStructurelevelWithEmployee(businessUnitId, this.employeeId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.divisionList = res;
                this.managementStructure.divisionId = 0;
                this.managementStructure.departmentId = 0;
            })
        }
    }

    selectedDivision(divisionId,from) {
        if (divisionId) {
            this.managementStructure.divisionId = divisionId;
            this.billingorInvoiceForm.managementStructureId = divisionId;
            this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.departmentList = res;
                this.managementStructure.departmentId = 0;
            })
        }
    }

    selectedDepartment(departmentId,from) {
        if (departmentId) {
            this.managementStructure.departmentId = departmentId;
            this.billingorInvoiceForm.managementStructureId = departmentId;
        }
    }

    resetOtherOptions() {
        this.billingorInvoiceForm.totalWorkOrderValue = null;
        this.billingorInvoiceForm.totalWorkOrderCostPlus = this.billingorInvoiceForm.totalWorkOrderCost;;

        if (this.billingorInvoiceForm.totalWorkOrder === true) {
            this.resetMisCharges();
            this.resetMaterial();
            this.resetLaborOverHead();
            this.resetFreight();
            this.calculateTotalWorkOrderCost();

        }
    }

    calculateTotalWorkOrderCost() {
        this.sumOfMaterialList();
        this.sumofCharges();
        this.sumofLaborOverHead();
        this.sumofFreight();
        if (this.billingorInvoiceForm) {
            this.billingorInvoiceForm.totalWorkOrderCost =this.formateCurrency(Number(this.billingorInvoiceForm.materialCost.toString().replace(/\,/g,'')) + Number(this.billingorInvoiceForm.miscChargesCost.toString().replace(/\,/g,'')) + Number(this.billingorInvoiceForm.laborOverHeadCost.toString().replace(/\,/g,'')) + Number(this.billingorInvoiceForm.freightCost.toString().replace(/\,/g,'')));
            this.calculateTotalWorkOrderCostPlus(0);
        }
    }

    calculateTotalWorkOrderCostPlus(value) {
        // const materialCostPlus = Number(this.billingorInvoiceForm.materialCost) + ((Number(this.billingorInvoiceForm.materialCost) * Number(value)) / 100)
        // const misChargeCostPlus = Number(this.billingorInvoiceForm.miscChargesCost) + ((Number(this.billingorInvoiceForm.miscChargesCost) * Number(value)) / 100)
        // const laborOverHeadCostPlus = Number(this.billingorInvoiceForm.laborOverHeadCost) + ((Number(this.billingorInvoiceForm.laborOverHeadCost) * Number(value)) / 100);
        // const freightCostPlus = Number(this.billingorInvoiceForm.freightCost) + ((Number(this.billingorInvoiceForm.freightCost) * Number(value)) / 100);
        
        if(value ==0)
        {
            this.billingorInvoiceForm.totalWorkOrderCostPlus = this.billingorInvoiceForm.totalWorkOrderCost;
        }
        else
        {
            try {
                this.markUpList.forEach((markup) => {
                    if (markup.value == value) {
                        this.billingorInvoiceForm.totalWorkOrderCostPlus =  this.formateCurrency(Number(this.billingorInvoiceForm.totalWorkOrderCost.toString().replace(/\,/g,'')) + ((Number(this.billingorInvoiceForm.totalWorkOrderCost.toString().replace(/\,/g,'')) / 100) * Number(markup.label)))
                    }
                })
            }
            catch (e) {
            }
        }
    }

    resetMaterial() {
        if (this.billingorInvoiceForm) {
            if (this.billingorInvoiceForm.material === false || this.billingorInvoiceForm.totalWorkOrder === true) {
                this.billingorInvoiceForm.material = false
                this.billingorInvoiceForm.materialValue = null;
                this.billingorInvoiceForm.materialCostPlus = this.billingorInvoiceForm.materialCost;
            } else {
                this.sumOfMaterialList();
                this.calculateMaterialCostPlus(0);
            }
        }
    }

    resetLaborOverHead() {
        if (this.billingorInvoiceForm) {
            if (this.billingorInvoiceForm.laborOverHead === false || this.billingorInvoiceForm.totalWorkOrder === true) {
                this.billingorInvoiceForm.laborOverHead = false
                this.billingorInvoiceForm.laborOverHeadValue = null;
                this.billingorInvoiceForm.laborOverHeadCostPlus = this.billingorInvoiceForm.laborOverHeadCost;
            } else {
                this.sumofLaborOverHead();
                this.calculateLaborOverHeadCostPlus(0);
            }
        }

    }

    resetMisCharges() {
        if (this.billingorInvoiceForm) {
            if (this.billingorInvoiceForm.miscCharges === false || this.billingorInvoiceForm.totalWorkOrder === true) {
                this.billingorInvoiceForm.miscCharges = false
                this.billingorInvoiceForm.miscChargesValue = null;
                this.billingorInvoiceForm.miscChargesCostPlus = this.billingorInvoiceForm.miscChargesCost;
            } else {
                this.sumofCharges();
                this.calculateMiscChargesCostPlus(0);
            }
        }

    }

    resetFreight() {
        if (this.billingorInvoiceForm) {
            if (this.billingorInvoiceForm.freight === false || this.billingorInvoiceForm.totalWorkOrder === true) {
                this.billingorInvoiceForm.freight = false
                this.billingorInvoiceForm.freightValue = null;
                this.billingorInvoiceForm.freightCostPlus = this.billingorInvoiceForm.freightCost;
            } else {
                this.sumofFreight();
                this.calculateFreightCostPlus(0);
            }
        }

    }

    sumOfMaterialList() {
        if (this.billingorInvoiceForm && this.isWorkOrder == false && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.materialCost = (this.QouteDetails) ? this.QouteDetails.materialFlatBillingAmount : 0.00;
        }
    }
    calculateMaterialCostPlus(value) {
        if (this.billingorInvoiceForm) {

            try {
                this.markUpList.forEach((markup) => {
                    if (markup.value == value) {
                        this.billingorInvoiceForm.materialCostPlus =  this.formateCurrency(Number(this.billingorInvoiceForm.materialCost.toString().replace(/\,/g,'')) + ((Number(this.billingorInvoiceForm.materialCost.toString().replace(/\,/g,'')) / 100) * Number(markup.label)))
                        //this.billingorInvoiceForm.materialCostPlus = this.formateCurrency(Number(this.billingorInvoiceForm.materialCost) + ((Number(this.billingorInvoiceForm.materialCost) * Number(markup.label)) / 100));
                    }
                })
            }
            catch (e) {
            }
        }
    }
    sumofLaborOverHead() {

        if (this.billingorInvoiceForm && this.isWorkOrder == false && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.laborOverHeadCost = (this.QouteDetails) ? this.QouteDetails.laborFlatBillingAmount : 0.00;
        }
    }
    calculateLaborOverHeadCostPlus(value) {
        if (this.billingorInvoiceForm) {

            try {
                this.markUpList.forEach((markup) => {
                    if (markup.value == value) {
                        this.billingorInvoiceForm.laborOverHeadCostPlus =  this.formateCurrency(Number(this.billingorInvoiceForm.laborOverHeadCost.toString().replace(/\,/g,'')) + ((Number(this.billingorInvoiceForm.laborOverHeadCost.toString().replace(/\,/g,'')) / 100) * Number(markup.label)))
                        //this.billingorInvoiceForm.laborOverHeadCostPlus = this.formateCurrency(Number(this.billingorInvoiceForm.laborOverHeadCost) + ((Number(this.billingorInvoiceForm.laborOverHeadCost) * Number(markup.label)) / 100));
                    }
                })
            }
            catch (e) {
            }
        }
    }
    sumofCharges() {

        if (this.billingorInvoiceForm && this.isWorkOrder == false && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.miscChargesCost = (this.QouteDetails) ? this.QouteDetails.chargesFlatBillingAmount : 0.00;
        }
    }

    sumofFreight() {

        if (this.billingorInvoiceForm && this.isWorkOrder == false && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.freightCost = (this.QouteDetails) ? this.QouteDetails.freightFlatBillingAmount : 0.00;
        }
    }
    calculateMiscChargesCostPlus(value) {
        if (this.billingorInvoiceForm) {

            try {
                this.markUpList.forEach((markup) => {
                    if (markup.value == value) {
                        this.billingorInvoiceForm.miscChargesCostPlus =  this.formateCurrency(Number(this.billingorInvoiceForm.miscChargesCost.toString().replace(/\,/g,'')) + ((Number(this.billingorInvoiceForm.miscChargesCost.toString().replace(/\,/g,'')) / 100) * Number(markup.label)))
                       // this.billingorInvoiceForm.miscChargesCostPlus = this.formateCurrency(Number(this.billingorInvoiceForm.miscChargesCost) + ((Number(this.billingorInvoiceForm.miscChargesCost) * Number(markup.label)) / 100));
                    }
                })
            }
            catch (e) {
            }
        }
    }

    calculateFreightCostPlus(value) {
        if (this.billingorInvoiceForm) {

            try {
                this.markUpList.forEach((markup) => {
                    if (markup.value == value) {

                        this.billingorInvoiceForm.freightCostPlus =  this.formateCurrency(Number(this.billingorInvoiceForm.freightCost.toString().replace(/\,/g,'')) + ((Number(this.billingorInvoiceForm.freightCost.toString().replace(/\,/g,'')) / 100) * Number(markup.label)))
                       // this.billingorInvoiceForm.freightCostPlus = this.formateCurrency(Number(this.billingorInvoiceForm.freightCost) + ((Number(this.billingorInvoiceForm.freightCost) * Number(markup.label)) / 100));
                    }
                })
            }
            catch (e) {
            }
        }
    }
    calculateGrandTotal() {
        if (this.billingorInvoiceForm) {

          if(this.billingorInvoiceForm.totalWorkOrder  == true)
          {
             this.Iswocheckbox = true;
          } 
          else
          {

            if(this.billingorInvoiceForm.laborOverHead  == true || this.billingorInvoiceForm.material == true || this.billingorInvoiceForm.miscCharges == true || this.billingorInvoiceForm.freight == true )
            {
               this.Iswocheckbox = true;
            }else
            {
                this.Iswocheckbox = false;
            }
          }

            if (this.billingorInvoiceForm.totalWorkOrder === false) {
                if (this.billingorInvoiceForm.costPlusType === 'Cost Plus') {
                    const materialAmount = this.billingorInvoiceForm.materialValue === null ? this.billingorInvoiceForm.materialCost : this.billingorInvoiceForm.materialCostPlus;
                    const misChargesAmount = this.billingorInvoiceForm.miscChargesValue === null ? this.billingorInvoiceForm.miscChargesCost : this.billingorInvoiceForm.miscChargesCostPlus;
                    const laborOverHeadAmount = this.billingorInvoiceForm.laborOverHeadValue === null ? this.billingorInvoiceForm.laborOverHeadCost : this.billingorInvoiceForm.laborOverHeadCostPlus;
                    const freightCostPlusAmount = this.billingorInvoiceForm.freightValue === null ? this.billingorInvoiceForm.freightCost : this.billingorInvoiceForm.freightCostPlus;
                    this.billingorInvoiceForm.grandTotal = this.formateCurrency((Number(materialAmount.toString().replace(/\,/g,''))) + (Number(misChargesAmount.toString().replace(/\,/g,''))) + (Number(laborOverHeadAmount.toString().replace(/\,/g,''))) + (Number(freightCostPlusAmount.toString().replace(/\,/g,''))));
                } else {
                    const materialAmount = this.billingorInvoiceForm.materialCostPlus;
                    const misChargesAmount =  this.billingorInvoiceForm.miscChargesCostPlus;
                    const laborOverHeadAmount =  this.billingorInvoiceForm.laborOverHeadCostPlus;
                    const freightCostPlusAmount =  this.billingorInvoiceForm.freightCostPlus;
                    this.billingorInvoiceForm.grandTotal = this.formateCurrency((Number(materialAmount.toString().replace(/\,/g,''))) + (Number(misChargesAmount.toString().replace(/\,/g,''))) + (Number(laborOverHeadAmount.toString().replace(/\,/g,''))) + (Number(freightCostPlusAmount.toString().replace(/\,/g,''))));
                }
            } else {
                const totalWorkOrderCostPlus = this.billingorInvoiceForm.totalWorkOrder === null ? this.billingorInvoiceForm.totalWorkOrderCost : this.billingorInvoiceForm.totalWorkOrderCostPlus;
                this.billingorInvoiceForm.grandTotal = this.formateCurrency(Number(totalWorkOrderCostPlus.toString().replace(/\,/g,'')));
            }
        }
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }
    GenerateInvoice() {
        this.saveWorkOrderBilling(InvoiceTypeEnum.Billed);
    }
    updateWorkOrderBilling() { }
    saveWorkOrderBilling(invoiceStatus: InvoiceTypeEnum) {
        let billingItems: BillingItems[] = [];
        this.billingList.filter(a => {
            for (let i = 0; i < a.workOrderBillingInvoiceChild.length; i++) {
                if (i==0) 
                {
                    var p = new BillingItems;
                    p.workOrderShippingId = a.workOrderBillingInvoiceChild[i].workOrderShippingId;
                    this.workOrderShippingId=a.workOrderBillingInvoiceChild[i].workOrderShippingId;
                    p.noOfPieces = a.qtyToBill;
                    this.ItemMasterId = a.workOrderBillingInvoiceChild[i].itemMasterId;
                    p.workOrderPartId = a.workOrderBillingInvoiceChild[i].workOrderPartId;

                    billingItems.push(p);
                }
            }
        });

        // if (this.isMultipleSelected) {
        //     this.billingList.filter(a => {
        //         for (let i = 0; i < a.workOrderBillingInvoiceChild.length; i++) {
        //             if (i==0) 
        //             {
        //                 var p = new BillingItems;
        //                 p.workOrderShippingId = a.workOrderBillingInvoiceChild[i].workOrderShippingId;
        //                 this.workOrderShippingId=a.workOrderBillingInvoiceChild[i].workOrderShippingId;
        //                 p.noOfPieces = a.workOrderBillingInvoiceChild[i].qtyToBill;
        //                 p.workOrderPartId = a.workOrderBillingInvoiceChild[i].workOrderPartId;

        //                 billingItems.push(p);
        //             }
        //         }
        //     });
        // }
        // else {
        //     var p = new BillingItems;
        //     p.workOrderShippingId = this.workOrderShippingId;
        //     p.noOfPieces = this.selectedQtyToBill;
        //     p.workOrderPartId = this.selectedPartNumber;

        //     billingItems.push(p);
        // }
        
        let billingorInvoiceFormTemp = JSON.parse(JSON.stringify(this.billingorInvoiceForm));
        this.billingorInvoiceForm.soldToCustomerId = billingorInvoiceFormTemp.soldToCustomerId['customerId'];
        this.billingorInvoiceForm.shipToCustomerId = billingorInvoiceFormTemp.shipToCustomerId['customerId'];
        this.billingorInvoiceForm.shipToSiteId = billingorInvoiceFormTemp.shipToSiteId;
        this.billingorInvoiceForm.soldToSiteId = billingorInvoiceFormTemp.soldToSiteId;
        this.billingorInvoiceForm.createdDate = new Date();
        this.billingorInvoiceForm.updatedDate = new Date();
        this.billingorInvoiceForm.createdBy = this.userName;
        this.billingorInvoiceForm.updatedBy = this.userName;
        this.billingorInvoiceForm.workOrderId = this.workOrderId;
        this.billingorInvoiceForm.workFlowWorkOrderId= this.workFlowWorkOrderId;
        this.billingorInvoiceForm.workOrderPartNoId =this.workOrderPartNumberId;
        this.billingorInvoiceForm.itemMasterId =this.ItemMasterId;
        this.billingorInvoiceForm.masterCompanyId= this.authService.currentUser.masterCompanyId;
        this.billingorInvoiceForm.isActive= true;
        this.billingorInvoiceForm.isDeleted= false;
        this.billingorInvoiceForm.customerId = billingorInvoiceFormTemp.customerId;
        this.billingorInvoiceForm.invoiceNo = "test";
        this.billingorInvoiceForm.invoiceStatus = invoiceStatus == InvoiceTypeEnum.Billed ? 'Billed' : (invoiceStatus == InvoiceTypeEnum.Reviewed ? 'Reviewed' : 'Invoiced');
        this.billingorInvoiceForm.customerId = editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId),
        this.billingorInvoiceForm.employeeId= editValueAssignByCondition('value', this.savedWorkOrderData.employeeId),
        this.billingorInvoiceForm.billingItems = billingItems;
        this.billingorInvoiceForm.workOrderShippingId = this.workOrderShippingId;
        this.billingorInvoiceForm.invoiceTime =moment(billingorInvoiceFormTemp.invoiceTime, ["h:mm A"]).format("HH:mm")
        this.isSpinnerVisible = true;
        this.workOrderService.createBillingByWorkOrderId(this.billingorInvoiceForm).subscribe(result => {
            this.alertService.showMessage(
                this.moduleName,
                'Saved Work Order Billing Succesfully',
                MessageSeverity.success
            );
            this.getBillingList();
            this.showBillingForm = false;
            this.workOrderId = result[0].workOrderId;
            this.workOrderBillingInvoiceId = result[0].woBillingInvoicingId;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }
    createModeData() {
        this.loginDetailsForCreate = {
            masterCompanyId: this.authService.currentUser.masterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: new Date(),
            updatedDate: new Date(),
            isActive: true,
            isDeleted: false
        }
    }

    PrintInvoice() {
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderBillingInvoicingById(this.workOrderBillingInvoiceId).subscribe(result => {
            let billingInvoiceData = result[0];
            this.print();
            billingInvoiceData[0].invoiceStatus = 'Reviewed';
            this.workOrderService.UpdateWorkOrderBillingInvoicing(this.workOrderBillingInvoiceId, billingInvoiceData[0]).subscribe(result => {
                this.getBillingList();
                this.close();
                this.isSpinnerVisible = false;
            });
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    PrintPostInvoice() {
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderBillingInvoicingById(this.workOrderBillingInvoiceId).subscribe(result => {
            let billingInvoiceData = result[0];
            this.print();

            billingInvoiceData[0].invoiceStatus = 'Invoiced';
            this.workOrderService.UpdateWorkOrderBillingInvoicing(this.workOrderBillingInvoiceId, billingInvoiceData[0]).subscribe(result => {
                this.getBillingList();
                this.close();
                this.isSpinnerVisible = false;
            });
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    PrintInvoiced() {
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderBillingInvoicingById(this.workOrderBillingInvoiceId).subscribe(result => {
            this.print();
            this.close();
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

  
resetallcost()
{

    this.billingorInvoiceForm.totalWorkOrderValue = null;
    this.billingorInvoiceForm.materialValue = null;
    this.billingorInvoiceForm.laborOverHeadValue = null;
    this.billingorInvoiceForm.miscChargesValue = null;
    this.billingorInvoiceForm.freightValue = null;
    this.billingorInvoiceForm.totalWorkOrderCostPlus = this.formateCurrency(this.billingorInvoiceForm.totalWorkOrderCost);
    this.billingorInvoiceForm.materialCostPlus = this.formateCurrency(this.billingorInvoiceForm.materialCost);
    this.billingorInvoiceForm.laborOverHeadCostPlus = this.formateCurrency(this.billingorInvoiceForm.laborOverHeadCost);
    this.billingorInvoiceForm.miscChargesCostPlus = this.formateCurrency(this.billingorInvoiceForm.miscChargesCost);
    this.billingorInvoiceForm.freightCostPlus = this.formateCurrency(this.billingorInvoiceForm.freightCost);
}

    onChangeWOCostPlus() {
        if (this.billingorInvoiceForm.totalWorkOrder) {
            this.billingorInvoiceForm.grandTotal = this.formateCurrency(Number(this.billingorInvoiceForm.totalWorkOrderCostPlus.toString().replace(/\,/g,'')));
        }
        this.billingorInvoiceForm.totalWorkOrderCostPlus = this.formateCurrency(this.billingorInvoiceForm.totalWorkOrderCostPlus);
    }
    onChangeMaterialCostPlus() {
        this.billingorInvoiceForm.materialCostPlus = this.formateCurrency(this.billingorInvoiceForm.materialCostPlus);
    }
    onChangeLaborOHCostPlus() {
        this.billingorInvoiceForm.laborOverHeadCostPlus = this.formateCurrency(this.billingorInvoiceForm.laborOverHeadCostPlus);
    }
    onChangeMiscChCostPlus() {
        this.billingorInvoiceForm.miscChargesCostPlus = this.formateCurrency(this.billingorInvoiceForm.miscChargesCostPlus);
    }
    onChangeFreightCostPlus() {
        this.billingorInvoiceForm.freightCostPlus = this.formateCurrency(this.billingorInvoiceForm.freightCostPlus);
    }
    async getSiteNamesByShipCustomerId(customerId, siteid) {
        this.clearShipToAddress();
        const AddressType = 'Ship';
        const billUsertype = 1;

        await this.commonService.getworkorderaddressdetailsbyuser(billUsertype, customerId, AddressType, siteid).subscribe(res => {
            if (res) {
                this.shipCustomerShippingOriginalData = res;
                this.shipCustomerSiteList = res;
                if (siteid > 0) {
                    this.shipCustomerShippingOriginalData.forEach(
                        x => {
                            if (x.siteID == siteid) {
                                 this.billingorInvoiceForm.shipToSiteId = x.siteID;
                                this.setShipToAddress();
                            }
                        }
                    )
                } else {
                    this.shipCustomerShippingOriginalData.forEach(
                        x => {
                            if (x.isPrimary) {
                                this.billingorInvoiceForm.shipToSiteId = x.siteID;
                                this.setShipToAddress();
                            }
                        }
                    )
                }
            }
        }, err => {
            this.errorHandling(err);
        });
    }

    setShipToAddress() {
        this.shipCustomerSiteList.forEach(site => {
            if (site.siteID == this.billingorInvoiceForm.shipToSiteId) {
                this.shipCustomerAddress = new AddressModel();
                this.shipCustomerAddress.line1 = site.address1;
                this.shipCustomerAddress.line2 = site.address2;
                this.shipCustomerAddress.country = site.country;
                this.shipCustomerAddress.postalCode = site.postalCode;
                this.shipCustomerAddress.stateOrProvince = site.stateOrProvince;
                this.shipCustomerAddress.city = site.city;
                this.billingorInvoiceForm.shipToAttention =site.attention;
            }
        });
    }

    clearShipToAddress() {
        this.shipCustomerSiteList = [];
        this.shipCustomerAddress = new AddressModel();
    }

    setSoldToAddress() {
        this.siteList.forEach(site => {
            if (site.siteID == this.billingorInvoiceForm.soldToSiteId) 
            {this.soldCustomerAddress = new AddressModel();
                this.soldCustomerAddress.line1 = site.address1;
                this.soldCustomerAddress.line2 = site.address2;
                this.soldCustomerAddress.country = site.country;
                this.soldCustomerAddress.postalCode = site.postalCode;
                this.soldCustomerAddress.stateOrProvince = site.stateOrProvince;
                this.soldCustomerAddress.city = site.city;
            }
        });
    }

    getSiteNames(customerId, siteid) {
        const AddressType = 'Bill';
        const billUsertype = 1;

        this.commonService.getworkorderaddressdetailsbyuser(billUsertype, customerId, AddressType, siteid)
            .subscribe(
                res => {
                    this.siteList = res;

                    if (siteid > 0) 
                    {
                        this.siteList.forEach(
                            x => {
                                if (x.siteID == siteid) {
                                     this.billingorInvoiceForm.soldToSiteId = x.siteID;
                                    this.setSoldToAddress();
                                }
                            }
                        )
                    } 
                    else 
                    {
                        this.siteList.forEach(
                            x => {
                                if (x.isPrimary) {
                                    this.billingorInvoiceForm.soldToSiteId = x.siteID;

                                    this.setSoldToAddress();
                                }
                            }
                        )
                    }
                }, err => {
                    this.errorHandling(err);
                });
    }
    
    moduleName: any = '';
    errorHandling(err) {
        if (err['error']['errors']) {
            err['error']['errors'].forEach(x => {
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else {
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
    handleError(err) {
        if (err['error']['errors']) {
            err['error']['errors'].forEach(x => {
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else {
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }

    pageIndexChange($event) {}
    selectedPartNumber: any;
    workOrderWorkFlowOriginalData: any;
    tmchange(){}
    markupChanged(matQuotation, row) {}

    parseToInt(str : any) {
        return Number(str);
    }

    print(): void {
        let printContents, popupWin;
        printContents = document.getElementById('woInvoice').innerHTML;
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
               <title>Print tab</title>        
               <style>
               div {
                white-space: normal;
              }
              table { page-break-after:auto }
    tr    { page-break-inside:avoid; page-break-after:auto }
    td    { page-break-inside:avoid; page-break-after:auto }
    thead { display: table-row-group; }
    tfoot { display:table-footer-group }
                 @media print
                 {
                   @page {
                   margin-top: 0;
                   margin-bottom: 0;
                   size: auto;  margin: 0mm; 
                   size: landscape
                   }
                 
                 } 
                 span {
                   /* font-weight: normal; */
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   font-size: 10.5px !important;
                   font-weight: 700;
                 }
                             table {font-size:12px !important}        
                 table thead { background: #808080;}    
                  
                 table, thead, td {
                 border: 1px solid black;
                 border-collapse: collapse;
               } 
               table, thead, th {
                 border: 1px solid black;
                 border-collapse: collapse;
               } 
               .border-none{
                 border:none;
               }
                 table thead tr th 
                 {
                   //   background: #0d57b0 !important;
                     padding: 5px!important;color: #fff;letter-spacing: 0.3px;font-weight:bold;
                     font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                      font-size: 12.5px;text-transform: capitalize; z-index: 1;} 
                 table tbody{   overflow-y: auto; max-height: 500px;  }
                 table tbody tr td{ background: #fff;
                    padding: 2px;line-height: 22px;
                    height:22px;color: #333;
                    border-right:1px solid black !important;
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-weight;normal;
                   font-size: 12.5px !important;max-width:100%; letter-spacing: 0.1px;border:0}
                 h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: normal; width: 100%; margin: 0;}
                 
                 .very-first-block {position: relative; height:auto;border-right:1px solid black; min-height: 1px; float: left;padding-right: 2px;padding-left: 2px;
                   width: 50%;}
                 .first-block-name{margin-right: 20px} 
                 .first-block-sold-to {
                   position: relative;
                   min-height: 82px;
                   height: auto;
                   float: left;
                   padding-bottom:5px;
                   padding-right: 2px;
                   border-right: 1px solid black;
                   background: #fff;
                   width: 100%;
                   margin-top:-2px
                  
                 }
                 
                 .first-block-ship-to {
                   position: relative;
                   min-height: 80px;
                   padding-bottom:5px;
                   height: auto;
                   padding-right: 2px;
                   border-right: 1px solid black;
                   background: #fff;
                   width: 100%;
                 
                 }
                 
                 .first-block-sold {
                   position: relative;
                   min-height: 141px;
                   height:auto;
                   float: left;
                   border-right:1px solid black;
                   padding-right: 2px;
                   padding-left: 2px;
                   margin-left:-1px;
                   width: 50%;
                 }
                 
                 .first-block-ship {
                   position: relative;
                   min-height: 1px;
                   float: right;
                   padding-right: 2px;
                  
                   width: 49%;
                 }
                 .print-border-bottom{
                     border-bottom:1px solid black;
                 }
                 .address-block {
                   position: relative;
                   min-height: 1px;
                   float: left;
                   height:auto;
                   padding-right: 2px;
                   // border: 1px solid black;
                   width: 100%;
                   padding-left: 2px;
                 }
                 
                 .first-block-address {
                   margin-right: 20px;
                   text-align: left
                 }
                 
                 
                 .second-block {
                   position: relative;
                   min-height: 1px;
                   float: left;
                   padding-right: 2px;
                   width: 42%;
                 height:auto;
                   // border-left:1px solid black;
                     // margin-left: 16%;
                   padding-left: 2px;
                   box-sizing: border-box;
                 }
                 
                 .second-block-div {
                   margin: 2px 0;
                   position: relative;
                   display: flex;
                 
                   min-height: 1px;
                   height:auto
                  
                   width: 100%;
                 }
                 .label{
                   font-weight:500;
                 }
                 
                 .second-block-label {
                   position: relative;
                   min-height: 1px;
                   float: left;
                   padding-right: 2px;
                   padding-left: 2px;
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                       font-size: 10.5px !important;
                       font-weight: 700;
                   
                       width: 38.33333333%;
                       text-transform: capitalize;
                       margin-bottom: 0;
                       text-align: left;
                 }
                 
                 .clear {
                   clear: both;
                 }
                 
                 .form-div {
                   // top: 6px;
                   position: relative;
                   font-weight: normal;
                   font-size:12.5
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   // margin-top: 10px;
                  
                 }
                 span {
                   font-weight: normal;
                   font-size: 12.5px !important;
               }
                 
                 .image {
                   border: 1px solid #000;
                   // padding: 5px;
                   width: 100%;
                   display: block;
                 }
                 
                 .logo-block {
                   margin: auto;
                   text-align: center
                 }
                 
                 .pdf-block {
                   width: 800px;
                   margin: auto;
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   font-weight:normal;
                   border: 1px solid #ccc;
                   padding: 25px 15px;
                 }
                 
                 .picked-by {
                   position: relative;
                   float: left;
                   width: 48%;
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   font-size: 10.5px !important;
                   font-weight: 700;
                 }
                 
                 .confirmed-by {
                   position: relative;
                   float: right;
                   width: 48%;
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   font-size: 10.5px !important;
                   font-weight: 700;
                 }
                 
                 .first-part {
                   position: relative;
                   display: inline;
                   float: left;
                   width: 50%
                 }
                 
                 .seond-part {
                   position: relative;
                   display: flex;
                   float: right;
                   width: 24%
                 }
                 
                 .input-field-border {
                   width: 88px;
                   border-radius: 0px !important;
                   border: none;
                   border-bottom: 1px solid black;
                 }
                 
                 .border-transparent {
                   border-block-color: white;
                 }
                 
                 .pick-ticket-header {
                   border: 1px solid black;
                   text-align: center;
                   background: #0d57b0 !important;
                   color: #fff !important;
                   -webkit-print-color-adjust: exact;
                 }
                 
                 .first-block-label {
                   position: relative;
                   min-height: 1px;
                   float: left;
                   padding-right: 2px;
                   padding-left: 2px;
                   // width: 38.33333333%;
                   font-size:10.5px !important;
                 
                   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   font-weight: 700;
               
                   text-transform: capitalize;
                   margin-bottom: 0;
                   text-align: left;
                 }
                 
                 .very-first-block {
                   position: relative;
                   min-height: 159px;
                   float: left;
                   height:auto;
                  border-right:1px solid black;
                   padding-right: 2px;
                   padding-left: 2px;
                   width: 57% !important;
                 }
                 
                 .logo {
                   padding-top: 10px;
                       // height:70px;
                       // width:220px;
                       height:auto;
                       max-width:100%;
                       padding-bottom:10px;
                 }
                 
                 .sold-block-div {
                   margin: 2px 0;
                   position: relative;
                   display: flex;
                   min-height: 1px;
                   width: 100%;
                 }
                 
                 .ship-block-div {
                   margin: 2px 0;
                   position: relative;
                   display: flex;
                   min-height: 1px;
                   width: 100%;
                 }
                 .first-block-sold-bottom{
                   border-bottom: 1px solid black !important;
                       position:relative;
                       min-height:1px;
                       height:auto;
                       width:100%;
                       float:left;
                         // margin-top: -2px;
                        // min-height: 120px;
                 }
                 .print-table{
                   width:100%;
                 }
                 .parttable th {
                   background: #fff !important;
                   color: #000 !important;
                   -webkit-print-color-adjust: exact;
                 }
                 .border-bottom{
                   border-bottom:1px solid black !important;
                 }
                 .table-margins{
                       margin-top:-1px;margin-left:0px
                     }
                 .invoice-border{
                   border-bottom: 1px solid;
                       position:relative;
                         // min-height: 119px;
                         min-height:1px;
                         height: auto;
                         width:100%;
                       float:left;}
                 
                             </style>


            </head>
        <body onload="window.print();window.close()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }
    setEditArray:any=[];
    private CurrencyData() {
 
        this.setEditArray=[];
        this.setEditArray.push(0);
        const strText='';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code',strText,true,20,this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.currencyList = res;
        
    })
}
}

export class WorkOrderBillingAndInvoicing {
    woBillingInvoicingId: number;
    workOrderId: number;
    workOrderPartId: number;
    itemMasterId: number;
    invoiceTypeId: number;
    invoiceNo: string;
    customerId: number;
    masterCompanyId: number;
    invoiceDate: Date;
    printDate: Date;
    openDate: Date;
    noofPieces: number;
    revType: string;
    currencyId: number;
    soldToCustomerId: number;
    soldToSiteId: number;
    soldToCustomerName: string;
    shipToCustomerId: number;
    shipToSiteId: number;
    shipToAttention: string;
    shipViaId: number;
    wayBillRef: string;
    tracking: string;
    availableCredit: number;
    creditLimit: number;
    billToCustomerId: number;
    billToSiteId: number;
    billToAttention: string;
    employeeName: string;
    salesPersonId: number;
    salesPerson: string;
    customerRef: string;
    typeId: number;
    workOrderType: string;
    invoiceStatus: string;
    qtyToBill: number;
    createdBy: string;
    updatedBy: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDate: Date;
    updatedDate: Date;
    billingItems: any;
    managementStructureId:any;
}

export class BillingItems {
    workOrderShippingId: number;
    noOfPieces: number;
    workOrderPartId: number;
}