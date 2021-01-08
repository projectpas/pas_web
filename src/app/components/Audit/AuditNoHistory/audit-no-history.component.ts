import { OnInit, Component, Input } from "@angular/core";
import { fadeInOut } from "../../../services/animations";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "audit-no-history",
  templateUrl: "./audit-no-history.component.html",
  styleUrls: [],
  animations: [fadeInOut]
})
export class AuditNoHistoryComponent implements OnInit {
  @Input() Title: string;
  @Input() Modal: NgbModalRef;
  ngOnInit(): void {}

  dismissModel(): void {
    if (this.Modal != undefined) {
      this.Modal.close();
    }
  }
}
