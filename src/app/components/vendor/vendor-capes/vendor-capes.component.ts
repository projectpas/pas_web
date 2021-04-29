import { Component, ViewChild, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import {  AlertService, MessageSeverity } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { Router, ActivatedRoute} from '@angular/router';
declare var $ : any;
import { editValueAssignByCondition, getObjectById } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { geaterThanZeroPattern } from '../../../validations/validation-pattern';
import { ConfigurationService } from '../../../services/configuration.service';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { formatNumberAsGlobalSettingsModule, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

@Component({
    selector: 'app-vendor-capes',
    templateUrl: './vendor-capes.component.html',
    styleUrls: ['./vendor-capes.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe],
})
/** anys component*/
export class VendorCapesComponent implements OnInit {
    activeIndex = 2;
    matSpinner: boolean;
    local: any;
    selectedOnly: boolean = false;
    targetData: any;
    vendorCapsList : any;
    originalvendorCapsList: any = [];
    downloadvendorCapsList: any = [];
    isEnableVendor: boolean = true;
    vendorIdNew: number;
    loadList: boolean = false;
    @Input() vendorId:any;   
    @Input() isViewMode: boolean = false;
    @Input() vendorCapabilityId: number = 0;
    @Output() editVendorId = new EventEmitter<any>();
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    isvendorEditMode: any;
    fieldArray: any = [];
    disableCapes: boolean = false;
    isSpinnerVisible: boolean = false;
    arraylistItemMasterId:any[] = [];
    arraylistCapabilityTypeId:any[] = [];
    itemMasterlistCollection: any[];
    itemMasterlistCollectionOriginal: any[];
    currentDeletedStatus: boolean = false;
    deleteCapesRecordRow: any;
    deleteCapesRecordRowIndex: any;
    Delete = true;
    restoreCapesRecordRow: any;
    restoreCapesRecordRowIndex: any;
    sourceViewforVendorCapesAudit: any = [];
    modal: NgbModalRef;
    vendorNameHist: any;
    nextOrPreviousTab: string;
    stopmulticlicks: boolean;
    vendorCodeandName: any;
    geaterThanZeroPattern = geaterThanZeroPattern();
    arraylistCapesId:any[] = [];
    CapesTypelistCollection: any[];
    CapesTypelistCollectionOriginal: any[];
    itemMasterId: number;
    //isEdit: boolean = false;
    addList: any = [];
    textAreaLabel: any;
    textAreaInfo: any;
    addrawNo: any;
    disableCostValidation : boolean = false;
    formData: any = new FormData();
    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    fileExtension = '.xlsx';

    newFields = {
        itemMasterId: null,        
        manufacturerId: null,
        manufacturerName: null,
        partNumber: null,
        partDescription: null,
        capabilityTypeId: null,
        capabilityTypeName: null,
        capabilityTypeDescription: null,
        vendorRanking: 0,
        isPMA: false,
        isDER: false,
        cost: '0.00',
        TAT: null,
        memo: null,
        isEditable: false,
    }
    isAdd:boolean=true;
    isEdit:boolean=true;
    isDelete:boolean=true;
    isDownload:boolean=true;
    isUpload:boolean=true;
    isVendorCapView:boolean=true;
    isNextVisible:Boolean=true;
    isPrevVisible:Boolean=true;

    constructor(public vendorService: VendorService, private datePipe: DatePipe, private configurations: ConfigurationService, private modalService: NgbModal, private commonService: CommonService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private alertService: AlertService) {
        if(window.localStorage.getItem('vendorService')){
            var obj = JSON.parse(window.localStorage.getItem('vendorService'));
            if(obj.listCollection && this.router.snapshot.params['id']){
                this.vendorService.checkVendorEditmode(true);
                this.vendorService.isEditMode = true;
                this.vendorService.listCollection = obj.listCollection;
                this.vendorService.indexObj.next(obj.activeIndex);
                this.vendorService.enableExternal = true;
                this.vendorId = this.router.snapshot.params['id'];
                this.vendorService.vendorId = this.vendorId;
                this.vendorService.listCollection.vendorId = this.vendorId;
            }
        }
        if (this.local) {
            this.vendorService.capesCollection = this.local;
        }
        if (this.vendorService.listCollection) {
            this.local = this.vendorService.listCollection;
        }
        if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
            this.local = this.vendorService.listCollection;
        }
        if (this.vendorService.listCollection) {
            this.vendorId = this.vendorService.listCollection.vendorId;
        }
        if (this.local) {
            this.vendorId = this.local.vendorId;
        }
        if (this.vendorService.listCollection) {
            this.vendorId = this.vendorService.listCollection.vendorId;
        }

        this.isAdd=this.authService.checkPermission([ModuleConstants.Vendors_Capabilities+'.'+PermissionConstants.Add])
		this.isEdit=this.authService.checkPermission([ModuleConstants.Vendors_Capabilities+'.'+PermissionConstants.Update])
        this.isDelete=this.authService.checkPermission([ModuleConstants.Vendors_Capabilities+'.'+PermissionConstants.Delete])
        this.isDownload=this.authService.checkPermission([ModuleConstants.Vendors_Capabilities+'.'+PermissionConstants.Download])
        this.isUpload=this.authService.checkPermission([ModuleConstants.Vendors_Capabilities+'.'+PermissionConstants.Upload])
        this.isVendorCapView=this.authService.checkPermission([ModuleConstants.Vendors_Capabilities+'.'+PermissionConstants.View]);
        this.isNextVisible=this.authService.ShowTab('Create Vendor','Contacts');
        
    }

    ngOnInit() {
        if(!this.isViewMode)
        {
            this.vendorId = this.router.snapshot.params['id'];
            this.vendorService.vendorId = this.vendorId;
            this.vendorService.listCollection.vendorId = this.vendorId
        }
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        this.matSpinner = true;
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-capes';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);        
        //this.getCapesTypesSmartDropDown();
        this.getVendorCodeandNameByVendorId();
        if(this.isVendorCapView){
        this.getVendorCapabilitylistId('all');
        }

        this.disableCapes = true;
    }

    onAddTextAreaInfo(value,row_no, obj) {
		if(value == 'memo') {
			this.textAreaLabel = 'Memo';
            this.textAreaInfo = obj.memo;
            this.addrawNo = row_no;
		}
    }
    closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
    }
   
    onSaveTextAreaInfo() {
		if(this.textAreaLabel == 'Memo') {
            this.fieldArray[this.addrawNo].memo = this.textAreaInfo;
        }
        $('#capes-memo').modal('hide');
    }

    closeMemoModel()
    {
        $('#capes-memo').modal('hide');
    }

    saveMemo(){
            $('#addNewMemo').modal('hide');
    }

    getVendorCodeandNameByVendorId()
    {
        if(this.vendorId > 0)
        {
            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                res => {
                        this.vendorCodeandName = res[0];
                },err => {
                    const errorLog = err;
                    //this.saveFailedHelper(errorLog);
                    this.isSpinnerVisible = false;
            });
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

    private getVendorCapabilitylistId(status, val?) {        
        if (this.vendorId > 0 ) {
            this.isSpinnerVisible = true;
            this.vendorService.getVendorCapabilityList(status, this.vendorId).subscribe(
                results => {                  
                    this.originalvendorCapsList = results[0].map(x => {
                        return {
                            vendorId: x.vendorId,
                            vendorCapabilityId: x.vendorCapabilityId,
                            vendorCode: x.vendorCode,
                            vendorName: x.vendorName,
                            itemMasterId: x.itemMasterId,
                            partNumber: { partNumber: x.partNumber, itemMasterId: x.itemMasterId },
                            partDescription: x.partDescription,
                            manufacturerId: x.manufacturerId,
                            manufacturerName: x.manufacturerName,
                            capabilityTypeId : x.capabilityTypeId,
                            capabilityTypeName: x.capabilityType,
                            capabilityTypeDescription: x.capabilityTypeDescription,
                            vendorRanking: x.vendorRanking,
                            memo: x.memo,
                            isPMA: x.isPMA,
                            isDER: x.isDER,
                            cost: x.cost ? formatNumberAsGlobalSettingsModule(x.cost, 2) : '0.00',
                            TAT: x.tat,
                            isDeleted: x.isDeleted, 
                            isActive: x.isActive,                          
                            isEditable : false,
                            isNewItem: false
                        }
                    })

                    this.fieldArray = [];
                    this.originalvendorCapsList.map(x => {
                        if(!x.isDeleted) {
                            this.fieldArray.push(x);
                        }
                    })

                    if(val == 'restore') {
                        this.fieldArray = [];
                        this.originalvendorCapsList.map(x => {
                            if(x.isDeleted) {
                                this.fieldArray.push(x);
                            }
                        })
                    }

                    this.arraylistItemMasterId = [];
                    this.originalvendorCapsList.map(x => {
                        this.arraylistItemMasterId.push(x.itemMasterId);
                    })

                    this.arraylistCapabilityTypeId = [];
                    this.originalvendorCapsList.map(x => {
                        this.arraylistCapabilityTypeId.push(x.capabilityTypeId);
                    })

                    this.getCapesTypesSmartDropDown()
                    this.getItemMasterSmartDropDown();

                    // if(!this.isViewMode)
                    // {
                    //     this.getCapesTypesSmartDropDown()
                    //     this.getItemMasterSmartDropDown();                 
                    // }

                    this.vendorCapsList =  results[0];
                    this.isSpinnerVisible = false;
                },
                error => this.isSpinnerVisible = false //this.saveFailedHelper(error)
            );
        }
    }

    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
    getItemMasterSmartDropDown(strText = ''){
		if(this.arraylistItemMasterId.length == 0) {
			this.arraylistItemMasterId.push(0); }
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber',strText,true,20,this.arraylistItemMasterId.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.itemMasterlistCollectionOriginal = response.map(x => {
                return {
                    partNumber: x.label, itemMasterId: x.value
                }
            })
            this.itemMasterlistCollection = [...this.itemMasterlistCollectionOriginal];
		},err => {
            const errorLog = err;
            this.isSpinnerVisible = false;
			//this.saveFailedHelper(errorLog);
		});
    }

    filterPartNumber(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getItemMasterSmartDropDown(event.query); }
    }

    private getCapesTypesSmartDropDown() {   
        if(this.arraylistCapabilityTypeId.length == 0) {
			this.arraylistCapabilityTypeId.push(0); }
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('CapabilityType', 'CapabilityTypeId', 'Description', '', true, 200, this.arraylistCapabilityTypeId.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.CapesTypelistCollection = res;
            this.isSpinnerVisible = false;
        },err => {
            const errorLog = err;
            this.isSpinnerVisible = false;
			//this.saveFailedHelper(errorLog);
		});
    }

    getVendorCapabilityId(id) {
        this.vendorCapabilityId = id;
        if (this.vendorCapabilityId) {
            $('#addCapabilityInfo').modal('show');
        }
        this.loadList = false;
    }

    loadListData() {
        this.loadList = !this.loadList;
        this.vendorCapabilityId = 0;
    }

    onAddCapsInfo() {
        this.loadList = !this.loadList;
        this.vendorCapabilityId = null;
    }

    getVendorName() {
        if (this.local !== undefined) {
            return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
        } else {
            return '';
        }
    }

    addFieldValue(): void {        
        this.isSpinnerVisible = true;
        this.newFields.itemMasterId = this.vendorCapsList.itemMasterId;
        this.newFields.manufacturerId = null; 
        this.newFields.manufacturerName = null;
        this.newFields.partNumber = null;
        this.newFields.partDescription = null;
        this.newFields.capabilityTypeId = this.vendorCapsList.capabilityTypeId;
        this.newFields.capabilityTypeName = null;
        this.newFields.capabilityTypeDescription = null;
        this.newFields.vendorRanking = 0;
        this.newFields.isPMA = false;
        this.newFields.isDER = false;
        this.newFields.cost = '0.00';                 
        this.newFields.TAT = null;
        this.newFields.memo = null;
        this.disableCapes = false;
        this.newFields.isEditable = true,        
        this.fieldArray = [...this.fieldArray, { ...this.newFields }]
        this.isSpinnerVisible = false;
    }

    onChangeCapabilityTypeId(field)
    {
        var ObjCapabilityType = getObjectById('value', field.capabilityTypeId, this.CapesTypelistCollection);        
        if(ObjCapabilityType != undefined && ObjCapabilityType !=  null)
            field.capabilityTypeDescription = ObjCapabilityType.label;
    }

    onChangeCostAmt(field)
    {
        if(field.cost > 0)
        {
            this.disableCostValidation = false;
        }
        else
        {
            this.disableCostValidation = true;
        }
    }

    getPNDetailsById(event, field) {
		this.itemMasterId = editValueAssignByCondition('itemMasterId', event);

		this.vendorService.getPartDetailsWithidForSinglePart(this.itemMasterId).subscribe(
			data => {
				if (data[0]) {
					field.partDescription = data[0].partDescription;
					field.manufacturerId = data[0].manufacturerId;
                    field.manufacturerName = data[0].name;
				}
			}, error => this.isSpinnerVisible = false) //this.saveFailedHelper(error))
    }

    saveVendorCapes(){
        // var errmessage = '';

        // for (let i = 0; i < this.fieldArray.length; i++) {
        //     this.alertService.resetStickyMessage();	
        //     if(this.fieldArray[i].TAT == 0 || this.fieldArray[i].TAT == null) {	
		// 		this.isSpinnerVisible = false;	
		// 		errmessage = errmessage + "TAT values must be greater than zero."
        //     }
        //     if(this.fieldArray[i].cost == 0 || this.fieldArray[i].cost == null) {	
        //         this.isSpinnerVisible = false;	
        //         if(errmessage != '') {
        //             errmessage = errmessage + '<br />' + "Cost values must be greater than zero."
        //         }
        //         else
        //         {
        //             errmessage = errmessage + "Cost values must be greater than zero."
        //         }				
        //     }
        //     if(errmessage != '') {
		// 		this.alertService.showStickyMessage("Validation failed", errmessage, MessageSeverity.error, errmessage);
		// 		return;
		//     }
        // }

        const data = this.fieldArray.map(obj => {
            obj.isPMA = obj.isPMA;
            obj.isDER = obj.isDER;           
            obj.cost =  obj.cost ? formatNumberAsGlobalSettingsModule(obj.cost, 2) : '0.00';
            obj.TAT = obj.TAT ? parseFloat(obj.TAT) : 0; 
            obj.vendorRanking = obj.vendorRanking ? parseInt(obj.vendorRanking) : 0;
            obj.itemMasterId = obj.partNumber.itemMasterId;
            obj.partNumber = obj.partNumber.partNumber;
            obj.partDescription = obj.partDescription;
            obj.manufacturerName = obj.manufacturerName;
            obj.manufacturerId = obj.manufacturerId;            
            obj.capabilityTypeId = obj.capabilityTypeId;
            obj.capabilityTypeName = obj.capabilityTypeName == null ? obj.capabilityTypeDescription : obj.capabilityTypeName;
            obj.capabilityTypeDescription = obj.capabilityTypeDescription;
            obj.memo = obj.memo;

            return {
                ...obj,
                vendorId: this.vendorId,
                MasterCompanyId: this.currentUserMasterCompanyId,
                CreatedBy: this.userName,
                UpdatedBy: this.userName,
                CreatedDate: new Date(),
                UpdatedDate: new Date(),
                IsActive: true,
                IsDeleted: false
            }
        })
        this.isSpinnerVisible = true;
        this.vendorService.saveVendorCapes(this.vendorId, data).subscribe(res => {
            if(res) {
                if (res.statusCode != 500) {
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage(
						'Success',
						`Saved Capability Info Successfully`,
						MessageSeverity.success
                    );
                    this.disableCapes = true;                    
                    this.getVendorCapabilitylistId('all'); 
                }
			 else {
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage(
                        'Error',
                        res.message,
                        MessageSeverity.error
                    );
                }  
                this.disableCapes = true;               
                this.getVendorCapabilitylistId('all');                  
             }
             else{
                this.isSpinnerVisible = false;
             }
        }, error => {
           // this.saveFailedHelper(error);  
            this.isSpinnerVisible = false;      
            this.getVendorCapabilitylistId('all');    
        })
    }

    editCapes(index)
    {
        this.disableCapes = false;
        if(this.fieldArray[index].isEditable == false){
            this.fieldArray[index].isEditable = true;          
        }
         else {
            this.fieldArray[index].isEditable = false;
         }
    }

    getCapesListByDeleteStatus(value)
    {
        if(value){
            this.getVendorCapabilitylistId('all', 'restore');
            this.currentDeletedStatus=true;
        }else{
            this.getVendorCapabilitylistId('all');
            this.currentDeletedStatus=false;
        }
    }

    deleteCapesRow(index, field)
    {
        this.deleteCapesRecordRow = {
            ...field,
        };
        this.deleteCapesRecordRowIndex = index;
    }

    deleteCapesRowRecord(value)
    {
        if(value == 'Yes') {
            const i = this.deleteCapesRecordRowIndex
        if(this.fieldArray[i].vendorCapabilityId) {
            if (this.fieldArray.length > 0) {
            
                this.fieldArray[i].isDeleted = true;
            }
            else {
                this.Delete = false;
            }
            this.isSpinnerVisible = true;
            this.vendorService.deleteVendorCapesRecord(this.deleteCapesRecordRow.vendorCapabilityId, this.userName).subscribe(res => {
                    this.fieldArray.splice(i, 1);
                    this.alertService.showMessage(
                        'Success',
                        `Capes Item Deleted Successfully `,
                        MessageSeverity.success
                    );
                    this.isSpinnerVisible = false;
            },error => this.isSpinnerVisible = false)//this.saveFailedHelper(error))
           
        } else {
            if (this.fieldArray.length > 0) {
                        this.fieldArray.splice(i, 1);
                        this.alertService.showMessage(
                            'Success',
                            `Capes Item Deleted Successfully `,
                            MessageSeverity.success
                        );
                    }
                    else {
                        this.Delete = false;
                    }
        }
        } else {
            this.deleteCapesRecordRow = undefined;
            this.deleteCapesRecordRowIndex = undefined;
        }
    }

    restoreCapesRow(index, field)
    {
        this.restoreCapesRecordRow = {
            ...field,
        };
        this.restoreCapesRecordRowIndex = index;
    }

    restoreCapesRowRecord(value)
    {
        if(value == 'Yes') {
            const i = this.restoreCapesRecordRowIndex
            this.isSpinnerVisible = true;
            this.vendorService.restoreVendorCapesRecord(this.restoreCapesRecordRow.vendorCapabilityId, this.userName).subscribe(res => {
                this.fieldArray.splice(i, 1);
                this.alertService.showMessage(
                    'Success',
                    `Item Restored Successfully `,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
                this.fieldArray[i].isEditable = false;
                
            },error => this.isSpinnerVisible = false) //this.saveFailedHelper(error))        
        } else {
            this.restoreCapesRecordRow = undefined;
        }
    }

    openHistoryOfCapes(content, rowData)
    {
        this.isSpinnerVisible = true;
        this.vendorNameHist = rowData.vendorName;
        this.vendorService.getVendorCapabilityAuditHistory(rowData.vendorCapabilityId, rowData.vendorId).subscribe(
            results => this.onHistoryOfVendorCapesSuccess(results, content),
            error => this.isSpinnerVisible = false)//this.saveFailedHelper(error));
    }

    private onHistoryOfVendorCapesSuccess(auditHistory, content) {
        this.isSpinnerVisible = false;
        this.sourceViewforVendorCapesAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    getColorCodeForHistoryForPandS(i, field, value) {
        const data = this.sourceViewforVendorCapesAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    dismissModel()
    {
        if(this.modal){
            this.modal.close();
        }     
    }

    previousOrNextTab(previousOrNext){
        this.nextOrPreviousTab = previousOrNext;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    redirectToTab(){
        this.dismissModel();

        if(!this.disableCapes)
        {
            this.saveVendorCapes();
        }    
		setTimeout(() => {
			this.stopmulticlicks = false;
		}, 500)
         
		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 1;
            this.vendorService.changeofTab(this.activeIndex);
            
        } else {
            this.activeIndex = 3;
            this.editVendorId.emit(this.vendorId);
            this.vendorService.changeofTab(this.activeIndex);
        }
    }

    redirectToTabWithoutSave(){
        this.dismissModel();

		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 1;
            this.vendorService.changeofTab(this.activeIndex);
            
        } else {
            this.activeIndex = 3;
            this.editVendorId.emit(this.vendorId);
            this.vendorService.changeofTab(this.activeIndex);
        }
    }

    vendorCapasNotExistList : any = [];
    customExcelUpload(event,tabRedirectConfirmationModal) {
        this.vendorCapasNotExistList = [];
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.formData.append('masterCompanyId', this.authService.currentUser.masterCompanyId.toString())
            this.formData.append('createdBy', this.userName);
            this.formData.append('updatedBy', this.userName);
            this.formData.append('isActive', 'true');
            this.formData.append('isDeleted', 'false');
            const data={'masterCompanyId': this.authService.currentUser.masterCompanyId,
                        'createdBy':this.userName,
                        'updatedBy':this.userName,
                        'isActive':true,
                        'isDeleted':false
            }
            this.vendorService.uploadVendorCapabilitiesList(this.formData, this.vendorId, data).subscribe(res => {                
                if(res){
                    this.vendorCapasNotExistList = res;                   
                    if(this.vendorCapasNotExistList.length > 0){
                        this.modal = this.modalService.open(tabRedirectConfirmationModal, { size: 'lg', backdrop: 'static', keyboard: false }); 
                    } 
                    else{
                        this.alertService.showMessage(
                            'Success',
                            `Capability List Uploaded Successfully  `,
                            MessageSeverity.success
                        );
                    }
                }
                event.target.value = '';
                this.formData = new FormData();
                this.getVendorCapabilitylistId('all');                
            })
        }
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=VendorCapability&fileName=VendorCapability.xlsx`;

        window.location.assign(url);
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
		this.alertService.showStickyMessage("Save Error", "The below errors occured while saving your changes:", MessageSeverity.error, error.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,''));
		this.alertService.showStickyMessage(null, error.replace(/(<|&lt;)br\s*\/*(>|&gt;)/g,''), MessageSeverity.error);
    }

    exportCSV() {
        this.downloadvendorCapsList = this.vendorCapsList.map(x => {
            return {
                Vendor_Code: x.vendorCode,
                Vendor_Name: x.vendorName,
                Part_Number: x.partNumber,
                Part_Description: x.partDescription,
                Manufacturer_Name: x.manufacturerName,
                Capability_Type: x.capabilityType,
                Capability_Type_Description: x.capabilityTypeDescription,
                vendor_Ranking: x.vendorRanking,
                //Memo: x.memo.replace(/<[^>]*>/g, ''),
                // IsPMA: x.isPMA,
                // IsDER: x.isDER,
                Price: x.cost,
                TAT_Days: x.tat,
                CreatedDate : x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                CreatedBy : x.createdBy,
                UpdatedDate : x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
                UpdatedBy : x.updatedBy,
                IsDeleted: x.isDeleted, 
                IsActive: x.isActive                       
            }
        })

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.downloadvendorCapsList);
        const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, 'Test');
       
    }

    private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {type: this.fileType});
        FileSaver.saveAs(data, fileName + this.fileExtension);
      }

      enableSave() {}

      onChangeItemMasterId(field) {}

      onChangeCost(field){
            field.cost = field.cost ? formatNumberAsGlobalSettingsModule(field.cost, 2) : '0.00';
      }
}
