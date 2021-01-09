import { Router, ActivatedRoute } from '@angular/router';
import { PublicationService } from '../../../services/publication.service';
import {
  MatDialog,
  throwMatDialogContentAlreadyAttachedError
} from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { CustomerClassification } from '../../../models/customer-classification.model';
import { HttpClient } from '@angular/common/http';
import { IntegrationService } from '../../../services/integration-service';
import { OnInit, Component, ViewChild, ElementRef } from '@angular/core';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { AtaMainService } from '../../../services/atamain.service';
import { AircraftModelService } from '../../../services/aircraft-model/aircraft-model.service';
import { AircraftManufacturerService } from '../../../services/aircraft-manufacturer/aircraftManufacturer.service';
import { map } from 'rxjs/operator/map';
import { DashNumberService } from '../../../services/dash-number/dash-number.service';
import { AtaSubChapter1Service } from '../../../services/atasubchapter1.service';
import { EmployeeService } from '../../../services/employee.service';
import * as moment from 'moment';
import { getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { DBkeys } from '../../../services/db-Keys';
import { error } from '@angular/compiler/src/util';
import { HttpErrorResponse } from '@angular/common/http';

import * as $ from 'jquery';


@Component({
  selector: 'app-create-publication',
  templateUrl: './create-publication.component.html',
  styleUrls: ['./create-publication.component.scss']
})
/** Create-publication component*/
export class CreatePublicationComponent implements OnInit {
  publicationType: any;
  @ViewChild('tagsFileUploadInput', { static: false }) tagsFileUploadInput: any;
  @ViewChild("tabRedirectConfirmationModal", { static: false }) public tabRedirectConfirmationModal: ElementRef;
  activeMenuItem: number = 1;
  revision: boolean = false;
  currentTab: string = 'General';
  PublicationId: string;
  entryDate: Date;
  pubDescr: string;
  pubType: string;
  uploadedFiles: any[] = [];
  private isSaving: boolean;
  isEditMode: boolean = false;
  selectedFile: File = null;
  publicationId: number;
  data: any;
  memoPopupContent: any;
  attachCertificateUpdateFlag: boolean = false;
  resetinputmodel: any;
  publicationGeneralInformation = {
    entryDate: new Date(),
    publicationId: '',
    description: '',
    publicationTypeId: null,
    asd: '',
    sequence: null,
    publishby: '',
    location: '',
    revisionDate: null,
    revisionNumber: '',
    expirationDate: null,
    nextReviewDate: null,
    employeeId: null,
    isActive: false,
    inActive: false,
    verifiedBy: null,
    verifiedDate: null,
    masterCompanyId: 1,
    publishedById: null,
    tagTypeId: null
  }


  public sourcePublication: any = {
    ...this.publicationGeneralInformation

  };

  generalInformationDetails: any = {};
  airCraftTypesList = [];
  airCraftModels = [];
  dashModels = [];
  aircraftList: any = [];
  showModelAircraftModel: boolean = false;
  partNumberList = [];
  selectedPartNumbers = [];
  pnMappingList = [];
  publicationRecordId: any;
  employeeList: any = [];
  ataList = [];
  headersforPNMapping = [
    { field: 'partNumber', header: 'PN' },
    { field: 'partDescription', header: 'PN Description' },
    { field: 'manufacturer', header: 'Manufacturer' },
    { field: 'itemClassification', header: 'Item Classification' },
    { field: 'itemGroup', header: 'Item Group' }
  ];
  selectedPNmappingColumns = this.headersforPNMapping;

  aircraftManufacturerList: { label: string; value: number }[];

  // search function in aircraftInformation
  selectAircraftManfacturer = [];
  aircraftManfacturerIdsUrl: string = '';
  aircraftModelList: any = [];
  selectedAircraftModel = [];
  aircraftModelsIdUrl: string = '';
  dashNumberList: any = [];
  selectedDashNumbers = [];
  dashNumberIdUrl: string = '';
  ataChapterList = [];
  selectedATAchapter = [];
  ataChapterIdUrl: string = '';
  selectedATASubChapter = [];
  ataSubchapterIdUrl: string = '';
  searchParams: string = '';
  ataSubChapterList: { label: string; value: number }[];
  searchATAParams: string = '';
  isDisabledSteps = false;
  attachmentList: any[] = [];
  publicationTypes: any[] = [];
  pnMappingPageSize: number = 10;
  aircraftPageSize: number = 10;
  // dropdown

  // publicationTypes = [
  //   { label: 'Select Publication Type', value: null },
  //   { label: 'CMM', value: '2' },
  //   { label: 'AD', value: '3' },
  //   { label: 'SB', value: '4' }
  // ];

  // table columns for ata

  atacols = [
    //PartNumber,PartDescription,ItemGroup, ManufacturerName
    { field: 'partNumber', header: 'PN Number' },
    { field: 'partDescription', header: 'PN Description' },
    { field: 'manufacturerName', header: 'Manufacturer' },
    { field: 'itemGroup', header: 'Item Group' },
    { field: 'ataChapter', header: 'ATA Chapter' },
    //{ field: 'ataChapterCode', header: 'ATA Chapter Code' },
    { field: 'ataSubChapter', header: 'ATA SubChapter' },
    //{ field: 'ataSubChapterCode', header: 'ATA SubChapter Code' }
  ];
  selectedatacols = this.atacols;
  status = [
    { label: 'Select Status ', value: 'Select Status' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
  ];
  isEnableNext: any = false;
  formData = new FormData();
  selectedRowforDelete: any;
  active: boolean = false;
  inactive: boolean = false;
  globalFormatDate: string;
  disableSaveMemo: boolean = true;
  ataPageSize: number = 10;
  showAdvancedSearchCardAta: boolean = false;
  showAdvancedSearchCardAircraft: boolean = false;
  gLocationsList: any[] = [];
  pnData: any = [];
  selectedOnly: boolean = false;
  targetData: any;
  selectedPartNumber: string = '';
  pnAircraftData: any = [];
  selectedAircraftPartNumber: string = '';
  modal: NgbModalRef;
  viewAircraftData: any = {};
  viewAtaData: any = {};
  fileTagTypesList: any = [];
  selectedFileAttachment: any = {};
  disableFileAttachmentSubmit: boolean = true;
  publishedByModulesList: any = [];
  publishedByReferences: any = [];
  nextOrPreviousTab: any;
  arrayIntegrationlist: any[] = [];
  disableSave: boolean = true;

  /** Create-publication ctor */
  constructor(
    private publicationService: PublicationService,
    private atasubchapter1service: AtaSubChapter1Service,
    private alertService: AlertService,
    public ataMainSer: AtaMainService,
    public inteService: IntegrationService,
    private http: HttpClient,
    private aircraftManufacturerService: AircraftManufacturerService,
    private aircraftModelService: AircraftModelService,
    private pubdashNumberService: PublicationService,
    private authService: AuthService,
    private itemMasterService: ItemMasterService,
    private Dashnumservice: DashNumberService,
    private employeeService: EmployeeService,
    private route: Router,
    private _actRoute: ActivatedRoute,
    private commonService: CommonService,
    private configurations: ConfigurationService,
    private localStorage: LocalStoreManager,
    private modalService: NgbModal
  ) { }
  aircraftInformationCols: any[] = [
    { field: 'partNumber', header: 'PN Number' },
    { field: 'partDescription', header: 'PN Description' },
    { field: 'manufacturerName', header: 'Manufacturer' },
    { field: 'itemGroup', header: 'Item Group' },
    { field: 'aircraft', header: 'Aircraft' },
    { field: 'model', header: 'Model' },
    { field: 'dashNumber', header: 'Dash Numbers' },
    // { field: 'memo', header: 'Memo' }
  ];
  selectedaircraftInformationCols = this.aircraftInformationCols;
  headersforAttachment = [
    { field: 'tagTypeName', header: 'Tag Type' }
    // { field: 'fileName', header: 'File Name' },
  ];
  first: number = 0;
  //added by supriya
  index: number;
  @ViewChild('fileUploadInput', { static: false }) fileUploadInput: any;
  totalRecordNew: number = 0;
  pageSizeNew: number = 3;
  totalPagesNew: number = 0;
  sourceViewforDocumentList: any = [];
  //sourceViewforDocumentListColumns = [
  //{ field: 'fileName', header: 'File Name' },
  //]
  customerDocumentsColumns = [
    { field: 'tagTypeName', header: 'Tag Type' },

    { field: 'docName', header: 'Name' },
    { field: 'docDescription', header: 'Description' },
    { field: 'docMemo', header: 'Memo' },
    { field: 'fileName', header: 'File Name' },
    { field: 'fileSize', header: 'File Size' },
    { field: 'createdBy', header: 'Created By' },
    { field: 'updatedBy', header: 'Updated By' },
    { field: 'createdDate', header: 'Created Date' },
    { field: 'updatedDate', header: 'Updated Date' },
  ];
  selectedColumnsDoc = this.customerDocumentsColumns;
  //sourceViewforDocumentList: any = [];
  sourceViewforDocument: any = [];
  sourceViewforDocumentAudit: any = [];
  isEditButton: boolean = false;
  documentInformation = {
    docName: '',
    docMemo: '',
    docDescription: '',
    attachmentDetailId: 0
  }
  allDocumentListOriginal: any = [];
  selectedRowForDelete: any;
  rowIndex: number;
  disabledPartNumber: boolean = false;


  ngOnInit() {
    // this.sourcePublication.expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    this.getGlobalDateFormat();
    // this.itemMasterId = this._actRoute.snapshot.params['id'];
    this.publicationRecordId = this._actRoute.snapshot.params['id'];
    this.sourcePublication.sequence = 1;
    if (!this.isEditMode) {
      this.sourcePublication.revisionNum = 1;
    }
    this.getAllEmployeeList();
    this.getAllIntegrations();
    this.getFileTagTypesList();
    this.getPublishedByModulesList();

    if (this.publicationRecordId) {
      this.isEnableNext = true;
      this.isEditMode = true;
      this.isDisabledSteps = true;
      this.getPublicationDataonEdit();

      //get PN mapping edit mode
      this.publicationService
        .getPublicationPNMapping(this.publicationRecordId)
        .subscribe(res => {
          this.pnMappingList = res.map(x => {
            return {
              ...x,
              partNumber: x.partNumber,
              partDescription: x.partDescription,
              itemClassification: x.itemClassification,
              manufacturer: x.manufacturerName
            };
          });
        });

      //get aircraft info edit mode
      this.getAircraftInformationByPublicationId();

      //get atachapter edit mode
      this.getAtaChapterByPublicationId();
      this.getFilesByPublicationId();
      this.toGetDocumentsListNew(this.publicationRecordId);
    }

  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : '';
  }
  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize)
  }
  getGlobalDateFormat() {
    const globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
    // this.globalFormatDate =  new Intl.DateTimeFormat(globalSettings.cultureName).format(new Date())
    this.globalFormatDate = moment.localeData(globalSettings.cultureName).longDateFormat('L')
  }

  getPublicationTypes() {
    this.commonService.smartDropDownList('PublicationType', 'PublicationTypeId', 'Name').subscribe(res => {
      this.publicationTypes = res;
    });
  }

  async getAllIntegrations() {
    if (this.arrayIntegrationlist.length == 0) {
      this.arrayIntegrationlist.push(0);
    }
    await this.commonService.autoSuggestionSmartDropDownList('PublicationType', 'PublicationTypeId', 'Name', '', true, 100, this.arrayIntegrationlist.join()).subscribe(res => {
      this.publicationTypes = res.map(x => {
        return {
          label: x.label, value: x.value
        }
      })
    }, error => this.saveFailedHelper(error));
  }

  PNMappingPageIndexChange(event) {
    this.pnMappingPageSize = event.rows;
  }
  aircraftPageIndexChange(event) {
    this.aircraftPageSize = event.rows;
  }
  ataPageIndexChange(event) {
    this.ataPageSize = event.rows;
  }


  async getPublicationDataonEdit() {
    await this.publicationService.getAllbyIdPublications(this.publicationRecordId).subscribe(res => {

      const responseData = res;
      //this.sourcePublication = res[0];
      const tempsourcepub =  //responseData[0]
        responseData.map(x => {
          x.locationId = { label: x.location, value: x.locationId };
          x.publishedByRefId = { label: x.publishedByRefName, value: x.publishedByRefId };
          //   if (x.revisionDate != null) {
          //       x.revisionDate= new Date(x.revisionDate);
          // }  if (x.expirationDate != null) {
          //       x.expirationDate= new Date(x.expirationDate);
          // }  if (x.nextReviewDate != null) {
          //       x.nextReviewDate= new Date(x.nextReviewDate);
          // }
          return {
            ...x,
            entryDate: new Date(x.entryDate),
            verifiedDate: new Date(x.verifiedDate),
            revisionDate: new Date(x.revisionDate),
            expirationDate: new Date(x.expirationDate),
            nextReviewDate: new Date(x.nextReviewDate)
          }
        });
      //this.sourcePublication = tempsourcepub[0];
      // const tempSourcePublication = tempsourcepub.map(x => {
      //   return {
      //     ...x,
      //     publicationType: getValueFromArrayOfObjectById('label', 'value', x.publicationTypeId.toString(), this.publicationTypes),
      //   }
      // });


      this.sourcePublication = tempsourcepub[0];
      this.arrayIntegrationlist.push(this.sourcePublication.publicationTypeId);
      this.getAllIntegrations();
      this.publicationType = getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.publicationTypeId, this.publicationTypes);


      // this.attachmentList = this.sourcePublication.attachmentDetails || [];
      // if(this.attachmentList.length > 0){
      //   for(let i=0; i<this.attachmentList.length; i++){
      //     this.attachmentList[i]['isFileFromServer'] = true;
      //   }
      // }



    })
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
  closeModal() {
    this.viewAircraftData = {};
    if (this.modal) {
      this.modal.close()
    }
  }
  addNewRecord() {
    this.route.navigate(['/singlepages/singlepages/app-create-publication'])
    // this.changeOfTab(value)
    this.currentTab = 'General';
    this.activeMenuItem = 1;
    this.formData = new FormData();
    this.sourcePublication = {};
    this.isEnableNext = false;
    this.sourcePublication.entryDate = new Date();
    this.publicationRecordId = null;
    this.sourcePublication.sequence = 1;
    this.sourcePublication.revisionNum = 1;
  }
  changeOfTab(value) {
    if (value === 'General') {
      this.currentTab = 'General';
      this.activeMenuItem = 1;
      this.formData = new FormData();
      this.getFilesByPublicationId();

    } else if (value === 'PnMap') {
      this.currentTab = 'PnMap';
      this.activeMenuItem = 2;
      this.getPartNumberList();
    } else if (value === 'Aircraft') {
      this.currentTab = 'Aircraft';
      this.activeMenuItem = 3;
      this.getAllAircraftManufacturer();
      this.getAllAircraftModels();
      this.getAllDashNumbers();
    } else if (value === 'Atachapter') {
      this.currentTab = 'Atachapter';
      this.activeMenuItem = 4;
      this.getAllATAChapter();
      this.getAllSubChapters();

    }

  }
  saveTab(val) {
    this.alertService.showMessage(
      'Success',
      'Saved ' + val + ' Info Successfully',
      MessageSeverity.success
    );
    if (val == "Atachapter") {
      this.route.navigate(['/singlepages/singlepages/app-publication'])
    }
  }



  async getAllEmployeeList() {
    this.commonService.smartDropDownList('Employee', 'employeeId', 'firstName').subscribe(res => {
      this.employeeList = res;
      // this.employeeList = [{ label: 'Select Employee', value: null }, ...this.employeeList]
    })
    // await this.employeeService.getEmployeeList().subscribe(res => {
    //   const responseData = res[0];
    //   this.employeeList = responseData.map(x => {
    //     return {
    //       label: x.firstName,
    //       value: x.employeeId
    //     };
    //   });
    //   this.employeeList = [{ label: 'Select Employee', value: null }, ...this.employeeList]
    // });
  }
  private saveSuccessHelper(role?: any) {
    this.isSaving = false;
    this.alertService.showMessage(
      'Success',
      `Action was created successfully`,
      MessageSeverity.success
    );

    // this.loadData();
  }
  private saveFailedHelper(error: any) {
    this.isSaving = false;
    this.formData = new FormData();

    // this.alertService.stopLoadingMessage();
    // this.alertService.showStickyMessage(
    //   'Save Error',
    //   'The below errors occured whilst saving your changes:',
    //   MessageSeverity.error,
    //   error
    // );
    this.alertService.showStickyMessage('Already exist', error.error, MessageSeverity.error);
  }
  // onSelect(event) {
  //   //Execute the actual UPDATES here.
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //     //this.fileupload..push(file);
  //   }
  //   this.selectedFile = <File>event.target.files[0];
  // }

  // onUpload(event) {
  //   for (let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  // }

  // postMethod(event) {
  //   if (this.sourcePublication.docpath != '') {
  //     let formData = new FormData();
  //     formData.append('image', this.selectedFile, event.files.name);
  //     this.http.post('~/upload', formData).subscribe(val => { });
  //   }
  // }

  // uploadProfile(event) {
  //   const fileSizeinMB = event.target.files[0].size / (1024 * 1000);
  //   const size = Math.round(fileSizeinMB * 100) / 100;
  //   if (!this.imageFormats.includes(event.target.files[0].type)) {
  //     this.fileError = true;
  //     this.fileErrorMessage = 'Image files only';
  //     // this.myInputVariable.nativeElement.value = '';
  //   } else if (size > 2) {
  //     this.fileError = true;
  //     this.fileErrorMessage = 'File size cannot be greater than 2 MB.';
  //   } else {
  //     this.fileError = false;
  //     if (event.target.files && event.target.files[0]) {
  //       this.uploadImage = event.target.files[0];
  //       const reader: any = new FileReader();
  //       reader.readAsDataURL(event.target.files[0]);
  //       // tslint:disable-next-line:no-shadowed-variable
  //       reader.onload = event => {
  //         this.image = event.target.result;
  //       };
  //     }
  //   }

  // publicationFileUpload(event){
  //   for(let file of event.files) {
  //     this.uploadedFiles.push(file);
  //   }
  // }
  //fileUpload(event) {

  //  if (event.files.length === 0){
  //    return this.disableFileAttachmentSubmit = true;
  //  } else {
  //     this.disableFileAttachmentSubmit = false;
  //  }

  //  const filesSelectedTemp = [];
  //  for (let file of event.files){
  //    filesSelectedTemp.push({
  //      tagType: getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.tagTypeId.toString(), this.fileTagTypesList),
  //      link: file.objectURL, 
  //      fileName: file.name, 
  //      isFileFromServer: false
  //    })

  //    this.formData.append(this.sourcePublication.tagTypeId, file);

  //  }
  //  this.selectedFileAttachment = {
  //    tagTypeId: this.sourcePublication.tagTypeId,
  //    tagTypeName: getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.tagTypeId.toString(), this.fileTagTypesList),
  //    attachmentDetails: filesSelectedTemp
  //  }


  //}

  saveGeneralInfo() {
    this.data = this.sourcePublication;
    this.data.employeeId = this.data.employeeId ? this.data.employeeId : 0;
    this.publicationType = getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.publicationTypeId.toString(), this.publicationTypes);

    if (this.data.publishedById == null || this.data.publishedById == "null") {
      this.data.publishedById = 0;
    }
    this.formData.append('entryDate', moment(this.data.entryDate).format('DD/MM/YYYY'));
    this.formData.append('publicationId', this.data.publicationId);
    this.formData.append('description', this.data.description);
    this.formData.append('publicationTypeId', this.data.publicationTypeId);
    this.formData.append('asd', this.data.asd);
    this.formData.append('sequence', this.data.sequence);
    this.formData.append('publishedById', this.data.publishedById);
    if (this.data.publishedById == 2 || this.data.publishedById == 3) {
      this.formData.append('publishedByRefId', this.data.publishedByRefId.value);
    } else {
      this.formData.append('publishedByRefId', null);
    }
    // this.formData.append('publishedByRefId', this.data.publishedByRefId.value ? this.data.publishedByRefId.value : null);
    this.formData.append('publishedByOthers', this.data.publishedByOthers);
    this.formData.append('locationId', this.data.locationId.value);
    if (this.data.revisionDate) {
      this.formData.append('revisionDate', moment(this.data.revisionDate).format('DD/MM/YYYY'));
    } else {
      this.formData.append('revisionDate', null);
    }
    if (this.data.expirationDate) {
      this.formData.append('expirationDate', moment(this.data.expirationDate).format('DD/MM/YYYY'));
    } else {
      this.formData.append('expirationDate', null);
    }
    if (this.data.nextReviewDate) {
      this.formData.append('nextReviewDate', moment(this.data.nextReviewDate).format('DD/MM/YYYY'));
    } else {
      this.formData.append('nextReviewDate', null);
    }
    if (this.data.verifiedDate) {
      this.formData.append('verifiedDate', moment(this.data.verifiedDate).format('DD/MM/YYYY'));
    } else {
      this.formData.append('verifiedDate', null);
    }
    //this.formData.append('revisionNum', this.data.revisionNum);
    this.formData.append('employeeId', this.data.employeeId);
    this.formData.append('verifiedStatus', this.data.verifiedStatus ? this.data.verifiedStatus : false);
    this.formData.append('verifiedBy', this.data.verifiedBy);
    this.formData.append('masterCompanyId', this.data.masterCompanyId);
    this.formData.append('CreatedBy', this.userName);
    this.formData.append('UpdatedBy', this.userName);
    this.formData.append('IsActive', 'true');
    this.formData.append('IsDeleted', 'false');
    if (!this.isEditMode) {
      this.formData.append('revisionNum', this.data.revisionNum);
    }
    this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));


    if (this.sourcePublication.PublicationId != '' && this.publicationRecordId == null) {
      this.generalInformationDetails = this.sourcePublication;

      {
        this.sourcePublication.PublicationId = this.sourcePublication.PublicationId;
        this.publicationService
          .newAction(this.formData
            //   {
            //   ...this.sourcePublication, CreatedBy: this.userName,
            //   UpdatedBy: this.userName,
            //   IsActive: true,
            //   IsDeleted: false,
            // }

          )
          .subscribe(res => {
            this.isEnableNext = true;
            this.alertService.showMessage("Success", `Publication saved Successfully`, MessageSeverity.success);
            const { publicationRecordId } = res;
            this.publicationRecordId = publicationRecordId,
              // this.changeOfTab('PnMap'),
              role => this.saveSuccessHelper(role),
              error => this.saveFailedHelper(error);
          }, error => this.saveFailedHelper(error));
      }
    }
    //  else {
    //   this.changeOfTab('PnMap');
    // }

    if (this.isEditMode) {
      // if(!this.sourcePublication.revisionNum) {
      this.updatePublicationGeneralInfo();
      // }
    }
  }
  addFileTagsToPublication() {
    if (this.attachmentList.length > 0) {
      const indexOfSelectedFile = this.attachmentList.findIndex(o => o.tagTypeId === this.selectedFileAttachment.tagTypeId);
      if (indexOfSelectedFile != -1) {
        for (let i = 0; i < this.selectedFileAttachment.attachmentDetails.length; i++) {
          this.attachmentList[indexOfSelectedFile].attachmentDetails.push(this.selectedFileAttachment.attachmentDetails[i])
        }
      }
      else {
        this.attachmentList = [...this.attachmentList, this.selectedFileAttachment]
      }
    } else {
      this.attachmentList = [...this.attachmentList, this.selectedFileAttachment]
    }

    this.sourcePublication.tagTypeId = null;
    if (this.tagsFileUploadInput) {
      this.tagsFileUploadInput.clear()
    }
    this.disableFileAttachmentSubmit = true;
  }

  updatePublicationGeneralInfo() {
    this.formData.append('publicationRecordId', this.publicationRecordId);
    this.publicationService
      .updateAction(this.formData)
      .subscribe(res => {
        this.isEnableNext = true;
        // const { publicationRecordId } = res;
        // this.publicationRecordId = publicationRecordId;
        this.getFilesByPublicationId();
        // this.changeOfTab('PnMap'),
        this.formData = new FormData(),
          this.alertService.showMessage("Success", `Publication Updated Successfully`, MessageSeverity.success),
          role => this.saveSuccessHelper(role),
          error => this.saveFailedHelper(error);
      });
  }

  changeRevisionNum(value) {
    if (value === 'Yes') {
      this.data.revisionNum = this.data.revisionNum + 1;
      this.formData.append('revisionNum', this.data.revisionNum);
      this.updatePublicationGeneralInfo();
    }
    if (value === 'No') {
      this.formData.append('revisionNum', this.data.revisionNum);
      this.updatePublicationGeneralInfo();
    }
  }
  // private loadCustomerClassifiData() { }
  // private onDataLoadClassifiSuccessful(
  //   getCustomerClassificationList: CustomerClassification[]
  // ) { }

  // get PartNumbers
  async getPartNumberList() {
    await this.itemMasterService.getPrtnumberslistList().subscribe(list => {
      const responseData = list[0];

      this.partNumberList = responseData.map(x => {
        return {
          label: x.partNumber,
          value: x
        };
      });
    });
  }

  openModelPopups(partNumberList) {
    if (partNumberList.length > 0) {
      this.disabledPartNumber = true;
    } else {
      this.disabledPartNumber = false;
    }
  }

  savePNMapping() {
    const mapData = this.selectedPartNumbers.map(obj => {
      return {
        PublicationRecordId: this.publicationRecordId,
        PublicationId: this.generalInformationDetails.PublicationId,
        //PublicationId: this.isEditMode ?  : this.generalInformationDetails.PublicationId,
        PartNumber: obj.partNumber,
        PartNumberDescription: obj.partDescription,
        ItemMasterId: obj.itemMasterId,
        ItemClassification:
          obj.itemClassification === null ? '-' : obj.itemClassification,
        ItemClassificationId: obj.itemClassificationId,
        manufacturer: obj.manufacturer === null ? '-' : obj.manufacturer,
        ItemGroupId: obj.itemGroupId == null ? 1 : obj.itemGroupId,
        CreatedBy: this.userName,
        UpdatedBy: this.userName,
        MasterCompanyId: obj.masterCompanyId,
        IsActive: true,
        IsDeleted: false,
        CreatedDate: new Date(),
        UpdatedDate: new Date()
      };
    });
    this.selectedPartNumbers = [];
    if (mapData && mapData.length > 0) {
      // PNMapping Save
      this.publicationService.postMappedPartNumbers(mapData).subscribe(res => {
        this.isDisabledSteps = true;
        this.publicationService
          .getPublicationPNMapping(this.publicationRecordId)
          .subscribe(res => {

            this.pnMappingList = res.map(x => {
              return {
                ...x,
                partNumber: x.partNumber,
                partDescription: x.partDescription,
                itemClassification: x.itemClassification,
                manufacturer: x.manufacturerName
              };
            });
            this.alertService.showMessage("Success", `PN Mapping Done Successfully`, MessageSeverity.success);
            this.getAircraftInformationByPublicationId();
            this.getAtaChapterByPublicationId();
          });


        // get aircraft mapped data by publication id
      }, error => {
        this.saveFailedHelper(error)
      });
    }
  }

  searchByFieldUrlCreateforAircraftInformation() {


    if (this.selectAircraftManfacturer.length > 0) {
      const aircraftTypeIds = this.selectAircraftManfacturer.reduce(
        (acc, value) => {
          return `${acc},${value}`;
        },
        ''
      );
      this.aircraftManfacturerIdsUrl = aircraftTypeIds.substr(1);
    } else {
      this.aircraftManfacturerIdsUrl = '';
    }
    if (this.selectedAircraftModel.length > 0) {
      const aircraftModelIds = this.selectedAircraftModel.reduce((acc, id) => {
        return `${acc},${id}`;
      }, '');
      this.aircraftModelsIdUrl = aircraftModelIds.substr(1);
    } else {
      this.aircraftModelsIdUrl = '';
    }
    if (this.selectedDashNumbers.length > 0) {
      const dashNumberIds = this.selectedDashNumbers.reduce((acc, id) => {
        return `${acc},${id}`;
      }, '');
      this.dashNumberIdUrl = dashNumberIds.substr(1);
    } else {
      this.dashNumberIdUrl = '';
    }
  }

  // get All
  getAllAircraftManufacturer() {
    this.aircraftManufacturerService
      .getAll()
      .subscribe(aircraftManufacturer => {
        this.showModelAircraftModel = false;
        const responseData = aircraftManufacturer[0];
        this.airCraftTypesList = responseData.map(x => {
          return {
            value: x.aircraftTypeId,
            label: x.description
          };
        });
      });
  }
  // get all Aircraft Models
  getAllAircraftModels() {
    this.aircraftModelService.getAll().subscribe(models => {
      const responseValue = models[0];
      this.aircraftModelList = responseValue.map(models => {
        return {
          label: models.modelName,
          value: models.aircraftModelId
        };
      });
    });
  }

  //  deleteAttachmentRow(rowdata, index){
  //    this.attachmentList.splice(index, 1)
  //    // this.publicationService.deleteItemMasterMapping(this.selectedRowforDelete.publicationItemMasterMappingId).subscribe(() => {
  //    this.publicationService.deletepublicationtagtype(rowdata.tagTypeMappingId).subscribe(() => {
  //      this.alertService.showMessage(
  //        'Success',
  //        `Deleted Attachment  Successfully`,
  //        MessageSeverity.success
  //      );
  //    })

  //}


  // get all dashnumber
  getAllDashNumbers() {
    this.Dashnumservice.getAll().subscribe(dashnumbers => {
      const responseData = dashnumbers[0];
      this.dashNumberList = responseData.map(dashnumbers => {
        return {
          label: dashnumbers.dashNumber,
          value: dashnumbers.dashNumberId
        };
      });
    });
  }

  // get aircraft information by publication id

  getAircraftInformationByPublicationId() {
    this.publicationService
      .getAircraftMappedByPublicationId(this.publicationRecordId)
      .subscribe(res => {
        this.pnAircraftData = [];
        this.aircraftList = res.map(x => {
          this.pnAircraftData.push({
            label: x.partNumber, value: x.partNumber
          })
          return {
            ...x,
            aircraft: x.aircraftType,
            model: x.aircraftModel,
            dashNumber: x.dashNumber,
            //memo: x.memo
          };
        });
      });
  }

  // get AircraftModels By manufacturer Type
  async getAircraftModelByManfacturerType() {
    // construct url from array
    await this.searchByFieldUrlCreateforAircraftInformation();
    // reset the dropdowns
    this.selectedAircraftModel = []
    this.selectedDashNumbers = []
    this.aircraftModelList = []
    this.dashNumberList = []
    // checks where multi select is empty or not and calls the service
    if (this.aircraftManfacturerIdsUrl !== '') {
      this.aircraftModelService
        .getAircraftModelListByManufactureId(this.aircraftManfacturerIdsUrl)
        .subscribe(models => {
          const responseValue = models[0];
          this.aircraftModelList = responseValue.map(models => {
            return {
              label: models.modelName,
              value: models.aircraftModelId
            };
          });
        });
    } else {
      this.getAllAircraftModels();
      this.getAllDashNumbers();
    }


  }


  async getDashNumberByManfacturerandModel() {
    // construct url from array
    await this.searchByFieldUrlCreateforAircraftInformation();
    // reset dropdown
    this.selectedDashNumbers = []
    this.dashNumberList = []
    // checks where multi select is empty or not and calls the service

    if (this.aircraftManfacturerIdsUrl !== '' && this.aircraftModelsIdUrl !== '') {
      this.Dashnumservice.getDashNumberByModelTypeId(
        this.aircraftModelsIdUrl,
        this.aircraftManfacturerIdsUrl
      ).subscribe(dashnumbers => {
        const responseData = dashnumbers;
        this.dashNumberList = responseData.map(dashnumbers => {
          return {
            label: dashnumbers.dashNumber,
            value: dashnumbers.dashNumberId
          };
        });
      });
    }
  }

  async searchAircraftInformation() {
    await this.searchByFieldUrlCreateforAircraftInformation();

    this.searchParams = '';

    // checks where multi select is empty or not and calls the service
    if (
      this.aircraftManfacturerIdsUrl !== '' &&
      this.aircraftModelsIdUrl !== '' &&
      this.dashNumberIdUrl !== '' && this.selectedAircraftPartNumber !== ""
    ) {
      this.searchParams = `aircrafttypeid=${
        this.aircraftManfacturerIdsUrl
        }&aircraftmodelid=${this.aircraftModelsIdUrl}&dashNumberId=${
        this.dashNumberIdUrl}&partNumber=${
        this.selectedAircraftPartNumber}`;
    }
    // search only by manfacturer and Model and  publicationId
    else if (
      this.aircraftManfacturerIdsUrl !== '' &&
      this.aircraftModelsIdUrl !== ''
    ) {
      this.searchParams = `aircrafttypeid=${
        this.aircraftManfacturerIdsUrl
        }&aircraftmodelid=${this.aircraftModelsIdUrl}`;
    } else if (this.aircraftManfacturerIdsUrl !== '') {
      this.searchParams = `aircrafttypeid=${this.aircraftManfacturerIdsUrl}`;
    }
    // search only by model and publicationId
    else if (this.aircraftModelsIdUrl !== '') {
      this.searchParams = `aircraftmodelid=${this.aircraftModelsIdUrl}`;
    }
    // search only by dashNumber and publicationId
    else if (this.dashNumberIdUrl !== '') {
      this.searchParams = `&dashNumberId=${this.dashNumberIdUrl}`;
    }
    else if (this.selectedAircraftPartNumber !== '') {
      this.searchParams = `&partNumber=${this.selectedAircraftPartNumber}`;
    }
    this.publicationService
      .aircraftInformationSearch(this.searchParams, this.publicationRecordId)
      .subscribe(res => {
        const responseData: any = res;
        this.aircraftList = responseData.map(x => {
          return {
            ...x,
            aircraft: x.aircraftType,
            model: x.aircraftModel,
            dashNumber: x.dashNumber,
            memo: x.memo
          };
        })
      });
    // this.selectAircraftManfacturer = [];
    // this.selectedAircraftModel = [];
    // this.selectedDashNumbers = [];
  }

  // get atachapter by publication id

  getAtaChapterByPublicationId() {
    this.publicationService
      .getAtaMappedByPublicationId(this.publicationRecordId)
      .subscribe(res => {
        this.pnData = []
        const responseData = res;
        this.ataList = responseData.map(x => {
          this.pnData.push({
            label: x.partNumber, value: x.partNumber
          })
          return {
            ...x,
            ataChapter: `${x.ataChapterCode} - ${x.ataChapterName}`,
            ataSubChapter: `${x.ataSubChapterCode} - ${x.ataSubChapterDescription}`,
            //ataChapterCode: x.ataChapterCode,
            //ataSubChapterCode: x.ataSubChapterCode,
            //ataSubChapterId: x.ataSubChapterId,
            //ataChapterId: x.ataChapterId
          };

        });
      });
  }

  // ata search by publication id

  searchByFieldUrlCreateforATA() {

    if (this.selectedATAchapter.length > 0) {
      const ataIds = this.selectedATAchapter.reduce((acc, value) => {
        return `${acc},${value}`;
      }, '');
      this.ataChapterIdUrl = ataIds.substr(1);
    } else {
      this.ataChapterIdUrl = '';
    }
    if (this.selectedATASubChapter.length > 0) {
      const ataSubchapterIds = this.selectedATASubChapter.reduce((acc, id) => {
        return `${acc},${id}`;
      }, '');
      this.ataSubchapterIdUrl = ataSubchapterIds.substr(1);
    } else {
      this.ataSubchapterIdUrl = '';
    }
  }

  multiSelectMaxLengthAlert() {
    if (this.selectedAircraftModel.length >= 30) {
      alert('You have Selected Max Number of Models');
    }
    if (this.selectedDashNumbers.length >= 30) {
      alert('You have Selected Max Number of DashNumbers');
    }

  }

  // get ata chapter for dropdown
  getAllATAChapter() {
    this.ataMainSer.getAtaMainList().subscribe(Atachapter => {
      const response = Atachapter[0];
      this.ataChapterList = response.map(x => {
        return {
          value: x.ataChapterId,
          label: x.ataChapterName
        };
      });
    });
  }
  // get all subchapter for dropdown
  getAllSubChapters() {
    this.atasubchapter1service
      .getAtaSubChapter1List()
      .subscribe(atasubchapter => {
        const responseData = atasubchapter[0];
        this.ataSubChapterList = responseData.map(x => {
          return {
            label: x.description,
            value: x.ataSubChapterId
          };
        });
      });
  }

  getSubChapterByATAChapter() {
    this.searchByFieldUrlCreateforATA();

    if (this.ataChapterIdUrl !== '') {
      this.ataMainSer
        .getMultiATASubDesc(this.ataChapterIdUrl)
        .subscribe(atasubchapter => {

          const responseData = atasubchapter;

          this.ataSubChapterList = responseData.map(x => {
            return {
              label: x.description,
              value: x.ataSubChapterId
            };
          });
        });

    } else {
      this.getAllSubChapters();
    }
  }

  async searchATA() {
    await this.searchByFieldUrlCreateforATA();
    this.searchATAParams = '';
    // checks where multi select is empty or not and calls the service
    if (this.ataChapterIdUrl !== '' && this.ataSubchapterIdUrl !== '' && this.selectedPartNumber !== '') {
      this.searchATAParams = `ATAChapterId=${
        this.ataChapterIdUrl
        }&ATASubChapterID=${this.ataSubchapterIdUrl}&partNumber=${this.selectedPartNumber}`;
    }
    else if (this.ataChapterIdUrl !== '') {
      this.searchATAParams = `ATAChapterId=${this.ataChapterIdUrl}`;
    }
    else if (this.ataSubchapterIdUrl !== '') {
      this.searchATAParams = `ATASubChapterID=${this.ataSubchapterIdUrl}`;
    }
    else if (this.selectedPartNumber !== '') {
      this.searchATAParams = `partNumber=${this.selectedPartNumber}`;
    }
    this.publicationService
      .searchgetATAMappedByMultiSubChapterId(
        this.searchATAParams,
        this.publicationRecordId
      )
      .subscribe(res => {
        this.ataList = res.map(x => {
          return {
            ...x,
            ataChapter: `${x.ataChapterCode} - ${x.ataChapterName}`,
            ataSubChapter: `${x.ataSubChapterCode} - ${x.ataSubChapterDescription}`,
            //ataSubChapterId: x.ataSubChapterId,
            //ataChapterId: x.ataChapterId
          };
        });
      });
    // this.selectedATAchapter = [];
    // this.selectedATASubChapter = [];
  }

  onDeletePNMappingRow(rowData) {
    this.selectedRowforDelete = rowData;
  }

  deleteConformation(value) {
    if (value === 'Yes') {
      this.publicationService.deleteItemMasterMapping(this.selectedRowforDelete.publicationItemMasterMappingId).subscribe(() => {
        this.publicationService
          .getPublicationPNMapping(this.publicationRecordId)
          .subscribe(res => {
            this.pnMappingList = res.map(x => {
              return {
                ...x,
                partNumber: x.partNumber,
                partNumberDescription: x.partNumberDescription,
                itemClassification: x.itemClassification,
                manufacturer: x.manufacturer
              };
            });
            this.getAtaChapterByPublicationId();
            this.getAircraftInformationByPublicationId();
          });
        this.alertService.showMessage(
          'Success',
          `Deleted PN Mapping Successfully`,
          MessageSeverity.success
        );
      })
    } else {
      this.selectedRowforDelete = undefined;
    }
  }

  downloadFileUpload(link) {
    const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
    window.location.assign(url);
  }

  //added supriya
  dismissModelNew() {

    this.isEditMode = false;
    this.modal.close();
  }

  addDocumentDetails() {
    // this.sourceViewforDocumentList = [];
    this.selectedFileAttachment = [];
    this.index = 0;
    this.disableFileAttachmentSubmit = false;

    this.isEditButton = false;
    this.sourcePublication.tagTypeId = null;
    this.documentInformation = {

      docName: '',
      docMemo: '',
      docDescription: '',
      attachmentDetailId: 0
    }
  }
  dismissDocumentPopupModel(type) {
    this.fileUploadInput.clear();
    this.closeMyModel(type);
  }
  closeMyModel(type) {
    $(type).modal("hide");
    this.disableSave = true;
  }

  downloadFileUploadNew(link) {
    const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
    window.location.assign(url);
  }

  fileUpload(event) {
    if (event.files.length === 0) {
      this.disableFileAttachmentSubmit = false;
    } else {
      this.disableFileAttachmentSubmit = true;
    }


    const filesSelectedTemp = [];
    this.selectedFileAttachment = [];
    for (let file of event.files) {
      var flag = false;
      for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
        if (this.sourceViewforDocumentList[i].fileName == file.name && this.sourceViewforDocumentList[i].tagType == this.sourcePublication.tagTypeId) {
          flag = true;
          this.alertService.showMessage(
            'Duplicate',
            `Already Exists this file `,
            MessageSeverity.warn
          );
          this.disableFileAttachmentSubmit = false;
          if (this.fileUploadInput) {
            this.fileUploadInput.clear()
          }

        }

      }
      if (!flag) {

        filesSelectedTemp.push({
          link: file.objectURL,
          fileName: file.name,
          isFileFromServer: false,
          fileSize: file.size,
        })


        this.formData.append(file.name, file);
      }
    }

    for (var i = 0; i < filesSelectedTemp.length; i++) {
      this.selectedFileAttachment.push({

        docName: this.documentInformation.docName,
        docMemo: this.documentInformation.docMemo,
        docDescription: this.documentInformation.docDescription,
        createdBy: this.userName,
        updatedBy: this.userName,
        link: filesSelectedTemp[i].link,
        fileName: filesSelectedTemp[i].fileName,
        fileSize: filesSelectedTemp[i].fileSize,
        tagType: this.sourcePublication.tagTypeId,//getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.tagTypeId.toString(), this.fileTagTypesList),

        isFileFromServer: false,
        attachmentDetailId: 0,

      })

      // attachmentDetails: filesSelectedTemps

    }



  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
  removeFile(event) {
    //this.formData.delete(event.file.name)
  }

  enableSave() {
    this.disableSave = false;
  }

  addDocumentInformation(type, documentInformation) {
    if (this.selectedFileAttachment != []) {
      for (var i = 0; i < this.selectedFileAttachment.length; i++) {
        this.sourceViewforDocumentList.push({

          docName: documentInformation.docName,
          docMemo: documentInformation.docMemo,
          docDescription: documentInformation.docDescription,
          link: this.selectedFileAttachment[i].link,
          fileName: this.selectedFileAttachment[i].fileName,
          isFileFromServer: false,
          attachmentDetailId: 0,
          createdBy: this.userName,
          updatedBy: this.userName,
          createdDate: Date.now(),
          updatedDate: Date.now(),
          tagType: this.sourcePublication.tagTypeId,//getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.tagTypeId.toString(), this.fileTagTypesList),
          tagTypeName: getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.tagTypeId.toString(), this.fileTagTypesList),

          fileSize: ((this.selectedFileAttachment[i].fileSize) / (1024 * 1024)).toFixed(2),
        })
      }
    }

    if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
      for (var i = 0; i <= this.sourceViewforDocumentList.length; i++) {
        if (this.sourceViewforDocumentList[i].attachmentDetailId > 0) {

          if (this.sourceViewforDocumentList[i].attachmentDetailId == documentInformation.attachmentDetailId) {

            this.sourceViewforDocumentList[i].docName = documentInformation.docName;
            this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
            this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
            break;

          }
        }
        else {
          if (i == this.index) {
            this.sourceViewforDocumentList[i].docName = documentInformation.docName;
            this.sourceViewforDocumentList[i].docMemo = documentInformation.docMemo;
            this.sourceViewforDocumentList[i].docDescription = documentInformation.docDescription;
            this.sourceViewforDocumentList[i].tagTypeName = getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.tagTypeId.toString(), this.fileTagTypesList);
            break;
          }
        }
      }

      this.index = 0;
      this.isEditButton = false;
      this.disableFileAttachmentSubmit == true;;
      this.dismissDocumentPopupModel(type)
    }
    this.dismissDocumentPopupModel(type)
    this.sourceViewforDocumentList = [...this.sourceViewforDocumentList]
    if (this.sourceViewforDocumentList.length > 0) {
      this.totalRecordNew = this.sourceViewforDocumentList.length;
      this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
    }
    this.index = 0;
    this.isEditButton = false;
    this.disableFileAttachmentSubmit == true;;
    this.alertService.showMessage(
      'Success',
      `Sucessfully Attached document`,
      MessageSeverity.success
    );
    if (this.fileUploadInput) {
      this.fileUploadInput.clear()
    }
  }

  onClickMemo() {
    this.memoPopupContent = this.documentInformation.docMemo;
    this.enableSave();
    this.disableSaveMemo = true;
    //this.memoPopupValue = value;
  }
  enableSaveMemo() {
    this.disableSaveMemo = false;
  }
  closeDeleteModal() {
    $("#downloadPublicationConfirmation").modal("hide");
  }
  closeDeleteAircraftModal() {
    $("#downloadAircraftConfirmation").modal("hide");
  }
  closeDeleteAtaModal() {
    $("#downloadAtaConfirmation").modal("hide");
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

  onClickPopupSave() {
    this.documentInformation.docMemo = this.memoPopupContent;
    this.memoPopupContent = '';
    $('#memo-popup-Doc').modal("hide");
  }

  closeMemoModel() {
    $('#memo-popup-Doc').modal("hide");
  }

  editCustomerDocument(rowdata, index = 0) {
    this.selectedFileAttachment = [];
    this.isEditButton = true;
    this.index = index;
    this.sourcePublication.tagTypeId = rowdata.tagType;
    this.documentInformation = rowdata;
    if (rowdata.attachmentDetailId > 0) {
      this.toGetDocumentView(rowdata.attachmentDetailId);
    }
    else {
      this.sourceViewforDocument = rowdata;

    }
    //  this.toGetDocumentView(rowdata.attachmentDetailId);

  }
  deleteAttachmentRow(rowdata, index, content) {
    this.selectedRowForDelete = rowdata;
    this.rowIndex = index;
    this.modal = this.modalService.open(content, { size: 'sm' });
    this.modal.result.then(() => {
    }, () => { })
  }
  deleteItemAndCloseModelNew() {
    let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
    if (attachmentDetailId > 0) {
      this.commonService.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe(res => {
        this.toGetDocumentsListNew(this.publicationId);
        this.alertService.showMessage(
          'Success',
          `Deleted Attachment  Successfully`,
          MessageSeverity.success
        );
        // })
      })
    }
    else {
      this.sourceViewforDocumentList.splice(this.rowIndex, 1)
      this.totalRecordNew = this.sourceViewforDocumentList.length;
      this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);

    }

    this.modal.close();
  }


  onUploadDocumentListNew() {
    // file upload
    const vdata = {
      referenceId: this.publicationId,
      masterCompanyId: 1,
      createdBy: this.userName,
      updatedBy: this.userName,
      moduleId: 5,
      //docName: this.sourceViewforDocumentList[0].docName,
    }
    for (var key in vdata) {
      this.formData.append(key, vdata[key]);
    }
    this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));




    //        if (this.selectedFileAttachment.length > 0) {
    //            for (var i = 0; i < this.selectedFileAttachment.length; i++) {
    //                this.formData.append('Name[]', this.selectedFileAttachment[i].docName);
    //}
    //  }

    this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
      this.formData = new FormData();
      this.toGetDocumentsListNew(this.publicationId);
    });
    //./ file upload
  }

  toGetDocumentsListNew(id) {
    var moduleId = 5;
    this.publicationService.getFilesBypublicationNew(this.publicationRecordId).subscribe(res => {

      //this.commonService.GetDocumentsListNew(id, moduleId).subscribe(res => {
      this.sourceViewforDocumentList = res || [];
      this.allDocumentListOriginal = res;

      if (this.sourceViewforDocumentList.length > 0) {
        this.sourceViewforDocumentList.forEach(item => {
          item["isFileFromServer"] = true;

        })
      }
      this.totalRecordNew = this.sourceViewforDocumentList.length;
      this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);

    })
  }
  toGetDocumentView(id) {

    this.commonService.GetAttachment(id).subscribe(res => {
      this.sourceViewforDocument = res || [];
      // this.allCustomerFinanceDocumentsListOriginal = res;


    })
  }
  dateFilterForTableNew(date, field) {

    if (date !== '' && moment(date).format('MMMM DD YYYY')) {
      // this.sourceViewforDocumentList = this.allDocumentListOriginal;
      const data = [...this.sourceViewforDocumentList.filter(x => {

        if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
          return x;
        } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
          return x;
        }
      })]
      this.sourceViewforDocumentList = data;
    } else {
      this.sourceViewforDocumentList = this.allDocumentListOriginal;
    }

  }


  private onAuditHistoryLoadSuccessful(auditHistory, content) {
    this.alertService.stopLoadingMessage();


    this.sourceViewforDocumentAudit = auditHistory;

    this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.result.then(() => {
    }, () => { })
  }

  openHistory(content, rowData) {
    //const { customerShippingAddressId } = rowData.customerShippingAddressId;
    //const { customerShippingId } = rowData.customerShippingId;
    this.alertService.startLoadingMessage();

    this.commonService.GetAttachmentPublicationAudit(rowData.attachmentDetailId).subscribe(
      results => this.onAuditHistoryLoadSuccessful(results, content),
      error => this.saveFailedHelper(error));
  }
  getColorCodeForHistory(i, field, value) {
    const data = this.sourceViewforDocumentAudit;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if ((i + 1) === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value
      }
    }
  }




  // onDeletePNMappingRow(rowData) {
  //   this.publicationService.deleteItemMasterMapping(rowData.publicationItemMasterMappingId).subscribe(res => {
  //     this.publicationService
  //       .getPublicationPNMapping(this.publicationRecordId)
  //       .subscribe(res => {
  //         this.pnMappingList = res.map(x => {
  //           return {
  //             ...x,
  //             PartNumber: x.partNumber,
  //             PartNumberDescription: x.partNumberDescription,
  //             ItemClassification: x.itemClassification
  //           };
  //         });        
  //       });
  //   })
  // }



  //   getValueFromArrayOfObjectById(field: string, idField: string, id: string, originalData: any) {
  //     if ((field !== '' || field !== undefined) && (idField !== '' || idField !== undefined) && (id !== '' || id !== undefined) && (originalData !== undefined)) {
  //         const data = originalData.filter(x => {
  //             if (x[idField] === id) {
  //                 return x[field];
  //             }
  //         })
  //         return data;
  //     }
  // }
  enableDisableAdvancedSearchAta(val) {
    this.showAdvancedSearchCardAta = val;
    this.selectedATAchapter = [];
    this.selectedATASubChapter = [];
    this.selectedPartNumber = "";
    this.getAtaChapterByPublicationId();
  }
  enableDisableAdvancedSearchAircraft(val) {
    this.showAdvancedSearchCardAircraft = val;
    this.selectAircraftManfacturer = [];
    this.selectedAircraftModel = [];
    this.selectedDashNumbers = []
    this.selectedAircraftPartNumber = "";
    this.getAircraftInformationByPublicationId();
  }
  getFileTagTypesList() {
    this.commonService.smartDropDownList('TagType', 'TagTypeID', 'Name').subscribe(res => {
      this.fileTagTypesList = res;
    });
  }
  async getGlocationsList(event) {
    // if(event.query.length < 2)
    // return false;
    await this.commonService.autoSuggestionSmartDropDownList('Location', 'LocationId', 'Name', event.query, false, DBkeys.AUTO_COMPLETE_COUNT_LENGTH).subscribe(res => {
      this.gLocationsList = res;
    });
  }


  getFilesByPublicationId() {

    this.publicationService.getFilesBypublication(this.publicationRecordId).subscribe(res => {
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
  getLocationNameById(event) {
    this.sourcePublication['location'] = this.sourcePublication.locationId.label
  }

  //Get Published By Modules List

  getPublishedByModulesList() {
    this.publicationService.getPublishedByModuleList().subscribe(res => {
      this.publishedByModulesList = res;
    });
  }
  getPublishedByReferencesList(event, id) {
    let tableName = "";
    let tableColumnId = "";
    let tableColumnName = "";
    if (id == 2) {
      tableName = "Vendor"
      tableColumnId = "VendorId";
      tableColumnName = "VendorName";
    } if (id == 3) {
      tableName = "Manufacturer"
      tableColumnId = "ManufacturerId";
      tableColumnName = "Name";
    }
    this.commonService.autoSuggestionSmartDropDownList(tableName, tableColumnId, tableColumnName, event.query, false, DBkeys.AUTO_COMPLETE_COUNT_LENGTH).subscribe(res => {
      this.publishedByReferences = res;
    });
  }
  changePublishedById() {
    this.sourcePublication.publishedByRefId = null;
    this.sourcePublication.publishedByOthers = "";
  }
  nextClick(nextOrPrevious) {
    this.nextOrPreviousTab = nextOrPrevious;
    let content = this.tabRedirectConfirmationModal;
    this.modal = this.modalService.open(content, { size: "sm" });
    this.modal.result.then(
      () => {
      },
      () => {
      }
    );


  }
  dismissModel() {
    this.modal.close();
  }
  redirectToTab() {
    this.dismissModel();
    // if(this.employeeService.isEditMode == true){
    this.changeOfTab('PnMap');
    // }else{

    // this.gotoNext();
    // }

  }

  clearValue() {}
}
// updatePublicationGeneralInfo