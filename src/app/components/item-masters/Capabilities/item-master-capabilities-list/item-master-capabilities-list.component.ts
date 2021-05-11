import { Component, ViewChild, OnInit, AfterViewInit, Input, ChangeDetectorRef, ElementRef, SimpleChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { fadeInOut } from '../../../../services/animations';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { ATAMain } from '../../../../models/atamain.model';
import { ATAChapter } from '../../../../models/atachapter.model';
import { ItemMasterCapabilitiesModel } from '../../../../models/itemMasterCapabilities.model';
import { DashNumberService } from '../../../../services/dash-number/dash-number.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { IntegrationService } from '../../../../services/integration-service';
import { AtaMainService } from '../../../../services/atamain.service';
import { AtaSubChapter1Service } from '../../../../services/atasubchapter1.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
declare var $ : any;
import { ItemMasterCreateCapabilitiesComponent } from '../item-master-create-capabilities/item-master-create-capabilities.component';
import { DBkeys } from '../../../../services/db-Keys';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import {
    ModuleConstants,
    PermissionConstants,
} from "src/app/generic/ModuleConstant";

@Component({
  selector: "app-item-master-capabilities-list",
  templateUrl: "./item-master-capabilities-list.component.html",
  styleUrls: ["./item-master-capabilities-list.component.scss"],
  animations: [fadeInOut],
  providers: [DatePipe],
})
/** item-master-capabilities-list component*/
export class ItemMasterCapabilitiesListComponent implements OnInit {
  @Input() itemMasterId;
  @Input() selectedTab: string = "";
  @Input() partData: any = {};
  isSpinnerVisible: Boolean = false;
  activeIndex: number;
  selectedColumns: any[];
  isDeleteMode: boolean;
  isEditMode: boolean;
  loadingIndicator: boolean;
  auditHisory: any[];
  selectedOnly: boolean = false;
  targetData: any;
  selectedreason: any;
  disableSave: boolean = true;
  allComapnies: MasterCompany[];
  modal: any;
  sourceAction: any;
  isSaving: boolean;
  allItemMasterCapsList: any[] = [];
  allItemMasterCapsListDt: any[] = [];
  selectedColumn: any;
  getSelectedCollection: any;
  colaircraft: any[] = [];
  matSpinner: boolean;
  local: any;
  partCollection: any[];
  itemclaColl: any[];
  selectedActionName: any;
  disableSavepartNumber: boolean;
  sourceItemMasterCap: any = {};
  disableSavepartDescription: boolean;
  descriptionbyPart: any[] = [];
  allPartnumbersInfo: any[];
  alldashnumberinfo: any[];
  allManagemtninfo: any[] = [];
  maincompanylist: any[] = [];
  //bulist: any[];
  departmentList: any[];
  divisionlist: any[] = [];
  manufacturerData: any[] = [];
  allAircraftinfo: any[];
  selectedAircraftTypes: any;
  selectedAircraftDataModels: any[] = [];
  enablePopupData: boolean = false;
  currentVendorModels: any[] = [];
  selectedModels: any[] = [];
  allDashnumberInfo: any[];
  allATAMaininfo1: ATAMain[];
  assetRecordId: number = 0;
  selectedManufacturer: any = []; //To Store selected Aircraft Manufacturer Data
  selectedModel: any = []; //To Store selected Aircraft Modal Data
  capabilitiesForm: FormGroup;
  onSelectedId: any;
  parentManagementInfo: any[] = [];
  childManagementInfo: any[] = [];
  partListData: any[] = [];
  integrationvalues: any[] = [];
  cmmList: any[];
  disableSaveMemo: boolean = true;
  capabilityTypeData: any[];
  managementStructureData: any = [];
  isDeleteCapabilityPopupOpened: boolean = false;
  selectedForDeleteCapabilityId: any;
  selectedForDeleteContent: any;
  restorerecord: any = {};
  capabilityId: any;
  showCapes: boolean = false;
  isEnableCapesList: boolean = true;
  globalSearchData: any = {};
  pnData: any;
  capabalityTypeList: any = [];
  aircraftModelData: any;
  ataChapterData: any;
  entityList: any;
  buData: any;
  divisionData: any;
  departmentData: any;
  @Input() isEnableItemMaster: boolean = false;
  @Input() isEnableItemMasterView: boolean = false;
  @ViewChild("addCapabilityButton", { static: false })
  addCapabilityButton: ElementRef;
  selectedCapabilityType: any;
  isCapViewMode: boolean = false;
  itemMasterCapesPageSize: Number = 10;
  selectedItemMasterCapData: any = {};
  legalEntityList: any = [];
  capabilityauditHisory: AuditHistory[] = [];
  businessUnitList: any = [];
  employeeList: any = [];
  textAreaLabel: string;
  textAreaInfo: string;
  currentDeleteStatus: boolean = false;
  arraylistCapabilityTypeId: any[] = [];
  arrayEmplsit: any[] = [];
  disableIsVerified: boolean = false;
  disableMagmtStruct: boolean = true;
  isAdd: boolean = true;
  isEdit: boolean = true;
  isDownload: boolean = true;
  isDelete: boolean = true;
  isView: boolean = true;
  allItemMasterCapsListOriginal: any[];

  /** item-master-capabilities-list ctor */
  constructor(
    private itemMasterService: ItemMasterService,
    private cdRef: ChangeDetectorRef,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private authService: AuthService,
    private _route: Router,
    private alertService: AlertService,
    private dashnumberservices: DashNumberService,
    private formBuilder: FormBuilder,
    public workFlowtService: LegalEntityService,
    private atasubchapter1service: AtaSubChapter1Service,
    private atamain: AtaMainService,
    public inteService: IntegrationService,
    private workOrderService: WorkOrderService,
    private commonservice: CommonService,
    private activatedRoute: ActivatedRoute
  ) {
    this.dataSource = new MatTableDataSource();
    this.isAdd = this.authService.checkPermission([
      ModuleConstants.Item_Capes + "." + PermissionConstants.Add,
    ]);
    this.isEdit = this.authService.checkPermission([
      ModuleConstants.Item_Capes + "." + PermissionConstants.Update,
    ]);
    this.isDownload = this.authService.checkPermission([
      ModuleConstants.Item_Capes + "." + PermissionConstants.Download,
    ]);
    this.isDelete = this.authService.checkPermission([
      ModuleConstants.Item_Capes + "." + PermissionConstants.Delete,
    ]);
    this.isView = this.authService.checkPermission([
      ModuleConstants.Item_Capes + "." + PermissionConstants.View,
    ]);
  }

  capabilityForm: any = {
    selectedCap: "",
    CapabilityTypeId: 0,
    companyId: 0,
    buId: 0,
    divisionId: 0,
    departmentId: 0,
    manufacturerId: 0,
    manufacturerLabel: "",
    ataChapterId: 0,
    ataChapterLabel: "",
    ataSubChapterId: 0,
    ataSubchapterLabel: "",
    cmmId: 0,
    cmmLabel: "",
    integrateWith: 0,
    integrateWithLabel: "",
    description: "",
    entryDate: "",
    isVerified: false,
    managementStructureId: 0,
    verifiedBy: "",
    dateVerified: "",
    nteHrs: 0,
    tat: 0,
    selectedPartId: [],
    selectedAircraftDataModels: [],
    selectedAircraftModelTypes: [],
    selectedAircraftTypes: [],
    selectedManufacturer: [],
    selectedModel: [],
    selectedDashNumbers: [],
    selectedDashNumbers2: [],
  };
  capabilityEditForm: any = {
    itemMasterCapesId: 0,
    selectedCap: "",
    CapabilityTypeId: 0,
    companyId: 0,
    buId: 0,
    divisionId: 0,
    departmentId: 0,
    manufacturerId: 0,
    manufacturerLabel: "",
    ataChapterId: 0,
    ataChapterLabel: "",
    ataSubChapterId: 0,
    ataSubchapterLabel: "",
    cmmId: 0,
    cmmLabel: "",
    integrateWith: 0,
    integrateWithLabel: "",
    description: "",
    entryDate: "",
    isVerified: false,
    managementStructureId: 0,
    verifiedBy: "",
    dateVerified: "",
    nteHrs: 0,
    tat: 0,
    memo: "",
    selectedPartId: 0,
    selectedAircraftDataModels: [],
    selectedAircraftModelType: 0,
    selectedAircraftType: 0,
    selectedManufacturer: 0,
    selectedModel: 0,
    selectedDashNumber: 0,
  };

  ngOnInit() {
    if (!this.isEnableItemMaster && !this.isEnableItemMasterView) {
      this.itemMasterService.currentUrl =
        "/itemmastersmodule/itemmasterpages/app-item-master-capabilities-list";
      this.itemMasterService.bredcrumbObj.next(
        this.itemMasterService.currentUrl
      ); //Bread Crumb
    }

    this.capabilitiesForm = this.formBuilder.group({
      mfgForm: this.formBuilder.array([]),
    });
    this.getAllEmployeesByManagmentStructureID();
    if (this.isView) {
      this.loadData();
    }
    this.activeIndex = 0;
    this.itemMasterService.capabilityCollection = [];
    this.getCapabilityTypesList();
    this.getLegalEntity();
  }

  get mfgFormArray(): FormArray {
    return this.capabilitiesForm.get("mfgForm") as FormArray;
  }

    // get userName(): string {
	// 	return this.authService.currentUser ? this.authService.currentUser.userName : "";
	// }

    dataSource: MatTableDataSource<any>;
    cols: any[];
    pnCols: any[];
    nonPnCols: any[];
    paginator: MatPaginator;
    sort: MatSort;

  private onDataLoadFailed(error: any) {
    this.isSpinnerVisible = false;
  }

  private loadData() {
    this.isSpinnerVisible = true;
    let iMid = this.activatedRoute.snapshot.paramMap.get("id");

    if (!iMid) {
      iMid = "0";
    }
    if (this.itemMasterId) {
      iMid = this.itemMasterId;
    }

    let reqData = {
      first: 0,
      rows: 1000,
      sortOrder: -1,
      filters: {
        partNo: "",
        itemMasterId: iMid,
        isDeleted: this.currentDeleteStatus,
      },
      globalFilter: null,
    };
    this.itemMasterService.getItemMasterCapsList(reqData).subscribe(
      (results) => this.onDataLoadSuccessful(results[0]),
      (error) => this.onDataLoadFailed(error)
    );

    // To display the values in header and column name values
    this.pnCols = [
      { field: "capabilityType", header: "Cap Type" },
      { field: "partNo", header: "PN" },
      { field: "pnDiscription", header: "PN Description" },
      { field: "level1", header: "Management Structure" },
      { field: "level2" },
      { field: "level3" },
      { field: "level4" },
      { field: "addedDate", header: "Added Date" },
      { field: "isVerified", header: "Verified" },
      { field: "verifiedBy", header: "Verified By" },
      { field: "verifiedDate", header: "Verified Date" },
      { field: "memo", header: "Memo" },
      { field: "createdDate", header: "Created Date" },
      { field: "createdBy", header: "Created By" },
      { field: "updatedDate", header: "Updated Date" },
      { field: "updatedBy", header: "Updated By" },
    ];
    this.nonPnCols = [
      { field: "capabilityType", header: "Cap Type" },
      { field: "partNo", header: "PN" },
      { field: "pnDiscription", header: "PN Description" },
      { field: "level1", header: "Level 01" },
      { field: "level2", header: "Level 02" },
      { field: "level3", header: "Level 03" },
      { field: "level4", header: "Level 04" },
      { field: "addedDate", header: "Added Date" },
      { field: "isVerified", header: "Verified" },
      { field: "verifiedBy", header: "Verified By" },
      { field: "verifiedDate", header: "Verified Date" },
      { field: "memo", header: "Memo" },
      { field: "createdDate", header: "Created Date" },
      { field: "createdBy", header: "Created By" },
      { field: "updatedDate", header: "Updated Date" },
      { field: "updatedBy", header: "Updated By" },
    ];

    if (this.itemMasterId == undefined) {
      this.cols = this.nonPnCols;
    } else {
      this.cols = this.pnCols;
    }

        this.selectedColumns = this.cols;
    }
    addeddateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allItemMasterCapsList = this.allItemMasterCapsListOriginal;
            const data = [...this.allItemMasterCapsList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
                else if (moment(x.addedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'addedDate'){
                    return x;
                }
                else if(moment(x.verifiedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'verifiedDate'){
                    return x;
                }
            })]
            this.allItemMasterCapsList = data;
        } else {
            this.allItemMasterCapsList = this.allItemMasterCapsListOriginal;
        }
    }

    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allItemMasterCapsList = allWorkFlows.map(x => {
            return {
                ...x,
                isVerified: x.isVerified == 1 ? true : false,
                memo: x.memo.replace(/<[^>]*>/g, ''),
                addedDate: x.addedDate ?  this.datePipe.transform(x.addedDate, 'MM/dd/yyyy hh:mm a'): '',
                verifiedDate: x.verifiedDate ?  this.datePipe.transform(x.verifiedDate, 'MM/dd/yyyy hh:mm a'): '',
                createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
            }
        });
        this.allItemMasterCapsListOriginal=this.allItemMasterCapsList;
        this.employeeList.filter(x => {

            for(let i = 0; i< this.employeeList.length; i++){
                for(let j=0; j < this.allItemMasterCapsList.length; j++){
                    if(this.allItemMasterCapsList[j].verifiedById == this.employeeList[i].value){
                        this.allItemMasterCapsList[j].verifiedBy = this.employeeList[i].label
                    }
                }
            }
        })
    }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (
      this.activatedRoute.snapshot.url[0].path ==
      "app-item-master-create-capabilities"
    ) {
      this.ptnumberlistdata();
      this.showCapes = true;
      let el: HTMLElement = this.addCapabilityButton.nativeElement;
      el.click();
    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
  }

  private refresh() {
    // Causes the filter to refresh there by updating with recently added data.
    this.applyFilter(this.dataSource.filter);
  }

  dismissModel() {
    this.isDeleteMode = false;
    this.isEditMode = false;
    if (this.modal) {
      this.modal.close();
    }
    this.isDeleteCapabilityPopupOpened = false;
    this.loadData();
  }

  openHelpText(content) {
    this.modal = this.modalService.open(content, {
      size: "sm",
      backdrop: "static",
      keyboard: false,
    });
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
  }

  openDelete(content, row) {
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.sourceAction = row;
    this.modal = this.modalService.open(content, {
      size: "sm",
      backdrop: "static",
      keyboard: false,
    });
  }

  checkMSParents(msId) {
    this.managementStructureData.push(msId);
    for (let a = 0; a < this.allManagemtninfo.length; a++) {
      if (this.allManagemtninfo[a].managementStructureId == msId) {
        if (this.allManagemtninfo[a].parentId) {
          this.checkMSParents(this.allManagemtninfo[a].parentId);
          break;
        }
      }
    }
  }

  setManagementStrucureData(obj) {
    this.managementStructureData = [];
    this.checkMSParents(obj.managementStructureId);
    if (this.managementStructureData.length == 4) {
      this.capabilityEditForm.companyId = this.managementStructureData[3];
      this.capabilityEditForm.buId = this.managementStructureData[2];
      this.capabilityEditForm.departmentId = this.managementStructureData[1];
      this.capabilityEditForm.divisionId = this.managementStructureData[0];
      this.getBUList(this.capabilityEditForm.companyId);
      this.getDivisionlist(this.capabilityEditForm.buId);
      this.getDepartmentlist(this.capabilityEditForm.divisionId);
    }
    if (this.managementStructureData.length == 3) {
      this.capabilityEditForm.companyId = this.managementStructureData[2];
      this.capabilityEditForm.buId = this.managementStructureData[1];
      this.capabilityEditForm.departmentId = this.managementStructureData[0];
      this.getBUList(this.capabilityEditForm.companyId);
      this.getDivisionlist(this.capabilityEditForm.buId);
    }
    if (this.managementStructureData.length == 2) {
      this.capabilityEditForm.companyId = this.managementStructureData[1];
      this.capabilityEditForm.buId = this.managementStructureData[0];
      this.getBUList(this.capabilityEditForm.companyId);
    }
    if (this.managementStructureData.length == 1) {
      this.capabilityEditForm.companyId = this.managementStructureData[0];
    }
  }

  getLegalEntity() {
    this.commonservice.getLegalEntityList().subscribe((res) => {
      this.legalEntityList = res;
    });
  }

  openView(
    content,
    row //this is for Edit Data get
  ) {
    this.itemMasterService.isCapsEditMode = false;
    this.isEditMode = false;
    this.openPopUpWithData(content, row);
  }

  get employeeId() {
    return this.authService.currentUser
      ? this.authService.currentUser.employeeId
      : 0;
  }

  parsedText(text) {
    if (text) {
      const dom = new DOMParser().parseFromString(
        "<!doctype html><body>" + text,
        "text/html"
      );
      const decodedString = dom.body.textContent;
      return decodedString;
    }
  }

  openEdits(
    row //this is for Edit Data get
  ) {
    const capData = row;
    this.arraylistCapabilityTypeId.push(row.capabilityTypeId);
    this.getCapabilityTypesList();
    this.arrayEmplsit.push(row.verifiedById == null ? 0 : row.verifiedById);
    this.getManagementStructureDetails(row.managementStrId, this.employeeId);

    this.selectedItemMasterCapData = capData;
    this.selectedDepartment(row.levelId4);

    this.getItemMasterDetailsById(row.itemMasterId);

    if (this.selectedItemMasterCapData.verifiedDate) {
      this.selectedItemMasterCapData.verifiedDate = new Date(
        this.selectedItemMasterCapData.verifiedDate
      );
    }
    if (this.selectedItemMasterCapData.addedDate) {
      this.selectedItemMasterCapData.addedDate = new Date(
        this.selectedItemMasterCapData.addedDate
      );
    }
  }

  enableSaveMemo() {
    this.disableSaveMemo = false;
  }

  getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
    empployid = empployid == 0 ? this.employeeId : empployid;
    editMSID = this.isEditMode ? (editMSID = id) : 0;
    this.commonservice
      .getManagmentStrctureData(id, empployid, editMSID)
      .subscribe(
        (response) => {
          if (response) {
            const result = response;
            if (result[0] && result[0].level == "Level1") {
              for (let i = 0; i < result[0].lstManagmentStrcture.length; i++) {
                if (
                  result[0].lstManagmentStrcture[i].value ==
                  result[0].managementStructureId
                ) {
                  this.selectedItemMasterCapData.levelId1 =
                    result[0].lstManagmentStrcture[i].label;
                }
              }
              this.maincompanylist = result[0].lstManagmentStrcture;
              this.selectedItemMasterCapData.companyId =
                result[0].managementStructureId;
              this.selectedItemMasterCapData.managementStructureId =
                result[0].managementStructureId;
              this.selectedItemMasterCapData.buId = 0;
              this.selectedItemMasterCapData.divisionId = 0;
              this.selectedItemMasterCapData.departmentId = 0;
              this.businessUnitList = [];
              this.divisionlist = [];
              this.departmentList = [];
            } else {
              this.selectedItemMasterCapData.companyId = 0;
              this.selectedItemMasterCapData.buId = 0;
              this.selectedItemMasterCapData.divisionId = 0;
              this.selectedItemMasterCapData.departmentId = 0;
              this.maincompanylist = [];
              this.businessUnitList = [];
              this.divisionlist = [];
              this.departmentList = [];
            }

            if (result[1] && result[1].level == "Level2") {
              this.businessUnitList = result[1].lstManagmentStrcture;
              for (let i = 0; i < result[0].lstManagmentStrcture.length; i++) {
                if (
                  result[0].lstManagmentStrcture[i].value ==
                  result[0].managementStructureId
                ) {
                  this.selectedItemMasterCapData.levelId2 =
                    result[0].lstManagmentStrcture[i].label;
                }
              }
              this.selectedItemMasterCapData.buId =
                result[1].managementStructureId;
              this.selectedItemMasterCapData.managementStructureId =
                result[1].managementStructureId;
              this.selectedItemMasterCapData.divisionId = 0;
              this.selectedItemMasterCapData.departmentId = 0;
              this.divisionlist = [];
              this.departmentList = [];
            } else {
              if (result[1] && result[1].level == "NEXT") {
                this.businessUnitList = result[1].lstManagmentStrcture;
              }
              this.selectedItemMasterCapData.buId = 0;
              this.selectedItemMasterCapData.divisionId = 0;
              this.selectedItemMasterCapData.departmentId = 0;
              this.divisionlist = [];
              this.departmentList = [];
            }

            if (result[2] && result[2].level == "Level3") {
              for (let i = 0; i < result[0].lstManagmentStrcture.length; i++) {
                if (
                  result[0].lstManagmentStrcture[i].value ==
                  result[0].managementStructureId
                ) {
                  this.selectedItemMasterCapData.levelId3 =
                    result[0].lstManagmentStrcture[i].label;
                }
              }
              this.divisionlist = result[2].lstManagmentStrcture;
              this.selectedItemMasterCapData.divisionId =
                result[2].managementStructureId;
              this.selectedItemMasterCapData.managementStructureId =
                result[2].managementStructureId;
              this.selectedItemMasterCapData.departmentId = 0;
              this.departmentList = [];
            } else {
              if (result[2] && result[2].level == "NEXT") {
                this.divisionlist = result[2].lstManagmentStrcture;
              }
              this.selectedItemMasterCapData.divisionId = 0;
              this.selectedItemMasterCapData.departmentId = 0;
              this.departmentList = [];
            }

            if (result[3] && result[3].level == "Level4") {
              for (let i = 0; i < result[0].lstManagmentStrcture.length; i++) {
                if (
                  result[0].lstManagmentStrcture[i].value ==
                  result[0].managementStructureId
                ) {
                  this.selectedItemMasterCapData.levelId4 =
                    result[0].lstManagmentStrcture[i].label;
                }
              }
              this.departmentList = result[3].lstManagmentStrcture;
              this.selectedItemMasterCapData.departmentId =
                result[3].managementStructureId;
              this.selectedItemMasterCapData.managementStructureId =
                result[3].managementStructureId;
            } else {
              this.selectedItemMasterCapData.departmentId = 0;
              if (result[3] && result[3].level == "NEXT") {
                this.departmentList = result[3].lstManagmentStrcture;
              }
            }
            //this.employeedata('',this.headerInfo.managementStructureId);
            this.onSelectManagementStruc();
            this.isSpinnerVisible = false;
          } else {
            this.isSpinnerVisible = false;
          }
        },
        (err) => {
          this.isSpinnerVisible = false;
          const errorLog = err;
          this.errorMessageHandler(errorLog);
        }
      );
  }

  onSelectManagementStruc() {
    if (this.selectedItemMasterCapData.companyId != 0) {
      this.disableMagmtStruct = false;
    } else {
      this.disableMagmtStruct = true;
    }
  }

  getDynamicVariableData(variable, index) {
    return this[variable + index];
  }

  selectedLegalEntity(legalEntityId) {
    if (legalEntityId) {
      this.selectedItemMasterCapData["managementStructureId"] = legalEntityId;

      this.commonservice
        .getBusinessUnitListByLegalEntityId(legalEntityId)
        .subscribe((res) => {
          this.businessUnitList = res;
        });
    }
  }

  selectedBusinessUnit(businessUnitId) {
    if (businessUnitId) {
      this.selectedItemMasterCapData["managementStructureId"] = businessUnitId;
      this.commonservice
        .getDivisionListByBU(businessUnitId)
        .subscribe((res) => {
          this.divisionlist = res;
          this.departmentList = [];
        });
    }
  }

  selectedDivision(divisionUnitId) {
    if (divisionUnitId) {
      this.selectedItemMasterCapData["managementStructureId"] = divisionUnitId;
      this.commonservice
        .getDepartmentListByDivisionId(divisionUnitId)
        .subscribe((res) => {
          this.departmentList = res;
        });
    }
  }

  selectedDepartment(departmentId) {
    if (departmentId) {
      this.selectedItemMasterCapData["managementStructureId"] = departmentId;
    }
  }

  resetVerified(rowData, value) {
    if (value === false) {
      rowData.verifiedById = null;
      rowData.verifiedDate = null;
    }
    if (value == true) {
      rowData.verifiedDate = new Date();
      const employee = this.authService.currentEmployee;
      rowData.verifiedById = employee.value;
    }
  }

  openPopUpWithData(
    content,
    row //this is for Edit Data get
  ) {
    this.getAircraftModel(row.aircraftTypeId, this.capabilityEditForm);
    this.getPartPublicationByItemMasterId(row.itemMasterId);
    this.setManagementStrucureData(row);

    this.capabilityEditForm.itemMasterCapesId = row.itemMasterCapesId;
    this.capabilityEditForm.CapabilityTypeId = row.capabilityId;
    this.capabilityEditForm.selectedPartId = row.itemMasterId;
    this.itemMasterId = row.itemMasterId;
    this.capabilityEditForm.selectedAircraftType = row.aircraftTypeId;
    this.capabilityEditForm.selectedAircraftModelType = row.aircraftModelId;
    this.capabilityEditForm.selectedDashNumber = row.aircraftDashNumberId;
    this.capabilityEditForm.description = row.description;
    this.capabilityEditForm.manufacturerId = row.manufacturerId;
    this.capabilityEditForm.cmmId = row.cmmId;
    this.capabilityEditForm.ataChapterId = row.ataChapterId;
    this.capabilityEditForm.ataSubChapterId = row.ataSubChapterId;
    this.capabilityEditForm.entryDate = new Date(row.entryDate);
    this.capabilityEditForm.integrateWith = row.isIntegrateWith;
    this.capabilityEditForm.isVerified = row.isVerified;
    this.capabilityEditForm.verifiedBy = row.verifiedBy;
    this.capabilityEditForm.dateVerified = new Date(row.dateVerified);
    this.capabilityEditForm.ntehrs = row.ntehrs;
    this.capabilityEditForm.tat = row.tat;
    this.capabilityEditForm.memo = row.memo;
    this.itemMasterService.capabilityCollection = this.getSelectedCollection;
    this.isEditMode = false;
    this.isDeleteMode = true;
    this.modal = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  private saveCompleted(user?: any) {
    this.isSaving = false;
    if (this.isDeleteMode == true) {
      this.alertService.showMessage(
        "Success",
        `Action was deleted successfully`,
        MessageSeverity.success
      );
      this.isDeleteMode = false;
    } else {
      this.alertService.showMessage(
        "Success",
        `Action was edited successfully`,
        MessageSeverity.success
      );
    }
  }
  private saveFailedHelper(error: any) {
    this.isSaving = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage(
      "Save Error",
      "The below errors occured whilst saving your changes:",
      MessageSeverity.error,
      error
    );
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.capabilityauditHisory = auditHistory;
    this.modal = this.modalService.open(content, {
      size: "lg",
      backdrop: "static",
      keyboard: false,
    });
  }

  public navigateTogeneralInfo() {
    this.itemMasterService.isCapsEditMode = false;
    this.itemMasterService.enableExternal = false;
    this._route.navigateByUrl(
      "/itemmastersmodule/itemmasterpages/app-item-master-create-capabilities"
    );
  }

  private ptnumberlistdata() {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.itemMasterService.getPrtnumberslistList().subscribe(
      (results) => this.onptnmbersSuccessful(results[0]),
      (error) => this.onDataLoadFailed(error)
    );
  }

  private onptnmbersSuccessful(allWorkFlows: any[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.allPartnumbersInfo = allWorkFlows;
  }

  openModelPopups(capData) {
    if (this.itemMasterService.isEditMode == false) {
      //Adding for Aircraft manafacturer List Has empty then List Should be null
      if (capData.selectedAircraftTypes.length > 0) {
        var arr = capData.selectedAircraftTypes;
        var selectedvalues = arr.join(",");
        this.itemMasterService.getAircraftTypes(selectedvalues).subscribe(
          (results) =>
            this.onDataLoadaircrafttypeSuccessful(results[0], capData),
          (error) => this.onDataLoadFailed(error)
        );
      } else {
        this.allAircraftinfo = []; //Making empty if selecting is null
      }
    }
  }

  getAircraftModel(selectedAircraftType, capData) {
    if (this.itemMasterService.isEditMode == false) {
      this.itemMasterService.getAircraftTypes(selectedAircraftType).subscribe(
        (results) => this.onDataLoadaircrafttypeSuccessful(results[0], capData),
        (error) => this.onDataLoadFailed(error)
      );
    }
  }

  private onDataLoadaircrafttypeSuccessful(
    allWorkFlows: any[],
    capData //getting Models Based on Manfacturer Selection
  ) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    capData.selectedAircraftDataModels = [];
    allWorkFlows.forEach((element) => {
      capData.selectedAircraftDataModels.push({
        value: element.aircraftModelId,
        label: element.modelName,
        aircraftTypeId: element.aircraftTypeId,
      });
    });
  }

  getAircraftDashNumber(event): any {
    this.alertService.startLoadingMessage();
    this.loadingIndicator = true;

    this.dashnumberservices.getByModelId(event).subscribe(
      (results) => this.ondashnumberSuccessful(results),
      (error) => this.onDataLoadFailed(error)
    );
  }

  private ondashnumberSuccessful(allWorkFlows: any[]) {
    this.alertService.stopLoadingMessage();
    this.loadingIndicator = false;
    this.allDashnumberInfo = allWorkFlows;
  }

  getCapabilityTypesList() {
    if (this.arraylistCapabilityTypeId.length == 0) {
      this.arraylistCapabilityTypeId.push(0);
    }
    this.commonservice
      .autoSuggestionSmartDropDownList(
        "CapabilityType",
        "CapabilityTypeId",
        "CapabilityTypeDesc",
        "",
        true,
        0,
        this.arraylistCapabilityTypeId.join(),
        this.authService.currentUser.masterCompanyId
      )
      .subscribe(
        (res) => {
          this.capabalityTypeList = res;
        },
        (err) => {
          const errorLog = err;
          this.saveFailedHelper(errorLog);
        }
      );
  }

  partPNentHandler(event) {
    if (event.target.value != "") {
      let value = event.target.value.toLowerCase();
      if (this.selectedActionName) {
        if (value == this.selectedActionName.toLowerCase()) {
          this.disableSavepartNumber = true;
        } else {
          this.disableSavepartNumber = false;
          this.sourceItemMasterCap.partDescription = "";
          this.disableSavepartDescription = false;
        }
      }
    }
  }

  partEventHandler(event) {
    if (event) {
      if (event.target.value != "") {
        let value = event.target.value.toLowerCase();
        if (this.onSelectedId) {
          if (value == this.onSelectedId.toLowerCase()) {
            this.disableSave = true;
          } else {
            this.disableSave = false;
          }
        }
      }
    }
  }

  private onpartnumberloadsuccessfull(
    allWorkFlows: any[] //getting Part Description
  ) {
    this.descriptionbyPart = allWorkFlows[0];
    this.sourceItemMasterCap.partDescription = allWorkFlows[0].partDescription;
  }

  partnmId(event) {
    if (this.itemclaColl) {
      for (let i = 0; i < this.itemclaColl.length; i++) {
        if (event == this.itemclaColl[i][0].partName) {
          this.sourceItemMasterCap.partId = this.itemclaColl[i][0].partId;
          this.itemMasterId = this.itemclaColl[i][0].partId;
          this.getPartPublicationByItemMasterId(this.itemMasterId);
          this.disableSavepartNumber = true;
          this.selectedActionName = event;
        }
      }
      this.itemMasterService.getDescriptionbypart(event).subscribe(
        (results) => this.onpartnumberloadsuccessfull(results[0]),
        (error) => this.onDataLoadFailed(error)
      );
      this.disableSavepartDescription = true;
    }
  }

  filterPNpartItems(event) {
    this.partCollection = [];
    this.itemclaColl = [];
    if (this.allPartnumbersInfo) {
      if (this.allPartnumbersInfo.length > 0) {
        for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
          let partName = this.allPartnumbersInfo[i].partNumber;
          if (partName) {
            if (
              partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0
            ) {
              this.itemclaColl.push([
                {
                  partId: this.allPartnumbersInfo[i].itemMasterId,
                  partName: partName,
                },
              ]),
                this.partCollection.push(partName);
            }
          }
        }
      }
    }
  }

  onPartNumberSelection(event) {
    this.getPartPublicationByItemMasterId(event);
  }

  onPartIdselection(event) {
    if (this.itemclaColl) {
      for (let i = 0; i < this.itemclaColl.length; i++) {
        if (event == this.itemclaColl[i][0].partId) {
          this.disableSave = true;

          this.onSelectedId = event;
        }
      }
    }
  }

  onCmmselection(event) {
    if (this.cmmList) {
      for (let i = 0; i < this.cmmList.length; i++) {
        if (event == this.cmmList[i].value) {
          this.capabilityForm.cmmLabel = this.cmmList[i].label;
        }
      }
    }
  }

  onIntegrateWithselection(event) {
    if (this.integrationvalues) {
      for (let i = 0; i < this.integrationvalues.length; i++) {
        if (event == this.integrationvalues[i].value) {
          this.capabilityForm.integrateWithLabel = this.integrationvalues[
            i
          ].label;
        }
      }
    }
  }

  private loadManagementdataForTree() {
    this.workFlowtService.getManagemententity().subscribe(
      (results) => this.onManagemtntdataLoadTree(results[0]),
      (error) => this.onDataLoadFailed(error)
    );
  }

  private onManagemtntdataLoadTree(managementInfo: any[]) {
    this.allManagemtninfo = managementInfo;
    this.parentManagementInfo = managementInfo;
    this.childManagementInfo = managementInfo;
    for (let i = 0; i < this.allManagemtninfo.length; i++) {
      if (this.allManagemtninfo[i].parentId == null) {
        this.businessUnitList = [];
        this.divisionlist = [];
        this.departmentList = [];
        this.maincompanylist.push(this.allManagemtninfo[i]);
      }
    }
  }

  getBUList(legalEntityId) {
    this.selectedItemMasterCapData.buId = 0;
    this.selectedItemMasterCapData.divisionId = 0;
    this.selectedItemMasterCapData.departmentId = 0;
    this.businessUnitList = [];
    this.divisionlist = [];
    this.departmentList = [];
    if (
      legalEntityId != 0 &&
      legalEntityId != null &&
      legalEntityId != undefined
    ) {
      this.selectedItemMasterCapData.managementStructureId = legalEntityId;
      this.selectedItemMasterCapData.companyId = legalEntityId;
      this.commonservice
        .getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId)
        .subscribe((res) => {
          this.businessUnitList = res;
        });
    } else {
      this.selectedItemMasterCapData.managementStructureId = 0;
      this.selectedItemMasterCapData.companyId = 0;
    }
  }

  getDivisionlist(buId) {
    this.divisionlist = [];
    this.departmentList = [];
    this.selectedItemMasterCapData.divisionId = 0;
    this.selectedItemMasterCapData.departmentId = 0;

    if (buId != 0 && buId != null && buId != undefined) {
      this.selectedItemMasterCapData.managementStructureId = buId;
      this.selectedItemMasterCapData.buId = buId;
      this.commonservice
        .getManagementStructurelevelWithEmployee(buId, this.employeeId)
        .subscribe((res) => {
          this.divisionlist = res;
        });
    } else {
      this.selectedItemMasterCapData.managementStructureId = this.selectedItemMasterCapData.companyId;
    }
  }

  getDepartmentlist(divisionId) {
    this.selectedItemMasterCapData.departmentId = 0;
    this.departmentList = [];
    if (divisionId != 0 && divisionId != null && divisionId != undefined) {
      this.selectedItemMasterCapData.divisionId = divisionId;
      this.selectedItemMasterCapData.managementStructureId = divisionId;
      this.commonservice
        .getManagementStructurelevelWithEmployee(divisionId, this.employeeId)
        .subscribe((res) => {
          this.departmentList = res;
        });
    } else {
      this.selectedItemMasterCapData.managementStructureId = this.selectedItemMasterCapData.buId;
      this.selectedItemMasterCapData.divisionId = 0;
    }
  }

  getDepartmentId(departmentId) {
    if (
      departmentId != 0 &&
      departmentId != null &&
      departmentId != undefined
    ) {
      this.selectedItemMasterCapData.managementStructureId = departmentId;
      this.selectedItemMasterCapData.departmentId = departmentId;
    } else {
      this.selectedItemMasterCapData.managementStructureId = this.selectedItemMasterCapData.divisionId;
      this.selectedItemMasterCapData.departmentId = 0;
    }
  }

  getParentBUList(partList) {
    partList.managementStructureId = partList.parentCompanyId;
    partList.parentBulist = [];
    partList.parentDivisionlist = [];
    partList.parentDepartmentlist = [];
    for (let i = 0; i < this.parentManagementInfo.length; i++) {
      if (this.parentManagementInfo[i].parentId == partList.parentCompanyId) {
        partList.parentBulist.push(this.parentManagementInfo[i]);
      }
    }
  }

  getParentDivisionlist(partList) {
    partList.managementStructureId = partList.parentbuId;
    partList.parentDivisionlist = [];
    partList.parentDepartmentlist = [];
    for (let i = 0; i < this.parentManagementInfo.length; i++) {
      if (this.parentManagementInfo[i].parentId == partList.parentbuId) {
        partList.parentDivisionlist.push(this.parentManagementInfo[i]);
      }
    }
  }

  getParentDeptlist(partList) {
    partList.managementStructureId = partList.parentDivisionId;
    partList.parentDepartmentlist = [];
    for (let i = 0; i < this.parentManagementInfo.length; i++) {
      if (this.parentManagementInfo[i].parentId == partList.parentDivisionId) {
        partList.parentDepartmentlist.push(this.parentManagementInfo[i]);
      }
    }
  }

  getParentDeptId(partList) {
    partList.managementStructureId = partList.parentDeptId;
  }

  getChildBUList(partChildList) {
    partChildList.managementStructureId = partChildList.childCompanyId;
    partChildList.childBulist = [];
    partChildList.childDivisionlist = [];
    partChildList.childDepartmentlist = [];
    for (let i = 0; i < this.childManagementInfo.length; i++) {
      if (
        this.childManagementInfo[i].parentId == partChildList.childCompanyId
      ) {
        partChildList.childBulist.push(this.childManagementInfo[i]);
      }
    }
  }

  getChildDivisionlist(partChildList) {
    partChildList.managementStructureId = partChildList.childbuId;
    partChildList.childDivisionlist = [];
    partChildList.childDepartmentlist = [];
    for (let i = 0; i < this.childManagementInfo.length; i++) {
      if (this.childManagementInfo[i].parentId == partChildList.childbuId) {
        partChildList.childDivisionlist.push(this.childManagementInfo[i]);
      }
    }
  }

  getChildDeptlist(partChildList) {
    partChildList.managementStructureId = partChildList.childDivisionId;
    partChildList.childDepartmentlist = [];
    for (let i = 0; i < this.childManagementInfo.length; i++) {
      if (
        this.childManagementInfo[i].parentId == partChildList.childDivisionId
      ) {
        partChildList.childDepartmentlist.push(this.childManagementInfo[i]);
      }
    }
  }

  getChildDeptId(partChildList) {
    partChildList.managementStructureId = partChildList.childDeptId;
  }

  async getPartPublicationByItemMasterId(itemMasterId) {
    await this.workOrderService
      .getPartPublicationByItemMaster(
        itemMasterId,
        this.authService.currentUser.masterCompanyId
      )
      .subscribe((res) => {
        this.cmmList = res.map((x) => {
          return {
            value: x.publicationRecordId,
            label: x.publicationId,
          };
        });
      });
  }

  async getAllEmployeesByManagmentStructureID() {
    if (this.arrayEmplsit.length == 0) {
      this.arrayEmplsit.push(0, this.authService.currentEmployee.value);
    }
    await this.commonservice
      .autoCompleteDropdownsCertifyEmployeeByMS(
        "",
        true,
        200,
        this.arrayEmplsit.join(),
        this.currentUserManagementStructureId,
        this.authService.currentUser.masterCompanyId
      )
      .subscribe(
        (res) => {
          this.employeeList = res;
        },
        (error) => (error) => this.saveFailedHelper(error)
      );
  }

  addModels(capData) {
    let capbilitiesObj = new ItemMasterCapabilitiesModel();
    capData.selectedManufacturer.forEach((element1) => {
      capbilitiesObj.aircraftTypeId = element1.value;
      capbilitiesObj.aircraftTypeName = element1.label;
      capbilitiesObj.capabilityId = capData.CapabilityTypeId;
      capbilitiesObj.capabilityTypeName = capData.selectedCap;
      capbilitiesObj.aircraftManufacturer = element1.label;
      capbilitiesObj.PartId = capData.selectedPartId;
      capbilitiesObj.itemMasterId = this.itemMasterId;

      capbilitiesObj.manufacturerLabel = capData.manufacturerLabel;
      capbilitiesObj.ataChapterLabel = capData.ataChapterLabel;
      capbilitiesObj.ataSubchapterLabel = capData.ataSubchapterLabel;
      capbilitiesObj.cmmLabel = capData.cmmLabel;
      capbilitiesObj.integrateWithLabel = capData.integrateWithLabel;

      capbilitiesObj.manufacturerId = capData.manufacturerId;
      capbilitiesObj.ataChapterId = capData.ataChapterId;
      capbilitiesObj.ataSubChapterId = capData.ataSubChapterId;
      capbilitiesObj.cmmId = capData.cmmId;
      capbilitiesObj.integrateWith = capData.integrateWith;
      capbilitiesObj.description = capData.description;
      capbilitiesObj.entryDate = capData.entryDate;
      capbilitiesObj.isVerified = capData.isVerified;
      capbilitiesObj.managementStructureId = capData.managementStructureId;
      capbilitiesObj.verifiedBy = capData.verifiedBy;
      capbilitiesObj.dateVerified = capData.dateVerified;
      capbilitiesObj.nteHrs = capData.nteHrs;
      capbilitiesObj.tat = capData.tat;
      capbilitiesObj.aircraftModelName = "Undefined";
      capbilitiesObj.DashNumber = "Undefined";
      capbilitiesObj.AircraftDashNumberId = capData.selectedDashNumbers;

      if (capData.selectedModel.length == 0) {
        let mfObj = this.formBuilder.group(capbilitiesObj);
        this.mfgFormArray.push(mfObj);
        let mfgIndex = this.mfgFormArray.controls.length - 1;
        this.mfgFormArray.controls[mfgIndex]["buList"] = [];
        this.mfgFormArray.controls[mfgIndex]["departmentList"] = [];
        this.mfgFormArray.controls[mfgIndex]["divisionlist"] = [];
      }

      capData.selectedModel.forEach((element2) => {
        if (element2.aircraftTypeId == element1.value) {
          capbilitiesObj.aircraftModelName = element2.label;
          capbilitiesObj.aircraftModelId = element2.value;

          if (capData.selectedDashNumbers2.length == 0) {
            let mfObj = this.formBuilder.group(capbilitiesObj);
            let mfgItemExisted = this.checkIsExisted(
              capData.CapabilityTypeId,
              element1.value,
              element2.value,
              this.mfgFormArray,
              capData
            );
            if (mfgItemExisted == false) {
              this.mfgFormArray.push(mfObj);
              let mfgIndex = this.mfgFormArray.controls.length - 1;
              this.mfgFormArray.controls[mfgIndex]["buList"] = [];
              this.mfgFormArray.controls[mfgIndex]["departmentList"] = [];
              this.mfgFormArray.controls[mfgIndex]["divisionlist"] = [];
            }
          }

          capData.selectedDashNumbers2.forEach((element3) => {
            if (element3.modelId == element2.value) {
              capbilitiesObj.DashNumber = element3.label;
              capbilitiesObj.AircraftDashNumberId = element3.value;
              let mfObj = this.formBuilder.group(capbilitiesObj);
              let mfgItemExisted = this.checkIsExisted(
                capData.CapabilityTypeId,
                element1.value,
                element2.value,
                this.mfgFormArray,
                capData
              );
              if (mfgItemExisted == false) {
                this.mfgFormArray.push(mfObj);
                let mfgIndex = this.mfgFormArray.controls.length - 1;
                this.mfgFormArray.controls[mfgIndex]["buList"] = [];
                this.mfgFormArray.controls[mfgIndex]["departmentList"] = [];
                this.mfgFormArray.controls[mfgIndex]["divisionlist"] = [];
              }
            } else {
              let mfObj = this.formBuilder.group(capbilitiesObj);
              let mfgItemExisted = this.checkIsExisted(
                capData.CapabilityTypeId,
                element1.value,
                element2.value,
                this.mfgFormArray,
                capData
              );
              if (mfgItemExisted == false) {
                this.mfgFormArray.push(mfObj);
                let mfgIndex = this.mfgFormArray.controls.length - 1;
                this.mfgFormArray.controls[mfgIndex]["buList"] = [];
                this.mfgFormArray.controls[mfgIndex]["departmentList"] = [];
                this.mfgFormArray.controls[mfgIndex]["divisionlist"] = [];
              }
            }
          });
        }
      });
    });
  }

  checkIsExisted(capId, type, modal, myForm, capData) {
    let itemExisted = false;
    myForm.controls.forEach((data) => {
      if (
        data["controls"]["capabilityTypeId"].value == capId &&
        data["controls"]["aircraftTypeId"].value == type &&
        data["controls"]["aircraftModelId"].value == modal
      ) {
        itemExisted = true;
        data["controls"]["isDelete"].setValue(false);
      } else {
        let typeId = data["controls"]["aircraftTypeId"].value;
        let typeIndex = capData.selectedAircraftTypes.indexOf(typeId);
        if (typeIndex == -1) {
        }
        let modaleId = data["controls"]["aircraftModelId"].value;
        let modalIndex = capData.selectedAircraftModelTypes.indexOf(modaleId);
        if (modalIndex == -1) {
        }
      }
    });
    return itemExisted;
  }

    saveCapability() {     
        this.selectedItemMasterCapData["updatedBy"]= this.userName;  
        this.selectedItemMasterCapData["createdBy"]= this.userName;  
        this.selectedItemMasterCapData["isVerified"] = (this.selectedItemMasterCapData.isVerified == true || this.selectedItemMasterCapData.isVerified == 'check') ? true : false,
        this.selectedItemMasterCapData["companyId"]=this.selectedItemMasterCapData.levelId1;  
        this.selectedItemMasterCapData["buId"]=this.selectedItemMasterCapData.levelId2;  
        this.selectedItemMasterCapData["divisionId"]=this.selectedItemMasterCapData.levelId3;  
        this.selectedItemMasterCapData["departmentId"]=this.selectedItemMasterCapData.levelId4;  
        this.selectedItemMasterCapData["masterCompanyId"]= this.authService.currentUser.masterCompanyId // DBkeys.MASTER_COMPANY_ID;
        this.selectedItemMasterCapData["verifiedDate"] = this.datePipe.transform(this.selectedItemMasterCapData["verifiedDate"], DBkeys.GLOBAL_DATE_FORMAT);
        this.selectedItemMasterCapData["addedDate"] = this.datePipe.transform(this.selectedItemMasterCapData["addedDate"], DBkeys.GLOBAL_DATE_FORMAT);
        
        this.itemMasterService.updateItemMasterCapes(this.selectedItemMasterCapData.itemMasterCapesId, this.selectedItemMasterCapData).subscribe(res => {
            this.selectedItemMasterCapData = {};

        this.loadData();
        this.alertService.showMessage(
          "Capes",
          "Saved Capes Details Successfully",
          MessageSeverity.success
        );
      });
  }

  onAddCapes() {
    this.showCapes = true;
  }

  onViewCapes(rowData) {
    this.showCapes = true;
    this.selectedItemMasterCapData = rowData;
    //this.getItemMasterDetailsById(rowData.itemMasterId)
  }

  closeCapes() {
    this.showCapes = false;
    this.isCapViewMode = false;

    $("#capes1").modal("hide");
  }

  closeCapesPopup(data) {
    this.closeCapes();
  }

  deleteCapability(content, capabilityId, capabilityType) {
    this.selectedForDeleteCapabilityId = capabilityId;
    this.selectedForDeleteContent = content;
    if (capabilityType != "" && capabilityType != undefined) {
      this.selectedCapabilityType = capabilityType;
    }
    if (this.isDeleteCapabilityPopupOpened == true) {
      this.itemMasterService
        .deleteCapabilityById(capabilityId, "admin")
        .subscribe((res) => {
          this.dismissModel();
          this.isDeleteCapabilityPopupOpened = false;
          this.selectedCapabilityType = "";
          this.alertService.showMessage(
            "Success",
            `Action was deleted successfully`,
            MessageSeverity.success
          );
        });
    } else {
      this.isDeleteCapabilityPopupOpened = true;
      this.modal = this.modalService.open(content, {
        size: "sm",
        backdrop: "static",
        keyboard: false,
      });
    }
  }

  restore(restorePopupId, rowData) {
    this.restorerecord = rowData;
    this.selectedCapabilityType = rowData.capabilityType;
    this.capabilityId = rowData.itemMasterCapesId;
    this.modal = this.modalService.open(restorePopupId, {
      size: "sm",
      backdrop: "static",
      keyboard: false,
    });
  }

  restoreCapability() {
    if (this.capabilityId > 0) {
      this.itemMasterService
        .restoreCapabilityById(this.capabilityId, "admin")
        .subscribe((res) => {
          this.dismissModel();
          this.selectedCapabilityType = "";
          this.alertService.showMessage(
            "Success",
            `Action was Restored successfully`,
            MessageSeverity.success
          );
        });
    }
  }

  enableSave() {
    this.disableSave = false;
  }

  loadCapesList(data) {
    if (this.isView) {
      this.loadData();
    }
  }

  searchCaps() {}

  restoreCapabilityRow(capabilityId) {
    this.itemMasterService
      .restoreCapabilityById(capabilityId, "admin")
      .subscribe(
        (res) => {
          this.alertService.showMessage(
            "Success",
            `Action was Restore successfully`,
            MessageSeverity.success
          );
          this.loadData();
        },
        (error) => (error) => this.saveFailedHelper(error)
      );
  }

  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize);
  }

  pageIndexChange(event) {
    this.itemMasterCapesPageSize = event.rows;
  }

  getAuditHistory(row) {
    this.getItemMasterDetailsById(row.itemMasterId);
    this.isSaving = true;
    this.itemMasterService
      .getItemMasterCapabilityAuditHistory(row.itemMasterCapesId)
      .subscribe(
        (results) => {
          this.capabilityauditHisory = results;
        },
        (error) => this.saveFailedHelper(error)
      );
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.capabilityauditHisory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if (i + 1 === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == "selectedTab") {
        if (changes[property].currentValue == "Capes") {
          this.loadData();
          this.ptnumberlistdata();
        }
      }
    }
  }

  dismissCapesViewModal() {
    $("#viewCap").modal("hide");
  }

  dismissCapesHistoryModal() {
    $("#viewHistory").modal("hide");
  }

  getItemMasterDetailsById(itemmasterid) {
    this.isSpinnerVisible = true;
    this.itemMasterService.getItemMasterDetailById(itemmasterid).subscribe(
      (res) => {
        this.partData = res[0];

        this.isSpinnerVisible = false;
      },
      (error) => {
        this.onDataLoadFailed(error);
      }
    );
  }

  onAddTextAreaInfo(value, content) {
    this.textAreaInfo = this.selectedItemMasterCapData.memo;
    this.disableSaveMemo = true;
    $("#capes-memo").modal("show");

    //this.modal = this.modalService.open(content, { size: 'sm' });
    // if(value == 'memo') {
    // 	//this.textAreaLabel = 'Memo';
    // 	this.textAreaInfo = this.selectedItemMasterCapData.memo;
    // }
  }

  onSaveTextAreaInfo() {
    this.selectedItemMasterCapData.memo = this.textAreaInfo;
    // if(this.textAreaLabel == 'Memo') {
    // 	this.selectedItemMasterCapData.memo = this.textAreaInfo;
    // }
  }

  getCapesListOnDeleteStatus(value) {
    this.currentDeleteStatus = value;
    this.loadData();
  }

  closeDeleteModal() {
    $("#downloadConfirmation").modal("hide");
  }

  exportCSV(dt) {
    dt._value = dt._value.map((x) => {
      return {
        ...x,
        isVerified: x.isVerified == 1 ? "check" : "unchecked",
        memo: x.memo.replace(/<[^>]*>/g, ""),
        addedDate: x.addedDate
          ? this.datePipe.transform(x.addedDate, "MMM-dd-yyyy hh:mm a")
          : "",
        verifiedDate: x.verifiedDate
          ? this.datePipe.transform(x.verifiedDate, "MMM-dd-yyyy")
          : "",
        createdDate: x.createdDate
          ? this.datePipe.transform(x.createdDate, "MMM-dd-yyyy hh:mm a")
          : "",
        updatedDate: x.updatedDate
          ? this.datePipe.transform(x.updatedDate, "MMM-dd-yyyy hh:mm a")
          : "",
      };
    });
    dt.exportCSV();
  }

  errorMessageHandler(log) {
    const errorLog = log;
    var msg = "";
    if (errorLog.message) {
      if (errorLog.error && errorLog.error.errors.length > 0) {
        for (let i = 0; i < errorLog.error.errors.length; i++) {
          msg = msg + errorLog.error.errors[i].message + "<br/>";
        }
      }
      this.alertService.showMessage(
        errorLog.error.message,
        msg,
        MessageSeverity.error
      );
    } else {
      this.alertService.showMessage("Error", log.error, MessageSeverity.error);
    }
  }

  columnsChanges() {}
}
