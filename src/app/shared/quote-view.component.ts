
import { Component, Input, OnChanges, OnInit, EventEmitter, Output, OnDestroy } from "@angular/core";
import { CommonService } from '../services/common.service';
import { WorkOrderLabor } from '../models/work-order-labor.modal';
import { WorkOrderQuoteService } from '../services/work-order/work-order-quote.service';
import { WorkOrderService } from '../services/work-order/work-order.service';
import {
    WorkOrderQuote,
    multiParts,
    partsDetail
  } from '../models/work-order-quote.modal';

@Component({
    selector: 'grd-quote-view',
    templateUrl: './quote-view.component.html',
    styleUrls: ['./quote-view.component.scss']
})

export class QuoteViewComponent implements OnInit, OnChanges{
    @Input() workorderid: any;
    @Input() isView: boolean = false;
    employeeList: any;
    labor = new WorkOrderLabor();
    workOrderPartsDetail: partsDetail[];
    taskList: any;
    markupList: any;
    currencyList: any;
    savedWorkOrderData: any;
    quoteForm = new WorkOrderQuote();
    isEdit: boolean = false;
    customerCode: any;
    customerName: any;
    customerContact: any;
    customerRef: any;
    csr: any;
    customerEmail: any;
    customerPhone: any;
    dso:any;
    validFor:any;
    quoteDueDate: any;
    expirationDate: any;
    currency: any;
    accountsReceivableBalance: any;
    warnings: any;
    memo: any;
    workOrderQuoteDetailsId: any;
    workOrderExclusionsList: any;
    materialListQuotation: any;
    workOrderFreightList: any;
    workOrderChargesList: any;
    workOrderWorkFlowOriginalData: any;
    employeeName: any;
    creditTerms: any;
    creditLimit: any;
    workOrderNumber: any;
    salesPerson: any;
    mpnPartNumbersList: any;
    selectedPartNumber: any = "";
    selectedWorkFlowWorkOrderId: any;
    workFlowWorkOrderId: any;
    gridActiveTab: any;
    isQuoteListView: any;
    overAllMarkup: any;
    costPlusType: any;
    selectedPartDescription: string = "";
    selectedStockLineNumber: string = "";

    constructor(private commonService: CommonService, private workorderMainService: WorkOrderService,
      private workOrderService: WorkOrderQuoteService){
    }

    ngOnInit(){
        if(this.workorderid != 0){
            this.getEmployeeList(this.workorderid);
            this.getTaskList();
            this.getMarkup();
            this.loadCurrency();
          }
    }

    ngOnChanges(){
        if(this.workorderid != 0){
            this.getEmployeeList(this.workorderid);
            this.getTaskList();
            this.getMarkup();
            this.loadCurrency();
          }
    }

    getEmployeeList(woId){
        this.commonService.smartDropDownList('Employee','EmployeeId','FirstName')
        .subscribe(
            (employeeList: any[])=>{
            this.employeeList = employeeList;
            this.getWorkOrderInfo(woId);
            this.getMPNDetails(woId);
            }
        )
    }

    getTaskList() {
        if (this.labor == undefined) {
            this.labor = new WorkOrderLabor()
        }
        this.labor.workOrderLaborList = [];
        this.labor.workOrderLaborList.push({})
        this.workorderMainService.getAllTasks()
            .subscribe(
                (taskList) => {
                    this.labor.workOrderLaborList[0] = {}
                    this.taskList = taskList;
                    this.formTaskList();
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    getMarkup(){
        this.commonService.smartDropDownList('[Percent]', 'PercentId', 'PercentValue')
        .subscribe(
          res=>{
            this.markupList = res;
          }
        )
    }

    loadCurrency(){
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'symbol').subscribe(
          results => this.currencyList = results,
          error => {}
      );
    }

    getWorkOrderInfo(getWorkOrderInfo){
        this.workOrderService.getWorkOrderById(getWorkOrderInfo).subscribe(res => {
          if(res){
            this.savedWorkOrderData = res;
            this.customerCode = res.customerDetails.customerId;
            this.customerName = res.customerDetails.customerName;
            this.customerContact = res.customerDetails.customerContact;
            this.customerRef = res.customerDetails.customerRef;
            this.csr = res.customerDetails.csrName;
            this.customerEmail = res.customerDetails.customerEmail;
            this.customerPhone = res.customerDetails.customerPhone;
            this.creditLimit = res.creditLimit;
            this.workOrderNumber = res.workOrderNum;
            this.quoteForm.WorkOrderId = res.workOrderId;
            this.quoteForm.WorkFlowWorkOrderId = res["workFlowWorkOrderId"];
            this.quoteForm.openDate = new Date(res["openDate"])
            this.quoteForm['customerId'] = res['customerDetails']['customerId'];
            this.quoteForm['CustomerPhone'] = res['customerDetails']['customerPhone']
            this.quoteForm['salesPersonId'] = res['salesPersonId'];
            this.quoteForm['employeeId'] = res['employeeId'];
            this.quoteForm.masterCompanyId = res['masterCompanyId'];
            this.quoteForm.creditTermsandLimit = res.customerDetails.creditLimit;
            this.workOrderService.getWorkOrderQuoteDetail(res.workOrderId, res["workFlowWorkOrderId"])
            .subscribe(
              (res : any)=>{
                if(res){
                  this.isEdit = true;
                  this.dso = res.workOrderQuote.dso;
                  this.validFor = res.workOrderQuote.validForDays;
                  res.workOrderQuote.openDate = new Date(res.workOrderQuote.openDate);
                  this.quoteForm = {...res.workOrderQuote, WorkOrderId: res.workOrderId,
                    WorkFlowWorkOrderId: res["workFlowWorkOrderId"], quoteNumber: res.workOrderQuote.quoteNumber, expirationDateStatus: res.workOrderQuote.quoteStatusId};
                  this.quoteDueDate = new Date(res.workOrderQuote.quoteDueDate);
                  this.expirationDate = new Date(res.workOrderQuote.expirationDate);
                  this.currency = res.workOrderQuote.currencyId;
                  this.accountsReceivableBalance = res.workOrderQuote.accountsReceivableBalance;
                  this.warnings = res.warnings;
                  this.memo = res.memo;
                  this.getQuoteTabData();
                }
              }
            )
    
            this.getCreditTerms(res.creditTermsId);
            this.setEmpAndSalesPersonName(res.employeeId,res.salesPersonId);
            this.getMPNList(res.workOrderId);
          }
      })
    }

    getMPNDetails(workOrderId){
        this.workOrderService.getPartsDetail(workOrderId)
        .subscribe((workOrderParts: partsDetail[])=>{
            this.workOrderPartsDetail = workOrderParts;
          }
        )
    }

    formTaskList(){
        this.taskList.forEach(task => {
            this.labor.workOrderLaborList[0][task.description.toLowerCase()] = [];
        });
    }

    getQuoteTabData() {
        this.getQuoteExclusionListByWorkOrderQuoteId();
        this.getQuoteMaterialListByWorkOrderQuoteId();
        this.getQuoteChargesListByWorkOrderQuoteId();
        this.getQuoteLaborListByWorkOrderQuoteId();
        this.getQuoteFreightListByWorkOrderQuoteId();
      }

    getQuoteExclusionListByWorkOrderQuoteId() {
        if(this.workOrderQuoteDetailsId){        
        this.workOrderService.getQuoteExclusionList(this.workOrderQuoteDetailsId, 1).subscribe(res => {
            this.workOrderExclusionsList = res;
        })
        }
    }

    getQuoteMaterialListByWorkOrderQuoteId() {
        if(this.workOrderQuoteDetailsId){
        this.workOrderService.getQuoteMaterialList(this.workOrderQuoteDetailsId, 1).subscribe(res => {
            this.materialListQuotation = res;
            if(this.materialListQuotation && this.materialListQuotation.length > 0 && this.materialListQuotation[0].headerMarkupId){
              this.costPlusType = this.materialListQuotation[0].markupFixedPrice;
              this.overAllMarkup = Number(this.materialListQuotation[0].headerMarkupId);
            }
        })
        }
    }
    
    getQuoteFreightListByWorkOrderQuoteId() {
        if(this.workOrderQuoteDetailsId){
        this.workOrderService.getQuoteFreightsList(this.workOrderQuoteDetailsId, 1).subscribe(res => {
            this.workOrderFreightList = res;
        })
        }
    }
    
    getQuoteChargesListByWorkOrderQuoteId() {
        if(this.workOrderQuoteDetailsId){
            this.workOrderService.getQuoteChargesList(this.workOrderQuoteDetailsId, 1).subscribe(res => {
                this.workOrderChargesList = res;
            })
        }
    }

    getQuoteLaborListByWorkOrderQuoteId() {
        if(this.workOrderQuoteDetailsId){
            this.workOrderService.getQuoteLaborList(this.workOrderQuoteDetailsId, 1).subscribe(res => {
                if (res) {
                    let wowfId = this.labor.workFlowWorkOrderId;
                    if(res){
                    let laborList = this.labor.workOrderLaborList;
                    this.labor = {...res, workOrderLaborList: laborList};
                    this.labor.workFlowWorkOrderId = wowfId;
                    this.taskList.forEach((tl)=>{
                        this.labor.workOrderLaborList[0][tl['description'].toLowerCase()] = [];
                        res.laborList.forEach((rt)=>{
                        if(rt['taskId'] == tl['taskId']){
                            let labor = {}
                            labor = {...rt, employeeId: {'label':rt.employeeName, 'value': rt.employeeId}}
                            this.labor.workOrderLaborList[0][tl['description'].toLowerCase()].push(labor);
                        }
                        })
                    })
                    }
                }

            })
        }
    }

    getCreditTerms(ctermId){
        this.commonService.smartDropDownList('CreditTerms','CreditTermsId','Name')
        .subscribe(
          (creditTermList: any[])=>{
    
            for(let cTerm of creditTermList){
              if(cTerm.value == ctermId){
                this.creditTerms = cTerm.label;
              }
            }
          }
        )
    }

    setEmpAndSalesPersonName(empId, salesPerId){
        for(let emp of this.employeeList){
            if(emp.value == empId){
            this.employeeName = emp.label;
            }
            if(emp.value == salesPerId){
            this.salesPerson = emp.label;
            }
        }
    }

    getMPNList(workOrderId){
        this.workOrderService.getWorkOrderWorkFlowNumbers(workOrderId).subscribe(res => {
            this.workOrderWorkFlowOriginalData = res;
            console.log(res);
            this.mpnPartNumbersList = res.map(x => {
            return {
                value:
                {
                workOrderWorkFlowId: x.value,
                workOrderNo: x.label,
                masterPartId: x.masterPartId,
                workflowId: x.workflowId,
                workflowNo: x.workflowNo,
                partNumber: x.partNumber,
                workOrderScopeId: x.workOrderScopeId,
                itemMasterId: x.itemMasterId,
                partDescription: x.description,
                stockLineNumber: x.stockLineNo
                },
                label: x.partNumber
            }
            });
            if(this.savedWorkOrderData && this.savedWorkOrderData.isSinglePN){
              this.selectedPartNumber = this.mpnPartNumbersList[0].label;
              this.partNumberSelected();
            }
        })
    }

    partNumberSelected(){
        this.gridActiveTab = '';
        this.clearQuoteData();
        let msId = 0;
        this.mpnPartNumbersList.forEach((mpn)=>{
          if(mpn.label == this.selectedPartNumber){
            this.selectedPartDescription = mpn.value.partDescription;
            this.selectedStockLineNumber = mpn.value.stockLineNumber;
            msId = mpn.value.masterPartId;
            this.labor.workFlowWorkOrderId = mpn;
            this.workFlowWorkOrderId = mpn.value.workOrderWorkFlowId;
            this.selectedWorkFlowWorkOrderId = mpn.value.workOrderWorkFlowId;
            this.workOrderService.getSavedQuoteDetails(this.selectedWorkFlowWorkOrderId)
            .subscribe(
              (res)=>{
                if(res && res['workOrderQuoteDetailsId']){
                  this.workOrderQuoteDetailsId = res['workOrderQuoteDetailsId'];
                  this.getQuoteTabData();
                }
                else{
                  this.workOrderQuoteDetailsId = 0;
                }
              }
            )
          }
        })
    }

    clearQuoteData(){ 
        this.materialListQuotation = [];
    }
    
    gridTabChange(value) {
        this.gridActiveTab = value;
    }

    calculateExpiryDate() {
    }

    getTotalQuantity(){
      let totalQuantity = 0;
      this.materialListQuotation.forEach(
        (material)=>{
          if(material.quantity){
            totalQuantity += material.quantity;
          }
        }
      )
      return totalQuantity;
    }
    
    getTotalUnitCost(){
      let total = 0;
      this.materialListQuotation.forEach(
        (material)=>{
          if(material.unitCost && material.quantity){
            total += Number(material.quantity * material.unitCost);
          }
        }
      )
      return total.toFixed(2);
    }

    totalMaterialBillingAmount(){
      let total = 0;
      this.materialListQuotation.forEach(
        (material)=>{
          if(material.billingAmount){
            total += Number(material.billingAmount);
          }
        }
      )
      return total.toFixed(2);
    }

}