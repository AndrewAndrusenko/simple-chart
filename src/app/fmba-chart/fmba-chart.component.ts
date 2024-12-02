import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeriesOption, EChartsOption } from 'echarts/types/dist/echarts';

import { ChartDataHandlerService } from '../chart-data-handler.service';
import { catchError, Subscription, throwError } from 'rxjs';
type SeriesOptionCR = SeriesOption & {symbol:string}
@Component({
  selector: 'app-fmba-chart',
  templateUrl: './fmba-chart.component.html',
  styleUrls: ['./fmba-chart.component.scss']
})
export class FmbaChartComponent {
  public chartOption: EChartsOption = {}; //параметры графика
  public chartForm:FormGroup; //форма управления графиком
  public axises:string[]=[]; // список осей графика, которые можно менять местами
  public symbols:string[]=  ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none']; // символы точек графика
  public newColor:string =''; // выбор цвета графика
  private subscriptions = new Subscription
  public errorMsg = ''
  constructor(
    private fb:FormBuilder,
    private handlerService:ChartDataHandlerService
  ) {
   this.chartForm = fb.group ({
      xAxisName:[],
      yAxisName:[],
      color:[],
      symbol:[],
      chartName:[],
    })
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();    
  }
  getData (colorChart='#4d9058',symbolType='none') { //запрос данных с тестового сервера и обновление форма управления графиком после получения данных
    this.errorMsg = '';
    this.subscriptions.add (
        this.handlerService.prepareChartOptions(colorChart,symbolType).
        pipe (    
          catchError((err)=>{
          this.errorMsg = err.message
          return throwError(()=> (err))
        }
        ))
        .subscribe(newOption=>{
        this.chartOption=newOption.chartOptions;
        this.chartForm.patchValue(newOption.presets)
        this.newColor = this.color?.value
        this.axises = [newOption.presets.xAxisName||'',newOption.presets.yAxisName||'']
      })
    )
  }
  changeColor () { // смена цвета графика
    this.chartOption = {...structuredClone (this.chartOption),color : this.newColor};
  }
  symbolChange () { // смена символя точки
    let newOption = structuredClone (this.chartOption as EChartsOption);
   (newOption.series as SeriesOptionCR[])[0].symbol = this.symbol?.value
    this.chartOption = newOption
  }
  drawChart (typeAxis:string='x') { // смена осей графика 
    typeAxis === 'x'? this.yAxisName?.patchValue(this.axises.find(el=>el!==this.yAxisName?.value)) : this.xAxisName?.patchValue(this.axises.find(el=>el!==this.yAxisName?.value))
    this.chartOption = this.handlerService.reverseChart(this.chartOption)
  }
  get xAxisName () {return this.chartForm.get('xAxisName')};
  get yAxisName () {return this.chartForm.get('yAxisName')};
  get color() {return this.chartForm.get('color')};
  get symbol() {return this.chartForm.get('symbol')};
  get chartName() {return this.chartForm.get('chartName')};
}
