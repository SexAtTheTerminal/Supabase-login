import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersServiceService } from '../../../services/data-access/users-service/users-service.service';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-registration.component.html',
  styleUrl: './user-registration.component.scss'
})
export class UserRegistrationComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() usuarioGuardado = new EventEmitter<any>();
  @Input() usuarioParaEditar: any = null;

  // Datos del formulario
  usuarioData: any = {
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    telefono: '',
    fechaNacimiento: '',
    email: '',
    password: '',
    confirmPassword: '',
    idCargo: null,
    idRol: null
  };

  roles: any[] = [];
  cargos: any[] = [];
  isEditing = false;
  titulo = 'Registro de Usuario';
  loading = false;
  errorMessage = '';

  constructor(private usersService: UsersServiceService) {}

  // Asegúrate de cargar correctamente los roles
async ngOnInit() {
  this.roles = await this.usersService.obtenerRoles();
  this.cargos = await this.usersService.obtenerCargos();

  if (this.usuarioParaEditar) {
    this.isEditing = true;
    this.titulo = 'Modificar Usuario';
    this.cargarDatosParaEdicion();
  }
}

cargarDatosParaEdicion() {
  const nombreCompleto = this.usuarioParaEditar['Nombre y Apellido'].split(' ');
  
  this.usuarioData = {
    idUsuario: this.usuarioParaEditar.idUsuario,
    idEmpleado: this.usuarioParaEditar.idEmpleado,
    idAuth: this.usuarioParaEditar.idAuth,
    nombre: nombreCompleto[0],
    apellidoPaterno: nombreCompleto[1],
    apellidoMaterno: nombreCompleto[2] || '',
    dni: this.usuarioParaEditar.DNI,
    telefono: this.usuarioParaEditar.telefono,
    fechaNacimiento: this.usuarioParaEditar.fechaNacimiento,
    email: this.usuarioParaEditar['Correo Electrónico'],
    oldEmail: this.usuarioParaEditar['Correo Electrónico'],
    idCargo: this.usuarioParaEditar.idCargo,
    idRol: this.usuarioParaEditar.idRol, // Asegúrate que esto se está cargando
    estado: this.usuarioParaEditar.estado
  };
}
  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    // Validaciones básicas
    if (!this.validarFormulario()) {
      this.loading = false;
      return;
    }

    try {
      let result;
      
      if (this.isEditing) {
        result = await this.usersService.actualizarUsuarioCompleto(this.usuarioData);
      } else {
        result = await this.usersService.crearUsuarioCompleto(this.usuarioData);
      }

      if (result.success) {
        this.usuarioGuardado.emit();
        this.closeModal();
      } else {
        this.errorMessage = result.error || 'Ocurrió un error al guardar el usuario';
      }
    } catch (error) {
      this.errorMessage = 'Error al procesar la solicitud';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  validarFormulario(): boolean {
    // Validar que todos los campos requeridos estén llenos
    if (!this.usuarioData.nombre || 
        !this.usuarioData.apellidoPaterno || 
        !this.usuarioData.dni || 
        !this.usuarioData.email || 
        !this.usuarioData.idCargo || 
        !this.usuarioData.idRol) {
      this.errorMessage = 'Todos los campos marcados como requeridos son obligatorios';
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.usuarioData.email)) {
      this.errorMessage = 'Por favor ingrese un email válido';
      return false;
    }

    // Validar contraseña solo en creación
    if (!this.isEditing && (!this.usuarioData.password || this.usuarioData.password !== this.usuarioData.confirmPassword)) {
      this.errorMessage = 'Las contraseñas no coinciden o están vacías';
      return false;
    }

    return true;
  }

  closeModal() {
    this.close.emit();
  }
}