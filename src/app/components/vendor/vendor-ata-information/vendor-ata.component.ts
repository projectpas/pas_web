import { Component, OnInit,  Input } from '@angular/core';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { AtaMainService } from '../../../services/atamain.service';
import { editValueAssignByCondition } from '../../../generic/autocomplete';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VendorService } from '../../../services/vendor.service';
import { CommonService } from '../../../services/common.service';
declare var $ : any;
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
// import { DTCheckbox } from 'primeng/datatable';
@Component({
    selector: 'app-vendor-ata',
    templateUrl: './vendor-ata.component.html',
    styleUrls: ['./vendor-ata.component.scss'],
    providers: [DatePipe]
})
export class VendorATAInformationComponent implements OnInit {
    @Input() isViewMode: boolean = false;
    @Input() vendorId: number;
    ataChapter: any;
    currentstatus: string = 'Active';
    selectedOnly: boolean = false;
    targetData: any;
    atasubchapterValues: any;
    ataChapterList: { value: any; label: string; }[];
    search_SelectedATA = [];
    search_ataChapterList: any = [];
    search_SelectedContact = []
    search_SelectedATASubChapter = []
    isSpinnerVisible: boolean = false;
    ataHeaders = [
        { field: 'firstName', header: 'Contact' },
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }
    ]
    showAdvancedSearchCard: boolean = false;
    selectedColumns = this.ataHeaders;
    ataChapterIdUrl: string;
    contactIdUrl: string;
    ataSubchapterIdUrl: any;
    search_ataSubChapterList: any;
    id: number;
    contactid: number;
    searchATAParams: string;
    customerName: any;
    customerCode: any;
    modal: NgbModalRef;
    isDeleteMode: boolean = false;
    public sourceCustomer: any = {}
    customerContactATAMappingId: number;
    selectedRowForDelete: any;
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number = 0;
    //originalATASubchapterData: any = [];
    stopmulticlicks: boolean;
    ataListDataValues: any = [];
    contactList: any;
    contactATAId: any;
    local: any;
    activeIndex: any = 4;
    isvendorEditMode: any;
    currentDeletedstatus:boolean=false;
    vendorData: any = {};
    auditHistoryATA:any=[];
    vendorCodeandName: any;
    isDownload:boolean=true;
    constructor(
        private atasubchapter1service: AtaSubChapter1Service,
        private atamain: AtaMainService,
        private authService: AuthService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        public vendorService: VendorService,
        private commonService: CommonService,
        private router: ActivatedRoute,
        private datePipe: DatePipe
    ) {
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
                this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                    res => {
                            this.local = res[0];
                            this.vendorCodeandName = res[0];
                    },err => {
                        this.isSpinnerVisible = false
                        //const errorLog = err;
                        //this.saveFailedHelper(errorLog);
                    });
            }
        }
        else{
            this.getVendorCodeandNameByVendorId();
        }
        this.stopmulticlicks = false;
        this.isDownload=this.authService.checkPermission([ModuleConstants.Vendors_ATAChapter+"."+PermissionConstants.Download])
    }

    ngOnInit() {
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        this.local = this.vendorService.listCollection;
        if(!this.vendorId){
            this.vendorId = this.local.vendorId;
        }
        this.vendorId = this.vendorId ? this.vendorId :this.router.snapshot.params['id'];
       
        this.getMappedATAByVendorId();
        if(this.isViewMode)
        {
            this.getVendorCodeandNameByVendorId();
        }
        else{
            this.getAllATAChapter();
            this.getAllATASubChapter();
            this.getContactsByVendorId();
        }
    }
    
    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    getVendorCodeandNameByVendorId()
    {
        if(this.vendorId > 0)
        {
            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                res => {
                        this.vendorCodeandName = res[0];
                },err => {
                    this.isSpinnerVisible = false
                    //const errorLog = err;
                    //this.saveFailedHelper(errorLog);
            });
        }        
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
    }
    // exportCSV(dt) {
    //     this.isSpinnerVisible = true;
    //     let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"status":this.currentstatus,"isDeleted":this.currentDeletedstatus},"globalFilter":""}
    //     let filters = Object.keys(dt.filters);
    //     filters.forEach(x=>{
	// 		PagingData.filters[x] = dt.filters[x].value;
    //     })
    
    //     this.vendorService.getATASubchapterData(this.vendorId).subscribe(res => {
    //         dt._value = res[0]['results'].map(x => {
	// 			return {
    //             ...x,
    //             createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
    //             updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
    //             }
    //         });
    //         dt.exportCSV();
    //         dt.value = this.ataChapterList;
    //         this.isSpinnerVisible = false;
    //     },error => {
    //             this.saveFailedHelper(error)
    //         },
    //     );
    //   }

    exportCSV(dt){
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
            }
        });
        dt.exportCSV();
    }

    // get all subchapters
    getAllATASubChapter() {
        this.isSpinnerVisible = true;
        this.atasubchapter1service.getAtaSubChapter1List(this.currentUserMasterCompanyId).subscribe(res => {
            const ataSubChapter = res[0].map(x => {
                return {
                    label: `${x.ataSubChapterCode}-${x.description}`,
                    value: x.ataSubChapterId
                }
            })
            // making copy for the subchapters in both add and seach 
            this.search_ataSubChapterList = ataSubChapter;
            this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible = false;}) //this.onDataLoadFailed(error))
    }

    getAllATAChapter() {
        this.isSpinnerVisible = true;
        this.atamain.getAtaMainList(this.currentUserMasterCompanyId).subscribe(res => {
            const responseData = res[0];
            this.search_ataChapterList = responseData.map(x => {
                return {
                    value: x.ataChapterId,
                    label: x.ataChapterCode + '-' + x.ataChapterName
                }
            })
            this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible = false;}) //this.onDataLoadFailed(error))
    }

    // get sub chapter by multiple ids in the search
    getSubChapterByATAChapter() {
        this.searchByFieldUrlCreateforATA();
        if (this.ataChapterIdUrl !== '') {
            this.isSpinnerVisible = true;
            this.atamain.getMultiATASubDesc(this.ataChapterIdUrl).subscribe(atasubchapter => {
                    const responseData = atasubchapter;
                    this.search_ataSubChapterList = responseData.map(x => {
                        return {
                            label: `${x.ataSubChapterCode}-${x.description}`,
                            value: x.ataSubChapterId
                        };
                    });
                    this.isSpinnerVisible = false;
                });

        } else {
            this.getAllATASubChapter();
        }
    }

    getMappedATAByVendorId() {
        this.isSpinnerVisible = true;
        this.vendorService.getATAMappedByVendorId(this.vendorId, this.currentDeletedstatus).subscribe(res => {
            this.ataListDataValues = res;
            if (res.length > 0) {
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    getATADeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getMappedATAByVendorId();
    } 

    // search URL generation 
    searchByFieldUrlCreateforATA() {
        if (this.search_SelectedContact.length > 0) {
            const contactIds = this.search_SelectedContact.reduce((acc, value) => {
                return `${acc},${value.value}`;
            }, '');
            this.contactIdUrl = contactIds.substr(1);
        } else {
            this.contactIdUrl = '';
        }
        if (this.search_SelectedATA.length > 0) {
            const ataIds = this.search_SelectedATA.reduce((acc, value) => {
                return `${acc},${value}`;
            }, '');
            this.ataChapterIdUrl = ataIds.substr(1);
        } else {
            this.ataChapterIdUrl = '';
        }
        if (this.search_SelectedATASubChapter && this.search_SelectedATASubChapter.length > 0) {
            const ataSubchapterIds = this.search_SelectedATASubChapter.reduce((acc, value) => {
                return `${acc},${value}`;
            }, '');
            this.ataSubchapterIdUrl = ataSubchapterIds.substr(1);
        } else {
            this.ataSubchapterIdUrl = '';
        }
    }

    getContactsByVendorId() {
        this.isSpinnerVisible = true;
        this.vendorService.getContactsByVendorId(this.vendorId).subscribe(res => {
            this.contactList = res.map(x => {
                return {
                    label: x.firstName,
                    value: x.contactId
                }
            })
            this.isSpinnerVisible = false;
        },error => this.isSpinnerVisible = false) //this.onDataLoadFailed(error))
        
    }

    async searchATA() {        
        await this.searchByFieldUrlCreateforATA();
        this.searchATAParams = '';
        // checks where multi select is empty or not and calls the service
        if (this.ataChapterIdUrl !== '' && this.ataSubchapterIdUrl !== '' && this.contactIdUrl !== '') {

            this.searchATAParams = `contactId=${this.contactIdUrl}&ataChapterId=${
                this.ataChapterIdUrl
                }&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }
        else if (this.ataChapterIdUrl !== '' && this.contactIdUrl !== '') {

            this.searchATAParams = `contactId=${this.contactIdUrl}&ataChapterId=${this.ataChapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '' && this.contactIdUrl !== '') {
            this.searchATAParams = `contactId=${this.contactIdUrl}&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '' && this.ataChapterIdUrl !== '') {
            this.searchATAParams = `ataChapterId=${this.ataChapterIdUrl}&ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }

        else if (this.ataChapterIdUrl !== '') {

            this.searchATAParams = `ataChapterId=${this.ataChapterIdUrl}`;
        }
        else if (this.ataSubchapterIdUrl !== '') {
            this.searchATAParams = `ataSubChapterId=${this.ataSubchapterIdUrl}`;
        }

        else if (this.contactIdUrl !== '') {
            this.searchATAParams = `contactId=${this.contactIdUrl}`;
        }
        this.isSpinnerVisible = true;
        this.vendorService
            .searchATAMappedByMultiATAIDATASUBIDByVendorId(this.vendorId,this.searchATAParams)
            .subscribe(res => {
                this.ataListDataValues = res;
                if (res.length > 0) {
                    this.totalRecords = res.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }

                this.contactIdUrl = '';
                this.ataSubchapterIdUrl = '';
                this.ataChapterIdUrl = '';
                this.isSpinnerVisible = false;
            },error => {this.isSpinnerVisible = false;})  //this.onDataLoadFailed(error));
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    nextClick() {
        this.activeIndex = 5;
        this.vendorService.changeofTab(this.activeIndex);
    }

    backClick() {
        this.activeIndex = 3;
        this.vendorService.changeofTab(this.activeIndex);
    }

    dismissModel() {
        this.modal.close();
    }

    deleteATAMapping(content, rowData) {
        this.selectedRowForDelete = rowData;
        this.isDeleteMode = true;

        this.contactATAId = rowData.vendorContactATAMappingId
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    private saveCompleted(user?: any) {
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Record was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Record was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getMappedATAByVendorId();
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    enableDisableAdvancedSearch(val) {
        this.showAdvancedSearchCard = val;
        this.search_SelectedContact = [];
        this.search_SelectedATA = [];
        this.search_SelectedATASubChapter = [];
        this.getMappedATAByVendorId();
    }

    getVendorName() {       
        if(this.isViewMode == false){
            if (this.local !== undefined && this.local !== null ) {
                return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
            } else {
                return '';
            }
        }
    }

    getATAAuditHistoryById(content,rowData) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendorContactATAAuditDetails(rowData.vendorContactATAMappingId).subscribe(res => {
            this.auditHistoryATA = res;
            for (var i = 0; i < this.auditHistoryATA.length; i++) {
                var obtainedVendorId = this.auditHistoryATA[i].vendorId;
                this.getVendorBasicData(obtainedVendorId);
            }
        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
       },error => {this.isSpinnerVisible = false;}) //this.onDataLoadFailed(error))    
    }

    getVendorBasicData(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendorDataById(vendorId).subscribe(res => {
            this.vendorData = res;
            this.isSpinnerVisible = false;
        },error =>{this.isSpinnerVisible = false;}) //this.onDataLoadFailed(error));
    }

    getColorCodeForHistoryATA(i, field, value) {
        const data = this.auditHistoryATA;
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