import { Component } from "@angular/core";
import { MenuItem } from 'primeng/api';

@Component({
    selector: "generalledgerpages",
    templateUrl: './generalledgerpages.component.html'
})
export class GeneralledgerPageComponent {
    public items: MenuItem[];
    home: MenuItem;
}