import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrarCobroService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  //Obtiene solo las ocupadas, me dio weba cambiarle el nombre de la funcion xdd
  //Ya usa la tabla Mesa xd
  async obtenerMesas(): Promise<{ idMesa: number }[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select('idMesa, Mesa(estado)')
      .eq('estado', true); // solo pedidos activos

    if (error || !data) {
      console.error('Error al obtener mesas ocupadas:', error);
      return [];
    }

    const mesas = new Set<number>();

    for (const pedido of data) {
      if (pedido.Mesa?.estado === false) {
        mesas.add(pedido.idMesa);
      }
    }

    return Array.from(mesas).map((idMesa) => ({ idMesa }));
  }

  async obtenerPedidosdelaMesa(mesa: number): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select(
        `
        DetallePedido (
          idProducto,
          cantidad,
          Producto (
            nombreProducto,
            precio
          )
        )
      `
      )
      .eq('idMesa', mesa)
      .eq('estado', true);

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    }

    console.log('Pedidos encontrados:', data);

    const pedidosAgrupados = data.map((pedido: any) =>
      pedido.DetallePedido.map((detalle: any) => ({
        nombre: detalle.Producto?.nombreProducto ?? 'Producto desconocido',
        cantidad: detalle.cantidad,
        precio: detalle.Producto?.precio,
      }))
    );

    return pedidosAgrupados;
  }

  async obtenerIds(mesa: number): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select(
        `
        idPedido,
        idModalidad
      `
      )
      .eq('idMesa', mesa)
      .eq('estado', true);

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    }

    console.log('IDs encontrados:', data);

    return data.map((pedido: any) => ({
      idPedido: pedido.idPedido,
      idModalidad: pedido.idModalidad,
    }));
  }

  //Invierte el estado nomas pero siempre va a estar en false asi que real y epico
  async actualizarEstadoMesa(mesa: number): Promise<void> {
    const { data: pedidoActual, error: errorSelect } =
      await this._supabaseClient
        .from('Mesa')
        .select('estado')
        .eq('idMesa', mesa)
        .single();

    if (errorSelect) {
      console.error('Error al obtener el pedido:', errorSelect);
      return;
    }

    // Invertimos el estado actual
    const nuevoEstado = !pedidoActual.estado;

    // Actualizamos el estado
    const { data, error: errorUpdate } = await this._supabaseClient
      .from('Mesa')
      .update({ estado: nuevoEstado })
      .eq('idMesa', mesa)
      .select();

    if (errorUpdate) {
      console.error('Error al actualizar el estado:', errorUpdate);
      return;
    }

    console.log('Estado actualizado correctamente:', data);
  }

  //Metodos ultimo COMMIT BURROS
  // Verificar si el cliente ya existe
  async verificarClienteExiste(dni: string) {
    try {
      const { data, error } = await this._supabaseClient
        .from('Cliente')
        .select('*')
        .eq('dniCliente', dni);

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

  async guardarCliente(clienteData: any) {
    try {
      const { data, error } = await this._supabaseClient
        .from('Cliente')
        .insert([
          {
            dniCliente: clienteData.dni,
            nombreCliente: clienteData.nombres,
            apellPaterno: clienteData.apellido_paterno,
            apellMaterno: clienteData.apellido_materno ?? '',
          },
        ])
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

  async registrarPago(pagoData: any) {
    try {
      console.log('Datos del pago a registrar:', pagoData);

      // ```Insert``` para la tabla de pagos
      const pagoParaInsertar = {
        idPedido: pagoData.pedido_id,
        idMetodoPago: pagoData.modalidad_id,
        montoTotal: pagoData.monto_total,
        dniCliente: pagoData.dni_cliente,
      };

      const { data, error } = await this._supabaseClient
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
