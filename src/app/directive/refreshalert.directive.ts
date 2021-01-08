import { Directive, HostListener } from '@angular/core';

@Directive({ selector: '[refreshAlert]' })
export class RefreshAlert {

    @HostListener('mouseover', ['$event']) onKeyUp(id: any) {
        alert(`You clicked on `);
    }
    // window:keyup
}