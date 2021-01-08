import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ViewRoComponent } from './view-ro.component';

let component: ViewRoComponent;
let fixture: ComponentFixture<ViewRoComponent>;

describe('repair-order component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewRoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ViewRoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});