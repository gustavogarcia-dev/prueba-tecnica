import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom"; // Importa useNavigate y Link
import { ToastContainer, toast } from "react-toastify"; // Importa ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importa estilos de Toastify
import { RegisterFormValues } from "../../utils/types";

// validación  Yup
const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(5, "La contraseña debe tener al menos 5 caracteres"),
});

const Register: React.FC<{ toggleForm: () => void }> = ({ toggleForm }) => {
  const navigate = useNavigate();

  const submitRegisterForm = (values: RegisterFormValues) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const userExists = users.find((user: { email: string }) => user.email === values.email);

    if (userExists) {
      toast.error("El correo electrónico ya está registrado."); 
      return;
    }

    // Agg usuario al array de usuarios
    users.push({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    // Guarda  usuarios en el localStorage
    localStorage.setItem('users', JSON.stringify(users));

    //  notificacion de exito
    toast.success("Registro exitoso. Puedes iniciar sesión ahora."); 
    navigate("/"); 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-8 py-6 mx-auto bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700">Crear Cuenta</h2>
        <p className="text-center text-gray-500">¡Regístrate para comenzar!</p>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={registerValidationSchema}
          onSubmit={submitRegisterForm}
        >
          {({ errors, touched }) => (
            <Form className="mt-8">
              {/* Campo de nombre */}
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-600">
                  Nombre
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                    errors.name && touched.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="name" component="div" className="text-sm text-red-600 mt-1" />
              </div>

              
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">
                  Correo Electrónico
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="correo@ejemplo.com"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                    errors.email && touched.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="email" component="div" className="text-sm text-red-600 mt-1" />
              </div>

             
              <div className="mb-6">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">
                  Contraseña
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="********"
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring ${
                    errors.password && touched.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <ErrorMessage name="password" component="div" className="text-sm text-red-600 mt-1" />
              </div>

              
              <div className="mb-6">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
                >
                  Crear Cuenta
                </button>
              </div>

              
              <div className="text-center text-gray-500">
                ¿Ya tienes cuenta?{" "}
                <Link to="/" onClick={toggleForm} className="text-blue-600 hover:underline">
                  Inicia sesión aquí
                </Link>
              </div>
            </Form>
          )}
        </Formik>

        {/* Componente ToastContainer para las notificaciones */}
        <ToastContainer
          position="top-right"
          autoClose={5000} 
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light" 
        />
      </div>
    </div>
  );
};

export default Register;
