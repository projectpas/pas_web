import { Component, OnInit, ViewChild, Output, EventEmitter, Input, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material'; 
declare var $: any;
import * as moment from 'moment';
import { AuthService } from '../../../services/auth.service';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { Subject } from 'rxjs/Subject';
import { DatePipe } from '@angular/common';
import { PublicationService } from '../../../services/publication.service';

@Component({
    selector: 'app-common-publicationView',
    templateUrl: './common-publicationView.component.html',
    styleUrls: ['./common-publicationView.component.scss'],
    providers: [DatePipe]
})
/** common component*/ 
export class CommonPublicationViewComponent implements OnInit,OnChanges, OnDestroy {
    disableSave: boolean = true;
    moduleId: any;
    targetData: any;
    selectedOnly: any;  
    @Input() publicationId; 
    attachmentsPageSize: number = 10;
    pnMappingPageSize: number = 10;
    aircraftPageSize: number = 10;
    ataPageSize: number = 10;
    first: number = 0;
    row: any
    isSpinnerVisible = false;
    WmoduleName: any = 'Publication';
    viewAircraftData: any;
    viewAtaData: any;
    allDocumentsList:any=[];
    publicationRecordId:any;
    isActive:boolean=false;
    generalInfo: any;
    pnMappingList:any = [];
    aircraftList: any = [];
    ataList: any = [];
    attachmentList:any=[];
    modal: NgbModalRef;
    headersforPNMapping = [
        { field: 'partNumber', header: 'PN ID/Code' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'itemClassification', header: 'Item Classification' },
        { field: 'manufacturerName', header: 'Manufacturer' },
        { field: 'itemGroup', header: 'Item Group' }

    ];
    aircraftInformationCols: any[] = [
        { field: 'partNumber', header: 'PN Number' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'manufacturerName', header: 'Manufacturer' },
        { field: 'itemGroup', header: 'Item Group' },
        { field: 'aircraft', header: 'Aircraft' },
        { field: 'model', header: 'Model' },
        { field: 'dashNumber', header: 'Dash Numbers' },
    ];
    atacols = [
        { field: 'partNumber', header: 'PN Number' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'manufacturerName', header: 'Manufacturer' },
        { field: 'itemGroup', header: 'Item Group' },
        { field: 'ataChapter', header: 'AtaChapter' },
        { field: 'ataSubChapter', header: 'AtaSubChapter' } 
    ];
    headersforAttachment = [
        { field: 'tagTypeName', header: 'Tag Type' }
    ];
    constructor(private commonService: CommonService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public customerService: CustomerService,
        private dialog: MatDialog,
        private publicationService: PublicationService, private datePipe: DatePipe, private configurations: ConfigurationService) {
    }

    ngOnInit() {

    }

    ngOnDestroy() { 
    }
    ngOnChanges(changes: SimpleChanges) {
        
    //     for (let property in changes) {
    //         if (property == 'generalInformtionData') {
    //             if (changes[property].currentValue != {}) {

                  
    //         }
    //     }

    //         if (property == 'uploadDocsToser') { 
    //         }
    //         if (property == 'moduleName') { 
    //     }
    // } 
    this.viewPublicationDetails();
 }
    openAllCollapse() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
    }

    closeAllCollapse() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
    }

    getFilesByPublicationId(publicationRecordId) {
        this.isSpinnerVisible = true;
        this.publicationService.getFilesBypublication(publicationRecordId).subscribe(res => {
            this.attachmentList = res || [];
            this.isSpinnerVisible = false;
            if (this.attachmentList.length > 0) {
                this.attachmentList.forEach(item => {
                    item["isFileFromServer"] = true;
                    item.attachmentDetails.forEach(fItem => {
                        fItem["isFileFromServer"] = true;
                    })
                })
            }
        }, error => {
            this.isSpinnerVisible = false;
        });
    }
    closeModal() {
        this.viewAircraftData = {};
        this.viewAtaData={};
        if (this.modal) {
          this.modal.close()
        }
      }
    viewPublicationDetails() {
        this.publicationRecordId=undefined;
        // this.allDocumentsList=row.attachmentDetails
 
        this.closeAllCollapse();
        // this.isActive = row.isActive;
        // this.loadMasterCompanies();
        this.getFilesByPublicationId(this.publicationId);
        this.publicationRecordId=this.publicationId
        //get general info
        this.isSpinnerVisible = true;
        this.publicationService.getpublicationbyIdView(this.publicationId).subscribe(res => {
            this.generalInfo = res[0];
            this.isSpinnerVisible = false;
        }, error => {
            this.isSpinnerVisible = false;
        });

        //get PN Mapping info
        this.isSpinnerVisible = true;
      
        this.publicationService.getPublicationPNMapping(this.publicationId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.pnMappingList = res.map(x => {
                    return {
                        ...x,
                        partNumber: x.partNumber,
                        partDescription: x.partDescription,
                        itemClassification: x.itemClassification
                    };
                });
            }, error => {
                this.isSpinnerVisible = false;
            });

        //get aircraft info
        this.isSpinnerVisible = true;
        this.publicationService
            .getAircraftMappedByPublicationId(this.publicationId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.aircraftList = res.map(x => {
                    return {
                        ...x,
                        aircraft: x.aircraftType,
                        model: x.aircraftModel,
                        dashNumber: x.dashNumber,
                    };
                });
            }, error => {
                this.isSpinnerVisible = false;
            });

        // get ata chapter info
        this.isSpinnerVisible = true;
        this.publicationService
            .getAtaMappedByPublicationId(this.publicationId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                const responseData = res;
                this.ataList = responseData.map(x => {
                    return {
                        ...x,
                        ataChapter: `${x.ataChapterCode} - ${x.ataChapterName}`,
                        ataSubChapter: `${x.ataSubChapterCode} - ${x.ataSubChapterDescription}`,
                    };
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
        $('#view1').modal('show');
        $('#step1').collapse('show');
    }
    openAircraftView(rowData, content) {
        this.viewAircraftData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
      }
      openAtaView(rowData, content) {
        this.viewAtaData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { })
      }
      getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
}