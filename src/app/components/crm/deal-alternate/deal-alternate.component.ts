import { OnInit, OnChanges, SimpleChanges, AfterViewInit, Component, ViewChild, ChangeDetectorRef, Inject, Input, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog, SELECT_MULTIPLE_PANEL_PADDING_X } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { pulloutRequiredFieldsOfForm } from '../../../validations/form.validator';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
declare var $ : any;

@Component({
    selector: 'app-deal-alternate',
    templateUrl: './deal-alternate.component.html',
    styleUrls: ['./deal-alternate.component.scss']
})

/** item-master-stock component*/
export class DealAlternateComponent implements OnInit {
    @Input() itemMasterId;
    @Input() partData: any = {};
    @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
    // itemMasterData: any = {};
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
        { field: "name", header: "Name" },
        { field: "subject", header: "Subject" },
        { field: "entryDate", header: "Entry Date" },
        { field: "followUpDate", header: "Follow Up Date" }
    ];
    nhaTableColumns: any [] = [
        { field: "name", header: "Name" },
        { field: "activityType", header: "Activity Type" },
        { field: "subject", header: "Subject" },
        { field: "entryDate", header: "Entry Date" },
        { field: "followUpDate", header: "Follow Up Date" }
    ];
    tlaTableColumns: any [] = [
        { field: "name", header: "Name" },
        { field: "subject", header: "Subject" },
        { field: "entryDate", header: "Entry Date" },
        { field: "followUpDate", header: "Follow Up Date" }
    ];
  
    aircraftTableColumns: any[] = [
        { field: "ataChapter", header: "ATA Chapter" },
        { field: "ataSubChapter", header: "ATA Sub-Chapter" },
       
    ];
    // nhaTableColumns: any [] = [
    //     { field: "name", header: "Name" },
    //     { field: "activityType", header: "Activity Type" },
    //     { field: "subject", header: "Subject" },
    //     { field: "entryDate", header: "Entry Date" },
    //     { field: "followUpDate", header: "Follow Up Date" }
    // ];
    ataTableColumns: any [] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumbers", header: "Dash Numbers" },
		{ field: "inventory", header: "Inventory" },
		{ field: "memo", header: "Memo" }
    ];

    ntaeData: any = [];
    filterPNData: any = [];
    filterPartDescriptionData: any = [];
    filterManufacturerData: any = [];
    loadingIndicator: boolean;
    // allpnNumbers: any = [];
    itemclaColl: any = [];
    allManufacturerInfo: any = [];
    filterDiscriptionData: any = [];
    // selectedTab: any = "";
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

    constructor(public itemser: ItemMasterService, private _actRoute: ActivatedRoute, private alertService: AlertService,  private configurations: ConfigurationService, private modalService: NgbModal, private authService: AuthService){
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
                this.disableSave = true;
                this.filterItemMaster = {};
                this.selectedTab = changes[property].currentValue
                this.checkTheCurrentTab(this.selectedTab);
               
                if(this.itemMasterId !== undefined){
                    if(this.itemMasterId == 0){
                        this.getalterqquparts();

                        
                        
                        this.itemMasterId = this._actRoute.snapshot.paramMap.get('id');
                    }
                    // this.getItemMasterDetailById();
                    if(this.itemMasterId != null){
                        this.getalterqquparts();
                        this.getNtaeData(true);
                    }                    
                    // this.ptnumberlistdata();
                    // this.manufacturerdata();
        
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
        if(tabName == "Activities"){
            this.ntaeTableColumns = this.nhaTableColumns
            this.selectedNTAETabId = 3             
        } else if(tabName == "Notes"){
            this.ntaeTableColumns = this.tlaTableColumns
            this.selectedNTAETabId = 4
        } else if(tabName == "Follow Ups"){
            this.ntaeTableColumns = this.alterTableColumns
            this.selectedNTAETabId = 1
        }
        else if(tabName == "General Information"){
           
            this.selectedNTAETabId = 5
        }
        else if(tabName == "Aircraft Information"){
            this.ntaeTableColumns = this.aircraftTableColumns
            this.selectedNTAETabId = 6
        }
        else if(tabName == "ATA Chapters"){
            this.ntaeTableColumns = this.ataTableColumns
            this.selectedNTAETabId = 7
        }
        if(this.itemMasterId !== undefined){
            this.getNtaeData(true);
        }
        
        this.filterItemMaster = {};
    }

    // getItemMasterDetailById(){        
    //     this.itemser.getItemMasterDetailById(this.itemMasterId).subscribe(res => {
    //         this.itemMasterData = res[0];
    //     })
    // }
    getalterqquparts(){
        this.partsData = [];
        this.pnData = [];
        this.itemser.getalterqquparts(this.itemMasterId).subscribe(res => {
            this.partsData = res[0];
            this.pnData = this.partsData;
            // for(let i=0; i<this.partsData.length; i++){
            //     this.pnData.push({
            //         label: this.partsData[i].partNumber, value : this.partsData[i].itemMasterId
            //     }) 
            // }                     
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
                    MappingItemMasterId: this.filterItemMaster.MappingItemMasterId
                },
                globalFilter:null
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

                        // if(this.ntaeData[i].attachmentDetails){
                        //     this.ntaeData[i]["fileName"]= this.ntaeData[i].attachmentDetails.ad.fileName
                        // }
                       
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
		}
      }

      enableSave() {
          if(this.selectedNTAETabId == 2) {
            if(this.alternateData.attachmentDetails && this.alternateData.attachmentDetails.length>0){
                this.disableSave = false;
            }else if(this.isEditMode == true){
                this.disableSave = false; 
            }else{
                this.disableSave = true; 
            }
          } else {
            this.disableSave = false;
          }
      }

getAuditHistory(content, row){
    this.showHistory = true;
    this.itemser.getnhatlaaltequparthistory(row.itemMappingId).subscribe(
        results => {
            this.nhaTlaHistory = results;
            this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
                }, () => { console.log('Backdrop click') })
        });
}
dismissModel() {
    this.modal.close();
    this.nhaTlaHistory = []
}
    bindPartDataInPopup(event){
        console.log(event.value);
        if(event.value) {
            this.itemser.getItemMasterDataById(event.value).subscribe(res => {
                this.alternateData.Description = res.partDescription;
                this.alternateData.manufacturer = res.manufacturerName;
                if(this.selectedNTAETabId == 2){
                    this.alternateData.itemClassificationId = res.itemClassification;
                }
            })
        } else {
            this.alternateData.Description = null;
            this.alternateData.manufacturer = null;
            this.alternateData.itemClassificationId = null;
        }
        
        
        // for(let i=0; i<this.partsData.length; i++){
        //     if(this.partsData[i].itemMasterId == this.alternateData.MappingItemMasterId){
        //         this.alternateData.Description = this.partsData[i].partDescription;
        //         this.alternateData.manufacturer = this.partsData[i].manufacturer;
        //         if(this.selectedNTAETabId == 2){
        //             this.alternateData.itemClassificationId = this.partsData[i].itemClassification
        //         }
        //     }
        // }
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
                   'Alter Information Added Successfully',
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
               this.alertService.showMessage(
                   'Success',
                   'Alter Information Added Successfully',
                   MessageSeverity.success
               );
               this.uploadedFileTempCount = 0;
               this.getNtaeData(true);
               this.closeModal();
               this.getalterqquparts();
   
               // this.getAircraftMappedDataByItemMasterId();
   
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
                   'Alter Information Added Successfully',
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

    // private ptnumberlistdata() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;

    //     this.itemser.getPrtnumberslistList().subscribe(
    //         results => this.onptnmbersSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // private onptnmbersSuccessful(allWorkFlows: any[]) {

    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.allpnNumbers = allWorkFlows;        
    // }

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

    //loading manufacturer data from Singlescreen//
    // private manufacturerdata() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;

    //     this.itemser.getManufacturerList().subscribe(
    //         results => this.onmanufacturerSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }
    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);       
    }

    // private onmanufacturerSuccessful(allWorkFlows: any[]) {

    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.allManufacturerInfo = allWorkFlows;
    // }
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
    deleteNTAERowRecord(){        
        this.itemser.deleteNTAERow(this.delNTAERow.itemMappingId, this.userName).subscribe(res => {
            this.getNtaeData(true)
            return false;
        }),
        error=>{
            console.log( "ERROR:" + error );
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
    
    // enableSave() {
	// 	this.disableSave = false;

	// }
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

