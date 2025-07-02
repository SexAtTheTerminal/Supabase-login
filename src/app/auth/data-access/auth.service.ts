import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase.service';
import { SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  private readonly _rolKey = 'user-role';

  private readonly _roleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem(this._rolKey)
  );

  get currentRole(): string | null {
    return this._roleSubject.value;
  }

  set currentRole(newRole: string | null) {
    this._roleSubject.next(newRole);
    if (newRole) {
      localStorage.setItem(this._rolKey, newRole);
    } else {
      localStorage.removeItem(this._rolKey);
    }
  }

  role$ = this._roleSubject.asObservable();

  session() {
    return this._supabaseClient.auth.getSession();
  }

  async logIn(credentials: { email: string; password: string }) {
    const { data, error } = await this._supabaseClient.auth.signInWithPassword(
      credentials
    );

    if (error) throw error;

    const userId = data.user?.id;

    if (!userId) {
      throw new Error('No se encontró el ID del usuario.');
    }

    // Consultamos la tabla UsersTest para obtener el rol
    const { data: rolData, error: rolError } = await this._supabaseClient
      .from('Usuario')
      .select('Rol(nombreRol)')
      .eq('idAuth', userId)
      .eq('estado', true)
      .single();

    if (rolError) throw rolError;

    const rol = rolData?.Rol?.nombreRol?.trim(); // Eliminamos '\n' si existiera

    if (!rol) throw new Error('No se encontró un rol asignado.');

    // Guardamos el rol en memoria y en localStorage
    this.currentRole = rol;

    return { session: data.session, rol };
  }

  async getUserProfile(userId: string) {
    const { data, error } = await this._supabaseClient
      .from('Usuario')
      .select(
        `
      email,
      Empleado: idEmpleado (
        nombreEmpleado,
        apellPaternEmpleado,
        apellMaternEmpleado,
        telefono
      ),
      Rol: idRol (nombreRol)
    `
      )
      .eq('idAuth', userId)
      .single();

    if (error) throw error;

    return {
      email: data.email,
      nombreEmpleado: data.Empleado?.nombreEmpleado,
      apellPaternEmpleado: data.Empleado?.apellPaternEmpleado,
      apellMaternEmpleado: data.Empleado?.apellMaternEmpleado,
      telefono: data.Empleado?.telefono,
      nombreRol: data.Rol?.nombreRol,
    };
  }
  signUp(credentials: SignUpWithPasswordCredentials) {
    return this._supabaseClient.auth.signUp(credentials);
  }

  async verifyRoleOrSignOut(): Promise<boolean> {
    try {
      const { data: sessionData, error: sessionError } =
        await this._supabaseClient.auth.getSession();

      if (sessionError || !sessionData.session?.user?.id) {
        throw new Error('No se encontró sesión activa.');
      }

      const userId = sessionData.session.user.id;

      const { data: rolData, error: rolError } = await this._supabaseClient
        .from('Usuario')
        .select('Rol(nombreRol)')
        .eq('idAuth', userId)
        .eq('estado', true)
        .single();

      if (rolError) throw rolError;

      const dbRole = rolData?.Rol?.nombreRol?.trim();
      const localRole = localStorage.getItem(this._rolKey);

      if (!dbRole || localRole !== dbRole) {
        throw new Error('Rol inválido o manipulado');
      }

      this.currentRole = dbRole; // sincroniza el valor real
      return true;
    } catch (error) {
      console.warn('Verificación fallida, cerrando sesión:', error);
      this.signOut();
      return false;
    }
  }

  signOut() {
    this.currentRole = null;
    return this._supabaseClient.auth.signOut();
  }
}
