import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  sidebarOpen = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebarOnMobile(): void {
    // fecha o menu após clicar em um item (comportamento mobile)
    this.sidebarOpen = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    // em telas grandes, o sidebar fica sempre visível via CSS; mantemos o estado sem efeitos colaterais
  }
}
