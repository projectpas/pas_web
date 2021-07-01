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
import { getObjectById, getValueFromArrayOfObjectById } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { DBkeys } from '../../../services/db-Keys';
import { error } from '@angular/compiler/src/util';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

import { AppModuleEnum } from './../../../enum/appmodule.enum';
declare var $: any;

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
    masterCompanyId: this.masterCompanyId,
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
  partNumberListOriginal = [];
  selectedPartNumbers = [];
  pnMappingList = [];
  publicationRecordId: any;
  employeeList: any = [];
  ataList = [];
  isSpinnerVisible = false;
  currentDeletedstatus = false;
  headersforPNMapping = [
    { field: 'partNumber', header: 'PN' },
    { field: 'partDescription', header: 'PN Description',width:"200px" },
    { field: 'manufacturer', header: 'Manufacturer' },
    { field: 'itemClassification', header: 'Item Classification' },
    { field: 'itemGroup', header: 'Item Group' }
  ];
  selectedPNmappingColumns = this.headersforPNMapping;

  aircraftManufacturerList: { label: string; value: number }[];
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
  moduleName: any = 'Publication';

  atacols = [
    { field: 'partNumber', header: 'PN Number' },
    { field: 'partDescription', header: 'PN Description',width:"200px" },
    { field: 'manufacturerName', header: 'Manufacturer' },
    { field: 'itemGroup', header: 'Item Group' },
    { field: 'ataChapter', header: 'ATA Chapter',width:"200px" },
    { field: 'ataSubChapter', header: 'ATA SubChapter' },
  ];
  selectedatacols = this.atacols;
  status = [
    { label: 'Select Status ', value: 'Select Status' },
    { label: 'Active', value: 'Active' },
    { label: 'In-Active', value: 'In-Active' }
  ];
  isEnableNext: any = false;
  formData = new FormData();
  currentDate=new Date();
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
  uploadDocs: Subject<boolean> = new Subject();
  selectedFileAttachment: any = {};
  disableFileAttachmentSubmit: boolean = true;
  publishedByModulesList: any = [];
  publishedByReferences: any = [];
  nextOrPreviousTab: any;
  arrayIntegrationlist: any[] = [];
  disableSave: boolean = true;

  aircraftInformationCols: any[] = [
    { field: 'partNumber', header: 'PN Number' },
    { field: 'partDescription', header: 'PN Description',width:"200px" },
    { field: 'manufacturerName', header: 'Manufacturer' },
    { field: 'itemGroup', header: 'Item Group' },
    { field: 'aircraft', header: 'Aircraft' },
    { field: 'model', header: 'Model',width:"100px" },
    { field: 'dashNumber', header: 'Dash Numbers',width:"100px" },
  ];
  selectedaircraftInformationCols = this.aircraftInformationCols;
  headersforAttachment = [
    { field: 'tagTypeName', header: 'Tag Type' }
  ];
  first: number = 0;
  index: number;
  @ViewChild('fileUploadInput', { static: false }) fileUploadInput: any;
  totalRecordNew: number = 0;
  pageSizeNew: number = 3;
  totalPagesNew: number = 0;
  sourceViewforDocumentList: any = [];
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
  disabledPartNumber: boolean = true;
  disableGeneralInfoSave: boolean = true;
  isView:boolean=true;
  isPNAdd:boolean=true;
  isDownload:boolean=true;
  isPNDelete:boolean=true;
  isPNUpdate:boolean=true;
  isAircraftDownload:boolean=true;
  isATADownload:boolean=true;
  isGeneralInfoAdd:boolean=true;
  isGeneralInfoUpdate:boolean=true;

  isNextVisible:Boolean=true;
  isPNNextVisible: Boolean=true;
  isAirCraftNext: Boolean=true;
  isAirCraftPrev: Boolean=true;
  isATAPrev: Boolean=true;
  customerModuleId: number = 0;
  companyModuleId: number = 0;
  vendorModuleId: number = 0;
  otherModuleId: number = 0;
  manufacturermoduleid : number = 0;
  alternateData: any = {};
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
  ) { 
      this.companyModuleId = AppModuleEnum.Company;
      this.vendorModuleId = AppModuleEnum.Vendor;
      this.customerModuleId = AppModuleEnum.Customer;
      this.otherModuleId = AppModuleEnum.Others;
      this.manufacturermoduleid = AppModuleEnum.Manufacturer;
    this.isView=this.authService.checkPermission([ModuleConstants.PublicationsList+'.'+PermissionConstants.View]);
    this.isPNAdd=this.authService.checkPermission([ModuleConstants.Publications_PNMapping+'.'+PermissionConstants.Add]);
    this.isDownload=this.authService.checkPermission([ModuleConstants.Publications_PNMapping+'.'+PermissionConstants.Download]);
    this.isPNUpdate=this.authService.checkPermission([ModuleConstants.Publications_PNMapping+'.'+PermissionConstants.Update]);
    this.isPNDelete=this.authService.checkPermission([ModuleConstants.Publications_PNMapping+'.'+PermissionConstants.Delete]);
   this.isAircraftDownload=this.authService.checkPermission([ModuleConstants.Publications_ViewAircraftInformation+'.'+PermissionConstants.Download]);
   this.isATADownload=this.authService.checkPermission([ModuleConstants.Publications_ViewATAChapter+'.'+PermissionConstants.Download]);

   this.isGeneralInfoAdd=this.authService.checkPermission([ModuleConstants.Publications_GeneralInformation+'.'+PermissionConstants.Add]);
   this.isGeneralInfoUpdate=this.authService.checkPermission([ModuleConstants.Publications_GeneralInformation+'.'+PermissionConstants.Update]);

   this.isNextVisible=this.authService.ShowTab('Create Publications','PN Mapping');

   this.isPNNextVisible=this.authService.ShowTab('Create Publications','View Aircraft Information');

   this.isAirCraftNext=this.authService.ShowTab('Create Publications','View ATA Chapter');
   this.isAirCraftPrev=this.authService.ShowTab('Create Publications','PN Mapping');

   this.isATAPrev=this.authService.ShowTab('Create Publications','View Aircraft Information');
  }

  isShowTab(value){
		
		var isShow=this.authService.ShowTab('Create Publications',value);
		return isShow;
	
	}

  ngOnInit() {
    this.getGlobalDateFormat();
    this.publicationRecordId = this._actRoute.snapshot.params['id'];
    this.sourcePublication.sequence = 1;
    if (!this.isEditMode) {
      this.sourcePublication.revisionNum = 1;
      this,this.sourcePublication.verifiedDate=new Date();
    }

    if (this.publicationRecordId) {
      this.isEnableNext = true;
      this.isEditMode = true;
      this.isDisabledSteps = true;
      this.getPublicationDataonEdit();
      this.getAircraftInformationByPublicationId();
      this.getPnMapping();
      this.getAtaChapterByPublicationId();
      // this.getFilesByPublicationId();
      this.toGetDocumentsListNew(this.publicationRecordId);
    } else {
      this.getAllEmployeeList();
      this.getAllIntegrations();
      this.getFileTagTypesList();
      this.getPublishedByModulesList();
    }
    if (this.isEditMode) {
      if (localStorage.getItem('currentTab')) {
        this.changeOfTab(localStorage.getItem('currentTab'))
      } else {
        // localStorage.removeItem('currentTab')
      }
    } else {
      this.changeOfTab('General');
    }
  }
   

  getPnMapping() {
    this.isSpinnerVisible = true;
    this.publicationService
      .getPublicationPNMapping(this.publicationRecordId)
      .subscribe(res => {
        this.isSpinnerVisible = false;
        this.pnMappingList = res.map(x => {
          return {
            ...x,
            partNumber: x.partNumber,
            partDescription: x.partDescription,
            itemClassification: x.itemClassification,
            manufacturer: x.manufacturerName
          };

        });
      }, error => {

        this.isSpinnerVisible = true;
      });
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
    this.globalFormatDate = moment.localeData(globalSettings.cultureName).longDateFormat('L')
  }

  getPublicationTypes() {

    this.isSpinnerVisible = true;
    let publicationTypeId = this.sourcePublication.publicationTypeId ? this.sourcePublication.publicationTypeId : 0;
    this.commonService.autoSuggestionSmartDropDownList("PublicationType", "PublicationTypeId", "Name", '', true, 0, [publicationTypeId].join(), this.masterCompanyId)
      .subscribe(res => {
        this.isSpinnerVisible = false;
        this.publicationTypes = res;
      }), error => {

        this.isSpinnerVisible = false;
      };
  }

  async getAllIntegrations() {
    if (this.arrayIntegrationlist.length == 0) {
      this.arrayIntegrationlist.push(0);
    }
    this.isSpinnerVisible = false;
    await this.commonService.autoSuggestionSmartDropDownList('PublicationType', 'PublicationTypeId', 'Name', '', true, 0, this.arrayIntegrationlist.join(), this.masterCompanyId).subscribe(res => {

      this.isSpinnerVisible = false;
      this.publicationTypes = res.map(x => {
        return {
          label: x.label, value: x.value
        }
      })
      let publicationType = getObjectById(
        "value",
        this.sourcePublication.publicationTypeId,
        this.publicationTypes
      );
      if (publicationType) {
        this.publicationType = publicationType.label;
      }
    }, error => {

      this.isSpinnerVisible = false;
      // this.saveFailedHelper(error)
    });
  }

  onChangePublicationType() {

    let publicationType = getObjectById(
      "value",
      this.sourcePublication.publicationTypeId,
      this.publicationTypes
    );
    if (publicationType) {
      this.publicationType = publicationType.label;
    }
    this.onChangeInput();
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

    this.isSpinnerVisible = true;
    await this.publicationService.getAllbyIdPublications(this.publicationRecordId).subscribe(res => {

      this.isSpinnerVisible = false;
      const responseData = res;
      const tempsourcepub =
        responseData.map(x => {
          x.locationId = { label: x.location, value: x.locationId };
          x.publishedByRefId = { label: x.publishedByRefName, value: x.publishedByRefId };
          return {
            ...x,
            entryDate: new Date(x.entryDate),
            verifiedDate: new Date(x.verifiedDate),
            revisionDate: new Date(x.revisionDate),
            expirationDate: new Date(x.expirationDate),
            nextReviewDate: new Date(x.nextReviewDate)
          }
        });

      this.sourcePublication = tempsourcepub[0];
      this.arrayIntegrationlist.push(this.sourcePublication.publicationTypeId);
      this.getAllIntegrations();
      this.publicationType = getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.publicationTypeId, this.publicationTypes);

      this.getAllEmployeeList();
      this.getAllIntegrations();
      this.getFileTagTypesList();
      this.getPublishedByModulesList();

    }, error => {
      this.isSpinnerVisible = false;
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
    this.alternateData={};
    this.selectedPartNumbers=[];
    if (this.modal) {
      this.modal.close()
    }
  }
  addNewRecord() {
    this.route.navigate(['/singlepages/singlepages/app-create-publication'])
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
      // this.getFilesByPublicationId();

    } else if (value === 'PnMap') {
      this.currentTab = 'PnMap';
      this.activeMenuItem = 2;
      this.getPartNumberList('');
    } else if (value === 'Aircraft') {
      this.currentTab = 'Aircraft';
      this.activeMenuItem = 3;
      this.getAllAircraftManufacturer();
      this.getAllAircraftModels();
      this.getAllDashNumbers();
      this.getAircraftInformationByPublicationId();
    } else if (value === 'Atachapter') {
      this.currentTab = 'Atachapter';
      this.activeMenuItem = 4;
      this.getAllATAChapter();
      this.getAllSubChapters();
      this.getAtaChapterByPublicationId();

    }
    localStorage.setItem('currentTab', value);

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


  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
  }

  async getAllEmployeeList() {

    this.isSpinnerVisible = true;
    let verifiedBy = this.sourcePublication.verifiedBy ? this.sourcePublication.verifiedBy : 0;
    this.commonService.autoCompleteDropdownsCertifyEmployeeByMS('', true, 0, [verifiedBy].join(), this.currentUserManagementStructureId,this.authService.currentUser.masterCompanyId)
      .subscribe(res => {
        this.employeeList = res;

        this.isSpinnerVisible = false;
      }, error => {

        this.isSpinnerVisible = false;
      });
  }
  // async getAllEmployees() {
  //   if (this.arrayEmplsit.length == 0) {
  //     this.arrayEmplsit.push(0, this.authService.currentEmployee.value);
  //   }
  //   await this.commonService.autoCompleteDropdownsCertifyEmployeeByMS('', true, 200, this.arrayEmplsit.join(), this.currentUserManagementStructureId).subscribe(res => {
  //     this.employeeList = res;
  //   }, error => error => this.saveFailedHelper(error))
  // }
  private saveSuccessHelper(role?: any) {
    this.isSaving = false;
    this.alertService.showMessage(
      'Success',
      `Action was created successfully`,
      MessageSeverity.success
    );

  } 

  saveGeneralInfo() {
    this.data = this.sourcePublication;
    this.data.employeeId = this.data.employeeId ? this.data.employeeId : null;
    this.publicationType = getValueFromArrayOfObjectById('label', 'value', this.sourcePublication.publicationTypeId.toString(), this.publicationTypes);

    if (this.data.publishedById == null || this.data.publishedById == "null") {
      this.data.publishedById = null;
    }
    this.formData.append('entryDate', moment(this.data.entryDate).format('DD/MM/YYYY'));
    this.formData.append('publicationId', this.data.publicationId);
    this.formData.append('description', this.data.description);
    this.formData.append('publicationTypeId', this.data.publicationTypeId);
    this.formData.append('asd', this.data.asd);
    this.formData.append('sequence', this.data.sequence);
    this.formData.append('publishedById', this.data.publishedById);
    if (this.data.publishedById == this.vendorModuleId || this.data.publishedById == this.manufacturermoduleid) {
      this.formData.append('publishedByRefId', this.data.publishedByRefId.value);
    } else {
      this.formData.append('publishedByRefId', null);
    }
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
    this.formData.append('employeeId', this.data.employeeId);
    this.formData.append('verifiedStatus', this.data.verifiedStatus ? this.data.verifiedStatus : false);
    this.formData.append('verifiedBy', this.data.verifiedBy);
    this.formData.append('masterCompanyId', this.data.masterCompanyId);
    this.formData.append('CreatedBy', this.userName);
    this.formData.append('UpdatedBy', this.userName);
    this.formData.append('IsActive', 'true');
    this.formData.append('IsDeleted', 'false');
    // if (!this.isEditMode) {
    this.formData.append('revisionNum', this.data.revisionNum);
    // }
    this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));


    if (this.sourcePublication.PublicationId != '' && this.publicationRecordId == null) {
      this.generalInformationDetails = this.sourcePublication;

      {
        this.sourcePublication.PublicationId = this.sourcePublication.PublicationId;

        this.isSpinnerVisible = true;
        this.publicationService
          .newAction(this.formData
          )
          .subscribe(res => {
            this.isSpinnerVisible = false;
            this.isEnableNext = true;
            this.uploadDocs.next(true);
            this.disableGeneralInfoSave = true;
            this.alertService.showMessage("Success", `Publication saved Successfully`, MessageSeverity.success);
            const { publicationRecordId } = res;
            this.isEditMode = true;
            this.route.navigateByUrl(`/singlepages/singlepages/app-publication/edit/${publicationRecordId}`);
            this.publicationRecordId = publicationRecordId,
              role => this.saveSuccessHelper(role),
              error => {
                this.isSpinnerVisible = false;
              }
          }, error => {
            this.isSpinnerVisible = false;
            // this.saveFailedHelper(error)
          });
      }
    }
    if (this.isEditMode) {
      this.updatePublicationGeneralInfo();

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
    this.isSpinnerVisible = true;
    this.publicationService
      .updateAction(this.formData)
      .subscribe(res => {
        this.isSpinnerVisible = false;
        this.isEnableNext = true;
        this.disableGeneralInfoSave = true;
        // this.getFilesByPublicationId();
        this.formData = new FormData(),
          this.alertService.showMessage("Success", `Publication Updated Successfully`, MessageSeverity.success),
          role => this.saveSuccessHelper(role),
          error => {
            this.isSpinnerVisible = false;
            // this.saveFailedHelper(error)
          };
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

  filterPartList(event) {
    this.partNumberList = this.partNumberListOriginal;
    const partListData = [
      ...this.partNumberListOriginal.filter(x => {
        return x.label.toLowerCase().includes(event.query.toLowerCase());
      })
    ];
    this.partNumberList = partListData;

  }

  async getPartNumberList(event) {
    this.isSpinnerVisible = false;
    let setEditArray = [];
    let strText;
    if (event != '') {
      strText = event.query;
    }
    this.commonService.autoCompleteSmartDropDownItemMasterList(strText, true, 20, setEditArray.join(), this.masterCompanyId).subscribe(res => {
      const responseData = res;
      this.isSpinnerVisible = false;
      // this.partNumbersInfo = this.allPartnumbersList;
      this.partNumberListOriginal = responseData.map(x => {
        return {
          label: x.label,
          partDetails: x
        };
      });
    })
    // await this.itemMasterService.getPrtnumberslistList().subscribe(list => {
    //   const responseData = list[0];
    //   this.isSpinnerVisible = false;
    //   this.partNumberListOriginal = responseData.map(x => {
    //     return {
    //       label: x.partNumber,
    //       value: x
    //     };
    //   });
    // }, error => {
    //   this.isSpinnerVisible = false;
    // });
  }

  openModelPopups(partNumberList) {
    if (partNumberList.length > 0) {
      this.disabledPartNumber = true;
    } else {
      this.disabledPartNumber = false;
    }
  }
  bindPartDataInPopup(){
    let selectedPart: any = this.selectedPartNumbers;
    this.alternateData.Description = selectedPart.partDetails.partDescription;
    this.alternateData.manufacturer = selectedPart.partDetails.manufacturer;
  }

  enablePnMappingSave() {
    this.disabledPartNumber = false;
  }
  savePNMapping() {
    let selectedPart: any = this.selectedPartNumbers;
    const mapData = {

      // this.selectedPartNumbers.map(obj => {
      // return {
      PublicationRecordId: this.publicationRecordId,
      PublicationId: this.generalInformationDetails.PublicationId,
      PartNumber: selectedPart.label,
      PartNumberDescription: selectedPart.partDetails.partDescription,
      ItemMasterId: selectedPart.partDetails.value,
      ItemClassification:
        selectedPart.partDetails.itemClassification === null ? '-' : selectedPart.partDetails.itemClassification,
      ItemClassificationId: selectedPart.partDetails.itemClassificationId,
      manufacturer: selectedPart.partDetails.manufacturer === null ? '-' : selectedPart.partDetails.manufacturer,
      ItemGroupId: selectedPart.partDetails.itemGroupId == null ? 1 : selectedPart.partDetails.itemGroupId,
      CreatedBy: this.userName,
      UpdatedBy: this.userName,
      MasterCompanyId: this.masterCompanyId,
      IsActive: true,
      IsDeleted: false,
      CreatedDate: new Date(),
      UpdatedDate: new Date(),     
    }
    // this.selectedPartNumbers = [];
    if (mapData) {
      this.isSpinnerVisible = true;
      this.publicationService.postMappedPartNumbers([mapData]).subscribe(res => {
        this.isDisabledSteps = true;
        this.alertService.showMessage(
          'Success',
          `PN Mapped Successfully`,
          MessageSeverity.success
        );
        this.selectedPartNumbers = null;
        this.disabledPartNumber = true;
        this.isSpinnerVisible = false;
        this.getPnMapping();
      }, error => {
        // this.saveFailedHelper(error)
        this.isSpinnerVisible = false;
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

  getAllAircraftManufacturer() {
    this.aircraftManufacturerService.getAll(this.masterCompanyId).subscribe(aircraftManufacturer => {
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

  getAllAircraftModels() {
    this.isSpinnerVisible = true;
    this.aircraftModelService.getAll(this.masterCompanyId).subscribe(models => {
      const responseValue = models[0];

      this.isSpinnerVisible = false;
      this.aircraftModelList = responseValue.map(models => {
        return {
          label: models.modelName,
          value: models.aircraftModelId
        };
      });
    }, error => {

      this.isSpinnerVisible = false;
    });
  }

  getAllDashNumbers() {
    this.isSpinnerVisible = false;
    this.Dashnumservice.getAll(this.masterCompanyId).subscribe(dashnumbers => {
      this.isSpinnerVisible = false;
      const responseData = dashnumbers[0];
      this.dashNumberList = responseData.map(dashnumbers => {
        return {
          label: dashnumbers.dashNumber,
          value: dashnumbers.dashNumberId
        };
      });
    }, error => {

      this.isSpinnerVisible = false;
    });
  }

  getAircraftInformationByPublicationId() {

    this.isSpinnerVisible = true;
    this.publicationService
      .getAircraftMappedByPublicationId(this.publicationRecordId)
      .subscribe(res => {

        this.isSpinnerVisible = false;
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
          };
        });
        if (this.aircraftList && this.aircraftList.length > 0) {
          this.aircraftList.forEach((airCraft, index) => {
            if (this.aircraftList[index].dashNumber.toLowerCase() == 'unknown') {
              this.aircraftList[index].dashNumber = '';
            }
            if (this.aircraftList[index].model.toLowerCase() == 'unknown') {
              this.aircraftList[index].model = '';
            }
          });
        }
      }, error => {

        this.isSpinnerVisible = false;
      });
  }

  async getAircraftModelByManfacturerType() {

    await this.searchByFieldUrlCreateforAircraftInformation();

    this.selectedAircraftModel = []
    this.selectedDashNumbers = []
    this.aircraftModelList = []
    this.dashNumberList = []
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
    await this.searchByFieldUrlCreateforAircraftInformation();
    this.selectedDashNumbers = []
    this.dashNumberList = []

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

    if (
      this.aircraftManfacturerIdsUrl !== '' &&
      this.aircraftModelsIdUrl !== '' &&
      this.dashNumberIdUrl !== '' && this.selectedAircraftPartNumber !== ""
    ) {
      this.searchParams = `aircrafttypeid=${this.aircraftManfacturerIdsUrl
        }&aircraftmodelid=${this.aircraftModelsIdUrl}&dashNumberId=${this.dashNumberIdUrl}&partNumber=${this.selectedAircraftPartNumber}`;
    }
    else if (
      this.aircraftManfacturerIdsUrl !== '' &&
      this.aircraftModelsIdUrl !== ''
    ) {
      this.searchParams = `aircrafttypeid=${this.aircraftManfacturerIdsUrl
        }&aircraftmodelid=${this.aircraftModelsIdUrl}`;
    } else if (this.aircraftManfacturerIdsUrl !== '') {
      this.searchParams = `aircrafttypeid=${this.aircraftManfacturerIdsUrl}`;
    }
    else if (this.aircraftModelsIdUrl !== '') {
      this.searchParams = `aircraftmodelid=${this.aircraftModelsIdUrl}`;
    }
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
        if (this.aircraftList && this.aircraftList.length > 0) {
          this.aircraftList.forEach((airCraft, index) => {
            if (this.aircraftList[index].dashNumber.toLowerCase() == 'unknown') {
              this.aircraftList[index].dashNumber = '';
            }
            if (this.aircraftList[index].model.toLowerCase() == 'unknown') {
              this.aircraftList[index].model = '';
            }
          });
        }
      });
  }

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
            ataChapter: `${x.ataChapterName}`,
            ataSubChapter: ` ${x.ataSubChapterDescription}`,
          };

        });
      });
  }


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

  getAllATAChapter() {
    this.ataMainSer.getAtaMainList(this.masterCompanyId).subscribe(Atachapter => {
      const response = Atachapter[0];
      this.ataChapterList = response.map(x => {
        return {
          value: x.ataChapterId,
          label: x.ataChapterName
        };
      });
    });
  }

  getAllSubChapters() {
    this.atasubchapter1service.getAtaSubChapter1List(this.masterCompanyId).subscribe(atasubchapter => {
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
      this.ataMainSer.getMultiATASubDesc(this.ataChapterIdUrl).subscribe(atasubchapter => {

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
    if (this.ataChapterIdUrl !== '' && this.ataSubchapterIdUrl !== '' && this.selectedPartNumber !== '') {
      this.searchATAParams = `ATAChapterId=${this.ataChapterIdUrl
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

          };
        });
      });
  }

  onDeletePNMappingRow(rowData) {
    this.selectedRowforDelete = rowData;
  }

  deleteConformation(value) {
    if (value === 'Yes') {
      this.publicationService.deleteItemMasterMapping(this.selectedRowforDelete.publicationItemMasterMappingId).subscribe(() => {
        this.getPnMapping();
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
  dismissModelNew() {

    this.isEditMode = false;
    this.modal.close();
  }

  addDocumentDetails() {
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
        tagType: this.sourcePublication.tagTypeId,
        isFileFromServer: false,
        attachmentDetailId: 0,

      })

    }



  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
  removeFile(event) {
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
          tagType: this.sourcePublication.tagTypeId,
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
    const vdata = {
      referenceId: this.publicationId,
      masterCompanyId: this.masterCompanyId,
      createdBy: this.userName,
      updatedBy: this.userName,
      moduleId: 5,
    }
    for (var key in vdata) {
      this.formData.append(key, vdata[key]);
    }
    this.formData.append('attachmentdetais', JSON.stringify(this.sourceViewforDocumentList));
    this.commonService.uploadDocumentsEndpoint(this.formData).subscribe(res => {
      this.formData = new FormData();
      this.toGetDocumentsListNew(this.publicationId);
    });
  }

  toGetDocumentsListNew(id) {
    var moduleId = 5;
    this.publicationService.getFilesBypublicationNew(this.publicationRecordId).subscribe(res => {
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


    })
  }
  dateFilterForTableNew(date, field) {

    if (date !== '' && moment(date).format('MMMM DD YYYY')) {
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
    this.isSpinnerVisible = true;
    this.alertService.startLoadingMessage();

    this.commonService.GetAttachmentPublicationAudit(rowData.attachmentDetailId).subscribe(
      results => {
        this.onAuditHistoryLoadSuccessful(results, content)
        this.isSpinnerVisible = false
      },
      error => {
        this.isSpinnerVisible = false;
        // this.saveFailedHelper(error)
      });
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

    let locationId = this.sourcePublication.locationId ? this.sourcePublication.locationId : 0;
    this.commonService.autoSuggestionSmartDropDownList('Location', 'LocationId', 'Name', event.query ? event.query : '', true, 20, [locationId].join(), this.masterCompanyId).subscribe(res => {
      this.gLocationsList = res;
    });
  }


  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }


  changeOfStatus(status) {
    this.disableSave = false;
  }

  // getFilesByPublicationId() {
  //   this.publicationService.getFilesBypublication(this.publicationRecordId).subscribe(res => {
  //     this.attachmentList = res || [];
  //     if (this.attachmentList.length > 0) {
  //       this.attachmentList.forEach(item => {
  //         item["isFileFromServer"] = true;
  //         item.attachmentDetails.forEach(fItem => {
  //           fItem["isFileFromServer"] = true;
  //         })
  //       })
  //     }
  //   });
  // }
  getLocationNameById(event) {
    this.sourcePublication['location'] = this.sourcePublication.locationId.label
    this.onChangeInput();
  }

  getPublishedByModulesList() {
    let publishedById = this.sourcePublication.publishedById ? this.sourcePublication.publishedById : 0;
    this.commonService.autoSuggestionSmartDropDownList('Module', 'ModuleId', 'ModuleName', '', true, 0, [publishedById].join(), this.masterCompanyId).subscribe(res => {
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
    let publishedBy = this.sourcePublication.publishedByRefId ? this.sourcePublication.publishedByRefId : 0;
    this.commonService.autoSuggestionSmartDropDownList(tableName, tableColumnId, tableColumnName, event.query ? event.query : '', true, 20, [publishedBy].join(), this.masterCompanyId).subscribe(res => {
      this.publishedByReferences = res;
    });
    // this.onChangeInput();
  }
  changePublishedById() {
    this.sourcePublication.publishedByRefId = null;
    this.sourcePublication.publishedByOthers = "";
    this.onChangeInput()
  }
  nextClick(nextOrPrevious) {
    this.nextOrPreviousTab = nextOrPrevious;
    let content = this.tabRedirectConfirmationModal;
    this.modal = this.modalService.open(content, { size: "sm" });
  }
  dismissModel() {
    this.modal.close();
  }
  redirectToTab() {
    this.dismissModel();
    this.changeOfTab('PnMap');

  }

  clearValue() { }

  restorerecord: any = {};
  restore(content, rowData) {
    this.restorerecord = rowData;
    this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
  }
  restoreRecord() {
    this.isSpinnerVisible = true;
    this.publicationService.restoreItemMasterMapping(this.restorerecord.publicationItemMasterMappingId).subscribe(res => {
      this.getDeleteListByStatus();
      this.modal.close();
      this.isSpinnerVisible = false;
      this.alertService.showMessage("Success", `Successfully restored`, MessageSeverity.success);
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  getDeleteListByStatus() {
    this.isSpinnerVisible = true;
    this.publicationService
      .getPublicationPNMapping(this.publicationRecordId, !this.currentDeletedstatus)
      .subscribe(res => {
        this.isSpinnerVisible = false;
        this.pnMappingList = res.map(x => {
          return {
            ...x,
            partNumber: x.partNumber,
            partDescription: x.partDescription,
            itemClassification: x.itemClassification,
            manufacturer: x.manufacturerName
          };
        });
      }, error => {

        this.isSpinnerVisible = true;
      });

  }
  onChangeInput() {
    if (this.isEditMode) {
      this.disableGeneralInfoSave = false;
    }
  }

}