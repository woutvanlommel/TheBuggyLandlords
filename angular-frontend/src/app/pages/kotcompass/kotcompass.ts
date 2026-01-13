import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { Navigation } from '../../components/navigation/navigation';
import { Footer } from '../../components/footer/footer';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-kotcompass',
  imports: [Footer, Navigation, RouterModule, CommonModule],
  styleUrl: './kotcompass.css',
  template: `
    <app-navigation></app-navigation>
    <router-outlet></router-outlet>
    @if (showFooter) {
    <app-footer></app-footer>
    }
  `,
})
export class Kotcompass implements OnInit, OnDestroy {
  showFooter = true;
  private routerSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkFooterVisibility();
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkFooterVisibility();
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkFooterVisibility() {
    const url = this.router.url.split('?')[0];
    this.showFooter = url !== '/kotcompass/rooms';
  }
}
