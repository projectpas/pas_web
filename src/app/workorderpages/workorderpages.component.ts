
import { Component, OnInit } from "@angular/core";

@Component({
    selector: "quickapp-pro-workordrs",
    templateUrl: './workorderpages.component.html'
})
export class WorkOrderPagesComponent implements OnInit {
    isSpinnerVisible=true;

    ngOnInit(){
setTimeout(() => {
    this.isSpinnerVisible=false;
}, 2000);
    }
}