import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
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

 
@Component({
    selector: 'app-work-order-billing',
    templateUrl: './work-order-billing.component.html',
    styleUrls: ['./work-order-billing.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderBilling component*/

export class WorkOrderBillingComponent implements OnInit {
    // @Input() workOrderMaterialList;
    @Input() quotestatusofCurrentPart;
    @Input() employeesOriginalData;
    @Input() billingorInvoiceForm;
    @Input() savedWorkOrderData;
    // @Input() currencyList;
    @Input() isEditBilling = false;
    @Input() workOrderQuoteId = 0;
    @Input() taskList: any = [];
    @Input() quoteExclusionList;
    @Input() quoteMaterialList;
    @Input() quoteFreightsList;
    @Input() quoteChargesList;
    @Input() workOrderChargesList;

    @Input() quoteLaborList;
    // @Input() legalEntityList;
    @Input() buildMethodDetails: any = {};
    @Input() isViewMode: boolean = false;
    @Output() saveWOBilling = new EventEmitter();
    @Output() updateWOBilling = new EventEmitter();
    @Input() workFlowWorkOrderId = 0;
    @Input() workFlowId;
    @Input() labordata: any;
    @Input() workOrderLaborList: any;
    @Input() isbillingNotCreated = false;
    overAllMarkup: any;
    employeeList: any;
    workOrderPartNumberId:number
    customerNamesList: Object;
    soldCustomerSiteList = [];
    shipCustomerSiteList = [];
    siteList: any = [];
    shipToAttention;
    soldCustomerAddress: any = new AddressModel();
    shipCustomerAddress: any = new AddressModel();
    showBillingForm: boolean = false;
    isMultipleSelected: boolean = false;
    workOrderShippingId:number;
    selectedQtyToBill:number;
    isSpinnerVisible = false;
    loginDetailsForCreate:any;
    managementStructure = {
        companyId: null,
        buId: null,
        divisionId: null,
        departmentId: null,
    }
    soldCustomerShippingOriginalData: any[];
    shipCustomerShippingOriginalData: any[];
    workOrderId: any;
    shipViaList: Object;
    customerId: any;
    legalEntityList: any=[];
    businessUnitList: any;
    divisionList: any;
    departmentList: any;
    markUpList: any;
    // numberData = [{ label: 1, value: 1 }];
    invoiceTypeList: any;
    shipViaData: any;
    isView: boolean = false;
    workFlowObject = {
        materialList: [],
        equipments: [],
        charges: [],
        exclusions: []
    }
    isQuote: boolean = true;
    labor = new WorkOrderLabor();
    markupList: any;
    costPlusType: any;
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
        { field: 'stockType', header: 'Stock Type' },
        { field: 'unitCost', header: 'Unit Cost', align: 1 },
        { field: 'extendedCost', header: 'Extended Cost', align: 1 }
    ];
    colums = [
        { field: 'taskName', header: 'Task' },
        { field: 'vendorName', header: 'Vendor Name' },
        { field: 'quantity', header: 'Qty' },
        // { field: 'roNumberId', header: 'RO Num' },
        { field: 'refNum', header: 'Ref Num' },
        // { field: 'invoiceNum', header: 'Invoice Num' },
        { field: 'chargeType', header: 'Charge Type' },
        { field: 'description', header: 'Description' },
        { field: 'unitCost', header: 'Unit Cost' },
        { field: 'extendedCost', header: 'Extented Cost' },
        // { field: 'unitPrice', header: 'Unit Price' },
        // { field: 'extendedPrice', header: 'Extended Price' },
    ];
    unitOfMeasuresList: any;
    conditions: any;
    currencyList:any=[];
    constructor(private commonService: CommonService, private workOrderService: WorkOrderService,
        private customerService: CustomerService, private quoteService: WorkOrderQuoteService, private alertService: AlertService,   private authService: AuthService,

    ) {

    }
    ngOnInit() {

        console.log("status", this.quotestatusofCurrentPart)
        this.initColumns();
        if (this.workOrderQuoteId == 0) {
            // this.workOrderChargesList();
        }
        if (this.buildMethodDetails) {
            if (this.buildMethodDetails['materialBuildMethod'] != undefined || this.buildMethodDetails['materialBuildMethod'] != null) {
                this.costPlusType = this.buildMethodDetails['materialBuildMethod'].toString();
            }
        }
        // if(this.buildMethodDetails){
        //     this.costPlusType = this.buildMethodDetails['materialBuildMethod'].toString();
        // }
        const data = this.billingorInvoiceForm;
        this.workOrderId = this.savedWorkOrderData.workOrderId;
        this.workOrderPartNumberId = this.savedWorkOrderData.woPartNoId;
        this.getBillingList();
        this.getEmployeeList(this.workOrderId);
        this.customerId = editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId);
        // this.getCustomerDetailsFromHeader();
        this.getShipViaByCustomerId();
        // this.getLegalEntity();
        // this.generateNumbers();
        this.getPercentageList();
        this.getInvoiceList();
        this.calculateGrandTotal();
        this.resetOtherOptions();
        if (this.isEditBilling) {
            if (data.soldToCustomerId.customerId == data.shipToCustomerId.customerId) {
                this.getSiteNames(this.customerId,data.soldToCustomerId);
            }
            else {
                this.getSiteNames(this.customerId,data.soldToCustomerId);
                this.getSiteNamesByShipCustomerId(this.customerId,data.shipToCustomerId);
            }
            this.bindManagementStructure(data);
            if (this.billingorInvoiceForm.soldToCustomerId) {
                this.soldCustomerAddress = {
                    city: data.city,
                    country: data.country,
                    line1: data.line1,
                    line2: data.line2,
                    postalCode: parseInt(data.postalCode),
                    stateOrProvince: data.stateOrProvince
                }
            }
            if (this.billingorInvoiceForm.shipToCustomerId) {
                this.shipCustomerAddress = {
                    city: data.shipToCity,
                    country: data.country,
                    line1: data.line1,
                    line2: data.shipToLine2,
                    postalCode: parseInt(data.shipToPostalCode),
                    stateOrProvince: data.shipToState
                }
            }
        } else {
            if (this.billingorInvoiceForm.soldToCustomerId && this.billingorInvoiceForm.shipToCustomerId && (this.billingorInvoiceForm.soldToCustomerId.customerId == this.billingorInvoiceForm.shipToCustomerId.customerId)) {
                this.getSiteNames(this.customerId,data.soldToCustomerId);
            }
            else {
                if (this.billingorInvoiceForm.soldToCustomerId) {
                    this.getSiteNames(this.customerId,this.billingorInvoiceForm.soldToCustomerId);
                   // this.getSiteNamesBySoldCustomerId(this.billingorInvoiceForm.soldToCustomerId);
                }
                if (this.billingorInvoiceForm.shipToCustomerId) {
                    this.getSiteNamesByShipCustomerId(this.customerId,this.billingorInvoiceForm.shipToCustomerId);
                }
            }
            this.resetMisCharges();
            this.resetMaterial();
            this.resetLaborOverHead();
            this.calculateTotalWorkOrderCost();
            this.bindManagementStructure(this.billingorInvoiceForm);
        }
        if (this.buildMethodDetails && this.quotestatusofCurrentPart == 'Approved') {
            console.log("material build ngoninit")
            this.billingorInvoiceForm.materialCost = this.buildMethodDetails['materialFlatBillingAmount'] != null ? this.buildMethodDetails['materialFlatBillingAmount'].toFixed(2) : '';
            this.billingorInvoiceForm.laborOverHeadCost = this.buildMethodDetails['laborFlatBillingAmount'] != null ? this.buildMethodDetails['laborFlatBillingAmount'].toFixed(2) : '';
            // this.billingorInvoiceForm.miscChargesCost = (this.buildMethodDetails['chargesFlatBillingAmount'] + this.buildMethodDetails['freightFlatBillingAmount']).toFixed(2);
            this.billingorInvoiceForm.miscChargesCost = (this.buildMethodDetails['chargesFlatBillingAmount'] + this.buildMethodDetails['freightFlatBillingAmount']);
            this.billingorInvoiceForm.miscChargesCost = this.billingorInvoiceForm.miscChargesCost ? this.billingorInvoiceForm.miscChargesCost.toFixed(2) : '';
        }
        this.getCurrencyList();
        this.billingorInvoiceForm.totalWorkOrderValue = 4;
        if (this.quoteMaterialList && this.quoteMaterialList.length > 0) {
            this.overAllMarkup = Number(this.quoteMaterialList[0].headerMarkupId);
        }
        if (this.isbillingNotCreated == true && (this.quotestatusofCurrentPart == "NotApproved" || this.quotestatusofCurrentPart == '')) {
            console.log("billlings", this.quotestatusofCurrentPart)
            this.getbillingCostDataForWoOnly();
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.quoteMaterialList && this.quoteMaterialList.length > 0) {
            this.overAllMarkup = Number(this.quoteMaterialList[0].headerMarkupId);
        }
        this.billingorInvoiceForm = this.billingorInvoiceForm;
        this.calculateGrandTotal();
        if (this.buildMethodDetails && this.quotestatusofCurrentPart == 'Approved') {
            console.log("material build")
            if (this.buildMethodDetails['materialBuildMethod'] != undefined || this.buildMethodDetails['materialBuildMethod'] != null) {
                this.costPlusType = this.buildMethodDetails['materialBuildMethod'].toString();
            }
            this.billingorInvoiceForm.materialCost = this.buildMethodDetails['materialFlatBillingAmount'] != null ? this.buildMethodDetails['materialFlatBillingAmount'].toFixed(2) : '';
            this.billingorInvoiceForm.laborOverHeadCost = this.buildMethodDetails['laborFlatBillingAmount'] != null ? this.buildMethodDetails['laborFlatBillingAmount'].toFixed(2) : '';

            let flatbillingAmount = this.buildMethodDetails['chargesFlatBillingAmount'] ? this.buildMethodDetails['chargesFlatBillingAmount'] : '';
            let freightFlatBillingAmount = this.buildMethodDetails['freightFlatBillingAmount'] ? this.buildMethodDetails['freightFlatBillingAmount'] : '';
            this.billingorInvoiceForm.miscChargesCost = (this.buildMethodDetails['chargesFlatBillingAmount'] + this.buildMethodDetails['freightFlatBillingAmount']);
            this.billingorInvoiceForm.miscChargesCost = this.billingorInvoiceForm.miscChargesCost ? this.billingorInvoiceForm.miscChargesCost.toFixed(2) : '';
        }
        if (!this.isEditBilling) {
            this.resetMisCharges();
            this.resetMaterial();
            this.resetLaborOverHead();
            this.calculateTotalWorkOrderCost();
        }
    }
    
    initColumns() {
        this.headers = [
            { field: "workOrderNumber", header: "WO Num", width: "100px" },
            { field: "partNumber", header: "PN", width: "100px" },
            { field: "partDescription", header: "PN Description", width: "100px" },
            { field: "qtyToBill", header: "Qty Shipped", width: "110px" },
            { field: "qtyBilled", header: "Qty Billed", width: "90px" },
            { field: "qtyRemaining", header: "Qty Remaining", width: "90px" },
            { field: "status", header: "Status", width: "90px" },
        ];
        this.selectedColumns = this.headers;
    }
    getBillingList() {
        this.isSpinnerVisible = true;
        this.workOrderService
            .getBillingInvoiceList(this.workOrderId)
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
       // this.getBillingAndInvoicingForSelectedPart(lastworkOrderPartId, lastworkOrderShippingId);
        this.showBillingForm = true;
    }

    onSelectPartNumber(rowData) {
        if (rowData.workOrderPartId != 0 && rowData.workOrderPartId != 0) {
            this.selectedQtyToBill = rowData.qtyToBill;
            this.partSelected = true;
            this.showBillingForm = true;
            this.isMultipleSelected = false;
            this.workOrderShippingId = rowData.workOrderShippingId;
            //this.getBillingAndInvoicingForSelectedPart(rowData.salesOrderPartId, rowData.salesOrderShippingId);
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
            //this.getAddressById(this.salesOrderId);
            this.getCurrencyList();
            this.getInvoiceList();
           // this.getRevisionTypeList();
            this.getShipViaByCustomerId();
            //this.getCustomerDetails();
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
                this.billingorInvoiceForm.totalWorkOrderCost = res.totalCost;
            }
        },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
    }
    async bindManagementStructure(data) {
        if (data) {
            await this.commonService.getManagementStructureDetails(data.managementStructureId).subscribe(res => {
                this.selectedLegalEntity(res.Level1);
                this.selectedBusinessUnit(res.Level2);
                this.selectedDivision(res.Level3);
                this.selectedDepartment(res.Level4);
                this.managementStructure = {
                    companyId: res.Level1 !== undefined ? res.Level1 : null,
                    buId: res.Level2 !== undefined ? res.Level2 : null,
                    divisionId: res.Level3 !== undefined ? res.Level3 : null,
                    departmentId: res.Level4 !== undefined ? res.Level4 : null,
                }

            },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
        }
    }

    getCurrencyList() {
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'code', '', '').subscribe(
            results => {
                this.currencyList = results
            },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            }
        );
    }


    getEmployeeList(woId) {
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName')
            .subscribe(
                (employeeList: any[]) => {
                    this.employeeList = employeeList;
                    this.employeesOriginalData = employeeList;
                },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                }
            )
    }


    getPercentageList() {
        this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
            this.markUpList = res;
        },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
    }

    getInvoiceList() {
        this.commonService.smartDropDownList('InvoiceType', 'InvoiceTypeId', 'Description').subscribe(res => {
            this.invoiceTypeList = res;
        },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
    }

    getShipViaByCustomerId() {
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name')
            .subscribe(
                (res) => {
                    this.shipViaList = res;
                },
                err => {
                    // this.isSpinnerVisible = false;
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


    filterCustomerName(event) {
        const value = event.query.toLowerCase()
        this.commonService.getCustomerNameandCode(value, 1).subscribe(res => {
            this.customerNamesList = res;
        },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
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
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
    }

    changeOfSoldSiteName(value) {
        debugger;
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
    // async getSiteNamesByShipCustomerId(object) {
    //     const { customerId } = object;
    //     await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
    //         this.shipCustomerShippingOriginalData = res[0];
    //         this.shipCustomerSiteList = res[0].map(x => {
    //             return {
    //                 label: x.siteName,
    //                 value: x.customerDomensticShippingId
    //             }
    //         });
    //         this.shipCustomerShippingOriginalData.forEach(
    //             x => {
    //                 if (x.isPrimary) {
    //                     this.billingorInvoiceForm.shipToSiteId = x.customerDomensticShippingId
    //                     this.changeOfShipSiteName(x.customerDomensticShippingId);
    //                 }
    //             }
    //         )
    //     },
    //         err => {
    //             // this.isSpinnerVisible = false;
    //             this.errorHandling(err);
    //         })
    // }
    changeOfShipSiteName(value) {
        debugger;
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

    selectedLegalEntity(legalEntityId) {
        if (legalEntityId) {
            this.billingorInvoiceForm.managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).subscribe(res => {
                this.businessUnitList = res;
            },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
        }

    }
    selectedBusinessUnit(businessUnitId) {
        if (businessUnitId) {
            this.billingorInvoiceForm.managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).subscribe(res => {
                this.divisionList = res;
            },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
        }

    }
    selectedDivision(divisionUnitId) {
        if (divisionUnitId) {
            this.billingorInvoiceForm.managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).subscribe(res => {
                this.departmentList = res;
            },
                err => {
                    // this.isSpinnerVisible = false;
                    this.errorHandling(err);
                })
        }

    }
    selectedDepartment(departmentId) {
        if (departmentId) {
            this.billingorInvoiceForm.managementStructureId = departmentId;
        }
    }

    resetOtherOptions() {
        this.billingorInvoiceForm.totalWorkOrderValue = null;
        this.billingorInvoiceForm.totalWorkOrderCostPlus = 0.00;

        if (this.billingorInvoiceForm.totalWorkOrder === true) {
            this.resetMisCharges();
            this.resetMaterial();
            this.resetLaborOverHead();
            this.calculateTotalWorkOrderCost();

        }
    }

    calculateTotalWorkOrderCost() {
        this.sumOfMaterialList();
        this.sumofCharges();
        this.sumofLaborOverHead();
        if (this.billingorInvoiceForm) {
            this.billingorInvoiceForm.totalWorkOrderCost = (Math.round(this.billingorInvoiceForm.materialCost) + Math.round(this.billingorInvoiceForm.miscChargesCost) + Math.round(this.billingorInvoiceForm.laborOverHeadCost)).toFixed(2);
            this.calculateTotalWorkOrderCostPlus(0);
        }
    }

    calculateTotalWorkOrderCostPlus(value) {
        const materialCostPlus = Number(this.billingorInvoiceForm.materialCost) + ((Number(this.billingorInvoiceForm.materialCost) * Number(value)) / 100)
        const misChargeCostPlus = Number(this.billingorInvoiceForm.miscChargesCost) + ((Number(this.billingorInvoiceForm.miscChargesCost) * Number(value)) / 100)
        const laborOverHeadCostPlus = Number(this.billingorInvoiceForm.laborOverHeadCost) + ((Number(this.billingorInvoiceForm.laborOverHeadCost) * Number(value)) / 100);
        this.billingorInvoiceForm.totalWorkOrderCostPlus = Math.round(Math.round(materialCostPlus) + Math.round(misChargeCostPlus) + Math.round(laborOverHeadCostPlus)).toFixed(2);
        // this.calculateGrandTotal();
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



    sumOfMaterialList() {
        console.log("material build sumOfMaterialList", this.billingorInvoiceForm)
        // this.billingorInvoiceForm.materialCost = this.quoteMaterialList.reduce((acc, x) => acc + x.billingAmount, 0).toFixed(2);
        if (this.billingorInvoiceForm && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.materialCost = (this.buildMethodDetails) ? this.buildMethodDetails['materialFlatBillingAmount'] : 0.00;
        }
    }
    calculateMaterialCostPlus(value) {
        if (this.billingorInvoiceForm) {
            this.billingorInvoiceForm.materialCostPlus = Math.round(Number(this.billingorInvoiceForm.materialCost) + ((Number(this.billingorInvoiceForm.materialCost) * Number(value)) / 100)).toFixed(2);
        }
        // this.calculateGrandTotal();
    }
    sumofLaborOverHead() {
        if (this.billingorInvoiceForm && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.laborOverHeadCost = (this.buildMethodDetails) ? this.buildMethodDetails['laborFlatBillingAmount'] : 0.00;
        }
    }
    calculateLaborOverHeadCostPlus(value) {
        if (this.billingorInvoiceForm) {
            this.billingorInvoiceForm.laborOverHeadCostPlus = Math.round(Number(this.billingorInvoiceForm.laborOverHeadCost) + ((Number(this.billingorInvoiceForm.laborOverHeadCost) * Number(value)) / 100)).toFixed(2);
        }
    }


    sumofCharges() {
        if (this.billingorInvoiceForm && this.quotestatusofCurrentPart == 'Approved') {
            this.billingorInvoiceForm.miscChargesCost = (this.buildMethodDetails) ? this.buildMethodDetails.chargesFlatBillingAmount : 0.00;
        }
    }
    calculateMiscChargesCostPlus(value) {
        if (this.billingorInvoiceForm) {
            this.billingorInvoiceForm.miscChargesCostPlus = Math.round(Number(this.billingorInvoiceForm.miscChargesCost) + ((Number(this.billingorInvoiceForm.miscChargesCost) * Number(value)) / 100)).toFixed(2);
        }
    }
    calculateGrandTotal() {
        if (this.billingorInvoiceForm) {
            if (this.billingorInvoiceForm.totalWorkOrder === false) {
                if (this.billingorInvoiceForm.costPlusType === 'Cost Plus') {
                    const materialAmount = this.billingorInvoiceForm.materialValue === null ? this.billingorInvoiceForm.materialCost : this.billingorInvoiceForm.materialCostPlus;
                    const misChargesAmount = this.billingorInvoiceForm.miscChargesValue === null ? this.billingorInvoiceForm.miscChargesCost : this.billingorInvoiceForm.miscChargesCostPlus;
                    const laborOverHeadAmount = this.billingorInvoiceForm.laborOverHeadValue === null ? this.billingorInvoiceForm.laborOverHeadCost : this.billingorInvoiceForm.laborOverHeadCostPlus;
                    this.billingorInvoiceForm.grandTotal = (Math.round(materialAmount) + Math.round(misChargesAmount) + Math.round(laborOverHeadAmount)).toFixed(2);
                } else {
                    const materialAmount = this.billingorInvoiceForm.material ? this.billingorInvoiceForm.materialCostPlus : this.billingorInvoiceForm.materialCost;
                    const misChargesAmount = this.billingorInvoiceForm.laborOverHead ? this.billingorInvoiceForm.miscChargesCostPlus : this.billingorInvoiceForm.miscChargesCost;
                    const laborOverHeadAmount = this.billingorInvoiceForm.miscCharges ? this.billingorInvoiceForm.laborOverHeadCostPlus : this.billingorInvoiceForm.laborOverHeadCost;
                    this.billingorInvoiceForm.grandTotal = (Math.round(materialAmount) + Math.round(misChargesAmount) + Math.round(laborOverHeadAmount)).toFixed(2);
                }
            } else {
                const totalWorkOrderCostPlus = this.billingorInvoiceForm.totalWorkOrder === null ? this.billingorInvoiceForm.totalWorkOrderCost : this.billingorInvoiceForm.totalWorkOrderCostPlus;
                this.billingorInvoiceForm.grandTotal = Math.round(totalWorkOrderCostPlus).toFixed(2);
            }
        }

    }



    // saveWorkOrderBilling() {
    //     this.saveWOBilling.emit(this.billingorInvoiceForm);

    //     // this.getQuoteCostingData();
    // }

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
        debugger;
        let billingItems: BillingItems[] = [];

        if (this.isMultipleSelected) {
            this.billingList.filter(a => {
                for (let i = 0; i < a.workOrderBillingInvoiceChild.length; i++) {
                    if (a.workOrderBillingInvoiceChild[i].selected == true) {
                        var p = new BillingItems;
                        p.workOrderShippingId = a.workOrderBillingInvoiceChild[i].workOrderShippingId;
                        p.noOfPieces = a.workOrderBillingInvoiceChild[i].qtyToBill;
                        p.workOrderPartId = a.workOrderBillingInvoiceChild[i].workOrderPartId;

                        billingItems.push(p);
                    }
                }
            });
        }
        else {
            var p = new BillingItems;
            p.workOrderShippingId = this.workOrderShippingId;
            p.noOfPieces = this.selectedQtyToBill;
            p.workOrderPartId = this.selectedPartNumber;

            billingItems.push(p);
        }

        this.isSpinnerVisible = true;
        let billingorInvoiceFormTemp = JSON.parse(JSON.stringify(this.billingorInvoiceForm));
        this.billingorInvoiceForm.soldToCustomerId = billingorInvoiceFormTemp.soldToCustomerId['customerId'];
        this.billingorInvoiceForm.shipToCustomerId = billingorInvoiceFormTemp.shipToCustomerId['customerId'];
       //this.billingorInvoiceForm.billToCustomerId = billingorInvoiceFormTemp.billToCustomerId['userID'];
        //this.billingorInvoiceForm.billToSiteId = billingorInvoiceFormTemp.billToSiteId;
        this.billingorInvoiceForm.shipToSiteId = billingorInvoiceFormTemp.shipToSiteId;
        this.billingorInvoiceForm.soldToSiteId = billingorInvoiceFormTemp.soldToSiteId;
        this.billingorInvoiceForm.createdDate = new Date();
        this.billingorInvoiceForm.updatedDate = new Date();
        this.billingorInvoiceForm.createdBy = this.userName;
        this.billingorInvoiceForm.updatedBy = this.userName;
        this.billingorInvoiceForm.workOrderId = this.workOrderId;
        this.billingorInvoiceForm.workFlowWorkOrderId= this.workFlowWorkOrderId;
        this.billingorInvoiceForm.workOrderPartNoId =this.workOrderPartNumberId;
        this.billingorInvoiceForm.itemMasterId =this.workOrderPartNumberId;
        this.billingorInvoiceForm.masterCompanyId= this.authService.currentUser.masterCompanyId;
        this.billingorInvoiceForm.isActive= true;
        this.billingorInvoiceForm.isDeleted= false;
        this.billingorInvoiceForm.customerId = billingorInvoiceFormTemp.customerId;
        this.billingorInvoiceForm.invoiceNo = "test";
        this.billingorInvoiceForm.invoiceStatus = invoiceStatus == InvoiceTypeEnum.Billed ? 'Billed' : (invoiceStatus == InvoiceTypeEnum.Reviewed ? 'Reviewed' : 'Invoiced');
        this.billingorInvoiceForm.customerId = editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId),
        this.billingorInvoiceForm.employeeId= editValueAssignByCondition('value', this.savedWorkOrderData.employeeId),
        this.billingorInvoiceForm.billingItems = billingItems;
        this.billingorInvoiceForm.invoiceTime =moment(billingorInvoiceFormTemp.invoiceTime, ["h:mm A"]).format("HH:mm")

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
            //this.loadInvoiceView();
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

    // saveWorkOrderBilling(object) {
    //     const data = {
    //         ...object,
    //         ...this.loginDetailsForCreate,
    //         workOrderId: this.workOrderId,
    //         workFlowWorkOrderId: this.workFlowWorkOrderId,
    //         workOrderPartNoId: this.workOrderPartNumberId,
    //         itemMasterId: this.workOrderPartNumberId,
    //         customerId: editValueAssignByCondition('customerId', this.savedWorkOrderData.customerId),
    //         employeeId: editValueAssignByCondition('value', this.savedWorkOrderData.employeeId),
    //         soldToCustomerId: editValueAssignByCondition('customerId', object.soldToCustomerId),
    //         shipToCustomerId: editValueAssignByCondition('customerId', object.shipToCustomerId),
    //         invoiceTime: moment(object.invoiceTime, ["h:mm A"]).format("HH:mm")
    //     }

    //     if (this.isEditBilling) {
    //         this.isSpinnerVisible = true;
    //         this.workOrderService.updateBillingByWorkOrderId(data).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //             this.isSpinnerVisible = false;
    //             this.alertService.showMessage(
    //                 this.moduleName,
    //                 'Updated Work Order Billing Succesfully',
    //                 MessageSeverity.success
    //             );
    //         },
    //             err => {
    //                 this.isSpinnerVisible = false;
    //                 this.errorHandling(err)
    //             })
    //     } else {
    //         this.isSpinnerVisible = true;
    //         this.workOrderService.createBillingByWorkOrderId(data).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
    //             this.isSpinnerVisible = false;
    //             this.alertService.showMessage(
    //                 this.moduleName,
    //                 'Saved Work Order Billing Succesfully',
    //                 MessageSeverity.success
    //             );
    //         },
    //             err => {
    //                 this.isSpinnerVisible = false;
    //                 this.errorHandling(err)
    //             })
    //     }
    // }
    // updateWorkOrderBilling() {
    //     this.updateWOBilling.emit(this.billingorInvoiceForm);
    //     // this.getQuoteCostingData();
    // }

    onChangeWOCostPlus() {
        if (this.billingorInvoiceForm.totalWorkOrder) {
            this.billingorInvoiceForm.grandTotal = Math.round(this.billingorInvoiceForm.totalWorkOrderCostPlus).toFixed(2);
        }
        this.billingorInvoiceForm.totalWorkOrderCostPlus = this.billingorInvoiceForm.totalWorkOrderCostPlus.toFixed(2);
        // this.calculateGrandTotal();
    }
    onChangeMaterialCostPlus() {
        this.billingorInvoiceForm.materialCostPlus = this.billingorInvoiceForm.materialCostPlus.toFixed(2);
        // this.calculateGrandTotal();
    }
    onChangeLaborOHCostPlus() {
        this.billingorInvoiceForm.laborOverHeadCostPlus = this.billingorInvoiceForm.laborOverHeadCostPlus.toFixed(2);
        // this.calculateGrandTotal();
    }
    onChangeMiscChCostPlus() {
        this.billingorInvoiceForm.miscChargesCostPlus = this.billingorInvoiceForm.miscChargesCostPlus.toFixed(2);
        // this.calculateGrandTotal();
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
                               // this.shippingHeader.shipToSiteId = x.siteID;
                                this.setShipToAddress();
                            }
                        }
                    )
                } else {
                    this.shipCustomerShippingOriginalData.forEach(
                        x => {
                            if (x.isPrimary) {
                               // this.shippingHeader.shipToSiteId = x.siteID;
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

                this.shipCustomerAddress.line1 = site.address1;
                this.shipCustomerAddress.line2 = site.address2;
                this.shipCustomerAddress.country = site.countryName;
                this.shipCustomerAddress.postalCode = site.postalCode;
                this.shipCustomerAddress.stateOrProvince = site.stateOrProvince;
                this.shipCustomerAddress.city = site.city;
            }
            else {
                this.shipCustomerAddress = new AddressModel();
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
            {
                this.soldCustomerAddress.line1 = site.address1;
                this.soldCustomerAddress.line2 = site.address2;
                this.soldCustomerAddress.country = site.countryName;
                this.soldCustomerAddress.postalCode = site.postalCode;
                this.soldCustomerAddress.stateOrProvince = site.stateOrProvince;
                this.soldCustomerAddress.city = site.city;
            }
            else {
                this.soldCustomerAddress = new AddressModel();
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

                    this.siteList.forEach(
                        x => {
                            if (x.isPrimary) {
                                //this.shippingHeader.soldToSiteId = x.siteID;

                                this.setSoldToAddress();
                            }
                        }
                    )
                }, err => {
                    this.errorHandling(err);
                });
    }
    
    // getSiteNames(object) {
    //     const { customerId } = object;
    //     this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
    //         this.soldCustomerShippingOriginalData = res[0];
    //         this.soldCustomerSiteList = res[0].map(x => {
    //             return {
    //                 label: x.siteName,
    //                 value: x.customerDomensticShippingId

    //             }
    //         });
    //         this.soldCustomerShippingOriginalData.forEach(
    //             x => {
    //                 if (x.isPrimary) {
    //                     this.billingorInvoiceForm.soldToSiteId = x.customerDomensticShippingId;
    //                     this.changeOfSoldSiteName(x.customerDomensticShippingId);
    //                 }
    //             }
    //         )
    //         this.shipCustomerShippingOriginalData = res[0];
    //         this.shipCustomerSiteList = res[0].map(x => {
    //             return {
    //                 label: x.siteName,
    //                 value: x.customerDomensticShippingId
    //             }
    //         });
    //         this.shipCustomerShippingOriginalData.forEach(
    //             x => {
    //                 if (x.isPrimary) {
    //                     this.billingorInvoiceForm.shipToSiteId = x.customerDomensticShippingId
    //                     this.changeOfShipSiteName(x.customerDomensticShippingId);
    //                 }
    //             }
    //         )
    //     },
    //         err => {
    //             this.errorHandling(err);
    //         })
    // }


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
    isWorkOrder: any;
    tmchange(){}
    markupChanged(matQuotation, row) {}

    parseToInt(str : any) {
        return Number(str);
    }
    setEditArray:any=[];
    private CurrencyData() {
 
        this.setEditArray=[];
        // if(this.assetService.isEditMode==true){
        //     this.setEditArray.push(this.currentCalibration.certificationCurrencyId,this.currentCalibration.inspectionCurrencyId,this.currentCalibration.calibrationCurrencyId,this.currentCalibration.verificationCurrencyId); 
        // }else{
            this.setEditArray.push(0);
        // }
            const strText='';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code',strText,true,20,this.setEditArray.join()).subscribe(res => {
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
}

export class BillingItems {
    workOrderShippingId: number;
    noOfPieces: number;
    workOrderPartId: number;
}