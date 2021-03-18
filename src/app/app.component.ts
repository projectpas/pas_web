import {
  Component,
  ChangeDetectorRef,
  ViewChild,
  ViewEncapsulation,
  OnInit,
  ElementRef,
  AfterViewInit,
  Injectable,
  HostListener,
  AfterContentChecked,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router, NavigationStart } from '@angular/router';
import { MatExpansionPanel, MatDialog } from '@angular/material';
import {
  ToastyService,
  ToastyConfig,
  ToastOptions,
  ToastData,
} from 'ng2-toasty';
import {
  AlertService,
  AlertMessage,
  MessageSeverity,
} from './services/alert.service';
import { NotificationService } from './services/notification.service';
import { AppTranslationService } from './services/app-translation.service';
import { AccountService } from './services/account.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { AppTitleService } from './services/app-title.service';
import { AuthService } from './services/auth.service';
import { ConfigurationService } from './services/configuration.service';
import { Permission } from './models/permission.model';
import { LoginDialogComponent } from './components/login/login-dialog.component';
import { AppDialogComponent } from './shared/app-dialog.component';
import { CustomerService } from './services/customer.service';
import { Globals } from './globals';
import { CrmService } from './services/crm.service';

import { MenuItem } from 'primeng/components/common/menuitem'; //Bread crumb
import { VendorService } from './services/vendor.service';
import { LegalEntityService } from './services/legalentity.service';
import { EmployeeService } from './services/employee.service';
import { StocklineReferenceStorage } from './components/stockline/shared/stockline-reference-storage';
import { SalesOrderReferenceStorage } from './components/sales/shared/sales-order-reference-storage';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserRoleService } from './components/user-role/user-role-service';
import { ModuleHierarchyMaster } from './components/user-role/ModuleHierarchyMaster.model';
environment
@Component({
  selector: 'quickapp-pro-app',
  templateUrl: './app.component.html',
  styleUrls: ['./styles.scss', './app.component.scss', './global-styles.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, AfterViewInit {
  public items: MenuItem[]; //BreadCrumb Implimentation
  megaMenuItems: MenuItem[];
  @ViewChild('admin', { static: false }) adminExpander: MatExpansionPanel;
  routeActive: string = 'active';
  private _mobileQueryListener: () => void;
  isAppLoaded: boolean;
  isUserLoggedIn: boolean = false;
  isAdminExpanded: boolean = false;
  removePrebootScreen: boolean;
  newNotificationCount = 0;
  appTitle = 'PAS';
  userCollapsed: boolean = false;
  mobileQuery: MediaQueryList;
  stickyToasties: number[] = [];
  dataLoadingConsecutiveFailures = 0;
  notificationsLoadingSubscription: any;
  navIsFixed: any;
  closeCmpny: boolean = true;
  step: number;
  managementStructure: any = {};
  moduleHierarchy: ModuleHierarchyMaster[];
  childMenu: MenuItem[] = [];
  menuArray=[];
  setStep(index: number) {
    this.step = index;
  }
  isSticky: any;
  @ViewChild('fixedButtons', { static: false }) el: ElementRef;
  subscription: Subscription;
  //   @HostListener('window:scroll', [])
  //     onWindowScroll() {
  //       let number = this.el.nativeElement.offsetTop;
  //       if (number > 65) {
  //         this.navIsFixed = true;
  //       } else if (this.navIsFixed && number < 10) {
  //         this.navIsFixed = false;
  //       }
  //     }
  get notificationsTitle() {
    let gT = (key: string) => this.translationService.getTranslation(key);
    if (this.newNotificationCount) {
      return `${gT('app.Notifications')} (${this.newNotificationCount} ${gT(
        'app.New'
      )})`;
    } else {
      return gT('app.Notifications');
    }
  }
  constructor(
    storageManager: LocalStoreManager,
    private toastyService: ToastyService,
    private toastyConfig: ToastyConfig,
    private accountService: AccountService,
    private alertService: AlertService,
    private notificationService: NotificationService,
    private appTitleService: AppTitleService,
    private authService: AuthService,
    public translationService: AppTranslationService,
    public configurations: ConfigurationService,
    public router: Router,
    public dialog: MatDialog,
    private empService: EmployeeService,
    private vendorService: VendorService,
    private entityService: LegalEntityService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private customerService: CustomerService,
    private crmService: CrmService,
    private globals: Globals,
    private stocklineReferenceStorage: StocklineReferenceStorage,
    private salesOrderReferenceStorage: SalesOrderReferenceStorage,
    private userRoleService: UserRoleService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    storageManager.initialiseStorageSyncListener();
    translationService.addLanguages(['en', 'fr', 'de', 'pt', 'ar', 'ko']);
    translationService.setDefaultLanguage('en');
    this.toastyConfig.theme = 'material';
    this.toastyConfig.position = 'top-right';
    this.toastyConfig.limit = 100;
    this.toastyConfig.showClose = true;
    this.routeActive = 'active';
    this.appTitleService.appName = this.appTitle;
  
  }
 
  
  showthis() {
    this.translationService.closeCmpny = true;
  }
  closethis() {
    this.translationService.closeCmpny = false;
  }
  panelOpenState() {
    this.userCollapsed = true;
  }

  ngAfterViewInit() { }

  dynamicMenu() {
    this.megaMenuItems = [];
    for (let module of this.menuArray) {
      var menu: MenuItem = {};
      menu.label = module.Name;
      menu.icon = module.ModuleIcon;
      menu.routerLink = module.RouterLink;
      menu.id = String(module.ID);
      menu.automationId = module.ParentID;
      if(this.megaMenuItems.length==0){
        this.megaMenuItems.push(menu);
      }
      else{
        var isDuplicate=this.megaMenuItems.filter(function(item){
          return item.label==menu.label
        })
        if(isDuplicate.length==0){
          this.megaMenuItems.push(menu);
        }

      }
      
    }
    
    // console.log(this.getDataByParentId(this.megaMenuItems,null));
    
    
    //this.megaMenuItems= this.getDataByParentId(this.megaMenuItems,null);

    var r = this.getDataByParentId(this.megaMenuItems, null);

    this.megaMenuItems = r;
  }


  getDataByParentId(data, parent): MenuItem[] {
    const result = data
      .filter(d => d.automationId == parent);

    if (!result && !result.length) {
      return null;
    }

    return result.map(({ id, label, icon, routerLink, automationId }) =>
      ({
        id, label, icon, routerLink, automationId, items: automationId == null ? [this.getDataByParentId(data, id)] : this.getDataByParentId(data, id),
        command: label == "Create Vendor" ? (event?: any) => {
          this.newVendorClick();
        } : null
      })
    );
  }

  ngOnInit() {
    debugger;
    // console.log(this.authService.currentUser.roleID);
    // this.userRoleService.getUserMenuByRoleId(this.authService.currentUser.roleID).subscribe(data => {
    //   console.log(data[0]);
    //   this.moduleHierarchy = data[0];

    //   this.dynamicMenu();
    // }
    // );

    this.megaMenuItems = [
      {
        label: 'Dashboard',
        icon: 'fa fa-fw fa-home',
        routerLink: '/home',

      },
      {
        label: 'Master',
        icon: 'fa fa-fw fa-group',
        items: [
          [
            {
              label: 'Customers',
              items: [
                {
                  label: 'Customers List',
                  routerLink:
                    '/customersmodule/customerpages/app-customers-list',
                },
                {
                  label: 'Create Customer',

                  routerLink:
                    '/customersmodule/customerpages/app-customer-create',
                },
              ],

            },
            {
              label: 'Invoice',
              items: [
                { label: 'Invoice List', routerLink: '/#' },
                { label: 'Create Invoice', routerLink: '/#' },
                { label: 'Customer RMA', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports & Forms',
              items: [
                { label: 'Invoice Register', routerLink: '' },
                { label: 'Invoice Batches', routerLink: '' },
                {
                  label: 'Customer Statement Report', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCustomer+Statement&rs:Command=Render');
                  }
                }
              ],
            },
          ],
          [
            {
              label: 'Vendor',
              items: [
                {
                  label: 'Vendor List',
                  routerLink: '/vendorsmodule/vendorpages/app-vendors-list',
                },
                {
                  label: 'Create Vendor',
                  command: (event?: any) => {
                    this.newVendorClick();
                  },
                },
              ],
            },
            {
              label: 'Vendor Capabilities',
              items: [
                {
                  label: 'Vendor Capes List',
                  routerLink:
                    '/vendorsmodule/vendorpages/app-vendor-capabilities-list',
                },
                {
                  label: 'Create Vendor Capes',
                  routerLink:
                    '/vendorsmodule/vendorpages/app-add-vendor-capabilities',
                },
                {
                  label: 'Capes Report', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/Reports/report/Report%20Project1/Capabilities');
                  }
                }
              ],
            },
            {
              label: 'Reports & Forms',
              items: [
                { label: 'Open RO Report', routerLink: '/#' },
                // { label: 'Repair Order WO/SO', routerLink: '/#' },
              ],
            },
          ],
          [
            {
              label: 'Employees',
              items: [
                {
                  label: 'Employee List',
                  routerLink:
                    '/employeesmodule/employeepages/app-employees-list',
                },
                // { label: 'Create Employee', routerLink: '/employeesmodule/employeepages/app-employee-general-information' },
                {
                  label: 'Create Employee',
                  command: (event?: any) => {
                    this.newEmployeeClick();
                  },
                },
              ],
            },
            {
              label: 'Expense Reports',
              items: [
                { label: 'Expense List', routerLink: '/#' },
                { label: 'Create', routerLink: '/#' },
                { label: 'Approval', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports & Forms',
              items: [
                { label: 'Employee List Report', routerLink: '/#' },
                { label: 'Productivity', routerLink: '/#' },
                { label: 'Commission', routerLink: '/#' },
              ],
            },
          ],
          [
            {
              label: 'Publications',
              icon: 'fa fa-fw fa-newspaper-o',
              items: [
                {
                  label: 'Publications List',
                  routerLink: '/singlepages/singlepages/app-publication',
                },
                {
                  label: 'Create Publications',
                  routerLink: '/singlepages/singlepages/app-create-publication',
                },
              ],
            },
            {
              label: 'Reports & Forms',
              items: [{ label: 'CMM by PIN', routerLink: '/#' },
              {
                label: 'Publication Tracking', command: (event?: any) => {
                  this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPublication+Tracking&rs:Command=Render');
                }
              }],
            },

          ],
          [
            {
              label: 'CRM',
              icon: 'fa fa-funnel-dollar',
              items: [
                {
                  label: 'CRM List',
                  routerLink: '/customersmodule/customerpages/app-crm-list',
                },
                {
                  label: 'Deals List',
                  routerLink: '/customersmodule/customerpages/app-deals-list',
                },
                {
                  label: 'Leads List',
                  routerLink: '/customersmodule/customerpages/app-leads-list',
                },
                {
                  label: 'Opportunity List',
                  routerLink: '/customersmodule/customerpages/app-opportunity-list',
                },
              ],
            },

          ],
        ],
      },
      {
        label: 'Accounts',
        icon: 'fa fa-fw fa-list-alt',
        items: [
          [
            {
              label: 'General Ledger',
              items: [
                {
                  label: 'GL Account List',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-account-listing',
                },
                {
                  label: 'Create GL Account',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-account-listing-create',
                },
                {
                  label: 'Create Accounting Calendar',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-accounting-calendar',
                },
                {
                  label: 'Accounting Calendar List',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-accounting-listing-calendar',
                },
                {
                  label: 'Open/Close Ledger',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-open-close-ledger',
                },
                { label: 'Intercompany', routerLink: '/#' },

                // {
                //   label: 'PO-RO Category',
                //   routerLink:
                //     '/generalledgermodule/generalledgerpage/app-po-ro-category',
                // },
              ],
            },
            {
              label: 'Payment Description',
              items: [
                { label: 'Cutomer', routerLink: '/#' },
                { label: 'Vendor', routerLink: '/#' },
              ],
            },
          ],
          [
            {
              label: 'Financial Statement',
              items: [
                {
                  label: 'Node List',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-node-setup',
                },
                { label: 'Income Statement', routerLink: '/#' },
                { label: 'Balance Sheet', routerLink: '/#' },
                { label: 'Statement of CashFlows', routerLink: '/#' },
                { label: 'Other Structures', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports and Forms',
              items: [
                { label: 'Trial Balance', routerLink: '/#' },
                { label: 'Income Statement', routerLink: '/#' },
                { label: 'Balance Sheet', routerLink: '/#' },
              ],
            },
          ],
          [
            {
              label: 'Journals',
              items: [
                {
                  label: 'Journal List',
                  routerLink: '/accountmodule/accountpages/app-list-journel',
                },
                {
                  label: 'Create Journal Entry',
                  routerLink: '/accountmodule/accountpages/app-create-journel',
                },
                {
                  label: 'Schedule',
                  routerLink: '/accountmodule/accountpages/app-schedule',
                },
              ],
            },
            {
              label: 'Organization',
              items: [
                {
                  label: 'Legal Entity List',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-legal-entity-list',
                },
                {
                  label: 'Create Legal Entity',
                  command: (event?: any) => {
                    this.newLegalEntityClick();
                  },
                },
                //{ label: 'Legal Structure', routerLink: '/#' },
                {
                  label: 'Management Structure',
                  routerLink:
                    '/generalledgermodule/generalledgerpage/app-managemententity-structure',
                },
              ],
            },
          ],
          [
            {
              label: 'Accounts Receivable',
              items: [
                { label: 'Customer Invoice List', routerLink: '/accountreceivable/accountreceivablepages/app-customer-invoice-list' },
                { label: 'Process Customer Credit', routerLink: '/#' },
                {
                  label: 'Open/Close AR Sub-Ledger',
                  routerLink:
                    '/accountreceivable/accountreceivablepages/app-open-close-ar-subledger',
                },
              ],
            },
            {
              label: 'Reports and Forms',
              items: [
                { label: 'AR Aging', routerLink: '/#' },
                { label: 'History By Customer', routerLink: '/#' },
                { label: 'History By Payment', routerLink: '/#' },
                { label: 'Customer Statement', routerLink: '/#' },
              ],
            },
            {
              label: 'Customer Receipts',
              items: [
                { label: 'Customer Accounts', routerLink: '/#' },
                { label: 'Customer Payments', routerLink: '/#' },
                { label: 'Print Deposit', routerLink: '/#' },
                { label: 'Payment History', routerLink: '/#' },
              ],
            },
          ],
          [
            {
              label: 'Accounts Payable',
              items: [
                { label: 'Vendor Invoice List', routerLink: '/#' },
                { label: 'Enter Invoices', routerLink: '/#' },
                { label: 'Vendor Credit', routerLink: '/#' },
                {
                  label: 'Open/Close AP Subledger',
                  routerLink:
                    '/accountpayble/accountpayble/app-open-close-ap-subledger',
                },
                { label: 'Print Checks', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports and Forms',
              items: [
                { label: 'AP Register', routerLink: '/#' },
                { label: 'AR Aging', routerLink: '/#' },
                { label: 'History By Invoice', routerLink: '/#' },
                { label: 'History By Payment', routerLink: '/#' },
                { label: 'Open Vendor Invoice', routerLink: '/#' },
                { label: 'Check Register', routerLink: '/#' },
              ],
            },
            {
              label: 'Vendor Payments',
              items: [
                { label: 'Vendor Accounts', routerLink: '/#' },
                { label: 'Process Checks', routerLink: '/#' },
                { label: 'Reconcile', routerLink: '/#' },
                { label: 'Print Check', routerLink: '/#' },
                { label: 'Print Check Batch', routerLink: '/#' },
                { label: 'Print Check Register', routerLink: '/#' },
              ],
            },
          ],
        ],
      },
      {
        label: 'Order',
        icon: 'fa fa-fw fa-shopping-cart',
        items: [
          [
            {
              label: 'Purchase Order',
              items: [
                {
                  label: 'PO List',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-polist',
                },
                {
                  label: 'Create PO',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-create-po',
                },
                {
                  label: 'PO Approval',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-po-approval',
                },
                {
                  label: 'PO Approval Rule',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-po-approval-rule',
                },
                {
                  label: 'PO Setting',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-po-settings',
                },
                { label: 'Create Vendor RMA', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports & Forms',
              items: [
                {
                  label: 'PO Report',
                  // routerLink:
                  //   '/workordersmodule/workorderspages/app-purchase-order-report',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPurchase+Order&rs:Command=Render');
                  },

                },
                {
                  label: 'Purchase order Dashboard', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPurchase+Order+Dashboard&rs:Command=Render');
                  }
                },
                {
                  label: 'PO TO WO-SO', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPO+to+WO-SO&rs:Command=Render');
                  }
                }
              ],
            },
          ],
          [
            {
              label: 'Sales Order',
              items: [
                {
                  label: 'SO List',
                  routerLink: '/salesmodule/salespages/sales-order-list',
                },
                // {
                //   label: 'Create SO',
                //   routerLink: '/salesmodule/salespages/sales-order',
                // },
                { label: 'SO Shipping', routerLink: '/#' },
                { label: 'SO Billing', routerLink: '/#' },
                { label: 'SO Confirmation List', routerLink: '/salesmodule/salespages/sales-order-confirmation-list' },
                {
                  label: 'Sales Order Approval Rule',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/salesmodule/salespages/app-so-approval-rule',
                }
              ],
            },
            {
              label: 'SO Quote',
              items: [
                {
                  label: 'SO Quote List',
                  routerLink: '/salesmodule/salespages/sales-quote-list',
                },
                // {
                //   label: 'Create SO Quote',
                //   routerLink: '/salesmodule/salespages/sales-quote',
                // },
                { label: 'Open SO Quotes', routerLink: '/#' },
                { label: 'Approved SO Quotes', routerLink: '/#' },
                {
                  label: 'Sales Order Quote Approval Rule',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/salesmodule/salespages/app-soq-approval-rule',
                },
              ],
            },
            {
              label: 'Sales Order Settings',
              items: [
                {
                  label: 'SO Quote Settings List',
                  routerLink:
                    '/salesordersettingsmodule/salesordersettings/app-sales-quote-settings-list',
                }, {
                  label: 'SO Settings List',
                  routerLink:
                    '/salesordersettingsmodule/salesordersettings/app-sales-order-settings-list',
                },
              ],
            },
            {
              label: 'Reports & forms',
              items: [
                { label: 'Open Sales list', routerLink: '/#' },
                { label: 'SO Backlog', routerLink: '/#' },
                {
                  label: 'SO On Time Perfomance', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+On+Time+Performance&rs:Command=Render');
                  },
                },
                {
                  label: 'SO Quotes',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Quote+Report&rs:Command=Render');
                  },
                },
                {
                  label: 'SO Quote Conversion',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Quote+Conversion&rs:Command=Render');
                  },
                }, {
                  label: 'SO Quote History',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Quote+History&rs:Command=Render');
                  },
                }, {
                  label: 'SO Billing',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Billing&rs:Command=Render');
                  },
                }, {
                  label: 'SO Gross Margin',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Gross+Margin&rs:Command=Render');
                  },
                }, {
                  label: 'Salesperson Report',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSalesperson+Report&rs:Command=Render');
                  },
                },
                {
                  label: 'SO Turn Around Time (TAT)', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+-+Turn+Around+Time+(TAT)&rs:Command=Render');
                  }
                }
              ],
            },
          ],
          [
            {
              label: 'Work Order',
              items: [
                {
                  label: 'Work Order List',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-list',
                },
                {
                  label: 'Create Work Order',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-add',
                },
                { label: 'WO Shipping', routerLink: '/#' },
                { label: 'WO Billing', routerLink: '/#' },
                {
                  label: 'Work Order Approval Rule',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/workordersmodule/workorderspages/app-wo-approval-rule',
                },
                {
                  label: 'Work Order Quote Approval Rule',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/workordersmodule/workorderspages/app-woq-approval-rule',
                }
              ],
            },
            {
              label: 'Direct Labour',
              items: [
                {
                  label: 'Direct Labour and OH Cost',
                  routerLink:
                    '/workordersmodule/workorderspages/app-direct-labour',
                },
                {
                  label: 'Direct Labour Add',
                  routerLink:
                    '/workordersmodule/workorderspages/app-direct-labour-add',
                },
              ],
            },
            {
              label: 'Reports and Forms',
              items: [
                {
                  label: 'WIP Summary',
                  routerLink: '/#',
                },
                {
                  label: 'WIP Details',
                  routerLink: '/#',
                },
                {
                  label: 'WO Backlog',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Backlog&rs:Command=Render');
                  },
                },
                {
                  label: 'WO On Time Performance',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+On+Time+Performance&rs:Command=Render');
                  },
                },
                {
                  label: 'Work Order Tracking',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Tracking&rs:Command=Render');
                  },
                },
                {
                  label: 'WO Quotes',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Quotes&rs:Command=Render');
                  },
                },
                {
                  label: 'WO Quote Conversion',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Quote+Conversion&rs:Command=Render');
                  },
                },
                {
                  label: 'WO Quote History',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Quote+History&rs:Command=Render');
                  },
                },
                {
                  label: 'WO Billing',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Billing&rs:Command=Render');
                  },
                },
                {
                  label: 'WO Gross Margin',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Gross+Margin&rs:Command=Render');
                  },

                },
                {
                  label: 'Labor Tracking', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fLabor+Tracking&rs:Command=Render');
                  }
                },
                {
                  label: 'Tech Productivity', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTech+Productivity&rs:Command=Render');
                  }
                },
                {
                  label: 'Turn Around Time (TAT)', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+-Turn+Around+Time+(TAT)&rs:Command=Render');
                  }
                }
              ],
            },
            {
              label: 'Work-order Quote',
              items: [
                {
                  label: 'WO Quote List',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-quote-list',
                },
                {
                  label: 'Create  WO Quote',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-quote',
                },
                { label: 'WO Quote Approvals', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports and Forms',
              items: [
                {
                  label: 'Open WO Quote',
                  routerLink: '/#',
                },
                {
                  label: 'Approved WO Quote',
                  routerLink: '/#',
                },
                {
                  label: 'Work Order Report',
                  routerLink:
                    '/workordersmodule/workorderspages/app-workorder-report',
                },

                {
                  label: 'Inventory Report',
                  routerLink:
                    '/workordersmodule/workorderspages/app-inventory-report',
                },
              ],
            },
          ],
          [
            {
              label: 'Repair Order',
              items: [
                {
                  label: 'RO List',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-ro-list',
                },
                {
                  label: 'Create RO',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-create-ro',
                },
                {
                  label: 'RO Approval',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-ro-approval',
                },
                {
                  label: 'RO Approval Rule',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-ro-approval-rule',
                },
                {
                  label: 'RO Settings',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-ro-settings',
                }
              ],
            },
            {
              label: 'Reports & forms',
              items: [
                {
                  label: 'Repair order by WO & SO', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fRepair+Order+by+WO+and+SO&rs:Command=Render');
                  }
                },
              ]
            }

          ],
        ],
      },
      {
        label: 'Stock',
        icon: 'fa fa-fw fa-folder-open',
        items: [
          // [
          //   {
          //     label: 'Asset Management',
          //     items: [
          //       {
          //         label: 'Asset Inventory List',
          //         routerLink:
          //           '/assetmodule/assetpages/app-asset-inventory-listing',
          //       },
          //       {
          //         label: 'Create Asset Inventory',
          //         routerLink:
          //           '/assetmodule/assetpages/app-create-asset-inventory',
          //       },
          //       {
          //         label: 'Disposal Sale',
          //         routerLink: '/assetmodule/assetpages/app-asset-disposal-sale',
          //       },
          //       { label: 'Periodic Depreciation', routerLink: '/#' },
          //       { label: 'Asset Adjustment', routerLink: '/#' },
          //       { label: 'Calibration Management', routerLink: '/#' },
          //       { label: 'Leases & Insurance', routerLink: '/#' },
          //       { label: 'Asset Maintenance', routerLink: '/#' },
          //       { label: 'Depreciation Forecast', routerLink: '/#' },
          //     ],
          //   },
          //   {
          //     label: 'Assets',
          //     items: [
          //       {
          //         label: 'Asset List',
          //         routerLink: '/assetmodule/assetpages/app-asset-listing',
          //       },
          //       {
          //         label: 'Create Asset',
          //         routerLink: '/assetmodule/assetpages/app-create-asset',
          //       },
          //     ],
          //   },
          //   {
          //     label: 'Report & Forms',
          //     items: [
          //       { label: 'List Report', routerLink: '/#' },
          //       { label: 'Depreciation', routerLink: '/#' },
          //       { label: 'Additons', routerLink: '/#' },
          //       { label: 'Disposal', routerLink: '/#' },
          //       {
          //         label: 'Tools', command: (event?: any) => {
          //           this.navigateToURL(environment.reportUrl+'/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTools&rs:Command=Render');
          //         }
          //       }
          //     ],
          //   },

          // ],
          [
            {
              label: 'Stock Line',
              items: [
                {
                  label: 'Stock Line List',
                  routerLink:
                    '/stocklinemodule/stocklinepages/app-stock-line-list',
                },
                {
                  label: 'Create Stock Line',
                  routerLink:
                    '/stocklinemodule/stocklinepages/app-stock-line-setup',
                },
              ],
            },
            {
              label: 'Reports and Forms',
              items: [
                { label: 'Item Aging', routerLink: '/#' },
                { label: 'Slow Moving Stock', routerLink: '/#' },
                { label: 'Hot List', routerLink: '/#' },
                {
                  label: 'Stock Line', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fStockLine&rs:Command=Render');
                  }
                }
              ],
            },
          ],
          [
            {
              label: 'Workflow',
              items: [
                {
                  label: 'Workflow List',
                  routerLink: '/workflowmodule/workflowpages/app-workflow-list',
                },
                {
                  label: 'Create Workflow',
                  routerLink: '/workflowmodule/workflowpages/wf-create',
                },
                {
                  label: 'Task',
                  routerLink: '/singlepages/singlepages/app-tasks',
                },
                {
                  label: 'Task Attribute',
                  routerLink: '/singlepages/singlepages/app-task-attributes',
                },
              ],
            },
          ],
          [
            {
              label: 'Item Master',
              icon: 'fa fa-fw fa-vcard-o ',
              items: [
                {
                  label: 'Item List',
                  routerLink:
                    '/itemmastersmodule/itemmasterpages/app-item-master-list',
                },
                {
                  label: 'Create Item Master',
                  routerLink:
                    '/itemmastersmodule/itemmasterpages/app-item-master-stock',
                },
              ],
            },
            {
              label: ' Capabilities',
              items: [
                {
                  label: 'Capabilities List',
                  routerLink:
                    '/itemmastersmodule/itemmasterpages/app-item-master-capabilities-list',
                },
                {
                  label: 'Create Capabilities',
                  routerLink:
                    '/itemmastersmodule/itemmasterpages/app-item-master-create-capabilities',
                },
              ],
            },
            {
              label: 'Reports & Forms',
              items: [
                // { label: 'Capabilities List', routerLink: '/#' },
                {
                  label: 'Capabilities List Report', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCapabilities&rs:Command=Render');
                  }
                }



              ],
            },
          ],
        ],
      },
      {
        label: 'Asset Management',
        icon: 'fa fa-fw fa-folder-open',
        items: [
          [
            {
              label: 'Asset Management',
              items: [
                {
                  label: 'Asset Inventory List',
                  routerLink:
                    '/assetmodule/assetpages/app-asset-inventory-listing',
                },
                {
                  label: 'Add Asset Inventory',
                  routerLink:
                    '/assetmodule/assetpages/app-create-asset-inventory',
                },
                {
                  label: 'Asset List',
                  routerLink: '/assetmodule/assetpages/app-asset-listing',
                },
                {
                  label: 'Create Asset',
                  routerLink: '/assetmodule/assetpages/app-create-asset',
                },
                { label: 'Calibration Mgmt', routerLink: '/#' },
                { label: 'Asset Maintenance', routerLink: '/#' },
                { label: 'Leases and Insurance', routerLink: '/#' },
                // {
                //   label: 'Disposal Sale',
                //   routerLink: '/assetmodule/assetpages/app-asset-disposal-sale',
                // },

              ],
            },
            {
              label: 'Accounting',
              items: [
                { label: 'Process Depreciation', routerLink: '/#' },
                { label: 'Asset Adjustment', routerLink: '/#' },

                { label: 'Asset Sale, Write Off, Write Down', routerLink: '/#' },

                { label: 'Depreciation Forecast', routerLink: '/#' },
              ],
            },
            {
              label: 'Report & Forms',
              items: [
                { label: 'Reports List ', routerLink: '/#' },
                { label: 'Depreciation', routerLink: '/#' },
                { label: 'Additons', routerLink: '/#' },
                { label: 'Disposal', routerLink: '/#' },
                {
                  label: 'Tools List', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTools&rs:Command=Render');
                  }
                },
                { label: 'Calibration List ', routerLink: '/#' },
                { label: 'Calibration Due Report', routerLink: '/#' }

              ],
            },
            // {
            //   label: 'Tools',
            //   items: [
            //     {
            //       label: 'Tools List', command: (event?: any) => {
            //         this.navigateToURL(environment.reportUrl+'/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTools&rs:Command=Render');
            //       }
            //     },
            //     { label: 'Calibration List ', routerLink: '/#' },
            //     { label: 'Calibration Due Report', routerLink: '/#' }
            //   ],
            // },
          ],

        ],
      },
      {
        label: 'Admin',
        icon: 'fa fa-fw fa-user',
        items: [
          [
            {
              label: 'General',
              items: [
                { label: 'Bulk Emails', routerLink: '/#' },
                { label: 'Code Prefixes', routerLink: '/#' },
                { label: 'Customer CRM', routerLink: '/#' },
                { label: 'Email Config', routerLink: '/#' },
                {
                  label: 'Global Settings',
                  routerLink: 'admin/global-settings',
                },
                { label: 'Approval Rule', routerLink: 'admin/po-approvals' },
                { label: 'Notifications', routerLink: '/#' },
              ],
            },
            {
              label: 'Employee',
              items: [
                { label: 'Employee List Approval', routerLink: '/#' },
                { label: 'Employee Management', routerLink: '/#' },
              ],
            },
            {
              label: 'Roles',
              items: [
                {
                  label: 'Roles List',
                  routerLink: '/rolesmodule/rolespages/edit-app-roles',
                },
                {
                  label: 'Roles List by Module',
                  routerLink:
                    '/rolesmodule/rolespages/app-roles-list-by-module',
                },
                {
                  label: 'Create Role',
                  routerLink: '/rolesmodule/rolespages/app-roles-setup',
                },
              ],
            },
            {
              label: 'Work Order Settings',
              items: [
                {
                  label: 'Work Order Settings List',
                  routerLink:
                    '/workordersettingsmodule/workordersettings/app-work-order-settings-list',
                },
                {
                  label: 'WO Quote Settings List',
                  routerLink:
                    '/workordersettingsmodule/workordersettings/app-wo-quote-settings-list',
                },
                // {
                //   label: 'Teardown Reason',
                //   routerLink: '/singlepages/singlepages/app-teardown-reason',
                // },
              ],
            }
          ],
          [
            {
              label: 'Receivable',
              items: [
                {
                  label: 'Purchase Order',
                  routerLink:
                    '/receivingmodule/receivingpages/app-purchase-order',
                },
                {
                  label: 'Repair Order',
                  routerLink: '/receivingmodule/receivingpages/app-ro',
                },
                {
                  label: 'Shipping Receiver',
                  routerLink: '/receivingmodule/receivingpages/app-shipping',
                },
                { label: 'Work Order', routerLink: '/#' },
              ],
            },
            {
              label: 'Customer Work List ',
              items: [
                {
                  label: 'Receive Customer List',
                  routerLink:
                    '/receivingmodule/receivingpages/app-customer-works-list',
                },
                {
                  label: 'Receive Customer',
                  routerLink:
                    '/receivingmodule/receivingpages/app-customer-work-setup',
                },
              ],
            },
            {
              label: 'Reports and forms',
              items: [
                {
                  label: 'Receiving Log',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fReceiving+Log&rs:Command=Render');
                  }
                },
                // {
                //   label: 'Receiving Log Report',
                //   routerLink:
                //     '/workordersmodule/workorderspages/app-receiving-log-report',
                // },
                {
                  label: 'Receive customer work', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCustomer+Work&rs:Command=Render');
                  }
                }
              ],
            },
          ],
          [
            {
              label: 'Contract Management',
              items: [
                { label: 'Contract List', routerLink: '/#' },
                { label: 'Contract Setup', routerLink: '/#' },
                // {
                //   label: 'Reasons',
                //   routerLink: '/singlepages/singlepages/app-reason',
                // },
                // {
                //   label: 'Teardown Reason',
                //   routerLink: '/singlepages/singlepages/app-teardown-reason',
                // },
                // { label: 'Findings', routerLink: '/#' },
                // {
                //   label: 'Work Performed',
                //   routerLink: '/singlepages/singlepages/app-work-performed',
                // },
              ],
            },

          ],
        ],
      },
      //{
      //  label: 'Master Maintenance',
      //  icon: 'fa fa-fw fa-cogs',
      //  items: [
      //    [
      //      {
      //        label: 'Item Master',
      //        items: [
      //          {
      //            label: 'Unit of Measure',
      //            routerLink: '/singlepages/singlepages/app-unit-of-measure',
      //          },
      //          {
      //            label: 'Item Group',
      //            routerLink: '/singlepages/singlepages/app-item-group',
      //          },
      //          {
      //            label: 'Item Classification',
      //            routerLink: '/singlepages/singlepages/app-item-classification',
      //          },
      //          {
      //            label: 'Manufacturer',
      //            routerLink: '/singlepages/singlepages/app-manufacturer',
      //          },
      //          {
      //            label: 'Site',
      //            routerLink: '/singlepages/singlepages/app-site',
      //          },
      //          {
      //            label: 'Warehouse',
      //            routerLink: '/singlepages/singlepages/app-warehouse',
      //          },
      //          {
      //            label: 'Location',
      //            routerLink: '/singlepages/singlepages/app-location',
      //          },
      //          {
      //            label: 'Shelf',
      //            routerLink: '/singlepages/singlepages/app-shelf',
      //          },
      //          { label: 'Bin', routerLink: '/singlepages/singlepages/app-bin' },
      //        ],
      //      },
      //      {
      //        label: 'Work Orders',
      //        items: [
      //          {
      //            label: 'Stage Code and Status',
      //            routerLink: '/singlepages/singlepages/app-stage-code',
      //          },
      //          {
      //            label: 'Charges',
      //            routerLink: '/singlepages/singlepages/app-charges',
      //          },
      //          {
      //            label: 'Reasons',
      //            routerLink: '/singlepages/singlepages/app-reason',
      //          },
      //          {
      //            label: 'Teardown Reason',
      //            routerLink: '/singlepages/singlepages/app-teardown-reason',
      //          },
      //          { label: 'Findings', routerLink: '/#' },
      //          {
      //            label: 'Work Performed',
      //            routerLink: '/singlepages/singlepages/app-work-performed',
      //          },
      //        ],
      //      },
      //    ],
      //    [
      //      {
      //        label: 'Accounting/Finance',
      //        items: [
      //          {
      //            label: 'Currency',
      //            routerLink: '/singlepages/singlepages/app-currency',
      //          },
      //          {
      //            label: 'GL Account Type',
      //            routerLink: '/singlepages/singlepages/app-gl-account-class',
      //          },
      //          {
      //            label: 'GL Cash Flow Classification',
      //            routerLink:
      //              '/singlepages/singlepages/app-gl-cash-flow-classification',
      //          },
      //          {
      //            label: 'GL Account Category',
      //            routerLink: '/singlepages/singlepages/app-gl-account-category',
      //          },
      //          {
      //            label: 'Expenditure Category',
      //            routerLink: '/singlepages/singlepages/app-expenditure-category',
      //          },
      //          {
      //            label: 'Credit Terms',
      //            routerLink: '/singlepages/singlepages/app-credit-terms',
      //          },
      //          {
      //            label: 'Tax Rate',
      //            routerLink: '/singlepages/singlepages/app-tax-rate',
      //          },
      //          {
      //            label: 'Tax Type',
      //            routerLink: '/singlepages/singlepages/app-tax-type',
      //          },
      //          {
      //            label: 'Node Type',
      //            routerLink: '/singlepages/singlepages/app-node-type',
      //          },
      //        ],
      //      },
      //    ],
      //    [
      //      {
      //        label: 'General',
      //        items: [
      //          {
      //            label: 'Ata Chapter',
      //            routerLink: '/singlepages/singlepages/app-ata-main',
      //          },
      //          {
      //            label: 'Ata Sub-Chapter',
      //            routerLink: '/singlepages/singlepages/app-ata-sub-chapter1',
      //          },
      //          {
      //            label: 'Aircraft Manufacturer',
      //            routerLink:
      //              '/singlepages/singlepages/app-aircraft-manufacturer',
      //          },
      //          {
      //            label: 'Aircraft Model',
      //            routerLink: '/singlepages/singlepages/app-aircraft-model',
      //          },
      //          {
      //            label: 'Acquisition Type',
      //            routerLink: '/singlepages/singlepages/acquisition-type',
      //          },
      //          {
      //            label: 'Conditions',
      //            routerLink: '/singlepages/singlepages/app-conditions',
      //          },
      //          {
      //            label: 'Customer Classification',
      //            routerLink:
      //              '/singlepages/singlepages/app-customer-classification',
      //          },
      //          {
      //            label: 'Dash Numbers',
      //            routerLink: '/singlepages/singlepages/app-dashnumber',
      //          },
      //          {
      //            label: 'Default Messages',
      //            routerLink: '/singlepages/singlepages/app-defaultmessage',
      //          },
      //          {
      //            label: 'Documents',
      //            routerLink: '/singlepages/singlepages/app-documents',
      //          },
      //          {
      //            label: 'Integration',
      //            routerLink: '/singlepages/singlepages/app-integration',
      //          },

      //          {
      //            label: 'Lead Source',
      //            routerLink: '/singlepages/singlepages/app-lead-source',
      //          },
      //          {
      //            label: 'Master 1099',
      //            routerLink: '/singlepages/singlepages/app-master-1099',
      //          },
      //          {
      //            label: 'Percent',
      //            routerLink: '/singlepages/singlepages/app-percent',
      //          },
      //          {
      //            label: 'Priority',
      //            routerLink: '/singlepages/singlepages/app-priority',
      //          },
      //          {
      //            label: 'Process 1099',
      //            routerLink: '/singlepages/singlepages/app-vendor-process1099',
      //          },
      //          {
      //            label: 'Provision',
      //            routerLink: '/singlepages/singlepages/app-provision',
      //          },
      //          {
      //            label: 'Shipvia',
      //            routerLink: '/singlepages/singlepages/app-shipvia',
      //          },
      //          {
      //            label: 'Document Type',
      //            routerLink: '/singlepages/singlepages/app-document-type',
      //          },
      //          // { label: 'Site', routerLink: '/singlepages/singlepages/app-site' },
      //          {
      //            label: 'Tag Type',
      //            routerLink: '/singlepages/singlepages/app-tag-type',
      //          },

      //          {
      //            label: 'Publication Type',
      //            routerLink: '/singlepages/singlepages/app-publication-type',
      //          },
      //          {
      //            label: 'Vendor Classification',
      //            routerLink:
      //              '/singlepages/singlepages/app-vendor-classification',
      //          },
      //          {
      //            label: 'Work Scope',
      //            routerLink: '/singlepages/singlepages/app-work-scope',
      //          },

      //          {
      //            label: 'Vendor Capability Type',
      //            routerLink: '/singlepages/singlepages/app-capability-type',
      //          },
      //        ],
      //      },
      //    ],
      //    [
      //      {
      //        label: 'Asset Mgmt Maintenance',
      //        items: [
      //          {
      //            label: 'Asset Class',
      //            routerLink: '/singlepages/singlepages/app-asset-type',
      //          },
      //          //changed for asset attribute type and intangible attribute type
      //          {
      //            label: 'Asset Attribute Type',
      //            routerLink:
      //              '/singlepages/singlepages/app-asset-attribute-type',
      //          },
      //          // {
      //          //   label: 'Asset Attributes',
      //          //   items: [
      //          //     {
      //          //       label: 'Asset Attribute Type',
      //          //       routerLink:
      //          //         '/singlepages/singlepages/app-asset-attribute-type',
      //          //     },
      //          //     {
      //          //       label: 'Intangible Attribute Type',
      //          //       routerLink:
      //          //         '/singlepages/singlepages/app-asset-intangible-attribute-type',
      //          //     },
      //          //     { label: 'Depreciation - Book', routerLink: '/#' },
      //          //     { label: 'Depreciation - Tax', routerLink: '/#' },
      //          //     { label: 'Depreciation Date', routerLink: '/#' },
      //          //   ],
      //          // },
      //          {
      //            label: 'Asset Status',
      //            routerLink: '/singlepages/singlepages/asset-status',
      //          },
      //          {
      //            label: 'Asset Location',
      //            routerLink: '/singlepages/singlepages/asset-location',
      //          },
      //          {
      //            label: 'Depreciation Method',
      //            routerLink: '/singlepages/singlepages/app-depriciation-method',
      //          },
      //          {
      //            label: 'Depreciation Convention',
      //            routerLink:
      //              '/singlepages/singlepages/app-asset-dep-convention-type',
      //          },
      //          {
      //            label: 'Depreciation Intervals',
      //            routerLink:
      //              '/singlepages/singlepages/app-depreciation-intervals',
      //          },
      //          {
      //            label: 'Asset Disposal Type',
      //            routerLink: '/singlepages/singlepages/app-disposal-type',
      //          },
      //          {
      //            label: 'Asset Intangible Class',
      //            routerLink:
      //              '/singlepages/singlepages/app-asset-intangible-class',
      //          },
      //          {
      //            label: 'Asset Intangible Attribute Type',
      //            routerLink:
      //              '/singlepages/singlepages/app-asset-intangible-attribute-type',
      //          }
      //        ],
      //      },


      //      {
      //        label: 'Stockline',
      //        items: [
      //          {
      //            label: 'Adjustment Reason',
      //            routerLink: '/singlepages/singlepages/app-adjustment-reason',
      //          },
      //        ],
      //      },
      //      {
      //        label: 'Employees',
      //        items: [
      //          {
      //            label: 'Job Titles',
      //            routerLink: '/singlepages/singlepages/app-job-title',
      //          },
      //          {
      //            label: 'Employee Expertise',
      //            routerLink: '/singlepages/singlepages/app-employee-expertise',
      //          },
      //          {
      //            label: 'Certification Type',
      //            routerLink: '/singlepages/singlepages/app-certification-type',
      //          },
      //          {
      //            label: 'Employee Training Type',
      //            routerLink:
      //              '/singlepages/singlepages/app-employee-training-type',
      //          },
      //        ],
      //      },
      //    ],
      //  ],
      //},
    ];



    if (this.authService.currentManagementStructure) {
      this.managementStructure.companyId = this.authService.currentManagementStructure.level1;
      this.managementStructure.buId = this.authService.currentManagementStructure.level2;
      this.managementStructure.divisionId = this.authService.currentManagementStructure.level3;
      this.managementStructure.departmentId = this.authService.currentManagementStructure.level4;
    }

    
    this.isUserLoggedIn = this.authService.isLoggedIn && (this.authService.currentUser != null && this.authService.currentUser.isResetPassword != "False");

    this.isAppLoaded = true;
    this.removePrebootScreen = true;

    this.alertService.getDialogEvent().subscribe((alert) =>
      this.dialog.open(AppDialogComponent, {
        data: alert,
        panelClass: 'mat-dialog-sm',
      })
    );
    this.alertService
      .getMessageEvent()
      .subscribe((message) => this.showToast(message, false));
    this.alertService
      .getStickyMessageEvent()
      .subscribe((message) => this.showToast(message, true));

    this.authService.reLoginDelegate = () => this.showLoginDialog();

    this.authService.getLoginStatusEvent().subscribe((isLoggedIn) => {
      this.isUserLoggedIn = isLoggedIn && (this.authService.currentUser != null && this.authService.currentUser.isResetPassword != "False");

      if (this.isUserLoggedIn) {
        this.initNotificationsLoading();
      } else {
        this.unsubscribeNotifications();
      }

      if (this.authService.currentUser != null) {
        if(this.authService.currentUser.roleID!=undefined){
          if(this.authService .currentUser.userName!="admin"){
        this.userRoleService.getUserMenuByRoleId(this.authService.currentUser.roleID).subscribe(data => {
          console.log(data[0]);
          this.menuArray = data[0];
          this.authService.SetMenuInfo(data[0]);
          this.dynamicMenu();
        });
          //  this.moduleHierarchy = this.authService.getModuleByUserRole();
          //  alert(this.moduleHierarchy);
          //  this.dynamicMenu();
        //console.log(this.authService.getModuleByUserRole());
      }
      
      }
      else{
        this.megaMenuItems=[];
      }
      }

      setTimeout(() => {
        if (!this.isUserLoggedIn && (this.authService.currentUser != null && this.authService.currentUser.isResetPassword != "False")) {
          this.alertService.showMessage(
            'Session Ended!',
            '',
            MessageSeverity.default
          );
        }
      }, 200);
    });

    this.subscription = this.router.events.subscribe((event) => {
     
      if (event instanceof NavigationStart) {
        let url = (<NavigationStart>event).url;

        if (url !== url.toLowerCase()) {
          this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
        }

        if (this.adminExpander && url.indexOf('admin') > 0) {
          this.adminExpander.open();
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.unsubscribeNotifications();
    if (this.subscription !== undefined) this.subscription.unsubscribe();
  }

  private unsubscribeNotifications() {
    if (this.notificationsLoadingSubscription) {
      this.notificationsLoadingSubscription.unsubscribe();
    }
  }

  isBackEnabled() {
    return !window.location.href.includes('app-work-order-quote');
  }

  stockLineReport() {
    const url = `${this.configurations.baseUrl}/api/stockLine/stocklinereoprt`;

    window.location.assign(url);
  }
  newEmployeeClick() {
    this.empService.isEditMode = false;
    this.empService.isDisbaleTabs = false;
    this.empService.ShowPtab = true;
    this.empService.currentUrl =
      '/employeesmodule/employeepages/app-employee-general-information';
    this.empService.bredcrumbObj.next(this.empService.currentUrl);
    this.empService.alertObj.next(this.empService.ShowPtab);
    this.router.navigateByUrl(
      '/employeesmodule/employeepages/app-employee-general-information'
    );
    this.empService.listCollection = undefined;
  }
  newVendorClick() {
    this.vendorService.ShowPtab = true;
    this.vendorService.currentUrl =
      '/vendorsmodule/vendorpages/app-vendor-general-information';
    this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
    this.vendorService.alertObj.next(this.vendorService.ShowPtab);
    this.router.navigateByUrl(
      '/vendorsmodule/vendorpages/app-vendor-general-information'
    );
    this.vendorService.listCollection = undefined;
    this.vendorService.isEditMode = false;
    console.log('isEdit Mode', this.vendorService.isEditMode);
    this.vendorService.checkVendorEditmode(false);
  }
  newLegalEntityClick() {
    this.entityService.isEditMode = false;
    this.entityService.ShowPtab = true;
    this.entityService.currentUrl =
      '/generalledgermodule/generalledgerpage/app-legal-entity-add';
    this.entityService.bredcrumbObj.next(this.vendorService.currentUrl);
    this.entityService.alertObj.next(this.vendorService.ShowPtab);
    this.router.navigateByUrl(
      '/generalledgermodule/generalledgerpage/app-legal-entity-add'
    );
    this.entityService.listCollection = undefined;
    this.entityService.checkEntityEditmode(false);
  }

  initNotificationsLoading() {
    this.notificationsLoadingSubscription = this.notificationService
      .getNewNotificationsPeriodically()
      .subscribe(
        (notifications) => {
          this.dataLoadingConsecutiveFailures = 0;
          this.newNotificationCount = notifications.filter(
            (n) => !n.isRead
          ).length;
        },
        (error) => {
          this.alertService.logError(error);

          if (this.dataLoadingConsecutiveFailures++ < 20)
            setTimeout(() => this.initNotificationsLoading(), 200);
          else
            this.alertService.showStickyMessage(
              'Load Error',
              'Loading new notifications from the server failed!',
              MessageSeverity.error
            );
        }
      );
  }

  markNotificationsAsRead() {
    let recentNotifications = this.notificationService.recentNotifications;

    if (recentNotifications.length) {
      this.notificationService
        .readUnreadNotification(
          recentNotifications.map((n) => n.id),
          true
        )
        .subscribe(
          (response) => {
            for (let n of recentNotifications) {
              n.isRead = true;
            }

            this.newNotificationCount = recentNotifications.filter(
              (n) => !n.isRead
            ).length;
          },
          (error) => {
            this.alertService.logError(error);
            this.alertService.showMessage(
              'Notification Error',
              'Marking read notifications failed',
              MessageSeverity.error
            );
          }
        );
    }
  }

  showLoginDialog(): void {
    this.alertService.showStickyMessage(
      'Session Expired',
      'Your Session has expired. Please log in again',
      MessageSeverity.info
    );

    let dialogRef = this.dialog.open(LoginDialogComponent, { minWidth: 600 });

    dialogRef.afterClosed().subscribe((result) => {
      this.alertService.resetStickyMessage();

      if (!result || this.authService.isSessionExpired) {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        this.alertService.showStickyMessage(
          'Session Expired',
          'Your Session has expired. Please log in again to renew your session',
          MessageSeverity.warn
        );
      }
    });
  }

  showToast(message: AlertMessage, isSticky: boolean) {
    if (message == null) {
      for (let id of this.stickyToasties.slice(0)) {
        this.toastyService.clear(id);
      }

      return;
    }

    let toastOptions: ToastOptions = {
      title: message.summary,
      msg: message.detail,
      timeout: isSticky ? 0 : 5000,
    };

    if (isSticky) {
      toastOptions.onAdd = (toast: ToastData) =>
        this.stickyToasties.push(toast.id);

      toastOptions.onRemove = (toast: ToastData) => {
        let index = this.stickyToasties.indexOf(toast.id, 0);

        if (index > -1) {
          this.stickyToasties.splice(index, 1);
        }

        toast.onAdd = null;
        toast.onRemove = null;
      };
    }

    switch (message.severity) {
      case MessageSeverity.default:
        this.toastyService.default(toastOptions);
        break;
      case MessageSeverity.info:
        this.toastyService.info(toastOptions);
        break;
      case MessageSeverity.success:
        this.toastyService.success(toastOptions);
        break;
      case MessageSeverity.error:
        this.toastyService.error(toastOptions);
        break;
      case MessageSeverity.warn:
        this.toastyService.warning(toastOptions);
        break;
      case MessageSeverity.wait:
        this.toastyService.wait(toastOptions);
        break;
    }
  }

  goBack() {
    window.history.back();
  }

  logout() {
    this.authService.logout();this.authService.redirectLogoutUser();
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    
    
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : '';
  }

  get fullName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.fullName
      : '';
  }

  get canViewCustomers() {
    return this.accountService.userHasPermission(
      Permission.viewUsersPermission
    );
  }

  get canViewProducts() {
    return this.accountService.userHasPermission(
      Permission.viewUsersPermission
    );
  }

  get canViewOrders() {
    return true;
  }

  get canViewUsers() {
    return this.accountService.userHasPermission(
      Permission.viewUsersPermission
    );
  }

  get canViewRoles() {
    return this.accountService.userHasPermission(
      Permission.viewRolesPermission
    );
  }

  clearStocklineAndSOStorageReference() {
    this.stocklineReferenceStorage.stocklineReferenceData = undefined;
    this.salesOrderReferenceStorage.salesOrderReferenceData = undefined;
  }

  // isSticky: boolean = false;

  // @HostListener('window:scroll', ['$event'])
  // checkScroll() {
  //   this.isSticky = window.pageYOffset >= 50;
  // }
  navigateToURL(url) {
    window.open(url);
  }
}

