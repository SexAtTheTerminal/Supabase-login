import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SidebarAdminComponent } from '../../../sidebar/features/sidebar-admin/sidebar-admin.component';
import { UsersServiceService } from '../../../services/data-access/users-service/users-service.service';
import { TablaUsuariosComponent } from '../../../shared/modals/tabla-usuarios/tabla-usuarios.component';
import { FiltrosUsuariosComponent } from '../../../shared/modals/filtros-usuarios/filtros-usuarios.component';
import { UserRegistrationComponent } from '../../../shared/modals/user-registration/user-registration.component';
import { AuthService } from '../../../auth/data-access/auth.service';

@Component({
  selector: 'app-record',
  imports: [
    SidebarAdminComponent,
    CommonModule,
    RouterLink,
    TablaUsuariosComponent,
    FiltrosUsuariosComponent,
    UserRegistrationComponent,
  ],
  templateUrl: './record.component.html',
  styleUrl: './record.component.scss',
})
export class RecordComponent {
  sidebarCollapsed = false;

  // Filtros
  busquedaCodigo = '';
  busquedaNombre = '';
  filtroCargo = '';

  // Datos
  usuarios: any[] = [];
  usuariosFiltrados: any[] = [];

  // UI
  mensajeExito = '';
  modalAbierto = false;
  usuarioParaEditar: any = null;

  private readonly _authService = inject(AuthService);

  constructor(
    private readonly usersService: UsersServiceService,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    this._authService.verifyRoleOrSignOut().then((isValid) => {
      if (!isValid) {
        this.router.navigate(['/auth/log-in']);
      }
    });
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = await this.usersService.obtenerUsuariosDesdeDB();
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let resultados = [...this.usuarios];

    if (this.busquedaCodigo) {
      if (this.filtroCargo === 'DNI') {
        resultados = resultados.filter((u) =>
          u.DNI.toLowerCase().includes(this.busquedaCodigo.toLowerCase())
        );
      } else if (this.filtroCargo === 'Nombre y Apellidos') {
        resultados = resultados.filter((u) =>
          u['Nombre y Apellido']
            .toLowerCase()
            .includes(this.busquedaCodigo.toLowerCase())
        );
      } else if (this.filtroCargo === 'Correo Electrónico') {
        resultados = resultados.filter((u) =>
          u['Correo Electrónico']
            .toLowerCase()
            .includes(this.busquedaCodigo.toLowerCase())
        );
      }
    }

    this.usuariosFiltrados = resultados;
  }

  editarUsuario(usuario: any): void {
    this.usuarioParaEditar = usuario;
    this.modalAbierto = true;
  }

  async eliminarUsuario(usuario: any): Promise<void> {
    const confirmado = confirm(
      `¿Estás seguro de eliminar al usuario ${usuario['Nombre y Apellido']}?`
    );
    if (!confirmado) return;

    try {
      console.log('Datos para eliminar:', {
        idUsuario: usuario.idUsuario,
        idEmpleado: usuario.idEmpleado,
        idAuth: usuario.idAuth,
      });

      const { success, error } =
        await this.usersService.eliminarUsuarioCompleto(
          usuario.idUsuario,
          usuario.idEmpleado,
          usuario.idAuth
        );

      if (success) {
        this.mostrarMensajeExito('Usuario eliminado correctamente');
        await this.cargarUsuarios();
      } else {
        alert(`Error al eliminar usuario: ${error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error completo al eliminar:', error);
      alert(
        `Error técnico al eliminar: ${
          error instanceof Error ? error.message : 'Error desconocido'
        }`
      );
    }
  }

  crearUsuario(): void {
    this.usuarioParaEditar = null;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.usuarioParaEditar = null;
  }

  async onUsuarioGuardado() {
    await this.cargarUsuarios();
    this.mostrarMensajeExito(
      this.usuarioParaEditar
        ? 'Usuario actualizado exitosamente'
        : 'Usuario creado exitosamente'
    );
    this.modalAbierto = false;
    this.usuarioParaEditar = null;
  }

  mostrarMensajeExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    setTimeout(() => (this.mensajeExito = ''), 3000);
  }

  async reiniciarFiltros() {
    this.busquedaCodigo = '';
    this.busquedaNombre = '';
    this.filtroCargo = '';
    await this.cargarUsuarios();
  }

  onSidebarToggle(state: boolean): void {
    this.sidebarCollapsed = state;
  }
}