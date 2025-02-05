// import { MessageSquare } from "lucide-react";

// const NoChatSelected = () => {
//   return (
//     <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
//       <div className="max-w-md text-center space-y-6">
//         {/* Icon Display */}
//         <div className="flex justify-center gap-4 mb-4">
//           <div className="relative">
//             <div
//               className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
//              justify-center animate-bounce"
//             >
//               <MessageSquare className="w-8 h-8 text-primary " />
//             </div>
//           </div>
//         </div>

//         {/* Welcome Text */}
//         <h2 className="text-2xl font-bold">Welcome to Chatty!</h2>
//         <p className="text-base-content/60">
//           Select a conversation from the sidebar to start chatting
//         </p>
//       </div>
//     </div>
//   );
// };

// export default NoChatSelected;


import { motion } from "framer-motion";
import { MessageSquare, Users, Send } from "lucide-react";

const ChatAppWelcome = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-white overflow-hidden pb-12 sm:pb-16 md:pb-20">
      {/* Background Gradient Sphere */}
      <motion.div
        className="absolute w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full blur-xl sm:blur-2xl opacity-20 sm:opacity-30"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "8%" }}
      ></motion.div>

      {/* Secondary Animated Sphere */}
      <motion.div
        className="absolute w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full blur-xl sm:blur-2xl opacity-30 sm:opacity-40"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [360, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "8%", right: "10%" }}
      ></motion.div>

      {/* Main Card */}
      <motion.div
        className="relative z-10 bg-gray-800 shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-[85%] sm:max-w-sm md:max-w-md lg:max-w-lg text-center mt-[-80px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Animated Icons */}
        <motion.div
          className="absolute top-[-20px] sm:top-[-30px] left-[-20px] sm:left-[-30px] bg-blue-500/20 p-2 sm:p-3 rounded-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "linear",
          }}
        >
          <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-300" />
        </motion.div>

        <motion.div
          className="absolute top-[-20px] sm:top-[-30px] right-[-20px] sm:right-[-30px] bg-purple-500/20 p-2 sm:p-3 rounded-full"
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "linear",
          }}
        >
          <Send className="w-4 h-4 sm:w-6 sm:h-6 text-purple-300" />
        </motion.div>

        <motion.div
          className="absolute bottom-[-20px] sm:bottom-[-30px] left-[-20px] sm:left-[-30px] bg-pink-500/20 p-2 sm:p-3 rounded-full"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            repeat: Infinity,
            duration: 14,
            ease: "linear",
          }}
        >
          <MessageSquare className="w-4 h-4 sm:w-6 sm:h-6 text-pink-300" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-2 sm:mb-3 lg:mb-4 text-gray-100"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Welcome to Chat-App
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xs sm:text-sm lg:text-base mb-3 sm:mb-5 text-gray-300"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Connect with your friends and explore conversations like never before.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ChatAppWelcome;


