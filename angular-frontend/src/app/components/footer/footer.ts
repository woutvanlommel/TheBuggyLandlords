import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
  <footer class="bg-base-twee">
    <div class="flex">
      <div>
        <!--logo+bijkomende info-->
      </div>
      <div id="navigationMidden" class="flex flex-col gap-2">
        <!--navigatie links-->
        <a routerLink="/dashboard" class="hover:underline">Dashboard</a>
        <a routerLink="/profile" class="hover:underline">Profile</a>
        <a routerLink="/credits" class="hover:underline">Credits</a>
        <a routerLink="/faq" class="hover:underline">FAQ</a>
      </div>
      <div>
        <button></button>
      </div>
    </div>  
  </footer>
  `,
  styles: `` ,
})
export class Footer {

}
