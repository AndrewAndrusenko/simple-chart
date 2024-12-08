import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { FmbaChartComponent } from './fmba-chart/fmba-chart.component'
import { MatButtonModule} from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ColorPickerModule } from 'ngx-color-picker';
import { HttpClientModule } from '@angular/common/http';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { CookieService } from 'ngx-cookie-service';
export const IndexDBConfig: DBConfig  = {
  name: 'fmba',
  version: 1,
  objectStoresMeta: [{
    store: 'fmbaData',
    storeConfig: { keyPath: 'code', autoIncrement: false },
    storeSchema: [
      { name: 'code', keypath: 'code', options: { unique: false } },
      { name: 'color', keypath: 'color', options: { unique: false } },
      { name: 'symbol', keypath: 'symbol', options: { unique: false } },
    ]
  }]
};

@NgModule({
  declarations: [
    AppComponent,
    FmbaChartComponent,
  ],
  imports: [
    BrowserModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ColorPickerModule,
    HttpClientModule,
    NgxIndexedDBModule.forRoot(IndexDBConfig),
    
  ],
  providers: [
    provideAnimations(),
    [CookieService],
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
