// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stars } from "@react-three/drei";
// import { motion } from "framer-motion";

// const LoginPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const { login, isLoggingIn } = useAuthStore();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     login(formData);
//   };

//   return (
//     <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-900 to-black">
//       {/* 3D Canvas */}
//       <div className="absolute inset-0">
//         <Canvas>
//           <Stars radius={100} depth={50} count={5000} factor={4} />
//           <ambientLight intensity={0.5} />
//           <OrbitControls enableZoom={false} />
//           <mesh rotation={[0.4, 0.2, 0]}>
//             <torusGeometry args={[10, 3, 16, 100]} />
//             <meshStandardMaterial color="cyan" wireframe />
//           </mesh>
//         </Canvas>
//       </div>

//       {/* Login Card */}
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6"
//       >
//         {/* Title */}
//         <div className="text-center">
//           <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
//             Welcome Back
//           </h1>
//           <p className="text-gray-300">Log in to continue your journey!</p>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="relative">
//             <input
//               type="email"
//               className="peer w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder=" "
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//             />
//             <label className="absolute top-2 left-4 text-gray-400 text-sm transform -translate-y-1/2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
//               Email
//             </label>
//             <Mail className="absolute top-4 right-4 text-gray-400" />
//           </div>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="peer w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//               placeholder=" "
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             />
//             <label className="absolute top-2 left-4 text-gray-400 text-sm transform -translate-y-1/2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
//               Password
//             </label>
//             <button
//               type="button"
//               className="absolute top-4 right-4 text-gray-400"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <EyeOff /> : <Eye />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-gradient-to-r from-purple-400 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
//             disabled={isLoggingIn}
//           >
//             {isLoggingIn ? (
//               <Loader2 className="animate-spin inline-block" />
//             ) : (
//               "Sign In"
//             )}
//           </button>
//         </form>

//         {/* Footer */}
//         <div className="text-center">
//           <p className="text-gray-300">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-purple-400 font-semibold underline">
//               Create one!
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;


import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";

const MovingTorus = () => {
  const torusRef = useRef();

  useFrame(({ clock }) => {
    if (torusRef.current) {
      // Rotation
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.01;

      // Position (dalgalanma efekti)
      torusRef.current.position.y = Math.sin(clock.getElapsedTime()) * 2;
    }
  });

  return (
    <mesh ref={torusRef} rotation={[0.4, 0.2, 0]}>
      <torusGeometry args={[10, 3, 16, 100]} />
      <meshStandardMaterial color="cyan" wireframe />
    </mesh>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-900 to-black">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} />
          <ambientLight intensity={0.5} />
          <OrbitControls enableZoom={false} />
          <MovingTorus />
        </Canvas>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-lg bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6"
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">
            Welcome Back
          </h1>
          <p className="text-gray-300">Log in to continue your journey!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              className="peer w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder=" "
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <label className="absolute top-2 left-4 text-gray-400 text-sm transform -translate-y-1/2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
              Email
            </label>
            <Mail className="absolute top-4 right-4 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="peer w-full p-4 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder=" "
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <label className="absolute top-2 left-4 text-gray-400 text-sm transform -translate-y-1/2 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all">
              Password
            </label>
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-400 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <Loader2 className="animate-spin inline-block" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-400 font-semibold underline">
              Create one!
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
