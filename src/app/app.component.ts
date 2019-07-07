import { Component, OnInit } from '@angular/core';

class Client { 
	constructor(
		public name: string,
		public services: Service[],
		public debt: number
		) {};
}

class Service {
	constructor(
		public purchase: string,
		public price: number,
		public count: number,
		public serviceDebt: number,
		public unredeemed: number
	) {};
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	clients; //Список клиентов

	ngOnInit() {
		// Запрос к локальному хранилищу в поисках предыдущей сессии
		if (localStorage.getItem ('clients')) {
			this.clients = JSON.parse (localStorage.getItem ('clients'));
			this.toArray(); // Преобразоваие в рабочий массив
		}
		else {
			// Список клиентов по умолчанию (для примера)
			this.clients = {
				'Василий Пупыкин' : { 
					name: 'Василий Пупыкин',
					services: {
						'Услуга 4': {
							purchase: 'Услуга 4',
							price: 500,
							count: 2,
							serviceDebt: 1000,
							unredeemed: 1000
						}
					},
					debt: 1000 
				}
			};
			this.toArray(); // Преобразоваие в рабочий массив
		}
	}

	tempClients: Client[]; // Обьявление рабочего массива

	// Обработчик события дочернего элемента SecondComponent
	onSubmit (obtainedObj) {

		// obtainedObj объект переданный из  дочернего компонента
		let name = obtainedObj.firstName + ' ' + obtainedObj.lastName;

		// Поиск клиента в списке клиентов 
		if (!this.clients[name]) {
			// Если нет, создать нового
			this.clients[name] = {};
			this.clients[name].name = name;
		}

		let client = this.clients[name];

		if (!client.services) {
			// Если у клиента нет перечня услуг, создать новый список
			client.services = {};
		}

		// Обход списка услуг и поиск оказанных услуг (параметр service.done)
		obtainedObj.services.forEach (service =>  {
			if (service.done) {
				// Если услуга не добавленна, добавить новую
				if (!client.services[service.purchase]) {
					client.services[service.purchase] = {
						purchase: service.purchase,
						price: service.price,
						count: 1,
						serviceDebt: service.price,
						unredeemed: service.price
					};
				}
				// Если услуга уже есть, увеличить счетчик количества и стоимость
				else {
					client.services[service.purchase].count++;
					client.services[service.purchase].serviceDebt += +service.price;
					client.services[service.purchase].unredeemed += +service.price;
				}
			}
		})

		// Если были внесены деньги или остался остаток от предыдущих платежей, 
		// пропорционально распределяем сумму платежа на погашение стоимости услуг
		if (obtainedObj.money || client.debt < 0) {

			let onePersent = client.debt / 100;

			for (let service in client.services) {
				let proportion = client.services[service].unredeemed / onePersent;
				let redemption = (obtainedObj.money / 100) * proportion;

				if (!redemption || client.services[service].unredeemed - redemption < 0 || client.debt <= 0) {
					client.services[service].unredeemed = 0;
				}
				else {
					client.services[service].unredeemed -= redemption;
				}
			}

			client.debt -= obtainedObj.money;

		}

		// Выставляем счет, если уже есть долг, то текущий счет пребавляется к уже имеющимуся
		if (!client.debt) {
			client.debt = obtainedObj.debtPlus;
		}
		else {
			client.debt += obtainedObj.debtPlus;
		}

		// Сохранение списка клиентов в локальное хранилище, для последующего восстановления 
		localStorage.setItem ('clients', JSON.stringify (this.clients));

		this.toArray (); // Преобразовать список в рабочий массив
	}

	// Метод для преобразования списка клиентов, в массив из клиентов,
	// у каждого клиента список услуг преобразовывается в массив услуг
	toArray () {

		let clients = {}; // Создание временного объекта
		this.tempClients = []; // Сброс предыдущего списка

		for (let client in this.clients) {

			let services = Object.assign ({}, this.clients[client].services); // Копирование списка услуг

			// Объявление массива для услуг и копирование в него услуг из списка
			let servicesArr = []; 
			for (let service in services) {
				servicesArr.push (services[service]);
			}

			clients[client] = Object.assign ({}, this.clients[client]); // Копирование объекта из списка клиентов
			
			clients[client].services = servicesArr; // Замена оригинальной ссылки на обьект списка на массив услуг

			this.tempClients.push (clients[client]); // Помещение временного объекта в рабочий массив
		}
	}
}
