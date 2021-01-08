import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { RoComponent } from './ro.component';

let component: RoComponent;
let fixture: ComponentFixture<RoComponent>;

describe('repair-order component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(RoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});