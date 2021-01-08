import { OnInit, Component, ViewChild } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AuthService } from "../../services/auth.service";
import { AlertService, MessageSeverity } from "../../services/alert.service";
// import { NgbModalRef, NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AircraftType } from "../../models/AircraftType.model";
import { AircraftManufacturerService } from "../../services/aircraft-manufacturer/aircraftManufacturer.service";
import { SingleScreenAuditDetails } from "../../models/single-screen-audit-details.model";
import { LazyLoadEvent } from "primeng/api";
import { MasterCompany } from "../../models/mastercompany.model";
import { MasterComapnyService } from "../../services/mastercompany.service";
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { Table } from "primeng/table";
import { MatDialog } from "@angular/material";
import { FormBuilder } from "@angular/forms";
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue } from "../../generic/autocomplete";
import { ConfigurationService } from '../../services/configuration.service';


import { NgbModal,NgbModalRef,ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';


@Component({
    selector: 'app-aircraft-manufacturer',
    templateUrl: './aircraft-manufacturer.component.html',
    styleUrls: ['./aircraft-manufacturer.component.scss'],
    animations: [fadeInOut]
})
/** aircraft-manufacturer component*/
export class AircraftManufacturerComponent implements OnInit {


    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'description', header: 'Aircraft Manufacturer Name' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveGroupId: boolean = false;
    PortalList: any;
    disableSaveForDescription: boolean = false;
    descriptionList: any;
    currentstatus: string = 'Active';
disableSave:boolean=false;

    new = {
        description: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = []
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
       
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public aircraftManufacturerService: AircraftManufacturerService, 
        private dialog: MatDialog, private masterComapnyService: MasterComapnyService,
         private commonService: CommonService, private configurations: ConfigurationService) {

    }


    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-aircraft-manufacturer';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    getmemo() {
        this.disableSave = false;
};
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }

    customAircraftTypeExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('ModuleName', 'AircraftType')
            this.formData.append('file', file[0])


            this.commonService.smartExcelFileUpload(this.formData).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

            })
        }

    }

    sampleAircraftTypeExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AircraftType&fileName=AircraftType.xlsx`;
        window.location.assign(url);
    }
    getList() {
        this.aircraftManufacturerService.getAll().subscribe(res => {
            // console.log(res[0])
            // const responseData = res[0];

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)


            // this.originalData = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }


    checkGroupDescriptionExists(field, value) {
        console.log(this.selectedRecordForEdit);
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForDescription = true;
        }
        else {
            this.disableSaveForDescription = false;
        }

    }
    filterDescription(event) {
        this.descriptionList = this.originalData;

        const descriptionData = [...this.originalData.filter(x => {
            return x.description.trim().toLowerCase().includes(event.query.trim().toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)
        this.disableSaveForDescription = !exists;
    }

    // save() {
    //     const data = {
    //         ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
    //         description: editValueAssignByCondition('description', this.addNew.description),
    //     };
    //     if (!this.isEdit) {
    //         this.aircraftManufacturerService.add(data).subscribe(() => {
    //             this.resetForm();
    //             this.getList();
    //             this.alertService.showMessage(
    //                 'Success',
    //                 `Added  New Aircraft Manufacturer Successfully`,
    //                 MessageSeverity.success
    //             );
    //         })
    //     } else {
    //         this.aircraftManufacturerService.update(data).subscribe(() => {
    //             this.selectedRecordForEdit = undefined;
    //             this.isEdit = false;
    //             this.resetForm();
    //             this.getList();
    //             this.alertService.showMessage(
    //                 'Success',
    //                 `Updated Aircraft Manufacturer Successfully`,
    //                 MessageSeverity.success
    //             );
    //         })
    //     }
    // }


    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            description: editValueAssignByCondition('description', this.addNew.description),
        };
        if (!this.isEdit) {
            this.aircraftManufacturerService.add(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Aircraft Manufacturer Successfully`,
                    MessageSeverity.success
                )
            }, error => {
                this.alertService.showMessage(
                    'Failed',
                    error.error,
                    MessageSeverity.error
                )
            })
        } else {
            this.aircraftManufacturerService.update(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Aircraft Manufacturer Successfully`,
                    MessageSeverity.success
                );
            }, error => {
                this.alertService.showMessage(
                    'Failed',
                    error.error,
                    MessageSeverity.error
                );
            }
            )
        }
    }


    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSave =true;
        this.disableSaveGroupId = false;
        this.disableSaveForDescription = false;


        this.addNew = {
            ...rowData,
            description: getObjectByValue('description', rowData.description, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.aircraftManufacturerService.updateActive(data).subscribe(() => {

            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

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
            this.aircraftManufacturerService.remove(this.selectedRowforDelete.aircraftTypeId).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Aircraft Type Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
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
            this.commonService.updatedeletedrecords('AircraftType',
            'AircraftTypeId',this.restorerecord.aircraftTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }

    getAuditHistoryById(rowData) {
        this.aircraftManufacturerService.getAudit(rowData.aircraftTypeId).subscribe(res => {
            this.auditHistory = res[0].result;
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

    // pageSearch: { query: any; field: any; };
    // first: number;
    // rows: number;
    // paginatorState: any;
    // loadingIndicator: boolean;
    // AuditDetails: any[];
    // public sourceAction : any;
    // /** aircraft-manufacturer ctor */
    // allComapnies: MasterCompany[] = [];
    // currentAircraftManufacturerType: AircraftType;
    // aircraftManufacturerTypeToUpdate: AircraftType;
    // aircraftManufacturerTypeToRemove: AircraftType;
    // aircraftManufacturerTypeToUpdateActive: AircraftType;
    // aircraftManufacturertoview: AircraftType;
    // aircraftManufacturerList: AircraftType[];
    // aircraftManufacturerPagination: AircraftType[];//added
    // public sourceaircraftmanufacturer: any = {}
    // aircraftManufacturerSearchList: AircraftType[];
    // aircraftManufacturerPaginationList: any[] = [];
    // modal: NgbModalRef;
    // display: boolean = false;
    // modelValue: boolean = false;
    // Active: string;
    // manufactureViewField: any = {};
    // //adding for Pagination start
    // totalRecords: number;
    // cols: any[];
    // loading: boolean;
    // comments: any = " ";
    // createdBy: any = "";
    // updatedBy: any = "";
    // createdDate: any = "";
    // updatedDate: any = "";
    // field: any;
    // aircraftManufacturer = [];
    // totelPages: number;
    // allmanufacturerInfo: AircraftType[] = [];
    // actionmanufacturer: any[] = [];
    // selectedActionName: any;
    // localCollection: any[] = [];
    // disableSave: boolean = false;
    // manufacturer: string;
    // //adding for Pagination End
    // selectedColumns : any[];
    // selectedColumn : AircraftType[];

    // constructor(private breadCrumb: SingleScreenBreadcrumbService,
    //     private aircraftManufacurerService: AircraftManufacturerService, private masterComapnyService: MasterComapnyService, private alertService: AlertService, private modalService: NgbModal, private authService: AuthService, ) {

    // }

    // //filterGrid(query, field, Mode) {
    // //    this.pageSearch = {
    // //        query: query,
    // //        field: field
    // //    }
    // //    console.log(query, field, Mode);
    // //    this.aircraftManufacurerService.getPageSerach(pageSearch).subscribe(aircraftManufacturer => {
    // //        this.aircraftManufacturerSearchList = aircraftManufacturer[0];
    // //        this.totalRecords = this.aircraftManufacturerList.length;//Adding for Pagination
    // //    });
    // //  }

    // private loadMasterCompanies() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.masterComapnyService.getMasterCompanies().subscribe(
    //         results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );

    // }
    // private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
    //     // alert('success');
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.allComapnies = allComapnies;

    // }
    // private onDataLoadFailed(error: any) {
    //     // alert(error);
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;

    // }
    // ngOnInit(): void {
    //     this.breadCrumb.currentUrl = '/singlepages/singlepages/app-aircraft-manufacturer';
    //     this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    //     this.currentAircraftManufacturerType = new AircraftType();
    //     this.loadData();
    //     //Adding for p-table in table also we can put headers and columns manually
    //     this.cols = [

    //         { field: 'description', header: 'Aircraft Manufacturer Name' },
    //         { field: 'memo', header: 'Memo' },
    //     ];
    //     this.selectedColumns = this.cols;
    //     this.loading = true;
    //     //P-table Code End
    // }
    // public loadData() {
    //     this.aircraftManufacurerService.getAll().subscribe(aircraftManufacturer => {
    //         this.aircraftManufacturerList = aircraftManufacturer[0];
    //         this.allmanufacturerInfo = aircraftManufacturer[0];
    //         this.totalRecords = this.aircraftManufacturerList.length;//Adding for Pagination
    //         this.totelPages = Math.ceil(this.totalRecords / this.rows);
    //         this.aircraftManufacturerList.forEach(function (manufacturer) {
    //             manufacturer.isActive = manufacturer.isActive == false ? false : true;
    //         });
    //     });
    // }

    // loadAircraftManufacturer(event: LazyLoadEvent) //when page initilizes it will call this method
    // {
    //     this.loading = true;
    //     this.rows = event.rows;
    //     this.first = event.first;
    //     if (this.field) {
    //         this.aircraftManufacturer.push({
    //             first: this.first,
    //             page: 10,
    //             pageCount: 10,
    //             rows: this.rows,
    //             limit: 5
    //         })
    //         if (this.aircraftManufacturer) {
    //             this.aircraftManufacurerService.getServerPages(this.aircraftManufacturer[this.aircraftManufacturer.length - 1]).subscribe( //we are sending event details to service
    //                 pages => {
    //                     if (pages.length > 0) {
    //                         this.aircraftManufacturerPaginationList = pages;
    //                         this.totalRecords = this.aircraftManufacturerPaginationList[0].totalRecordsCount;
    //                         this.totelPages = Math.ceil(this.totalRecords / this.rows);
    //                     }
    //                 });
    //         }
    //     }
    //     else {
    //         setTimeout(() => {
    //             if (this.aircraftManufacturerList) {
    //                 this.aircraftManufacurerService.getServerPages(event).subscribe( //we are sending event details to service
    //                     pages => {
    //                         if (pages.length > 0) {
    //                             this.aircraftManufacturerPagination = pages[0];
    //                         }
    //                     });
    //                 this.loading = false;
    //             }
    //         }, 1000);
    //     }

    // }
    // //Pagination Code End

    // get userName(): string {
    //     return this.authService.currentUser ? this.authService.currentUser.userName : "";
    // }

    // addAircraftManufacturer(): void {
    //     if (!(this.currentAircraftManufacturerType.description)) {
    //         this.display = true;
    //         return;
    //     }
    //     this.currentAircraftManufacturerType.createdBy = this.userName;
    //     this.currentAircraftManufacturerType.updatedBy = this.userName;
    //     this.aircraftManufacurerService.add(this.currentAircraftManufacturerType).subscribe(aircraftManufacturer => {
    //         this.alertService.showMessage("Success", 'Aircraft manufacturer Added successfully.', MessageSeverity.success);
    //         // this.updatePaginatorState(); // previously after update we used to call getAll now we can this method to get required list
    //         this.loadData();
    //         this.resetAddAircraftManufacturer();
    //         this.dismissModel();
    //     });

    // }



    // setAircraftManufacturerToUpdate(editAircraftManufacturerpopup: any, id: number): void {
    //     this.aircraftManufacturerTypeToUpdate = Object.assign({}, this.allmanufacturerInfo.filter(function (aircraftManufacturer) {
    //         return aircraftManufacturer.aircraftTypeId == id;
    //     })[0]);
    //     this.loadData();
    //     this.modal = this.modalService.open(editAircraftManufacturerpopup, { size: 'sm' });
    // }

    // updateAircraftManufacturer(): void {
    //     this.currentAircraftManufacturerType.updatedBy = this.userName;
    //     this.aircraftManufacurerService.update(this.aircraftManufacturerTypeToUpdate).subscribe(aircraftmanufacturer => {
    //         this.alertService.showMessage("Success", 'Aircraft manufacturer Updated successfully.', MessageSeverity.success);
    //         // this.updatePaginatorState(); // previously after update we used to call getAll now we can this method to get required list
    //         this.loadData();
    //         this.resetUpdateAircraftManufacturer();
    //         this.dismissModel();
    //     });
    // }

    // removeAircraftManufacturer(): void {
    //     this.aircraftManufacurerService.remove(this.aircraftManufacturerTypeToRemove.aircraftTypeId).subscribe(response => {
    //         this.alertService.showMessage("Success", 'Aircraft manufacturer removed successfully.', MessageSeverity.success);
    //         // this.updatePaginatorState(); // previously after update we used to call getAll now we can this method to get required list
    //         this.loadData();
    //         this.dismissModel();
    //     });

    // }
    // // UpdateActiveManufacture() {
    // //     this.aircraftManufacurerService.updateActive(this.aircraftManufacturerTypeToUpdateActive.aircraftTypeId).subscribe(response => {
    // //         this.alertService.showMessage("Success", 'Aircraft manufacturer removed successfully.', MessageSeverity.success);
    // //         // this.updatePaginatorState(); // previously after update we used to call getAll now we can this method to get required list
    // //         this.loadData();
    // //         this.dismissModel();
    // //     });
    // // }
    // resetAddAircraftManufacturer(): void {
    //     this.currentAircraftManufacturerType = new AircraftType();
    // }

    // resetUpdateAircraftManufacturer(): void {
    //     this.aircraftManufacturerTypeToUpdate = new AircraftType();
    // }

    // dismissModel(): void {
    //     if (this.modal != undefined) {
    //         this.modal.close();
    //     }
    // }

    // confirmDelete(content, id): void {
    //     this.aircraftManufacturerTypeToRemove = Object.assign({}, this.allmanufacturerInfo.filter(function (manufacturer) {
    //         return manufacturer.aircraftTypeId == id;
    //     })[0]);;
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    // }
    // openView(viewData, id): void {
    //     this.aircraftManufacturertoview = Object.assign({}, this.allmanufacturerInfo.filter(function (manufacturer) {
    //         return manufacturer.aircraftTypeId == id;
    //     })[0]);;
    //     console.log(this.aircraftManufacturertoview);
    //     this.modal = this.modalService.open(viewData, { size: 'sm' });

    // }
    // updateStatus(rowData){
    //     const data = {
    //         AircraftTypeId : rowData.aircraftTypeId,
    //         Description : rowData.description,
    //         Memo : rowData.memo,
    //         MasterCompanyId :  1,

    //    }
    //    this.modal = this.modalService.open(rowData, { size: 'sm' });
    //           this.aircraftManufacurerService.updateActive(data).subscribe(response => { 

    //     })
    // }
    // toggleIsActive(rowData: any): void {
    //     const data = {
    //          aircraftTypeId : rowData.AircraftTypeId,
    //          description : rowData.Description,
    //          memo : rowData.Memo,
    //          masterCompanyId :  1,

    //     }
    //     // this.aircraftManufacturerTypeToUpdateActive = assetStatus;
    //     // this.aircraftManufacturerTypeToUpdateActive.isActive = assetStatus.isActive;
    //     // this.aircraftManufacturerTypeToRemove = Object.assign({}, this.allmanufacturerInfo.filter(function (manufacturer) {
    //     //     return manufacturer.aircraftTypeId == id;
    //     // })[0]);;
    //     this.modal = this.modalService.open(rowData, { size: 'sm' });
    //     // this.aircraftManufacurerService.updateActive(data).subscribe(response => { 

    //     // })
    //     // this.UpdateActiveManufacture();
    // }
    // handleChange(rowData: any) {
    //        this.sourceAction = rowData;           
    //         this.Active = "In Active";
    //         this.sourceAction.isActive == false;
    //        this.aircraftManufacurerService.updateActive(this.sourceAction).subscribe(
    //            data =>{
    //               // console.log(data);
    //                this.alertService.showMessage("Success", 'Aircraft manufacturer updated successfully.', MessageSeverity.success);
    //            }
    //        )
    //         //alert(e);


    // }

    // showAuditPopup(template, manufacturerId): void {
    //     this.audit(manufacturerId);
    //     this.modal = this.modalService.open(template, { size: 'sm' });
    // }

    // audit(manufacturerId: number): void {
    //     this.AuditDetails = [];
    //     this.aircraftManufacurerService.getAudit(manufacturerId).subscribe(audits => {
    //         if (audits.length > 0) {
    //             this.AuditDetails = audits;
    //             this.AuditDetails[0].ColumnsToAvoid = ["AircraftTypeAuditId", "masterCompanyId", "createdBy", "createdDate", "updatedDate"];
    //         }
    //     });
    // }
    // open(content) //added
    // {
    //     this.currentAircraftManufacturerType = new AircraftType();
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }
    // // updatePaginatorState() //need to pass this Object after update or Delete to get Server Side pagination
    // // {
    // //     this.paginatorState = {
    // //         rows: this.rows,
    // //         first: this.first
    // //     }
    // //     if (this.paginatorState) {
    // //         this.loadAircraftManufacturer(this.paginatorState);
    // //     }
    // // }
    // manufactureId(event) {
    //     for (let i = 0; i < this.actionmanufacturer.length; i++) {
    //         if (event == this.actionmanufacturer[i][0].manufacturer) {
    //             //alert("Action Name already Exists");
    //             this.disableSave = true;
    //             this.selectedActionName = event;
    //         }
    //     }
    // }
    // filterManufacturer(event) {

    //     this.localCollection = [];
    //     for (let i = 0; i < this.allmanufacturerInfo.length; i++) {
    //         let manufacturer = this.allmanufacturerInfo[i].description;
    //         if (manufacturer.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.actionmanufacturer.push([{
    //                 "aircraftTypeId": this.allmanufacturerInfo[i].aircraftTypeId,
    //                 "manufacturer": manufacturer
    //             }]),
    //                 this.localCollection.push(manufacturer);
    //         }
    //     }
    // }
    // eventHandler(event) {
    //     let value = event.target.value.toLowerCase();
    //     if (this.selectedActionName) {
    //         if (value == this.selectedActionName.toLowerCase()) {
    //             //alert("Action Name already Exists");
    //             this.disableSave = true;
    //         }
    //         else {
    //             this.disableSave = false;
    //         }
    //     }
    // }
}