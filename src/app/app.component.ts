import { Component, VERSION } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidebarExpanded = false;
  id: number = -1;
  userDetails: any;
  name: string = '';

  constructor(private dataService: AppService) {}

  ngOnInit() {
    this.id = this.getLoggedInUserId();
    this.getUserData();
  }

  getUserData() {
    this.dataService.getUserDetails('kalp', '12345').subscribe(
      ({ f_name: fname, l_name: lname, id: id, cards: cards }) => {
        this.userDetails = {
          name: fname + ' ' + lname,
          cards: JSON.parse(cards.replaceAll("'", '"')),
          id: id,
        };
        this.name = fname + ' ' + lname;
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.dataService.sendData(JSON.stringify(this.userDetails));
      }
    );
  }

  getLoggedInUserId() {
    return 1;
  }
}
