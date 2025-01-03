export const ProfileSkeleton = () => (
  <div className="min-h-screen flex flex-col  p-6">
    <div className="relative block h-[500px] bg-gray-300 animate-pulse">
      <div className="absolute top-0 w-full h-full bg-center bg-cover bg-gray-400 animate-pulse"></div>
    </div>

    <div className="relative py-16 bg-blueGray-200 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-black text-white w-full mb-6 shadow-xl rounded-lg -mt-64">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                <div className="relative">
                  <div className="rounded-full ring-4 ring-red-500 shadow-xl overflow-hidden h-[150px] w-[150px] absolute -m-16 -ml-20 lg:-ml-16 bg-gray-400 animate-pulse"></div>
                </div>
              </div>

              <div className="w-full lg:w-4/12 px-4 lg:order-3 flex flex-wrap justify-center sm:mt-24 lg:justify-end items-center gap-4 mt-24 ">
                <button className="bg-gray-400 animate-pulse w-24 h-8 rounded-md"></button>
                <button className="bg-gray-400 animate-pulse w-24 h-8 rounded-md"></button>
              </div>
              <div className="w-full lg:w-4/12 px-4 lg:order-1">
                <div className="flex justify-center py-4 lg:pt-4 pt-8">
                  <div className="mr-4 p-3 text-center">
                    <div className="w-16 h-6 bg-gray-400 animate-pulse rounded-md"></div>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <div className="w-16 h-6 bg-gray-400 animate-pulse rounded-md"></div>
                  </div>
                  <div className="lg:mr-4 p-3 text-center">
                    <div className="w-16 h-6 bg-gray-400 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <div className="w-48 h-8 bg-gray-400 animate-pulse mx-auto rounded-md mb-4"></div>
              <div className="w-36 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-2"></div>
              <div className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10"></div>
              <div className="w-48 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-2"></div>
              <div className="w-48 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-2"></div>
            </div>

            <div className="mt-10 py-10 border-t border-red-500 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <div className="w-72 h-6 bg-gray-400 animate-pulse mx-auto rounded-md mb-6"></div>
                  <div className="w-40 h-6 bg-gray-400 animate-pulse mx-auto rounded-md"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PostSkeleton = () => {
  return (
    <div className="animate-pulse p-4 border w-96 border-gray-400 rounded-lg max-w-md mx-4 my-5 bg-black">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-400"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-400 rounded w-1/2"></div>
          <div className="h-4 bg-gray-400 rounded w-1/4"></div>
        </div>
      </div>
      <div className="w-full h-48 bg-gray-400 rounded mb-4"></div>
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-400 rounded w-full"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>
      <div className="flex space-x-4">
        <div className="h-4 bg-gray-400 rounded w-16"></div>
        <div className="h-4 bg-gray-400 rounded w-16"></div>
      </div>
    </div>
  );
};

export const UserListSkeleton = () => {
  return (
    <>
      <div className="border border-gray-600 rounded-lg w-full mx-2 my-5 font-sans bg-black">
        <div className="flex justify-between items-center p-3 gap-10">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
              <div className="h-3 w-20 bg-gray-700 animate-pulse rounded"></div>
            </div>
          </div>

          <div className="h-8 w-20 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
      <div className="border border-gray-600 rounded-lg w-full mx-2 my-5 font-sans bg-black">
        <div className="flex justify-between items-center p-3 gap-10">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-700 animate-pulse rounded"></div>
              <div className="h-3 w-20 bg-gray-700 animate-pulse rounded"></div>
            </div>
          </div>

          <div className="h-8 w-20 bg-gray-700 animate-pulse rounded"></div>
        </div>
      </div>
    </>
  );
};

export const UserCardSkeleton = () => {
  return (
    <div>
      {/* Mobile Skeleton */}
      <div className="block md:hidden border border-gray-600 rounded-lg w-full mx-2 my-2 font-sans bg-black animate-pulse">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center">
            {/* Profile Image Skeleton */}
            <div className="w-16 h-16 rounded-full bg-gray-500 mr-3"></div>

            <div className="space-y-2">
              {/* Name Skeleton */}
              <div className="h-4 bg-gray-500 rounded w-32"></div>
              {/* Username Skeleton */}
              <div className="h-3 bg-gray-500 rounded w-24"></div>
            </div>
          </div>

          {/* Follow Button Skeleton */}
          <div className="h-8 w-20 bg-gray-500 rounded"></div>
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block w-60 h-64 m-2 max-w-sm bg-black border border-gray-600 rounded-lg shadow-lg animate-pulse">
        <div className="flex flex-col items-center pt-10">
          <div className="cursor-pointer justify-center items-center flex-col flex">
            <div className="mb-4">
              {/* Profile Image Skeleton */}
              <div className="w-16 h-16 rounded-full bg-gray-500"></div>
            </div>
            <div className="h-4 bg-gray-500 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-500 rounded w-24"></div>
          </div>
          <div className="flex mt-4">
            {/* Follow Button Skeleton */}
            <div className="h-8 w-24 bg-gray-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
