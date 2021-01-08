import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';

import { ItemClassificationService } from '../../services/item-classfication.service';
import { ItemClassificationModel } from '../../models/item-classification.model';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem, LazyLoadEvent } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { editValueAssignByCondition, selectedValueValidate, listSearchFilterObjectCreation, getObjectById, getObjectByValue } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';


import { CommonService } from '../../services/common.service';


@Component({
    selector: 'app-item-classification',
    templateUrl: './item-classification.component.html',
    styleUrls: ['./item-classification.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class ItemClassificationComponent implements OnInit, AfterViewInit {
    totelPages: number;
    itemClassificationPaginationList: any[] = [];
    event: any;
    property: string;
    itemClassification = [];
    itemTypeInputFieldValue: any;
    updatedByInputFieldValue: any;
    memoInputFieldValue: any;
    createdByInputFieldValue: any;
    descriptionInputFieldValue: any;
    matvhMode: any;
    formData = new FormData();
    field: any;
    itemClassificationCodeInputFieldValue: any;
    itemClassificationPagination: any;
    item_Name: any = "";
    description: any = "";
    itemType: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    auditHisory: AuditHistory[];
    AuditDetails: SingleScreenAuditDetails[];
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    cols: any[];
    selectedColumns: any[];
    displayedColumns = ['itemclassificationId', 'itemclassificationCode', 'description', 'memo'];
    //, 'Sequence', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'
    dataSource: MatTableDataSource<ItemClassificationModel>;
    allitemclassificationInfo: any[] = [];
    allComapnies: MasterCompany[] = [];
	private isSaving: boolean;
	public sourceAction: any;
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: ItemClassificationModel[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    Active: string = "Active";
    modal: NgbModalRef;
    itemName: string;
    filteredBrands: any[];
	localCollection: any[] = [];
	localNameCollection: any[] = [];
	localtypeCollection: any[] = [];
    /** Actions ctor */
    selectedActionName: any;
    disableSave: boolean;
    actionamecolle: any[] = [];

    isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
	classnamecolle: any[] = [];
	classificationtypecolle: any[] = [];
	allitemclassnameinfo: ItemClassificationModel[];
	disableClassdesc: boolean = false;
    disabletypeSave: boolean;
    className: any;
    itemTypeName: any;

    pageSearch: { query: any; field: any; };
    first: number;
    rows: number;
    paginatorState: any;
    totalRecords: number;
    loading: boolean;
    lazyLoadEventData: Event;
    pageIndex: number = 0;

    newItemClassification =
        {
            itemClassificationCode: "",
            description: "",
            itemType: "",
            masterCompanyId: 1,
            isActive: true,
            isDelete: false,
            memo: "",
        }
    addNewItemClassification = { ...this.newItemClassification };
    selectedRecordForEdit: any;
    disableSaveForItemCode: boolean = false;
    disableSaveForItemDesc: boolean = false;
    itemClassificationList: any;
    itemClassificationDescList: any;
    viewRowData: any;
    totalPages: number;
    pageSize: number = 10;
    selectedRowforDelete: any;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    disableSaveForItemCodeMsg: boolean = false;
    disableSaveForItemDescMsg:boolean= false;
    disableSaveForEdit: boolean = false;
    
    currentstatus: string = 'Active';

    isDeleted: Boolean = false;
	constructor(private breadCrumb: SingleScreenBreadcrumbService, 
        private commonService: CommonService,private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public itemClassificationService: ItemClassificationService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.sourceAction = new ItemClassificationModel();

    }

    
    ngOnInit(): void {
        this.getItemClassificationList();
        this.cols = [
            //{ field: 'itemClassificationId', header: 'Item Classification ID' },
            { field: 'itemClassificationCode', header: 'Item Classification ID' },
            { field: 'description', header: 'Item Classification Name' },
            { field: 'itemType', header: 'ItemType' },
            { field: 'memo', header: 'Memo' }
		];
		this.breadCrumb.currentUrl = '/singlepages/singlepages/app-item-classification';
		this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        this.selectedColumns = this.cols;
    }

  


    getmemo() {
           this.disableSaveForEdit = false;
    };


   

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    public allWorkFlows: ItemClassificationModel[] = [];

    getItemClassificationList() {
        this.itemClassificationService.getWorkFlows().subscribe(res => {
            // const responseData = res[0];
            // console.log(responseData);
            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)
            // this.allitemclassificationInfo = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
   
     
    // loadAllitemclassificationInfo(event) {
    //     this.lazyLoadEventData = event;
    //     const pageIndex = parseInt(event.first) / event.rows;;
    //     this.pageIndex = pageIndex;
    //     this.pageSize = event.rows;
    //     event.first = pageIndex;
    //     this.loadingIndicator = true;
    //     if (event.globalFilter == null) {
    //         event.globalFilter = ""
    //     }
    //     const PagingData = { ...event, filters: listSearchFilterObjectCreation(event.filters) }
    //     this.itemClassificationService.getSearchRecords(PagingData).subscribe(
    //         results => {
    //             this.allitemclassificationInfo = results[0]['results']; //itemClassificationList
    //             this.totalRecords = results[0]['totalRecordsCount']
    //             this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );




    // }
    private onDataLoadFailed(error: any) {


    }

    checkItemcode(value) {
        if (this.allitemclassificationInfo.find
            (x => x.itemClassificationCode === 
                value.itemClassificationCode)) {
            this.disableSaveForItemCodeMsg = true;
        }
        else {
            this.disableSaveForItemCodeMsg = false;
        }
    }

    checkItemDesc(value) {
        if (this.allitemclassificationInfo.find(x => x.description === value.description)) {
            this.disableSaveForItemDescMsg = true;
        }
        else {
            this.disableSaveForItemDescMsg = false;
        }
    }
  

    filterItemCode(event) {
        this.itemClassificationList = this.allitemclassificationInfo;

        const itemCData = [...this.allitemclassificationInfo.filter(x => {
            return x.itemClassificationCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.itemClassificationList = itemCData;
    }
    checkItemCodeExists(value) {


        this.disableSaveForItemCodeMsg = false;
        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {

            if (this.addNewItemClassification.itemClassificationCode == this.allitemclassificationInfo[i].itemClassificationCode || value == this.allitemclassificationInfo[i].itemClassificationCode) {
                this.disableSaveForItemCodeMsg = true;


                return;
            }

        }

    }
    selectedItemCode(object) {
        //const exists = selectedValueValidate('itemClassificationCode', object, this.selectedRecordForEdit)
        //this.disableSaveForItemCodeMsg = !exists;
        this.checkItemcode(object);
    }
    checkItemDescExists(value) {


        this.disableSaveForItemDescMsg = false;
        for (let i = 0; i < this.allitemclassificationInfo.length; i++) {

            if (this.addNewItemClassification.description == this.allitemclassificationInfo[i].description || value == this.allitemclassificationInfo[i].description) {
                this.disableSaveForItemDescMsg = true;


                return;
            }

        }

    }
    selectedItemDesc(object) {
        //const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)
        //this.disableSaveForItemDescMsg = !exists;
        this.checkItemDesc(object);
    }

    filterItemDesc(event) {
        this.itemClassificationDescList = this.allitemclassificationInfo;

        const itemCData = [...this.allitemclassificationInfo.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())   
          
        })]
        this.itemClassificationDescList = itemCData;
    }

    editItemClassification(rowData) {
        console.log(rowData);
        this.isEditMode = true;
        this.disableSaveForEdit = true;
         this.disableSaveForItemCodeMsg = false;
        this.disableSaveForItemDescMsg = false;
     
       this.addNewItemClassification = {
            ...rowData, 
            itemClassificationCode: getObjectByValue('itemClassificationCode', rowData.itemClassificationCode, this.allitemclassificationInfo),
            description: getObjectByValue('description', rowData.description ,  this.allitemclassificationInfo )          
    };
       this.selectedRecordForEdit = {...this.addNewItemClassification}

    }
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }

    changeStatus(rowData) {
        const data = { ...rowData }
        this.itemClassificationService.updateAction(data).subscribe(() => {
            // this.getUOMList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
           
        })

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


    resetItemCForm() {
        this.isEditMode = false;
        this.disableSaveForItemCodeMsg = false;
        this.disableSaveForItemDescMsg = false;
        this.selectedRecordForEdit = undefined;
        this.addNewItemClassification = { ...this.newItemClassification };
    }



    saveItemClassification() {
        const data = {
            ...this.addNewItemClassification, createdBy: this.userName, updatedBy: this.userName,
            itemClassificationCode : editValueAssignByCondition('itemClassificationCode', this.addNewItemClassification.itemClassificationCode),
            description: editValueAssignByCondition('description', this.addNewItemClassification.description)
        };
        console.log(data);
        if (!this.isEditMode) {
            this.itemClassificationService.newAction(data).subscribe(
                () => {
                    this.resetItemCForm();
                    // this.loadAllitemclassificationInfo(this.constantFilters());
                    this.getItemClassificationList();
                    this.alertService.showMessage(
                        'Success',
                        `Added New Item Classification Successfully`,
                        MessageSeverity.success
                    );
                });

           
        } else {
            console.log(data);
            this.itemClassificationService.updateAction(data).subscribe(
                () => {
                    this.selectedRecordForEdit = undefined;
                    this.isEditMode = false;
                    this.resetItemCForm();
                    this.getItemClassificationList();
                    // this.loadAllitemclassificationInfo(this.constantFilters());
                    this.alertService.showMessage(
                        'Success',
                        `Updated New Item Classification Successfully`,
                        MessageSeverity.success
                    );
                });
        }
    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;
    }

    deleteConformation(value) {
        if (value === 'Yes') {
            this.itemClassificationService.deleteAcion(this.selectedRowforDelete.itemClassificationId).subscribe(() => {
                // this.loadAllitemclassificationInfo(this.constantFilters());
               this.getItemClassificationList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted New Item Classification Successfully  `,
                    MessageSeverity.success
                );
            })

        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.itemClassificationService.historyAcion(rowData.itemClassificationId).subscribe(res => {

            console.log(res);
            this.auditHistory = res;
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

    customExcelUpload(event) {
        const file = event.target.files;

          console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.itemClassificationService.ItemClassCustomUpload(this.formData).subscribe(res => {
                 event.target.value = '';
         
                 this.existingRecordsResponse = res;
                 this.getItemClassificationList();
                // this.loadAllitemclassificationInfo(this.constantFilters());
                 this.alertService.showMessage(
                     'Success',
                     `Successfully Uploaded  `,
                     MessageSeverity.success
                 );

            //     // $('#duplicateRecords').modal('show');
            //     // document.getElementById('duplicateRecords').click();

             })
        }

    }

    sampleExcelDownload(){
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=ItemClassification&fileName=itemClassification.xlsx`;
            window.location.assign(url);
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
         this.allitemclassificationInfo=newarry;
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
              this.allitemclassificationInfo = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.allitemclassificationInfo= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.allitemclassificationInfo= newarry;
			}
        }
        this.totalRecords = this.allitemclassificationInfo.length ;
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
            this.commonService.updatedeletedrecords('ItemClassification',
            'itemClassificationId',this.restorerecord.itemClassificationId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getItemClassificationList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 

}