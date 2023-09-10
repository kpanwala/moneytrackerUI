import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-card-tracking',
  templateUrl: './card-tracking.component.html',
  styleUrls: ['./card-tracking.component.css'],
})
export class CardTrackingComponent {
  title = 'mdf';
  userDetails: any = {};
  cardType = ['Credit', 'Debit', 'Forex'];

  contactForm = new FormGroup({
    cardName: new FormControl(),
    cardType: new FormControl(),
  });

  ngOnInIt() {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('userDetails') || '{}'
    );
    console.log(this.userDetails);
  }

  onSubmit() {
    console.log(this.contactForm.value);
  }
}
