import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { UnitOfMeasureService } from '../../services/unitofmeasure.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';


 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { UnitOfMeasure } from '../../models/unitofmeasure.model';

// import { colorCodeGeneratorForHistory } from '../../generic/history-smart';

@Component({
    selector: 'app-unit-of-measure',
    templateUrl: './unit-of-measure.component.html',
    styleUrls: ['./unit-of-measure.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class UnitOfMeasureComponent implements OnInit {
    // uomHeaders: any;
    
    uomData: any = [];
    // public sourceUnitOfMeasure: any = {};
    // selectedColumns: any = [];
    viewRowData: any;
    selectedRowforDelete: any;
    newUOM =
        {
            description: "",
            shortName: "",
            standard: "",
            masterCompanyId: 1,
            isActive: true,
            isDelete: false,
            memo: "",
            unitName: ''
        }
    addNewUOM = { ...this.newUOM };
    disableSaveForEdit: boolean = false;
    uomList: any;
    isEdit: boolean = false;
    // status: string = 'Active';
    isDeleted:boolean=false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    currentstatus: string = 'Active';


    uomHeaders = [
        { field: 'description', header: 'Unit Of Measure' },
        { field: 'shortName', header: 'Short Name' },
        { field: 'standard', header: 'Standard' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.uomHeaders;
    formData = new FormData()
    @ViewChild('dt',{static:false})
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    selectedRecordForEdit: any;
    disableSaveForShortName: boolean = false;
    // disableSaveForStandard:boolean=false;
    disableSaveForUOMMsg: boolean = false;
    disableSaveForShortNameMsg: boolean = false;
    shortNameList: any;
    
    
    constructor(private breadCrumb: SingleScreenBreadcrumbService, private modalService: NgbModal,
        private commonService: CommonService,
        private configurations: ConfigurationService, 
        private authService: AuthService,
         private alertService: AlertService,
          public unitofmeasureService: UnitOfMeasureService)
           {


    }
    ngOnInit(): void {
        this.getUOMList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-unit-of-measure';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
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

        this.getUOMList();
    }

    

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.unitofmeasureService.UOMFileUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getUOMList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

                // $('#duplicateRecords').modal('show');
                // document.getElementById('duplicateRecords').click();

            })
        }

    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=UnitOfMeasure&fileName=uom.xlsx`;

        window.location.assign(url);
    }

    getUOMList() {
        this.unitofmeasureService.getAllUnitofMeasureList().subscribe(res => {
          //  const responseData = res[0];
            this.originalTableData=res[0].columnData;
            this.getListByStatus(this.status ? this.status :this.currentstatus)
            // this.uomData = responseData.columnData ;
            // this.totalRecords = responseData.totalRecords;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }




    checkUOMExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.uomData, this.selectedRecordForEdit);
        if (exists.length > 0) {
           
            this.disableSaveForUOMMsg = true;
            this.disableSaveForShortNameMsg = false;
        }
        else {
           
            this.disableSaveForUOMMsg = false;
            this.disableSaveForShortNameMsg = false;
        }

    }
    checkShortNameExists(field, value) {
        console.log(this.selectedRecordForEdit);
        let tempUOMData = [];
        for(let i = 0; i< this.uomData.length; i++){
            if(this.uomData[i].shortName != null || this.uomData[i].shortName != undefined){
                tempUOMData.push(this.uomData[i])
            }
        }
        const exists = validateRecordExistsOrNot(field, value, tempUOMData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForShortName = true;
            this.disableSaveForUOMMsg = true;
            this.disableSaveForShortNameMsg = true;
            // this.disableSaveForStandard=true;
        }
        else {
            this.disableSaveForShortName = false;
            this.disableSaveForUOMMsg = false;
            this.disableSaveForShortNameMsg = false;
            // this.disableSaveForStandard=false;
        }

    }
    filterUnitOfMeasures(event) {
        this.uomList = this.originalTableData;

        const UOMData = [...this.originalTableData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.uomList = UOMData;
    }
    filterShortName(event) {
        this.shortNameList = this.originalTableData;
        let tempUOMData = [];
        for(let i = 0; i< this.originalTableData.length; i++){
            if(this.originalTableData[i].shortName != null || this.originalTableData[i].shortName != undefined){
                tempUOMData.push(this.originalTableData[i])
            }
        }
        const shortNameData = [...tempUOMData.filter(x => {
            return x.shortName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.shortNameList = shortNameData;
    }
    selectedUOM(rowData):void {
        const exists = selectedValueValidate
        ('description', rowData, this.selectedRecordForEdit)

        this.disableSaveForUOMMsg=!exists;
    }
    selectedShortName(rowData):void {
        const exists = selectedValueValidate
        ('shortName', rowData, this.selectedRecordForEdit)
        this.disableSaveForShortName = !exists;
        this.disableSaveForShortNameMsg=!exists;
    }

    
    
    

    saveUOM() {
        const data = {
            ...this.addNewUOM, createdBy: this.userName, updatedBy: this.userName,
            shortName: editValueAssignByCondition('shortName', this.addNewUOM.shortName),
            description: editValueAssignByCondition('description', this.addNewUOM.unitName),
            unitName: editValueAssignByCondition('description', this.addNewUOM.unitName)
        };
        if (!this.isEdit) {
            this.unitofmeasureService.newUnitOfMeasure(data).subscribe(() => {
                this.resetUOMForm();
                this.getUOMList();
                this.alertService.showMessage(
                    'Success',
                    `Added New Unit of Measure Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.unitofmeasureService.updateUnitOfMeasure(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetUOMForm();
                this.getUOMList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Unit of Measure Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    resetUOMForm() {
        this.isEdit = false;
        this.disableSaveForShortName = false;
        // this.disableSaveForStandard=false;
        this.disableSaveForShortNameMsg = false;
        this.disableSaveForUOMMsg = false;
        this.selectedRecordForEdit = undefined;
        this.addNewUOM = { ...this.newUOM };
    }


    editUOM(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveForEdit = true;
        this.disableSaveForShortName = false;
        // this.disableSaveForStandard=false;
        this.disableSaveForUOMMsg = false;
        this.disableSaveForShortNameMsg = false;
        // this.addNewUOM = rowData;

        this.addNewUOM = {
            ...rowData, unitName: getObjectById('unitOfMeasureId', rowData.unitOfMeasureId, this.uomData),
            shortName: getObjectById('unitOfMeasureId', rowData.unitOfMeasureId, this.uomData)
        };
        this.selectedRecordForEdit = { ...this.addNewUOM }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.unitofmeasureService.updateUnitOfMeasure(data).subscribe(() => {
            // this.getUOMList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
            this.getUOMList();
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
            this.unitofmeasureService.deleteUnitOfMeasure(this.selectedRowforDelete.unitOfMeasureId).subscribe(() => {
                this.getUOMList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted UOM Successfully  `,
                    MessageSeverity.success
                );
                // this.geEmpListByStatus(this.status);
            })
          
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.unitofmeasureService.getUnitOfWorkAuditDetails(rowData.unitOfMeasureId).subscribe(res => {
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

    getmemo() {
     
            this.disableSaveForEdit = false;
            // this.disableSaveForStandard=false;
           
        
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
         this.uomData=newarry;
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
              this.uomData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.uomData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.uomData= newarry;
			}
        }
        this.totalRecords = this.uomData.length ;
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
            this.commonService.updatedeletedrecords('UnitOfMeasure',
            'UnitOfMeasureId',this.restorerecord.unitOfMeasureId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
               
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getUOMList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
    
    
    
 

}