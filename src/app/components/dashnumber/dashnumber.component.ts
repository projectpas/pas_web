import { OnInit, Component, ViewChild } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
import { AircraftModel } from "../../models/aircraft-model.model";
import { AircraftType } from "../../models/AircraftType.model";
import { AircraftManufacturerService } from "../../services/aircraft-manufacturer/aircraftManufacturer.service";
import { AircraftDashNumber } from "../../models/dashnumber.model";
import { DashNumberService } from "../../services/dash-number/dash-number.service";
import { AircraftModelService } from "../../services/aircraft-model/aircraft-model.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { PaginationService } from "../../services/pagination/pagination.service";
import { MasterComapnyService } from "../../services/mastercompany.service";
import { MasterCompany } from "../../models/mastercompany.model";
import { Table } from "../../../../node_modules/primeng/table";
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue, getObjectById } from "../../generic/autocomplete";
import { ConfigurationService } from "../../services/configuration.service";
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { FormBuilder } from "../../../../node_modules/@angular/forms";
import { MatDialog } from "../../../../node_modules/@angular/material";

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-dashnumber',
    templateUrl: './dashnumber.component.html',
    styleUrls: ['./dashnumber.component.scss'],
    animations: [fadeInOut]
})
/** dashnumber component*/
export class DashnumberComponent implements OnInit {

    originalData: any=[];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'aircraftType', header: 'Aircraft Manufacturer' },
        { field: 'aircraftModel', header: 'Model Name' },
        { field: 'dashNumber', header: 'Dash Number' },
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
    disableSaveDashnumber:boolean=false;
    disableSaveForDescription: boolean=false;
    disableSaveWorkperformed: boolean = false
    descriptionList: any;
    workPerformedCodeList: any;
    currentstatus: string = 'Active';


    new = {
        aircraftTypeId: "",
        aircraftModelId: "",
        dashNumber: "",
        aircraftModel: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = []
    aircraftManufacturerList: any;
    aircraftModelsList: any;
    alldashnumberInfo: any;
    dashnumbers: any;

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public dashNumberService: DashNumberService,
        private configurations: ConfigurationService,
        private dialog: MatDialog, private aircraftManufacturerService: AircraftManufacturerService,
        private aircraftModelService: AircraftModelService,
        private commonService: CommonService) {

    }


    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-dashnumber';
        
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

    customDashNumberExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.dashNumberService.CustomerDashNumberUpload(this.formData).subscribe(res => {
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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=DashNumber&fileName=DashNumber.xlsx`;

        window.location.assign(url);
    }

    getList() {
        this.dashNumberService.getAll().subscribe(res => {


            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)
    
            // const responseData = res[0];
            this.originalData = this.originalTableData.map(x => {
                return {
                    dashNumberId: x.dashNumberId,
                    aircraftModelId: x.aircraftModelId,
                    aircraftTypeId: x.aircraftTypeId,
                    aircraftType: x.aircraftType.description,
                    createdBy: x.createdBy,
                    updatedBy: x.updatedBy,
                    createdDate: x.createdDate,
                    updatedDate: x.updatedDate,
                    aircraftModel: x.aircraftModel.modelName,
                    dashNumber: x.dashNumber,
                    memo: x.memo,
                    isActive: x.isActive,
                }
            })
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
        this.aircraftManufacturerService.getAll().subscribe(aircraftManufacturer => {
            this.aircraftManufacturerList = aircraftManufacturer[0];
        });
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    aircraftManufacturerChange(typeId?) {
        const id = typeId == undefined ? this.addNew.aircraftTypeId : typeId
        console.log(id);
        this.aircraftModelService.getAircraftModelListByManufactureId(id).subscribe(dashNumbers => {
            const responseValue = dashNumbers[0];
            this.aircraftModelsList = responseValue.map(x => {
                return {
                    aircraftModel: x.modelName,
                    aircraftModelId: x.aircraftModelId
                }
            })
            //console.log(this.aircraftModelsList);
        });
    }
    getmemo() {      
            this.disableSaveDashnumber = false;
     
    }
    getDashNumberByManfacturerandModel() {
        console.log(this.addNew)
        this.dashNumberService.getDashNumberByModelTypeId(this.addNew.aircraftModelId, this.addNew.aircraftTypeId).subscribe((dashnumberValues) => {
            const respData = dashnumberValues;
            this.alldashnumberInfo = dashnumberValues;
            console.log(this.alldashnumberInfo)
            this.dashnumbers = respData.map(x => {

                return {
                    dashNumber: x.dashNumber,
                    dashNumberId: x.dashNumberId
                }
            })

        })
    }
    checkGroupDescriptionExists(field, value) {
        console.log(this.selectedRecordForEdit);
        const exists = validateRecordExistsOrNot(field, value, this.dashnumbers, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForDescription = true;
           
        }
        else {
            this.disableSaveForDescription = false;
            
        }

    }
    filterDescription(event) {
        this.descriptionList = this.dashnumbers;

        const descriptionData = [...this.dashnumbers.filter(x => {
            return x.dashNumber.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
        const exists = selectedValueValidate('dashNumber', object, this.selectedRecordForEdit)

        this.disableSaveForDescription = !exists;
        
    }

    save() {
        console.log(this.addNew);
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            dashNumber: editValueAssignByCondition('dashNumber', this.addNew.dashNumber)
        };
        console.log(data);
        if (!this.isEdit) {
            this.dashNumberService.add(data).subscribe(() => {
                this.resetForm();
                this.getList();

                this.alertService.showMessage(
                    'Success',
                    `Added  New Dash Number Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            const { aircraftType, aircraftModel, ...rest }: any = data;
            this.dashNumberService.update(rest).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Dash Number Successfully  `,
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
        this.dashnumbers = [];
    }


    async edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveGroupId = false;
        this.disableSaveForDescription = false;
        this.disableSaveDashnumber=true;
        await this.aircraftManufacturerChange(rowData.aircraftTypeId);
      
        this.addNew = {
            ...rowData,
            dashNumber: getObjectById('dashNumber', rowData.dashNumber, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.dashNumberService.updateActive(data).subscribe(() => {
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
        // console.log(rowData);
        this.selectedRowforDelete = rowData;

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.dashNumberService.remove(this.selectedRowforDelete.dashNumberId).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Dash Number Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.dashNumberService.getDashNumberAudit(rowData.dashNumberId).subscribe(res => {
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
                dashNumberId: x.dashNumberId,
                aircraftModelId: x.aircraftModelId,
                aircraftTypeId: x.aircraftTypeId,
                aircraftType: x.aircraftType.description,
                createdBy: x.createdBy,
                updatedBy: x.updatedBy,
                createdDate: x.createdDate,
                updatedDate: x.updatedDate,
                aircraftModel: x.aircraftModel.modelName,
                dashNumber: x.dashNumber,
                memo: x.memo,
                isActive: x.isActive,
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
                dashNumberId: x.dashNumberId,
                aircraftModelId: x.aircraftModelId,
                aircraftTypeId: x.aircraftTypeId,
                aircraftType: x.aircraftType.description,
                createdBy: x.createdBy,
                updatedBy: x.updatedBy,
                createdDate: x.createdDate,
                updatedDate: x.updatedDate,
                aircraftModel: x.aircraftModel.modelName,
                dashNumber: x.dashNumber,
                memo: x.memo,
                isActive: x.isActive,
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
                        dashNumberId: x.dashNumberId,
                        aircraftModelId: x.aircraftModelId,
                        aircraftTypeId: x.aircraftTypeId,
                        aircraftType: x.aircraftType.description,
                        createdBy: x.createdBy,
                        updatedBy: x.updatedBy,
                        createdDate: x.createdDate,
                        updatedDate: x.updatedDate,
                        aircraftModel: x.aircraftModel.modelName,
                        dashNumber: x.dashNumber,
                        memo: x.memo,
                        isActive: x.isActive,
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
                        dashNumberId: x.dashNumberId,
                        aircraftModelId: x.aircraftModelId,
                        aircraftTypeId: x.aircraftTypeId,
                        aircraftType: x.aircraftType.description,
                        createdBy: x.createdBy,
                        updatedBy: x.updatedBy,
                        createdDate: x.createdDate,
                        updatedDate: x.updatedDate,
                        aircraftModel: x.aircraftModel.modelName,
                        dashNumber: x.dashNumber,
                        memo: x.memo,
                        isActive: x.isActive,
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
            this.commonService.updatedeletedrecords('AircraftDashNumber',
            'DashNumberId',this.restorerecord.dashNumberId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
   
    
}