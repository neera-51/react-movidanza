import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  User,
  MapPin,
  CreditCard,
  ShoppingCart,
  PackageCheck,
  LogOut,
} from "lucide-react";
import LogoutButton from "../../components/perfil/LogoutButton";

export default function LayoutPerfil() {
  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f0d2ff] p-6">
        <nav className="space-y-4">
          <ul className="space-y-1">
            {/* Grupo principal */}
            <li>
              <NavLink
                to="cuenta"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e5b9ff] ${
                    isActive ? "font-semibold bg-[#e5b9ff]" : ""
                  }`
                }
              >
                <User className="w-4 h-4" />
                Cuenta
              </NavLink>
            </li>
            <li>
              <NavLink
                to="direcciones"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e5b9ff] ${
                    isActive ? "font-semibold bg-[#e5b9ff]" : ""
                  }`
                }
              >
                <MapPin className="w-4 h-4" />
                Direcciones
              </NavLink>
            </li>
            <li>
              <NavLink
                to="metodos_pago"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e5b9ff] ${
                    isActive ? "font-semibold bg-[#e5b9ff]" : ""
                  }`
                }
              >
                <CreditCard className="w-4 h-4" />
                Métodos de pago
              </NavLink>
            </li>
            <li>
              <NavLink
                to="carrito"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e5b9ff] ${
                    isActive ? "font-semibold bg-[#e5b9ff]" : ""
                  }`
                }
              >
                <ShoppingCart className="w-4 h-4" />
                Carrito
              </NavLink>
            </li>
            <li>
              <NavLink
                to="pedidos"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2 py-1 rounded hover:bg-[#e5b9ff] ${
                    isActive ? "font-semibold bg-[#e5b9ff]" : ""
                  }`
                }
              >
                <PackageCheck className="w-4 h-4" />
                Pedidos realizados
              </NavLink>
            </li>

            {/* Separador */}
            <li>
              <hr className="my-3 border-gray-300" />
            </li>

            {/* Cerrar sesión */}
            <li>
              <div className="flex items-center gap-2 text-red-600">
                <LogoutButton />
              </div>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gradient-to-b from-purple-50 to-white">
        <Outlet />
      </main>
    </div>
  );
}
