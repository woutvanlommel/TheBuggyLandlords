import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  template: `
  <p>faq works!</p>
  <section class="bg-primary backdrop-blur-md border border-base-twee-300/50 shadow-2xl rounded-3xl p-6 space-y-6 relative z-20">
  `,
  styles: ``,
})
export class Faq {
  activeTab: string = 'faq';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
