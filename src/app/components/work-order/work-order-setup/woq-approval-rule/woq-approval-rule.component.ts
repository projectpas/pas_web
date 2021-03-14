import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-woq-approval-rule',
  templateUrl: './woq-approval-rule.component.html',
  styleUrls: ['./woq-approval-rule.component.scss']
})
export class WoqApprovalRuleComponent implements OnInit {

  moduleType:any  = 'WOQ'; 
	id: number;
  constructor() { }

  ngOnInit() {
  }

}
