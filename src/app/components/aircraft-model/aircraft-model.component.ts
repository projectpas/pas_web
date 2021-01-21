import { OnInit, Component, ViewChild } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";
// import { NgbModalRef, NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { AircraftModel } from "../../models/aircraft-model.model";
import { AircraftModelService } from "../../services/aircraft-model/aircraft-model.service";
import { AircraftManufacturerService } from "../../services/aircraft-manufacturer/aircraftManufacturer.service";
import { AircraftType } from "../../models/AircraftType.model";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { PaginatorModule, Paginator } from 'primeng/paginator';
import { LazyLoadEvent } from "primeng/api";
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
// import { modelGroupProvider } from "../../../../node_modules/@angular/forms/src/directives/ng_model_group";
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue } from "../../generic/autocomplete";
import { FormBuilder } from "../../../../node_modules/@angular/forms";
import { MatDialog } from "../../../../node_modules/@angular/material";
import { Table } from "../../../../node_modules/primeng/table";
import { ConfigurationService } from "../../services/configuration.service";

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-aircraft-model',
    templateUrl: './aircraft-model.component.html',
    styleUrls: ['./aircraft-model.component.scss'],
    animations: [fadeInOut]
})
/** aircraft-model component*/
export class AircraftModelComponent implements OnInit {

    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'aircraftType', header: 'Aircraft Manufacturer' },
        { field: 'modelName', header: 'Model Name' },
        { field: 'memo', header: 'Memo' }
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
    disableSaveForAircraft:boolean=false;
    descriptionList: any;
    aircraftManufacturerList: any;
    currentstatus: string = 'Active';
    AuditDetails: any;
    rowIndex: any;
    new = {
        aircraftType: "",
        modelName: "",
        aircraftTypeId: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = []
    aircraftModelsList: any;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,        
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public aircraftmodelService: AircraftModelService, private dialog: MatDialog,
        public aicraftManufacturerService: AircraftManufacturerService,
        public configurations: ConfigurationService,
        private commonService: CommonService) {

    }


    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-aircraft-model';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
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

    customAircraftModelExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('ModuleName', 'AircraftModel')
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

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AircraftModel&fileName=AircraftModel.xlsx`;

        window.location.assign(url);
    }

    getList() {
        this.aircraftmodelService.getAll().subscribe(res => {
            // const responseData = res[0];

            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)


            this.originalData = this.originalTableData.map(x => {
                return {
                    aircraftType: x.aircraftType.description,
                    aircraftTypeId: x.aircraftType.aircraftTypeId,
                    modelName: x.modelName,
                    memo: x.memo,
                    aircraftModelId: x.aircraftModelId,
                    createdBy: x.createdBy,
                    updatedBy: x.updatedBy,
                    createdDate: x.createdDate,
                    updatedDate: x.updatedDate,
                     isActive: x.isActive
                }
            })
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
        this.aicraftManufacturerService.getAll().subscribe(res => {
            this.aircraftManufacturerList = res[0];
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
 getChange(){
     
     this.disableSaveForAircraft=false;
 }

    checkGroupDescriptionExists(field, value) {
        console.log(this.selectedRecordForEdit);
        const exists = validateRecordExistsOrNot(field, value, this.aircraftModelsList, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForDescription = true;
           
        }
        else {
            this.disableSaveForDescription = false;
           
        }

    }
    filterDescription(event) {
        this.descriptionList = this.aircraftModelsList;

        const descriptionData = [...this.aircraftModelsList.filter(x => {
            return x.modelName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
        const exists = selectedValueValidate('modelName', object, this.selectedRecordForEdit)

        this.disableSaveForDescription = !exists;
       
    }

    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
             aircraftType: editValueAssignByCondition('aircraftType', this.addNew.aircraftType),
            modelName: editValueAssignByCondition('modelName', this.addNew.modelName)
        };
        if (!this.isEdit) {
            this.aircraftmodelService.add(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Aircraft Model Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            const { aircraftType, ...rest }: any = data;
            this.aircraftmodelService.update(rest).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Aircraft Model Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
        this.aircraftModelsList = [];
    }


    async  edit(rowData) {
     await   this.aircraftManufacturerChange(rowData.aircraftTypeId)
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveGroupId = false;
        this.disableSaveForDescription = false;
        this.disableSaveForAircraft=true;


        this.addNew =
            {
                ...rowData,
                aircraftType: getObjectByValue('aircraftType', rowData.aircraftType, this.originalData),
            modelName: getObjectByValue('modelName', rowData.modelName, this.originalData),
            };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const { aircraftType, ...rest }: any = rowData;
        this.aircraftmodelService.updateActive(rest).subscribe(() => {
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
            this.aircraftmodelService.remove(this.selectedRowforDelete.aircraftModelId).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Aircraft Model Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.aircraftmodelService.getAudit(rowData.aircraftModelId).subscribe(res => {
            this.auditHistory = res;
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

    aircraftManufacturerChange(typeId?) {
       
        const id = typeId == undefined ? this.addNew.aircraftTypeId : typeId
        console.log(id);
        this.aircraftmodelService.getAircraftModelListByManufactureId(id).subscribe(dashNumbers => {
            const responseValue = dashNumbers[0];
            this.aircraftModelsList = responseValue.map(x => {
                return {
                    modelName: x.modelName,
                    aircraftModelId: x.aircraftModelId
                }
            })
            //console.log(this.aircraftModelsList);
        });
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
        //  this.originalData=newarry;

         this.originalData = newarry.map(x => {
            return {
                aircraftType: x.aircraftType.description,
                aircraftTypeId: x.aircraftType.aircraftTypeId,
                modelName: x.modelName,
                memo: x.memo,
                aircraftModelId: x.aircraftModelId,
                createdBy: x.createdBy,
                updatedBy: x.updatedBy,
                createdDate: x.createdDate,
                updatedDate: x.updatedDate,
                isActive: x.isActive
            }
        })


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
            //   this.originalData = newarry; 

            this.originalData = newarry.map(x => {
                return {
                    aircraftType: x.aircraftType.description,
                    aircraftTypeId: x.aircraftType.aircraftTypeId,
                    modelName: x.modelName,
                    memo: x.memo,
                    aircraftModelId: x.aircraftModelId,
                    createdBy: x.createdBy,
                    updatedBy: x.updatedBy,
                    createdDate: x.createdDate,
                    updatedDate: x.updatedDate,
                    isActive: x.isActive
                }
            })

        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
                // this.originalData= newarry;
                this.originalData = newarry.map(x => {
                    return {
                        aircraftType: x.aircraftType.description,
                        aircraftTypeId: x.aircraftType.aircraftTypeId,
                        modelName: x.modelName,
                        memo: x.memo,
                        aircraftModelId: x.aircraftModelId,
                        createdBy: x.createdBy,
                        updatedBy: x.updatedBy,
                        createdDate: x.createdDate,
                        updatedDate: x.updatedDate,
                        isActive: x.isActive
                    }
                })

			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
                // this.originalData= newarry;
                
                this.originalData = newarry.map(x => {
                    return {
                        aircraftType: x.aircraftType.description,
                        aircraftTypeId: x.aircraftType.aircraftTypeId,
                        modelName: x.modelName,
                        memo: x.memo,
                        aircraftModelId: x.aircraftModelId,
                        createdBy: x.createdBy,
                        updatedBy: x.updatedBy,
                        createdDate: x.createdDate,
                        updatedDate: x.updatedDate,
                        isActive: x.isActive
                    }
                })
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
            this.commonService.updatedeletedrecords('AircraftModel',
            'AircraftModelId',this.restorerecord.aircraftModelId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
}