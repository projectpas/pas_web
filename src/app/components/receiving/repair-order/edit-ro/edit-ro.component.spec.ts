import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { EditRoComponent } from './edit-ro.component';

let component: EditRoComponent;
let fixture: ComponentFixture<EditRoComponent>;

describe('repair-order component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditRoComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(EditRoComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});