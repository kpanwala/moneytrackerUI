import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "src/app/services/app.service";

@Component({
  selector: "my-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  @Input() isExpanded: boolean = false;
  @Output() toggleSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  userDetails: any = {};
  name: string = "";
  cards = {};
  subscription: Subscription;

  constructor(private appService: AppService) {
    // subscribe to app component messages
    this.subscription = this.appService.getData().subscribe(x => {
      this.userDetails = JSON.parse(x || '{}');
      this.name = this.userDetails.name;
      this.cards = this.userDetails.cards;
    });
  }
  ngOnInit(): void {

  }

  handleSidebarToggle = () => this.toggleSidebar.emit(!this.isExpanded);

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
}
