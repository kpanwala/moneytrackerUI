import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'expense-track',
  templateUrl: './expense-tracking.component.html',
  styleUrls: ['./expense-tracking.component.css'],
})
export class ExpenseTrackingComponent implements OnInit {
  title = 'mdf';
  userDetails: any = {};
  categoryDropdown: string[] = [
    'Lifestyle',
    'Food',
    'Entertainment',
    'Others',
    'Travel',
    'Utility',
  ];
  maxDate: Date = new Date();

  contactForm = new FormGroup({
    placeOfTransaction: new FormControl(),
    amount: new FormControl(),
    cardIdUsed: new FormControl(),
    category: new FormControl(),
    dateOfTransaction: new FormControl<Date | null>(this.maxDate),
  });

  ngOnInit() {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('userDetails') || '{}'
    );
    console.log(this.userDetails);
  }

  getCards() {
    return this.userDetails.cards;
  }

  onSubmit() {
    console.log(this.contactForm.value);
  }
}
