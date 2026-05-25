import { useState, useEffect } from 'react';
import { productosIniciales } from '../data/productos';
import comprasIniciales from '../data/compras.json';
import ventasIniciales from '../data/ventas.json';
import inventarioInicial from '../data/inventario.json';

const KEYS = {
  productos: 'abk_productos',
  compras: 'abk_compras',
  ventas: 'abk_ventas',
  inventario: 'abk_inventario',
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

// Seed localStorage on first load
function seedIfEmpty() {
  if (!localStorage.getItem(KEYS.productos)) save(KEYS.productos, productosIniciales);
  if (!localStorage.getItem(KEYS.compras)) save(KEYS.compras, comprasIniciales);
  if (!localStorage.getItem(KEYS.ventas)) save(KEYS.ventas, ventasIniciales);
  if (!localStorage.getItem(KEYS.lastCompraId)) save(KEYS.lastCompraId, 12);
  if (!localStorage.getItem(KEYS.inventario)) {
    const inv = {};
    inventarioInicial.forEach(row => {
      inv[row['Producto']] = {
        totalComprado: row['Total Comprado'] ?? 0,
        costoPromedio: row['Costo Promedio'] ?? 0,
        stockActual: row['Stock Actual'] ?? 0,
      };
    });
    save(KEYS.inventario, inv);
  }
}

seedIfEmpty();

export function useProductos() {
  const [productos, setProductos] = useState(() => load(KEYS.productos, productosIniciales));

  const agregar = (p) => {
    const nuevo = [...productos, p];
    setProductos(nuevo);
    save(KEYS.productos, nuevo);
  };

  const actualizar = (id, datos) => {
    const nuevo = productos.map(p => p.id === id ? { ...p, ...datos } : p);
    setProductos(nuevo);
    save(KEYS.productos, nuevo);
  };

  const toggleActivo = (id) => {
    actualizar(id, { activo: !productos.find(p => p.id === id)?.activo });
  };

  return { productos, agregar, actualizar, toggleActivo };
}

export function useCompras() {
  const [compras, setCompras] = useState(() => load(KEYS.compras, comprasIniciales));
  const [lastId, setLastId] = useState(() => load(KEYS.lastCompraId, 12));

  const registrar = (items, fecha) => {
    const nuevoId = lastId + 1;
    const idStr = `C-${String(nuevoId).padStart(4, '0')}`;
    const nuevasCompras = items.map((item, i) => ({
      id: Date.now() + i,
      Fecha: fecha,
      ID: idStr,
      Categoria: item.categoria,
      Producto: item.producto,
      Tipo: item.tipo,
      Unidad: item.unidad,
      Cantidad: item.cantidad,
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

  return { compras, registrar };
}

function actualizarInventarioDesdeCompras(nuevasCompras) {
  const inv = load(KEYS.inventario, {});
  nuevasCompras.forEach(c => {
    const key = c.Producto;
    if (!inv[key]) {
      inv[key] = { totalComprado: 0, costoPromedio: 0, stockActual: 0 };
    }
    const prev = inv[key];
    const totalAnterior = prev.totalComprado * prev.costoPromedio;
    const totalNuevo = totalAnterior + c['Costo T'];
    const totalUnidades = prev.totalComprado + c.Cantidad;
    inv[key] = {
      totalComprado: totalUnidades,
      costoPromedio: totalUnidades > 0 ? totalNuevo / totalUnidades : 0,
      stockActual: prev.stockActual + c.Cantidad,
    };
  });
  save(KEYS.inventario, inv);
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
