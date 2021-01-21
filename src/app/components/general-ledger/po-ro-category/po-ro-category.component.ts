import { OnInit, Component, AfterViewInit } from "@angular/core";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { fadeInOut } from "../../../services/animations";
import { POROCategory } from "../../../models/po-ro-category.model";
import { SingleScreenAuditDetails } from "../../../models/single-screen-audit-details.model";
import { AuthService } from "../../../services/auth.service";
import { POROCategoryService } from "../../../services/porocategory/po-ro-category.service";
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AuditHistory } from '../../../models/audithistory.model';
import { ConfigurationService } from '../../../services/configuration.service';
import { LazyLoadEvent, SortEvent, MenuItem } from 'primeng/api';

import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue, getObjectById } from '../../../generic/autocomplete';
import { SingleScreenBreadcrumbService } from "../../../services/single-screens-breadcrumb.service";
import { NodeTypeService } from "../../../services/node-Type.service";
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';

@Component({
    selector: 'app-po-ro-category',
    templateUrl: './po-ro-category.component.html',
    styleUrls: ['./po-ro-category.component.scss'],
    animations: [fadeInOut]
})
export class PoRoCategoryComponent implements OnInit, AfterViewInit {

    currentporoCategory: POROCategory;
    poroCategoryToUpdate: POROCategory;
    poroCategoryToRemove: POROCategory;
    poroCategoryList: POROCategory[];
    breadcrumbs: MenuItem[];
    test: any;
    modal: NgbModalRef;
    display: boolean = false;
    Active: string;
    viewRowData: any;
    AuditDetails: SingleScreenAuditDetails[];
    loadingIndicator: boolean;
    allPOROList: any = [];
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    glCashFlowList: any;
    isDeleteMode: boolean = false;
    disableSaveGLCFName: boolean = false;
    disableSaveGLCFNameSave: boolean = false;
    cols: any[];
    isEditMode: boolean;
    isSaving: boolean;
    public sourceAction: any = {};
    sourcePORPCategory: any;
    pageSize: number = 10;
    totalRecords: any;
    totalPages: number;
    selectedRowforDelete: any;
    updateMode: boolean;
    disableSave: boolean = false;
    lazyLoadEventData: any;
    pageIndex: number = 0;


    headers = [
        { field: 'categoryName', header: 'Category Name' },
        { field: 'isPO', header: 'PO' },
        { field: 'isRO', header: 'RO' },
        { field: 'memo', header: 'Memo' }
    ]
    selectedColumns = this.headers;
    formData = new FormData()

    new = {
        poroCategoryId: 1,
        categoryName: "",
        createdBy: "",
        updatedBy: "",
        createdDate: Date,
        updatedDate: Date,
        isPO: false,
        isRO: false,
        masterCompanyId: 1,
        isDelete: false,
        isActive: true,
        memo: "",
    }

    addNew = { ...this.new };
    isEdit: boolean = false;
    selectedRecordForEdit: any;

    constructor(private alertService: AlertService, private poroCategoryService: POROCategoryService, private modalService: NgbModal,
        private authService: AuthService, private configurations: ConfigurationService, private glCashFlowClassificationService: NodeTypeService,
        private breadCrumb: SingleScreenBreadcrumbService) {
       // this.poroCategoryService.currentUrl = '/generalledgermodule/generalledgerpage/app-po-ro-category';
       // this.poroCategoryService.bredcrumbObj.next(this.poroCategoryService.currentUrl);//Bread Crumb

    }

    ngOnInit(): void {
        //this.loadData();

        this.breadcrumbs = [
            { label: 'General Ledger' },
            { label: 'PO RO Category' },
        ];
       // this.breadCrumb.currentUrl = '/generalledgermodule/generalledgerpage/app-po-ro-category';
       // this.breadCrumb.bredcrumbObj.next(this.poroCategoryService.currentUrl);
        //this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    //private loadData() {
    //    this.loadingIndicator = true;
    //    this.poroCategoryService.getAll().subscribe(
    //        results => this.onPORPSuccessful(results[0]),
    //        error => this.onDataLoadFailed(error)
    //    );
    //}

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    toggledbldisplay(content, row) {
        this.isEditMode = true;
        this.isSaving = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    //changePage(event: { first: any; rows: number }) {
    //    console.log(event);
    //    this.pageSize = event.rows;
    //    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //}

    getmemo($event) {
        if (this.disableSaveGLCFName == false) {
            this.disableSaveGLCFName = false;
            this.disableSaveGLCFNameSave = false;
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    save() {
       // alert(JSON.stringify(this.addNew['categoryName']));

        //if (this.addNew['categoryName'] == this.test) {
        //    this.addNew.categoryName = this.test
        //}

        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName, createdDate: Date, updatedDate: Date,
            categoryName: editValueAssignByCondition('categoryName', this.addNew.categoryName),

        };
        const { selectedCompanysData, ...rest }: any = data;

       // alert(JSON.stringify(data));

        if (!data.categoryName) {
            this.disableSave = false
        }
        else {
            if (!this.isEdit) {
                this.poroCategoryService.add(rest).subscribe(() => {
                    this.resetForm();
                    this.poroCategoryService.getAll().subscribe(nodes => {
                        this.allPOROList = nodes[0];
                        //  this.loadData();
                        this.loadAllSiteData(this.constantFilters());
                    });
                    this.alertService.showMessage(
                        'Success',
                        `Added  New PO-RO Category Successfully`,
                        MessageSeverity.success
                    );
                })

            } else {
                this.poroCategoryService.update(rest).subscribe((response) => {
                    this.selectedRecordForEdit = undefined;
                    this.isEdit = false;
                    this.resetForm();
                    //this.poroCategoryService.getAll().subscribe(nodes => {
                      //  this.allPOROList = nodes[0];
                        //this.loadData();
                        this.loadAllSiteData(this.constantFilters());
                        
                    this.alertService.showMessage(
                        'Success',
                        `Updated PO-RO Category Successfully`,
                        MessageSeverity.success
                    );

                })
                this.updatePOROCategory();
            }
        }
    }

    updatePOROCategory(): void {
        this.currentporoCategory.updatedBy = this.userName;
        this.poroCategoryService.update(this.currentporoCategory).subscribe(node => {
            this.alertService.showMessage('PO-RO Category updated successfully.');
            this.poroCategoryService.getAll().subscribe(nodes => {
                this.allPOROList = nodes[0];
            });
            this.updateMode = false;

        });
    }

    checkGLCFNameExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.allPOROList, this.isEdit);
        if (exists.length > 0) {
            this.disableSaveGLCFName = true;
            this.disableSaveGLCFNameSave = true;
        }
        else {
            this.disableSaveGLCFName = false;
            this.disableSaveGLCFNameSave = false;
        }

    }
    filterGLCFName(event) {
        this.glCashFlowList = this.allPOROList;

        const glCashFlowData = [...this.allPOROList.filter(x => {
            return x.categoryName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.glCashFlowList = glCashFlowData;
    }
    selectedGLCFName(object) {

        const exists = selectedValueValidate('categoryName', object, this.isEdit)
        this.disableSaveGLCFName = !exists;
        this.disableSaveGLCFNameSave = !exists;
    }


    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", 'Action was deleted successfully', MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", 'Action was edited successfully', MessageSeverity.success);
        }
    }

    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.currentporoCategory = new POROCategory();
        this.currentporoCategory.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;
    }

    deleteConformation(value) {
        if (value === 'Yes') {
            this.poroCategoryService.remove(this.selectedRowforDelete.poroCategoryId).subscribe(() => {
               // this.loadData();
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Deleted Record Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    private onPORPSuccessful(allWorkFlows: any[]) {
        this.loadingIndicator = false;
        this.allPOROList = allWorkFlows;
        this.totalRecords = this.allPOROList.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
    }

    //private onDataLoadFailed(error: any) {
    //    this.alertService.stopLoadingMessage();
    //    this.loadingIndicator = false;
    //}

    ngAfterViewInit() { }

    openHist() {
       // alert("Functionality not yet done");
    }

    loadAllSiteData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.loadingIndicator = true;
        if (event.globalFilter == null) {
            event.globalFilter = ""
        }
        const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }
        this.poroCategoryService.search(PagingData).subscribe(
            results => {

                this.allPOROList = results[0]['results'];
               // alert(JSON.stringify(this.allPOROList));
                this.totalRecords = results[0]['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },

            error => this.onDataLoadFailed(error)
        );
       
    }

   
    //OnDataLoadFailed
    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    constantFilters() {
        return {
            first: 0,
            rows: 10,
            sortField: undefined,
            sortOrder: 1,
            filters: "",
            globalFilter: "",
            multiSortMeta: undefined
        }
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    edit(rowData) {
        this.isEdit = true;
        this.disableSaveGLCFName = false;
        this.disableSaveGLCFNameSave = true;

        this.test = rowData.categoryName;
        this.test = rowData.categoryName;
        if (rowData.isPO == "0") {
            rowData.isPO = false 

        }
        if (  rowData.isRO == "0") {
            rowData.isRO = false;
        }
        if (rowData.isPO == "1") {
            rowData.isPO = true

        }
        if (rowData.isRO == "1") {
            rowData.isRO = true;
        }

        this.addNew = {
            ...rowData,
          
            categoryName: getObjectById('poroCategoryId', rowData.poroCategoryId, this.allPOROList),
        };
        this.selectedRecordForEdit = { ...this.addNew }

        //this.addNew = {
        //    ...rowData,
        //};
        //this.selectedRecordForEdit = { ...this.addNew }

    }
    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }
    resetViewData() {
        this.viewRowData = undefined;
    }
    setporoCategoryToUpdate(editporoCategoryPopup: any, id: number): void {
        this.poroCategoryToUpdate = Object.assign({}, this.poroCategoryList.filter(function (asset) {
            return asset.poroCategoryId == id;
        })[0]);
        this.modal = this.modalService.open(editporoCategoryPopup, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    updateStatus(): void {
        this.poroCategoryToUpdate.updatedBy = this.userName;
        this.poroCategoryService.update(this.poroCategoryToUpdate).subscribe(asset => {
            this.alertService.showMessage("Success", "PO-RO-Category updated successfully.", MessageSeverity.success);
            this.poroCategoryService.getAll().subscribe(assets => {
                this.poroCategoryList = assets[0];
            });
            this.resetUpdatePoro();
            this.dismissModel();
        });
    }

    removeporoCategory(): void {
        this.poroCategoryService.remove(this.poroCategoryToRemove.poroCategoryId).subscribe(response => {
            this.alertService.showMessage("PO-RO-Category removed successfully.");
            this.poroCategoryService.getAll().subscribe(assets => {
                this.poroCategoryList = assets[0];
                this.modal.close();
            });
        });

    }

    resetAddporoCategory(): void {
        this.currentporoCategory = new POROCategory();
    }

    resetUpdatePoro(): void {
        this.poroCategoryToUpdate = new POROCategory();
    }

    confirmDelete(content, id): void {
        this.poroCategoryToRemove = Object.assign({}, this.poroCategoryList.filter(function (poroCategory) {
            return poroCategory.poroCategoryId == id;
        })[0]);;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    toggleIsActive(row, event) {
       // alert(JSON.stringify(row));
        //this.poroCategoryToUpdate = poroCategory;
        //this.poroCategoryToUpdate.isActive = event.checked == false ? false : true;
        //this.updateStatus();


        const data = {
            ...this.addNew,  isActive: row.isActive,  poroCategoryId: row.poroCategoryId, categoryName : row.categoryName,  createdBy: this.userName, updatedBy: this.userName, createdDate: Date, updatedDate: Date

        };
        const { selectedCompanysData, ...rest }: any = data;
       
        // const data = { ...row }
        this.poroCategoryService.updateActionforActivePORO(rest).subscribe(() => {
            //   this.loadAllSiteData(this.constantFilters());
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully`,
                MessageSeverity.success
            );
        })

    }

    handleChangeforPORPIsActive(rowData, e) {
        if (e.checked == false) {
            this.sourceAction.poroCategoryId = rowData.poroCategoryId;
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive = false;
            this.poroCategoryService.updateActionforActivePORO(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.itemMasterId = rowData.poroCategoryId;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive = true;
            this.poroCategoryService.updateActionforActivePORO(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.saveFailedHelper(error));
        }

    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    showAuditPopup(template, id): void {
        this.auditPOROCategory(id);
        this.modal = this.modalService.open(template, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    auditPOROCategory(poroCategoryId: number): void {
        //this.AuditDetails = [];
        this.poroCategoryService.getAudit(poroCategoryId).subscribe(audits => {
            if (audits.length > 0) {
                this.auditHistory = audits[0];

                this.AuditDetails = audits;
                this.AuditDetails[0].ColumnsToAvoid = ["poroCategoryAuditId", "poroCategoryId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.poroCategoryService.getGLCashFlowClassificationFileUpload(this.formData).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.existingRecordsResponse = res;
                //this.loadData();
                this.loadAllSiteData(this.constantFilters());
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                //$('#duplicateRecords').modal('show');
                //document.getElementById('duplicateRecords').click();
            })
        }

    }


    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=POROCategory&fileName=POROCategory.xlsx`;

        window.location.assign(url);
    }

   


    getAuditHistoryById(rowData) {
        this.poroCategoryService.getAudit(rowData.poroCategoryId).subscribe(audits => {
            if (audits.length > 0) {
               // this.auditHistory = audits[0];

              // alert(JSON.stringify(audits));
              //  alert(JSON.stringify(audits[0]));

                this.auditHistory = audits;
               // this.auditHistory[0].ColumnsToAvoid = ["poroCategoryAuditId", "poroCategoryId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
            }
        });
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

    columnsChanges() {}
    deleteItemAndCloseModel() {}
}

