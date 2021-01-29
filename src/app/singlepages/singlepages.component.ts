// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component } from "@angular/core";
import { MenuItem } from 'primeng/api';
import { Message } from 'primeng/components/common/message';
import { Router, ActivatedRoute, Params, NavigationExtras, NavigationStart } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb'; //Bread Crumb
import { SingleScreenBreadcrumbService } from "../services/single-screens-breadcrumb.service";
@Component({
	selector: "quickapp-pro-singlepages",
	templateUrl: './singlepages.component.html'
})
export class SingleComponent {
	otherurl: any;
	currentUrl: string;

	public items: MenuItem[];
	home: MenuItem;

	constructor(private router: ActivatedRoute, private route: Router, private singleScreenBreadCrumb: SingleScreenBreadcrumbService) {

		this.singleScreenBreadCrumb.bredcrumbObjChangeObject$.subscribe(value => {
			//debugger
			this.otherurl = value;
			this.loadmethod(this.otherurl);

		});
		route.events.forEach((event) => {
			if (event instanceof NavigationStart) {
				console.log(event.url, "router value++++=")
				setTimeout(() => {
					this.loadmethod(event.url)
				}, 1000)

				this.currentUrl = event.url;;
			}
		})

	}

	ngOnInit() {

		this.currentUrl = this.route.url;
		//debugger
		this.loadmethod(this.currentUrl)

	}
	// ngOnChanges()

	loadmethod(url) {
		this.currentUrl = url;
		let publicationRecordId = this.router.snapshot.params['id'];
		if (this.currentUrl) {
			let itemLabel = '';
			switch (this.currentUrl) {
				case '/singlepages/singlepages/app-asset-type':
					itemLabel = 'Asset Class';
					break;
				case '/singlepages/singlepages/app-asset-intangible-class':
					itemLabel = 'Asset Intangible Class';
					break;
				case '/singlepages/singlepages/app-stage-code':
					itemLabel = 'Stage Code';
					break;
				case '/singlepages/singlepages/app-gl-account-category':
					itemLabel = 'GL Account Category';
					break;
				case '/singlepages/singlepages/app-expenditure-category':
					itemLabel = 'Expenditure Category';
					break;
				case '/singlepages/singlepages/app-asset-attribute-type':
					itemLabel = 'Asset Attribute Type';
					break;
				case '/singlepages/singlepages/app-asset-intangible-attribute-type':
					itemLabel = 'Intangible Attribute Type';
					break;
				default:
			}
			this.items = [
				{ label: 'Single Screens' },
				{ label: itemLabel }
			];

			if (this.currentUrl == '/singlepages/singlepages/app-actions') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Actions' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-manufacturer') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Manufacturer' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-vendorcapabilities') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Capabilities' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-disposal-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Disposal Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-lead-source') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Lead-Source' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-tag-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tag Type' }
				];
			}


			else if (this.currentUrl == '/singlepages/singlepages/app-publication-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Publication Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-document-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Document Type' }

				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-employee-training-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Employee Training Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-teardown-reason') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tear Down' }

				];
			}


			else if (this.currentUrl == '/singlepages/singlepages/app-depreciation-intervals') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Depreciation Intervals' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-depriciation-method') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Depreciation Method' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-adjustment-reason') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Adjustment Reason' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-asset-dep-convention-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Depreciation Convension' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/asset-status') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Status ' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/asset-location') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Location ' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/asset-acquisition-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Acquistion Type ' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-labor-and-overhead-cost-setup') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Labor And Overhead Cost Setup' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-certification-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Certification Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-action-attributes') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Actions Attributes' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-ata-main') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'ATA Chapter' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-charges') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Charges' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-conditions') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Condition' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-credit-terms') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Credit Terms' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-currency') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Currency' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-customer-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Customer Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-documents') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Documents' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-default-message') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Default Message' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-employee-expertise') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'EmployeeExpertise' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-findings') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Finding' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-integration') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Integration' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-item-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Item Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-item-group') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Item Group' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-job-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Job Types' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-job-title') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Job Titles' }
				];
			}



			else if (this.currentUrl == '/singlepages/singlepages/app-priority') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Priority' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-percent') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Percent' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-provision') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Provision' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-shipvia') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Ship Via' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-publication') {
				this.items = [
					{ label: 'Publication' },
					{ label: '' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-create-publication') {
				this.items = [
					{ label: 'Publication' },
					{ label: 'Create Publication' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-publication/edit/' + publicationRecordId) {
				this.items = [
					{ label: 'Publication' },
					{ label: 'Edit Publication' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-reason') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Reason' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-tax-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tax Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-tax-rate') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tax Rate' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-unit-of-measure') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Unit of Measure' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-vendor-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-work-performed') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Work Performed' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-work-scope') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'WorkScope' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-action-attribute-mapping') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Action Attribute Mapping' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-ata-sub-chapter1') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'ATA Sub Chapter' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-ata-sub-chapter2') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'ATA Sub Chapter 2' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-capabilities') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Capabilities' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-financial-statement-mapping') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Financial Statement Mapping' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-gl-account-class') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'GL Account Class' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-gl-cash-flow-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'GL Cash Flow Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-node-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Node Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-master-1099') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Master 1099' }
				];
			}


			else if (this.currentUrl == '/singlepages/singlepages/app-gl-financial-statement') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'GL Financial Statement' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-journal-approvals') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Journal Approvals' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-rfq-engine') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'RFQ Engine' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-site') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Site' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-warehouse') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'WareHouse' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-location') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Location' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-shelf') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Shelf' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-bin') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Bin' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-dashnumber') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Dash Numbers' }

				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-vendor-process1099') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Process 1099' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-caps-report') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Caps Report' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-capability-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Capability Type' }
				];
			}
		}


		if (this.otherurl) {

			let itemLabel = '';
			let publicationRecordId = this.router.snapshot.params['id'];
			switch (this.currentUrl) {
				case '/singlepages/singlepages/app-asset-type':
					itemLabel = 'Asset Class';
					break;
				case '/singlepages/singlepages/app-asset-intangible-type':
					itemLabel = 'Asset Intangible Type';
					break;
				case '/singlepages/singlepages/app-stage-code':
					itemLabel = 'Stage Code';
					break;
				case '/singlepages/singlepages/app-gl-account-category':
					itemLabel = 'GL Account Category';
					break;
				case '/singlepages/singlepages/app-expenditure-category':
					itemLabel = 'Expenditure Category';
					break;
				case '/singlepages/singlepages/app-asset-attribute-type':
					itemLabel = 'Asset Attribute Type';
					break;
				case '/singlepages/singlepages/app-asset-intangible-attribute-type':
					itemLabel = 'Intangible Attribute Type';
					break;
				default:
			}
			this.items = [
				{ label: 'Single Screens' },
				{ label: itemLabel }
			];

			if (this.currentUrl == '/singlepages/singlepages/app-actions') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Actions' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-action-attributes') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Task Attributes' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-ata-main') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'ATA Chapter' }
				];
			}


			else if (this.currentUrl == '/singlepages/singlepages/app-charges') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Charges' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-conditions') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Condition' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-credit-terms') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Credit Terms' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-currency') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Currency' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-customer-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Customer Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-documents') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Documents' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-default-message') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Default Message' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-employee-expertise') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'EmployeeExpertise' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-findings') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Finding' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-gate-code') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Gate Code' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-integration') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Integration' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-item-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Item Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-job-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Job Types' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-item-group') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Item Group' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-job-title') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Job Titles' }
				];
			}


			else if (this.currentUrl == '/singlepages/singlepages/app-priority') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Priority' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-provision') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Provision' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-shipvia') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Ship Via' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-publication') {
				this.items = [
					{ label: 'Publication' },
					{ label: 'List' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-reason') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Reason' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-tax-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tax Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-tax-rate') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tax Rate' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-unit-of-measure') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Unit Of Measure' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-vendor-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-work-performed') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'WorkPerformed' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-work-scope') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'WorkScope' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-action-attribute-mapping') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Action Attribute Mapping' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-ata-sub-chapter1') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'ATA Sub Chapter' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-employee-training-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Employee Training Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-ata-sub-chapter2') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'ATA Sub Chapter 2' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-capabilities') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Capabilities' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-financial-statement-mapping') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Financial Statement Mapping' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-gl-account-class') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'GL Account Class' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-app-certification-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Certification Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-gl-cash-flow-classification') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'GL Cash Flow Classification' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-node-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Node Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-master-1099') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Master 1099' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-gl-financial-statement') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'GL Financial Statement' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-journal-approvals') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Journal Approvals' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-rfq-engine') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'RFQ Engine' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-site') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Site' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-labor-and-overhead-cost-setup') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Labor And Overhead Cost Setup' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-warehouse') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Warehouse' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-manufacturer') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Manufacturer' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-lead-source') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Lead-Source' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-tag-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tag Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-publication-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Publication Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-document-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Document Type' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-teardown-reason') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Tear Down' }

				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-vendorcapabilities') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Capabilities' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-disposal-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: ' Asset Disposal Type' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-depreciation-intervals') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Depreciation Intervals' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-depriciation-method') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Depreciation Method' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-adjustment-reason') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Adjustment Reason' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-asset-dep-convention-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Depreciation Convension' }
				];
			}


			else if (this.currentUrl == '/singlepages/singlepages/asset-status') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Status ' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/asset-location') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Location ' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/asset-acquisition-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Asset Acquistion Type ' }
				];
			}

			else if (this.currentUrl == '/singlepages/singlepages/app-shelf') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Shelf' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-bin') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Bin' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-location') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Location' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-aircraft-model') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Aircraft Model' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-aircraft-manufacturer') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Aircraft Manufacturer' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-dashnumber') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Dash Numbers' }

				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-node-setup') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Nodes' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-vendor-process1099') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Process 1099' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-caps-report') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Caps Report' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-capability-type') {
				this.items = [
					{ label: 'Single Screens' },
					{ label: 'Vendor Capability Type' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-publication') {
				this.items = [
					{ label: 'Publication' },
					{ label: '' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-create-publication') {
				this.items = [
					{ label: 'Publication' },
					{ label: 'Create Publication' }
				];
			}
			else if (this.currentUrl == '/singlepages/singlepages/app-publication/edit/' + publicationRecordId) {
				this.items = [
					{ label: 'Publication' },
					{ label: 'Edit Publication' }
				];
			}
		}
	}
}
