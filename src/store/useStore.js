import { useState, useEffect } from 'react';
import { productosIniciales } from '../data/productos';
import comprasIniciales from '../data/compras.json';
import ventasIniciales from '../data/ventas.json';
import inventarioInicial from '../data/inventario.json';

const KEYS = {
  productos:    'abk_productos',
  compras:      'abk_compras',
  ventas:       'abk_ventas',
  inventario:   'abk_inventario',
  lastCompraId: 'abk_lastCompraId',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const DATA_VERSION = '2';

function seedIfEmpty() {
  // Re-seed products when data version bumps (categories/units changed)
  if (localStorage.getItem('abk_version') !== DATA_VERSION) {
    save(KEYS.productos, productosIniciales);
    localStorage.setItem('abk_version', DATA_VERSION);
  }
  if (!localStorage.getItem(KEYS.productos)) save(KEYS.productos, productosIniciales);
  if (!localStorage.getItem(KEYS.compras))   save(KEYS.compras,   comprasIniciales);
  if (!localStorage.getItem(KEYS.ventas))    save(KEYS.ventas,    ventasIniciales);
  if (!localStorage.getItem(KEYS.lastCompraId)) save(KEYS.lastCompraId, 12);
  if (!localStorage.getItem(KEYS.inventario)) {
    const inv = {};
    inventarioInicial.forEach(row => {
      inv[row['Producto']] = {
        totalComprado: row['Total Comprado'] ?? 0,
        costoPromedio: row['Costo Promedio'] ?? 0,
        stockActual:   row['Stock Actual']   ?? 0,
      };
    });
    save(KEYS.inventario, inv);
  }
}

seedIfEmpty();

// ── Inventory helpers (module-level so both registrar and editar can use them) ──

function actualizarInventarioDesdeCompras(nuevasCompras) {
  const inv = load(KEYS.inventario, {});
  nuevasCompras.forEach(c => {
    const key = c.Producto;
    if (!inv[key]) inv[key] = { totalComprado: 0, costoPromedio: 0, stockActual: 0 };
    const prev = inv[key];
    const totalCosto    = prev.totalComprado * prev.costoPromedio + c['Costo T'];
    const totalUnidades = prev.totalComprado + c.Cantidad;
    inv[key] = {
      totalComprado: totalUnidades,
      costoPromedio: totalUnidades > 0 ? totalCosto / totalUnidades : 0,
      stockActual:   prev.stockActual + c.Cantidad,
    };
  });
  save(KEYS.inventario, inv);
}

function revertirInventario(items) {
  const inv = load(KEYS.inventario, {});
  items.forEach(c => {
    const key = c.Producto;
    if (!inv[key]) return;
    const prev            = inv[key];
    const cantRevertida   = Math.max(0, prev.totalComprado - (c.Cantidad || 0));
    const costoRevertido  = prev.totalComprado * prev.costoPromedio - (c['Costo T'] || 0);
    inv[key] = {
      totalComprado: cantRevertida,
      costoPromedio: cantRevertida > 0 ? costoRevertido / cantRevertida : 0,
      stockActual:   Math.max(0, prev.stockActual - (c.Cantidad || 0)),
    };
  });
  save(KEYS.inventario, inv);
}

// ── Hooks ──

export function useProductos() {
  const [productos, setProductos] = useState(() => load(KEYS.productos, productosIniciales));

  const agregar = (p) => {
    const nuevo = [...productos, p];
    setProductos(nuevo);
    save(KEYS.productos, nuevo);
  };

  const agregarBatch = (nuevos) => {
    const actualizado = [...productos, ...nuevos];
    setProductos(actualizado);
    save(KEYS.productos, actualizado);
  };

  const actualizar = (id, datos) => {
    const nuevo = productos.map(p => p.id === id ? { ...p, ...datos } : p);
    setProductos(nuevo);
    save(KEYS.productos, nuevo);
  };

  const toggleActivo = (id) => {
    actualizar(id, { activo: !productos.find(p => p.id === id)?.activo });
  };

  return { productos, agregar, agregarBatch, actualizar, toggleActivo };
}

export function useCompras() {
  const [compras, setCompras] = useState(() => load(KEYS.compras, comprasIniciales));
  const [lastId,  setLastId]  = useState(() => load(KEYS.lastCompraId, 12));

  const registrar = (items, fecha) => {
    const nuevoId = lastId + 1;
    const idStr   = `C-${String(nuevoId).padStart(4, '0')}`;
    const nuevasCompras = items.map((item, i) => ({
      id:        Date.now() + i,
      Fecha:     fecha,
      ID:        idStr,
      Categoria: item.categoria,
      Producto:  item.producto,
      Unidad:    item.unidad,
      Cantidad:  item.cantidad,
      'Costo T': item.costoTotal,
      'Costo U': item.cantidad > 0 ? item.costoTotal / item.cantidad : 0,
    }));
    const nuevo = [...nuevasCompras, ...compras];
    setCompras(nuevo);
    save(KEYS.compras, nuevo);
    setLastId(nuevoId);
    save(KEYS.lastCompraId, nuevoId);
    actualizarInventarioDesdeCompras(nuevasCompras);
    return idStr;
  };

  const eliminar = (orderId) => {
    const orderItems = compras.filter(c => c.ID === orderId);
    revertirInventario(orderItems);
    const nuevo = compras.filter(c => c.ID !== orderId);
    setCompras(nuevo);
    save(KEYS.compras, nuevo);
  };

  const editar = (orderId, newItems, fecha) => {
    const oldItems = compras.filter(c => c.ID === orderId);
    revertirInventario(oldItems);
    const nuevasCompras = newItems.map((item, i) => ({
      id:        Date.now() + i,
      Fecha:     fecha,
      ID:        orderId,
      Categoria: item.categoria,
      Producto:  item.producto,
      Unidad:    item.unidad,
      Cantidad:  item.cantidad,
      'Costo T': item.costoTotal,
      'Costo U': item.cantidad > 0 ? item.costoTotal / item.cantidad : 0,
    }));
    const sinOld = compras.filter(c => c.ID !== orderId);
    const nuevo  = [...nuevasCompras, ...sinOld];
    setCompras(nuevo);
    save(KEYS.compras, nuevo);
    actualizarInventarioDesdeCompras(nuevasCompras);
  };

  return { compras, registrar, eliminar, editar };
}

export function useInventario() {
  const [inventario, setInventario] = useState(() => load(KEYS.inventario, {}));

  const refrescar = () => setInventario(load(KEYS.inventario, {}));

  const descontarStock = (producto, cantidad) => {
    const inv = load(KEYS.inventario, {});
    if (inv[producto]) {
      inv[producto].stockActual = Math.max(0, inv[producto].stockActual - cantidad);
      save(KEYS.inventario, inv);
      setInventario({ ...inv });
    }
  };

  return { inventario, refrescar, descontarStock };
}

export function useVentas() {
  const [ventas, setVentas] = useState(() => load(KEYS.ventas, ventasIniciales));

  const registrar = (venta) => {
    const nueva = { ...venta, id: Date.now() };
    const nuevo = [nueva, ...ventas];
    setVentas(nuevo);
    save(KEYS.ventas, nuevo);
  };

  const eliminar = (id) => {
    const nuevo = ventas.filter(v => v.id !== id);
    setVentas(nuevo);
    save(KEYS.ventas, nuevo);
  };

  return { ventas, registrar, eliminar };
}
