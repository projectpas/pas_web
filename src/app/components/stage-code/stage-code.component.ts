import { OnInit, Component, ViewChild } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { StageCode } from "../../models/stage-code.model";
import { ModeOfOperation } from "../../models/ModeOfOperation.enum";
import { Table } from "primeng/table";
import { TaxRate } from "../../models/taxrate.model";
import { ConfigurationService } from "../../services/configuration.service";
import { StageCodeService } from '../../services/work-order-stagecode.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from "rxjs";
import { ManagementStructure } from "../../models/managementstructure.model";
import { validateRecordExistsOrNot, validateRecordExistsOrNotForInput } from "../../generic/autocomplete";

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-stage-code',
    templateUrl: './stage-code.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})
export class StageCodeComponent implements OnInit {
    originalData: any = [];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentModeOfOperation: ModeOfOperation;
    headers = [
        { field: 'code', header: 'Stage Code' },
        { field: 'stage', header: 'Stage Name' },
        { field: 'levelCode1', header: 'Level 01' },
        { field: 'levelCode2', header: 'Level 02' },
        { field: 'levelCode3', header: 'Level 03' },
        { field: 'levelCode4', header: 'Level 04' },
        { field: 'sequence', header: 'Sequence' },
        { field: 'status', header: 'Status' },
        // {field: '', header: ''},
        // {field: '', header: ''},
        // {field: '', header: ''},
        // {field: '', header: ''},
        { field: 'description', header: 'Description' },
        { field: 'memo', header: 'Memo' },
    ]

    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveForCode: boolean = false;
    taxTypeList: any;
    createdDate: any = "";
    percentageList: any[];
    filteredPercentageList: any[];
    allTaxTypes: any[];
    filteredTaxType: any[];
    loadingIndicator: boolean;
    disableSaveForEdit: boolean = false;

    // new = {
    //     taxTypeId: 0,
    //     taxRateId: "",
    //     taxRate: 0,
    //     masterCompanyId: 1,
    //     isActive: true,
    //     isDeleted: true,
    //     memo: "",
    //     createdDate: "",
    //     updatedDate: "",
    // }
    managementStructure = new ManagementStructure();
    addNew = new StageCode();
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = [];
    workOrderStatusList: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    legalEntityList: any;
    businessUnitList: any;
    divisionList: any;
    departmentList: any;
    disableSaveForSequence: boolean = false;
    currentstatus: string = 'Active';
    AuditDetails: any;

    constructor(
        private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private configurations: ConfigurationService,
        private stageService: StageCodeService,
        private alertService: AlertService,
        private commonService: CommonService) {


    }



    ngOnInit(): void {



        this.breadCrumb.currentUrl = '/singlepages/WorkOrder/StageCode';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.getList();
        this.getAllWorkOrderStatus();
        this.getLegalEntity();

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }

    getAllWorkOrderStatus(): void {
        this.commonService.smartDropDownList('WorkOrderStatus', 'ID', 'Description',this.authService.currentUser.masterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderStatusList = res.sort(function (a, b) { return a.value - b.value; });
        })
    }

    getLegalEntity() {
        this.commonService.getLegalEntityList().pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.legalEntityList = res;
        })
    }


    selectedLegalEntity(legalEntityId) {
        if (legalEntityId) {
            this.addNew.managementStructureId = legalEntityId;
            this.commonService.getBusinessUnitListByLegalEntityId(legalEntityId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.businessUnitList = res;
            })
        }

    }
    selectedBusinessUnit(businessUnitId) {
        if (businessUnitId) {
            this.addNew.managementStructureId = businessUnitId;
            this.commonService.getDivisionListByBU(businessUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.divisionList = res;
            })
        }

    }
    selectedDivision(divisionUnitId) {
        if (divisionUnitId) {
            this.addNew.managementStructureId = divisionUnitId;
            this.commonService.getDepartmentListByDivisionId(divisionUnitId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.departmentList = res;
            })
        }

    }
    selectedDepartment(departmentId) {
        if (departmentId) {
            this.addNew.managementStructureId = departmentId;
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();


        this.getList();
    }





    customExcelUpload() {


    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=TaxRate&fileName=TaxRate.xlsx`;
        window.location.assign(url);
    }

    getList() {
        this.stageService.getWorkOrderStageList().subscribe(res => {
            // const responseData = res;
            // this.originalData = responseData;
            this.originalTableData=res;
            this.getListByStatus(this.status ? this.status :this.currentstatus)

            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }

    changePage(event: { first: any; rows: number }) {
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    checkStageCodeExistOrNot(value) {
        const exists = validateRecordExistsOrNotForInput(value, this.originalData, 'code', this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForCode = true;
        }
        else {
            this.disableSaveForCode = false;
        }
    }
    checkSequenceExistOrNot(value) {
        const exists = validateRecordExistsOrNotForInput(value, this.originalData, 'sequence', this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForSequence = true;
        }
        else {
            this.disableSaveForSequence = false;
        }
    }
    getmemo() {
     
        this.disableSaveForEdit = false;
      
}




    save() {
        if (!this.isEdit) {
            const data = {
                ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
                masterCompanyId: 1,
            };
            this.stageService.createWorkOrderStageCode(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added New Stage Successfully  `,
                    MessageSeverity.success
                );
            });
        } else {
            const data = {
                ...this.addNew, updatedBy: this.userName,
                masterCompanyId: 1,
            };
            this.stageService.updateWorkOrderStageCode(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Stage Code Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.managementStructure = new ManagementStructure();
        this.addNew = new StageCode();
        this.selectedRecordForEdit = undefined;
    }


    edit(rowData) {
        console.log('rowData', rowData);
        this.isEdit = true;
        this.disableSaveForEdit = true;

        this.addNew = {
            ...rowData,
        };
        this.selectedRecordForEdit = { ...this.addNew }
        this.addNew = {
            ...this.addNew
        };
        if (this.addNew.managementStructureId !== null) {
            this.commonService.getManagementStructureDetails(this.addNew.managementStructureId).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
                this.selectedLegalEntity(res.Level1);
                this.selectedBusinessUnit(res.Level2);
                this.selectedDivision(res.Level3);
                this.selectedDepartment(res.Level4);
                this.managementStructure = {
                    companyId: res.Level1 !== undefined ? res.Level1 : null,
                    buId: res.Level2 !== undefined ? res.Level2 : null,
                    divisionId: res.Level3 !== undefined ? res.Level3 : null,
                    departmentId: res.Level4 !== undefined ? res.Level4 : null,
                }

            })
        }

        this.selectedRecordForEdit = { ...this.addNew }

    }


    changeStatus(rowData) {
        const { workOrderStageId } = rowData;
        const { isActive } = rowData;
        this.stageService.updateWorkOrderStageCodeStatus(workOrderStageId, isActive, this.userName).subscribe(() => {
            this.getList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );

            this.getListByStatus(this.currentstatus);

        })

    }
    viewSelectedRow(rowData) {
        let data =
        {
            ...rowData,
        };
        this.viewRowData = data;
    }
    resetViewData() {
        this.viewRowData = undefined;
    }
    delete(rowData) {
        this.selectedRowforDelete = {
            ...rowData,
        };

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.stageService.deleteWorkOrderStageCode(this.selectedRowforDelete.workOrderStageId, this.userName).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Work Order Stage Code Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }
    showHistory(rowData): void {
        this.currentModeOfOperation = ModeOfOperation.Audit;
        // this.taxRateService.getTaxRateAudit(rowData.taxRateId).subscribe(audits => {
        //     if (audits) {
        //         this.auditHistory = audits[0].result;
        //     }
        // });
    }

    getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
            }
            
	originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    getListByStatus(status) {
        const newarry=[];
        if(status=='Active'){ 
            this.status=status;
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==false){
				newarry.push(element);
				}
			   });
	       }else{
		        this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==true){
			     newarry.push(element);
				}
			   });
	   }
         this.originalData=newarry;
        }else if(status=='InActive' ){
            this.status=status;
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==false){
				 newarry.push(element);
				 }
				});
			}else{
				 this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==true){
				  newarry.push(element);
				 }
				});
		}
              this.originalData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.originalData= newarry;
			}
        }
        this.totalRecords = this.originalData.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        restore(content, rowData) {
            this.restorerecord = rowData;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
            }, () => { console.log('Backdrop click') })
        }
        restorerecord:any={}
        restoreRecord(){  
            this.commonService.updatedeletedrecords('WorkOrderStage',
            'WorkOrderStageId',this.restorerecord.workOrderStageId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 



    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }


















    // itemList: StageCode[];
    // columnHeaders: any[];
    // itemDetails: any;
    // currentRow: StageCode;
    // currentModeOfOperation: ModeOfOperation;
    // rowName: string;
    // header: string;
    // disableSave: boolean = false;
    // totalRecords: any;
    // pageIndex: number = 0;
    // pageSize: number = 10;
    // totalPages: number;
    // modal: NgbModalRef;
    // selectedColumns: any[];
    // auditHistory: any[];
    // constructor(private breadCrumb: SingleScreenBreadcrumbService, private alertService: AlertService, private coreDataService: StageCodeService, private modalService: NgbModal, private authService: AuthService) {
    // }
    // ngOnInit(): void {
    //     //gather up all the required data to be displayed on the screen 
    //     this.loadData();
    // }

    // //for auditing
    // get userName(): string {
    //     //to-do:fix the empty username
    //     return this.authService.currentUser ? this.authService.currentUser.userName : "admin";
    // }

    // //Step E1: Open row up for editing
    // addNewItem(): void {
    //     this.currentRow = this.newItem(0);
    //     this.currentModeOfOperation = ModeOfOperation.Add;
    // }

    // //Functionality for pagination.
    // //to-do: Build lazy loading
    // changePage(event: { first: any; rows: number }) {
    //     const pageIndex = (event.first / event.rows);
    //     this.pageIndex = pageIndex;
    //     this.pageSize = event.rows;
    //     this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    // }

    // //Check if asset type exists before add/delete
    // checkItemExists(rowData): boolean {
    //     this.getItemList();
    //     let item = this.newItem(rowData);
    //     const exists = this.itemList.some(existingItem => existingItem.stageCodeId === item.stageCodeId);
    //     return exists;
    // }

    // //Open the confirmation to delete
    // confirmItemDelete(rowData) {
    //     this.currentRow = this.newItem(rowData);
    //     this.currentModeOfOperation = ModeOfOperation.Delete;
    // }

    // //calls API to soft-delete
    // deleteItem() {
    //     let item = this.currentRow;
    //     var itemExists = this.checkItemExists(item);
    //     if (itemExists) {
    //         this.currentModeOfOperation = ModeOfOperation.Update;
    //         item.updatedBy = this.userName;
    //         item.isDelete = true;
    //         this.coreDataService.update(item).subscribe(response => {
    //             this.alertService.showMessage('Success', this.rowName + " removed successfully.", MessageSeverity.success);
    //             this.getItemList();
    //         });
    //     }
    //     this.dismissModal();
    // }

    // //Close open modal
    // dismissModal() {
    //     this.currentRow = this.newItem(0);
    //     this.auditHistory = [];
    //     this.currentModeOfOperation = ModeOfOperation.None;
    // }

    // //Get the page's grid data
    // getItemList() {
    //     this.coreDataService.getAll().subscribe(res => {
    //         const responseData = res[0];
    //         this.itemList = responseData;
    //         this.totalRecords = responseData.length;
    //         this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //     })
    // }

    // newItem(rowData): StageCode {
    //     let item = new StageCode();
    //     let defaultUserName = "admin";
    //     if (rowData) {
    //         item.stageCodeId = rowData.stageCodeId || 0;
    //         item.gateCode = rowData.gateCode || (rowData.gateCode || "");
    //         item.description = rowData.description || (rowData.description || "");
    //         item.sequence = rowData.sequence || (rowData.sequence || "");
    //         item.memo = rowData.memo || (rowData.memo || "");
    //         item.updatedBy = this.userName || defaultUserName;
    //         item.createdBy = this.userName || defaultUserName;
    //         item.isActive = rowData.isActive || false;
    //         item.isDelete = rowData.isDelete || false;
    //     }
    //     return item;
    // }

    // openItemForEdit(rowData): void {
    //     this.currentRow = this.newItem(rowData);
    //     this.currentModeOfOperation = ModeOfOperation.Update;
    // }

    // //to-do:onchange 
    // //reorderValues(event) {
    // //    this.columnHeaders.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
    // //}

    // saveNewItem(): void {
    //     this.currentModeOfOperation = ModeOfOperation.Add;
    //     this.coreDataService.add(this.currentRow).subscribe(response => {
    //         this.alertService.showMessage('Success', this.rowName + " added successfully.", MessageSeverity.success);
    //         this.getItemList();
    //     });
    //     this.currentModeOfOperation = ModeOfOperation.None;
    // }

    // saveExistingItem(rowData): void {
    //     let item = this.newItem(rowData);
    //     var itemExists = this.checkItemExists(item);
    //     if (itemExists) {
    //         this.currentModeOfOperation = ModeOfOperation.Update;
    //         item.updatedBy = this.userName;
    //         this.coreDataService.update(item).subscribe(response => {
    //             this.alertService.showMessage('Success', this.rowName + " updated successfully.", MessageSeverity.success);
    //             this.getItemList();
    //         });
    //     } else {
    //         this.saveNewItem();
    //     }
    //     this.dismissModal();
    // }

    // //Open the audit history modal.
    // showHistory(rowData): void {
    //     this.currentModeOfOperation = ModeOfOperation.Audit;
    //     let item = this.newItem(rowData);
    //     this.coreDataService.getItemAuditById(item.stageCodeId).subscribe(audits => {
    //         if (audits[0].length > 0) {
    //             this.auditHistory = audits[0];
    //         }
    //     });
    // }

    // showItemEdit(rowData): void {
    //     this.currentRow = this.newItem(rowData);
    //     this.currentModeOfOperation = ModeOfOperation.Update;
    // }

    // //turn the item active/inActive
    // toggleActiveStatus(rowData) {
    //     this.currentRow = this.newItem(rowData);
    //     this.saveExistingItem(this.currentRow);
    // }

    // updateItem(): void {
    //     this.saveExistingItem(this.currentRow);
    // }

    // viewItemDetails(rowData) {
    //     this.itemDetails = rowData;
    // }

    // //Step x: load all the required data for the page to function
    // private loadData() {
    //     this.getItemList();
    //     this.rowName = "Stage Code";
    //     this.header = "Stage Code";
    //     this.breadCrumb.currentUrl = '/singlepages/singlepages/app-stage-code';
    //     this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    //     //Step x: Add the required details for dropdown options/column header
    //     this.columnHeaders = [
    //         { field: 'gateCode', header: 'Gate Code', index: 1, showByDefault: true },
    //         { field: 'description', header: 'Description', index: 2, showByDefault: true },
    //         { field: 'sequence', header: 'Sequence', index: 3, showByDefault: true },
    //         { field: 'memo', header: 'Memo', index: 4, showByDefault: true }
    //     ];
    //     this.currentModeOfOperation = ModeOfOperation.None;
    //     this.selectedColumns = this.columnHeaders;
    //     this.currentRow = this.newItem(0);
    // }

}