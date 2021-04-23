import { OnInit, OnChanges, SimpleChanges, AfterViewInit, Component, ViewChild, ChangeDetectorRef, Inject, Input, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, SELECT_MULTIPLE_PANEL_PADDING_X } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { pulloutRequiredFieldsOfForm } from '../../../../validations/form.validator';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { CommonService } from '../../../../services/common.service';
declare var $ : any;

@Component({
    selector: 'app-ntae-alternate',
    templateUrl: './ntae-alternate.component.html',
    styleUrls: ['./ntae-alternate.component.scss']
})

/** item-master-stock component*/
export class NTAEAlternateComponent implements OnInit {
    updateBtn = true;
    @Input() itemMasterId;
    @Input() partData: any = {};
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    filterItemMaster: any = {
        MappingPNumber: "",
        Description: "",
        ManufacturerId: null,
        itemClassificationId: null
    };
    modalName: any = "";
    alternateData: any = {};
    pnData: any = [];
    modal: NgbModalRef;
    partsData: any = [];
    nhaTlaHistory: any = [];
    alterTableColumns: any[] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },       
    ];
    nhaTableColumns: any [] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },     
    ];
    tlaTableColumns: any [] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },     
    ];
    equivalencyTableColumns: any [] = [
        { field: "altPartNo", header: "PN" },
        { field: "altPartDescription", header: "Description" },
        { field: "manufacturer", header: "Manufacturer " },
        { field: "itemClassification", header: "Item Classification" },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },     
    ];
    ntaeData: any = [];
    filterPNData: any = [];
    filterPartDescriptionData: any = [];
    filterManufacturerData: any = [];
    loadingIndicator: boolean;
    itemclaColl: any = [];
    allManufacturerInfo: any = [];
    filterDiscriptionData: any = [];
    @Input() selectedTab: string = "";
    ntaeTableColumns: any[];
    selectedNTAETabId: any;
    itenClassificationData: any = [];
    filterPartItemClassificationData: any = [];
    formDataNtae = new FormData()
    listOfErrors: any;
    displayNtae: boolean = false;
    modelValue: boolean = false;
    @Input() isViewItemMasterNHA: boolean = false;
    @Input() isViewItemMasterTLA: boolean = false;
    @Input() isViewItemMasterAlternate: boolean = false;
    @Input() isViewItemMasterEquivalency: boolean = false;
    isViewItemMaster: boolean = false;
    @Input() itemMastId: number;
    ntaeDataTableTablePageSize: Number = 10;
    @ViewChild('closeAddPopup',{static:false}) closeAddPopup : ElementRef 
    isEditMode: boolean = false; 
    uploadedFileTemp: any = [];
    showHistory: boolean = false;
    uploadedFileTempCount: any = 0;
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    disableSave: boolean = true;
    isSpinnerVisible: boolean = false;
    delNTAERow: any = {};
    delNTAEDoc: any = {};
    viewNTAEDc: any = {};
    displayPdfView: boolean = false;
    showDeletedList: boolean = false;
    isEnableItemMasterView: boolean;

    constructor(public itemser: ItemMasterService, private _actRoute: ActivatedRoute, private alertService: AlertService,  private configurations: ConfigurationService, private modalService: NgbModal, private authService: AuthService, private commonService: CommonService){
        this.itemMasterId = this._actRoute.snapshot.params['id'];

    }
   
    ngOnInit(){
         if(this.isViewItemMasterNHA) {
            this.itemMasterId = this.itemMastId;
            this.isViewItemMaster = true;
            this.checkTheCurrentTab('NHA');  
            this.selectedTab = 'NHA';
         }
         if(this.isViewItemMasterTLA) {
            this.itemMasterId = this.itemMastId;
            this.isViewItemMaster = true;
            this.checkTheCurrentTab('TLA');            
            this.selectedTab = 'TLA';
         }
         if(this.isViewItemMasterAlternate) {
            this.itemMasterId = this.itemMastId;
            this.isViewItemMaster = true;
            this.checkTheCurrentTab('Alternate');            
            this.selectedTab = 'Alternate';
         }
         if(this.isViewItemMasterEquivalency) {
            this.itemMasterId = this.itemMastId;
            this.isViewItemMaster = true;
            this.checkTheCurrentTab('Equivalency');            
            this.selectedTab = 'Equivalency';
         }
    }

    ngOnChanges(changes: SimpleChanges) {        
        for (let property in changes) {
            if (property == 'selectedTab') {
                this.showDeletedList = false;
                this.disableSave = true;
                this.filterItemMaster = {};
                this.selectedTab = changes[property].currentValue
                this.checkTheCurrentTab(this.selectedTab);
               
                if(this.itemMasterId !== undefined){
                    if(this.itemMasterId == 0){
                        this.getalterqquparts();
                        this.itemMasterId = this._actRoute.snapshot.paramMap.get('id');
                    }
                    if(this.itemMasterId != null){
                        this.getalterqquparts();
                        this.getNtaeData(true);
                    }                    
                }  
            }
          }
      }

      get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    checkTheCurrentTab(tabName){
        if(tabName == "NHA"){
            this.ntaeTableColumns = this.nhaTableColumns
            this.selectedNTAETabId = 3             
        } else if(tabName == "TLA"){
            this.ntaeTableColumns = this.tlaTableColumns
            this.selectedNTAETabId = 4
        } else if(tabName == "Alternate"){
            this.ntaeTableColumns = this.alterTableColumns
            this.selectedNTAETabId = 1
        } else if(tabName == "Equivalency"){
            this.ntaeTableColumns = this.equivalencyTableColumns
            this.selectedNTAETabId = 2
        }
        if(this.itemMasterId !== undefined){
            this.getNtaeData(true);
        }
        
        this.filterItemMaster = {};
    }
    getalterqquparts(){
        this.partsData = [];
        this.pnData = [];
        this.itemser.getalterqquparts(this.itemMasterId,this.currentUserMasterCompanyId).subscribe(res => {
            this.partsData = res[0];
            this.pnData = this.partsData;
        })
    }    
    getNtaeData(status: boolean){
        this.isSpinnerVisible = true;
        this.filterManufacturerData = [];
        this.filterDiscriptionData = [];
        this.filterPartItemClassificationData = [];
        let reqData = {  
                first:0,
                rows:10,
                sortOrder:1,
                filters:{
                    ItemMasterId:parseInt(this.itemMasterId),
                    MappingType:this.selectedNTAETabId,
                    ManufacturerId:this.filterItemMaster.ManufacturerId || null,
                    Description:this.filterItemMaster.Description,
                    MappingItemMasterId: this.filterItemMaster.MappingItemMasterId,
                    //IsDeleted: status,
                },
                globalFilter:null
             }
             if(this.showDeletedList){
                 reqData.filters['isDeleted'] = true;
             }

             if(this.selectedNTAETabId == 2){
                this.itemser.getequivalencypartlist(reqData).subscribe(res => {

                    this.ntaeData = res;
                    
                    for(let i = 0; i<this.ntaeData.length; i++){
                        this.pnData.push({
                            label: this.ntaeData[i].altPartNo, value : this.ntaeData[i].mappingItemMasterId
                        }) 
                        this.ntaeData[i]["MappingItemMasterId"] = this.ntaeData[i].mappingItemMasterId;
                        this.ntaeData[i]["Description"] = this.ntaeData[i].partDescription

                        this.filterManufacturerData.push({
                            label: this.ntaeData[i].manufacturer, value : this.ntaeData[i].manufacturerId
                        })
                        this.filterDiscriptionData.push({
                            label: this.ntaeData[i].altPartDescription, value : this.ntaeData[i].altPartDescription
                        })
                        this.filterPartItemClassificationData.push({
                            label: this.ntaeData[i].itemClassification, value :this.ntaeData[i].itemClassificationId
                        })

                    }
                    this.isSpinnerVisible = false;
                })
               
             } else {
                this.itemser.getnhatlaaltequpartlis(reqData).subscribe(res => {

                    this.ntaeData = res;
                    for(let i = 0; i<this.ntaeData.length; i++){
                        this.pnData.push({
                            label: this.ntaeData[i].altPartNo, value : this.ntaeData[i].mappingItemMasterId
                        }) 
                        this.ntaeData[i]["MappingItemMasterId"] = this.ntaeData[i].mappingItemMasterId;
                        this.ntaeData[i]["Description"] = this.ntaeData[i].partDescription

                        this.filterManufacturerData.push({
                            label: this.ntaeData[i].manufacturer, value : this.ntaeData[i].manufacturerId
                        })
                        this.filterDiscriptionData.push({
                            label: this.ntaeData[i].altPartDescription, value : this.ntaeData[i].altPartDescription
                        })
                    }
                    this.isSpinnerVisible = false;
                })
             }
    }
    removeFile(event) {
        this.formDataNtae.delete(event.file.name)
    }
    fileUploadNtae (event) {
        const files = event.files;
        this.uploadedFileTemp = files; 
        this.uploadedFileTempCount = event.files.length;
        if (files.length > 0) {
            for (let file of event.files){
            this.formDataNtae.append(file.name, file);
            }
        }
        if (event.files.length === 0){
			return  this.disableSave = true;
		}else{
            this.disableSave = false;	
            this.updateBtn = false;
		}
      }

      enableSave() {
          if(this.selectedNTAETabId == 2) {            
            if(this.alternateData.attachmentDetails && this.alternateData.attachmentDetails.length>0){
                this.disableSave = false;
                this.updateBtn = false;
            }else if(this.isEditMode == true){
                this.disableSave = false; 
                this.updateBtn = false;
            }else{
                this.disableSave = true; 
            }
          } else {
            this.disableSave = false;
            this.updateBtn = false;
          }
      }

getAuditHistory(content, row){
    this.isSpinnerVisible = true;
    this.showHistory = true;
    this.itemser.getnhatlaaltequparthistory(row.itemMappingId).subscribe(
        results => {
            this.nhaTlaHistory = results;
            this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
            this.isSpinnerVisible = false;
        });
}
dismissModel() {
    this.modal.close();
    this.nhaTlaHistory = []
}

valuechange1(){
    this.updateBtn = false;
}

valuechange2(){
    this.updateBtn = false;
}
    bindPartDataInPopup(event){
        this.updateBtn = false;
        if(event.value) {
            this.itemser.getItemMasterDataById(event.value).subscribe(res => {
                this.alternateData.Description = res.partDescription;
                this.alternateData.manufacturer = res.manufacturerName;
                if(this.selectedNTAETabId == 2){
                    this.alternateData.itemClassificationId = res.itemClassification;
                    this.alternateData.itemClassification = res.itemClassification;
                }
            })
        } else {
            this.alternateData.Description = null;
            this.alternateData.manufacturer = null;
            this.alternateData.itemClassificationId = null;
            this.alternateData.itemClassification = null;
        }
    }

    saveAlternate(saveNtaeTabForm){
        this.listOfErrors = pulloutRequiredFieldsOfForm(saveNtaeTabForm);         
        if(this.listOfErrors.length > 0){
           
            this.displayNtae = true;
            this.modelValue = true;
             return false;

        } else {
        
       
         if(this.selectedNTAETabId == 2){
            this.formDataNtae.append('ItemMappingId', "0");
            this.formDataNtae.append('ItemMasterId', this.itemMasterId);
            this.formDataNtae.append('MappingItemMasterId', this.alternateData.MappingItemMasterId);
            this.formDataNtae.append('MappingType', this.selectedNTAETabId);
            this.formDataNtae.append('masterCompanyId', this.currentUserMasterCompanyId.toString());
            this.formDataNtae.append('CreatedBy', this.userName);
            this.formDataNtae.append('UpdatedBy', this.userName);
            this.formDataNtae.append('CreatedDate', this.userName);
            this.formDataNtae.append('UpdatedDate', this.userName);
            this.formDataNtae.append('IsActive', "true");
            this.formDataNtae.append('IsDeleted', "false");

            this.itemser.createNTAEFileUploadForEquivalency (this.formDataNtae).subscribe(datas => {
               this.alertService.showMessage(
                   'Success',
                   'Equivalency Added Successfully',
                   MessageSeverity.success
               );
               
               this.uploadedFileTempCount = 0;
               this.getNtaeData(true);
               this.getalterqquparts();
               this.closeModal()  
      
           }, err => {
               const errorLog = err;
               this.errorMessageHandler(errorLog);
              
           })
         } else {
            let reqDataJson = {  
                ItemMappingId:0,
                ItemMasterId:this.itemMasterId,
                MappingItemMasterId: this.alternateData.MappingItemMasterId,
                MappingType: this.selectedNTAETabId,
                masterCompanyId:this.currentUserMasterCompanyId,
                CreatedBy:this.userName,
                UpdatedBy:this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                IsActive:true,
                IsDeleted:false                            
             }
            this.itemser.createnhatlaaltequpart (reqDataJson).subscribe(datas => {

                if(this.selectedNTAETabId == 1)
                {
                    this.alertService.showMessage('Success', 'Alternate Information Added Successfully', MessageSeverity.success);
                }
                if(this.selectedNTAETabId == 3)
                {
                    this.alertService.showMessage('Success', 'NHA Information Added Successfully', MessageSeverity.success);
                }
                if(this.selectedNTAETabId == 4)
                {
                    this.alertService.showMessage('Success', 'TLA Information Added Successfully', MessageSeverity.success);
                }
               
               this.uploadedFileTempCount = 0;
               this.getNtaeData(true);
               this.closeModal();
               this.getalterqquparts();
           }, err => {
               const errorLog = err;
               this.errorMessageHandler(errorLog);
              
           })
         }
        }
        this.disableSave = true;
    }

    updateAlternate(saveNtaeTabForm){
        this.listOfErrors = pulloutRequiredFieldsOfForm(saveNtaeTabForm);         
        if(this.listOfErrors.length > 0){
           
            this.displayNtae = true;
            this.modelValue = true;
             return false;

        } else {
        
       
         if(this.selectedNTAETabId == 2){
            this.formDataNtae.append('ItemMappingId', this.alternateData.itemMappingId);
            this.formDataNtae.append('ItemMasterId', this.itemMasterId);
            this.formDataNtae.append('MappingItemMasterId', this.alternateData.MappingItemMasterId);
            this.formDataNtae.append('MappingType', this.selectedNTAETabId);
            this.formDataNtae.append('masterCompanyId', this.currentUserMasterCompanyId.toString());
            this.formDataNtae.append('CreatedBy', this.userName);
            this.formDataNtae.append('UpdatedBy', this.userName);
            this.formDataNtae.append('CreatedDate', this.userName);
            this.formDataNtae.append('UpdatedDate', this.userName);
            this.formDataNtae.append('IsActive', "true");
            this.formDataNtae.append('IsDeleted', "false");
            this.itemser.updateNTAEFileUploadForEquivalency (this.formDataNtae).subscribe(datas => {
               this.alertService.showMessage(
                   'Success',
                   'Information Update Successfully',
                   MessageSeverity.success
               );
               this.getNtaeData(true);
               this.getalterqquparts();
               this.closeModal()
           }, err => {
               const errorLog = err;
               this.errorMessageHandler(errorLog);
           })
         } else {
            let reqDataJson = {  
                ItemMappingId:this.alternateData.itemMappingId,
                ItemMasterId:this.itemMasterId,
                MappingItemMasterId: this.alternateData.MappingItemMasterId,
                MappingType: this.selectedNTAETabId,
                masterCompanyId:this.currentUserMasterCompanyId,
                CreatedBy:this.userName,
                UpdatedBy:this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                IsActive:true,
                IsDeleted:false                            
             }
            this.itemser.updatenhatlaaltequpart (reqDataJson).subscribe(datas => {
               this.alertService.showMessage(
                   'Success',
                   'alter Information Added Successfully',
                   MessageSeverity.success
               );
               this.getNtaeData(true);
               this.closeModal();
               this.getalterqquparts();
           }, err => {
               const errorLog = err;
               this.errorMessageHandler(errorLog);
              
           })
         }
        }
        this.disableSave = true;
    }

    editNTAETab(selectedTab, rowData){
        this.updateBtn = true;
        let pnInfo: any = {};
        this.pnData.map(x => {
            if(x.value != rowData.MappingItemMasterId) {
                pnInfo = {value: rowData.MappingItemMasterId, label: rowData.altPartNo};
            }
        })
        if(pnInfo) {
            this.pnData.push(pnInfo);
        }
        this.selectedTab = selectedTab;
        this.alternateData = rowData;
        this.isEditMode = true;
    }

    filetrDropdownValues(event, type){
        this.filterPNData = this.ntaeData;
        const oemFilterData = [...this.ntaeData.filter(x => {
            return x.partNumber.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filterPNData = oemFilterData;
        this.filterPNData = [];
        if (this.ntaeData) {
            if (this.ntaeData.length > 0) {

                for (let i = 0; i < this.ntaeData.length; i++) {
                    let partName = this.ntaeData[i].altPartNo;
                    if (partName) {
                        if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.itemclaColl.push([{
                                "partId": this.ntaeData[i].mappingItemMasterId,
                                "partName": partName
                            }]),

                                this.filterPNData.push(partName);
                                this.filterDiscriptionData.push(this.ntaeData[i].altPartDescription)
                        }
                    }
                }
            }
        }
        
    }
   
    private onpartnumberloadsuccessfull(allWorkFlows: any[]) {
        this.filterItemMaster.Description = allWorkFlows[0].partDescription;
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);       
    }

    partnmId(event) {
        if (this.itemclaColl) {
            for (let i = 0; i < this.ntaeData.length; i++) {
                if (event == this.ntaeData[i].altPartNo) {
                    this.filterItemMaster.MappingItemMasterId = this.ntaeData[i].mappingItemMasterId;
                    this.filterItemMaster.MappingPNumber = event;
                    this.filterItemMaster.ManufacturerId = this.ntaeData[i].manufacturerId;
                    if(this.selectedNTAETabId == 2){
                        this.filterItemMaster.itemClassificationId = this.ntaeData[i].itemClassificationId
                    }
                }
            }
            this.itemser.getDescriptionbypart(event).subscribe(
                results => this.onpartnumberloadsuccessfull(results[0]),
                error => this.onDataLoadFailed(error)
            );
        }
    }

    //Delete NTAE ROW deletenhatlaaltequpart
    deleteNTAERow(rowData) {
        this.delNTAERow = rowData;
    }

    Restore(rowData){
        this.delNTAERow = rowData;
        $("#ntaeRestore").modal("show");
    }
    closeRestore() {
        $("#ntaeRestore").modal("hide");
    } 

    restoreNTAERow() {
        const {itemMappingId}=this.delNTAERow;
        this.itemser.restoreNTAERow(itemMappingId, this.userName).subscribe(res => {
            this.alertService.showMessage(
                'Success',
                'Item Restore Successfully',
                MessageSeverity.success
            );
            this.getNtaeData(true)
            return false;
        }),
        error=>{
            console.log( "ERROR:" + error );
        }
    }

    deleteNTAERowRecord(){        
        this.itemser.deleteNTAERow(this.delNTAERow.itemMappingId, this.userName).subscribe(res => {
            this.alertService.showMessage(
                'Success',
                'Item Deleted Successfully',
                MessageSeverity.success
            );
            this.getNtaeData(true)
            return false;
        }),
        error=>{
            console.log( "ERROR:" + error );
        }
    }

    deleteNTAEDocument(rowData) {
        this.delNTAEDoc = rowData;
    }
    deleteNTAEDocRecord() {
        this.commonService.GetAttachmentDeleteById(this.delNTAEDoc.attachmentDetailId, this.userName).subscribe(res => {
            this.editNTAETab(this.selectedTab, this.alternateData);
        }),
        error=>{
            console.log( "ERROR:" + error );
        }
    }

    viewNTAEDoc(rowData) {
        this.viewNTAEDc = rowData;
        if(this.viewNTAEDc.fileType == 'application/pdf') {
            this.displayPdfView = true;
        } else {
            this.displayPdfView = false;
        }
    }

    closeModal(){
        this.closeAddPopup.nativeElement.click();
        this.alternateData = {}
        this.formDataNtae = new FormData();
        this.uploadedFileTempCount = 0;
        this.disableSave = true;
        if(this.fileUploadInput) {
            this.fileUploadInput.clear();
        }
        this.isEditMode = false
    }
    
    errorMessageHandler(log) {
        this.alertService.showMessage(
            'Error',
            log.error.error,
            MessageSeverity.error
        );
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.nhaTlaHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
}

