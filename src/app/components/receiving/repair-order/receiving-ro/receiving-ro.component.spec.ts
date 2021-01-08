import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ReceivingRoComponent } from './receiving-ro.component';

let component: ReceivingRoComponent;
let fixture: ComponentFixture<ReceivingRoComponent>;

describe('repair-order component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReceivingRoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ReceivingRoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});