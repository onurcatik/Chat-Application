import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-16 sm:w-20 md:w-24 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full p-3 sm:p-5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-medium hidden md:block">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-2 sm:py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto md:mx-0">
              <div className="skeleton size-10 sm:size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on medium and larger screens */}
            <div className="hidden md:block text-left min-w-0 flex-1">
              <div className="skeleton h-3 w-24 sm:h-4 sm:w-32 mb-1 sm:mb-2" />
              <div className="skeleton h-2 w-12 sm:h-3 sm:w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
