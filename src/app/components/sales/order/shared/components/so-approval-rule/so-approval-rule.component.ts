import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-so-approval-rule',
  templateUrl: './so-approval-rule.component.html',
  styleUrls: ['./so-approval-rule.component.css']
})
export class SOApprovalRuleComponent implements OnInit {
  moduleType:any  = 'SO'; 
	id: number;

  constructor( ) { 
  }

  ngOnInit() {
    
  } 

}
