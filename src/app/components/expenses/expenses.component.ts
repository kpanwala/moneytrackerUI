import { Component, OnInit } from '@angular/core';
import { start } from '@popperjs/core';
import { Chart } from 'chart.js';
import { Timestamp } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  categoryBasedExpense: any = {};
  expensesCards: any = {};
  cardMapping: any = {};
  cardBasedExpense: any = {};
  colors = [
    'rgb(255, 99, 132, 0.3)',
    'rgb(75, 192, 192, 0.3)',
    'rgb(255, 205, 86, 0.3)',
    'rgb(201, 203, 207, 0.3)',
    'rgb(235, 57, 45, 0.3)',
    'rgb(55, 230, 75, 0.3)',
    'rgb(184, 255, 112, 0.3)',
  ];
  backgroundBorderColor = [
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
  monthWiseTrans: any;
  transactions: Array<any> = [];
  cardDropdown: Array<any> = [];
  cardDropdownForm: FormGroup = new FormGroup({
    selectedCard: new FormControl(),
  });
  verticalData: any;
  verticalOptions: any;
  transactionsByMonths: Array<number> = [];

  constructor(private dataService: AppService) {
    this.subscription = this.dataService.getData().subscribe((x) => {
      this.userDetails = JSON.parse(x);
      this.name = this.userDetails.name;
      this.cards = this.userDetails.cards;
      this.cards.forEach((card) => {
        this.cardMapping[card.cardId] = card.cardName;
        this.cardDropdown.push({
          name: card.cardName,
          id: card.cardId,
        });
      });
    });
  }

  ngOnInit() {
    this.cardDropdownForm?.get('selectedCard')?.valueChanges.subscribe((x) => {
      if (x != null) {
        this.getStackedBarChart(this.cardBasedExpense, x.id);
      } else {
        this.getStackedBarChart(this.cardBasedExpense);
      }
    });
    // this.getUserTransations(1);
    // this.getUserTransationsYearWise(1, 2023);
    this.getUserTransactionsMonthWise(1, 2023);
  }

  getUserTransactionsMonthWise(id: number, startYear: number) {
    this.dataService.getUserTransactionsMonthWise(id, startYear).subscribe(
      (data) => {
        console.log(data);
        this.monthWiseTrans = data;

        // Get all transactions
        this.getTransactions(data);
        console.log(this.transactions);

        //Get Category based Transactions Summary
        this.getCategoryBasedTransactionSummary();
        console.log(this.categoryBasedExpense);

        //Get Card based Transactions Summary
        this.getCardBasedTransactionSummary();
        console.log(this.cardBasedExpense);
      },
      (error: Error) => {
        console.log(error);
      },
      () => {
        // this.getPolarChart(this.categoryBasedExpense);
        this.getVerticalChart();
        this.getStackedBarChart(this.cardBasedExpense);
        console.log(this.cardBasedExpense);
      }
    );
  }

  getCardBasedTransactionSummary() {
    this.cards.forEach((c) => {
      this.addPropertyToObj(this.cardBasedExpense, c.cardId, {});

      Object.keys(this.categoryBasedExpense).forEach((cat) => {
        this.addValueToPropertyObj(this.cardBasedExpense[c.cardId], cat, 0);
      });
    });

    //Process for expenses card
    this.transactions.forEach((e: any) => {
      console.log(e);
      this.addPropertyToObj(
        this.cardBasedExpense[e.cardIdUsed],
        e.category,
        e.transactionAmount
      );
      console.log(this.cardBasedExpense);
    });
  }

  getTransactions(data: any) {
    data.transactionsByYears.forEach(
      (e: { year: string | number; transactionsByMonths: Array<any> }) => {
        console.log(e.transactionsByMonths);
        this.transactionsByMonths = new Array(12).fill(0);

        e.transactionsByMonths.forEach((t) => {
          this.transactionsByMonths[parseInt(t.month)] = t.transactions.reduce(
            (accumulator: number, obj: any) => {
              return accumulator + obj.transactionAmount;
            },
            0
          );

          t.transactions.forEach((tran: any) => {
            this.transactions.push(tran);
          });
        });
        console.log(this.transactionsByMonths);
      }
    );

    this.transactions.sort((a: any, b: any) => {
      return a.cardIdUsed - b.cardIdUsed;
    });
  }

  getCategoryBasedTransactionSummary() {
    this.transactions.forEach(
      (e: { category: string | number; transactionAmount: any }) => {
        this.categoryBasedExpense[e.category] =
          e.transactionAmount +
          (this.categoryBasedExpense[e.category] == null
            ? 0
            : this.categoryBasedExpense[e.category]);
      }
    );
  }

  addPropertyToObj(obj: any, property: string, val: object | number) {
    //console.log(obj);
    if (!obj.hasOwnProperty(property)) {
      obj[property] = val;
    }

    obj = obj[property];
  }

  addValueToPropertyObj(obj: any, property: string, val: object | number) {
    obj[property] = val;
    obj = obj[property];
  }

  getVerticalChart() {
    this.verticalData = {
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'Sept',
        'Oct',
        'Nov',
        'Dec',
      ],
      datasets: [
        {
          label: 'Expenses',
          backgroundColor: this.colors[Math.random() * 6],
          data: this.transactionsByMonths,
        },
      ],
    };

    this.verticalOptions = {};
  }

  getPolarChart(categoryBasedExpense: any) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.dataPolar = {
      labels: Object.keys(categoryBasedExpense), // ['Lifestyle', 'Food', 'Entertainment', 'Others', 'Travel', 'Utility']
      datasets: [
        {
          label: 'Expenses Categorywise',
          data: Object.values(categoryBasedExpense),
          backgroundColor: this.colors.slice(
            Object.keys(categoryBasedExpense).length
          ),
          borderColor: this.backgroundBorderColor.slice(
            Object.keys(categoryBasedExpense).length
          ),
          borderWidth: 1,
        },
      ],
    };

    this.optionsPolar = {};
  }

  getStackedBarChart(expensesCards: any, idx = -1) {
    let data, label;

    if (idx == -1) {
      data = this.categoryBasedExpense;
      label = 'Categorywise expenses';
    } else {
      data = expensesCards[idx];
      console.log(expensesCards, idx);
      label = 'Card based Categorywise expenses';
    }

    this.dataStacked = {
      labels: Object.keys(data), // ['Lifestyle', 'Food', 'Entertainment', 'Others', 'Travel', 'Utility']
      datasets: [
        {
          label: label,
          data: Object.values(data),
          backgroundColor: this.colors.slice(0, Object.keys(data).length),
          borderColor: this.backgroundBorderColor.slice(
            0,
            Object.keys(data).length
          ),
          borderWidth: 1,
        },
      ],
    };

    this.optionsStacked = {
      plugins: {
        title: {
          display: false,
          text: '',
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

  // getUserTransations(id: number) {
  //   this.dataService.getUserTransactions(id).subscribe(
  //     (data) => {
  //       console.log(data);

  //       //Process for Total expense
  //       data.forEach(
  //         (e: { category: string | number; transactionAmount: any }) => {
  //           this.categoryBasedExpense[e.category] =
  //             e.transactionAmount +
  //             (this.categoryBasedExpense[e.category] == null
  //               ? 0
  //               : this.categoryBasedExpense[e.category]);
  //         }
  //       );

  //       this.cards.forEach((c) => {
  //         Object.keys(this.categoryBasedExpense).forEach((cat) => {
  //           this.cardBasedExpense[this.cardMapping[c.cardIdUsed]] = {
  //             cat: 0,
  //           };
  //         });
  //       });
  //       console.log(this.cardBasedExpense);

  //       //Process for expenses card
  //       data.forEach(
  //         (e: {
  //           cardIdUsed: string;
  //           category: string;
  //           transactionAmount: number;
  //         }) => {
  //           this.cardBasedExpense[this.cardMapping[e.cardIdUsed]][
  //             data.cateogry
  //           ] += e.transactionAmount;

  //           console.log(this.cardBasedExpense);
  //         }
  //       );
  //     },
  //     (error: Error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       this.getPolarChart(this.categoryBasedExpense);
  //       this.getStackedBarChart(this.cardBasedExpense);
  //     }
  //   );
  // }

  // getUserTransationsYearWise(id: number, startYear: number) {
  //   this.dataService.getUserTransactionsYearWise(id, startYear).subscribe(
  //     (data) => {
  //       console.log(data);

  //       //Process for Total expense
  //       data.forEach(
  //         (e: { category: string | number; transactionAmount: any }) => {
  //           this.categoryBasedExpense[e.category] =
  //             e.transactionAmount +
  //             (this.categoryBasedExpense[e.category] == null
  //               ? 0
  //               : this.categoryBasedExpense[e.category]);
  //         }
  //       );

  //       this.cards.forEach((c) => {
  //         Object.keys(this.categoryBasedExpense).forEach((cat) => {
  //           this.cardBasedExpense[this.cardMapping[c.cardIdUsed]] = {
  //             cat: 0,
  //           };
  //         });
  //       });
  //       console.log(this.cardBasedExpense);

  //       //Process for expenses card
  //       data.forEach(
  //         (e: {
  //           cardIdUsed: string;
  //           category: string;
  //           transactionAmount: number;
  //         }) => {
  //           this.cardBasedExpense[this.cardMapping[e.cardIdUsed]][
  //             data.cateogry
  //           ] += e.transactionAmount;

  //           console.log(this.cardBasedExpense);
  //         }
  //       );
  //     },
  //     (error: Error) => {
  //       console.log(error);
  //     },
  //     () => {
  //       this.getPolarChart(this.categoryBasedExpense);
  //       this.getStackedBarChart(this.cardBasedExpense);
  //     }
  //   );
  // }
}
