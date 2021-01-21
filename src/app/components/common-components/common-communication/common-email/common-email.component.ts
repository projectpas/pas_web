import { Component, OnInit, ViewChild, Input, OnChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { CommunicationService } from '../../../../shared/services/communication.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { SalesQuoteService } from '../../../../services/salesquote.service';
import { DBkeys } from '../../../../services/db-Keys';
import { CommonService } from '../../../../services/common.service';
import { AuthService } from '../../../../services/auth.service';
import { emailPattern } from '../../../../validations/validation-pattern';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
    selector: 'app-common-email',
    templateUrl: './common-email.component.html',
    styleUrls: ['./common-email.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EmailCommonComponent implements OnInit, OnChanges {
    @Input() moduleId;
    @Input() CurrentModuleName;
    @Input() referenceId;
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    @Input() workOrderId: any;
    @Input() isView: boolean = false;
    @Input() selectedPartNumber: any = {};
    @Input() type: any;
    @Input() commonContactId: any;
    ContactList: any = [];
    emailPattern = emailPattern()
    modal: NgbModalRef;
    toEmail: any;
    cc: any;
    bcc: any;
    subject: any;
    emailBody: any;
    file: any;
    formData = new FormData()
    contactBy: any;
    createdBy: any;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    emailTypes: any[];
    emailType: number;
    data: any = [];
    headers = [
        { field: 'emailType', header: 'Email Type' },
        { field: 'toEmail', header: 'To Email' },
        { field: 'subject', header: 'Subject' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'contactDate', header: 'Contact Date' },
        // { field: 'createdDate', header: 'Created Date' },
        // { field: 'createdBy', header: 'Created By' },
        // { field: 'updatedDate', header: 'Updated Date' },
        // { field: 'updatedBy', header: 'Updated By' }
    ]
    selectedColumns = this.headers;
    addList: any = [];
    selectedOnly: boolean = false;
    targetData: any;
    employeeList: any = [];
    employeesOriginalData: any = [];
    emailViewData: any = {};
    @ViewChild("emailQuotePopup",{static:false}) public emailQuotePopup: ElementRef;
    pdfPath: any;
    customerContact: any;
    cusContactList: any;
    customerDetails: any = {};
    moduleName: any = "Communication";
    isSpinnerVisible: boolean = false;
    deletingRecord: any;
    constructor(private activeModal: NgbActiveModal,
        private communicationService: CommunicationService,
        private commonService: CommonService, private datePipe: DatePipe,
        private authService: AuthService, private modalService: NgbModal, private salesQuoteService: SalesQuoteService, private alertService: AlertService, private configurations: ConfigurationService) { }

    ngOnInit(): void {
        // if (this.isSubWorkOrder == true) {
        //     this.customerDetails = this.subWorkOrderDetails;
        //     this.partNo = this.subWOPartNoId;
        // } else {
        //     this.partNo = this.selectedPartNumber.workOrderPartNumberId

        //     if (this.salesQuoteId) {
        //         this.customerDetails = {
        //             customerName: this.customerInfoFromSalesQuote.customerName,
        //             customerCode: this.customerInfoFromSalesQuote.customerCode
        //         }
        //     } else {
        //         this.customerDetails = {
        //             customerName: this.savedWorkOrderData.customerId.customerName,
        //             customerCode: this.savedWorkOrderData.customerId.customerCode
        //         }
        //     }
        // }
        if (this.type == 1) {
            this.headers.unshift({ field: 'customerContact', header: 'Customer Contact' })
        } else {

            this.headers.unshift({ field: 'vendorContact', header: 'Customer Contact' })
        }
    }

    ngOnChanges(): void {
        if (this.isView == false) {
            this.getAllEmployees('');
            this.getAllEmailType('');
        }
        this.getAllEmail();
        this.moduleId = this.moduleId;
        this.referenceId = this.referenceId;
    }
    dismissModel() {
        this.modal.close();
    }
    filterCustomerContact(event): void {
        if (this.type == 1) {
            if (event.query !== undefined && event.query !== null) {
                this.customerContacts(event.query);
            } else {
                this.customerContacts('');
            }
        } else {
            if (event.query !== undefined && event.query !== null) {
                this.vendorContacts(event.query);
            } else {
                this.vendorContacts('');
            }
        }
    }
    setEditArray: any = [];
    customerContacts(value) {
        this.setEditArray = [];
        this.setEditArray.push(0);
        const strText = value ? value : '';
        this.commonService.autoDropListCustomerContacts(this.commonContactId, strText, 20, this.setEditArray.join()).subscribe(res => {
            this.ContactList = res.map(x => {
                return {
                    ...x,
                    contactId: x.contactId,
                    firstName: x.customerContactName
                }
            });
            this.cusContactList = this.ContactList;
        }, err => {
        });
    }
    vendorContacts(value) {
        this.setEditArray = [];
        this.setEditArray.push(0);
        const strText = value ? value : '';
        this.commonService.autoDropListVendorContacts(this.commonContactId, strText, 20, this.setEditArray.join()).subscribe(res => {
            this.ContactList = res.map(x => {
                return {
                    ...x,
                    contactId: x.vendorContactId,
                    firstName: x.vendoreContactName
                }
            });
            this.cusContactList = this.ContactList;
        }, err => {
        });
    }
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
    }
    addMemo() {
        this.isEditMode = false;
        this.formData = new FormData();
        if (this.ContactList.length > 0) {
            this.ContactList.forEach(
                (cc) => {
                    console.log("cc", cc);
                    this.customerContact = cc;
                    this.contactSelected(cc)
                    return;
                }
            )
        }
        this.bcc = "";
        this.cc = '';
        this.emailBody = '';
        this.contactBy = this.authService.currentEmployee;
        this.subject = '';
        this.emailTypes.forEach(
            (x) => {
                if (x.label == 'Manual') {
                    this.emailType = x.value;
                }
            }
        );
        this.fileUploadInput.clear();
        this.addList.push({ memoId: '', memo: '' })
    }
    contactSelected(event) {
        console.log("even", event)
        this.toEmail = event.email ? event.email : '';
    }
    showDeleteConfirmation(rowData) {
        this.deletingRecord = rowData;
    }
    delete(rowData) {
        this.isSpinnerVisible = true;
        this.communicationService.deleteCommonEmailList(rowData.emailId, this.userName).subscribe(() => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                this.moduleName,
                'Deleted Succesfully',
                MessageSeverity.success
            );
            this.getAllEmail();
        }, err => {
            this.errorMessageHandler();
        })
    }
    fileUpload(event) {
        for (let file of event.files)
            this.formData.append(file.name, file);
    }
    removeFile(event) {
        this.formData.delete(event.file.name)
    }
    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }
    send(isFormValid) {
        if (isFormValid) {
            if (this.CurrentModuleName == "SalesQuote") {
                let content = this.emailQuotePopup;
                this.getQuotePDF();
                this.modal = this.modalService.open(content, { size: "sm" });
            }
            else if (this.CurrentModuleName == "SalesOrder") {
                let content = this.emailQuotePopup;
                this.getSOPDF();
                this.modal = this.modalService.open(content, { size: "sm" });

            } else { 
                this.triggerMail();
            }
        }
    }
    triggerMailSalesQuote() {
        this.formData = new FormData();
        if (this.cc == undefined) {
            this.cc = ""
        }
        if (this.bcc == undefined) {
            this.bcc = ""
        }
        const data = {
            WorkOrderPartNo: this.selectedPartNumber.workOrderPartNumberId,
            fromEmail: DBkeys.FROM_EMAIL_FOR_SENDING_MAIL,
            toEmail: this.toEmail,
            masterCompanyId: this.authService.currentUser.masterCompanyId,
            cc: this.cc,
            bcc: this.bcc,
            subject: this.subject,
            emailBody: this.emailBody,
            moduleId: this.moduleId,
            referenceId: this.referenceId,
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: new Date(),
            updatedDate: new Date(),
            isActive: true,
            isDeleted: false,
            contactById: this.contactBy.employeeId,
            emailType: this.emailType,
            Type: this.type,
            customerContact: this.type == 1 ? this.customerContact.contactId : this.customerContact.contactId,
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        this.isSpinnerVisible = true;
        if (this.CurrentModuleName == "SalesQuote") {
            this.closeModal();
            $('#addNewMemo').modal('hide');
        }
        else if (this.CurrentModuleName == "SalesOrder") {
            this.closeModal();
            $('#addNewMemo').modal('hide');
        }

        this.communicationService.saveAndUpdateEmail(this.formData)
            .subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.contactBy = null;
                    this.emailType = null;
                    this.cc = '';
                    this.bcc = '';
                    this.toEmail = '';
                    this.emailBody = '';
                    this.subject = '';
                    if (this.CurrentModuleName != "SalesQuote") {
                        $('#addNewMemo').modal('hide');
                    }
                    this.alertService.showMessage("Success", `Successfully Sent Email`, MessageSeverity.success);
                    this.getAllEmail();

                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear();
                    }
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }
    triggerMail() {
        const data = {
            WorkOrderPartNo: this.partNo,
            fromEmail: DBkeys.FROM_EMAIL_FOR_SENDING_MAIL,
            toEmail: this.toEmail,
            masterCompanyId: this.authService.currentUser.masterCompanyId,
            cc: this.cc,
            bcc: this.bcc,
            subject: this.subject,
            emailBody: this.emailBody,
            moduleId: this.moduleId,
            referenceId: this.referenceId,
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: new Date(),
            updatedDate: new Date(),
            isActive: true,
            isDeleted: false,
            contactById: this.contactBy.employeeId,
            emailType: this.emailType,
            customerContactId: this.type == 1 ? this.customerContact.customerContactId : this.customerContact.vendorContactId,
            Type: this.type
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        this.isSpinnerVisible = true;
        $('#addNewMemo').modal('hide');
        this.communicationService.saveAndUpdateEmail(this.formData).subscribe(
            res => {
                this.isSpinnerVisible = false;
                this.contactBy = null;
                this.emailType = null;
                this.cc = '';
                this.bcc = '';
                this.toEmail = '';
                this.emailBody = '';
                this.subject = '';
                this.alertService.showMessage("Success", `Successfully Sent Email`, MessageSeverity.success);
                this.getAllEmail();
                if (this.CurrentModuleName == "SalesQuote") {
                    this.closeModal();
                }
            }, err => {
                this.errorMessageHandler();
            }
        )
    }
    emailView(data) {
        this.isSpinnerVisible = true;
        this.communicationService.getEmailDataByEmailId(data.emailId)
            .subscribe(
                (res) => {
                    this.isSpinnerVisible = false;
                    this.emailViewData = res;
                }, err => {
                    this.errorMessageHandler();
                }
            )

    }
    downloadFileUpload(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }

    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                contactDate: x.contactDate ?  this.datePipe.transform(x.contactDate, 'MMM-dd-yyyy hh:mm a'): '',
            
            }
        });
        dt.exportCSV();
    }
    closeDeleteModal() {
		$("#emaildownloadConfirmation").modal("hide");
	}
    getQuotePDF() {
        this.isSpinnerVisible = true;
        this.communicationService.soqsendmailpdfpreview(this.referenceId)
            .subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    this.pdfPath = res;
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }

    getSOPDF() {
        this.isSpinnerVisible = true;
        this.communicationService.sosendmailpdfpreview(this.referenceId)
            .subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    this.pdfPath = res;
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }
    arrayContactlist: any = []
    getAllEmployees(strText = '') {
        this.arrayContactlist.push(0);
        this.commonService.autoCompleteSmartDropDownEmployeeList('firstName', strText, true, this.arrayContactlist.join()).subscribe(res => {
            this.employeeList = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });

        }, err => {
            this.errorMessageHandler();
        })
    }
    filterEmployee(event): void {
        if (event.query !== undefined && event.query !== null) {
            this.getAllEmployees(event.query);
        } else {
            this.getAllEmployees('');
        }
    }
    filterEmployee1(event): void {
        this.employeeList = this.employeesOriginalData;
        if (event.query !== undefined && event.query !== null) {
            const employee = [...this.employeesOriginalData.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.employeeList = employee;
        }
    }
    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restoreRecord() {
        this.communicationService.restoreEmail(this.restorerecord.emailId, true, this.userName).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            this.errorMessageHandler();
        })
    }
    documentauditHisory: any = [];
    openHistory(rowData) {

        this.communicationService.getCOmmonEmailHistory(rowData.emailId).subscribe(
            results => {
                this.documentauditHisory = results;
            }, err => {
                this.errorMessageHandler();
            });
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.documentauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    dismissModelRestore() {
        this.modal.close();
    }
    getDeleteListByStatus(value) {        
        this.deletedStatusInfo = value ? value : false;
        this.getAllEmail();
    }
    deletedStatusInfo: boolean = false;
    partNo: any;
    dataOriginal:any=[];
    getAllEmail() {
        this.data = [];
        this.isSpinnerVisible = true;
        this.communicationService.getCommonEmailList(this.referenceId, this.moduleId, this.deletedStatusInfo, this.type)
            .subscribe(
                (res: any[]) => {

                    this.isSpinnerVisible = false;
                    if (res && res.length != 0) {
                        this.data = res.map(x => {
                            return {
                                ...x,
                                contactDate: x.contactDate ? this.datePipe.transform(x.contactDate, 'MM/dd/yyyy hh:mm a') : '',
                                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                            }
                        });
                    }            
                    this.dataOriginal = this.data;
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }
    getAllEmailType(value) {
        this.setEditArray = [];
        this.setEditArray.push(0);
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('EmailType', 'EmailTypeId', 'Name', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.emailTypes = res;
        }, err => {
            this.errorMessageHandler();
        });
    }
    isEditMode: any = false;
    editEmail(rowData) {
        this.toEmail = rowData.toEmail;
        this.cc = rowData.cc;
        this.bcc = rowData.bcc;
        this.subject = rowData.subject;
        this.emailBody = rowData.emailBody;
        this.contactBy = rowData.contactBy;
        this.emailType = rowData.emailType;
        this.isEditMode = true;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    closeModal() {
        this.modal.close();
        if (this.fileUploadInput) {
            this.fileUploadInput.clear();
        }
    }
    dismissModelHistory() {
        $('#contentHistDocs').modal('hide');
    }
    checkValidEmails() {
        let result = false;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.cc || this.bcc) {
            result = true;
            if (this.cc) {
                let emaillist = this.cc.split(',');
                let invalid = false;
                emaillist.forEach(x => {
                    if (!mailformat.test(x)) {
                        invalid = true;
                    }
                });
                if (invalid) {
                    return true;
                }
            }
            if (this.bcc) {
                let emaillist = this.bcc.split(',');
                let invalid = false;

                emaillist.forEach(x => {
                    if (!mailformat.test(x)) {
                        invalid = true;
                    }
                });
                if (invalid) {
                    return true;
                }
            }
            result = false;
        }
        return result;
    }
    errorMessageHandler() {
        this.isSpinnerVisible = false;
    }

    downloadFile(x) {}

    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.data = this.dataOriginal;
            const data = [...this.data.filter(x => {
                if (moment(x.contactDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'contactDate') {
                    return x;
                }
            })]
            this.data = data;
        } else {
            this.data = this.dataOriginal;
        }
    }
}
