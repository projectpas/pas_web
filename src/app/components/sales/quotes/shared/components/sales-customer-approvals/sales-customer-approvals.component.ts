import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from "@angular/core";
import { ISalesOrderQuote } from "../../../../../../models/sales/ISalesOrderQuote";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { EmployeeService } from '../../../../../../services/employee.service';
import { AuthService } from '../../../../../../services/auth.service';
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { ActivatedRoute } from "@angular/router";
import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
import { DBkeys } from "../../../../../../services/db-Keys";
import { MessageSeverity, AlertService } from "../../../../../../services/alert.service";
import { SalesQuote } from "../../../../../../models/sales/SalesQuote.model";
import { SalesOrderQuote } from "../../../../../../models/sales/SalesOrderQuote";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomerService } from "../../../../../../services/customer.service";
import { StocklineViewComponent } from "../../../../../../shared/components/stockline/stockline-view/stockline-view.component";
declare var $: any;
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
import { CommonService } from "../../../../../../services/common.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { SOQuoteMarginSummary } from "../../../../../../models/sales/SoQuoteMarginSummary";
import { ApprovalProcessEnum } from "../../../models/approval-process-enum";
import { ApprovalStatusEnum, ApprovalStatusDescirptionEnum } from "../../../models/approval-status-enum";
import { ApprovalTaskEnum } from "../../../models/approval-task-enum";

@Component({
    selector: "app-sales-customer-approvals",
    templateUrl: "./sales-customer-approvals.component.html",
    styleUrls: ["./sales-customer-approvals.component.scss"]
})
export class SalesCustomerApprovalsComponent {
    salesOrderQuote: ISalesOrderQuote;
    @Input() salesQuoteView: ISalesQuoteView;
    @Input() customerContactList: any = [];
    @Output() quoteApprovedCheck = new EventEmitter();
    @Input() isViewMode: Boolean = false;;
    @Input() salesQuoteReference: any;
    @Input() customerIdFromQuoteList: Number;
    @Input() salesQuoteIdFromQuoteList: Number;
    @Input() marginSummary: MarginSummary;
    @Output('on-quote-parts-approved-event') onPartsApprovedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
    quotesList: any = [];
    @Input() approvers;
    customerId: number;
    isView: any;
    selectall: any;
    moduleName: string;
    isSpinnerVisible = false;
    quotesListPageSize: number = 10;
    defaultApprovalId = DBkeys.DEFAULT_SALES_QUOTE_APPROVAL_ID;
    fields: any;
    columns: any = [
        { field: 'actionStatus', header: 'Action', width: "150px" },
        { field: 'internalSentDate', header: 'Internal Sent Date', width: "100px" },
        { field: 'internalStatusId', header: 'Internal Status', width: "150px" },
        { field: 'internalMemo', header: 'Internal Memo  ', width: "150px" },
        { field: 'internalApprovedDate', header: 'Internal Approved Date ', width: "100px" },
        { field: 'internalApprovedBy', header: 'Internal Approved By', width: "100px" },
        { field: 'customerSentDate', header: 'Customer Sent Date', width: "100px" },
        { field: 'customerStatusId', header: 'Customer Status', width: "150px" },
        { field: 'customerMemo', header: 'Customer Memo', width: "150px" },
        { field: 'customerApprovedDate', header: 'Customer Approved Date', width: "100px" },
        { field: 'customerApprovedBy', header: 'Customer Approved By', width: "100px" },
        { field: 'partNumber', header: 'PN', width: "100px" },
        { field: 'partDescription', header: 'PN Description', width: "110px" },
        { field: 'qtyQuoted', header: 'Qty', width: "90px" },
        // { field: 'markupExtended', header: 'Mark Up Amt.', width: "90px" },
        // { field: 'discountAmount', header: 'Disc Amt.', width: "90px" },
        { field: 'netSales', header: 'Net Sales', width: "90px" },
        { field: 'unitCostExtended', header: 'Ext Cost', width: "90px" },
        { field: 'marginAmountExtended', header: 'Margin Amt.', width: "90px" },
        { field: 'marginPercentage', header: 'Margin %', width: "60px" },
    ];
    selectedColumns = this.columns;
    custColumns: any = [
        { field: 'actionStatus', header: 'Action', width: "150px" },
        { field: 'customerSentDate', header: 'Customer Sent Date', width: "100px" },
        { field: 'customerStatusId', header: 'Customer Status', width: "150px" },
        { field: 'customerMemo', header: 'Customer Memo', width: "150px" },
        { field: 'customerApprovedDate', header: 'Customer Approved Date', width: "100px" },
        { field: 'customerApprovedBy', header: 'Customer Approved By', width: "100px" },
        { field: 'partNumber', header: 'PN', width: "100px" },
        { field: 'partDescription', header: 'PN Description', width: "110px" },
        { field: 'qtyQuoted', header: 'Qty', width: "90px" },
        { field: 'netSales', header: 'Net Sales', width: "90px" },
        { field: 'unitCostExtended', header: 'Ext Cost', width: "90px" },
        { field: 'marginAmountExtended', header: 'Margin Amt.', width: "90px" },
        { field: 'marginPercentage', header: 'Margin %', width: "60px" },
    ];
    selectedCustColumns = this.custColumns;
    approveAllQuotes: Boolean = false;
    statusList: any = [];
    quotesListTemp: any = [];
    salesQuote: ISalesQuote;
    selectedParts: any[] = [];
    customerWarningData: any = [];
    modal: NgbModalRef;
    partModal: NgbModalRef;
    salesQuoteId: number;
    statusListForApproval = [];
    @ViewChild("customerApprovalConfirmationModal", { static: false })
    public customerApprovalConfirmationModal: ElementRef;
    disableSubmitButtonForCustomerApproval: boolean = false;
    Total: any[];
    defaultContactId: any;
    soqSettingsList: any;
    todayDate: Date = new Date();
    internalApprovaEnabled: boolean;

    constructor(private alertService: AlertService,
        private modalService: NgbModal,
        public employeeService: EmployeeService,
        private salesQuoteService: SalesQuoteService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private customerService: CustomerService,
        public commonService: CommonService) {
    }

    ngOnInit(): void {
        if (this.isViewMode == false) {
            this.customerId = +this.route.snapshot.paramMap.get("customerId");
            this.salesQuoteId = +this.route.snapshot.paramMap.get("id");
        } else {
            this.customerId = +this.customerIdFromQuoteList;
            this.salesQuoteId = +this.salesQuoteIdFromQuoteList;
        }
        this.selectedColumns = this.columns;
        this.setDefaultContact();
    }

    isInternalApprovaEnabled() {
        if (this.soqSettingsList != null &&
            (!this.soqSettingsList[0].isApprovalRule ||
                (this.soqSettingsList[0].isApprovalRule
                    && new Date(this.soqSettingsList[0].effectiveDate) > new Date(this.todayDate)))) {
            this.internalApprovaEnabled = false;
        }
        else {
            this.internalApprovaEnabled = true;
        }
    }

    get masterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : 1;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
    arrayApprovalStatuslst: any[] = [];
    refresh(marginSummary: SOQuoteMarginSummary, salesQuoteId, isViewMode = false, customerContactList = []) {
        this.isSpinnerVisible = true;
        this.isView = isViewMode;
        this.salesQuoteId = salesQuoteId;
        if (customerContactList && customerContactList.length > 0) {
            this.customerContactList = customerContactList;
            this.setDefaultContact();

        }
        if (this.arrayApprovalStatuslst.length == 0) {
            this.arrayApprovalStatuslst.push(0);
        }
        forkJoin(this.commonService.autoSuggestionSmartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name', '', true, 0, this.arrayApprovalStatuslst.join(), 0),
            this.salesQuoteService.approverslistbyTaskId(ApprovalTaskEnum.SalesQuoteApproval, this.salesQuoteId),
            this.salesQuoteService.getCustomerQuotesList(this.salesQuoteId),
            this.salesQuoteService.getAllSalesOrderQuoteSettings(this.masterCompanyId)).subscribe(response => {
                this.isSpinnerVisible = false;
                this.approvers = response[1];
                this.setApprovers(response[0])
                this.setApproverProcessdata(response[2]);
                this.soqSettingsList = response[3];
                this.isInternalApprovaEnabled();
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    onApprovalSelected(approver, i) {
        if (approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
            if (this.defaultContactId) {
                this.quotesList[i].customerApprovedById = this.defaultContactId;
            } else {
                this.quotesList[i].customerApprovedById = '';
            }

            this.quotesList[i].customerApprovedDate = new Date();
        }
        else if (approver.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) {
            this.quotesList[i].internalSentDate = new Date();
        }
        else if (approver.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
            this.quotesList[i].internalApprovedDate = new Date();
        }
        else if (approver.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
            this.quotesList[i].customerSentDate = new Date();
        }
    }

    setDefaultContact() {
        if (this.customerContactList) {
            if (this.customerContactList.length > 0) {
                for (let i = 0; i < this.customerContactList.length; i++) {
                    let isDefaultContact = this.customerContactList[i].isDefaultContact;
                    if (isDefaultContact) {
                        this.defaultContactId = this.customerContactList[i].contactId;
                    }
                }
            }
        }
    }

    setApprovers(res) {
        this.statusList = res.map(x => {
            return {
                ...x,
                statusId: x.value,
                name: x.label
            };
        });
        this.setStatusListForApproval(this.statusList);
    }

    getApproverStatusList() {
        if (this.arrayApprovalStatuslst.length == 0) {
            this.arrayApprovalStatuslst.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name', '', true, 0, this.arrayApprovalStatuslst.join(), 0).subscribe(res => {
            this.statusList = res.map(x => {
                return {
                    ...x,
                    statusId: x.value,
                    name: x.label
                };
            });
            this.setStatusListForApproval(this.statusList);
        })
    }

    getPartToDisableOrNot(part) {
        if (part.actionStatus != 'Approved') {
            if (part.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) {
                return true;
            } else if (part.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
                if (this.approvers && this.approvers.length > 0) {
                    let approverFound = this.approvers.find(approver => approver.approverId == this.employeeId && approver.isExceeded == false);
                    if (approverFound) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if (part.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
                return true;
            } else if (part.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    setStatusListForApproval(statusList) {
        let tempList = [];

        if (statusList && statusList.length > 0) {
            for (let i = 0; i < statusList.length; i++) {
                if (statusList[i].name === ApprovalStatusDescirptionEnum.Approved) {
                    tempList.push(statusList[i]);
                } else if (statusList[i].name === ApprovalStatusDescirptionEnum.Rejected) {
                    tempList.push(statusList[i]);
                }
            }
        }
        this.statusListForApproval = tempList;
    }

    getCustomerQuotesList() {
        this.isSpinnerVisible = true;
        this.salesQuoteService
            .getCustomerQuotesList(this.salesQuoteId)
            .subscribe(data => {
                this.isSpinnerVisible = false;
                this.setApproverProcessdata(data);
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    setApproverProcessdata(data) {
        this.quotesList = data[0];

        for (let i = 0; i < this.quotesList.length; i++) {
            this.quotesList[i]['soqSettingApprovalRule'] = false;
            this.quotesList[i]['createdBy'] = DBkeys.UPDATED_BY;
            this.quotesList[i]['updatedBy'] = DBkeys.UPDATED_BY;
            this.quotesList[i]['isSelected'] = this.quotesList[i].statusId == (ApprovalStatusEnum.WaitingForApproval || ApprovalStatusEnum.WaitingForApproval.toString()) ? true : false;
            this.quotesList[i]['tempStatusId'] = this.quotesList[i].statusId;
            this.quotesList[i].openDate = new Date(this.quotesList[i].openDate);
            this.quotesList[i].createdOn = new Date(this.quotesList[i].createdOn);
            this.quotesList[i].approvedDate = new Date(this.quotesList[i].approvedDate);
            this.quotesList[i].quoteExpireDate = new Date(this.quotesList[i].quoteExpireDate);
            this.quotesList[i].approvalDate = new Date(this.quotesList[i].approvalDate);
            this.quotesList[i].statusChangeDate = new Date(this.quotesList[i].statusChangeDate);
            this.quotesList[i].approvedContactId = this.quotesList[i].statusId == (ApprovalStatusEnum.WaitingForApproval || ApprovalStatusEnum.WaitingForApproval.toString()) ? this.quotesList[i].approvedContactId : null;
            if (this.quotesList[i].internalSentDate) {
                this.quotesList[i].internalSentDate = new Date(this.quotesList[i].internalSentDate);
                // if (!this.quotesList[i].internalApprovedDate) {
                //     this.quotesList[i].internalApprovedDate = new Date();
                // }
            }
            // else if (!this.quotesList[i].internalSentDate) {
            //     this.quotesList[i].internalSentDate = new Date();
            // }

            if (this.quotesList[i].customerSentDate) {
                this.quotesList[i].customerSentDate = new Date(this.quotesList[i].customerSentDate);
                // if (!this.quotesList[i].customerApprovedDate) {
                //     this.quotesList[i].customerApprovedDate = new Date();
                // }
            }
            // else {
            //     if (this.quotesList[i].approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
            //         this.quotesList[i].customerSentDate = new Date();
            //     }
            // }
            if (this.quotesList[i].internalApprovedDate) {
                this.quotesList[i].internalApprovedDate = new Date(this.quotesList[i].internalApprovedDate);
                // if (!this.quotesList[i].customerSentDate) {
                //     this.quotesList[i].customerSentDate = new Date();
                // }
            }
            if (this.quotesList[i].customerApprovedDate) {
                this.quotesList[i].customerApprovedDate = new Date(this.quotesList[i].customerApprovedDate);
            }
        }
    }

    getInternalSentMaxDate(sentDate) {
        let sDate = new Date(sentDate);
        if (new Date() > sDate) {
            return sDate;
        }
        return new Date();
    }

    getInternalSentMinDate(openDate) {
        return new Date(openDate);
    }

    getInternalApprovedMaxDate() {
        return new Date();
    }

    getCustomerSentMinDate(intApprovedDate) {
        if (intApprovedDate) {
            return new Date(intApprovedDate);
        }
        return;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    selectAllApproval(type, isSelected) {
        this.quotesList.forEach(
            (x, i) => {
                let disableEdit = this.getPartToDisableOrNot(x);
                if (disableEdit) {
                    x.isSelected = !isSelected;
                    this.onApprovalSelected(x, i);
                }
            }
        )
    }

    getAllPartsToDisableOrNot() {
        var result = false;
        if (this.quotesList && this.quotesList.length > 0) {
            this.quotesList.forEach(
                (x) => {
                    if (x.actionStatus != 'Approved') {
                        if (x.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) {
                            result = true;
                        } else if (x.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
                            if (this.approvers && this.approvers.length > 0) {
                                let approverFound = this.approvers.find(approver => approver.approverId == this.employeeId && approver.isExceeded == false);
                                if (approverFound) {
                                    result = true;
                                }
                            }
                        } else if (x.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
                            result = true;
                        } else if (x.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
                            result = true;
                        }
                    }
                }
            )
        }

        return result;
    }

    checkAnyRowSelected() {
        var result = false;
        var keepGoing = true;
        if (this.quotesList && this.quotesList.length > 0) {
            this.quotesList.forEach(
                (x) => {
                    if (keepGoing) {
                        if (x.isSelected) {
                            result = true;
                            keepGoing = false;
                        }
                    }
                }
            )
        }

        return result;
    }

    viewSelectedRow(content, row) {
        const { salesQuoteId } = row;
        let customerId = row.customerId;
        this.salesQuote = new SalesQuote();
        this.salesOrderQuote = new SalesOrderQuote();
        this.selectedParts = [];
        this.getCustomerWarningsData(customerId);
        this.modal = this.modalService.open(content, { size: "lg" });
    }

    async getCustomerWarningsData(customerId) {
        await this.customerService
            .getCustomerWarningsById(customerId)
            .subscribe(res => {
                this.customerWarningData = res;
            });
    }

    onChangeOfQuoteCheckbox(event, rowdata) {
        rowdata.statusId = event ? DBkeys.DEFAULT_SALES_QUOTE_APPROVAL_ID : rowdata.tempStatusId;
    }

    viewSelectedStockLine(rowData, content) {
        if (rowData.stockLineId) {
            this.partModal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
            this.partModal.componentInstance.stockLineId = rowData.stockLineId;
        }
    }

    dismissViewModel() {
        this.partModal.close();
    }

    openConfirmationModal() {
        if (this.hasPartsSelected()) {
            this.modal = this.modalService.open(this.customerApprovalConfirmationModal, { size: "sm" });
        }
    }

    closeConfirmationModal() {
        if (this.modal) {
            this.modal.close();
        }
    }

    hasPartsSelected() {
        var result = this.quotesList.filter(item => !this.isApproved(item.tempStatusId)) || [];
        return result.length > 0;
    }

    isApproved(statusId: number) {
        return statusId == DBkeys.DEFAULT_SALES_QUOTE_APPROVAL_ID;
    }

    canDisplayInDropDown(status: any) {
        return status.displayInDropdown && (status.id === ApprovalStatusEnum.Pending || status.id === ApprovalStatusEnum.WaitingForApproval);
    }

    saveApprovalProcess() {
        let openEmail = false;
        if (this.approvers && this.approvers.length > 0) {
            this.approvers.forEach(
                x => {
                    if (x.isSelected && x.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
                        openEmail = true;
                    }
                }
            )
        }
        if (openEmail) {
            $('#quoteVersion').modal('show');
        }
        else {
            this.saveApprovalData();
        }
    }

    saveApprovalData() {
        let payLoad = [];
        let currentEmployee = this.employeeId;
        let mastercompanyid = this.currentUserMasterCompanyId;
        let approvedParts = 0;
        let hasError = false;
        let validmessages = '';
        this.quotesList.forEach(
            x => {
                if (x.isSelected) {
                    let validmessage = this.validateApprovalData(x);
                    if (validmessage.length > 0) {
                        hasError = true;
                        validmessages += validmessage;
                        return;
                    }
                    if (x.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
                        approvedParts = + 1;
                    }
                    let obj = {
                        "SalesOrderQuoteId": x.salesOrderQuoteId,
                        "SalesOrderQuotePartId": x.salesOrderQuotePartId,
                        "CustomerId": x.customerId,
                        "ApprovedContactId": x.approvedContactId,
                        "InternalSentDate": x.internalSentDate,
                        "InternalApprovedDate": x.internalApprovedDate,
                        "CustomerSentDate": x.customerSentDate,
                        "CustomerApprovedDate": x.customerApprovedDate,
                        "CustomerApprovedById": x.customerApprovedById,
                        "InternalStatusId": x.internalStatusId,
                        "CustomerStatusId": x.customerStatusId,
                        "InternalMemo": x.internalMemo,
                        "CustomerMemo": x.customerMemo,
                        "UpdatedBy": this.userName,
                        "salesOrderQuoteApprovalId": x.salesOrderQuoteApprovalId,
                        "ApprovalActionId": x.approvalActionId,
                        "IsInternalApprove": x.isInternalApprove,
                        "createdBy": this.userName,
                        "createdDate": new Date().toDateString(),
                        "updatedDate": new Date().toDateString(),
                        "isActive": true,
                        "isDeleted": false
                    }
                    obj['masterCompanyId'] = mastercompanyid;
                    if (x.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) { // Sent for Internal Approvals
                        obj['InternalEmails'] = this.getApproversEmails();
                        obj['approvers'] = this.getApproversNames();
                    }
                    else {
                        obj['InternalEmails'] = "";
                        obj['approvers'] = "";
                    }
                    if (x.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
                        obj['InternalApprovedById'] = this.employeeId;
                    }
                    else {
                        obj['InternalApprovedById'] = x.internalApprovedById;
                    }
                    payLoad.push(obj);
                }
            }
        )
        if (hasError) {
            this.alertService.showMessage(
                this.moduleName,
                validmessages,
                MessageSeverity.error
            );
            return;
        }
        this.isSpinnerVisible = true;
        this.salesQuoteService.sentForInternalApproval(payLoad)
            .subscribe(
                res => {
                    $('#quoteVersion').modal('hide');
                    this.alertService.showMessage(
                        "Success",
                        `Saved Approver Process Successfully`,
                        MessageSeverity.success
                    );
                    this.isSpinnerVisible = false;
                    if (approvedParts > 0) {
                        this.onPartsApprovedEvent.emit(true);
                    }
                    this.getCustomerQuotesList();
                    this.selectall = false;
                },
                err => {
                    this.isSpinnerVisible = false;
                }
            )
    }

    validateApprovalData(x) {
        var str = '';
        if (x.approvalActionId == ApprovalProcessEnum.SentForInternalApproval) {
            if (!x.internalSentDate) {
                str += 'internal sent date is required <br/>';
            }
        }
        else if (x.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
            if (!(x.internalStatusId == ApprovalStatusEnum.Approved
                || x.internalStatusId == ApprovalStatusEnum.Rejected)) {
                str += 'internal status is required<br/>';
            }
            if (!x.internalApprovedDate) {
                str += 'internal approved date is required<br/>';
            }
        }
        else if (x.approvalActionId == ApprovalProcessEnum.SentForCustomerApproval) {
            if (!x.customerSentDate) {
                str += 'Customer sent date is required<br/>';
            }
        }
        else if (x.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
            if (!(x.customerStatusId == ApprovalStatusEnum.Approved
                || x.customerStatusId == ApprovalStatusEnum.Rejected)) {
                str += 'Customer status is required<br/>';
            }
            if (!x.customerApprovedDate) {
                str += 'Customer approved date is required<br/>';
            }
            if (x.customerStatusId == ApprovalStatusEnum.Approved) {
                if (!x.customerMemo) {
                    str += 'Customer memo is required<br/>';
                }
            }
            if (!x.customerApprovedById) {
                str += 'Customer Approved by is required<br/>';
            }
        }
        return str;
    }

    getApproversNames() {
        let result = '';
        if (this.approvers && this.approvers.length > 0) {
            this.approvers.forEach(
                (x) => {
                    if (result != '') {
                        result += ','
                    }
                    result += x.approverName;
                }
            )
        }
        return result;
    }

    getApproversEmails() {
        let result = '';
        if (this.approvers && this.approvers.length > 0) {
            return this.approvers[0].approverEmails;
        }
        return result;
    }

    getApprovalActionInternalStatus(approver) {
        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitInternalApproval) {
            return true;
        } else {
            return false;
        }
    }

    getApprovalActionCustomerStatus(approver) {
        if (approver.isSelected && approver.approvalActionId == ApprovalProcessEnum.SubmitCustomerApproval) {
            return true;
        } else {
            return false;
        }
    }

    memoIndex;
    memoType;
    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        this.memoType = material;
        this.textAreaInfo = this.quotesList[index][material];
    }

    textAreaInfo: any;
    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            this.quotesList[this.memoIndex][this.memoType] = this.textAreaInfo;
        }
        $("#memo-popup").modal("hide");
    }

    onCloseTextAreaInfo() {
        $("#memo-popup").modal("hide");
    }

    getInternalSentDateEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SentForInternalApproval;
    }

    getinternalStatusIdEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SubmitInternalApproval;
    }

    getcustomerSentDateEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SentForCustomerApproval;
    }

    getcustomerStatusIdEnableStatus(approver) {
        return !approver.isSelected || approver.approvalActionId != ApprovalProcessEnum.SubmitCustomerApproval;
    }

    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
}