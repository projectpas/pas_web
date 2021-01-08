import { Component, OnInit,  ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { CreditTermsService } from '../../services/Credit Terms.service';
import { AlertService,  MessageSeverity } from '../../services/alert.service';
import { CreditTerms } from '../../models/credit-terms.model';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { ConfigurationService } from '../../services/configuration.service';
import { Table } from 'primeng/table';
import { ConditionService } from '../../services/condition.service';
import { PercentService } from '../../services/percent.service';
import { validateRecordExistsOrNot, getObjectById, getObjectByValue, selectedValueValidate, editValueAssignByCondition } from '../../generic/autocomplete';

 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-credit-terms',
    templateUrl: './credit-terms.component.html',
    styleUrls: ['./credit-terms.component.scss'],
    animations: [fadeInOut]
})


export class CreditTermsComponent implements OnInit {
    selectedActionName: any;
    actionamecolle: any[] = [];
    selectedColumns: any[];
 
    isEditMode: boolean = false;

    selectedColumn: any[];
    filteredBrands: any[];
    localCollection: any[] = [];
    Active: string = "Active";
    modal: NgbModalRef;
    viewRowData: any;
    selectedRowforDelete: any;
    percentageList:any[];
    dayList:number[]=[];
    netDayList:number[]=[];
    creditTermData: any=[];
    creditTermsList: any;
    formData = new FormData();
    existingRecordsResponse: Object;
    disableSaveForCreditTermMSg : boolean = false;
    creditTermHeaders = [

        { field: 'name', header: 'Credit Term Name' },
        { field: 'percentage', header: 'Percentage' },
        { field: 'days', header: 'Days' },
        { field: 'netDays', header: 'Net Days' },
        { field: 'memo', header: 'Memo' },

    ];
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    @ViewChild('dt',{static:false})
    private table: Table;
    auditHistory: any[] = [];
    selectedRecordForEdit: any;
    newCreditTerm =
        {
            name: "",
            percentage: null,
            days: 0,
            netDays:0,
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            memo: ""
        };
    addNewCreditTerm= { ...this.newCreditTerm };
    disableSaveForEdit: boolean;
    currentstatus: string = 'Active';
    /** credit terms ctor */
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private modalService: NgbModal,
        private commonService: CommonService,
         private authService: AuthService, private alertService: AlertService, private configurations: ConfigurationService,
        public percentageService: PercentService, public creditTermService: CreditTermsService) {


    }
    ngOnInit(): void {
        this.selectedColumns = this.creditTermHeaders;
        this.getCreditTermList();
        this.getPercentageList();
        this.setDays();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-credit-terms';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
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
    private getCreditTermList() {
        this.creditTermService.getCreditTermsList().subscribe(res => {
            // const respData = res[0];

            this.originalTableData=res[0].columnData;
            this.getListByStatus(this.status ? this.status :this.currentstatus)

            // this.creditTermData = respData.columnData;
            // this.totalRecords = respData.totalRecords;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        });
    }

    private getPercentageList() {
        this.percentageService.getPercentages().subscribe(res => {
            const respData = res[0];
            this.percentageList= respData;
        });
    }
    private setDays(){
        const DAYCOUNT=360;
        for(var i = 0; i <= DAYCOUNT; i++){
            this.dayList.push(i);
            this.netDayList.push(i);

         }
    }

    resetCreditTermsForm() {
        this.isEditMode = false;
        // this.disableSaveForCreditTerm = false;
        this.disableSaveForCreditTermMSg = false;

        this.selectedRecordForEdit = undefined;
        this.addNewCreditTerm = { ...this.newCreditTerm };
    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.creditTermService.updatecreditterms(data).subscribe(() => {
            // this.getUOMList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

    }

  getmemo(){
      this.disableSaveForEdit=false;
  }

    customExcelUpload(event) {
        const file = event.target.files;
        console.log(file);
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.creditTermService.creditTermsCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';
                this.existingRecordsResponse = res;
                this.getCreditTermList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );                
            })
        }
    }

    onBlur(event) {
        const value = event.target.value;
      
        this.disableSaveForCreditTermMSg = false;
        for (let i = 0; i < this.creditTermData.length; i++) {
            let name = this.creditTermData[i].name;
            let CreditTermsId = this.creditTermData[i].CreditTermsId;
            if (name.toLowerCase() == value.toLowerCase()) {
                if (this.isEditMode  || !this.isEditMode) {
                    this.disableSaveForCreditTermMSg = true;
                }
                else if (CreditTermsId != this.selectedRecordForEdit.CreditTermsId) {
                    this.disableSaveForCreditTermMSg = true;

                }
                else {
                   
                    this.disableSaveForCreditTermMSg = false;
                }
                console.log('name :', name);
                break;
            }
        }

    }

    filterCreditTerms(event) {
        this.creditTermsList = this.creditTermData;

        const CREDITTERMDATA = [...this.creditTermData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.creditTermsList = CREDITTERMDATA;
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=CreditTerms&fileName=creditterms.xlsx`;
        window.location.assign(url);
    }

    checkCreditTermExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.creditTermData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForCreditTermMSg = true;
        }
        else {
            this.disableSaveForCreditTermMSg = false;
        }

    }
    selectedCreditTerm(rowData):void {
        const exists = selectedValueValidate
        ('name', rowData, this.selectedRecordForEdit)

        this.disableSaveForCreditTermMSg=!exists;
    }


    refreshList() {
        this.table.reset();
        this.getCreditTermList();
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.creditTermService.deletecreditterms(this.selectedRowforDelete.creditTermsId).subscribe(() => {
                this.getCreditTermList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Credit Term Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }
    edit(rowData) {
        console.log(rowData);
        this.isEditMode = true;
        this.disableSaveForEdit = true;
        this.disableSaveForCreditTermMSg = false;
        this.addNewCreditTerm = { ...rowData, name: getObjectById('creditTermsId', rowData.creditTermsId, this.creditTermData) };
        this.selectedRecordForEdit = { ...this.addNewCreditTerm }
        console.log(this.addNewCreditTerm);
    }

    saveCreditTerms() {
        const data = {
            ...this.addNewCreditTerm, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('name', this.addNewCreditTerm.name)

        };
        if (!this.isEditMode) {
            this.creditTermService.newAddcreditterms(data).subscribe(() => {
                this.resetCreditTermsForm();
                this.getCreditTermList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Credit Term Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.creditTermService.updatecreditterms(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEditMode = false;
                this.resetCreditTermsForm();
                this.getCreditTermList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Credit Term Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }




    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    getAuditHistoryById(rowData) {       
        this.creditTermService.getCreditTermsAudit(rowData.creditTermsId).subscribe(res => {
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

    changePage(event: { first: any; rows: number }) {
        console.log(event);
       // const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
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
         this.creditTermData=newarry;
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
              this.creditTermData = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.creditTermData= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.creditTermData= newarry;
			}
        }
        this.totalRecords = this.creditTermData.length ;
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
            this.commonService.updatedeletedrecords('CreditTerms',
            'CreditTermsId',this.restorerecord.creditTermsId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getCreditTermList();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 

}
