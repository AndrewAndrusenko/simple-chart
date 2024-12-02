import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmbaChartComponent } from './fmba-chart.component';

describe('FmbaChartComponent', () => {
  let component: FmbaChartComponent;
  let fixture: ComponentFixture<FmbaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FmbaChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FmbaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
