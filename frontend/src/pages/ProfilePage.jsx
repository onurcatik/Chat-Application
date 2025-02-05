// // import { useState } from "react";
// // import { useAuthStore } from "../store/useAuthStore";
// // import { Camera, Mail, User } from "lucide-react";

// // const ProfilePage = () => {
// //   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
// //   const [selectedImg, setSelectedImg] = useState(null);

// //   const handleImageUpload = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const reader = new FileReader();

// //     reader.readAsDataURL(file);

// //     reader.onload = async () => {
// //       const base64Image = reader.result;
// //       setSelectedImg(base64Image);
// //       await updateProfile({ profilePic: base64Image });
// //     };
// //   };

// //   return (
// //     <div className="min-h-screen pt-20">
// //       <div className="max-w-4xl mx-auto p-4 py-8">
// //         <div className="bg-base-300 rounded-xl p-6 space-y-8">
// //           <div className="text-center">
// //             <h1 className="text-2xl font-semibold">Profile</h1>
// //             <p className="mt-2">Your profile information</p>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
// //             {/* Sol Taraf - Resim Bölgesi */}
// //             <div className="flex flex-col items-center">
// //               <div className="relative">
// //                 <img
// //                   src={selectedImg || authUser.profilePic || "/avatar.png"}
// //                   alt="Profile"
// //                   className="w-72 h-72 rounded-full object-cover border-4"
// //                 />
// //                 <label
// //                   htmlFor="avatar-upload"
// //                   className={`
// //                     absolute bottom-0 right-0 
// //                     bg-base-content hover:scale-105
// //                     p-2 rounded-full cursor-pointer 
// //                     transition-all duration-200
// //                     ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
// //                   `}
// //                 >
// //                   <Camera className="w-6 h-6 text-base-200" />
// //                   <input
// //                     type="file"
// //                     id="avatar-upload"
// //                     className="hidden"
// //                     accept="image/*"
// //                     onChange={handleImageUpload}
// //                     disabled={isUpdatingProfile}
// //                   />
// //                 </label>
// //               </div>
// //               <p className="text-sm text-zinc-400 mt-2">
// //                 {isUpdatingProfile
// //                   ? "Uploading..."
// //                   : "Click the camera icon to update your photo"}
// //               </p>
// //             </div>

// //             {/* Sağ Taraf - Profil Bilgileri */}
// //             <div className="space-y-6">
// //               {/* İsim */}
// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-500 text-sm gap-2">
// //                   <User className="w-5 h-5" />
// //                   <span>Full Name</span>
// //                 </div>
// //                 <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
// //                   {authUser?.fullName || "No Name Available"}
// //                 </p>
// //               </div>

// //               {/* Email */}
// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-500 text-sm gap-2">
// //                   <Mail className="w-5 h-5" />
// //                   <span>Email Address</span>
// //                 </div>
// //                 <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
// //                   {authUser?.email || "No Email Available"}
// //                 </p>
// //               </div>

// //               {/* Hesap Bilgileri */}
// //               <div className="bg-gray-100 p-6 rounded-lg shadow-md">
// //                 <h2 className="text-lg font-bold mb-4">Account Information</h2>
// //                 <div className="space-y-3">
// //                   <div className="flex items-center justify-between py-2 border-b border-gray-300">
// //                     <span className="text-gray-500">Member Since</span>
// //                     <span className="text-gray-700 font-semibold">
// //                       {authUser.createdAt?.split("T")[0] || "N/A"}
// //                     </span>
// //                   </div>
// //                   <div className="flex items-center justify-between py-2">
// //                     <span className="text-gray-500">Account Status</span>
// //                     <span className="text-green-500 font-semibold">Active</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;


// // import { useState } from "react";
// // import { useAuthStore } from "../store/useAuthStore";
// // import { Camera, Mail, User } from "lucide-react";

// // const ProfilePage = () => {
// //   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
// //   const [selectedImg, setSelectedImg] = useState(null);

// //   const handleImageUpload = async (e) => {
// //     const file = e.target.files[0];
// //     if (!file) return;

// //     const reader = new FileReader();

// //     reader.readAsDataURL(file);

// //     reader.onload = async () => {
// //       const base64Image = reader.result;
// //       setSelectedImg(base64Image);
// //       await updateProfile({ profilePic: base64Image });
// //     };
// //   };

// //   return (
// //     <div className="min-h-screen pt-20">
// //       <div className="max-w-4xl mx-auto p-4 py-8">
// //         <div className="bg-base-300 rounded-xl p-6 space-y-8">
// //           <div className="text-center">
// //             <h1 className="text-2xl font-semibold">Profile</h1>
// //             <p className="mt-2">Your profile information</p>
// //           </div>

// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
// //             {/* Sol Taraf - Resim Bölgesi */}
// //             <div className="flex flex-col items-center">
// //               <div className="relative">
// //                 <img
// //                   src={selectedImg || authUser.profilePic || "/avatar.png"}
// //                   alt="Profile"
// //                   className="w-72 h-72 rounded-full object-cover border-4"
// //                 />
// //                 <label
// //                   htmlFor="avatar-upload"
// //                   className={`
// //                     absolute bottom-0 right-0 
// //                     bg-base-content hover:scale-105
// //                     p-2 rounded-full cursor-pointer 
// //                     transition-all duration-200
// //                     ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
// //                   `}
// //                 >
// //                   <Camera className="w-6 h-6 text-base-200" />
// //                   <input
// //                     type="file"
// //                     id="avatar-upload"
// //                     className="hidden"
// //                     accept="image/*"
// //                     onChange={handleImageUpload}
// //                     disabled={isUpdatingProfile}
// //                   />
// //                 </label>
// //               </div>
// //               <p className="text-sm text-zinc-400 mt-2">
// //                 {isUpdatingProfile
// //                   ? "Uploading..."
// //                   : "Click the camera icon to update your photo"}
// //               </p>
// //             </div>

// //             {/* Sağ Taraf - Profil Bilgileri */}
// //             <div className="space-y-6">
// //               {/* İsim */}
// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-500 text-sm gap-2">
// //                   <User className="w-5 h-5" />
// //                   <span>Full Name</span>
// //                 </div>
// //                 <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
// //                   {authUser?.fullName || "No Name Available"}
// //                 </p>
// //               </div>

// //               {/* Email */}
// //               <div className="space-y-2">
// //                 <div className="flex items-center text-gray-500 text-sm gap-2">
// //                   <Mail className="w-5 h-5" />
// //                   <span>Email Address</span>
// //                 </div>
// //                 <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
// //                   {authUser?.email || "No Email Available"}
// //                 </p>
// //               </div>

// //               {/* Hesap Bilgileri */}
// //               <div className="bg-gray-100 p-6 rounded-lg shadow-md">
// //                 <h2 className="text-lg font-bold mb-4">Account Information</h2>
// //                 <div className="space-y-3">
// //                   <div className="flex items-center justify-between py-2 border-b border-gray-300">
// //                     <span className="text-gray-500">Member Since</span>
// //                     <span className="text-gray-700 font-semibold">
// //                       {authUser.createdAt?.split("T")[0] || "N/A"}
// //                     </span>
// //                   </div>
// //                   <div className="flex items-center justify-between py-2">
// //                     <span className="text-gray-500">Account Status</span>
// //                     <span className="text-green-500 font-semibold">Active</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProfilePage;


// import { useState } from "react";
// import { useAuthStore } from "../store/useAuthStore";
// import { Camera, Mail, User } from "lucide-react";

// const ProfilePage = () => {
//   const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
//   const [selectedImg, setSelectedImg] = useState(null);
//   const [fullName, setFullName] = useState(authUser?.fullName || "");
//   const [email, setEmail] = useState(authUser?.email || "");
//   const [isEditing, setIsEditing] = useState(false);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Image = reader.result;
//       setSelectedImg(base64Image);
//       await updateProfile({ profilePic: base64Image });
//     };
//   };

//   const handleSave = async () => {
//     await updateProfile({ fullName, email });
//     setIsEditing(false);
//   };

//   return (
//     <div className="min-h-screen pt-20">
//       <div className="max-w-4xl mx-auto p-4 py-8">
//         <div className="bg-base-300 rounded-xl p-6 space-y-8">
//           <div className="text-center">
//             <h1 className="text-2xl font-semibold">Profile</h1>
//             <p className="mt-2">Your profile information</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             {/* Left Side - Image Section */}
//             <div className="flex flex-col items-center">
//               <div className="relative">
//                 <img
//                   src={selectedImg || authUser.profilePic || "/avatar.png"}
//                   alt="Profile"
//                   className="w-72 h-72 rounded-full object-cover border-4"
//                 />
//                 <label
//                   htmlFor="avatar-upload"
//                   className={`
//                     absolute bottom-0 right-0 
//                     bg-base-content hover:scale-105
//                     p-2 rounded-full cursor-pointer 
//                     transition-all duration-200
//                     ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
//                   `}
//                 >
//                   <Camera className="w-6 h-6 text-base-200" />
//                   <input
//                     type="file"
//                     id="avatar-upload"
//                     className="hidden"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     disabled={isUpdatingProfile}
//                   />
//                 </label>
//               </div>
//               <p className="text-sm text-zinc-400 mt-2">
//                 {isUpdatingProfile
//                   ? "Uploading..."
//                   : "Click the camera icon to update your photo"}
//               </p>
//             </div>

//             {/* Right Side - Profile Information */}
//             <div className="space-y-6">
//               {/* Full Name */}
//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-500 text-sm gap-2">
//                   <User className="w-5 h-5" />
//                   <span>Full Name</span>
//                 </div>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     className="px-4 py-3 bg-gray-100 rounded-lg shadow-md w-full"
//                   />
//                 ) : (
//                   <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
//                     {authUser?.fullName || "No Name Available"}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <div className="flex items-center text-gray-500 text-sm gap-2">
//                   <Mail className="w-5 h-5" />
//                   <span>Email Address</span>
//                 </div>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="px-4 py-3 bg-gray-100 rounded-lg shadow-md w-full"
//                   />
//                 ) : (
//                   <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
//                     {authUser?.email || "No Email Available"}
//                   </p>
//                 )}
//               </div>

//               {/* Save/Cancel Buttons */}
//               {isEditing ? (
//                 <div className="flex gap-4">
//                   <button
//                     onClick={handleSave}
//                     disabled={isUpdatingProfile}
//                     className="bg-green-500 text-white px-4 py-2 rounded-lg"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={() => setIsEditing(false)}
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ) : (
//                 <><button
//                     onClick={() => setIsEditing(true)}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                   >
//                     Edit Profile
//                   </button><div className="bg-gray-100 p-6 rounded-lg shadow-md">
//                       <h2 className="text-lg font-bold mb-4">Account Information</h2>
//                       <div className="space-y-3">
//                         <div className="flex items-center justify-between py-2 border-b border-gray-300">
//                           <span className="text-gray-500">Member Since</span>
//                           <span className="text-gray-700 font-semibold">
//                             {authUser.createdAt?.split("T")[0] || "N/A"}
//                           </span>
//                         </div>
//                         <div className="flex items-center justify-between py-2">
//                           <span className="text-gray-500">Account Status</span>
//                           <span className="text-green-500 font-semibold">Active</span>
//                         </div>

//                       </div>
//                     </div></>
              
                

                
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleSave = async () => {
    await updateProfile({ fullName, email });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Image Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-72 h-72 rounded-full object-cover border-4"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-6 h-6 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400 mt-2">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            {/* Right Side - Profile Information */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <User className="w-5 h-5" />
                  <span>Full Name</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="px-4 py-3 bg-gray-100 rounded-lg shadow-md w-full"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
                    {authUser?.fullName || "No Name Available"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <Mail className="w-5 h-5" />
                  <span>Email Address</span>
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 bg-gray-100 rounded-lg shadow-md w-full"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-100 rounded-lg shadow-md">
                    {authUser?.email || "No Email Available"}
                  </p>
                )}
              </div>

              {/* Save/Cancel Buttons */}
              {isEditing ? (
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    disabled={isUpdatingProfile}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <><button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Edit Profile
                  </button><div className="bg-gray-100 p-6 rounded-lg shadow-md">
                      <h2 className="text-lg font-bold mb-4">Account Information</h2>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-300">
                          <span className="text-gray-500">Member Since</span>
                          <span className="text-gray-700 font-semibold">
                            {authUser.createdAt?.split("T")[0] || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-500">Account Status</span>
                          <span className="text-green-500 font-semibold">Active</span>
                        </div>

                      </div>
                    </div></>
              
                

                
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;