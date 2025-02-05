
import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { motion } from "framer-motion";

// 🔄 3D Torus'un Hareketini Sağlayan Bileşen
const MovingTorus = () => {
  const torusRef = useRef();

  useFrame(({ clock }) => {
    if (torusRef.current) {
      // X ve Y ekseninde dönüş hareketi
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.01;

      // Dalgalanma efekti (yukarı-aşağı hareket)
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

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success) signup(formData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-800 to-black text-white pt-16">
      {/* Sol Bölüm - Form */}
      <div className="flex flex-col justify-center items-center p-6 md:w-1/2 space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md"
        >
          {/* Logo ve Başlık */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                <MessageSquare className="size-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-gray-400">Step into a new dimension of connection</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-4 text-gray-400" />
              <input
                type="text"
                className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-4 text-gray-400" />
              <input
                type="email"
                className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-4 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Sign Up"}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Sağ Bölüm - 3D Arka Plan */}
      <div className="relative md:w-1/2 h-96 md:h-auto">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} />
          <ambientLight intensity={0.5} />
          <OrbitControls enableZoom={false} />
          <MovingTorus /> {/* 🌀 Kendi kendine hareket eden Torus */}
        </Canvas>
      </div>
    </div>
  );
};

export default SignUpPage;


// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stars } from "@react-three/drei";
// import { motion } from "framer-motion";

// const SignUpPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const { signup, isSigningUp } = useAuthStore();

//   const validateForm = () => {
//     if (!formData.fullName.trim()) return toast.error("Full name is required");
//     if (!formData.email.trim()) return toast.error("Email is required");
//     if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
//     if (!formData.password) return toast.error("Password is required");
//     if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const success = validateForm();
//     if (success) signup(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-800 to-black text-white pt-16">
//       {/* Left Section */}
//       <div className="flex flex-col justify-center items-center p-6 md:w-1/2 space-y-6">
//         <motion.div
//           initial={{ opacity: 0, x: -100 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1 }}
//           className="w-full max-w-md"
//         >
//           {/* Logo and Title */}
//           <div className="text-center mb-6">
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
//                 <MessageSquare className="size-8 text-primary" />
//               </div>
//               <h1 className="text-3xl font-bold">Create Account</h1>
//               <p className="text-gray-400">Step into a new dimension of connection</p>
//             </div>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-white">Full Name</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="size-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
//                   placeholder="Full Name"
//                   value={formData.fullName}
//                   onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-white">Email</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="size-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
//                   placeholder="you@example.com"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 />
//               </div>
//             </div>

//             <div className="form-control">
//               <label className="label">
//                 <span className="label-text text-white">Password</span>
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="size-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
//                   placeholder="••••••••"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="size-5 text-gray-400" />
//                   ) : (
//                     <Eye className="size-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" className="btn btn-primary w-full">
//               {isSigningUp ? (
//                 <>
//                   <Loader2 className="size-5 animate-spin" />
//                   Signing up...
//                 </>
//               ) : (
//                 "Sign Up"
//               )}
//             </button>
//           </form>
//         </motion.div>
//       </div>

//       {/* Right Section */}
//       <div className="relative md:w-1/2 h-96 md:h-auto">
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
//     </div>
//   );
// };

// export default SignUpPage;

// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Canvas } from "@react-three/fiber";
// import { OrbitControls, Stars } from "@react-three/drei";
// import { motion } from "framer-motion";

// const SignUpPage = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//   });

//   const { signup, isSigningUp } = useAuthStore();

//   const validateForm = () => {
//     if (!formData.fullName.trim()) return toast.error("Full name is required");
//     if (!formData.email.trim()) return toast.error("Email is required");
//     if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
//     if (!formData.password) return toast.error("Password is required");
//     if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const success = validateForm();
//     if (success) signup(formData);
//   };

//   return (
//     <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-800 to-black text-white">
//       {/* 3D Background Effect */}
//       <div className="absolute top-0 left-0 w-full h-full -z-10">
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

//       {/* Form Card */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="relative bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg p-8 w-full max-w-lg space-y-6"
//       >
//         <h1 className="text-3xl font-bold text-center">Create Account</h1>
//         <p className="text-center text-gray-400">Step into a new dimension of connection</p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Full Name Input */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text text-white">Full Name</span>
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User className="size-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
//                 placeholder="John Doe"
//                 value={formData.fullName}
//                 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Email Input */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text text-white">Email</span>
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Mail className="size-5 text-gray-400" />
//               </div>
//               <input
//                 type="email"
//                 className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
//                 placeholder="you@example.com"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div className="form-control">
//             <label className="label">
//               <span className="label-text text-white">Password</span>
//             </label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock className="size-5 text-gray-400" />
//               </div>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="input input-bordered w-full pl-10 bg-gray-700 text-white border-gray-600"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//               <button
//                 type="button"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? (
//                   <EyeOff className="size-5 text-gray-400" />
//                 ) : (
//                   <Eye className="size-5 text-gray-400" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button type="submit" className="btn btn-primary w-full">
//             {isSigningUp ? (
//               <>
//                 <Loader2 className="size-5 animate-spin" />
//                 Signing up...
//               </>
//             ) : (
//               "Sign Up"
//             )}
//           </button>
//         </form>
//         <p className="text-center text-gray-500 mt-4">
//           Already have an account? <Link to="/login" className="text-primary underline">Log In</Link>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default SignUpPage;
