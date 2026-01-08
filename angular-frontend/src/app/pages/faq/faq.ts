import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  template: `
  <nav>Placeholder</nav>
  <div class="max-w-3xl mx-auto p-6 bg-gray-50 rounded-xl shadow-sm">
  <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

    <div class="flex flex-col gap-4">

      <div class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg">
        <div class="flex justify-between items-center cursor-pointer">
          <h3 class="font-semibold text-gray-800">How do I generate a new App Key?</h3>
          <span class="flex-none text-gray-400">+</span>
        </div>
        <p class="mt-2 text-gray-600 text-sm">
          Run <code class="bg-gray-100 px-1 rounded">php artisan key:generate</code> in your terminal to fix the MissingAppKeyException.
        </p>
      </div>

      <div class="flex flex-col p-4 bg-white border border-gray-200 rounded-lg">
        <div class="flex justify-between items-center cursor-pointer">
          <h3 class="font-semibold text-gray-800">What happens in a daily standup?</h3>
          <span class="flex-none text-gray-400">+</span>
        </div>
        <p class="mt-2 text-gray-600 text-sm">
          The team meets for 15 minutes to discuss what they did yesterday, what they are doing today, and any blockers.
        </p>
      </div>
    </div>
  </div>
  `,
  styles: ``,
})
export class Faq {
  activeTab: string = 'faq';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
