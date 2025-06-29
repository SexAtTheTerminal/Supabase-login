import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../../shared/data-access/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ReceiptsService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  constructor() {
}

async obtenerPagosDesdeDB(): Promise<any[]> {
  const { data, error } = await this._supabaseClient
    .from('Pago')
    .select(
      `
      idPago,
      created_at,
      montoTotal,
      dniCliente,
      idPedido,
      Pedido (idMesa, idPedido),
      "MétodoPago" (nombreMetodo)
      `
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al obtener pagos:', error);
    return [];
  }

  console.log('Datos recibidos de Supabase:', data);

  return data.map((pago: any) => {
    console.log('Procesando pago:', pago);
    const mappedPago = {
      idPago: pago.idPago,
      codigo: `PA-${pago.idPago.toString().padStart(8, '0')}`,
      fecha: new Date(pago.created_at),
      metodoPago: pago.MétodoPago?.nombreMetodo || 'Desconocido',
      cliente: pago.dniCliente || 'Sin especificar',
      monto: pago.montoTotal,
      mesa: pago.Pedido?.idMesa?.toString().padStart(2, '0') || '00',
      pedidoCodigo: pago.Pedido ? `PD-${pago.Pedido.idPedido.toString().padStart(8, '0')}` : 'Sin pedido',
      idPedido: pago.idPedido,
      dniCliente: pago.dniCliente
    };
    console.log('Pago mapeado:', mappedPago);
    return mappedPago;
  });
}

  async eliminarPago(idPago: number): Promise<boolean> {
    const { error } = await this._supabaseClient
      .from('Pago')
      .delete()
      .eq('idPago', idPago);

    if (error) {
      console.error('Error al eliminar el pago:', error);
      return false;
    }

    return true;
  }

  async obtenerDetallePedido(idPedido: number): Promise<any[]> {
  const { data, error } = await this._supabaseClient
    .from('DetallePedido')
    .select(`
      idDetallePedido,
      cantidad,
      Producto:Producto(
        nombreProducto,
        descripcionProducto,
        precio
      )
    `)
    .eq('idPedido', idPedido);

  if (error) {
    console.error('Error al obtener el detalle del pedido:', error);
    return [];
  }

  return data.map((detalle: any) => ({
    idDetallePedido: detalle.idDetallePedido, 
    cantidad: detalle.cantidad,
    nombreProducto: detalle.Producto.nombreProducto,
    descripcionProducto: detalle.Producto.descripcionProducto,
    precioUnitario: detalle.Producto.precio
  }));
}
}