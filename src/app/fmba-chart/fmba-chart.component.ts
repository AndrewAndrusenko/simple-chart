import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeriesOption, EChartsOption } from 'echarts/types/dist/echarts';
import { ChartDataHandlerService } from '../chart-data-handler.service';
import { catchError, Subscription, throwError } from 'rxjs';
import { Ipresets, AppStorage, StorageService, StorageType } from '../storage.service';
import { MatSelectChange } from '@angular/material/select';
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
  private subscriptions = new Subscription;
  private readonly storageType = StorageType.IndexDB; //Storage type to store user preferences
  private appStorage: AppStorage;//Storage class
  public errorMsg = ''
  constructor(
    private fb:FormBuilder,
    private handlerService:ChartDataHandlerService,
    private storageService:StorageService, //Storage service to strore user prefences as cookies or in indexDB
  ) {
   this.chartForm = fb.group ({
      xAxisName:[],
      yAxisName:[],
      color:[],
      symbol:[],
      chartName:[],
    })
    this.appStorage = this.storageService.initStorageObj(this.storageType); //Storage strategy object is initiated 
  }
  ngOnInit(): void {
    this.appStorage.getStorageData('simple-chart-preset').subscribe(data=>{
      this.chartForm.patchValue(data);
      this.newColor=(data as Ipresets).color;
    })
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();    
  }
  getData (colorChart='#4d9058',symbolType='none') { //запрос данных с тестового сервера и обновление форма управления графиком после получения данных
    this.errorMsg = '';
    this.subscriptions.add (
      this.handlerService.prepareChartOptions(this.newColor||colorChart,this.symbol?.value||symbolType).pipe (    
        catchError((err)=>{
          this.errorMsg = err.message
          return throwError(()=>(err))
        }
      )).subscribe(newOption=>{
        this.chartOption=newOption.chartOptions;
        this.xAxisName?.patchValue(newOption.presets.xAxisName)
        this.yAxisName?.patchValue(newOption.presets.yAxisName)
        this.axises = [newOption.presets.xAxisName||'',newOption.presets.yAxisName||'']
      })
    )
  }
  savePreset (key:string,data:Ipresets) { //Save user preferences
    this.appStorage.setStorageData(key,data).subscribe()
  }
  changeColor (colorChanged:string) { // смена цвета графика
    this.color?.patchValue(colorChanged);
    this.chartOption?  this.chartOption = structuredClone(this.chartOption) : null;
    this.savePreset('simple-chart-preset',{code:'simple-chart-preset',color:colorChanged, symbol:this.symbol?.value as string});
  }
  symbolChange (event:MatSelectChange) { // смена символя точки
    this.chartOption?  this.chartOption ={... structuredClone (this.chartOption as EChartsOption), symbol:event.value} :null;
    this.savePreset('simple-chart-preset',{code:'simple-chart-preset',color:this.newColor, symbol:this.symbol?.value as string});
  }
  drawChart (typeAxis:string='x') { // смена осей графика 
    typeAxis === 'x'? this.yAxisName?.patchValue(this.axises.find(el=>el!==this.yAxisName?.value)) : this.xAxisName?.patchValue(this.axises.find(el=>el!==this.yAxisName?.value))
    this.chartOption = this.handlerService.reverseChart(this.chartOption)
  }
  get xAxisName () {return this.chartForm.get('xAxisName')};
  get yAxisName () {return this.chartForm.get('yAxisName')};
  get color() {return this.chartForm.get('color')};
  get symbol() {return this.chartForm.get('symbol')};
}
