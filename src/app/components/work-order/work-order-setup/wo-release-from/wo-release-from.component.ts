import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wo-release-from',
  templateUrl: './wo-release-from.component.html',
  styleUrls: ['./wo-release-from.component.css']
})
export class WoReleaseFromComponent implements OnInit {

  moduleType:any  = 'WO'; 
	id: number;
  constructor() 
  {}

  ngOnInit() {
  }

}
