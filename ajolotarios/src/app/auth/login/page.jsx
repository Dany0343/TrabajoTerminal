"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loadFull } from "tsparticles";
import { useCallback } from "react";
import Particles from "react-tsparticles";

// Configuración de partículas (puedes personalizar al gusto)
const particlesConfig = {
  fullScreen: { enable: true },
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: { value: "#0ea5e9" },
    shape: { type: "circle" },
    opacity: {
      value: 0.6,
      random: false,
    },
    size: {
      value: 2.5,
      random: true,
    },
    move: {
      enable: true,
      speed: 1.5,
      random: true,
      straight: false,
      out_mode: "out",
    },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      repulse: { distance: 60, duration: 0.4 },
      push: { quantity: 4 },
    },
  },
  retina_detect: true,
};

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);
    if (res && res.error) {
      // Mostramos el error con un toast
      toast.error(res.error, {
        style: { background: "#dc2626", color: "#fff" },
      });
    } else {
      // Éxito, mostramos mensaje fugaz y luego redirigimos
      toast.success("¡Bienvenido!", {
        style: { background: "#16a34a", color: "#fff" },
      });
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    }
  });

  // Carga de configuración de partículas
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Partículas de fondo */}
      <Particles className="absolute inset-0 -z-10" init={particlesInit} options={particlesConfig} />

      <div className="bg-white shadow-lg rounded-lg max-w-md w-full mx-auto p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/logoAjolotarios.jpeg"
            width={120}
            height={120}
            alt="Project logo"
            className="rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-semibold mb-1"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              aria-label="correo electrónico"
              placeholder="tucorreo@ejemplo.com"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              {...register("email", {
                required: {
                  value: true,
                  message: "El correo electrónico es obligatorio.",
                },
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Ingresa un correo válido.",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-semibold mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              aria-label="contraseña"
              placeholder="Tu contraseña"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              {...register("password", {
                required: {
                  value: true,
                  message: "La contraseña es obligatoria.",
                },
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres.",
                },
              })}
            />
            <button
              type="button"
              className="absolute right-2 top-8 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="mostrar u ocultar contraseña"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <a
              href="#"
              className="hover:underline"
              aria-label="Olvidaste tu contraseña"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <a
              href="#"
              className="hover:underline"
              aria-label="Crear cuenta nueva"
            >
              Crear cuenta
            </a>
          </div>

          <div className="flex items-center justify-center mt-4">
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              type="submit"
              disabled={loading}
              aria-label="Iniciar sesión"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
