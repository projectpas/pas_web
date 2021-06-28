import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { NgbActiveModal, } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { CommunicationService } from '../../../../shared/services/communication.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-common-memo',
    templateUrl: './common-memo.component.html',
    styleUrls: ['./common-memo.component.scss']
})

export class MemoCommonComponent implements OnInit, OnChanges {
    @Input() workOrderId: any;
    disableSaveMemo: boolean = true;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() customerContactList: any;
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder: any = false;
    @Input() isSummarizedView: any = false;
    
    @Input() subWOPartNoId;
    @Input() moduleId;
    @Input() referenceId;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    selectedOnly: boolean = false;
    targetData: any;
    totalRecords: number = 0;
    totalPages: number;
    data: any = [];
    modal: NgbModalRef;
    headers = [
        // { field: 'SERIAL_NO', header: 'Serial Num' },
        { field: 'descriptionData', header: 'Memo' ,width:"200px"},
        { field: 'createdDate', header: 'Created Date',width:"100px" },
        { field: 'createdBy', header: 'Created By',width:"100px" },
        { field: 'updatedDate', header: 'Updated Date',width:"100px" },
        { field: 'updatedBy', header: 'Updated By',width:"100px" },
    ]
    selectedColumns = [
        // { field: 'SERIAL_NO', header: 'Serial Num' },
        { field: 'descriptionData', header: 'Memo',width:"200px" },
        { field: 'createdDate', header: 'Created Date' ,width:"100px" },
        { field: 'createdBy', header: 'Created By',width:"100px" },
        { field: 'updatedDate', header: 'Updated Date',width:"100px" },
        { field: 'updatedBy', header: 'Updated By',width:"100px" },
    ];
    addList: any = [];
    isEdit: any;
    employees: any[];
    newdata: any;
    moduleName: any = "Communication";
    isSpinnerVisible: boolean = false;
    deletingRow: any;
    constructor(private activeModal: NgbActiveModal,
        private communicationService: CommunicationService,
        private alertService: AlertService, private authService: AuthService, private datePipe: DatePipe,
        private modalService: NgbModal,) { }

    ngOnInit(): void {
        // if(this.isSubWorkOrder){
        // this.customerInfoFromSalesQuote= this.subWorkOrderDetails;
        // this.moduleId=60;
        // this.selectedPartNumber=this.subWOPartNoId;
        // this.referenceId=this.subWorkOrderDetails.subWorkOrderId;
        //  }
        //  if(this.isSubWorkOrder==true){
        //     this.workOrderId= this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId;
        //     this.moduleId=60;
        //     this.partNo=this.subWOPartNoId;
        // }else{
        //     this.moduleId=38;
        //     this.partNo=this.selectedPartNumber.workOrderPartNumberId
        // }
        // this.getAllMemoList();
        // this.getAllEmployees();
    }

    ngOnChanges(): void {
       this.referenceId = this.referenceId;
        this.moduleId = this.moduleId;
        this.getAllMemoList();
    }

    dismissModel() {
        this.activeModal.close();
    }
    enableSaveMemo() {
        this.disableSaveMemo = false;
    }
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
    }
    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        dt.exportCSV();
    }
    closeDeleteModal() {
		$("#memodownloadConfirmation").modal("hide");
	}

    closePopupmodel(divid) {
		$("#"+divid+"").modal("hide");
	}
    addMemo() {
        this.enableSaveMemo();
        this.disableSaveMemo = true;
        this.isEdit = false;
        this.addList = [];
        this.addList.push({ memoId: '', description: '' })
    }
    edit(rowData, index) {
        this.isEdit = true;
        this.addList = [rowData];

        this.enableSaveMemo();
        this.disableSaveMemo = true;
    }
    deleteMemo(rowData) {
        this.communicationService.deleteCommonMemoList(rowData.memoId,this.userName)
            .subscribe(
                res => {
                    this.alertService.showMessage(
                        this.moduleName,
                        'Deleted Succesfully',
                        MessageSeverity.success
                    );
                    this.getAllMemoList();
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }
    documentauditHisory: any = [];
    openHistory(rowData) {
        this.communicationService.getCOmmonMemoHistory(rowData.memoId).subscribe(
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
    dismissModelHistory() {
        $('#contentHistDocs').modal('hide');
    }
    deleteMemoConfirmation(rowData) {
        this.deletingRow = rowData;
        $('#deleteRowConfirmation').modal('show');
    }
    saveMemo() {
        if (this.isEdit) {
            $('#addNewMemo').modal('hide');
            let payload = this.formData(this.addList[0]);
            this.isSpinnerVisible = true;
            this.communicationService.updateCommonMemo(payload)
                .subscribe(
                    (res) => {
                        this.isSpinnerVisible = false;
                        this.alertService.showMessage(
                            this.moduleName,
                            ' Memo Updated Succesfully',
                            MessageSeverity.success
                        );
                        this.getAllMemoList();
                    }, err => {
                        this.errorMessageHandler();
                    }
                )
        }
        else {
            $('#addNewMemo').modal('hide');
            let payload = this.formData(this.addList[0]);
            this.isSpinnerVisible = true;
            this.communicationService.saveCommonMemo(payload)
                .subscribe(
                    (res) => {
                        this.isSpinnerVisible = false;
                        this.alertService.showMessage(
                            this.moduleName,
                            ' Memo Created Succesfully',
                            MessageSeverity.success
                        );
                        this.getAllMemoList();
                    }, err => {
                        this.errorMessageHandler();
                    }
                )
        }
        this.addList = [];
    }

    formData(data) {
        let returnData = {
            "MemoCode": 0,
            "ModuleId": this.moduleId,
            "ReferenceId": this.referenceId,
            "MasterCompanyId": this.authService.currentUser.masterCompanyId,
            "CreatedBy": this.userName,
            "UpdatedBy": this.userName,
            "CreatedDate": new Date(),
            "UpdatedDate": new Date(),
            "IsActive": true,
            "IsDeleted": false,
            "Description": data.description,
        }
        if (this.isEdit) {
            returnData["MemoId"] = data.memoId;
            returnData["CreatedBy"] = data.createdBy;
            returnData["CreatedDate"] = data.createdDate;
        }
        return returnData;
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
        this.communicationService.restoreMemo(this.restorerecord.memoId, true, this.userName).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(true)
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            this.errorMessageHandler();
        })
    }
    getViewData(data) {
        this.viewdata = data;
    }
    viewdata:any={};
    dismissModelRestore() {
        this.modal.close();
    }
    getDeleteListByStatus(value) {
        this.deletedStatusInfo = value ? value : false;
        this.isSpinnerVisible = true;
        this.getAllMemoList();
        this.isSpinnerVisible = false;
    }
    deletedStatusInfo: boolean = false;
    partNo: any;
    dataOriginal:any=[];
    getAllMemoList() {
        this.data = [];
        // if(this.workOrderId ==undefined){
        //     this.workOrderId=this.subWorkOrderDetails.subWorkOrderId;
        // }
        // this.isSpinnerVisible = true;
        this.communicationService.getCommonMemoList(this.referenceId, this.moduleId, this.deletedStatusInfo,this.authService.currentUser.masterCompanyId)
            .subscribe(
                (res) => {
                    if (res && res.length > 0) {
                        res = res.map(x => { return { ...x, 'descriptionData': this.getString(x.description),
                        createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                        updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '', } })

                    

                        // reverse()
                        this.newdata = res.map((currentValue, Index) => {
                            currentValue.SERIAL_NO = Index + 1;
                            return currentValue
                        })
                        this.data = (this.newdata) ? this.newdata.reverse() : [];
                        this.dataOriginal = (this.newdata) ? this.newdata.reverse() : [];
                    } else {
                        this.data = [];
                    }
                    // = res;
                    this.totalRecords = res.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                    // this.isSpinnerVisible = false;
                }, err => {
                    this.errorMessageHandler();
                }
            )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
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
    getHtml(data, field) {
        if (field == 'description') {
            return $.parseHTML(data)[0];
        }
        return data;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    errorMessageHandler() {
        this.isSpinnerVisible = false;
    }
    getString(data) {
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = data;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }



//     dateFilterForTable(date, field) {
//         if(date){
//               date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
//         if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
   
//         }else{

//  }     
//           }
//         }

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
}