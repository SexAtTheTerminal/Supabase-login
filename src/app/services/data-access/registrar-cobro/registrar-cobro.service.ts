import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrarCobroService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;

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

    return Array.from(mesas).map(idMesa => ({ idMesa }));
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
      .eq('estado', false); // !! False -> Pendiente !!

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
      .eq('estado', false);

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
  async actualizarEstadoMesa(mesa:number): Promise<void> {
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
}
