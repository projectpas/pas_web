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
    private salesOrderReferenceStorage: SalesOrderReferenceStorage
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
  ngOnInit() {
    this.megaMenuItems = [
      {
        label: 'Dashboard',
        icon: 'fa fa-fw fa-home',
        routerLink: '/home',

      },
      {
        label: 'CRM/Customer',
        icon: 'fa fa-fw fa-group',
        items: [
          [
            {
              label: 'Customer',
              items: [
                {
                  label: 'Customer/Account List',
                  routerLink:
                    '/customersmodule/customerpages/app-customers-list',
                },
               
              ],
            },
            {
              label: 'Sales Order Quote',
              items: [
                {
                  label: 'Sales Order Quote List',
                  routerLink: '/salesmodule/salespages/sales-quote-list',
                },
                {
                label: 'Sales Order Speed Quote List',
                routerLink: '/salesmodule/salespages/speed-quote-list',
                },
               
              ],
            },
            {
              label: 'Work Order Quote',
              items: [
                {
                  label: 'Work Order Quote List',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-quote-list',
                },
                {
                label: 'Work Order Speed Quote',
                routerLink: '/#',
                },
               
              ],
            },
            {
              label: 'Reports ',
              items: [
                { label: 'Revenue Trends', routerLink: '' },
                { label: 'Accounts Receivable', routerLink: '' },
                // {
                //   label: 'Customer Statement Report', command: (event?: any) => {
                //     this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCustomer+Statement&rs:Command=Render');
                //   }
                // }
              ],
            },
            {
              label: 'CRM',
              items: [
                {
                  label: 'Account List',
                  routerLink: '/customersmodule/customerpages/app-crm-list',
                },
                {
                  label: 'Account Assignment',
                  routerLink: '',
                },
               
                {
                  label: 'Lead List',
                  routerLink: '/customersmodule/customerpages/app-leads-list',
                },
                {
                  label: 'Deal List',
                  routerLink: '/customersmodule/customerpages/app-deals-list',
                },
                {
                  label: 'Opportunity List',
                  routerLink: '/customersmodule/customerpages/app-opportunity-list',
                },
                {
                  label: 'Conversion',
                  routerLink: '',
                },
              ],
            },
            {
              label: 'Reports',
              items: [
                {
                  label: 'Actual vs Quota',
                  routerLink: '',
                },
                {
                  label: 'Salesperson Performance',
                  routerLink: '',
                },
               
                {
                  label: 'Revenue Trends',
                  routerLink: '',
                },
                {
                  label: 'Accounts Receivable',
                  routerLink: '',
                },
                
                {
                  label: 'Win Loss Ratio',
                  routerLink: '',
                },
              ],
            },
          ],
        
        ],
      },
      {
        label: 'Inventory Management',
        icon: 'fa fa-fw fa-list-alt',
        items: [
          [
            {
              label: 'Item Master',
              items: [
                {
                  label: 'Item List',
                  routerLink:
                    '/itemmastersmodule/itemmasterpages/app-item-master-list',
                },
                {
                  label: 'PN Capabilities List',
                  routerLink:
                  '/itemmastersmodule/itemmasterpages/app-item-master-capabilities-list',
              },
                { label: 'Purchase and Sales By PN', routerLink: '/#' },

              ],
            },
            {
              label: 'Inventory',
              items: [
                {
                  label: 'Stockline List',
                  routerLink:
                    '/stocklinemodule/stocklinepages/app-stock-line-list',
                },
                { label: 'Non Stock List', routerLink: '/#' },
              ],
            },
            {
              label: 'Consignment',
              items: [
                { label: 'Consignment List', routerLink: '/#' },
               
              ],
            },
            {
              label: 'LOT Management',
              items: [
                { label: 'LOT List', routerLink: '/#' },
                { label: 'Lost Summary', routerLink: '/#' },
              ],
            },
            {
              label: 'Cycle Count',
              items: [
                { label: 'Cycle Count List', routerLink: '/#' },
               
              ],
            },
          ],
         
        ],
      },
      {
        label: 'Work Order Management',
        icon: 'fa fa-fw fa-shopping-cart',
        items: [
          [
            {
              label: 'Work Order Quote',
              items: [
                {
                  label: 'Work Order Quote List',
                  routerLink:
                  '/workordersmodule/workorderspages/app-work-order-quote-list',
              },
              {
                label: 'Work Order Quote Pending Approval',
                command: () => this.clearStocklineAndSOStorageReference(),
                routerLink: '/workordersmodule/workorderspages/app-woq-approval-rule',
              },
               
              ],
            },
            {
              label: 'Work Order',
              items: [
                {
                  label: 'Work Order List',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-list',
                },
               
              ],
            },

            {
              label: 'Work Order Assignment',
              items: [
                {
                  label: 'Work Order in Process List',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-list',
                },
                {
                  label: 'Assign WO to Tech',
                  routerLink:
                    '/workordersmodule/workorderspages/app-work-order-list',
                },
               
              ],
            },
            {
              label: 'Work Flow',
              items: [
                {
                  label: 'Workflow List',
                  routerLink: '/workflowmodule/workflowpages/app-workflow-list',
                },
              
               
              ],
            },
            {
              label: 'Work Order Reports',
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
                  label: 'WO-On Time Performance',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+On+Time+Performance&rs:Command=Render');
                  },
                },
                {
                  label: 'WO Turn Around Time', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+-Turn+Around+Time+(TAT)&rs:Command=Render');
                  }
                },
                {
                  label: 'WO Status Tracking',
                  // routerLink: '/#',
                  command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Tracking&rs:Command=Render');
                  },
                },
                {
                  label: ' WO Labor Tracking', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fLabor+Tracking&rs:Command=Render');
                  }
                },
               
    
              
               
              ],
            },
            {
              label: 'WO Warranty',
              items: [
                {
                  label: 'Technician Productivity', command: (event?: any) => {
                    this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTech+Productivity&rs:Command=Render');
                  }
                },
              
               
              ],
            },
            {
              label: 'Work Order Quote Reports',
              items: [
                {
                  label: 'WO Quote',
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
                
               
              
               
              ],
            },
          ],
        ],
      },
      {
        label: 'Sales Order',
        icon: 'fa fa-fw fa-shopping-cart',
        items: [
          
          [
            {
              label: 'Sales Order Quote',
              items: [
                {
                  label: 'Sales Order Quote List',
                  routerLink: '/salesmodule/salespages/sales-quote-list',
                  },
                  {
                   label: 'SO Quote Pending Approval',
                   command: () => this.clearStocklineAndSOStorageReference(),
                    routerLink: '/salesmodule/salespages/app-soq-approval-rule',
                  },
              ],
            },
            {
              label: 'Sales Order',
              items: [
                {
                  label: 'Sales Order List',
                   routerLink: '/salesmodule/salespages/sales-order-list',
                 },
                 { label: 'SO Confirmation List', routerLink: '/salesmodule/salespages/sales-order-confirmation-list' },
                               {
                                 label: 'Sales Order Pending Approval',
                                 command: () => this.clearStocklineAndSOStorageReference(),
                                 routerLink: '/salesmodule/salespages/app-so-approval-rule',
                               },
              
              ],
            },
            {
              label: 'Exchanges',
              items: [
                {
                  label: 'Exchange Sales Order List',
                   routerLink: '/exchangemodule/exchangepages/exchange-sales-order-list',
                  },
                 { 
                   label: 'Create Exch Sales Order Quote', routerLink: '' },
                 
              ],
            },

            {
              label: 'Core Exch Management',
              items: [
                {
                   label: 'Core Exch Listing',
                  routerLink: '/exchangemodule/exchangepages/exchange-quote-list',
                   },
                 
              ],
            },
            {
              label: 'Loans',
              items: [
                {
                  label: 'Sales Order Loan List',
                 routerLink: '',
                  },
                  {
                    label: 'Sales Order Loan Quote',
                   routerLink: '',
                    },
                 
              ],
            },

            {
              label: 'RMA and Credits',
              items: [
                {
                  label: 'Sales Order RMA List',
                 routerLink: '',
                  },
                  {
                    label: 'Sales Order Credit List',
                   routerLink: '',
                    },
                 
              ],
            },

            {
              label: 'Reports',
              items: [
                {
                  label: 'Open SO Report',
                 routerLink: '',
                  },
                  {
                    label: 'SO Billing',
                   routerLink: '',
                    },
                    {
                      label: 'SO Gross Margin',
                     routerLink: '',
                      },
                      {
                        label: 'SO Sales Performance',
                       routerLink: '',
                        },
                        {
                          label: 'SO-On Time Delivery',
                         routerLink: '',
                          },
                          {
                            label: 'SO Turn Around Time',
                           routerLink: '',
                            },
                            {
                              label: 'SO Quote Conversion Report',
                             routerLink: '',
                              },
                              {
                                label: 'SO Quote History',
                               routerLink: '',
                                },
                                {
                                  label: 'SO Exchange Margin',
                                 routerLink: '',
                                  },
                                  {
                                    label: 'SO Exchange History',
                                   routerLink: '',
                                    },
                                    {
                                      label: 'Open Core Report',
                                     routerLink: '',
                                      },
                                      {
                                        label: 'RMA Report',
                                       routerLink: '',
                                        },
                                        {
                                          label: 'SO Credit',
                                         routerLink: '',
                                          },   
              ],
            },
          ],
         
        ],
      },

      {
        label: 'Procurement',
        icon: '',
        items: [
          [
            {
              label: 'Vendor',
              items: [
                {
                  label: 'Vendor List',
                  routerLink: '/vendorsmodule/vendorpages/app-vendors-list',
                 },
                 {
                   label: 'Vendor Capes List',
                   routerLink: '/vendorsmodule/vendorpages/app-vendor-capabilities-list',
                 },
               
               
              ],
            },
            {
              label: 'Vendor Quote',
              items: [
                { label: 'Vendor Quote List', routerLink: '/#' },
                
              ],
            },
            {
              label: 'Purchase Order',
              items: [
                {
                 label: 'PO List',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-polist',
                 },
                 {
                   label: 'PO Pending Approval',
                   command: () => this.clearStocklineAndSOStorageReference(),
                    routerLink: '/vendorsmodule/vendorpages/app-po-approval',
                   },

              
              ],
            }, 
            {
              label: 'Repair Order',
              items: [
                {
                 label: 'RO List',
                  command: () => this.clearStocklineAndSOStorageReference(),
                  routerLink: '/vendorsmodule/vendorpages/app-ro-list',
                  },
                  {
                    label: 'RO Pending Approval',
                    command: () => this.clearStocklineAndSOStorageReference(),
                     routerLink: '/vendorsmodule/vendorpages/app-ro-approval',
                    },

              
              ],
            },
            {
              label: 'RMA and Returns',
              items: [
                { label: 'RMA List', routerLink: '/#' },
                { label: 'Return List', routerLink: '/#' },
                { label: 'Process Return', routerLink: '/#' },

              
              ],
            },
            {
              label: 'Reports',
              items: [
                { label: 'Open Vendor PO/RO Report ', routerLink: '/#' },
                { label: 'Open Vendor RFQ Report', routerLink: '/#' },
                { label: 'Payment History', routerLink: '/#' },
                {
                 label: 'Vendor Capabilities', command: (event?: any) => {
                 this.navigateToURL(environment.reportUrl + '/Reports/report/Report%20Project1/Capabilities');
                 }
                }
               

              ],
            },
           
          ],

        ],
      },

      {
        label: 'Shipping & Receiving',
        icon: '',
        items: [
          [
            {
              label: 'Receive Purchase Order',
              items: [
                
                { label: 'PO Fulfilling List', routerLink: '/#' },
                
              ],
            },
            {
              label: 'Receive RO',
              items: [
                { label: 'RO Fulfilling List', routerLink: '/#' },
              
              ],
            },
            {
              label: 'Receive Customer Work',
              items: [
                {
                  label: 'List of Customer Work',
                  routerLink:
                  '/receivingmodule/receivingpages/app-customer-works-list',
              },
               
              ],
            },
            {
              label: 'Shipping',
              items: [
                {
                  label: 'Shipping List',
                  routerLink: '',
              },
              {
                label: 'Return to Vendor',
                routerLink: '',
            },
               
              ],
            },

            {
              label: 'Reports',
              items: [
                {
                  label: 'PO/RO Receiving Log',
                  routerLink: '',
              },
              {
                label: 'Receive Customer Work Log',
                routerLink: '',
            },
            {
              label: 'WO/SO Shipping Log',
              routerLink: '',
          },
          {
            label: 'Return to Vendor Shipping Log',
            routerLink: '',
        },
               
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
                  label: 'Schedule Journals',
                 routerLink: '/accountmodule/accountpages/app-schedule',
                 },
              
              ],
            },
            {
              label: 'GL Accounts ',
              items: [
                {
                 label: ' List of GL Accounts',
                  routerLink:
                '/generalledgermodule/generalledgerpage/app-account-listing',
                },
               
              ],
            },

            {
              label: 'Accounting Calendar ',
              items: [
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
               
              ],
            },

            {
              label: 'Financial Statement Maintenance ',
              items: [
                {
                  label: 'List of FS Nodes',
                   routerLink:
                   '/generalledgermodule/generalledgerpage/app-accounting-listing-calendar',
                  },
               
               
              ],
            },
            {
              label: 'Vendor',
              items: [
                {
                  label: 'Vendor List',
                  routerLink: '/vendorsmodule/vendorpages/app-vendors-list',
                  },
                  {
                    label: 'Vendor Capes',
                     routerLink:
                     '/vendorsmodule/vendorpages/app-vendor-capabilities-list',
                    },
               
               
              ],
            },

            {
              label: 'Organization',
              items: [
                {
                  label: 'Legal Entity List',
                  routerLink: '/generalledgermodule/generalledgerpage/app-legal-entity-list',
                  },
                  {
                    label: 'Management Structure',
                     routerLink:
                     '/generalledgermodule/generalledgerpage/app-managemententity-structure',
                    },
               
               
              ],
            },

            {
              label: 'Currency',
              items: [
                {
                  label: 'Currency List',
                  routerLink: '',
                  },
                  {
                    label: 'FX Rates',
                     routerLink:
                     '',
                    },
               
               
              ],
            },

            {
              label: 'Reports',
              items: [
                {
                   label: 'Trial Balance', command: (event?: any) => {
                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTrial+Bal&rs:Command=Render');
                   }
                  },
              
                  { label: 'Income Statement', routerLink: '/#' },
                  { label: 'Balance Sheet', routerLink: '/#' },
              ],
            },

            {
              label: 'Inventory Adjustment',
              items: [
                {
                  label: 'Inventory Adjustment List',
                  routerLink: '',
                  },
                 
               
              ],
            },

          ],
         
        ],
      },


      {
        label: 'Accounting',
        icon: '',
        items: [
          [
            {
              label: 'Accounts Receivable',
              items: [
                
                { label: 'Customer Invoice List', routerLink: '/#' },
                { label: 'Process Customer Receipt', routerLink: '/#' },
                { label: 'Print Statements', routerLink: '/#' },
                
              ],
            },
            {
              label: 'AR Admin',
              items: [
                { label: 'AR Ledger List', routerLink: '/#' },
                { label: 'Open/Close AR Ledger', routerLink: '/#' },
              
              ],
            },
            {
              label: 'Reports',
              items: [
                {
                  label: 'AR Aging',
                  routerLink:'',
              },
              {
                label: 'Payment History',
                routerLink:'',
              },
              {
              label: 'Customer Statement',
              routerLink:'',
              },
              {
                label: 'Deposit',
                routerLink:'',
              },
              {
                label: 'Credit/Write Off History',
                routerLink:'',
              },
              {
                label: 'Payment Discount',
                routerLink:'',
              },
               
              ],
            },
          
          ],
          [
            {
              label: 'Accounts Payable',
              items: [
                {
                 label: 'Vendor Invoice List',
                routerLink: '',
                 },
                 {
                  label: 'Enter Vendor Invoice',
                 routerLink: '',
                 },
                 {
                  label: 'Vendor Chargebacks List',
                 routerLink: '',
                 },
                 {
                  label: 'Generate Check Register',
                 routerLink: '',
                 },
                 {
                  label: 'Print Checks',
                 routerLink: '',
                 },
              
              ],
            },
            {
              label: 'AP Admin ',
              items: [
                {
                 label: 'AP Ledger List',
                  routerLink: '',
                },
                {
                  label: 'Open/Close AP Ledger',
                   routerLink: '',
                 },
               
              ],
            },

            {
              label: 'Reports ',
              items: [
                {
                  label: 'AP Aging',
                   routerLink:'',
                  },
                  {
                    label: 'AP Register',
                     routerLink:'',
                    },
                    {
                      label: 'Payment History',
                       routerLink:'',
                      },
                      {
                        label: 'Open Vendor Invoice',
                         routerLink:'',
                        },
                        {
                          label: 'Check Register',
                           routerLink:'',
                          },
               
              ],
            },

          ],
         
        ],
      },

      {
        label: 'Asset Management',
        icon: '',
        items: [
          [
            {
              label: 'Asset Master',
              items: [
                {
                  label: 'Asset List',
                  routerLink: '/assetmodule/assetpages/app-asset-listing',
                },
                
               
              ],
            },
            {
              label: 'Asset Inventory',
              items: [
                {
                   label: 'Asset Inventory List',
                   routerLink:
                 '/assetmodule/assetpages/app-asset-inventory-listing',
                 },
                
              ],
            },
            {
              label: 'Asset Maintenance',
              items: [
                {
                 label: 'Calibration,Certification',
                  
                  routerLink: '',
                 },
                 {
                   label: 'Lease and Insurance',
                    routerLink: '',
                   },
                   {
                    label: 'Asset Maintenance',
                     routerLink: '',
                    },
              ],
            }, 
            {
              label: 'Asset Accounting',
              items: [
                {
                 label: 'Process Depreciation',                  
                  routerLink: '',
                 },
                 {
                   label: 'Sale/Write off/Write Down ',
                    routerLink: '',
                   },
                   {
                    label: 'Depreciation Forecast',
                     routerLink: '',
                    },
              ],
            }, 
            {
              label: 'Reports',
              items: [
                {
                 label: 'Tool List',                  
                  routerLink: '',
                 },
                 {
                   label: 'Calibration List ',
                    routerLink: '',
                   },
                   {
                    label: 'Calibration Tracking',
                     routerLink: '',
                    },
                    {
                      label: 'Asset Register',
                       routerLink: '',
                      },
                      {
                        label: 'Depreciation',
                         routerLink: '',
                        },
              ],
            }, 
          ],

        ],
      },

      {
        label: 'Invoice Management',
        icon: 'fa fa-fw fa-folder-open',
        items: [
          [
            {
              label: 'Invoice',
              items: [
                {
                  label: 'Invoice Listing',
                  routerLink: '',
                },
                {
                  label: 'Create Invoice',
                  routerLink: '',
                },
                {
                  label: 'Print Invoice',
                  routerLink: '',
                },
                {
                  label: 'Print Pick Ticket',
                  routerLink: '',
                },
                {
                  label: 'Print/Post',
                  routerLink: '',
                },
                { label: 'RMA List', routerLink: '/#' },
                { label: 'Credit List', routerLink: '/#' },
               
              ],
            },
            {
              label: 'Sales Order Invoicing',
              items: [
                { label: 'SO Invoice List', routerLink: '/#' },
                { label: 'Process SO Invoice', routerLink: '/#' },
              ],
            },
            {
              label: 'Work Order Invoicing',
              items: [
                { label: 'WO Invoice List', routerLink: '/#' },
                { label: 'Process WO Invoice', routerLink: '/#' },
              ],
            },
            {
              label: 'Reports',
              items: [
                { label: 'Invoice Journal Summary ', routerLink: '/#' },
                { label: 'Invoice Journal Details', routerLink: '/#' },
                { label: 'Invoice Register', routerLink: '/#' },
                { label: 'Customer Statement', routerLink: '/#' },
                { label: 'Customer Returns/Credit', routerLink: '/#' },
              ],
            },
           
          ],

        ],
      },



      {
        label: 'Other',
        icon: '',
        items: [
          [
            {
              label: 'Publication',
              items: [
                {
                  label: 'Publication list',
                  routerLink: '/singlepages/singlepages/app-publication',
                },               
              ],
            },
            {
              label: 'Reports',
              items: [
                { label: 'Publication by PN', routerLink: '/#' },
                { label: 'Publication Tracking', routerLink: '/#' },
              ],
            },
            {
              label: 'Contract Management',
              items: [
                { label: 'Contract List', routerLink: '/#' },
              ],
            },
            {
              label: 'Expence Report Management',
              items: [
                { label: 'Expense Report List ', routerLink: '/#' },
                { label: 'Expense Report Pending Approval', routerLink: '/#' },
               
              ],
            },
           
          ],

        ],
      },

      {
        label: 'Reports',
        icon: '',
        items: [
         
           
                {
                  label: 'Capabilities',
                  routerLink: '',
                },
                {
                  label: 'CMM',
                  routerLink: '',
                },
                {
                  label: 'Tools',
                  routerLink: '',
                },               
          

        ],
      },

      {
        label: 'Business Analytics',
        icon: '',
        // items: [
        //   [
           
        //         {
        //           label: '',
        //           routerLink: '',
        //         },
                      
        //   ],

        // ],
      },
      {
        label: 'Admin',
        icon: 'fa fa-fw fa-user',
        items: [
         
          [
            { label: 'Roles ', routerLink: '/#' },
            { label: 'Global Settings ', routerLink: '/#' },
            {
              label: 'Single Screen',
              items: [
                { label: '', routerLink: '/#' },
               
              ],
            },
            {
              label: 'CRM/Customer',
              items: [
                {
                  label: 'CRM Setting List',
                  routerLink: '',
                },
                {
                  label: 'Speed Quote',
                  routerLink:
                    '',
                },
                {
                  label: 'Bulk Mail',
                  routerLink: '',
                },
              ],
            },
            {
              label: 'Item Master',
              items: [
                { label: 'Itemmaster setup List ', routerLink: '/#' },
                { label: 'Inventory setup List ', routerLink: '/#' },
               
              ],
            },
            {
              label: 'Work Order Setting',
              items: [
                {
                  label: 'Work Order Quote Setup List',
                  routerLink: '',
                },
                {
                  label: 'Workflow Setting Setup List',
                  routerLink:'',
                },
                {
                  label: 'Workorder Setup List',
                  routerLink:'',
                },
              
              ],
            }
          ],
          [
            {
              label: 'SO Quote, SO/Exch SO Admin',
              items: [
                {
                  label: 'Sales Order Quote Setup List',
                  routerLink:'',
                },
                {
                  label: 'Sales Order Setup List',
                  routerLink: '',
                },
                {
                  label: 'Sales Order Exch Setup List',
                  routerLink: '',
                },
                
              ],
            },
            {
              label: 'PO/RO Setting',
              items: [
                {
                  label: 'PO Setup List',
                  routerLink:'',
                },
                {
                  label: 'RO Setup List',
                  routerLink:'',
                },
              ],
            },
            {
              label: 'Shipping & Receiving',
              items: [
                {
                  label: 'Shipping Setup Setup List',
                  routerLink:'',
                },
                {
                  label: 'Receiving Setup List',
                  routerLink:'',
                },
              ],
            },

            {
              label: 'Billing/Invoicing',
              items: [
                {
                  label: 'Invoice Setup List',
                  routerLink:'',
                },
              
              ],
            },
            {
              label: 'Assets',
              items: [
                {
                  label: 'Asset Setup List',
                  routerLink:'',
                },
                {
                  label: 'Tools Setup List',
                  routerLink:'',
                },
              
              ],
            },
            {
              label: 'Publication',
              items: [
                {
                  label: 'Publication Setup List',
                  routerLink:'',
                },              
              ],
            },

            {
              label: 'Contract Management(Customers)',
              items: [
                {
                  label: 'Customer Contract Setup List',
                  routerLink:'',
                },              
              ],
            },

            {
              label: 'Accounting',
              items: [
                {
                  label: 'General Accounting Setup List',
                  routerLink:'',
                }, 
                {
                  label: 'Accounts Receivables Setup List',
                  routerLink:'',
                }, 
                {
                  label: 'Accounts Payables Setup List',
                  routerLink:'',
                },              
              ],
            },

            {
              label: 'Employees',
              items: [
                {
                  label: 'Employees Setup List',
                  routerLink:'',
                }, 
                            
              ],
            },
            {
              label: 'Forms Maintenance',
              items: [
                {
                  label: '',
                  routerLink:'',
                }, 
                            
              ],
            },
            {
              label: 'Integration Management',
              items: [
                {
                  label: 'ILS',
                  routerLink:'',
                }, 
                {
                  label: 'AEX',
                  routerLink:'',
                }, 
                {
                  label: 'Parts Base',
                  routerLink:'',
                }, 
                {
                  label: '145.com',
                  routerLink:'',
                }, 
                            
              ],
            },

            
           
          ],
         
        ],
      },
      
    ];
  //   this.megaMenuItems = [
  //     {
  //       label: 'Dashboard',
  //       icon: 'fa fa-fw fa-home',
  //       routerLink: '/home',

  //     },
  //     {
  //       label: 'Master',
  //       icon: 'fa fa-fw fa-group',
  //       items: [
  //         [
  //           {
  //             label: 'Customers',
  //             items: [
  //               {
  //                 label: 'Customers List',
  //                 routerLink:
  //                   '/customersmodule/customerpages/app-customers-list',
  //               },
  //               {
  //                 label: 'Create Customer',
  //                 routerLink:
  //                   '/customersmodule/customerpages/app-customer-create',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Invoice',
  //             items: [
  //               { label: 'Invoice List', routerLink: '/#' },
  //               { label: 'Create Invoice', routerLink: '/#' },
  //               { label: 'Customer RMA', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Reports & Forms',
  //             items: [
  //               { label: 'Invoice Register', routerLink: '' },
  //               { label: 'Invoice Batches', routerLink: '' },
  //               {
  //                 label: 'Customer Statement Report', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCustomer+Statement&rs:Command=Render');
  //                 }
  //               }
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Vendor',
  //             items: [
  //               {
  //                 label: 'Vendor List',
  //                 routerLink: '/vendorsmodule/vendorpages/app-vendors-list',
  //               },
  //               {
  //                 label: 'Create Vendor',
  //                 command: (event?: any) => {
  //                   this.newVendorClick();
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Vendor Capabilities',
  //             items: [
  //               {
  //                 label: 'Vendor Capes List',
  //                 routerLink:
  //                   '/vendorsmodule/vendorpages/app-vendor-capabilities-list',
  //               },
  //               {
  //                 label: 'Create Vendor Capes',
  //                 routerLink:
  //                   '/vendorsmodule/vendorpages/app-add-vendor-capabilities',
  //               },
  //               {
  //                 label: 'Capes Report', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/Reports/report/Report%20Project1/Capabilities');
  //                 }
  //               }
  //             ],
  //           },
  //           {
  //             label: 'Reports & Forms',
  //             items: [
  //               { label: 'Open RO Report', routerLink: '/#' },
               
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Employees',
  //             items: [
  //               {
  //                 label: 'Employee List',
  //                 routerLink:
  //                   '/employeesmodule/employeepages/app-employees-list',
  //               },
               
  //               {
  //                 label: 'Create Employee',
  //                 command: (event?: any) => {
  //                   this.newEmployeeClick();
  //                 },
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Expense Reports',
  //             items: [
  //               { label: 'Expense List', routerLink: '/#' },
  //               { label: 'Create', routerLink: '/#' },
  //               { label: 'Approval', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Reports & Forms',
  //             items: [
  //               { label: 'Employee List Report', routerLink: '/#' },
  //               { label: 'Productivity', routerLink: '/#' },
  //               { label: 'Commission', routerLink: '/#' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Publications',
  //             icon: 'fa fa-fw fa-newspaper-o',
  //             items: [
  //               {
  //                 label: 'Publications List',
  //                 routerLink: '/singlepages/singlepages/app-publication',
  //               },
  //               {
  //                 label: 'Create Publications',
  //                 routerLink: '/singlepages/singlepages/app-create-publication',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports & Forms',
  //             items: [{ label: 'CMM by PIN', routerLink: '/#' },
  //             {
  //               label: 'Publication Tracking', command: (event?: any) => {
  //                 this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPublication+Tracking&rs:Command=Render');
  //               }
  //             }],
  //           },

  //         ],
  //         [
  //           {
  //             label: 'CRM',
  //             icon: 'fa fa-funnel-dollar',
  //             items: [
  //               {
  //                 label: 'CRM List',
  //                 routerLink: '/customersmodule/customerpages/app-crm-list',
  //               },
  //               {
  //                 label: 'Deals List',
  //                 routerLink: '/customersmodule/customerpages/app-deals-list',
  //               },
  //               {
  //                 label: 'Leads List',
  //                 routerLink: '/customersmodule/customerpages/app-leads-list',
  //               },
  //               {
  //                 label: 'Opportunity List',
  //                 routerLink: '/customersmodule/customerpages/app-opportunity-list',
  //               },
  //             ],
  //           },

  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Accounts',
  //       icon: 'fa fa-fw fa-list-alt',
  //       items: [
  //         [
  //           {
  //             label: 'General Ledger',
  //             items: [
  //               {
  //                 label: 'GL Account List',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-account-listing',
  //               },
  //               {
  //                 label: 'Create GL Account',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-account-listing-create',
  //               },
  //               {
  //                 label: 'Create Accounting Calendar',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-accounting-calendar',
  //               },
  //               {
  //                 label: 'Accounting Calendar List',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-accounting-listing-calendar',
  //               },
  //               {
  //                 label: 'Open/Close Ledger',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-open-close-ledger',
  //               },
  //               { label: 'Intercompany', routerLink: '/#' },

  //             ],
  //           },
  //           {
  //             label: 'Payment Description',
  //             items: [
  //               { label: 'Cutomer', routerLink: '/#' },
  //               { label: 'Vendor', routerLink: '/#' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Financial Statement',
  //             items: [
  //               {
  //                 label: 'Node List',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-node-setup',
  //               },
  //               { label: 'Income Statement', routerLink: '/#' },
  //               { label: 'Balance Sheet', routerLink: '/#' },
  //               { label: 'Statement of CashFlows', routerLink: '/#' },
  //               { label: 'Other Structures', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Reports and Forms',
  //             items: [
  //               // { label: 'Trial Balance', routerLink: '/#' },
  //               {
  //                 label: 'Trial Balance', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTrial+Bal&rs:Command=Render');
  //                 }
  //               },
  //               {
  //                 label: 'Trial Bal Trends', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTrial+Bal+Trends&rs:Command=Render');
  //                 }
  //               },
  //               { label: 'Income Statement', routerLink: '/#' },
  //               { label: 'Balance Sheet', routerLink: '/#' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Journals',
  //             items: [
  //               {
  //                 label: 'Journal List',
  //                 routerLink: '/accountmodule/accountpages/app-list-journel',
  //               },
  //               {
  //                 label: 'Create Journal Entry',
  //                 routerLink: '/accountmodule/accountpages/app-create-journel',
  //               },
  //               {
  //                 label: 'Schedule',
  //                 routerLink: '/accountmodule/accountpages/app-schedule',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Organization',
  //             items: [
  //               {
  //                 label: 'Legal Entity List',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-legal-entity-list',
  //               },
  //               {
  //                 label: 'Create Legal Entity',
  //                 command: (event?: any) => {
  //                   this.newLegalEntityClick();
  //                 },
  //               },
               
  //               {
  //                 label: 'Management Structure',
  //                 routerLink:
  //                   '/generalledgermodule/generalledgerpage/app-managemententity-structure',
  //               },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Accounts Receivable',
  //             items: [
  //               { label: 'Customer Invoice List', routerLink: '/accountreceivable/accountreceivablepages/app-customer-invoice-list' },
  //               { label: 'Process Customer Receipt', routerLink: '/accountreceivable/accountreceivablepages/app-customer-payment-list' },
  //               { label: 'Process Customer Credit', routerLink: '/#' },
  //               {
  //                 label: 'AR Settings List',
  //                 routerLink:
  //                   '/accountreceivablesettingsmodule/arsettings/app-account-receivable-settings-list',
  //               }
  //             ],
  //           },
  //           {
  //             label: 'Reports and Forms',
  //             items: [
               
  //               {
  //                 label: 'AR Aging', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fAR+Invoice+Aging&rs:Command=Render ');
  //                 }
  //               },
  //               { label: 'History By Customer', routerLink: '/#' },
  //               { label: 'History By Payment', routerLink: '/#' },
  //               { label: 'Customer Statement', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Customer Receipts',
  //             items: [
  //               { label: 'Customer Accounts', routerLink: '/#' },
  //               { label: 'Customer Payments', routerLink: '/#' },
  //               { label: 'Print Deposit', routerLink: '/#' },
  //               { label: 'Payment History', routerLink: '/#' },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Accounts Payable',
  //             items: [
  //               { label: 'Vendor Invoice List', routerLink: '/#' },
  //               { label: 'Enter Invoices', routerLink: '/#' },
  //               { label: 'Vendor Credit', routerLink: '/#' },
  //               {
  //                 label: 'Open/Close AP Subledger',
  //                 routerLink:
  //                   '/accountpayble/accountpayble/app-open-close-ap-subledger',
  //               },
  //               { label: 'Print Checks', routerLink: '/#' },
  //               {
  //                 label: 'Open/Close AP Subledger',
  //                 routerLink:
  //                   '/accountpayble/accountpayble/app-open-close-ap-subledger',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports and Forms',
  //             items: [
  //               { label: 'AP Register', routerLink: '/#' },
  //               { label: 'AR Aging', routerLink: '/#' },
  //               { label: 'History By Invoice', routerLink: '/#' },
  //               { label: 'History By Payment', routerLink: '/#' },
  //               { label: 'Open Vendor Invoice', routerLink: '/#' },
  //               { label: 'Check Register', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Vendor Payments',
  //             items: [
  //               { label: 'Vendor Accounts', routerLink: '/#' },
  //               { label: 'Process Checks', routerLink: '/#' },
  //               { label: 'Reconcile', routerLink: '/#' },
  //               { label: 'Print Check', routerLink: '/#' },
  //               { label: 'Print Check Batch', routerLink: '/#' },
  //               { label: 'Print Check Register', routerLink: '/#' },
  //             ],
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Order',
  //       icon: 'fa fa-fw fa-shopping-cart',
  //       items: [
  //         [
  //           {
  //             label: 'Purchase Order',
  //             items: [
  //               {
  //                 label: 'PO List',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-polist',
  //               },
  //               {
  //                 label: 'Create PO',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-create-po',
  //               },
  //               {
  //                 label: 'PO Approval',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-po-approval',
  //               },
  //               {
  //                 label: 'PO Approval Rule',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-po-approval-rule',
  //               },
  //               {
  //                 label: 'PO Setting',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-po-settings',
  //               },
  //               { label: 'Create Vendor RMA', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Reports & Forms',
  //             items: [
  //               {
  //                 label: 'PO Report',
                 
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPurchase+Order&rs:Command=Render');
  //                 },

  //               },
  //               {
  //                 label: 'Purchase order Dashboard', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPurchase+Order+Dashboard&rs:Command=Render');
  //                 }
  //               },
  //               {
  //                 label: 'PO TO WO-SO', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fPO+to+WO-SO&rs:Command=Render');
  //                 }
  //               }
  //             ],
  //           },
  //         ],
  //         [
  // {
  //             label: 'Repair Order',
  //             items: [
  //               {
  //                 label: 'RO List',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-ro-list',
  //               },
  //               {
  //                 label: 'Create RO',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-create-ro',
  //               },
  //               {
  //                 label: 'RO Approval',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-ro-approval',
  //               },
  //               {
  //                 label: 'RO Approval Rule',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-ro-approval-rule',
  //               },
  //               {
  //                 label: 'RO Settings',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/vendorsmodule/vendorpages/app-ro-settings',
  //               }
  //             ],
  //           },
  //           {
  //             label: 'Reports & forms',
  //             items: [
  //               {
  //                 label: 'Repair order by WO & SO', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fRepair+Order+by+WO+and+SO&rs:Command=Render');
  //                 }
  //               },
  //             ]
  //           }
  //         ],
  //         [
  //           {
  //             label: 'Sales Order',
  //             items: [
  //               {
  //                 label: 'SO List',
  //                 routerLink: '/salesmodule/salespages/sales-order-list',
  //               },
  //               {
  //                 label: 'Create Sales Order',
  //                 routerLink: '/salesmodule/salespages/sales-order',
  //               },
  //               { label: 'SO Shipping', routerLink: '/#' },
  //               { label: 'SO Billing', routerLink: '/#' },
  //               { label: 'SO Confirmation List', routerLink: '/salesmodule/salespages/sales-order-confirmation-list' },
  //               {
  //                 label: 'Sales Order Approval Rule',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/salesmodule/salespages/app-so-approval-rule',
  //               }
  //             ],
  //           },
  //           {
  //             label: 'SO Quote',
  //             items: [
  //               {
  //                 label: 'SO Quote List',
  //                 routerLink: '/salesmodule/salespages/sales-quote-list',
  //               },
  //               {
  //                 label: 'Create Sales Order Quote',
  //                 routerLink: '/salesmodule/salespages/sales-quote',
  //               },
  //               { label: 'Open SO Quotes', routerLink: '/#' },
  //               { label: 'Approved SO Quotes', routerLink: '/#' },
  //               {
  //                 label: 'Sales Order Quote Approval Rule',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/salesmodule/salespages/app-soq-approval-rule',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Sales Order Settings',
  //             items: [
  //               {
  //                 label: 'SO Quote Settings List',
  //                 routerLink:
  //                   '/salesordersettingsmodule/salesordersettings/app-sales-quote-settings-list',
  //               }, {
  //                 label: 'SO Settings List',
  //                 routerLink:
  //                   '/salesordersettingsmodule/salesordersettings/app-sales-order-settings-list',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports & forms',
  //             items: [
  //               { label: 'Open Sales list', routerLink: '/#' },
  //               { label: 'SO Backlog', routerLink: '/#' },
  //               {
  //                 label: 'SO On Time Perfomance', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+On+Time+Performance&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'SO Quotes',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Quote+Report&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'SO Quote Conversion',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Quote+Conversion&rs:Command=Render');
  //                 },
  //               }, {
  //                 label: 'SO Quote History',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Quote+History&rs:Command=Render');
  //                 },
  //               }, {
  //                 label: 'SO Billing',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Billing&rs:Command=Render');
  //                 },
  //               }, {
  //                 label: 'SO Gross Margin',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+Gross+Margin&rs:Command=Render');
  //                 },
  //               }, {
  //                 label: 'Salesperson Report',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSalesperson+Report&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'SO Turn Around Time (TAT)', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fSales+Order+-+Turn+Around+Time+(TAT)&rs:Command=Render');
  //                 }
  //               }
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Work Order',
  //             items: [
  //               {
  //                 label: 'Work Order List',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-work-order-list',
  //               },
  //               {
  //                 label: 'Create Work Order',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-work-order-add',
  //               },
  //               { label: 'WO Shipping', routerLink: '/#' },
  //               { label: 'WO Billing', routerLink: '/#' },
               
              
  //             ],
  //           },
  //           {
  //             label: 'Direct Labour',
  //             items: [
  //               {
  //                 label: 'Direct Labour and OH Cost',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-direct-labour',
  //               },
  //               {
  //                 label: 'Direct Labour Add',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-direct-labour-add',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports and Forms',
  //             items: [
  //               {
  //                 label: 'WIP Summary',
  //                 routerLink: '/#',
  //               },
  //               {
  //                 label: 'WIP Details',
  //                 routerLink: '/#',
  //               },
  //               {
  //                 label: 'WO Backlog',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Backlog&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'WO On Time Performance',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+On+Time+Performance&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'Work Order Tracking',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Tracking&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'WO Quotes',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Quotes&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'WO Quote Conversion',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Quote+Conversion&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'WO Quote History',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Quote+History&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'WO Billing',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Billing&rs:Command=Render');
  //                 },
  //               },
  //               {
  //                 label: 'WO Gross Margin',
  //                 // routerLink: '/#',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+Gross+Margin&rs:Command=Render');
  //                 },

  //               },
  //               {
  //                 label: 'Labor Tracking', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fLabor+Tracking&rs:Command=Render');
  //                 }
  //               },
  //               {
  //                 label: 'Tech Productivity', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTech+Productivity&rs:Command=Render');
  //                 }
  //               },
  //               {
  //                 label: 'Turn Around Time (TAT)', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fWork+Order+-Turn+Around+Time+(TAT)&rs:Command=Render');
  //                 }
  //               }
  //             ],
  //           },

          
  //         ],
  //         [
  //           {
  //             label: 'Work-order Quote',
  //             items: [
  //               {
  //                 label: 'WO Quote List',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-work-order-quote-list',
  //               },
  //               {
  //                 label: 'Create  WO Quote',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-work-order-quote',
  //               },
  //               {
  //                 label: 'Work Order Quote Approval Rule',
  //                 command: () => this.clearStocklineAndSOStorageReference(),
  //                 routerLink: '/workordersmodule/workorderspages/app-woq-approval-rule',
  //               }
  //             ],
  //           },
  //           {
  //             label: 'Reports and Forms',
  //             items: [
  //               {
  //                 label: 'Open WO Quote',
  //                 routerLink: '/#',
  //               },
  //               {
  //                 label: 'Approved WO Quote',
  //                 routerLink: '/#',
  //               },
  //               {
  //                 label: 'Work Order Report',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-workorder-report',
  //               },

  //               {
  //                 label: 'Inventory Report',
  //                 routerLink:
  //                   '/workordersmodule/workorderspages/app-inventory-report',
  //               },
  //             ],
  //           },
          

  //         ],
  //         [
  //           {
  //             label: 'Exchange',
  //             items: [
  //               {
  //                 label: 'Exchange Quote List',
  //                 routerLink: '/exchangemodule/exchangepages/exchange-quote-list',
  //               },
  //               {
  //                 label: 'Exchange Quote Approval Rule',
  //                 routerLink: '/exchangemodule/exchangepages/app-exchange-quote-approval-rule',
  //               },
  //             ]
  //           },
  //           {
  //             label: 'Exchange Sales Order',
  //             items: [
  //               {
  //                 label: 'Exchange Sales Order List',
  //                 routerLink: '/exchangemodule/exchangepages/exchange-sales-order-list',
  //               }
  //             ]
  //           }
  //         ],
  //         [
  //           {
  //             label: 'Speed Quote',
  //             items: [
  //               {
  //                 label: 'Speed Quote List',
  //                 routerLink: '/salesmodule/salespages/speed-quote-list',
  //               }
  //             ]
  //           }
  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Stock',
  //       icon: 'fa fa-fw fa-folder-open',
  //       items: [
          
  //         [
  //           {
  //             label: 'Stock Line',
  //             items: [
  //               {
  //                 label: 'Stock Line List',
  //                 routerLink:
  //                   '/stocklinemodule/stocklinepages/app-stock-line-list',
  //               },
  //               {
  //                 label: 'Create Stock Line',
  //                 routerLink:
  //                   '/stocklinemodule/stocklinepages/app-stock-line-setup',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports and Forms',
  //             items: [
  //               { label: 'Item Aging', routerLink: '/#' },
  //               { label: 'Slow Moving Stock', routerLink: '/#' },
  //               { label: 'Hot List', routerLink: '/#' },
              
  //               {
  //                 label: 'Stock Line', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fStockLine&rs:Command=Render');
  //                 }
  //               }
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Workflow',
  //             items: [
  //               {
  //                 label: 'Workflow List',
  //                 routerLink: '/workflowmodule/workflowpages/app-workflow-list',
  //               },
  //               {
  //                 label: 'Create Workflow',
  //                 routerLink: '/workflowmodule/workflowpages/wf-create',
  //               },
  //               {
  //                 label: 'Task',
  //                 routerLink: '/singlepages/singlepages/app-tasks',
  //               },
  //               {
  //                 label: 'Task Attribute',
  //                 routerLink: '/singlepages/singlepages/app-task-attributes',
  //               },
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Item Master',
  //             icon: 'fa fa-fw fa-vcard-o ',
  //             items: [
  //               {
  //                 label: 'Item List',
  //                 routerLink:
  //                   '/itemmastersmodule/itemmasterpages/app-item-master-list',
  //               },
  //               {
  //                 label: 'Create Item Master',
  //                 routerLink:
  //                   '/itemmastersmodule/itemmasterpages/app-item-master-stock',
  //               },
  //             ],
  //           },
  //           {
  //             label: ' Capabilities',
  //             items: [
  //               {
  //                 label: 'Capabilities List',
  //                 routerLink:
  //                   '/itemmastersmodule/itemmasterpages/app-item-master-capabilities-list',
  //               },
  //               {
  //                 label: 'Create Capabilities',
  //                 routerLink:
  //                   '/itemmastersmodule/itemmasterpages/app-item-master-create-capabilities',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports & Forms',
  //             items: [
  //               {
  //                 label: 'Capabilities List Report', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCapabilities&rs:Command=Render');
  //                 }
  //               }



  //             ],
  //           },
  //         ],
  //       ],
  //     },
  //     {
  //       label: 'Asset Management',
  //       icon: 'fa fa-fw fa-folder-open',
  //       items: [
  //         [
  //           {
  //             label: 'Asset Management',
  //             items: [
  //               {
  //                 label: 'Asset Inventory List',
  //                 routerLink:
  //                   '/assetmodule/assetpages/app-asset-inventory-listing',
  //               },
  //               {
  //                 label: 'Add Asset Inventory',
  //                 routerLink:
  //                   '/assetmodule/assetpages/app-create-asset-inventory',
  //               },
  //               {
  //                 label: 'Asset List',
  //                 routerLink: '/assetmodule/assetpages/app-asset-listing',
  //               },
  //               {
  //                 label: 'Create Asset',
  //                 routerLink: '/assetmodule/assetpages/app-create-asset',
  //               },
  //               {
  //                 label: 'Calibration Mgmt',
  //                 routerLink: '/assetmodule/assetpages/app-calibration-mgmt-listing',
  //               },
  //               { label: 'Asset Maintenance', routerLink: '/#' },
  //               { label: 'Leases and Insurance', routerLink: '/#' },
               
  //             ],
  //           },
  //           {
  //             label: 'Accounting',
  //             items: [
  //               { label: 'Process Depreciation', routerLink: '/#' },
  //               { label: 'Asset Adjustment', routerLink: '/#' },

  //               { label: 'Asset Sale, Write Off, Write Down', routerLink: '/#' },

  //               { label: 'Depreciation Forecast', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Report & Forms',
  //             items: [
  //               { label: 'Reports List ', routerLink: '/#' },
  //               { label: 'Depreciation', routerLink: '/#' },
  //               { label: 'Additons', routerLink: '/#' },
  //               { label: 'Disposal', routerLink: '/#' },
  //               {
  //                 label: 'Tools List', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fTools&rs:Command=Render');
  //                 }
  //               },
  //               { label: 'Calibration List ', routerLink: '/#' },
  //               { label: 'Calibration Due Report', routerLink: '/#' }

  //             ],
  //           },
           
  //         ],

  //       ],
  //     },
  //     {
  //       label: 'Admin',
  //       icon: 'fa fa-fw fa-user',
  //       items: [
  //         [
  //           {
  //             label: 'General',
  //             items: [
  //               { 
  //                 label: 'Bulk Emails', 
  //                 routerLink: 'admin/bulk-email' },
  //               { label: 'Code Prefixes', routerLink: '/#' },
  //               { label: 'Customer CRM', routerLink: '/#' },
  //               { label: 'Email Config', routerLink: '/#' },
  //               {
  //                 label: 'Global Settings',
  //                 routerLink: 'admin/global-settings',
  //               },
  //               { label: 'Approval Rule', routerLink: 'admin/po-approvals' },
  //               { label: 'Notifications', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Employee',
  //             items: [
  //               { label: 'Employee List Approval', routerLink: '/#' },
  //               { label: 'Employee Management', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Roles',
  //             items: [
  //               {
  //                 label: 'Roles List',
  //                 routerLink: '/rolesmodule/rolespages/edit-app-roles',
  //               },
  //               {
  //                 label: 'Roles List by Module',
  //                 routerLink:
  //                   '/rolesmodule/rolespages/app-roles-list-by-module',
  //               },
  //               {
  //                 label: 'Create Role',
  //                 routerLink: '/rolesmodule/rolespages/app-roles-setup',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Work Order Settings',
  //             items: [
  //               {
  //                 label: 'Work Order Settings List',
  //                 routerLink:
  //                   '/workordersettingsmodule/workordersettings/app-work-order-settings-list',
  //               },
  //               {
  //                 label: 'WO Quote Settings List',
  //                 routerLink:
  //                   '/workordersettingsmodule/workordersettings/app-wo-quote-settings-list',
  //               },
              
  //             ],
  //           }
  //         ],
  //         [
  //           {
  //             label: 'Receivable',
  //             items: [
  //               {
  //                 label: 'Purchase Order',
  //                 routerLink:
  //                   '/receivingmodule/receivingpages/app-purchase-order',
  //               },
  //               {
  //                 label: 'Repair Order',
  //                 routerLink: '/receivingmodule/receivingpages/app-ro',
  //               },
  //               {
  //                 label: 'Shipping Receiver',
  //                 routerLink: '/receivingmodule/receivingpages/app-shipping',
  //               },
  //               { label: 'Work Order', routerLink: '/#' },
  //             ],
  //           },
  //           {
  //             label: 'Customer Work List ',
  //             items: [
  //               {
  //                 label: 'Receive Customer List',
  //                 routerLink:
  //                   '/receivingmodule/receivingpages/app-customer-works-list',
  //               },
  //               {
  //                 label: 'Receive Customer',
  //                 routerLink:
  //                   '/receivingmodule/receivingpages/app-customer-work-setup',
  //               },
  //             ],
  //           },
  //           {
  //             label: 'Reports and forms',
  //             items: [
  //               {
  //                 label: 'Receiving Log',
  //                 command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fReceiving+Log&rs:Command=Render');
  //                 }
  //               },
              
  //               {
  //                 label: 'Receive customer work', command: (event?: any) => {
  //                   this.navigateToURL(environment.reportUrl + '/ReportServer01/Pages/ReportViewer.aspx?%2fReport+Project1%2fCustomer+Work&rs:Command=Render');
  //                 }
  //               }
  //             ],
  //           },
  //         ],
  //         [
  //           {
  //             label: 'Contract Management',
  //             items: [
  //               { label: 'Contract List', routerLink: '/#' },
  //               { label: 'Contract Setup', routerLink: '/#' },
              
  //             ],
  //           },

  //         ],
  //       ],
  //     },
      
  //   ];



    if (this.authService.currentManagementStructure) {
      this.managementStructure.companyId = this.authService.currentManagementStructure.level1;
      this.managementStructure.buId = this.authService.currentManagementStructure.level2;
      this.managementStructure.divisionId = this.authService.currentManagementStructure.level3;
      this.managementStructure.departmentId = this.authService.currentManagementStructure.level4;
    }

    this.isUserLoggedIn = this.authService.isLoggedIn;

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
      this.isUserLoggedIn = isLoggedIn;

      if (this.isUserLoggedIn) {
        this.initNotificationsLoading();
      } else {
        this.unsubscribeNotifications();
      }

      setTimeout(() => {
        if (!this.isUserLoggedIn) {
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
    this.authService.logout();
    this.authService.redirectLogoutUser();
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

