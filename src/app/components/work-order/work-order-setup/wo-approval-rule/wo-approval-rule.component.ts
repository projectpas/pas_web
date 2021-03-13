import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wo-approval-rule',
  templateUrl: './wo-approval-rule.component.html',
  styleUrls: ['./wo-approval-rule.component.scss']
})
export class WoApprovalRuleComponent implements OnInit {

  moduleType:any  = 'WO'; 
	id: number;
  constructor() 
  {}

  ngOnInit() {
  }

}
