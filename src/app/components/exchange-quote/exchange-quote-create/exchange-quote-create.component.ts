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
  markupList = [];
  percents: any[];
  @ViewChild("exchangeQuotePrintPopup", { static: false }) public exchangeQuotePrintPopup: ElementRef;
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
      this.exchangequoteService.getAllExchangeQuoteSettings()).subscribe(result => {
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
      //this.onChangeValidForDays();
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
          //this.exchangeQuote.validForDays = validDaysObject.validDays;
          //this.exchangeQuote.type = validDaysObject.typeId.toString();
          this.exchangeQuote.statusId = validDaysObject.defaultStatusId;
          this.exchangeQuote.statusName = validDaysObject.defaultStatusName;
        }
        this.exchangeQuote.cogs = validDaysObject.cogs;
        this.exchangeQuote.daysForCoreReturn = validDaysObject.daysForCoreReturn;
        //this.defaultSettingPriority = validDaysObject.defaultPriorityId;
      } 
      else {
        this.exchangeQuote.type = "1";
      }
    } 
    else {
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
      //this.salesQuote.validForDays = this.salesOrderQuoteObj.validForDays;
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
      // this.totalFreights = this.marginSummary.freightAmount;
       this.exchangequoteService.setTotalCharges(this.marginSummary.otherCharges);
      // this.salesQuoteService.setTotalFreights(this.marginSummary.freightAmount);
    } else {
      this.marginSummary = new ExchangeQUoteMarginSummary;
    }
  }

  saveExchangeQuoteChargesList(e) {
    this.totalCharges = e;
    this.marginSummary.otherCharges = this.totalCharges;
    this.exchangequoteService.setTotalCharges(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateExchangeQuoteChargesList(e) {
    this.totalCharges = e;
    this.exchangequoteService.setTotalCharges(e);
    this.marginSummary.otherCharges = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  setFreightsOrCharges() {
    debugger;
    if (this.exchangequoteService.selectedParts && this.exchangequoteService.selectedParts.length > 0) {
      this.exchangequoteService.selectedParts.forEach((part, i) => {
        //this.exchangequoteService.selectedParts[i].freight = this.totalFreights;
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
}
