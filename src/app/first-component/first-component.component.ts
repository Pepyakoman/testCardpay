import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-first-component',
  templateUrl: './first-component.component.html',
  styleUrls: ['./first-component.component.css']
})
export class FirstComponentComponent implements OnInit {

  title:string = 'Клиенты'

  constructor() {}

  @Input() tempClients; // Связывание с рабочим массивом из родительского компонента
}
