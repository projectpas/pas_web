import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { IPublicationType } from "../Workflow/PublicationType";
import { IPublicationAircraftManufacturer } from "../Workflow/PublicationAircraftManufacturer";
import { IPublicationModel } from "../Workflow/PublicationModel";
import { IPublicationStatus } from "../Workflow/PublicationStatus";
import { IPublication } from "../Workflow/Publication";
import { EmployeeService } from "../services/employee.service";
import { PublicationService } from "../services/publication.service";
import { Publication } from "../models/publication.model";
import { AlertService, MessageSeverity } from "../services/alert.service";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as $ from 'jquery';
import { MasterComapnyService } from "../services/mastercompany.service";
import { WorkFlowtService } from "../services/workflow.service";
import { ConfigurationService } from "../services/configuration.service";
import { getObjectById } from "../generic/autocomplete";

@Component({
    selector: 'grd-publication',
    templateUrl: './Publication-Create.component.html',
    styleUrls: ['./Publication-Create.component.css']
})
export class PublicationCreateComponent implements OnInit, OnChanges {
    allEmployeeinfo: any[] = [];
    firstCollection: any[] = [];
    @Input() itemMasterId = 0;
    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();
    publicationTypes: IPublicationType[];
    publicationAircraftManufacturers: IPublicationAircraftManufacturer[];
    publicationModels: IPublicationModel[];
    publicationStatuses: IPublicationStatus[];
    row: any;
    errorMessage: string;
    locations: any[] = [];
    updateModeforModels: boolean = false;
    publications: any[];
    dropdownSettings: any;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    closeResult: string;
    modal: NgbModalRef;
    generalInfo: any;
    pnMappingList: any = [];
    aircraftList: any = [];
    ataList: any = [];
    isActive: any;
    allComapnies: any;
    attachmentList: any = [];
    attachmentsPageSize: number = 10;
    pnMappingPageSize: number = 10;
    aircraftPageSize: number = 10;
    ataPageSize: number = 10;
    first: number = 0;

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
        //{ field: 'memo', header: 'Memo' }
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
        //{ field: 'link', header: 'Action' },
    ];
    publicationDropdown: any;
    aircraftListByPubId: any = [];
    aircraftModelListByPubId: any = [];
    dashNumber: any;
    isEditModeBinding: boolean = false;

    constructor(private actionService: ActionService,
        private masterComapnyService: MasterComapnyService,
        private _workflowService: WorkFlowtService,
        private modalService: NgbModal, private employeeService: EmployeeService,
        private configurations: ConfigurationService,
        private publicationService: PublicationService, private alertService: AlertService) {

    }


    ngOnInit(): void {
        console.log(this.UpdateMode);
        console.log(this.itemMasterId);
        console.log(this.workFlow);



        this.dropdownSettings = {
            singleSelection: false,
            idField: 'dashNumberId',
            textField: 'dashNumber',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 2,
            allowSearchFilter: false
        };
        this.getPublicationByItemMasterId(this.itemMasterId);

        // this.getAllPublicationTypes();

        this.row = this.workFlow.publication[0];
        if (this.row == undefined) {
            this.row = {};
        }
        this.row.taskId = this.workFlow.taskId;

        if (this.UpdateMode == true && this.workFlow.publication.length >= 0) {
            this.publications = [];
            if (this.workFlow.publication.length > 0) {

                this.bindEditModeData(this.workFlow.publication);
            }
            // for (let i = 0; i < this.workFlow.publication.length; i++) {
            //     this.isEditModeBinding = true;
            //     // this.loadPublicationById(this.workFlow.publication[i], false);
            // }
        }
        else {
            this.row.publicationId = "0";
            this.row.publicationRecordId = "0";
        }

        this.actionService.GetPublicationType().subscribe(
            type => {
                this.publicationTypes = type;
            },
            error => this.errorMessage = <any>error()
        );

    }

    Browse(): void {
        var brws = document.getElementById("myFile");
    }

    ngOnChanges(): void {

    }


    filterfirstName(event) {

        this.firstCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let firstName = this.allEmployeeinfo[i].firstName;
            if (firstName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.firstCollection.push(firstName);
            }
        }
    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.id = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.publicationId = "0";
        newRow.publicationRecordId = "0";
        newRow.publicationDescription = "";
        newRow.publicationType = "";
        newRow.sequence = "";
        newRow.source = "";
        newRow.aircraftManufacturer = "";
        newRow.model = "";
        newRow.location = "";
        newRow.revision = "";
        newRow.revisionDate = "";
        newRow.verifiedBy = "";
        newRow.status = "";
        newRow.verifiedDate = "";
        newRow.aircraft = [];
        newRow.aircraftModels = [];
        newRow.workflowPublicationDashNumbers = [];
        newRow.allDashNumbers = [];
        newRow.isDeleted = false;
        newRow.attachmentDetails = []
        this.workFlow.publication.push(newRow);
    }

    deleteRow(index): void {
        if (this.workFlow.publication[index].id == "0" || this.workFlow.publication[index].id == "") {
            this.workFlow.publication.splice(index, 1);
        }
        else {
            this.workFlow.publication[index].isDeleted = true;
        }
    }

    getPublicationByItemMasterId(itemMasterId) {
        this._workflowService.getPublicationsByItemMasterId(itemMasterId).subscribe(res => {
            this.publicationDropdown = res;
        })
    }

    // publicationDropdown: any[];
    // private getAllPublicationTypes(): void {
    //     if (this.publications == undefined || this.publications.length == 0) {
    //         this.publicationService.getAllPublicationsDropdown().subscribe(
    //             result => {
    //                 this.publicationDropdown = result[0];
    //             });
    //     }
    // }

    private onPublicationChange(event, wfPublication) {

        const pubData = this.publicationDropdown;
        for (var i = 0; i < pubData.length; i++) {

            // console.log(parseInt(pubData[i].publicationRecordId), parseInt(wfPublication.publicationId));
            if (parseInt(pubData[i].publicationRecordId) === parseInt(wfPublication.publicationId)) {
                wfPublication.attachmentDetails = pubData[i].attachmentDetails;
                break
            }
        }
        if (wfPublication.publicationId == 0) {
            this.setPublicationData(null, wfPublication);
            return;
        }
        if (this.publications != undefined) {
            var selectedPublication = this.publications.filter(function (publication) {
                return publication.publicationRecordId == wfPublication.publicationId;
            });
            if (selectedPublication.length == 0) {
                this.loadPublicationById(wfPublication, true);
            }
            else {
                this.setPublicationData(selectedPublication[0], wfPublication);
            }
        }
        else {
            this.publications = [];
            this.loadPublicationById(wfPublication, true);
        }

    }

    getAircraftByPublicationId(publicationRecordId, index) {
        this.publicationService.getAircraftManfacturerByPublicationId(this.itemMasterId, publicationRecordId).subscribe(res => {
            this['aircraftListByPubId' + index] = res;
        })
    }

    getModelByAircraftId(publicationRecordId, aircraftTypeId, index) {
        this.publicationService.getAircraftModelByAircraftManfacturerId(this.itemMasterId, publicationRecordId, aircraftTypeId).subscribe(res => {
            this['aircraftModelListByPubId' + index] = res;
        })
    }

    getDashNumberByModelandAircraftIds(publicationRecordId, aircraftTypeId, aircraftModelId, index) {
        console.log(publicationRecordId, aircraftTypeId, aircraftModelId, index);

        this.publicationService.getDashNumberByModelandAircraftIds(this.itemMasterId, publicationRecordId, aircraftTypeId, aircraftModelId).subscribe(res => {
            this['dashNumberListByModelId' + index] = res.map(x => {
                return {
                    dashNumberId: x.dashNumberId,
                    dashNumber: x.dashNumber
                }
            });
            // this.dashNumber = [
            //     { item_id: 1, item_text: 'Mumbai' },
            //     { item_id: 2, item_text: 'Bangaluru' },
            // ]
        })
    }
    getDynamicVariableData(variable, index) {
        return this[variable + index]
    }

    private getUniqueAircraft(aircraftMapping: any[]): any[] {
        var aircraft = [];
        var distinctAircraftIds = [];

        for (var i = 0; i < aircraftMapping.length; i++) {
            if (aircraftMapping[i].aircraftTypeId != undefined && distinctAircraftIds.indexOf(aircraftMapping[i].aircraftTypeId) == -1) {
                aircraft.push(aircraftMapping[i]);
                distinctAircraftIds.push(aircraftMapping[i].aircraftTypeId);
            }
        }

        return aircraft;
    }

    private getUniqueAircraftModels(publication: any): any[] {
        var aircraftModels = [];
        var distinctAircraftModelIds = [];

        for (var i = 0; i < publication.itemMasterAircraftMapping.length; i++) {
            if (publication.itemMasterAircraftMapping[i].aircraftModelId != undefined &&
                publication.itemMasterAircraftMapping[i].aircraftTypeId == publication.aircraftManufacturer &&
                distinctAircraftModelIds.indexOf(publication.itemMasterAircraftMapping[i].aircraftModelId) == -1) {
                aircraftModels.push(publication.itemMasterAircraftMapping[i]);
                distinctAircraftModelIds.push(publication.itemMasterAircraftMapping[i].aircraftModelId);
            }
        }

        return aircraftModels;
    }

    private getUniqueAircraftDashNumbers(publication: any): any[] {
        var aircraftDashNumbers = [];
        var distinctAircraftaircraftDashNumbersIds = [];

        for (var i = 0; i < publication.itemMasterAircraftMapping.length; i++) {
            if (publication.itemMasterAircraftMapping[i].dashNumberId != undefined &&
                publication.itemMasterAircraftMapping[i].aircraftTypeId == publication.aircraftManufacturer &&
                publication.itemMasterAircraftMapping[i].aircraftModelId == publication.model &&

                distinctAircraftaircraftDashNumbersIds.indexOf(publication.itemMasterAircraftMapping[i].dashNumberId) == -1) {
                aircraftDashNumbers.push(publication.itemMasterAircraftMapping[i]);
                distinctAircraftaircraftDashNumbersIds.push(publication.itemMasterAircraftMapping[i].aircraftTypeId);
            }
        }

        return aircraftDashNumbers;
    }
    bindEditModeData(data) {
        this.workFlow.publication = data.map((x, index) => {
            this.getAircraftByPublicationId(x.publicationId, index);
            this.getModelByAircraftId(x.publicationId, x.aircraftManufacturer, index);
            this.getDashNumberByModelandAircraftIds(x.publicationId, x.aircraftManufacturer, x.model, index);
            return {
                ...x
            }


        })
        // if (data.length > 0) {

        //     const data: any = res[0];
        //     console.log(data);
        //     const itemData = data.itemMasterAircraftMapping;
        //     itemData.map((x, index) => {
        //         console.log(x, index);

        //         this.getAircraftByPublicationId(data.publicationRecordId, index);
        //         this.getModelByAircraftId(data.publicationRecordId, x.aircraftTypeId, index);
        //         this.getDashNumberByModelandAircraftIds(data.publicationRecordId, x.aircraftTypeId, x.aircraftModelId, index);
        //         // x.attachmentDetails
        //     })
        // }
    }

    private loadPublicationById(wfPublication: any, isDropdownChange: boolean) {
        this.publicationService.getPublicationForWorkFlow(wfPublication.publicationId).subscribe(
            // result => {
            res => {



                if (res[0] != undefined && res[0] != null) {
                    this.publications.push(res[0]);

                    if (wfPublication.publicationId == res[0].publicationRecordId) {
                        wfPublication.itemMasterAircraftMapping = res[0].itemMasterAircraftMapping;

                        wfPublication.aircraft = this.getUniqueAircraft(res[0].itemMasterAircraftMapping);

                        if (!isDropdownChange) {
                            wfPublication.aircraftModels = this.getUniqueAircraftModels(wfPublication);
                            wfPublication.allDashNumbers = this.getUniqueAircraftDashNumbers(wfPublication);

                        }
                        else {
                            wfPublication.aircraftModels = [];
                            wfPublication.allDashNumbers = [];
                            wfPublication.workflowPublicationDashNumbers = [];
                        }

                        if (isDropdownChange) {
                            this.setPublicationData(res[0], wfPublication);
                        }
                    }
                }
            }
        );
    }

    downloadFileUpload(rowData) {
        console.log(rowData);

        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }
    private filterUniqueCombination(publication: any): void {
        var pubs = [];

        for (var imm of publication.itemMasterAircraftMapping) {
            var existingPublication = pubs.filter(x =>
                x.aircraftTypeId == imm.aircraftTypeId
                && x.aircraftModelId == imm.aircraftModelId
                && x.dashNumberId == imm.dashNumberId);

            if (existingPublication.length == 0) {
                pubs.push(imm);
            }

        }
        publication.itemMasterAircraftMapping = pubs;
    }

    private setPublicationData(selectedPublication: any, row: any) {
        if (selectedPublication != null) {
            row.publicationDescription = selectedPublication.description != null ? selectedPublication.description : '';
            row.revisionDate = selectedPublication.revisionDate != null ? new Date(selectedPublication.revisionDate).toLocaleDateString() : '';
            row.publicationType = selectedPublication.publicationTypeId != null ? selectedPublication.publicationTypeId : '';
            row.sequence = selectedPublication.sequence != null ? selectedPublication.sequence : '';
            row.aircraftManufacturer = '0';
            row.itemMasterAircraftMapping = selectedPublication.itemMasterAircraftMapping;
            row.aircraft = this.getUniqueAircraft(selectedPublication.itemMasterAircraftMapping);
            row.source = selectedPublication.asd != null ? selectedPublication.asd : '';
            row.model = '0';
            row.aircraftModels = [];
            row.allDashNumbers = [];
            row.location = selectedPublication.location != null ? selectedPublication.location : '';
            row.verifiedBy = selectedPublication.verifiedBy != null ? selectedPublication.verifiedBy : '';
            row.status = selectedPublication.isActive != null ? selectedPublication.isActive : '';
            row.verifiedDate = selectedPublication.verifiedDate != undefined ? new Date(selectedPublication.verifiedDate).toLocaleDateString() : '';
        }
        else {
            row.publicationDescription = '';
            row.revisionDate = '';
            row.publicationType = 0;
            row.sequence = '';
            row.aircraftManufacturer = '0';
            row.aircraft = [];
            row.source = '';
            row.model = '0';
            row.workflowPublicationDashNumbers = [];
            row.itemMasterAircraftMapping = [];
            row.aircraftModels = [];
            row.allDashNumbers = [];
            row.location = '';
            row.verifiedBy = '';
            row.status = 0;
            row.verifiedDate = '';
        }
    }



    public getAircraftModels(publication) {
        publication.aircraftModels = this.getUniqueAircraftModels(publication);// publication.aircraft.filter(x => x.aircraftTypeId == publication.aircraftManufacturer);
        publication.model = '0';
        publication.workflowPublicationDashNumbers = [];
        publication.allDashNumbers = [];
    }

    getDashNumbers(event, publication): void {
        var uniquePublication = this.workFlow.publication.filter(x => x.taskId == this.workFlow.taskId && x.publicationId == publication.publicationId
            && x.aircraftManufacturer == publication.aircraftManufacturer
            && x.model == publication.model);

        if (uniquePublication.length > 1) {
            event.target.value = '0';
            this.alertService.showMessage('Publication', 'Same combination is already in use, try other combination', MessageSeverity.error);
            return;
        }

        publication.allDashNumbers = this.getUniqueAircraftDashNumbers(publication);// publication.aircraft.filter(x => x.aircraftModelId == publication.model);
    }


    onDeSelect(publication, item: any) {

    }

    onItemSelect(publication, item: any) {


    }

    onSelectAll(publication, items: any) {

    }
    // viewPublicationDetails(data) {


    //     console.log(data);

    //     // this.modal = this.modalService.open(PublicationCreateComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    //     // this.modal.componentInstance.pubId = data.publicationId;
    //     // this.modal.result.then(() => {
    //     //     console.log('When user closes');
    //     // }, () => { console.log('Backdrop click') })

    // }

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

    loadMasterCompanies() {
        this.masterComapnyService.getMasterCompanies().subscribe(

            res => {
                this.allComapnies = res;
            }
        );

    }

    getFilesByPublicationId(publicationRecordId) {

        this.publicationService.getFilesBypublication(publicationRecordId).subscribe(res => {
            this.attachmentList = res || [];
            if (this.attachmentList.length > 0) {
                this.attachmentList.forEach(item => {
                    item["isFileFromServer"] = true;
                    item.attachmentDetails.forEach(fItem => {
                        fItem["isFileFromServer"] = true;
                    })
                })
            }
        });
    }

    viewPublicationDetails(row) {
        row = { ...row, publicationRecordId: row.publicationId };
        this.closeAllCollapse();


        console.log(row)
        //this.generalInfo = row;
        // this.sourceAction = row;
        // this.publication_Name = row.publicationId;
        // this.description = row.description;
        // this.partNumber = row.partNumber;
        // this.model = row.model;
        // this.ataMain = row.ataMain;
        // this.ataSubChapter = row.ataSubChapter;
        // this.ataPositionZone = row.ataPositionZone;
        // this.platform = row.platform;
        // this.memo = row.memo;
        // this.createdBy = row.createdBy;
        // this.updatedBy = row.updatedBy;
        // this.createdDate = row.createdDate;
        // this.updatedDate = row.updatedDate;
        this.isActive = row.isActive;
        console.log(this.isActive);
        this.loadMasterCompanies();
        this.getFilesByPublicationId(row.publicationRecordId);
        // this.modal = this.modalService.open(content, { size: 'lg' });
        // this.modal.result.then(() => {
        //     console.log('When user closes');
        // }, () => { console.log('Backdrop click') })

        //get general info
        this.publicationService.getpublicationbyIdView(row.publicationRecordId).subscribe(res => {
            this.generalInfo = res[0];

            // this.attachmentList = res[0].attachmentDetails.map(x => {
            //     return {
            //         ...x,
            //         fileName: x.fileName,
            //         //link: x.link
            //     }
            // })
            // console.log(this.attachmentList);
        })

        //get PN Mapping info
        this.publicationService.getPublicationPNMapping(row.publicationRecordId)
            .subscribe(res => {
                console.log(res);
                this.pnMappingList = res.map(x => {
                    return {
                        ...x,
                        partNumber: x.partNumber,
                        partDescription: x.partDescription,
                        itemClassification: x.itemClassification
                    };
                });
            });

        //get aircraft info
        this.publicationService
            .getAircraftMappedByPublicationId(row.publicationRecordId)
            .subscribe(res => {
                this.aircraftList = res.map(x => {
                    return {
                        ...x,
                        aircraft: x.aircraftType,
                        model: x.aircraftModel,
                        dashNumber: x.dashNumber,
                        //memo: x.memo
                    };
                });
            });

        // get ata chapter info
        this.publicationService
            .getAtaMappedByPublicationId(row.publicationRecordId)
            .subscribe(res => {
                const responseData = res;
                this.ataList = responseData.map(x => {
                    return {
                        ...x,
                        ataChapter: `${x.ataChapterCode} - ${x.ataChapterName}`,
                        ataSubChapter: `${x.ataSubChapterCode} - ${x.ataSubChapterDescription}`,
                        // ataChapter: x.ataChapterName,
                        // ataSubChapter: x.ataSubChapterDescription,
                        // ataChapterCode: x.ataChapterCode,
                        // ataSubChapterId: x.ataSubChapterId,
                        // ataChapterId: x.ataChapterId
                    };
                });
            });
        $('#view1').modal('show');
        // this.generalInfo = true;
        $('#step1').collapse('show');
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

}