import express, {Express,Request,Response} from "express";
import {data,IChartDataFull} from "../http-server-api-test/res"
import  cors from 'cors';
const PORT:number = 3005
const colors:string[] = ['#4d9058','#4d7990','#ce2514','#9614ce']
const pointTypes:string[] = ['circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none']
const appServer:Express = express()
appServer.use(cors())
appServer.use(express.json())
let testData:IChartDataFull = JSON.parse(JSON.stringify(data))
appServer.get('/',(req:Request,res:Response)=>{
  console.log('Your request is received');
  let varName1 = `Data${Math.floor(Math.random()*9)}`
  let varName2 = `Data_Probability${Math.floor(Math.random()*9)}`
  testData.data = data.data.map(el=> {
    return {
      [varName1]:el.var1+Math.random(),
      [varName2]:el.var2+Math.random()
    }
  })
  testData.presets.color = colors[Math.floor(Math.random()*3)]
  testData.presets.symbol = pointTypes[Math.floor(Math.random()*8)]
  res.send(testData)
})
appServer.listen(PORT,'localhost', ()=>console.log(`Test Server is running on port ${PORT}`))