import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { User, MapPin, CreditCard, ShoppingCart, PackageCheck, Menu, X } from "lucide-react"
import LogoutButton from "../../components/perfil/LogoutButton"
import { cn } from "../../utils/cn"

export default function LayoutPerfil() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  const navItems = [
    { path: "cuenta", label: "Cuenta", icon: User },
    { path: "direcciones", label: "Direcciones", icon: MapPin },
    { path: "metodos_pago", label: "Métodos de pago", icon: CreditCard },
    { path: "pedidos", label: "Pedidos realizados", icon: PackageCheck },
  ]

  const isActive = (path) => location.pathname.includes(path)

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Overlay para móviles */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={closeSidebar} />}

      {/* Botón de menú móvil */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-40 md:hidden bg-morado text-white p-2 rounded-md shadow-md"
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out pt-20",
          "bg-white border-r border-[#7912B0]/20 shadow-lg md:shadow-none",
          "md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="px-4 py-2">
            <h2 className="text-[#7912B0] font-bold text-xl">Mi Perfil</h2>
          </div>

          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                        "hover:bg-[#7912B0]/10",
                        isActive ? "bg-morado text-white font-medium shadow-md hover:bg-[#7912B0]/70" : "text-gray-700",
                      )
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Separador */}
            <div className="my-4 border-t border-[#7912B0]/20" />

            {/* Cerrar sesión */}
            <div className="px-1">
              <LogoutButton />
            </div>
          </nav>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 bg-gradient-to-b from-purple-50 to-white pt-20">
        <Outlet />
      </main>
    </div>
  )
}
