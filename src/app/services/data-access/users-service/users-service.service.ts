import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';
import { AuthService } from '../../../auth/data-access/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersServiceService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _authService = inject(AuthService);

  constructor() { }

  async obtenerUsuariosDesdeDB(): Promise<any[]> {
  const { data, error } = await this._supabaseClient
    .from('Usuario')
    .select(`
      idUsuario,
      email,
      estado,
      fechaCreacion,
      idAuth,
      Rol: Rol(nombreRol),
      Empleado: Empleado(
        idEmpleado,
        nombreEmpleado,
        apellPaternEmpleado,
        apellMaternEmpleado,
        DNI,
        telefono,
        fechaNacimiento,
        Cargo: Cargo(nombreCargo, idCargo)
      )
    `)
    .order('idUsuario', { ascending: true });

  if (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }

  return data.map((usuario: any) => ({
    ID: usuario.idUsuario,
    "Nombre y Apellido": usuario.Empleado ? 
      `${usuario.Empleado.nombreEmpleado} ${usuario.Empleado.apellPaternEmpleado} ${usuario.Empleado.apellMaternEmpleado || ''}`.trim() : 
      'Sin empleado asociado',
    DNI: usuario.Empleado?.DNI || 'Sin DNI',
    "Correo Electrónico": usuario.email,
    Cargo: usuario.Empleado?.Cargo?.nombreCargo || 'Sin cargo',
    // Manteniendo campos adicionales por si son necesarios en otros lugares
    idUsuario: usuario.idUsuario,
    codigo: `US-${usuario.idUsuario.toString().padStart(4, '0')}`,
    estado: usuario.estado,
    fechaCreacion: new Date(usuario.fechaCreacion),
    rol: usuario.Rol?.nombreRol || 'Sin rol',
    idRol: usuario.idRol,
    idEmpleado: usuario.Empleado?.idEmpleado,
    telefono: usuario.Empleado?.telefono || 'Sin teléfono',
    fechaNacimiento: usuario.Empleado?.fechaNacimiento || null,
    idCargo: usuario.Empleado?.Cargo?.idCargo || null,
    idAuth: usuario.idAuth
  }));
}

  async crearUsuarioCompleto(usuarioData: any): Promise<{success: boolean, error?: string}> {
  try {
    // 1. Primero crear en Authentication (auth.users)
    const { data: authData, error: authError } = await this._supabaseClient.auth.signUp({
      email: usuarioData.email,
      password: usuarioData.password,
      options: {
        data: {
          name: `${usuarioData.nombre} ${usuarioData.apellidoPaterno}`,
          email: usuarioData.email
        }
      }
    });

    if (authError) {
      console.error('Error en auth.signUp:', authError);
      throw authError;
    }

    if (!authData.user) {
      throw new Error('No se pudo crear el usuario en Authentication');
    }

    const userId = authData.user.id;

    // 2. Crear empleado en la tabla Empleado
    const { data: empleadoData, error: empleadoError } = await this._supabaseClient
      .from('Empleado')
      .insert({
        nombreEmpleado: usuarioData.nombre,
        apellPaternEmpleado: usuarioData.apellidoPaterno,
        apellMaternEmpleado: usuarioData.apellidoMaterno,
        DNI: usuarioData.dni,
        telefono: usuarioData.telefono,
        fechaNacimiento: usuarioData.fechaNacimiento,
        idCargo: usuarioData.idCargo
      })
      .select('idEmpleado')
      .single();

    if (empleadoError) {
      // Si falla, eliminamos el usuario de auth para mantener consistencia
      await this._supabaseClient.auth.admin.deleteUser(userId);
      throw empleadoError;
    }

    // 3. Crear usuario en la tabla Usuario
    const { error: usuarioError } = await this._supabaseClient
      .from('Usuario')
      .insert({
        email: usuarioData.email,
        idRol: usuarioData.idRol,
        idEmpleado: empleadoData.idEmpleado,
        idAuth: userId,
        estado: true,
        fechaCreacion: new Date()
      });

    if (usuarioError) {
      // Si falla, eliminamos tanto el usuario de auth como el empleado
      await this._supabaseClient.auth.admin.deleteUser(userId);
      await this._supabaseClient
        .from('Empleado')
        .delete()
        .eq('idEmpleado', empleadoData.idEmpleado);
      throw usuarioError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error en crearUsuarioCompleto:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

  async actualizarUsuarioCompleto(usuarioData: any): Promise<{success: boolean, error?: string}> {
  try {
    // 1. Actualizar empleado primero
    const { error: empleadoError } = await this._supabaseClient
      .from('Empleado')
      .update({
        nombreEmpleado: usuarioData.nombre,
        apellPaternEmpleado: usuarioData.apellidoPaterno,
        apellMaternEmpleado: usuarioData.apellidoMaterno,
        DNI: usuarioData.dni,
        telefono: usuarioData.telefono,
        fechaNacimiento: usuarioData.fechaNacimiento,
        idCargo: usuarioData.idCargo
      })
      .eq('idEmpleado', usuarioData.idEmpleado);

    if (empleadoError) throw empleadoError;

    // 2. Actualizar usuario
    const { error: usuarioError } = await this._supabaseClient
      .from('Usuario')
      .update({
        email: usuarioData.email,
        idRol: usuarioData.idRol,
        estado: usuarioData.estado
      })
      .eq('idUsuario', usuarioData.idUsuario);

    if (usuarioError) throw usuarioError;

    // 3. Si el email cambió, actualizar en auth.users
    if (usuarioData.email !== usuarioData.oldEmail) {
      const { error: authError } = await this._supabaseClient.auth.admin.updateUserById(
        usuarioData.idAuth,
        { email: usuarioData.email }
      );
      if (authError) throw authError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error en actualizarUsuarioCompleto:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}

  async eliminarUsuarioCompleto(idUsuario: number, idEmpleado: number, idAuth: string): Promise<{success: boolean, error?: string}> {
  try {
    // Verificar que tenemos todos los IDs necesarios
    if (!idAuth || !idUsuario || !idEmpleado) {
      throw new Error('Faltan datos necesarios para la eliminación');
    }

    // 1. Primero eliminar el usuario de la tabla Usuario
    const { error: usuarioError } = await this._supabaseClient
      .from('Usuario')
      .delete()
      .eq('idUsuario', idUsuario);

    if (usuarioError) throw usuarioError;

    // 2. Eliminar empleado de la tabla Empleado
    const { error: empleadoError } = await this._supabaseClient
      .from('Empleado')
      .delete()
      .eq('idEmpleado', idEmpleado);

    if (empleadoError) throw empleadoError;

    // 3. Finalmente eliminar de auth.users (requiere permisos de administrador)
    const { error: authError } = await this._supabaseClient.auth.admin.deleteUser(idAuth);
    if (authError) throw authError;

    return { success: true };
  } catch (error) {
    console.error('Error detallado en eliminarUsuarioCompleto:', {
      error: error instanceof Error ? error.message : error,
      idUsuario,
      idEmpleado,
      idAuth
    });
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar usuario' 
    };
  }
}
  async obtenerRoles(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Rol')
      .select('*')
      .order('nombreRol', { ascending: true });

    if (error) {
      console.error('Error al obtener roles:', error);
      return [];
    }

    return data;
  }

  async obtenerCargos(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Cargo')
      .select('*')
      .order('nombreCargo', { ascending: true });

    if (error) {
      console.error('Error al obtener cargos:', error);
      return [];
    }

    return data;
  }

  async verificarEmailExistente(email: string, idUsuarioExcluir?: number): Promise<boolean> {
    let query = this._supabaseClient
      .from('Usuario')
      .select('idUsuario')
      .eq('email', email);

    if (idUsuarioExcluir) {
      query = query.neq('idUsuario', idUsuarioExcluir);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al verificar email:', error);
      return false;
    }

    return data.length > 0;
  }

  async verificarDniExistente(dni: string, idEmpleadoExcluir?: number): Promise<boolean> {
    let query = this._supabaseClient
      .from('Empleado')
      .select('idEmpleado')
      .eq('DNI', dni);

    if (idEmpleadoExcluir) {
      query = query.neq('idEmpleado', idEmpleadoExcluir);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al verificar DNI:', error);
      return false;
    }

    return data.length > 0;
  }
}