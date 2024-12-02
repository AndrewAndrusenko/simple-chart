import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of, switchMap } from 'rxjs';
import { EChartsOption } from 'echarts';
import {environment} from '../../environments/environment'
interface IPresets {
  color?:string;
  symbol?:string;
  chartName?:string;
  xAxisName?:string,
  yAxisName?:string,
}
interface IChartDataFull {
  data: Record <string,number> [];
  presets:IPresets
}
export interface resultChartData {
  chartOptions:EChartsOption,
  presets:IPresets
}
@Injectable({
  providedIn: 'root'
})
export class ChartDataHandlerService {
  constructor(private http:HttpClient) {}
  getChartData (): Observable<IChartDataFull> { //запрос данных с тестового сервера
    //Сервер в папка http-server-api-test. Запуск node app-server.js. 
    //Сервер отправляет приложенный к заданию пример данных немного его модифицируя случайным образом
    return this.http.get<IChartDataFull> (environment.TEST_ENDPOINT)
  }
  prepareChartOptions (colorChart:string,symbolType:string ): Observable <resultChartData> { //подготовка данных для отрисовки графика
    let newOptions:resultChartData = {
      presets:{},
      chartOptions:{}
    };
    return this.getChartData().pipe (
      switchMap (newData => {
        let axisNames = Object.keys(newData.data[1])
        let xSeries = newData.data.map(el=>el[axisNames[0]]);
        let ySeries = newData.data.map(el=>el[axisNames[1]]);
        newOptions.presets = {
          ...newData.presets,
          xAxisName:axisNames[0],
          yAxisName:axisNames[1],
        }
        newOptions.chartOptions ={
          color:newData.presets.color||colorChart,
          title: {
            text: newData.presets.chartName||'Data Chart',
            left: 'center',
            textStyle: {
              color:'blue'
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          legend: {
            data: [axisNames[1]],
            left: 100
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            data: xSeries,
            name:axisNames[1],
            nameTextStyle: {
              color:'blue'
            }
          },
          yAxis: {
            min: Math.min(...ySeries),
            max: Math.max(...ySeries),
            type: 'value',
            name:axisNames[0],
            nameTextStyle: {
              color:'blue'
            }
          },
          series: [
            {
              name:axisNames[1],
              data: ySeries,
              type: 'line',
              smooth: true,
              symbol:newData.presets.symbol||symbolType,
              symbolSize:10
            },
          ],
        }
        return of(newOptions);
      })
    )
  }
  reverseChart (chartOptions:EChartsOption):EChartsOption { //смена осей графика
    let newOption = structuredClone(chartOptions as any );
    [newOption.series[0].data, newOption.xAxis.data] = [newOption.xAxis.data ,newOption.series[0].data]
    let xName = newOption.xAxis.name;
    newOption.xAxis.name = newOption.yAxis.name ;
    newOption.yAxis.name = xName;
    newOption.series[0].name = newOption.yAxis.name;
    newOption.legend.data =[ newOption.yAxis.name] ;
    newOption.yAxis.min = Math.min (...newOption.series[0].data);
    newOption.yAxis.max = Math.max (...newOption.series[0].data);
    return newOption
  }
}
