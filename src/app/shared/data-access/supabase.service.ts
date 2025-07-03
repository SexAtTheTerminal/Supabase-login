import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  supabaseClient: any;

  constructor() {
    this.supabaseClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }
  /* TODO -> Metodos agregados para poder guardar la informacion en supabase y confirmar si el
    cliente es frecuente al restaurante.
  */
  // Verificar si el cliente ya existe
  async verificarClienteExiste(dni: string) {
    try {
      const { data, error } = await this.supabaseClient
        .from('Cliente')
        .select('*')
        .eq('dniCliente', dni); // todo: Con ello visualizamos el cliente por su DNI en Supabase.

      if (error) {
        console.error('Error al verificar cliente:', error);
        throw error;
      }
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error en verificarCliente si existe:', error);
      return null;
    }
  }

  // TODO: Se guarda el cliente si no existe en la base de datos.
  async guardarCliente(clienteData: any) {
    try {
      const { data, error } = await this.supabaseClient
        .from('Cliente')
        .insert([{
          dniCliente: clienteData.dni,
          nombreCliente: clienteData.nombres,
          apellPaterno: clienteData.apellido_paterno,
          apellMaterno: clienteData.apellido_materno || '',
        }])
        .select();

      if (error) {
        console.error('Error al guardar cliente en Supabase:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error al guardar clientes:', error);
      throw error;
    }
  }

  // TODO: Se guarda el pago con relacion al cliente que se registro previamente.
  async registrarPago(pagoData: any) {
  try {
    console.log('Datos del pago a registrar:', pagoData);

    // ```Insert``` para la tabla de pagos
    const pagoParaInsertar = {
      idPedido: pagoData.pedido_id,
      idMetodoPago: pagoData.modalidad_id,
      montoTotal: pagoData.monto_total,
      dniCliente: pagoData.dni_cliente
    };

    const { data, error } = await this.supabaseClient
      .from('Pago')
      .insert([pagoParaInsertar])
      .select();

    if (error) {
      console.error('Error detallado al registrar pago:', error);
      throw new Error(`Error al registrar pago: ${error.message}`);
    }

    console.log('Pago registrado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error en registrarPago:', error);
    throw error;
  }
}
}
