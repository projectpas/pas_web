import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-ro-approval',
  templateUrl: './ro-approval.component.html',
  styleUrls: ['./ro-approval.component.css']
})
export class RoApprovalComponent implements OnInit {

  isApproverlist: boolean = true;
	breadcrumbs: MenuItem[];
    home: any;
  constructor() { }

  ngOnInit() {
    this.breadcrumbs = [
      { label: 'Repair Order' },
      { label: 'Repair Order Approval List' },
    ];
  }
  }


