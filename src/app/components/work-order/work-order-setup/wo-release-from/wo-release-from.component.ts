import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WorkOrderService } from 'src/app/services/work-order/work-order.service';

@Component({
  selector: 'app-wo-release-from',
  templateUrl: './wo-release-from.component.html',
  styleUrls: ['./wo-release-from.component.css']
})
export class WoReleaseFromComponent implements OnInit {

  moduleType:any  = 'WO'; 
	id: number;
  ReleaseData: any;
  isSpinnerVisible: boolean = true;
  workOrderId:Number=1;
  constructor(
    private authService: AuthService,
    private acRouter: ActivatedRoute,
    private router: Router,
    private workOrderService: WorkOrderService,
  ) 
  {}

  ngOnInit() 
  {
    this.GetWorkorderReleaseFromData();
  }

  GetWorkorderReleaseFromData()
  {
    this.isSpinnerVisible = true;
    this.workOrderService
      .GetWorkorderReleaseFromData(this.workOrderId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.ReleaseData = response;
      }, error => {
        this.isSpinnerVisible = false;
      });

  }

}
