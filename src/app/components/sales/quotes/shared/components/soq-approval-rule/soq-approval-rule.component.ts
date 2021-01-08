import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soq-approval-rule',
  templateUrl: './soq-approval-rule.component.html',
  styleUrls: ['./soq-approval-rule.component.css']
})
export class SOQApprovalRuleComponent implements OnInit {
  moduleType:any  = 'SOQ'; 
	id: number;

  constructor( ) { 
  }

  ngOnInit() {
    
  }

}
