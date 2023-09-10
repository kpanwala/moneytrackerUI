import { Component, VERSION } from '@angular/core';
import { AppService } from './services/app.service';
interface UserDetails {
  f_name: string;
  l_name: string;
  id: number;
}
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  sidebarExpanded = false;
  id: number = -1;
  name: string = '';
  userDetails: { name: string; cards: any; id: any } = {
    name: '',
    cards: undefined,
    id: -1,
  };

  constructor(private dataService: AppService) {}

  ngOnInit() {
    this.id = this.getLoggedInUserId();
    this.getUserData();
  }

  getUserData() {
    this.dataService.getUserDetails('kalp', '12345').subscribe(
      ({ userdetails: userdetails, card: card }) => {
        const { f_name, l_name, id } = userdetails;
        this.userDetails = {
          name: f_name + ' ' + l_name,
          cards: card,
          id: id,
        };
        this.name = f_name + ' ' + l_name;
        sessionStorage.setItem('userDetails', JSON.stringify(this.userDetails));
        console.log(this.userDetails);
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
