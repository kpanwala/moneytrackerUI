import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Timestamp } from 'rxjs';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  cards: any[] = [];
  dataStacked: any;
  optionsStacked: any;
  dataPolar: any;
  optionsPolar: any;
  totalExpenses: any = {};
  expensesCards: any = {};
  cardMapping: any = {};
  cardBasedExpense: any = {};
  colors = [
    'rgb(255, 99, 132)',
    'rgb(75, 192, 192)',
    'rgb(255, 205, 86)',
    'rgb(201, 203, 207)',
    'rgb(235, 57, 45)',
    'rgb(55, 230, 75)',
    'rgb(184, 255, 112)',
  ];
  subscription: any;
  userDetails: any;
  name: any;

  constructor(private dataService: AppService) {
    this.subscription = this.dataService.getData().subscribe((x) => {
      this.userDetails = JSON.parse(x || '{}');
      this.name = this.userDetails.name;
      this.cards = this.userDetails.cards;
      this.cards.forEach((card) => {
        this.cardMapping[card.cardId] = card.cardName;
      });
      console.log(this.cards, this.cardMapping);
    });
  }

  ngOnInit() {
    this.getUserTransations();
  }

  getUserTransations() {
    this.dataService.getUserTransactions(1).subscribe(
      (data) => {
        console.log(data);

        //Process for Total expense
        data.forEach(
          (e: { category: string | number; transactionAmount: any }) => {
            this.totalExpenses[e.category] =
              e.transactionAmount +
              (this.totalExpenses[e.category] == null
                ? 0
                : this.totalExpenses[e.category]);
          }
        );

        this.cards.forEach((c) => {
          Object.keys(this.totalExpenses).forEach((cat) => {
            this.cardBasedExpense[this.cardMapping[c.cardIdUsed]] = {
              cat: 0,
            };
          });
        });
        console.log(this.cardBasedExpense);

        //Process for expenses card
        data.forEach(
          (e: {
            cardIdUsed: string;
            category: string;
            transactionAmount: number;
          }) => {
            // this.cardBasedExpense[this.cardMapping[e.cardIdUsed]] =
            //   e.transactionAmount +
            //   (this.cardBasedExpense[this.cardMapping[e.cardIdUsed]] == null
            //     ? 0
            //     : this.cardBasedExpense[this.cardMapping[e.cardIdUsed]]);

            this.cardBasedExpense[this.cardMapping[e.cardIdUsed]][
              data.cateogry
            ] += e.transactionAmount;

            console.log(this.cardBasedExpense);
          }
        );
      },
      (error: Error) => {
        console.log(error);
      },
      () => {
        this.getPolarChart(this.totalExpenses);
        this.getStackedBarChart(this.cardBasedExpense);
      }
    );
  }

  getPolarChart(totalExpenses: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataPolar = {
      labels: Object.keys(totalExpenses), // ['Lifestyle', 'Food', 'Entertainment', 'Others', 'Travel', 'Utility']
      datasets: [
        {
          label: 'Expenses Categorywise',
          data: Object.values(totalExpenses),
          backgroundColor: this.colors[5],
        },
      ],
    };

    this.optionsPolar = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        r: {
          grid: {
            color: surfaceBorder,
          },
        },
      },
    };
  }

  getStackedBarChart(expensesCards: any) {
    console.log(expensesCards);
    this.dataStacked = {
      labels: Object.keys(expensesCards), // ['Lifestyle', 'Food', 'Entertainment', 'Others', 'Travel', 'Utility']
      datasets: [
        {
          label: 'Card wise expenses Overview',
          data: Object.values(expensesCards),
          backgroundColor: this.colors.slice(
            0,
            Object.keys(expensesCards).length
          ),
        },
      ],
    };

    this.optionsStacked = {
      plugins: {
        title: {
          display: true,
          text: 'Expenses based on card',
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      maintainAspectRatio: false,
    };
  }
}
