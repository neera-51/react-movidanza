import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { cn } from "../../utils/cn"
import RippleButton from "../ui/RippleButton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card"
import { Input } from "../ui/Input"
import { Label } from "../ui/Label"
import useAuth from "../../hooks/api/useAuth"
import { useUser } from "../../hooks/context/UserContext"
import useUsuario from "../../hooks/api/useUsuario"
import useCarrito from "../../hooks/api/useCarrito"
import { Eye, EyeOff } from "lucide-react"

export default function AuthForm({ mode = "login", className, ...props }) {
  const isRegister = mode === "register"
  const { login } = useAuth()
  const { createUsuario, deleteUsuario } = useUsuario()
  const { createCarrito } = useCarrito();
  const { setUser } = useUser();
  const navigate = useNavigate()

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isRegister && nombre.trim() === "") {
      setError("El nombre es obligatorio");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo no tiene un formato válido");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      let resultadoUsuario;

      if (isRegister) {
        const resultado = await createUsuario({ nombre, email, password });

        try {
          await createCarrito({ id_usuario: resultado.id, activo: true });
        } catch (errorCarrito){
          // Si falla la creación del carrito, elimino el usuario creado
          await deleteUsuario(resultado.id);
          throw new Error("Error al crear el carrito. Registro cancelado.", errorCarrito);
        }

        const loginRes = await login({ email, password });
        resultadoUsuario = loginRes.usuario;
      } else {
        const loginRes = await login({ email, password });
        resultadoUsuario = loginRes.usuario;
        console.log(resultadoUsuario)
      }

      setUser(resultadoUsuario); // actualizo el contexto
      navigate("/userProfile");
    } catch (err) {
      const mensaje =
        err.response?.data?.error ||
        err.response?.data?.message || // por si el backend usa "message"
        err.message || // fallback para errores como NetworkError
        "Error al procesar la solicitud";
      setError(mensaje);
    }

  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isRegister ? "Regístrate" : "Iniciar Sesión"}
          </CardTitle>
          <CardDescription>
            {isRegister
              ? "Introduce tus datos para crear una cuenta"
              : "Introduce tu email a continuación para iniciar sesión en tu cuenta"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && <div className="text-sm text-red-500">{error}</div>}

            {isRegister && (
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                {!isRegister && (
                  <button
                    onClick={() => { navigate("/forgot_password") }}
                    className="text-sm text-gray-800 hover:text-[#5e0e8d] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <RippleButton variant="purple" type="submit" className="w-full">
              {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
            </RippleButton>
          </form>

          <div className="my-6">
            <div className="mx-auto w-2/3 border-t border-gray-200" />
          </div>

          {/* Cambio de modo Inicio <> Registro */}
          <div className="mt-4 text-center text-sm">
            {isRegister ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  onClick={() => { navigate("/login") }}
                  className="underline underline-offset-4 text-morado hover:text-morado transition-colors duration-150 font-semibold"
                >
                  Inicia Sesión
                </button>
              </>
            ) : (
              <>
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={() => { navigate("/registro") }}
                  className="underline underline-offset-4 text-morado hover:text-moado transition-colors duration-150 font-semibold"
                >
                  Regístrate
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
