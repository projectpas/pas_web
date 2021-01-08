import { Component, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConditionService } from '../../../../services/condition.service';
import { Condition } from '../../../../models/condition.model';
import { fadeInOut } from '../../../../services/animations';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MultiSelectModule } from 'primeng/multiselect';
import { VendorService } from '../../../../services/vendor.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { AtaMainService } from '../../../../services/atamain.service';
import { ATAMain } from '../../../../models/atamain.model';
import { ATASubChapter } from '../../../../models/atasubchapter.model';
import { AtaSubChapter1Service } from '../../../../services/atasubchapter1.service';
import { ATAChapter } from '../../../../models/atachapter.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-vendor-capabilities',
    templateUrl: './edit-vendor-capabilities.component.html',
    styleUrls: ['./edit-vendor-capabilities.component.scss'],
    animations: [fadeInOut]
})
/** edit-vendor-capabilities component*/
export class EditVendorCapabilitiesComponent implements OnInit
{
    /** edit-vendor-capabilities ctor */

    matSpinner: boolean;
    loadingIndicator: boolean;
    enablePlus: boolean = false;
    allATAMaininfo1: ATAMain[];
    allATAMaininfo: ATAChapter[];
    itemclaColl: any[];
    allVendors: any[] = [];
    VendorNamecoll: any[] = [];
    descriptionbyPart: any[] = [];
    capabilityTypeListDataColl: any[] = [];
    vendorCodes: any[];
    sourceVendorCap: any = {};
    disableSaveVenName: boolean;
    disableSaveVenderName: boolean;
    disableSave: boolean;
    selectedVendorActionName: any;
    vendorNames: any[];
    VendorCodesColl: any[] = [];
    disableSaveVenderCode: boolean;
    disableSaveVenCode: boolean;
    selectedVendorCode: any;
    allPartnumbersInfo: any[];
    selectedActionName: any;
    disableSavepartNumber: boolean;
    disableSavepartDescription: boolean;
    partCollection: any[];
    allaircraftInfo: any[];
    completeAircraftManfacturerData: any[];
    shiftValues: any[] = [];
    capabilityTypeList: any[] = [];
    modal: NgbModalRef;
    isSaving: boolean;
    selectedAircraftTypes: any;
    cols: any[];
    selectedAircraftDataModels: any[] = [];
    selectedColumns: any[];
    allAircraftinfo: any[];
    enablePopupData: boolean = false;
    selectedModels: any[] = [];
    currentVendorModels: any[] = [];
    currentAircraftModels: any[] = [];
    showInput: boolean;
    allManufacturerInfo: any[];
    vendorCodeError: boolean;
    vendorNameError: boolean;
    vendorRankingError: boolean;
    partIdError: boolean;
    altPartNumber: boolean;
    partDescriptionError: boolean;
    capabulityTypeListDataError: boolean;
    pmaDerError: boolean;
    capabulityDescError: boolean;
    costError: boolean;
    tatError: boolean;
    manufacturerdataError: boolean;
    display: boolean;
    modelValue: boolean;
    collectionofVendorCapability: any;
    collectionofItemMaster: any;
    selectedCapabulityTypesListData: any;
    collectionofVendorCapabilityTypeList: any;
    collectionofVendorCapabulityAircraftTypeList: any;
    vendorEditData: any;

    allAircraftManufacturer: any[] = [];
    VednorCapabilityTypeById: any[] = [];

    constructor(private _route: Router, private modalService: NgbModal, public ataSubChapter1Service: AtaSubChapter1Service, public ataservice: AtaMainService, public vendorService: VendorService, private alertService: AlertService, public itemser: ItemMasterService)
    {
        this.vendorEditData = this.vendorService.listCollection;
        this.sourceVendorCap.vendorId = this.vendorService.listCollection.vendorId
        this.sourceVendorCap.vendorCapabilityId = this.vendorService.listCollection.vendorCapabilityId
        this.sourceVendorCap.itemMasterId = this.vendorService.listCollection.itemMasterId
        this.sourceVendorCap.manufacturerId = this.vendorService.listCollection.manufacturerId
        this.sourceVendorCap.memo = this.vendorService.listCollection.memo
        this.sourceVendorCap.partName = this.vendorService.listCollection.partNumber
        this.sourceVendorCap.partDescription = this.vendorService.listCollection.partDescription
        this.sourceVendorCap.vendorCode = this.vendorService.listCollection.vendorCode
        this.sourceVendorCap.cost = this.vendorService.listCollection.cost
        this.sourceVendorCap.tat = this.vendorService.listCollection.tat
        this.sourceVendorCap.vendorName = this.vendorService.listCollection.vendorName
        this.sourceVendorCap.vendorRanking = this.vendorService.listCollection.vendorRanking
        this.sourceVendorCap.aTAChapterId = this.vendorService.listCollection.ataChapterId
        if (this.sourceVendorCap.aTAChapterId)
        {
            this.getATASubChapterData(this.sourceVendorCap.aTAChapterId);
        }
        this.sourceVendorCap.capabilityDescription = this.vendorService.listCollection.capabilityDescription
        this.sourceVendorCap.alternatePartId = this.vendorService.listCollection.alternatePartId
        this.sourceVendorCap.aTASubchapterId = this.vendorService.listCollection.ataSubchapterId
        this.sourceVendorCap.manufacturerName = this.vendorService.listCollection.manufacturerName
        this.sourceVendorCap.PMA_DER = this.vendorService.listCollection.pmA_DER
        

    }

    ngOnInit(): void
    {
        this.matSpinner = false;
      //  this.vendorService.MatSpinner = true;//App Mat Spinner Testing
       
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-edit-vendor-capabilities';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);

        this.vendorService.ShowPtab = false;
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);

        this.loadVendorData();
        this.ptnumberlistdata();
        this.atamaindata();
        this.aircraftManfacturerData();
        this.capabilityTypeListData();
        this.manufacturerdata();
        this.currentAircraftModelsData();

        //this.loadATASubchapterData();
    }

    private manufacturerdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemser.getManufacturerList().subscribe(
            results => this.onmanufacturerSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onmanufacturerSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = allWorkFlows;
        this.allManufacturerInfo = allWorkFlows;
    }

    isPMAorDER(value) {
        if (value == 'pma') {
            this.sourceVendorCap.isPMADER = 'PMA';
        }
        if (value == 'der') {
            this.sourceVendorCap.isPMADER = 'DER';
        }
    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    private currentAircraftModelsData()
    {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.vendorService.getVendorCapabilityAircraftManafacturerModelList(this.sourceVendorCap.vendorCapabilityId).subscribe(
            results => this.onDataLoadaircraftManfacturerModelDataSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }

    private onDataLoadaircraftManfacturerModelDataSuccessful(allWorkFlows: any[]) //While oading
    {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = allWorkFlows;
        this.currentAircraftModels = allWorkFlows; //Complete Aircraft Data
    }


    private aircraftManfacturerData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemser.getAircraft().subscribe(
            results => this.onDataLoadaircraftManfacturerSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }

    private onDataLoadaircraftManfacturerSuccessful(allWorkFlows: any[]) //While oading
    {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = allWorkFlows;
        this.allaircraftInfo = allWorkFlows; //Complete Aircraft Data

        this.completeAircraftManfacturerData = allWorkFlows;

        if (this.allaircraftInfo)
        {
            if (this.allaircraftInfo.length > 0)
            {
                for (let i = 0; i < this.allaircraftInfo.length; i++)
                    this.shiftValues.push(
                        { value: this.allaircraftInfo[i].aircraftTypeId, label: this.allaircraftInfo[i].description },

                    );
            }

            //Adding

            	let valAirCraft = [];
            //we are Passing vendorCapablity Id for getting Edit Data and make it check 
            this.vendorService.getVendorCapabilityAircraftManafacturerList(this.sourceVendorCap.vendorCapabilityId)
            		.subscribe(results => {
            			this.allAircraftManufacturer = results[0];
            			if (results != null) {
            				for (let i = 0; i < this.allAircraftManufacturer.length; i++) {
            					valAirCraft.push(this.allAircraftManufacturer[i].aircraftTypeId);
            				}
            				this.selectedAircraftTypes = valAirCraft; //if there is Aircraft Data with ItemMasterId that will be Checked 
            				console.log(this.selectedAircraftTypes);
            			}

            		},
            			error => this.onDataLoadFailed(error)
            		);


        }
    }


    private capabilityTypeListData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.vendorService.getcapabilityListData().subscribe(
            results => this.onDataLoadCapabilityTypeListDataSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

    }

    onDataLoadCapabilityTypeListDataSuccessful(capabilityTypeList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = getAtaMainList;
        this.capabilityTypeListDataColl = capabilityTypeList;

        if (this.capabilityTypeListDataColl)
        {
            if (this.capabilityTypeListDataColl.length > 0)
            {
                for (let i = 0; i < this.capabilityTypeListDataColl.length; i++)
                    this.capabilityTypeList.push(
                        { value: this.capabilityTypeListDataColl[i].capabilityTypeId, label: this.capabilityTypeListDataColl[i].description },

                    );
            }

            //Adding for Vendor capability List checkked 
            let valAirCraftCapabilityType = [];
            //we are Passing vendorCapablity Id for getting Edit Data and make it check 
            this.vendorService.getVendorCapabilityListById(this.sourceVendorCap.vendorCapabilityId)
                .subscribe(results => {
                    this.VednorCapabilityTypeById = results[0];
                    if (results != null) {
                        for (let i = 0; i < this.VednorCapabilityTypeById.length; i++)
                        {
                            valAirCraftCapabilityType.push(this.VednorCapabilityTypeById[i].capabilityTypeId);
                        }
                        this.selectedCapabulityTypesListData = valAirCraftCapabilityType; //if there is Aircraft Data with ItemMasterId that will be Checked 
                        console.log(this.selectedAircraftTypes);
                    }

                },
                    error => this.onDataLoadFailed(error)
                );


        }


    }

    private atamaindata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.ataservice.getAtaMainList().subscribe(
            results => this.onDataLoadATAMainDataSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    onDataLoadATAMainDataSuccessful(getAtaMainList: any[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = getAtaMainList;
        this.allATAMaininfo1 = getAtaMainList;
    }

    private onDataLoadAtaSubChapterDataSuccessful(data: any) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = getAtaSubChapter1List;
        this.allATAMaininfo = data;
    }


    loadVendorData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.vendorService.getWorkFlows().subscribe(
            results => this.onVendorDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onVendorDataLoadSuccessful(allWorkFlows: any[])
    {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allVendors = allWorkFlows;
        //this.vendorId = this.allVendors[0].vendorId;
        //console.log(this.allActions);
    }

    onVendorselected(event)
    {
        for (let i = 0; i < this.VendorNamecoll.length; i++)
        {
            if (event == this.VendorNamecoll[i][0].vendorName)
            {
                this.sourceVendorCap.vendorId = this.VendorNamecoll[i][0].vendorId;
                this.sourceVendorCap.vendorCode = this.VendorNamecoll[i][0].vendorCode
                //alert("Action Name already Exists");
                this.disableSaveVenName = true;
                this.disableSave = true;
                this.disableSaveVenderName = true;
                this.selectedVendorActionName = event;
            }

        }
    }

    eventHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedVendorActionName) {
                if (value == this.selectedVendorActionName.toLowerCase()) {
                    //alert("Action Name already Exists");
                    this.disableSaveVenderName = true;
                    this.disableSaveVenName = true;
                }
                else {
                    this.disableSaveVenderName = false;
                    this.disableSaveVenName = false;
                }
            }

        }
    }

    filterVendorNames(event)
    {
        this.vendorNames = [];
        for (let i = 0; i < this.allVendors.length; i++) {
            let vendorName = this.allVendors[i].vendorName;
            if (vendorName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                //this.vendorNames.push(vendorName);
                //  this.sourceVendorCap.vendorId= this.allVendors[i].vendorId;
                this.VendorNamecoll.push([{
                    "vendorId": this.allVendors[i].vendorId,
                    "vendorName": vendorName,
                    "vendorCode": this.allVendors[i].vendorCode,

                }]),
                    this.vendorNames.push(vendorName);
            }
        }
    }

    onVendorCodeselected(event)
    {
        //debugger;filterVendorNames
        for (let i = 0; i < this.VendorCodesColl.length; i++)
        {
            if (event == this.VendorCodesColl[i][0].vendorCode)
            {
                this.sourceVendorCap.vendorId = this.VendorCodesColl[i][0].vendorId;
                this.sourceVendorCap.vendorName = this.VendorCodesColl[i][0].vendorName; //passing Vendor Name
                this.disableSaveVenCode = true;
                this.disableSaveVenderCode = true;
                this.selectedVendorCode = event;
            }
        }
    }

    codeEventHandler(event)
    {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedVendorCode) {
                if (value == this.selectedVendorCode.toLowerCase()) {
                    //alert("Action Name already Exists");
                    this.disableSaveVenCode = true;
                    this.disableSaveVenderCode = true;

                }
                else {
                    this.disableSaveVenCode = false;
                    this.disableSaveVenderCode = false;

                }
            }

        }
    }

    filterVendorCodes(event)
    {
        this.vendorCodes = [];
        for (let i = 0; i < this.allVendors.length; i++)
        {
            let vendorCode = this.allVendors[i].vendorCode;

            if (vendorCode.toLowerCase().indexOf(event.query.toLowerCase()) == 0)
            {
                // this.sourceVendorCap.vendorId = this.allVendors[i].vendorId;
                //this.vendorCodes.push(vendorCode);
                this.VendorCodesColl.push([{
                    "vendorId": this.allVendors[i].vendorId,
                    "vendorName": this.allVendors[i].vendorName,
                    "vendorCode": vendorCode
                }]),
                    this.vendorCodes.push(vendorCode);

            }
        }
    }


    private ptnumberlistdata() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;

        this.itemser.getPrtnumberslistList().subscribe(
            results => this.onptnmbersSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onptnmbersSuccessful(allWorkFlows: any[]) {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = allWorkFlows;
        this.allPartnumbersInfo = allWorkFlows;


        //console.log(this.allActions);


    }

    partEventHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selectedActionName) {
                if (value == this.selectedActionName.toLowerCase()) {
                    //alert("Action Name already Exists");
                    this.disableSavepartNumber = true;

                }
                else {
                    this.disableSavepartNumber = false;
                    this.sourceVendorCap.partDescription = "";
                    this.disableSavepartDescription = false;
                }
            }

        }
    }

    partnmId(event) {
        //
        if (this.itemclaColl) {
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event == this.itemclaColl[i][0].partName) {
                    this.sourceVendorCap.partName = this.itemclaColl[i][0].partName;
                    this.sourceVendorCap.partId = this.itemclaColl[i][0].partId;
                    this.disableSavepartNumber = true;
                    this.selectedActionName = event;
                }
            }
            this.itemser.getDescriptionbypart(event).subscribe(
                results => this.onpartnumberloadsuccessfull(results[0]),
                error => this.onDataLoadFailed(error)
            );
            this.disableSavepartDescription = true;
        }
    }

    private onpartnumberloadsuccessfull(allWorkFlows: any[]) //getting Part Description
    {


        this.sourceVendorCap.itemMasterId = allWorkFlows[0].itemMasterId;
        //this.sourceAction = this.descriptionbyPart;
        this.sourceVendorCap.partDescription = allWorkFlows[0].partDescription;
        this.sourceVendorCap.manufacturerId = allWorkFlows[0].manufacturerId;

    }

    filterpartItems(event) {

        this.partCollection = [];
        this.itemclaColl = [];
        if (this.allPartnumbersInfo) {
            if (this.allPartnumbersInfo.length > 0) {

                for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                    let partName = this.allPartnumbersInfo[i].partNumber;
                    if (partName) {
                        if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.itemclaColl.push([{
                                "partId": this.allPartnumbersInfo[i].itemMasterId,
                                "partName": partName
                            }]),

                                this.partCollection.push(partName);
                        }
                    }
                }
            }
        }
    }

    //get ATA Chapter Alias ATA Subchapter1 Data
    getATASubChapterData(ataMainId) {
        this.vendorService.getATASubchapterData(ataMainId).subscribe( //calling and Subscribing for Address Data
            results => this.onDataLoadAtaSubChapterDataSuccessful(results[0]), //sending Address
            error => this.onDataLoadFailed(error)
        );
    }

    openModelPopups(content) {

        
        if (this.vendorService.isEditMode == true) {
            this.modal = this.modalService.open(content, { size: 'sm' });
            this.isSaving = true
            this.modal.result.then(() => {



                console.log('When user closes');
            }, () => { console.log('Backdrop click') })

            //Adding for Aircraft manafacturer List Has empty then List Should be null
            if (this.selectedAircraftTypes.length > 0) {
                var arr = this.selectedAircraftTypes;
                var selectedvalues = arr.join(",");
                this.itemser.getAircraftTypes(selectedvalues).subscribe(
                    results => this.onDataLoadaircrafttypeSuccessful(results[0]),
                    error => this.onDataLoadFailed(error)
                );
            }
            else {
                this.allAircraftinfo = []; //Making empty if selecting is null
            }

            this.cols = [
                //{ field: 'customerClassificationId', header: 'Customer Classification ID' },
                { field: 'description', header: 'Aircraft Type' },
                { field: 'modelName', header: 'Model' },


            ];
            this.selectedColumns = this.cols;
        }

        //if (this.vendorService.isEditMode == true)
        //{

        //	this.modal = this.modalService.open(content, { size: 'sm' });
        //	this.modal.result.then(() => {

        //		console.log('When user closes');
        //	}, () => { console.log('Backdrop click') })
        //	if (this.allAircraftinfo) {
        //		if (this.allAircraftinfo.length >= 0) {
        //			this.enablePopupData = true;
        //			var arr = this.selectedAircraftTypes;
        //			if (this.selectedAircraftTypes) {
        //				var selectedvalues = arr.join(",");
        //                //this.loadData();
        //                this.vendorService.getVendorCapabilityAircraftManafacturerModelList(this.sourceVendorCap.vendorCapabilityId).subscribe(
        //					results => this.onDataLoadaircrafttypeSuccessful(results[0]),
        //					error => this.onDataLoadFailed(error)

        //				)
        //			}
        //		}
        //	}
        //}

    }


    private onDataLoadaircrafttypeSuccessful(allWorkFlows: any[]) //getting Models Based on Manfacturer Selection
    {

        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //this.dataSource.data = allWorkFlows;
        this.allAircraftinfo = allWorkFlows; //selected Aircraft Models based on Aircraft Data Selection

        if (this.vendorService.isEditMode == false) {
            this.allAircraftinfo = allWorkFlows; //Totel Aircraft model Data Based on Aircraft Type
        }
        if (this.enablePopupData == true) {
            this.allAircraftinfo = allWorkFlows;
        }
        //for Open Model for Edit Data
        if (this.vendorService.isEditMode == true) //in this we are Making all the Models and Getting Checked if data is thete with Item Master Id 
        {
           

                for (let i = 0; i < this.currentAircraftModels.length; i++)
                {
                    for (let j = 0; j < this.allAircraftinfo.length; j++) {
                        if (this.currentAircraftModels[i].aircraftModelId == this.allAircraftinfo[j].aircraftModelId)
                        {
                            this.allAircraftinfo[j].priority = this.currentAircraftModels[i].dashNumber;
                            //here we are passing to priority but DB as dashNumber
                            //so we have changed to Html NgModel but while save need to change the array column 
                            //this.allAircraftinfo[j].checkbox = this.currentAircraftModels[i].checkbox;
                            this.allAircraftinfo[j].checkbox = this.currentAircraftModels[i].isSelected;
                           // this.allAircraftinfo[j].push()
                        }
                    }
            }


            //need to add that current Aircraft Models Data to the Selected Models Data Because Selected Models dont know the Edit Data

            if (this.selectedModels.length == 0)
            {
                for (let i = 0; i < this.currentAircraftModels.length; i++)
                {

                    this.selectedModels.push({
                        "aircraftModelId": this.currentAircraftModels[i].aircraftModelId,
                        "priority": this.currentAircraftModels[i].dashNumber,
                        "dashNumber": this.currentAircraftModels[i].dashNumber,
                        "checkbox": this.currentAircraftModels[i].isSelected,
                    })
                }

            }
            


           
        }


        if (this.selectedModels.length > 0) {

            let ischange1 = false;
            if (this.selectedModels.length > 0) {
                this.selectedModels.map((row) => {
                    for (let i = 0; i < this.allAircraftinfo.length; i++) {
                        if (this.allAircraftinfo[i].aircraftModelId == row.aircraftModelId) {
                            this.allAircraftinfo[i].priority = row.priority;
                            this.allAircraftinfo[i].checkbox = row.checkbox;
                            ischange1 = true;
                        }
                    }

                });
            }
            //if (!ischange1) {
            //	this.selectedModels.push(selectedRow);
            //}

        }






    }

    dismissAircraftModel() {
        //if (this.selectedModels.length > 0) {
        //	this.manfacturerAircraftmodelsarray = [];
        //	this.distributionAircraftmodelsarray = [];
        //	this.overhaulAircraftmodelsarray = [];
        //	this.certificationarrayAircraftmodelsarray = [];
        //	this.repairAircraftmodelsarray = [];
        //	this.exchangeAircraftmodelsarray = [];
        //	this.isDeleteMode = false;
        //	this.isEditMode = false;
        //	this.modal.close();
        //	if (this.itemser.isEditMode == false || (this.itemser.isEditMode == true && this.selectedModels.length > 0)) {

        //		this.manfacturerAircraftmodelsarray = this.manfacturerAircraftDataParsing(JSON.parse(JSON.stringify(this.selectedModels)));
        //		this.distributionAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
        //		this.overhaulAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
        //		this.certificationarrayAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
        //		this.repairAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
        //		this.exchangeAircraftmodelsarray = JSON.parse(JSON.stringify(this.selectedModels));
        //	}
        //}
        this.showInput = true;
        this.modal.close();
    }



    //Vendor Models Selection and Adding

    public saveSelectedModel(selectedRow, indeex)
    {
        selectedRow.isBoolean = indeex;
        //Moveing getSelectedItem from here Below Code
        let ischange = false;
        if (this.selectedModels.length > 0)
        {
            //praveen's code//
            this.selectedModels.map((row) => {
                if (selectedRow.aircraftModelId == row.aircraftModelId)
                {
                    if (selectedRow.checkbox == row.checkbox)
                    {
                        ischange = true;
                    }

                    else
                    {
                        row.checkbox = selectedRow.checkbox;
                        ischange = true;
                    }
                    
                }
            });
        }
        if (!ischange)
        {
            this.selectedModels.push(selectedRow);
        }
        console.log(this.selectedModels);
    }

    public getSelectedItem(selectedRow, event)
    {
        let ischange = false;
        if (this.selectedModels.length > 0) {
            //praveen's code//
            this.selectedModels.map((row) => {
                if (selectedRow.aircraftModelId == row.aircraftModelId)
                {
                    row.priority = event.target.value;
                    ischange = true;
                }
            });
        }
        if (!ischange)
        {
            this.selectedModels.push(selectedRow);
        }
        console.log(this.selectedModels);
    }

    saveAircraftmodelinfo(partid, itemid, data) {

        for (let i = 0; i < data.length; i++) {
            data[i].itemMasterId = itemid;
            //data[i].partId = partid;


            this.itemser.saveAircraftinfo(data[i]).subscribe(aircraftdata => {
                this.collectionofItemMaster = aircraftdata;
            })

        }
    }

    private savesuccessCompleted(user?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
        //this.loadData();
    }

    saveVendorCapsclose()//for Saving Vendor capability
    {
        //if (!this.sourceVendorCap.vendorCode)
        //{
        //	this.vendorCodeError = true;
        //}
        //else
        //{
        //	this.vendorCodeError = false;
        //}

        //if (!this.sourceVendorCap.vendorName)
        //{
        //	this.vendorNameError = true;
        //}
        //else {
        //	this.vendorNameError = false;
        //}

        //if (!this.sourceVendorCap.vendorRanking)
        //{
        //	this.vendorRankingError = true;
        //}
        //else {
        //	this.vendorRankingError = false;
        //}

        //if (!this.sourceVendorCap.partId) {
        //	this.partIdError = true;
        //}
        //else {
        //	this.partIdError = false;
        //}



        //if (!this.sourceVendorCap.partDescription) {
        //	this.partDescriptionError = true;
        //}
        //else {
        //	this.partDescriptionError = false;
        //}

        //if (!this.sourceVendorCap.selectedCapabulityTypesListData) {
        //	this.capabulityTypeListDataError = true;
        //}
        //else {
        //	this.capabulityTypeListDataError = false;
        //}

        //if (!this.sourceVendorCap.isPMADER) {
        //	this.pmaDerError = true;
        //}
        //else {
        //	this.pmaDerError = false;
        //}

        //if (!this.sourceVendorCap.capDescription) {
        //	this.capabulityDescError = true;
        //}
        //else {
        //	this.capabulityDescError = false;
        //}

        //if (!this.sourceVendorCap.cost) {
        //	this.costError = true;
        //}
        //else {
        //	this.costError = false;
        //}
        //if (!this.sourceVendorCap.tat) {
        //	this.tatError = true;
        //}
        //else {
        //	this.tatError = false;
        //}

        //if (!this.sourceVendorCap.manufacturerId) {
        //	this.manufacturerdataError = true;
        //}
        //else {
        //	this.manufacturerdataError = false;
        //}



        //if (
        //	(!this.sourceVendorCap.vendorCode) || (!this.sourceVendorCap.vendorName)
        //	|| (!this.sourceVendorCap.vendorRanking) || (!this.sourceVendorCap.partId) 
        //	|| (!this.sourceVendorCap.partDescription) || (!this.sourceVendorCap.selectedCapabulityTypesListData) || (!this.sourceVendorCap.isPMADER)
        //	|| (!this.sourceVendorCap.capDescription) || (!this.sourceVendorCap.cost) || (!this.sourceVendorCap.tat) || (!this.sourceVendorCap.manufacturerId)
        //) {
        //	this.display = true;
        //	this.disableSave = true;

        //	this.modelValue = true;
        //}



        if (this.sourceVendorCap.vendorCapabilityId) //for Edit Screen
        {


            this.sourceVendorCap.masterCompanyId = 1;
            this.sourceVendorCap.isActive = true;
            this.sourceVendorCap.itemTypeId = 1;

            this.vendorService.updateVendorCapability(this.sourceVendorCap).subscribe(data => {
                this.collectionofVendorCapability = data;
               // this.savesuccessCompleted(this.sourceVendorCap);
                if (this.selectedCapabulityTypesListData)
                {
                    this.vendorService.DeletevendorCapability(this.sourceVendorCap.vendorCapabilityId).subscribe(
                        data => {
                            this.collectionofVendorCapability = data;

                            if (data != null) {
                                for (let i = 0; i < this.selectedCapabulityTypesListData.length; i++) {
                                    let localCapabulityTypeColl = [{
                                        vendorCapabilityId: this.sourceVendorCap.vendorCapabilityId,
                                        capabilityTypeId: this.selectedCapabulityTypesListData[i]
                                    }]
                                    this.vendorService.addVendorCapabilityTypeList(localCapabulityTypeColl[0]).subscribe(aircraftdata => {
                                        this.collectionofVendorCapabilityTypeList = aircraftdata;
                                    })
                                }
                                console.log(this.selectedCapabulityTypesListData);

                            }

                        });


                }

                if (this.selectedAircraftTypes)
                {
                    this.vendorService.DeletevendorCapabilityAircraftManafacturer(this.sourceVendorCap.vendorCapabilityId).subscribe(
                        data => {
                            this.collectionofVendorCapability = data;
                            if (data != null) {
                                for (let i = 0; i < this.selectedAircraftTypes.length; i++) {
                                    //this.selectedAircraftTypes[i].push = data.vendorCapabilityId;
                                    let localCapabulityAircraftTypeColl = [{
                                        vendorCapabilityId: this.sourceVendorCap.vendorCapabilityId,
                                        AircraftTypeId: this.selectedAircraftTypes[i]
                                    }]
                                    this.vendorService.addVendorCapabilityAircraftType(localCapabulityAircraftTypeColl[0]).subscribe(aircraftdata => {
                                        this.collectionofVendorCapabulityAircraftTypeList = aircraftdata;
                                    })
                                }
                                console.log(this.selectedAircraftTypes);
                            }
                        });

                }

                if (this.selectedModels)
            {

                    this.vendorService.DeletevendorCapabilityAircraftModel(this.sourceVendorCap.vendorCapabilityId).subscribe(
                    data => {
                        this.collectionofVendorCapability = data;

                        if (data != null)
                        {
                            for (let i = 0; i < this.selectedModels.length; i++) {
                                // this.selectedModels[i].vendorCapabilityId = data.vendorCapabilityId;
                                let localCapabulityAircraftModelColl = [{
                                    vendorCapabilityId: this.sourceVendorCap.vendorCapabilityId,
                                    aircraftModelId: this.selectedModels[i].aircraftModelId,
                                    dashNumber: this.selectedModels[i].priority,
                                    isSelected: this.selectedModels[i].checkbox
                                }]
                                this.vendorService.addVendorCapabiltiyAircraftModel(localCapabulityAircraftModelColl[0]).subscribe(aircraftdata => {
                                    this.collectionofVendorCapabilityTypeList = aircraftdata;
                                })
                            }
                            console.log(this.selectedModels);
                        }
                    });

                }

               // this.alertService.startLoadingMessage();
                this.savesuccessCompleted(this.sourceVendorCap);

                this._route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-capabilities-list')
            })

            
                //saving for Vendor capability Type Table
            
            

           

           

        }

       

    }

}