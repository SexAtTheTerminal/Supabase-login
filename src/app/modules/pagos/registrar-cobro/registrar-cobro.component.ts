import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarCasherComponent } from "../../../sidebar/features/sidebar-casher/sidebar-casher.component";
import { ApiPeruService } from '../../../shared/data-access/api-peru.service'; // Asegúrate de que esta ruta sea correcta
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-registrar-cobro',
  standalone: true,
  imports: [
    SidebarCasherComponent,
    CommonModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './registrar-cobro.component.html',
  styleUrl: './registrar-cobro.component.scss'
})
export class RegistrarCobroComponent {

  dni: string = '';
  clienteNombres: string = '';
  loading: boolean = false;
  error: string | null = null;

  sidebarCollapsed = false;

  constructor(private apiPeruService: ApiPeruService) { }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }

  buscarClientePorDni(): void {
    this.clienteNombres = '';
    this.error = null;

    if (!this.dni) {
      this.error = 'Por favor, ingrese un número de DNI correcto';
      return;
    }

    if (!/^\d{8}$/.test(this.dni)) {
      this.error = 'El DNI debe ser numérico y tener 8 dígitos';
      return;
    }

    this.loading = true;

    this.apiPeruService.buscarPorDni(this.dni).pipe(
      catchError(err => {
        this.loading = false;
        this.error = 'Error al buscar el DNI. Por favor, intente de nuevo';
        console.error('Error en la llamada a la API:', err);
        return throwError(() => new Error('Error al buscar DNI'));
      })
    ).subscribe(response => {
      this.loading = false;
      console.log(`Respuesta COMPLETA de la API: ${response}`); //

      // Aquí 'apiData' contendrá el objeto con 'nombres', 'apellido_paterno'.
      const apiData = response.data;

      console.log('Valor de apiData:', apiData);


      if (response && response.success && apiData && apiData.nombres && apiData.apellido_paterno) {
        this.clienteNombres = `${apiData.nombres} ${apiData.apellido_paterno} ${apiData.apellido_materno || ''}`;
        this.error = null;
        console.log('Cliente encontrado:', this.clienteNombres);
      } else {
        this.error = 'No se encontró información para el DNI proporcionado';
        this.clienteNombres = '';
      }
    });
  }
}
