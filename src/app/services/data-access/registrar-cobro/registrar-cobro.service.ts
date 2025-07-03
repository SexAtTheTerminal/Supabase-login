import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class RegistrarCobroService {
  private readonly _supabaseClient = inject(SupabaseService).supabaseClient;

  //Obtiene solo las ocupadas, me dio weba cambiarle el nombre de la funcion xdd
  async obtenerMesas(): Promise<any[]> {
    const { data, error } = await this._supabaseClient
      .from('Pedido')
      .select('idMesa')
      .eq('estado', false)
      .order('idMesa', { ascending: true });

    if (error) {
      console.error('Error al obtener mesas:', error);
      return [];
    }

    // Tipar item para evitar el error de "implicitly has an any type"
    const mesasUnicas = Array.from(
      new Set(data!.map((item: any) => item.idMesa))
    ).map((idMesa) => ({ idMesa }));

    return mesasUnicas;
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
      .eq('estado', false);

    if (error) {
      console.error('Error al obtener pedidos:', error);
      return [];
    }

    console.log('Pedidos encontrados:', data);

    const pedidosAgrupados = data.map((pedido: any) =>
      pedido.DetallePedido.map((detalle: any) => ({
        nombre: detalle.Producto?.nombreProducto || 'Producto desconocido',
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

  async registrarPagoConPedidoCompleto(
    idPedido: number,
    idMetodoPago: number,
    montoTotal: number,
    dniCliente: string
  ): Promise<void> {
    // Registrar el pago
    const { error: pagoError } = await this._supabaseClient
      .from('Pago')
      .insert({
        idPedido: idPedido,
        idMetodoPago: idMetodoPago,
        montoTotal: montoTotal,
        dniCliente: dniCliente,
      });

    if (pagoError) {
      console.error('Error al registrar el pago:', pagoError);
      return;
    }

    const { error: pedidoError } = await this._supabaseClient
      .from('Pedido')
      .update({ estado: true })
      .eq('idPedido', idPedido)
      .select();

    if (pedidoError) {
      console.error('Error al actualizar el estado del pedido:', pedidoError);
      return;
    }

    console.log('Pago registrado y estado del pedido actualizado exitosamente');
  }
}
