import { Component, OnInit,Input } from '@angular/core';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
@Component({
   selector: 'app-audit-component',
   templateUrl: './audit-component.component.html',
   styleUrls: ['./audit-component.component.scss']
})

export class AuditComponentComponent implements OnInit { 
    @Input() auditHistoryHeader : any;
    @Input() auditHistory : any;
    data:any;
    constructor( private activeModal: NgbActiveModal,) { } 

    ngOnInit() { 
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
      }
      dismissModell() {
        this.activeModal.close();
    }
}