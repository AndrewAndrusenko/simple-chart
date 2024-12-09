import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { catchError, filter, Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { IndexDBConfig } from './app.module';
export enum StorageType {
  Cookie,
  IndexDB
}
export interface Ipresets {
  code:string,
  color:string,
  symbol:string,
}
class Strategy {
  getData(key:string) {};
  setData(key:string, data: Ipresets) {}
}
class StrategyCookie extends Strategy {
  constructor(private cookiesService:CookieService) {super()}
  override getData(key:string): Observable<Ipresets|Error> {
    let result:Ipresets|Error
    try {
      result = JSON.parse(this.cookiesService.get(key))
    } catch (error) {
      console.log('err',error);
      result = error as Error
    }
    return of <Ipresets|Error>(result as Ipresets|Error).pipe(filter(data=>!(data instanceof Error )));
  }
  override setData(key:string, data: Ipresets): Observable<Ipresets|Error> {
    this.cookiesService.set(key, JSON.stringify(data));
    return (this.cookiesService.get(key) === JSON.stringify(data)?  of(data) : of (new Error('Error saving cookies')))
  }
}
class StrategyIndexDB extends Strategy {
  constructor(private indexDBservice:NgxIndexedDBService) {super()}
  override getData(key:string): Observable<Ipresets> {
    return this.indexDBservice.getByIndex <Ipresets>(
      IndexDBConfig.objectStoresMeta[0].store,
      IndexDBConfig.objectStoresMeta[0].storeConfig.keyPath as string,
      key).pipe(
        filter(data=>data!==undefined),
        catchError(err=>{
          console.log('er',err);
          return of(err)
        })); ;
  }
  override setData(key: string, data: Ipresets): Observable<Ipresets|Error> {
      return this.indexDBservice.update <Ipresets|Error>(
        IndexDBConfig.objectStoresMeta[0].store,
        data
      ).pipe(catchError(err=>{
          console.log('er',err);
          return of(err)
        }));
  }
}
export class AppStorage {
  constructor(private strategy:StrategyIndexDB|StrategyCookie) {
    this.strategy = strategy
  }
  getStorageData (key:string):Observable<Ipresets|Error> {
    return this.strategy.getData(key)
  }
  setStorageData (key:string,data:Ipresets):Observable<Ipresets|Error> {
    return this.strategy.setData(key,data)
  }
}
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
    private indexDBservice:NgxIndexedDBService,
    private cookiesService:CookieService
  ) { }
  initStorageObj(storageType:StorageType):AppStorage {
    switch (storageType) {
      case StorageType.Cookie :return new AppStorage (new StrategyCookie(this.cookiesService))
      case StorageType.IndexDB :  return new AppStorage (new StrategyIndexDB(this.indexDBservice))
    }
  }
}
