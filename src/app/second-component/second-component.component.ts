import { Component, Input, Output, EventEmitter } from '@angular/core';

class Item {
	done: boolean;
	 
	constructor(public purchase: string, public price: number) {
  
		this.purchase = purchase;
		this.price = price;
		this.done = false;
	}
}
class SubmitObj {
	constructor(
		public services: Item[],
		public firstName: string,
		public lastName: string,
		public debtPlus: number,
		public money: number
	){}
}

@Component({
	selector: 'app-second-component',
	templateUrl: './second-component.component.html',
	styleUrls: ['./second-component.component.css']
})
export class SecondComponentComponent implements OnInit {

	constructor() { }

	// Имя в инпуты по умолчанию (Для примера)
	firstName:string = 'Василий';
	lastName:string = 'Пупыкин';

	// Список усуг
	services: Item[] = 
	[
		{ purchase: "Услуга 1", done: false, price: 99.9 },
		{ purchase: "Услуга 2", done: false, price: 60 },
		{ purchase: "Услуга 3", done: false, price: 40.65 },
		{ purchase: "Услуга 4", done: false, price: 500 }
	];

	totalCount = 0; // Количество выбранных услуг

	// Сумма выбранных услуг (из значения по умолчанию, для примера)
	total: string = this.services.reduce (function (accumulator:number, currentValue:Item) :number {
			if (currentValue.done) {
				this.totalCount++;
				return currentValue.price + accumulator;
			}
			else {
				return accumulator;
			}

		}, 0).toFixed (2);

	money: number;

	// Обработчик изминения чекбоксов
	// Подсчет количества и общей стоимости услуг
	change(event, item) {
		if (event.target.type != 'checkbox') {
			return;
		};

		let total:number = +this.total;

		if (!item.done) {
			total += item.price;
			this.totalCount++;
		}
		else {
			total -= item.price;
			this.totalCount--;
		}

		this.total = total.toFixed (2);
	}

	// Отправка объекта пользователя с выбранными услугами и их стоимостью
	// в родительский компонент для обработки
	@Output() onSubmit = new EventEmitter();
	addClientPay() {
		
		let submitObject: SubmitObj = {
			services: this.services,
			firstName: this.firstName,
			lastName: this.lastName,
			debtPlus: +this.total,
			money: +this.money
		};
		this.onSubmit.emit(submitObject);
	};
}
