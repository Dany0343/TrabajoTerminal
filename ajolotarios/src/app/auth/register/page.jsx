"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
    // Eliminar espacios en blanco
    const password = data.password.trim();
    const confirmPassword = data.confirmPassword.trim();

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (data.password !== data.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!data.privacyAccepted) {
      alert("Debes aceptar el aviso de privacidad");
      return;
    }

    console.log("La data es: " + JSON.stringify(data));

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          phone: data.phone,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/auth/login");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error conectando al servidor");
      console.error("Registration error:", error);
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Tarjeta de registro */}
      <div className="bg-white shadow-md rounded-lg max-w-md w-full mx-auto p-8">
        {/* Logo y título */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logoAjolotarios.jpeg"
            width={200}
            height={200}
            alt="Companys logo"
            className="rounded-lg"
          />
        </div>

        {/* Formulario de registro */}
        <form onSubmit={onSubmit}>
          {/* Campo de nombre */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Nombre
            </label>
            <div className="flex gap-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="text"
                placeholder="Nombre"
                {...register("firstName", {
                  required: {
                    value: true,
                    message: "El nombre es requerido",
                  },
                })}
              />
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="text"
                placeholder="Apellido"
                {...register("lastName", {
                  required: {
                    value: true,
                    message: "El apellido es requerido",
                  },
                })}
              />
            </div>
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Campo de correo electrónico */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              {...register("email", {
                required: {
                  value: true,
                  message: "email is required",
                },
              })}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Número de teléfono
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              placeholder="Ingresa tu número de teléfono"
              {...register("phone")}
            />
          </div>

          {/* Campo de contraseña */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Crea una contraseña"
              {...register("password", {
                required: {
                  value: true,
                  message: "password is required",
                },
              })}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Campo de confirmación de contraseña */}
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirm-password"
            >
              Confirmar contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="confirm-password"
              type="password"
              placeholder="Repite tu contraseña"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "password confirmation is required",
                },
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Aviso de privacidad */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="privacy"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  {...register("privacyAccepted", {
                    required: {
                      value: true,
                      message: "Debes aceptar el aviso de privacidad para continuar"
                    }
                  })}
                />
              </div>
              <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                He leído y acepto el <button 
                  type="button"
                  onClick={() => alert("Aviso de Privacidad\n\nDe conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, nos comprometemos a proteger tus datos personales. Los datos que proporcionas (nombre, correo electrónico, teléfono) serán utilizados únicamente para los fines relacionados con nuestros servicios. No compartiremos tu información con terceros sin tu consentimiento expreso.")}
                  className="text-blue-600 hover:underline"
                >
                  aviso de privacidad
                </button>
              </label>
            </div>
            {errors.privacyAccepted && (
              <span className="text-red-500 text-sm block mt-1">
                {errors.privacyAccepted.message}
              </span>
            )}
          </div>

          {/* Botón de registro */}
          <div className="flex items-center justify-center">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;