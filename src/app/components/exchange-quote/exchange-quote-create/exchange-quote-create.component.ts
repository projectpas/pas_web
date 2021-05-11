import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {
  NgForm,
  FormGroup
} from "@angular/forms";
import { CustomerSearchQuery } from "../models/customer-search-query";
import { CustomerService } from "../../../services/customer.service";
import { Customer } from "../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { ExchangequoteService } from "../../../services/exchangequote.service";
import { IExchangeQuote } from "../../../models/exchange/IExchangeQuote.model";
import { IExchangeOrderQuote } from "../../../models/exchange/IExchangeOrderQuote";
import { ExchangeQuote } from "../../../models/exchange/ExchangeQuote.model";
import { IExchangeQuoteView } from "../../../models/exchange/IExchangeQuoteView";
import { ExchangeQuoteView } from "../../../models/exchange/ExchangeQuoteView";
import { CommonService } from "../../../services/common.service";
import { CurrencyService } from "../../../services/currency.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import {
  getObjectById,
  editValueAssignByCondition,
  getValueFromArrayOfObjectById,
} from "../../../generic/autocomplete";
import {
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CustomerViewComponent } from "../../../shared/components/customer/customer-view/customer-view.component";
//import { PartDetail } from "../../shared/models/part-detail";
import { DBkeys } from "../../../services/db-Keys";
import { IStatus } from "../../../models/sales/IStatus";
import { forkJoin } from "rxjs/observable/forkJoin";
import { ExchangeQuotePartNumberComponent } from "../shared/components/exchange-quote-part-number/exchange-quote-part-number.component";
import { ExchangeQuoteApproveComponent } from "../shared/components/exchange-quote-approve/exchange-quote-approve.component";
import { ExchangeQuoteCustomerApprovalComponent } from "../shared/components/exchange-quote-customer-approval/exchange-quote-customer-approval.component";
import{ExchangeQUoteMarginSummary} from '../../../models/exchange/ExchangeQUoteMarginSummary';
import{ExchangeQuoteAnalysisComponent} from '../../exchange-quote/exchange-quote-analysis/exchange-quote-analysis.component';
import {ExchangeQuoteChargesComponent} from "../../exchange-quote/shared/components/exchange-quote-charges/exchange-quote-charges.component";
import {ExchangeQuoteFreightComponent} from "../../exchange-quote/shared/components/exchange-quote-freight/exchange-quote-freight.component";
import { VerifyExchangeQuoteModel } from "../models/verify-exchange-quote-model";
import { ExchangeSalesOrderConversionCritera } from "../models/exchange-sales-order-conversion-criteria";
@Component({
  selector: 'app-exchange-quote-create',
  templateUrl: './exchange-quote-create.component.html',
  styleUrls: ['./exchange-quote-create.component.scss']
})
export class ExchangeQuoteCreateComponent implements OnInit {
  exchangeQuote: IExchangeQuote;
  exchangeQuoteId: any;
  exchangeCreateHeaderOrderId: number;
  //exchangeQuot: any = {};
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
  showPaginator: boolean = false;
  customerId: number;
  toggle_po_header: boolean = true;
  exchangOrdereQuote: IExchangeOrderQuote;
  modal: NgbModalRef;
  errorModal: NgbModalRef;
  arrayPrioritylist:any[] = [];
  allPriorityInfo: any = [];
  allPriorityDetails: any[];
  isSpinnerVisible: boolean = true;
  arrayExchangestatuslist:any[] = [];
  exchangeStatusList: any = [];
  creditTerms: any[];
  id: any;
  @ViewChild("newExchangeQuoteForm", { static: false }) public newExchangeQuoteForm: NgForm;
  isEdit: boolean = false;
  isEditModeHeader: boolean = false;
  customerDetails: any;
  customerContactList: any[];
  customerInfoFromExchangeQuote: any = {};
  exchangeQuoteObj: IExchangeQuote;
  salesPersonAndAgentOriginalList: any[] = [];
  salesFirstCollection: any[];
  isCreateModeHeader: boolean = false;
  isHeaderSubmit: boolean = false;
  enableUpdateButton = true;
  display: boolean = false;
  errorMessages: any[] = [];
  exchangeQuoteView: IExchangeQuoteView;
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  validDaysSettingsList = [];
  selectedParts: any[] = [];
  @ViewChild(ExchangeQuotePartNumberComponent, { static: false }) public exchangeQuotePartNumberComponent: ExchangeQuotePartNumberComponent;
  addressType: any = 'EQ';
  showAddresstab: boolean = false;
  managementStructureId: any;
  @ViewChild(ExchangeQuoteApproveComponent, { static: false }) public exchangeQuoteApproveComponent: ExchangeQuoteApproveComponent;
  @ViewChild(ExchangeQuoteCustomerApprovalComponent, { static: false }) public exchangeQuoteCustomerApprovalComponent: ExchangeQuoteCustomerApprovalComponent;
  marginSummary: ExchangeQUoteMarginSummary = new ExchangeQUoteMarginSummary();
  @ViewChild(ExchangeQuoteAnalysisComponent, { static: false }) public exchangeQuoteAnalysisComponent: ExchangeQuoteAnalysisComponent;
  enforceApproval: boolean=true;
  @ViewChild(ExchangeQuoteChargesComponent, { static: false }) public exchangeQuoteChargesComponent: ExchangeQuoteChargesComponent;
  @ViewChild(ExchangeQuoteFreightComponent, { static: false }) public exchangeQuoteFreightComponent: ExchangeQuoteFreightComponent;
  moduleName: any = "ExchangeQuote";
  totalCharges = 0;
  totalFreights = 0;
  totalcost=0;
  markupList = [];
  percents: any[];
  disableprintagreement:boolean=true;
  @ViewChild("exchangeQuotePrintPopup", { static: false }) public exchangeQuotePrintPopup: ElementRef;
  verifyExchangeSalesOrderQuoteObj: VerifyExchangeQuoteModel;
  exchangeSalesOrderConversionCriteriaObj: ExchangeSalesOrderConversionCritera;
  selectAllForConversion = true;
  @ViewChild("exchangeQuoteConvertPopup", { static: false }) public exchangeQuoteConvertPopup: ElementRef;
  constructor(private customerService: CustomerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private exchangequoteService: ExchangequoteService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    private authService: AuthService,
    public router: Router,
    private modalService: NgbModal) {
      this.exchangeQuote = new ExchangeQuote();
      this.verifyExchangeSalesOrderQuoteObj = new VerifyExchangeQuoteModel();
      this.exchangeSalesOrderConversionCriteriaObj = new ExchangeSalesOrderConversionCritera();
     }

  ngOnInit() {
    this.priorityData();
    this.loadExchangeStatus();

    //this.controlSettings.showViewQuote = false;
    this.customerId = +this.route.snapshot.paramMap.get("customerId");
    this.id = +this.route.snapshot.paramMap.get("id");
    this.exchangeQuoteId = this.id;
    this.isSpinnerVisible = false;
    this.exchangequoteService.resetExchangeQuote();
    this.managementStructureId = this.currentUserManagementStructureId;
    this.exchangequoteService.getExchangeQuoteInstance().subscribe(data => {
      this.exchangeQuote = data;
      this.exchangeQuote.statusChangeDate = new Date();
    });
    setTimeout(() => {
      this.getExchangeInstance(true);
    },1200);

    if (this.id) {
      this.getMarginSummary();
    }
  }

  get userName(): string {	
		return this.authService.currentUser ? this.authService.currentUser.userName : "";		
	}

	get currentUserManagementStructureId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.managementStructureId
		  : null;
	}
	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
	}
	get employeeId() {
	return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
	}

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  viewSelectedRow() {
    this.modal = this.modalService.open(CustomerViewComponent, { size: "lg", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.customerId = this.customerId;
  }

  private priorityData(strText = '') {
    if (this.arrayPrioritylist.length == 0) {
        this.arrayPrioritylist.push(0); }
        this.commonservice.autoSuggestionSmartDropDownList('Priority','PriorityId','Description',strText,true, 0,this.arrayPrioritylist.join(),this.currentUserMasterCompanyId).subscribe(res => {
        this.allPriorityInfo = res;
            this.allPriorityInfo.map(x => {
                if (x.label == 'Routine') {
                    this.exchangeQuote.priorityId = x;
                }
        })
        //this.onSelectPriority();
        },
        err => {
            this.isSpinnerVisible = false;	});                
  }

  filterPriorityNames(event) {
		this.allPriorityDetails = this.allPriorityInfo;
		if (event.query !== undefined && event.query !== null) {
			const priority = [...this.allPriorityInfo.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.allPriorityDetails = priority;
		}
  }
  
  onSelectPriority() {
  }
  
  loadExchangeStatus() {
		if (this.arrayExchangestatuslist.length == 0) {
            this.arrayExchangestatuslist.push(0); }
			this.commonservice.autoSuggestionSmartDropDownList('ExchangeStatus','ExchangeStatusId','Name','',
								  true, 0,this.arrayExchangestatuslist.join(),this.currentUserMasterCompanyId)
				.subscribe(res => {
				this.exchangeStatusList = res;
				this.exchangeStatusList = this.exchangeStatusList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));	
				res.forEach(x => {
					if (x.label.toUpperCase() == "OPEN") {
						this.exchangeQuote.statusId = x.value;
					}
        });
       }
			,err => {
				this.isSpinnerVisible = false;	}
			);
  }
  
  getExchangeInstance(initialCall = false) {
     if (this.id) {
      this.getExchQuoteInstance(this.id, initialCall);
      //this.getSOMarginSummary();
      this.isEdit = true;
      this.toggle_po_header = false;
    }
    // else if (this.salesOrderView) {
    //   this.salesQuote = this.salesOrderView.salesOrder
    //   this.commonSalesOrderInstanceForConvertAndEdit(this.salesOrderView);
    //   this.getSOMarginSummary();
    // }
    else {
      this.getNewExchangeQuoteInstance(this.customerId, initialCall);
      //this.marginSummary = new MarginSummary();
      this.isEdit = false;
    }
  }

  getNewExchangeQuoteInstance(customerId: number, isInitialCall = false) {
    this.isSpinnerVisible = true;
    this.exchangequoteService
      .getNewExchangeQuoteInstance(customerId)
      .subscribe(data => {
        this.exchangeQuote = data && data.length ? data[0] : null;
        this.exchangeQuote.type = "1";
        this.exchangeQuote.openDate = new Date();
        this.exchangeQuote.quoteExpireDate = new Date();
        //this.salesQuote.statusChangeDate = new Date();
        this.exchangeQuote.masterCompanyId = this.masterCompanyId;
        this.exchangeQuote.exchangeQuoteNumber = "Creating";
        //this.load(this.managementStructureId);
        this.getInitialDataForExchangeQuote();
        this.isSpinnerVisible = false;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  getInitialDataForExchangeQuote() {
    this.isSpinnerVisible = true;
    let probabilityId = 0;
    let creditLimitTermsId = this.exchangeQuote.creditTermId ? this.exchangeQuote.creditTermId : 0;
    forkJoin(
      this.customerService.getCustomerCommonDataWithContactsById(this.customerId, this.exchangeQuote.customerContactId),
      this.commonservice.getCSRAndSalesPersonOrAgentList(this.currentUserManagementStructureId, this.customerId, this.exchangeQuote.customerServiceRepId, this.exchangeQuote.salesPersonId),
      this.commonservice.autoSuggestionSmartDropDownList("CreditTerms", "CreditTermsId", "Name", '', true, 200, [creditLimitTermsId].join(),this.masterCompanyId),
      this.commonservice.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, [probabilityId].join(),this.masterCompanyId),
      this.exchangequoteService.getAllExchangeQuoteSettings(this.masterCompanyId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        this.customerDetails = result[0];
        this.setCSRAndSalesPersonOrAgentList(result[1]);
        this.setCreditTerms(result[2]);
        this.setPercents(result[3]);
        this.setValidDays(result[4]);
        this.getCustomerDetails();
        if (this.id) {
        } else {
          //this.setAllCustomerContact(result[0]);
          this.getDefaultContact();
        }
        //this.setCSR();
        this.setSalesPerson();
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  setValidDays(result) {
    if (result && result.length > 0) {
      this.validDaysSettingsList = result;
    }
  }

  setAllCustomerContact(result) {
    this.customerContactList = result.contactList;
    if (this.customerContactList && this.customerContactList.length > 0) {
      for (let i = 0; i < this.customerContactList.length; i++) {
        this.customerContactList[i]['contactName'] = this.customerContactList[i].firstName + " " + this.customerContactList[i].lastName;
        this.customerContactList[i]['email'] = this.customerContactList[i].email;
      }
    }
  }

  setCSRAndSalesPersonOrAgentList(csrAndSalesPersonList) {
    //this.csrOriginalList = this.filterUniqueIds(csrAndSalesPersonList.csrEmpList);
    this.salesPersonAndAgentOriginalList = this.filterUniqueIds(csrAndSalesPersonList.salesEmpList);
  }

  filterUniqueIds(csrList) {
    let uniqueList = [];
    if (csrList && csrList.length > 0) {
      csrList.forEach(object => {
        if (uniqueList && uniqueList.length > 0) {
          let itemFound = uniqueList.find(x => x.employeeId == object.employeeId);
          if (!itemFound) {
            uniqueList.push(object);
          }
        } else {
          uniqueList.push(object);
        }

      });
    }
    return uniqueList;
  }

  setCreditTerms(creditTerms) {
    this.creditTerms = creditTerms;
  }

  setPercents(percents) {
    this.percents = percents;
    this.markupList = percents;
  }

  getCustomerDetails() {
    this.exchangeQuote.customerId = this.customerId;
    this.exchangeQuote.customerName = this.customerDetails.name;
    //this.exchangeQuote.customerEmail = this.customerDetails.email;
    this.exchangeQuote.customerCode = this.customerDetails.customerCode;
    this.exchangeQuote.creditLimit = this.customerDetails.creditLimit;
    this.exchangeQuote.creditTermId = this.customerDetails.creditTermsId;
    this.exchangeQuote.restrictPMA = this.customerDetails.restrictPMA;
    this.exchangeQuote.restrictDER = this.customerDetails.restrictDER;
    this.customerInfoFromExchangeQuote = {
      customerName: this.customerDetails.name,
      customerCode: this.customerDetails.customerCode,
      customerId: this.customerDetails.customerId
    }
    if (!this.isEdit) {
      this.exchangeQuote.salesPersonId = this.customerDetails.primarySalesPersonId;
      this.exchangeQuote.customerServiceRepId = this.customerDetails.csrId;
    }

    if (!this.id) {
      //this.exchangeQuote.contractReference = this.customerDetails.contractReference;
      this.exchangeQuote.creditLimit = this.customerDetails.creditLimit;
      this.exchangeQuote.creditTermId = this.customerDetails.creditTermsId;
      //this.exchangeQuote.contractReferenceName = this.customerDetails.contractReference;
      this.exchangeQuote.restrictPMA = this.customerDetails.restrictPMA;
      this.exchangeQuote.restrictDER = this.customerDetails.restrictDER;
      this.setValidDaysBasedOnSettings(false);
      this.onChangeValidForDays();
    }
    else {
      this.setValidDaysBasedOnSettings(true);
    }

    //this.setSalesPerson();
    //this.setCSR();
  }

  setValidDaysBasedOnSettings(isEdit) {
    if (this.validDaysSettingsList && this.validDaysSettingsList.length > 0) {
      let validDaysObject = this.validDaysSettingsList[0];
      if (validDaysObject) {
        if (!isEdit) {
          this.exchangeQuote.validForDays = validDaysObject.validDays;
          //this.exchangeQuote.type = validDaysObject.typeId.toString();
          this.exchangeQuote.statusId = validDaysObject.defaultStatusId;
          this.exchangeQuote.statusName = validDaysObject.defaultStatusName;
        }
        this.exchangeQuote.cogs = validDaysObject.cogs;
        this.exchangeQuote.daysForCoreReturn = validDaysObject.daysForCoreReturn;
        //this.defaultSettingPriority = validDaysObject.defaultPriorityId;
      } 
      else {
        this.exchangeQuote.validForDays = 10;
        this.exchangeQuote.type = "1";
      }
    } 
    else {
      this.exchangeQuote.validForDays = 10;
      this.exchangeQuote.type = "1";
    }
  }

  setSalesPerson() {
    if (this.isEdit && this.exchangeQuoteObj.salesPersonId && this.exchangeQuoteObj.salesPersonId != 0) {
      this.exchangeQuote.salesPersonName = getObjectById(
        "employeeId",
        this.exchangeQuoteObj.salesPersonId,
        this.salesPersonAndAgentOriginalList
      );
    } else if (this.customerDetails && this.customerDetails.primarySalesPersonId) {
      this.exchangeQuote.salesPersonName = getObjectById(
        "employeeId",
        this.customerDetails.primarySalesPersonId,
        this.salesPersonAndAgentOriginalList
      );
    }
  }

  getDefaultContact() {
    let isDefaultContactFound = false;
    if (this.customerContactList) {
      if (this.customerContactList && this.customerContactList.length > 0) {
        for (let i = 0; i < this.customerContactList.length; i++) {
          let isDefaultContact = this.customerContactList[i].isDefaultContact;
          if (isDefaultContact) {
            isDefaultContactFound = true;
            this.exchangeQuote.customerContactId = this.customerContactList[
              i
            ].customerContactId;
          } else if (!isDefaultContactFound) {
            this.exchangeQuote.customerContactId = 0;
          }
        }
      }
    }
  }

  filterSalesFirstName(event) {
    this.salesFirstCollection = this.salesPersonAndAgentOriginalList;
    const employeeListData = [
      ...this.salesPersonAndAgentOriginalList.filter(x => {
        return x.name.toLowerCase().includes(event.query.toLowerCase());
      })
    ];
    this.salesFirstCollection = employeeListData;
    this.enableUpdateButton = false;
  }

  onChangeInput() {
    this.enableUpdateButton = false;
  }

  onSubmit(submitType: Boolean, createNewVersion: boolean = false) {
    this.errorMessages = [];
    let haveError = false;
    if (this.exchangeQuote.type <= 0) {
      this.errorMessages.push("Please select Type");
      haveError = true;
    }
    if (!this.exchangeQuote.openDate) {
      this.errorMessages.push("Please select Open Date");
      haveError = true;
    }
    if (!this.exchangeQuote.creditLimit) {
      this.errorMessages.push("Please select Credit Limit");
      haveError = true;
    }
    if (!this.exchangeQuote.creditTermId) {
      this.errorMessages.push("Please select Credit Terms");
      haveError = true;
    }
    if (this.exchangeQuote.customerContactId < 0) {
      this.errorMessages.push("Please select Customer Contact");
      haveError = true;
    }
    if (this.exchangeQuote.promiseDate < this.exchangeQuote.customerRequestDate) {
      this.errorMessages.push("Request date cannot be greater than Promised Date.");
      haveError = true;
    }
    if (this.exchangeQuote.estimateShipDate < this.exchangeQuote.customerRequestDate) {
      this.errorMessages.push("Request date cannot be greater than Est.Ship Date.");
      haveError = true;
    }

    if (haveError) {
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      this.display = true;
    }
    else {
      this.display = false;
      this.isSpinnerVisible = true;
      this.exchangOrdereQuote = new ExchangeQuote();
      //this.exchangOrdereQuote.exchangeQuoteId = this.id;
      this.exchangOrdereQuote.exchangeQuoteId = 1;
      this.exchangOrdereQuote.type = this.exchangeQuote.type;
      this.exchangOrdereQuote.openDate = this.exchangeQuote.openDate;
      this.exchangOrdereQuote.quoteExpireDate = this.exchangeQuote.quoteExpireDate;
      this.exchangOrdereQuote.customerRequestDate = this.exchangeQuote.customerRequestDate;
      this.exchangOrdereQuote.promiseDate = this.exchangeQuote.promiseDate;
      this.exchangOrdereQuote.estimateShipDate = this.exchangeQuote.estimateShipDate;
      this.exchangOrdereQuote.masterCompanyId = this.masterCompanyId;
      this.exchangOrdereQuote.managementStructureId = this.managementStructureId;
      this.exchangOrdereQuote.customerId = this.exchangeQuote.customerId;
      this.exchangOrdereQuote.customerName = this.exchangeQuote.customerName;
      this.exchangOrdereQuote.customerCode = this.exchangeQuote.customerCode;
      this.exchangOrdereQuote.customerContactId = this.exchangeQuote.customerContactId;
      this.exchangOrdereQuote.customerReference = this.exchangeQuote.customerReference;
      //this.exchangOrdereQuote.customerReference = "SO";
      this.exchangOrdereQuote.balanceDue = this.exchangeQuote.balanceDue;
      this.exchangOrdereQuote.approvedById = this.exchangeQuote.approvedById;
      this.exchangOrdereQuote.validForDays = this.exchangeQuote.validForDays;
      // if (this.exchangOrdereQuote.approvedDate) {
      //   this.exchangOrdereQuote.approvedDate = this.exchangeQuote.approvedDate.toDateString();
      // }
      //this.exchangOrdereQuote.priorityId = this.exchangeQuote.priorityId;
      //this.exchangOrdereQuote.priorityId = getObjectById('value', this.exchangeQuote.priorityId, this.allPriorityInfo),
      this.exchangOrdereQuote.priorityId = this.exchangeQuote.priorityId ? this.getPriorityId(this.exchangeQuote.priorityId) : 0,
      //this.exchangOrdereQuote.priorityId = 1,
      //this.salesOrder.managementStructureId = this.salesQuote.managementStructureId;
      this.exchangOrdereQuote.creditLimit = this.exchangeQuote.creditLimit;
      this.exchangOrdereQuote.creditTermId = this.exchangeQuote.creditTermId;

      //this.exchangOrdereQuote.contractReference = this.salesQuote.contractReferenceName;
      this.exchangOrdereQuote.employeeId= this.authService.currentEmployee.employeeId,
      this.exchangOrdereQuote.salesPersonId = editValueAssignByCondition(
        "employeeId",
        this.exchangeQuote.salesPersonName
      );
      this.exchangOrdereQuote.salesPersonName = editValueAssignByCondition(
        "name",
        this.exchangeQuote.salesPersonId
      );

      if (this.id) {
        this.exchangOrdereQuote.statusId = this.exchangeQuote.statusId;
        this.exchangOrdereQuote.statusChangeDate = null;
      }

      //this.salesOrderQuote.salesOrderQuoteId = null;
      this.exchangOrdereQuote.createdBy = this.userName;
      this.exchangOrdereQuote.updatedBy = this.userName;
      this.exchangOrdereQuote.createdOn = new Date().toDateString();
      this.exchangOrdereQuote.updatedOn = new Date().toDateString();
      this.exchangeQuoteView = new ExchangeQuoteView();

      this.exchangeQuoteView.exchangeOrderQuote = this.exchangOrdereQuote;
      let partList: any = [];
      let invalidParts = false;
      let invalidDate = false;
      var errmessage = '';
      // for (let i = 0; i < this.selectedParts.length; i++) {
      //   let selectedPart = this.selectedParts[i];
      //   var errmessage = '';
      //   if (!selectedPart.customerRequestDate) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
      //   }
      //   if (!selectedPart.estimatedShipDate) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
      //   }
      //   if (!selectedPart.promisedDate) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter Promised Date."
      //   }
      //   if (!selectedPart.priorityId) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter priority ID."
      //   }
      //   if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
      //     if (selectedPart.customerRequestDate < this.salesQuote.openDate ||
      //       selectedPart.estimatedShipDate < this.salesQuote.openDate ||
      //       selectedPart.promisedDate < this.salesQuote.openDate) {
      //       invalidDate = true;
      //     }
      //   }
      //   if (!invalidDate && !invalidParts) {
      //     let partNumberObj = this.salesOrderService.marshalSOPartToSave(selectedPart, this.userName);
      //     partList.push(partNumberObj);
      //   }
      // }

      // this.salesOrderView.parts = partList;
      // this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.salesOrderView.parts, this.marginSummary);

      if (this.id) {
        // if (invalidParts) {
        //   this.isSpinnerVisible = false;
        //   this.alertService.resetStickyMessage();
        //   this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
        // } else if (invalidDate) {
        //   this.isSpinnerVisible = false;
        //   this.alertService.resetStickyMessage();
        //   this.alertService.showStickyMessage('Sales Order', "Please select valid Dates for Sales Order PartsList!", MessageSeverity.error);
        // } else {
          this.marginSummary.exchangeQuoteId = this.id;
          this.exchangequoteService.createExchangeQuoteMarginSummary(this.marginSummary).subscribe(result => {
            this.marginSummary.exchangeQuoteMarginSummaryId = result;
           });
          this.exchangequoteService.update(this.exchangeQuoteView).subscribe(data => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
              "Success",
              `Sales Order updated successfully.`,
              MessageSeverity.success
            );
            this.getExchQuoteInstance(this.id, true);
            if (createNewVersion) {
              this.router.navigateByUrl(`exchangemodule/exchangepages/exchange-quote-list`);
            }
            this.toggle_po_header = false;
            if (this.isEdit) {
              this.isCreateModeHeader = false;
            }
            this.enableUpdateButton = true;
          }, error => {
            this.isSpinnerVisible = false;
            this.toggle_po_header = true;
          });
        //}
      } else {
        this.exchangequoteService.create(this.exchangeQuoteView).subscribe(data => {
          this.exchangeCreateHeaderOrderId = data[0].exchangeQuoteId;
          this.exchangeQuoteView.exchangeOrderQuote.exchangeQuoteId = this.exchangeCreateHeaderOrderId;
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Exchange Quote created successfully.`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          this.id = this.exchangeCreateHeaderOrderId;
          if (this.exchangeCreateHeaderOrderId) {
            this.router.navigateByUrl(
              `exchangemodule/exchangepages/exchange-quote-edit/${this.customerId}/${this.exchangeCreateHeaderOrderId}`
            );
          }
          if (!this.isCreateModeHeader) {
            this.router.navigateByUrl(`exchangemodule/exchangepages/exchange-quote-list`);
          }
        }, error => {
          this.isSpinnerVisible = false;
          this.toggle_po_header = true;
        });
      }
      this.toggle_po_header = false;
    }
  }

  getPriorityId(obj) {
		if (obj.value) {
			return obj.value;
		} else {
			return 0;
		}
	}

  closeErrorMessage() {
    this.errorModal.close();
  }

  getExchQuoteInstance(exchangeQuoteId: number, initialCall = false) {
    this.isSpinnerVisible = true;
    this.exchangequoteService.getExchangeQuote(exchangeQuoteId).subscribe(data => {
      this.isSpinnerVisible = false;
      if (data) {
        this.exchangeQuoteView = data && data.length ? data[0] : null;
        this.exchangeQuoteObj = this.exchangeQuoteView.exchangeOrderQuote;
        this.verifySalesQuoteConversion(this.exchangeQuoteView.verificationResult);
        this.toggle_po_header = false;
        //this.bindData(this.exchangeQuoteView, initialCall);
      }
      let partList: any[] = this.exchangeQuoteView.parts;
      this.selectedParts = [];
      for (let i = 0; i < partList.length; i++) {
        let selectedPart = partList[i];
        let partNumberObj = this.exchangequoteService.marshalExchangeQuotePartToView(selectedPart);
        const selectedPartsTemp = this.selectedParts;
        selectedPartsTemp.push(partNumberObj)
        this.exchangequoteService.selectedParts = selectedPartsTemp;
        this.disableprintagreement = false;
      }
      // this.arrayEmplsit.push(this.salesOrderQuoteObj.employeeId);
      // if (!partsRefresh || !isInitialCall) {
      //   this.load(this.salesOrderQuoteObj.managementStructureId);
      // }

      this.marginSummary = this.exchangequoteService.getExchangeQuoteHeaderMarginDetails(this.exchangequoteService.selectedParts, this.marginSummary);
      // this.salesQuote.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      //this.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      this.exchangeQuote.type = this.exchangeQuoteObj.type.toString();
      //this.exchangeQuote.status = this.salesQuoteView.status;
      //this.exchangeQuote.priorities = this.salesQuoteView.priorities;
      if (this.exchangeQuotePartNumberComponent) {
        this.exchangeQuotePartNumberComponent.refresh();
      }
      this.exchangeQuote.statusId = this.exchangeQuoteObj.statusId;
      this.exchangeQuote.statusChangeDate = new Date(
        this.exchangeQuoteObj.statusChangeDate
      );
      this.exchangeQuote.openDate = new Date(this.exchangeQuoteObj.openDate);
      this.exchangeQuote.customerRequestDate = new Date(this.exchangeQuoteObj.customerRequestDate);
      this.exchangeQuote.estimateShipDate = new Date(this.exchangeQuoteObj.estimateShipDate);
      this.exchangeQuote.promiseDate = new Date(this.exchangeQuoteObj.promiseDate);
      this.exchangeQuote.validForDays = this.exchangeQuoteObj.validForDays;
      this.exchangeQuote.quoteExpireDate = new Date(
        this.exchangeQuoteObj.quoteExpireDate
      );

      this.exchangeQuote.exchangeQuoteNumber = this.exchangeQuoteObj.exchangeQuoteNumber;
      this.exchangeQuote.versionNumber = this.exchangeQuoteObj.versionNumber;
      this.exchangeQuote.customerId = this.exchangeQuoteObj.customerId;
      this.exchangeQuote.customerContactId = this.exchangeQuoteObj.customerContactId;
      this.exchangeQuote.customerReference = this.exchangeQuoteObj.customerReference;
      this.exchangeQuote.approvedById = this.exchangeQuoteObj.approvedById
      //this.salesQuote.employeeId = getObjectById('value', this.salesOrderQuoteObj.employeeId, this.allEmployeeList)//this.salesOrderQuoteObj.employeeId;
      this.exchangeQuote.exchangeQuoteId = this.exchangeQuoteObj.exchangeQuoteId;
      this.exchangeQuote.creditLimit = this.exchangeQuoteObj.creditLimit;
      this.exchangeQuote.creditTermId = this.exchangeQuoteObj.creditTermId;
      this.exchangeQuote.masterCompanyId = this.exchangeQuoteObj.masterCompanyId;
      if (this.exchangeQuoteObj.approvedDate)
        this.exchangeQuote.approvedDate = new Date(
          this.exchangeQuoteObj.approvedDate
        );
      this.exchangeQuote.statusName = this.exchangeQuoteView.exchangeOrderQuote.statusName;
      //this.salesQuote.isApproved = this.salesQuoteView.salesOrderQuote.isApproved;
      this.exchangeQuote.customerServiceRepId = this.exchangeQuoteObj.customerServiceRepId;
      //this.exchangeQuote.salesPersonId = this.exchangeQuoteObj.salesPersonId;
      //this.exchangeQuote.salesPersonId = getObjectById('value', this.exchangeQuoteObj.salesPersonId, this.allEmployeeList)//this.salesOrderQuoteObj.employeeId;
      this.isSpinnerVisible = false;
      if (initialCall) {
        this.getInitialDataForExchangeQuote();
      }
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  verifySalesQuoteConversion(results) {
    const resultsTemp = results;
    this.verifyExchangeSalesOrderQuoteObj = resultsTemp;
    this.exchangeSalesOrderConversionCriteriaObj = this.verifyExchangeSalesOrderQuoteObj.exchangeSalesOrderConversionCritera;
    this.exchangeSalesOrderConversionCriteriaObj.customerReference = "";
  }

  onPartsSaveEvent(savedParts) {
    if (savedParts) {
      this.marginSummary = this.exchangequoteService.getExchangeQuoteHeaderMarginDetails(savedParts, this.marginSummary);
      this.updateMarginSummary();
      console.log("summarydata",this.marginSummary);
      this.getExchQuoteInstance(this.id, true);
    }
  }

  onPartsApprovedEvent(approved: boolean) {
    if (approved) {
      this.selectedParts = [];
      this.getExchQuoteInstance(this.id, true);
    }
  }

  onTabChange(event) {
    if (event.index == 0) {
      this.exchangeQuotePartNumberComponent.refresh();
    }
    if (event.index == 1) {
      this.exchangeQuoteApproveComponent.refresh(this.exchangeQuote.exchangeQuoteId);
    }
    if (event.index == 2) {
      this.exchangeQuoteCustomerApprovalComponent.refresh(this.marginSummary, this.exchangeQuote.exchangeQuoteId);
    }
    if (event.index == 3) {
      this.showAddresstab = true;
    }
    if (event.index == 4) {
      if (this.exchangeQuote.statusName == "Open" || this.exchangeQuote.statusName == "Partially Approved") {
        this.exchangeQuoteFreightComponent.refresh(false);
      } else {
        this.exchangeQuoteFreightComponent.refresh(true);
      }
    }
    if (event.index == 5) {
      if (this.exchangeQuote.statusName == "Open" || this.exchangeQuote.statusName == "Partially Approved") {
        this.exchangeQuoteChargesComponent.refresh(false);
      } else {
        this.exchangeQuoteChargesComponent.refresh(true);
      }
    }
    if (event.index == 6) {
      this.exchangeQuoteAnalysisComponent.refresh(this.id);
    }
  }

  getMarginSummary() {
    this.exchangequoteService.getExchangeQuoteMarginSummary(this.id).subscribe(result => {
      this.setExchangeQuoteMarginSummary(result);
    }, error => {
      const errorLog = error;
    })
  }

  updateMarginSummary() {
    this.isSpinnerVisible = true;
    this.marginSummary.exchangeQuoteId = this.id;
    this.exchangequoteService.createExchangeQuoteMarginSummary(this.marginSummary).subscribe(result => {
      this.marginSummary.exchangeQuoteMarginSummaryId = result;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  setExchangeQuoteMarginSummary(data) {
    if (data) {
      this.marginSummary = data;
       this.totalCharges = this.marginSummary.otherCharges;
       this.totalFreights = this.marginSummary.freightAmount;
       this.totalcost = this.marginSummary.otherCost;
       this.exchangequoteService.setTotalCharges(this.marginSummary.otherCharges);
       this.exchangequoteService.setTotalFreights(this.marginSummary.freightAmount);
       this.exchangequoteService.setTotalcost(this.marginSummary.otherCost);
    } else {
      this.marginSummary = new ExchangeQUoteMarginSummary;
    }
  }

  saveExchangeQuoteChargesList(e) {
    this.modelcharges = e;
    this.totalCharges = this.modelcharges.amount;
    this.totalcost = this.modelcharges.cost;
    this.marginSummary.otherCharges = this.totalCharges;
    this.marginSummary.otherCost = this.totalcost;
    this.exchangequoteService.setTotalCharges(this.modelcharges.amount);
    this.exchangequoteService.setTotalcost(this.modelcharges.cost);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }
  public modelcharges = { amount: 0, cost: 0 };
  updateExchangeQuoteChargesList(e) {
    this.modelcharges = e;
    this.totalCharges = this.modelcharges.amount;
    this.totalcost = this.modelcharges.cost;
    this.exchangequoteService.setTotalCharges(this.modelcharges.amount);
    this.exchangequoteService.setTotalcost(this.modelcharges.cost);
    this.marginSummary.otherCharges = this.totalCharges;
    this.marginSummary.otherCost = this.totalcost;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  setFreightsOrCharges() {
    if (this.exchangequoteService.selectedParts && this.exchangequoteService.selectedParts.length > 0) {
      this.exchangequoteService.selectedParts.forEach((part, i) => {
        this.exchangequoteService.selectedParts[i].freight = this.totalFreights;
        this.exchangequoteService.selectedParts[i].misc = this.totalCharges;
      });
    }
    this.marginSummary = this.exchangequoteService.getExchangeQuoteHeaderMarginDetails(this.exchangequoteService.selectedParts, this.marginSummary);
  }
  closeModal() {
    this.modal.close();
  }
  initiatePrintProcess() {
    let content = this.exchangeQuotePrintPopup;
    this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
  }

  saveExchangeQuoteFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    this.exchangequoteService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateExchangeQuoteFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    this.exchangequoteService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('quote_print_content').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          input {width:80%;background:#fff;border:1px Solid}

  h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: 600; width: 100%; margin: 0;}
  h5{font-family: inherit;font-weight: 500;line-height: 1.1; color: inherit; background: #f4f4f4; color:#000 ;padding: 5px; font-size: 14px;margin-bottom: 15px;margin: 0 !important;padding: 5px;text-align:center }
  hr{margin-top: 10px; margin-bottom: 10px;border: 0;border-top: 1px solid #e0e0e0; height: 0; box-sizing: content-box;}
  .first-block {position: relative; min-height: 1px; float: left;padding-right: 2px; padding-left: 2px;width: 66.66666667%;}
  .first-block-4 {position: relative;min-height: 1px;float: left;padding-right: 2px; padding-left: 2px;}
  
  .picked-by{position: relative;float: left;width:48%}
  .confirmed-by{position: relative;float: left;width:48%}       
  .first-part{position:relative;display:flex;float:left;width:50%}   
.sixtydays{position:relative;
  display:inline-block;
  // display:flex;
  float:left;width:90%}
 .seond-part{position:relative;display:flex;float:right;width:24%}  

.first-block-address{margin-right: 20px;text-align: left}
.label-border{
  border: 1px solid black;
    width: 100%;
    text-align: left;
    line-height: 2;
    height:25px;
}
.margin-left-10{
  margin-left:10px;
}
.label-name{
  width:50%
}

  .first-block-quotation{margin-right: 20px;text-align: left;margin-top: 10px;}
  
  .first-block-name{margin-right: 20px}
  .second-block {position: relative;min-height: 1px;  float: left;padding-right: 2px;width: 32.33333333%;padding-left: 2px;box-sizing: border-box;}
  .second-block-div{margin: 2px 0;position: relative;min-height: 1px; float: left;padding-right: 2px; padding-left: 2px;width: 100%;}
  .second-block-label{position: relative; min-height: 1px;float: left;padding-right: 2px; padding-left: 2px;width: 38.33333333%;text-transform: capitalize;margin-bottom: 0; margin-top: 5px;}
  .second-block-value{position: relative;min-height: 1px;width: 58.33333333%; float: left;padding-right: 2px;padding-left: 2px;margin-top:4px;}
  .clear{clear: both;}
  .form-div{top: 6px; position: relative;font-weight: normal; margin-top: 10px;}
  .image{border: 1px solid #ccc; padding: 5px;}

  .mtop20 { margin-top: 20px;  }
  .logo-block { margin: auto; text-align: center }
  .pdf-block { width: 800px; margin: auto; border: 1px solid #ccc;padding: 25px 15px; } 
  .table-text{border: 1px solid #ccc; padding: 5px;height: 150px;}  
  .barcode-name{margin: 0 0 10px;}    


.input-field-border{width: 88px; border-radius:0px !important;background:#fff;border: none; border-bottom: 1px solid black;}

.pick-ticket-header{border: 1px solid black;text-align: left; background: #0d57b0 !important;color: #fff !important;}
.div-height{min-height:500px;height:auto}
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  initiateExchangeSalesOrderCoversion() {
    this.selectAllForConversion = true;
    this.exchangeSalesOrderConversionCriteriaObj.transferCharges = true;
    this.exchangeSalesOrderConversionCriteriaObj.transferFreight = true;
    this.exchangeSalesOrderConversionCriteriaObj.transferMemos = true;
    this.exchangeSalesOrderConversionCriteriaObj.transferNotes = true;
    this.exchangeSalesOrderConversionCriteriaObj.transferStockline = true;
    this.exchangeSalesOrderConversionCriteriaObj.reserveStockline = true;
    this.exchangeSalesOrderConversionCriteriaObj.customerReference = "";
    let content = this.exchangeQuoteConvertPopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  onActionSelectAllforconvversion() {
    if (this.selectAllForConversion) {
      this.exchangeSalesOrderConversionCriteriaObj.transferCharges = true;
      this.exchangeSalesOrderConversionCriteriaObj.transferFreight = true;
      this.exchangeSalesOrderConversionCriteriaObj.transferMemos = true;
      this.exchangeSalesOrderConversionCriteriaObj.transferNotes = true;
      this.exchangeSalesOrderConversionCriteriaObj.transferStockline = true;
      this.exchangeSalesOrderConversionCriteriaObj.reserveStockline = true;
    } else {
      this.exchangeSalesOrderConversionCriteriaObj.transferCharges = false;
      this.exchangeSalesOrderConversionCriteriaObj.transferFreight = false;
      this.exchangeSalesOrderConversionCriteriaObj.transferMemos = false;
      this.exchangeSalesOrderConversionCriteriaObj.transferNotes = false;
      this.exchangeSalesOrderConversionCriteriaObj.transferStockline = false;
      this.exchangeSalesOrderConversionCriteriaObj.reserveStockline = false;
    }
  }

  onChangeValidForDays() {
    let od = new Date(this.exchangeQuote.openDate);
    let validForDays = +this.exchangeQuote.validForDays;
    //let validForDays = 10;
    let ed = new Date(this.exchangeQuote.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.exchangeQuote.quoteExpireDate = ed;
    this.enableUpdateButton = false;
  }
  onChangeQuoteExpiryDate() {
    let od = new Date(this.exchangeQuote.openDate);
    let ed = new Date(this.exchangeQuote.quoteExpireDate);
    let Difference_In_Time = ed.getTime() - od.getTime();
    let Difference_In_Days = Math.floor(
      Difference_In_Time / (1000 * 3600 * 24)
    );
    this.exchangeQuote.validForDays = Difference_In_Days;
    this.enableUpdateButton = false;
  }
  onChangeOpenDate() {
    let od = new Date(this.exchangeQuote.openDate);
    let validForDays = +this.exchangeQuote.validForDays;
    let ed = new Date(this.exchangeQuote.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.exchangeQuote.quoteExpireDate = ed;
    this.enableUpdateButton = false;
  }
}
