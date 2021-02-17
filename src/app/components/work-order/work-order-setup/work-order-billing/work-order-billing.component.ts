import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
declare var $ : any;
import { CommonService } from '../../../../services/common.service';
import { AddressModel } from '../../../../models/address.model';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CustomerService } from '../../../../services/customer.service';
import { getObjectById, editValueAssignByCondition } from '../../../../generic/autocomplete';
import { Billing } from '../../../../models/work-order-billing.model';
import { getModuleIdByName } from '../../../../generic/enums';
import { WorkOrderQuoteService } from '../../../../services/work-order/work-order-quote.service';
import {
    WorkOrderLabor
} from '../../../../models/work-order-labor.modal';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';

 
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
    customerNamesList: Object;
    soldCustomerSiteList = [];
    shipCustomerSiteList = [];
    shipToAttention;
    soldCustomerAddress: any = new AddressModel();
    shipCustomerAddress: any = new AddressModel();
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
    isView: boolean = true;
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
    workOrderMaterialList: any[];
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
        private customerService: CustomerService, private quoteService: WorkOrderQuoteService, private alertService: AlertService

    ) {

    }
    ngOnInit() {

        console.log("status", this.quotestatusofCurrentPart)
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
                this.getSiteNames(data.soldToCustomerId);
            }
            else {
                this.getSiteNamesBySoldCustomerId(data.soldToCustomerId);
                this.getSiteNamesByShipCustomerId(data.shipToCustomerId);
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
                this.getSiteNames(data.soldToCustomerId);
            }
            else {
                if (this.billingorInvoiceForm.soldToCustomerId) {
                    this.getSiteNamesBySoldCustomerId(this.billingorInvoiceForm.soldToCustomerId);
                }
                if (this.billingorInvoiceForm.shipToCustomerId) {
                    this.getSiteNamesByShipCustomerId(this.billingorInvoiceForm.shipToCustomerId);
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
    async getSiteNamesBySoldCustomerId(object) {
        const { customerId } = object;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {

            this.soldCustomerShippingOriginalData = res[0];
            this.soldCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId

                }
            });
            this.soldCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.soldToSiteId = x.customerShippingAddressId;
                        this.changeOfSoldSiteName(x.customerShippingAddressId);
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
        const data = getObjectById('customerShippingAddressId', value, this.soldCustomerShippingOriginalData);
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
    async getSiteNamesByShipCustomerId(object) {
        const { customerId } = object;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId
                }
            });
            this.shipCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.shipToSiteId = x.customerShippingAddressId
                        this.changeOfShipSiteName(x.customerShippingAddressId);
                    }
                }
            )
        },
            err => {
                // this.isSpinnerVisible = false;
                this.errorHandling(err);
            })
    }
    changeOfShipSiteName(value) {
        const data = getObjectById('customerShippingAddressId', value, this.shipCustomerShippingOriginalData);

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



    saveWorkOrderBilling() {
        this.saveWOBilling.emit(this.billingorInvoiceForm);

        // this.getQuoteCostingData();
    }
    updateWorkOrderBilling() {
        this.updateWOBilling.emit(this.billingorInvoiceForm);
        // this.getQuoteCostingData();
    }

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
    getSiteNames(object) {
        const { customerId } = object;
        this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.soldCustomerShippingOriginalData = res[0];
            this.soldCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId

                }
            });
            this.soldCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.soldToSiteId = x.customerShippingAddressId;
                        this.changeOfSoldSiteName(x.customerShippingAddressId);
                    }
                }
            )
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId
                }
            });
            this.shipCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.shipToSiteId = x.customerShippingAddressId
                        this.changeOfShipSiteName(x.customerShippingAddressId);
                    }
                }
            )
        },
            err => {
                this.errorHandling(err);
            })
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