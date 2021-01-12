import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { getObjectById } from '../../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
import { CommunicationService } from '../../../../shared/services/communication.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-common-phone',
    templateUrl: './common-phone.component.html',
    styleUrls: ['./common-phone.component.scss']
})

export class PhoneCommonComponent implements OnInit, OnChanges {
    @Input() moduleId;
    @Input() referenceId;
    @Input() workOrderId: any;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() commonContactId: any;
    // @Input() ContactList: any;
    @Input() type: any;
    phoneViewData: any = {};
    isEdit: boolean = false;
    lazyLoadEventData: any;
    pageSize: number = 10;
    viewPageSize: number = 10;
    pageIndex: number = 0;
    viewPageIndex: number = 0;
    totalRecords: number = 0;
    viewTotalRecords: number = 0;
    totalPages: number;
    selectedOnly: boolean = false;
    targetData: any;
    viewTotalPages: number;
    employees: any = [];
    employeeList: any = [];
    data: any = [];
    viewdata: any = [];
    modal: NgbModalRef;
    headers = [
        //{ field: 'customerContact', header: 'Customer Contact'  },
        { field: 'phoneNo', header: 'Phone' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notes', header: 'Notes' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ]
    selectedColumns = [
        //{ field: 'customerContact', header: 'Customer Contact' },
        { field: 'phoneNo', header: 'Phone' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notesData', header: 'Notes' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ];

    addList: any = [];
    cusContactList: any;
    customerContact: any;
    moduleName: any = "Communication";
    isSpinnerVisible: boolean = false;
    deletingRecord: any;
    ContactList: any = [];
    constructor(private activeModal: NgbActiveModal,
        private communicationService: CommunicationService,
        private commonService: CommonService,
        private alertService: AlertService, private datePipe: DatePipe,
        private authService: AuthService,
        private modalService: NgbModal,) { }

    ngOnInit(): void {
        if (this.type == 1) {
            this.headers.unshift({ field: 'customerContact', header: 'Customer Contact' })
            this.selectedColumns.unshift({ field: 'customerContact', header: 'Customer Contact' })
        } else {
            this.selectedColumns.unshift({ field: 'vendorContact', header: 'Customer Contact' })
            this.headers.unshift({ field: 'vendorContact', header: 'Customer Contact' })
        }

    }

    ngOnChanges(): void {
        this.getAllPhoneList();
        if (this.isView == false) {
            this.getAllEmployees('');
            if (this.type == 1) {
                this.customerContacts('');
            } else {
                this.vendorContacts('');
            }
        }
        this.moduleId = this.moduleId;
        this.referenceId = this.referenceId;
        this.ContactList = this.ContactList;
    }
    setEditArray: any = [];
    customerContacts(value) {
        this.setEditArray = [];
        if (this.isEdit == true) {
            this.setEditArray.push(this.customerContact.customerContactId ? this.customerContact.customerContactId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        // 190
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
        console.log("ev", event);
        this.addList[0].phoneNo = event.workPhone;
    }
    editTextData: any = {};
    getmemo() {
        this.disableUpdateButton = false;
    }
    edit(rowData, index) {
        this.isEdit = true;
        this.disableUpdateButton = true;
        console.log("edit Dt", rowData)
        this.editTextData = rowData;
        if (this.type == 1) {
            this.customerContact = {
                'contactId': rowData.customerContactId,
                'firstName': rowData.customerContact
            };
            // this.customerContacts('');
        } else {
            this.customerContact = {
                'contactId': rowData.customerContactId,
                'firstName': rowData.vendorContact
            }
        }
        this.getAllEmployees('');

        // this.vendorContacts('');
        console.log("edit11 Dt", rowData)
        if (rowData.contactId == this.authService.currentEmployee.employeeId) {
            rowData.contactId = this.authService.currentEmployee;
        } else {
            setTimeout(() => {
                this.addList[0].contactId = getObjectById('employeeId', rowData.contactId, this.employees);
            }, 1000);
        }
        this.addList = [{
            ...rowData
        }];
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
    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    restoreRecord() {
        this.communicationService.restorePhone(this.restorerecord.communicationPhoneId, true, this.userName).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            this.errorMessageHandler();
        })
    }
    dismissModelRestore() {
        this.modal.close();
    }
    getDeleteListByStatus(value) {
        this.deletedStatusInfo = value ? value : false;
        this.getAllPhoneList();
    }
    deletedStatusInfo: boolean = false;
    partNo: any;
    getAllPhoneList() {
        this.isSpinnerVisible = true;
        this.communicationService.getCommonPhoneData(this.referenceId, this.moduleId, this.deletedStatusInfo, this.type)
            .subscribe(
                (res) => {
                    res = res.map(x => { return { ...x, 'notesData': this.getString(x.notes) } })
                    this.isSpinnerVisible = false;
                    if (res && res.length != 0) {
                        this.data = res.map(x => {
                            return {
                                ...x,
                                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                            }
                        });
                    }
                    else
                        this.data = [];
                    this.totalRecords = res.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
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

    dismissModel() {
        this.activeModal.close();
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
        $("#phonedownloadConfirmation").modal("hide");
    }

    loadData(event) {

        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        event.first = pageIndex;

    }
    addPhone() {
        this.isEdit = false;
        this.addList = [];
        this.addList.push({ phoneNo: '', contactId: this.authService.currentEmployee, notes: '' })
        if (this.ContactList.length > 0) {
            this.ContactList.forEach(
                (cc) => {
                    // if (cc.isDefaultContact) {
                    this.customerContact = cc;
                    this.addList[0].phoneNo = cc.workPhone.trim();
                    // }
                    return;
                }
            )
        }
    }
    disableUpdateButton: any = false;
    savePhone() {
        if (this.isEdit) {
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.updateCommonPhone(payload[0])
                .subscribe(
                    (res) => {
                        this.disableUpdateButton = true;
                        this.isSpinnerVisible = false;
                        this.getAllPhoneList();
                        this.isEdit = false;
                    }, err => {
                        this.errorMessageHandler();
                    }
                )
        }
        else {
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.saveCommonPhone(payload[0])
                .subscribe(
                    (res) => {
                        this.isSpinnerVisible = false;
                        this.getAllPhoneList();
                    }, err => {
                        this.errorMessageHandler();
                    }
                )
        }
        this.addList = [];
        this.customerContact = null;
    }

    formData(data) {
        let toData = {
            "PhoneNo": data[0].phoneNo,
            "Notes": data[0].notes,
            "ContactById": this.getEmpId(data[0].contactId),
            "WorkOrderPartNo": this.partNo,
            "customerContactId": this.type == 1 ? this.customerContact.contactId : this.customerContact.contactId,
            "ModuleId": this.moduleId,
            "ReferenceId": this.referenceId,
            "MasterCompanyId": this.authService.currentUser.masterCompanyId,
            "CreatedBy": "admin",
            "UpdatedBy": "admin",
            "CreatedDate": "2019-12-31T04:30:28.21",
            "UpdatedDate": "2019-12-31T04:30:28.21",
            "IsActive": true,
            "IsDeleted": false,
            "Phonetype": this.type
            //vendor 2
        }

        if (this.isEdit) {
            toData['communicationPhoneId'] = data[0].communicationPhoneId;
        }
        return [toData];
    }

    getPhoneData(data) {
        this.communicationService.getPhoneData(this.workOrderId, this.partNo, this.moduleId, data.phoneNo)
            .subscribe(
                res => {
                    this.viewdata = res;
                    this.viewTotalRecords = res.length;
                    this.viewTotalPages = Math.ceil(this.totalRecords / this.pageSize);
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }

    getEmpId(obj) {
        if (obj.employeeId) {
            return obj.employeeId;
        } else {
            return null;
        }
    }

    filterEmployee(event): void {
        if (event.query !== undefined && event.query !== null) {
            this.getAllEmployees(event.query);
        } else {
            this.getAllEmployees('');
        }
    }
    showDeletePhoneConfirmation(rowData) {
        this.deletingRecord = rowData;
        $('#deleteRowConfirmation').modal('show');
    }
    closeRestore() {
        $('#deleteRowConfirmation').modal('hide');
    }
    deletePhone(rowData) {
        this.isSpinnerVisible = true;
        this.communicationService.deleteCommonPhoneList(rowData.communicationPhoneId, this.userName)
            .subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage(
                        this.moduleName,
                        'Deleted Succesfully',
                        MessageSeverity.success
                    );
                    this.getAllPhoneList();
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    viewPageIndexChange(event) {
        this.viewPageSize = event.rows;
    }
    phoneView(data) {
        this.phoneViewData = data;
        // this.getPhoneData(data);
    }

    dismissModelHistory() {
        $('#contentHistDocs').modal('hide');
    }
    documentauditHisory: any = [];
    openHistory(rowData) {

        this.communicationService.getCOmmonPhoneHistory(rowData.communicationPhoneId, this.type).subscribe(
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
    errorMessageHandler() {
        this.isSpinnerVisible = false;
    }
}