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

  timeDropdown: any[] = [
    { name: 'Current Month', id: 0 },
    { name: 'Current Quarter', id: 1 },
    { name: 'Current Year', id: 2 },
    { name: 'Previous year', id: 3 },
  ];
  subscription: any;
  userDetails: any;
  name: any;
  monthWiseTrans: any;
  transactions: Array<any> = [];
  cardDropdown: Array<any> = [];
  cardDropdownForm: FormGroup = new FormGroup({
    selectedCard: new FormControl(),
    selectedTime: new FormControl(),
  });
  verticalData: any;
  verticalOptions: any;
  transactionsByMonths: Array<number> = [];
  categoryTransSelectedTime: number = 2;
  categoryTransSelectedCard: number = -1;
  usrId: number = 1;

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
    this.categoryTransSelectedTime = 2;
  }

  ngOnInit() {
    // this.cardDropdownForm?.get('selectedCard')?.valueChanges.subscribe((x) => {
    //   if (x != null) {
    //     this.categoryTransSelectedCard = x.id;
    //   }

    //   this.getStackedBarChart(
    //     this.cardBasedExpense,
    //     this.categoryTransSelectedTime,
    //     this.categoryTransSelectedCard
    //   );
    // });

    // this.getUserTransations(1);
    // this.getUserTransationsYearWise(1, 2023);
    this.getUserTransactionsMonthWise(this.usrId, new Date().getFullYear());

    this.cardDropdownForm?.get('selectedTime')?.valueChanges.subscribe((x) => {
      if (x != null) {
        this.categoryTransSelectedTime = x.id;
        console.log(x);
      } else {
        this.categoryTransSelectedTime = 2;
        console.log(x);
      }

      this.getStackedBarChart(
        this.monthWiseTrans.transactionsByYears[0].transactionsByMonths,
        this.categoryTransSelectedTime,
        this.categoryTransSelectedCard
      );
    });
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
        this.categoryBasedExpense = this.getCategoryBasedTransactionSummary(
          this.transactions
        );
        //console.log(this.categoryBasedExpense);

        //Get Card based Transactions Summary
        this.cardBasedExpense = this.getCardBasedTransactionSummary(
          this.cards,
          this.categoryBasedExpense,
          this.cardBasedExpense,
          this.transactions
        );
        //console.log(this.cardBasedExpense);
      },
      (error: Error) => {
        console.log(error);
      },
      () => {
        // this.getPolarChart(this.categoryBasedExpense);
        this.getVerticalChart();
        this.getStackedBarChart(
          this.monthWiseTrans.transactionsByYears[0].transactionsByMonths,
          this.categoryTransSelectedTime,
          this.categoryTransSelectedCard
        );
        //console.log(this.cardBasedExpense);
      }
    );
  }

  getCardBasedTransactionSummary(
    cards: any,
    categoryBasedExpense: any,
    cardBasedExpense: any,
    transactions: any
  ) {
    cards.forEach((c: any) => {
      this.addPropertyToObj(cardBasedExpense, c.cardId, {});

      Object.keys(categoryBasedExpense).forEach((cat) => {
        this.addValueToPropertyObj(cardBasedExpense[c.cardId], cat, 0);
      });
    });

    //Process for expenses card
    transactions.forEach((e: any) => {
      this.addPropertyToObj(
        cardBasedExpense[e.cardIdUsed],
        e.category,
        e.transactionAmount
      );
    });

    //console.log(cardBasedExpense);
    return cardBasedExpense;
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
        //console.log(this.transactionsByMonths);
      }
    );

    this.transactions.sort((a: any, b: any) => {
      return a.cardIdUsed - b.cardIdUsed;
    });
  }

  getCategoryBasedTransactionSummary(data: any): any {
    //console.log(data);
    let categoryBasedExpense: { [x: string]: number } = {
      Lifestyle: 0,
      Food: 0,
      Entertainment: 0,
      Others: 0,
      Travel: 0,
      Utility: 0,
    };

    data.forEach((e: { category: string | number; transactionAmount: any }) => {
      categoryBasedExpense[e.category] =
        e.transactionAmount +
        (categoryBasedExpense[e.category] == null
          ? 0
          : categoryBasedExpense[e.category]);
    });

    //console.log(categoryBasedExpense);
    return categoryBasedExpense;
  }

  addPropertyToObj(obj: any, property: string, val: object | number) {
    if (obj != null) {
      obj[property] = val;
    } else {
      obj = {
        property: val,
      };
    }
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

  getStackedBarChart(
    expensesCards: any,
    selectedTime: number,
    selectedCard: number
  ) {
    console.log(expensesCards);
    let data: Array<any> = [];
    let label;
    let labelAndData: any[] = [];

    if (selectedTime >= 0 && selectedTime < 2) {
      //has current year data
      data = this.getDataBasedOnTimeFrame(expensesCards, selectedTime);
    } else if (selectedTime == 2) {
      data = this.transactions;
    } else {
      // this.dataService
      //   .getUserTransactionsYearRange(
      //     this.usrId,
      //     new Date().getFullYear() - 1,
      //     new Date().getFullYear()
      //   )
      //   .subscribe(
      //     (resp) => {
      //       console.log(resp);
      //       resp.transactionsByYear.forEach((ele: any) => {
      //         if (parseInt(ele.year) == new Date().getFullYear() - 1) {
      //           data = [...ele.transactions];
      //         }
      //       });
      //     },
      //     (error) => {
      //       console.log(error);
      //     },
      //     () => {
      //       let resp = this.getData(data);
      //       data = resp[1];
      //       label = data[0];
      //       console.log(data);
      //     }
      //   );
    }
    //console.log(data);
    labelAndData = this.getData(data);
    console.log(labelAndData);

    let dataStacked: any[] = [];
    labelAndData.forEach((card, idx) => {
      dataStacked.push({
        label: card[0],
        data: Object.values(card[1]),
        backgroundColor: this.colors[idx],
        borderColor: this.backgroundBorderColor[idx],
        borderWidth: 1,
      });
    });

    console.log(labelAndData);
    this.dataStacked = {
      labels: Object.keys(labelAndData[0][1]), // ['Lifestyle', 'Food', 'Entertainment', 'Others', 'Travel', 'Utility']
      datasets: dataStacked,
    };

    this.optionsStacked = {
      plugins: {
        title: {
          display: false,
          text: label,
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
  getDataBasedOnTimeFrame(data: any, selectedTime: number): any {
    let curMonth = new Date().getMonth() + 1;
    let updatedData: any[] = [];
    //console.log(data);

    data.forEach((ele: any) => {
      if (selectedTime == 0) {
        if (parseInt(ele.month) == curMonth) {
          updatedData = [...ele.transactions];
        }
      } else if (selectedTime == 1) {
        if (
          Math.floor((parseInt(ele.month) - 1) / 3) ==
          Math.floor((curMonth - 1) / 3)
        ) {
          updatedData.push(...ele.transactions);
        }
      }
    });

    return updatedData;
  }

  getData(data: any): any[] {
    let label: string = '';
    let updatedData: any[] = [];

    this.cards.forEach((card) => {
      label = this.cardMapping[card.cardId] + ' expenses';
      //console.log(data, card.cardId);
      let moddata = data.filter((ele: any) => ele.cardIdUsed == card.cardId);
      //console.log(data);
      moddata = this.getCategoryBasedTransactionSummary(data);
      updatedData.push([label, moddata]);
    });

    return updatedData;
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
