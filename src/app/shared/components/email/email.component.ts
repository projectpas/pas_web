import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { CommunicationService } from '../../services/communication.service';
import { EmployeeService } from '../../../services/employee.service';
import { CommonService } from '../../../services/common.service'
import { DBkeys } from '../../../services/db-Keys';
import { AuthService } from '../../../services/auth.service';
import { SalesQuoteService } from '../../../services/salesquote.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';


@Component({
    selector: 'app-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss'],
    encapsulation: ViewEncapsulation.None
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
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder: any = false;
    @Input() subWOPartNoId;
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
    moduleName: any = "Communication";
    isSpinnerVisible: boolean = false;
    deletingRecord: any;

    constructor(private activeModal: NgbActiveModal, private communicationService: CommunicationService, private employeeService: EmployeeService, private commonService: CommonService, private authService: AuthService, private modalService: NgbModal, private salesQuoteService: SalesQuoteService, private alertService: AlertService, private configurations: ConfigurationService) { }

    ngOnInit(): void {
        if (this.isSubWorkOrder == true) {
            this.customerDetails = this.subWorkOrderDetails;
            this.referenceId = this.subWorkOrderDetails.subWorkOrderId;
            this.moduleId = 60;
            this.partNo = this.subWOPartNoId;
        } else {
            this.partNo = this.selectedPartNumber.workOrderPartNumberId

            if (this.salesQuoteId) {
                this.customerDetails = {
                    customerName: this.customerInfoFromSalesQuote.customerName,
                    customerCode: this.customerInfoFromSalesQuote.customerCode
                }
                this.moduleId = DBkeys.SALES_ORDER_QUOTE_MODULE_ID;
                this.referenceId = this.salesQuoteId;
            } else {
                this.customerDetails = {
                    customerName: this.savedWorkOrderData.customerId.customerName,
                    customerCode: this.savedWorkOrderData.customerId.customerCode
                }
                this.moduleId = DBkeys.WORK_ORDER_MODULE_ID;
                this.referenceId = this.workOrderId;
            }
        }
        this.getAllEmployees();
        this.getAllEmail();
        this.getAllEmailType();
    }

    ngOnChanges(): void {
        // this.getAllEmail();
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
    }
    addMemo() {
        this.formData = new FormData();
        console.log("email", this.customerContactList);
        if (this.customerContactList.length > 0) {
            for (let i = 0; i < this.customerContactList.length; i++) {
                if (this.customerContactList[i].isDefaultContact == true) {
                    this.customerContact = this.customerContactList[i];
                    this.contactSelected(this.customerContactList[i])
                }
            }
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
    showDeleteConfirmation(rowData) {
        this.deletingRecord = rowData;
    }
    delete(rowData) {
        this.isSpinnerVisible = true;
        this.communicationService.deleteEmailList(rowData.emailId).subscribe(() => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                this.moduleName,
                'Deleted Succesfully',
                MessageSeverity.success
            );
            this.getAllEmail();
        },
            (err) => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
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
            if (this.salesQuoteId) {
                let content = this.emailQuotePopup;
                this.getQuotePDF()
                this.modal = this.modalService.open(content, { size: "sm" });
              
            }
            else if (this.SalesOrderId) {
                let content = this.emailQuotePopup;
                this.getSOPDF()
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
            isCommunicationTab: false
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        this.isSpinnerVisible = true;
        this.closeModal();
        this.communicationService.saveAndUpdateEmailOfSalesQuote(this.formData)
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
                    $('#addNewMemo').modal('hide');
                    this.getAllEmail();
                    // if (this.salesQuoteId) {
                        this.closeModal();
                    // }
                    if (this.fileUploadInput) {
                        this.fileUploadInput.clear();
                    }
                },
                err => {
                    this.errorHandling(err)
                }
            )
    }

    triggerMail() {
        if (this.isSubWorkOrder == true) {
            this.moduleId = 60;
        }
        const data = {
            WorkOrderPartNo: this.partNo,
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
            customerContactId: this.customerContact.contactId
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        this.isSpinnerVisible = true;
        $('#addNewMemo').modal('hide');
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
                    this.getAllEmail();
                    if (this.salesQuoteId) {
                        this.closeModal();
                    }
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
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
        this.isSpinnerVisible = true;
        this.communicationService.getEmailDataByEmailId(data.emailId)
            .subscribe(
                (res) => {
                    this.isSpinnerVisible = false;
                    this.emailViewData = res;
                    this.isView = true;
                },
                (err) => {
                    this.errorHandling(err);
                    this.isSpinnerVisible = false;
                }
            )

    }
    downloadFileUpload(link) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
        window.location.assign(url);
    }

    getQuotePDF() {
        this.isSpinnerVisible = true;
        this.communicationService.soqsendmailpdfpreview(this.salesQuoteId)
            .subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    this.pdfPath = res;
                },
                (err) => {
                    this.errorHandling(err);
                    this.isSpinnerVisible = false;
                }
            )
    }

    getSOPDF() {
        this.isSpinnerVisible = true;
        this.communicationService.sosendmailpdfpreview(this.SalesOrderId)
            .subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    this.pdfPath = res;
                },
                (err) => {
                    this.errorHandling(err);
                    this.isSpinnerVisible = false;
                }
            )
    }
    async getAllEmployees() {
        this.isSpinnerVisible = true;
        await this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName').subscribe(res => {
            this.isSpinnerVisible = false;
            this.employeesOriginalData = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        },
            (err) => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
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
        console.log("email", this.customerContactList);
        this.cusContactList = this.customerContactList;
        if (event.query !== undefined && event.query !== null) {
            const customers = [...this.customerContactList.filter(x => {
                return x.contactName.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.cusContactList = customers;
        }
    }
    partNo: any;
    getAllEmail() {
        //
        this.isSpinnerVisible = true;
        this.communicationService.getEmailList(this.referenceId, this.moduleId, this.partNo,this.authService.currentUser.masterCompanyId)
            .subscribe(
                (res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.data = res;
                },
                (err) => {
                    this.errorHandling(err);
                    this.isSpinnerVisible = false;
                }
            )
    }

    getAllEmailType() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('EmailType', 'EmailTypeId', 'Name')
            .subscribe(
                (res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.emailTypes = res;
                },
                (err) => {
                    this.errorHandling(err);
                    this.isSpinnerVisible = false;
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

}
