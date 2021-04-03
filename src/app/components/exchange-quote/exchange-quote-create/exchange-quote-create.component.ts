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

    setTimeout(() => {
      this.getExchangeInstance(true);
    },1200);
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
      //this.getSalesOrderInstance(this.id, initialCall);
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

    let creditLimitTermsId = this.exchangeQuote.creditTermId ? this.exchangeQuote.creditTermId : 0;

    forkJoin(
      this.customerService.getCustomerCommonDataWithContactsById(this.customerId, this.exchangeQuote.customerContactId),
      this.commonservice.getCSRAndSalesPersonOrAgentList(this.currentUserManagementStructureId, this.customerId, this.exchangeQuote.customerServiceRepId, this.exchangeQuote.salesPersonId),
      this.commonservice.autoSuggestionSmartDropDownList("CreditTerms", "CreditTermsId", "Name", '', true, 200, [creditLimitTermsId].join())
      //this.salesQuoteService.getAllSalesOrderQuoteSettings()
      ).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        this.customerDetails = result[0];
        this.setCSRAndSalesPersonOrAgentList(result[1]);
        this.setCreditTerms(result[2]);
        //this.setValidDays(result[6]);
        this.getCustomerDetails();
        if (this.id) {
        } else {
          this.getDefaultContact();
        }
        //this.setCSR();
        this.setSalesPerson();
      }, error => {
        this.isSpinnerVisible = false;
      });
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

  getCustomerDetails() {
    this.exchangeQuote.customerId = this.customerId;
    this.exchangeQuote.customerName = this.customerDetails.name;
    //this.exchangeQuote.customerEmail = this.customerDetails.email;
    this.exchangeQuote.customerCode = this.customerDetails.customerCode;
    this.exchangeQuote.creditLimit = this.customerDetails.creditLimit;
    this.exchangeQuote.creditTermId = this.customerDetails.creditTermsId;
    this.customerInfoFromExchangeQuote = {
      customerName: this.customerDetails.name,
      customerCode: this.customerDetails.customerCode,
      customerId: this.customerDetails.customerId
    }
    if (!this.isEdit) {
      this.exchangeQuote.salesPersonId = this.customerDetails.primarySalesPersonId;
      this.exchangeQuote.customerServiceRepId = this.customerDetails.csrId;
    }

    //if (!this.id) {
      //this.exchangeQuote.contractReference = this.customerDetails.contractReference;
      //this.setValidDaysBasedOnSettings(false);
    //}
    //else {
      //this.setValidDaysBasedOnSettings(true);
    //}

    //this.setSalesPerson();
    //this.setCSR();
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
      this.exchangOrdereQuote.masterCompanyId = this.masterCompanyId;
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
      debugger;
      //this.exchangOrdereQuote.priorityId = this.exchangeQuote.priorityId;
      //this.exchangOrdereQuote.priorityId = getObjectById('value', this.exchangeQuote.priorityId, this.allPriorityInfo),
      this.exchangOrdereQuote.priorityId = this.exchangeQuote.priorityId ? this.getPriorityId(this.exchangeQuote.priorityId) : 0,
      //this.exchangOrdereQuote.priorityId = 1,
      //this.salesOrder.managementStructureId = this.salesQuote.managementStructureId;
      this.exchangOrdereQuote.creditLimit = this.exchangeQuote.creditLimit;
      this.exchangOrdereQuote.creditTermId = this.exchangeQuote.creditTermId;

      //this.exchangOrdereQuote.contractReference = this.salesQuote.contractReferenceName;

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

      // if (this.id) {
      //   if (invalidParts) {
      //     this.isSpinnerVisible = false;
      //     this.alertService.resetStickyMessage();
      //     this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
      //   } else if (invalidDate) {
      //     this.isSpinnerVisible = false;
      //     this.alertService.resetStickyMessage();
      //     this.alertService.showStickyMessage('Sales Order', "Please select valid Dates for Sales Order PartsList!", MessageSeverity.error);
      //   } else {
      //     this.marginSummary.salesOrderId = this.id;
      //     this.salesOrderService.createSOMarginSummary(this.marginSummary).subscribe(result => {
      //       this.marginSummary.soMarginSummaryId = result;
      //     });
      //     this.salesOrderService.update(this.salesOrderView).subscribe(data => {
      //       this.isSpinnerVisible = false;
      //       this.alertService.showMessage(
      //         "Success",
      //         `Sales Order updated successfully.`,
      //         MessageSeverity.success
      //       );
      //       this.getSalesOrderInstance(this.id, true);
      //       if (createNewVersion) {
      //         this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
      //       }
      //       this.toggle_po_header = false;
      //       if (this.isEdit) {
      //         this.isCreateModeHeader = false;
      //       }
      //       this.enableUpdateButton = true;
      //     }, error => {
      //       this.isSpinnerVisible = false;
      //       this.toggle_po_header = true;
      //     });
      //   }
      // } else {
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
          // if (this.exchangeCreateHeaderOrderId) {
          //   this.router.navigateByUrl(
          //     `salesmodule/salespages/sales-order-edit/${this.customerId}/${this.exchangeCreateHeaderOrderId}`
          //   );
          // }
          // if (!this.isCreateModeHeader) {
          //   this.router.navigateByUrl(`salesmodule/salespages/sales-quote-list`);
          // }
        }, error => {
          this.isSpinnerVisible = false;
          this.toggle_po_header = true;
        });
      //}
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
}