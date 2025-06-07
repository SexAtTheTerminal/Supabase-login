import { signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarCasherComponent } from "../../../sidebar/features/sidebar-casher/sidebar-casher.component";


@Component({
  selector: 'app-registrar-cobro',
  imports: [SidebarCasherComponent, CommonModule, RouterLink],
  templateUrl: './registrar-cobro.component.html',
  styleUrl: './registrar-cobro.component.scss'
})
export class RegistrarCobroComponent {

  sidebarCollapsed = false;

  onSidebarToggle(state: boolean): void{
    this.sidebarCollapsed = state;
  }



}
