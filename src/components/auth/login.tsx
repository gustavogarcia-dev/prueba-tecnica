import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom"; // Importa useNavigate y Link
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa estilos de Toastify
import { UserData } from "../../utils/types";


const Login: React.FC<{ toggleForm: () => void }> = ({ toggleForm }) => {
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  // Esquema de validación con Yup
  const signInValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Correo electrónico inválido")
      .required("El correo electrónico es requerido"),
    password: Yup.string()
      .required("La contraseña es requerida"),
  });

  const submitSignInForm = (values: UserData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
  
    const user = users.find((user: UserData) =>
      user.email === values.email && user.password === values.password
    );
  
    if (user) {
      // Usar el email como ID único
      localStorage.setItem('currentUserId', user.email); // Guardar el email como ID único
      localStorage.setItem(`${user.email}_userName`, user.name); // Guardar el nombre del usuario
      localStorage.setItem(`${user.email}_userEmail`, user.email); // Guardar el correo del usuario
      navigate('/home'); // Redirige a la página principal
      toast.success("Inicio de sesión exitoso."); // Muestra notificación de éxito
    } else {
      toast.error("Email o contraseña incorrectos. Regístrate o intenta con otra cuenta."); // Muestra notificación de error
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-gray-300 bg-white p-6 md:p-8 shadow-lg">
        <h2 className="sign-text text-4xl font-bold text-center">Iniciar sesión</h2>
        <div className="py-4 text-base font-normal text-gray-500 text-center">
          Bienvenido, introduce tus datos.
        </div>

        <Formik
          validateOnMount
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={signInValidationSchema}
          onSubmit={submitSignInForm}
        >
          {({ errors, touched }) => (
            <Form id="signin-form" method="post">
              <label htmlFor="email" className="text-gray-500 font-normal my-2">
                Correo electrónico
              </label>
              <Field
                type="email"
                name="email"
                className={`w-full my-2 p-2 border rounded focus:outline-none focus:ring ${
                  errors.email && touched.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ingrese su correo electrónico"
              />
              <ErrorMessage name="email" component="div" className="text-red-800" />

              <label htmlFor="password" className="text-gray-500 text-base font-normal">
                Contraseña
              </label>
              <Field
                type="password"
                name="password"
                className={`w-full my-2 p-2 border rounded focus:outline-none focus:ring ${
                  errors.password && touched.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <ErrorMessage name="password" component="div" className="text-red-800" />

              <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">
                Iniciar sesión
              </button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-4">
          <Link to="/register" onClick={toggleForm}>
            <div className="mt-8 text-gray-500">
              ¿No tienes una cuenta?{" "}
              <span className="font-bold text-blue-500 hover:underline">
                Regístrate
              </span>
            </div>
          </Link>
        </div>

        {/* Componente ToastContainer para las notificaciones */}
        <ToastContainer
          position="top-right"
          autoClose={5000} // Cierra automáticamente después de 5 segundos
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light" // Cambia a 'dark' o 'colored' según prefieras
        />
      </div>
    </div>
  );
};

export default Login;
