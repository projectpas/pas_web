
import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { CommunicationService } from '../../../../../shared/services/communication.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { CommonService } from '../../../../../services/common.service'
import { DBkeys } from '../../../../../services/db-Keys';
import { AuthService } from '../../../../../services/auth.service';
import { SalesQuoteService } from '../../../../../services/salesquote.service';
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { ConfigurationService } from '../../../../../services/configuration.service';


@Component({
    selector: 'app-e-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})

export class EmailComponent implements OnInit, OnChanges {
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    @Input() customerInfoFromSalesQuote: any = {};
    @Input() workOrderId: any;
    @Input() salesQuoteId: any = null;
    @Input() SalesOrderId: any = null;
    @Input() isViewFromWO: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() customerContactList: any = [];
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
    isView = false;
    defaultPrimaryEmail = "";

    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    // employees: any[];
    emailTypes: any[];
    emailType: number;
    data: any = [];
    headers = [
        { field: 'emailType', header: 'Email Type' },
        { field: 'subject', header: 'Subject' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'contactDate', header: 'Contact Date' }
    ]
    selectedColumns = this.headers;
    addList: any = [];
    employeeList: any = [];
    employeesOriginalData: any = [];
    emailViewData: any = {};
    moduleId: any = 0;
    referenceId: any = 0;
    @ViewChild("emailQuotePopup",{static:false}) public emailQuotePopup: ElementRef;
    pdfPath: any;
    customerContact: any;
    cusContactList: any;
    customerDetails: any = {};
    customerId: any;
    customerContactCCList: any = [];
    emailPattern: any;

    constructor(private activeModal: NgbActiveModal, private communicationService: CommunicationService, private employeeService: EmployeeService, private commonService: CommonService, private authService: AuthService, private modalService: NgbModal, private salesQuoteService: SalesQuoteService, private alertService: AlertService, private configurations: ConfigurationService) { }

    ngOnInit(): void {

        // console.log("email clint inputs", this.salesQuoteId,this.SalesOrderId,this.customerInfoFromSalesQuote)
        if (this.salesQuoteId) {
            this.moduleId = DBkeys.SALES_ORDER_QUOTE_MODULE_ID;
            this.referenceId = this.salesQuoteId;
        }
        if (this.SalesOrderId) {
            this.customerDetails = {
                customerName: this.customerInfoFromSalesQuote.customerName,
                customerCode: this.customerInfoFromSalesQuote.customerCode
            }
            this.customerId = this.customerInfoFromSalesQuote.customerId;
            this.moduleId = DBkeys.SALES_ORDER__MODULE_ID;
            this.referenceId = this.SalesOrderId;
        }
        this.customerDetails = {
            customerName: this.customerInfoFromSalesQuote.customerName,
            customerCode: this.customerInfoFromSalesQuote.customerCode
        }
        this.customerId = this.customerInfoFromSalesQuote.customerId;
        this.getContactDetailsById(this.customerId);
        this.getAllEmployees();
        this.getAllEmail();
        this.getAllEmailType();
    }

    getContactDetailsById(id) {
        this.commonService.getCustomerContactsById(id,this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.customerContactList = res;
            for (let i = 0; i < this.customerContactList.length; i++) {
                this.customerContactList[i]['contactName'] = this.customerContactList[i].firstName + " " + this.customerContactList[i].lastName;
            }
        })
    }

    ngOnChanges(): void {
        this.getAllEmail();
    }


    dismissModel() {
        this.activeModal.close();
    }

    loadData(event) {

        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        // this.getList(event)
    }
    addMemo() {
        this.formData = new FormData();
        // this.formData.delete()
        // this.customerContact = "";
        if (this.customerContactList && this.customerContactList.length > 0) {
            this.customerContactCCList = [];
            for (let i = 0; i < this.customerContactList.length; i++) {
                if (this.customerContactList[i].isDefaultContact == true) {
                    this.customerContact = this.customerContactList[i];
                    this.contactSelected(this.customerContactList[i])
                } else {
                    this.customerContactCCList.push(this.customerContactList[i].email);
                }
            }
        }

        // this.toEmail = "";
        this.bcc = "";
        this.cc = '';
        this.emailBody = '';
        this.contactBy = '';
        this.subject = '';
        if (this.emailTypes && this.emailTypes.length > 0) {
            this.emailTypes.forEach(
                (x) => {
                    if (x.label == 'Manual') {
                        this.emailType = x.value;
                    }
                }
            );
        }
        this.addList.push({ memoId: '', memo: '' })
    }

    onChangeToEmail() {
        if (this.customerContactList && this.customerContactList.length > 0) {
            this.customerContactCCList = [];
            for (let i = 0; i < this.customerContactList.length; i++) {
                if (this.customerContactList[i].isDefaultContact == true) {
                    if (this.toEmail != this.defaultPrimaryEmail) {
                        this.customerContactCCList.push(this.customerContactList[i].email);
                    }
                } else {
                    this.customerContactCCList.push(this.customerContactList[i].email);
                }
            }
        }
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
            if (this.salesQuoteId) {
                let content = this.emailQuotePopup;
                this.getQuotePDF()
                this.modal = this.modalService.open(content, { size: "sm" });
                this.modal.result.then(
                    () => {
                        console.log("When user closes");
                    },
                    () => {
                        console.log("Backdrop click");
                    }
                )
            } else { //Work Order
                this.triggerMail()
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
            masterCompanyId: 1,
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
            isCommunicationTab: true
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }

        this.communicationService.saveAndUpdateEmailOfSalesQuote(this.formData)
            .subscribe(
                res => {
                    this.contactBy = null;
                    this.emailType = null;
                    this.cc = '';
                    this.bcc = '';
                    this.toEmail = '';
                    this.emailBody = '';
                    this.subject = '';
                    $('#addNewMemo').modal('hide');
                    this.getAllEmail();
                    if (this.salesQuoteId) {
                        this.closeModal();
                    }
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear();
                    }
                }
            )
    }

    triggerMail() {
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
            masterCompanyId: 1,
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
            customerContactId: this.customerContact.contactId,
            isCommunicationTab: true
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }

        this.communicationService.saveAndUpdateEmailOfSalesOrder(this.formData)
            .subscribe(
                res => {
                    this.contactBy = null;
                    this.emailType = null;
                    this.cc = '';
                    this.bcc = '';
                    this.toEmail = '';
                    this.emailBody = '';
                    this.subject = '';
                    $('#addNewMemo').modal('hide');
                    this.getAllEmail();
                    if (this.salesQuoteId) {
                        this.closeModal();
                    }
                }
            )
    }

    // getAllEmployees() {
    //     this.employeeService.getEmployeeList()
    //         .subscribe(
    //             (res: any[]) => {
    //                 this.employees = res[0];
    //             }
    //         )
    // }
    emailView(data) {
        this.emailViewData = data;
        this.isView = true;
    }
    downloadFileUpload(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }

    getQuotePDF() {
        this.communicationService.soqsendmailpdfpreview(this.salesQuoteId)
            .subscribe(
                (res: any) => {
                    this.pdfPath = res;
                }
            )
    }


    getAllEmployees() {
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName').subscribe(res => {
            console.log("Employee details:", res);
            this.employeesOriginalData = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        })
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

    filterCustomerContact(event): void {
        this.cusContactList = this.customerContactList;
        if (event.query !== undefined && event.query !== null && event.query !== "") {
            const customers = [...this.customerContactList.filter(x => {
                return x.contactName.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.cusContactList = customers;
        }
    }
    getAllEmail() {
        //

        this.communicationService.getEmailList(this.referenceId, this.moduleId, this.selectedPartNumber.workOrderPartNumberId,1)
            .subscribe(
                (res: any[]) => {
                    this.data = res;
                    console.log("response all emails", this.data);
                }
            )
    }

    getAllEmailType() {
        this.commonService.smartDropDownList('EmailType', 'EmailTypeId', 'Name')
            .subscribe(
                (res: any[]) => {
                    this.emailTypes = res;
                }
            )
    }
    editEmail(rowData) {
        this.toEmail = rowData.toEmail;
        this.cc = rowData.cc;
        this.bcc = rowData.bcc;
        this.subject = rowData.subject;
        this.emailBody = rowData.emailBody;
        this.contactBy = rowData.contactBy;
        this.emailType = rowData.emailType;
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
    contactSelected(event) {
        this.toEmail = event.email;
        this.defaultPrimaryEmail = event.email;
    }
    checkValidEmails() {
        let result = false;
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.cc || this.bcc || this.toEmail) {
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
            if (this.toEmail) {
                let invalid = false;
                if (!mailformat.test(this.toEmail)) {
                    invalid = true;
                }
                if (invalid) {
                    return true;
                }
            }
            result = false;
        }
        return result;
    }

}
