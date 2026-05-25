import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Compras from './pages/Compras';
import CreadorRegalos from './pages/CreadorRegalos';
import Ventas from './pages/Ventas';
import Productos from './pages/Productos';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/creador" element={<CreadorRegalos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/productos" element={<Productos />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
