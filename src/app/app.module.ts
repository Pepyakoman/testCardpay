/** 
Модуль разделен на три компонента

AppComponent - главный компонент,
в нем происходит обработка и через него происходит обмен данными между двумя дочерними компонентами:

  FirstComponentComponent - отвечает за отображение списка клиентов, оказаных им услуг, их стоимости и состояния счета;
  SecondComponentComponent - представляет из себя форму, для выбора услуг и/или их оплаты;

 **/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FirstComponentComponent } from './first-component/first-component.component';
import { SecondComponentComponent } from './second-component/second-component.component';

@NgModule({
  declarations: [
    AppComponent,
    FirstComponentComponent,
    SecondComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
