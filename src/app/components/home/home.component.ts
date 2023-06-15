import { Component, OnInit, Input } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

interface Card {
  cardId: string;
  cardName: string;
  cardType: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  basicData: any;
  id: number = -1;
  basicOptions: any;
  userDetails: any = {};
  userTrans: any = {};
  cards: string = '';

  constructor() {}

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('userDetails') || '{}'
    );
    this.cards = this.userDetails.cards;
  }
}
