import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { getObjectById } from '../../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
import { CommunicationService } from '../../../../shared/services/communication.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { phonePattern } from '../../../../validations/validation-pattern';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
@Component({
    selector: 'app-common-text',
    templateUrl: './common-text.component.html',
    styleUrls: ['./common-text.component.scss']
})

export class TextCommonComponent implements OnInit, OnChanges {
    @Input() moduleId;
    @Input() referenceId;
    @Input() workOrderId: any;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() customerContactList: any;
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder: any = false;
    @Input() subWOPartNoId;
    @Input() type: any;
    @Input() commonContactId: any;
    isEdit: any;
    lazyLoadEventData: any;
    disableSaveMemo: boolean = true;
    pageSize: number = 10;
    memoPopupContent: any;
    pageIndex: number = 0;
    //selectedOnly: boolean = false;
    selectedOnly: any;
    targetData: any;
    totalRecords: number = 0;
    totalPages: number;
    employees: any = [];
    employeeList: any = [];
    data: any = [];
    headers = [
        { field: 'mobile', header: 'Mobile' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notes', header: 'Notes' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ]
    selectedColumns = [
        { field: 'mobile', header: 'Mobile' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notesData', header: 'Notes' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ];
    addList: any = [];
    moduleName: any = "Communication";
    viewdata: any = {};
    viewPageSize: number = 10;
    viewPageIndex: number = 0;
    viewTotalRecords: number = 0;
    viewTotalPages: number;
    // moduleId: number;
    partNo: any;
    modal: NgbModalRef;
    // referenceId:any;
    isSpinnerVisible: boolean = false;
    deletingRecord: any;
    phonePattern = phonePattern();
    constructor(private activeModal: NgbActiveModal,
        private communicationService: CommunicationService, private datePipe: DatePipe,
        private modalService: NgbModal,
        private commonService: CommonService, private alertService: AlertService, private authService: AuthService) { }

    ngOnInit(): void {
        // if(this.isSubWorkOrder==true){
        //     this.referenceId= this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId;
        //     this.moduleId=60;
        //     this.partNo=this.subWOPartNoId;
        // }else{
        //     this.moduleId=38;
        //     this.partNo=this.selectedPartNumber.workOrderPartNumberId;
        //     this.referenceId=this.workOrderId;
        // }
        // this.getAllEmployees('');
        // this.getAllTextList();
        this.headers.unshift({ field: 'customerContact', header: 'Customer Contact' })
        this.selectedColumns.unshift({ field: 'customerContact', header: 'Customer Contact' })
    }

    ngOnChanges(): void {
        this.getAllTextList();
        if (this.isView == false) {
            this.getAllEmployees();
            if (this.type == 1) {
                this.customerContacts('');
            } else {
                this.vendorContacts('');
            }

        }
        this.referenceId = this.referenceId;
        this.moduleId = this.moduleId;
    }

    setEditArray: any = [];
    ContactList: any = [];
    cusContactList: any;
    customerContact: any;
    customerContacts(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.setEditArray.push(this.customerContact.customerContactId ? this.customerContact.customerContactId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        // 190
        this.commonService.autoDropListCustomerContacts(this.commonContactId, strText, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
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
        if (this.isEdit == true) {
            this.setEditArray.push();
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        // 376
        this.commonService.autoDropListVendorContacts(this.commonContactId, strText, 20, this.setEditArray.join()).subscribe(res => {
            this.ContactList = res.map(x => {
                return {
                    ...x,
                    contactId: x.contactId,
                    firstName: x.vendoreContactName
                }
            });
            this.cusContactList = this.ContactList;

        }, err => {
        });
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

    contactSelected(event) {
        this.addList[0].mobile = event.workPhone;
    }

    dismissModel() {
        this.modal.close();
    }

    loadData(event) {

        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;

    }
    enableSaveMemo() {
        this.disableSaveMemo = false;
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


    onClickMemo() {
        this.memoPopupContent = this.addList[0].notes;

        this.disableSaveMemo = true;
    }
    onClickPopupSave() {
        this.addList[0].notes = this.memoPopupContent;
        this.memoPopupContent = '';
        this.updateDisabledText = false;
        $('#text-memo-popup').modal("hide");
    }
    closeMemoModel() {
        $('#text-memo-popup').modal("hide");
    }
    addText() {
        this.isEdit = false;
        this.addList = [];
        this.addList.push({ mobile: '', contactId: this.authService.currentEmployee, notes: '' })
        if (this.ContactList.length > 0) {
            this.ContactList.forEach(
                (cc) => {
                    // if (cc.isDefaultContact) {
                    this.customerContact = cc;
                    this.addList[0].mobile = cc.workPhone.trim();
                    // }
                    return;
                }
            )
        }
    }
    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    editTextData: any = {};
    edit(rowData, index) {
        this.isEdit = true;
        this.editTextData = rowData;
        // this.isSpinnerVisible=true;
        this.updateDisabledText = true;

        this.customerContact = {
            'contactId': rowData.customerContactId,
            'firstName': rowData.customerContact
        };
        // this.customerContacts('');
        this.getAllEmployees('');


        if (rowData.contactId == this.authService.currentEmployee.employeeId) {
            rowData.contactId = this.authService.currentEmployee;
        } else {
            // rowData.contactId = getObjectById('employeeId', rowData.contactId, this.employees);

            setTimeout(() => {
                this.addList[0].contactId = getObjectById('employeeId', rowData.contactId, this.employees);

            }, 1000);
        }
        this.addList = [{
            ...rowData
        }];
        // this.isSpinnerVisible=false;
    }
    arrayContactlist: any = []
    getAllEmployees(strText = '') {
        this.arrayContactlist = [];
        if (this.isEdit == true) {
            if (this.editTextData && typeof this.editTextData.contactId == 'string') {
                this.arrayContactlist.push(this.editTextData ? this.editTextData.contactId : 0);
            } else {
                this.arrayContactlist.push(this.editTextData ? this.editTextData.contactId.value : 0);
            }
        } else {
            this.arrayContactlist.push(0);
        }
        this.commonService.autoCompleteSmartDropDownEmployeeList('firstName', strText, true, this.arrayContactlist.join()).subscribe(res => {
            this.employees = res.map(x => {
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
    exportCSV(dt) {
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
            }
        });
        dt.exportCSV();
    }
    closeDeleteModal() {
        $("#textdownloadConfirmation").modal("hide");
    }
    savePhone() {
        this.updateDisabledText = true;
        if (this.isEdit) {
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.updateCommonText(payload[0])
                .subscribe(
                    (res) => {
                        this.updateDisabledText = true;
                        this.isSpinnerVisible = false;
                        this.getAllTextList();
                        this.isEdit = false;
                    }, err => {
                        this.errorMessageHandler();
                    }
                )
        }
        else {
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.saveCommonText(payload[0])
                .subscribe(
                    (res) => {
                        this.isSpinnerVisible = false;
                        this.getAllTextList();
                    }, err => {
                        this.errorMessageHandler();
                    }
                )
        }
        $('#addNewText').modal('hide');
        this.addList = [];
        this.customerContact = null;
    }

    formData(data) {
        return data.map((x) => {
            let toData = {
                "Mobile": x.mobile,
                "Notes": x.notes,
                "ContactById": this.getEmpId(x.contactId),
                "customerContactId": this.type == 1 ? this.customerContact.contactId : this.customerContact.contactId,
                "WorkOrderPartNo": this.partNo,
                "ModuleId": this.moduleId,
                "ReferenceId": this.referenceId,
                "MasterCompanyId": this.authService.currentUser.masterCompanyId,
                "CreatedBy": this.userName,
                "UpdatedBy": this.userName,
                "CreatedDate": new Date(),
                "UpdatedDate": new Date(),
                "IsActive": true,
                "IsDeleted": false
            }
            if (this.isEdit) {
                toData['communicationTextId'] = x.communicationTextId;
                toData["CreatedBy"] = x.createdBy;
                toData["CreatedDate"] = x.createdDate;
            }
            return toData;
        })
    }

    getEmpId(obj) {
        if (obj.employeeId) {
            return obj.employeeId;
        } else {
            return null;
        }
    }
    updateDisabledText: boolean = false;
    setvaliDate() {
        this.updateDisabledText = false;
    }



    filterEmployee(event): void {
        if (event.query !== undefined && event.query !== null) {
            this.getAllEmployees(event.query);
        } else {
            this.getAllEmployees('');
        }
    }
    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    dismissModelRestore() {
        this.modal.close();
    }
    restoreRecord() {
        this.communicationService.restoreText(this.restorerecord.communicationTextId, true, this.userName).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            this.errorMessageHandler();
        })
    }

    getDeleteListByStatus(value) {
        this.deletedStatusInfo = value ? value : false;
        this.getAllTextList();
    }
    deletedStatusInfo: boolean = false;
    dataOriginal: any = [];
    getAllTextList() {
        this.isSpinnerVisible = true;
        this.communicationService.getCOmmonTextList(this.referenceId, this.moduleId, this.deletedStatusInfo,this.authService.currentUser.masterCompanyId)
            .subscribe(
                (res) => {
                    if (res && res.length != 0) {
                        res = res.map(x => {
                            return {
                                ...x, notesData: this.getString(x.notes), createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                            }
                        })
                    }
                    this.isSpinnerVisible = false;
                    this.data = res;
                    this.totalRecords = res.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                    this.dataOriginal = this.data;
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }

    getString(data) {
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = data;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }

    deleteText(rowData) {
        this.isSpinnerVisible = true;
        this.communicationService.deleteCommonTextList(rowData.communicationTextId, this.userName)
            .subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage(
                        this.moduleName,
                        'Deleted Succesfully',
                        MessageSeverity.success
                    );
                    this.getAllTextList();
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    viewPageIndexChange(event) {
        this.viewPageSize = event.rows;
    }
    getViewData(data) {
        this.viewdata = data;
    }
    dismissModelHistory() {
        $('#contentHistDocs').modal('hide');
    }
    documentauditHisory: any = [];
    openHistory(rowData) {

        this.communicationService.getCOmmonTextHistory(rowData.communicationTextId).subscribe(
            results => {
                this.documentauditHisory = results;
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
    errorMessageHandler() {
        this.isSpinnerVisible = false;
    }

    enableSave() { }

    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.data = this.dataOriginal;
            const data = [...this.data.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.data = data;
        } else {
            this.data = this.dataOriginal;
        }
    }

    getmemo() {
        this.updateDisabledText = false;
    }
}