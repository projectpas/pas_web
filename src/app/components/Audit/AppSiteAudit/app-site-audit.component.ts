import { OnInit, Component, Input } from "@angular/core";
import { fadeInOut } from "../../../services/animations";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-site-audit",
  templateUrl: "./app-site-audit.component.html",
  styleUrls: [],
  animations: [fadeInOut]
})
export class AppSiteAuditComponent implements OnInit {
  @Input() Data: any[];
  @Input() Modal: NgbModalRef;
  auditDetails: any[] = [];
  ngOnInit(): void {
    this.auditDetails = [];
    this.auditDetails = this.Data;
  }

  dismissModel(): void {
    if (this.Modal != undefined) {
      this.Modal.close();
      this.auditDetails = [];
    }
  }
}
