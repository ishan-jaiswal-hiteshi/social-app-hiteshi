export const ProfileSkeleton = () => (
  <div className="min-h-screen flex flex-col justify-center   p-6">
    <div className="relative block h-[500px] bg-gray-500 animate-pulse">
      <div className="absolute top-0 w-full h-full bg-center bg-cover bg-gray-600 animate-pulse"></div>
    </div>

    <div className="relative py-16 bg-blueGray-200 animate-pulse">
      <div className="container mx-auto px-4">
        <div className="relative flex flex-col min-w-0 break-words bg-black text-white w-full mb-6 shadow-xl rounded-lg -mt-64">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                <div className="relative">
                  <div className="rounded-full shadow-xl overflow-hidden h-[150px] w-[150px] absolute -m-16 -ml-20 lg:-ml-16 bg-gray-600 animate-pulse"></div>
                </div>
              </div>

              <div className="w-full lg:w-4/12 px-4 lg:order-3 flex flex-wrap justify-center sm:mt-24 lg:justify-end items-center gap-4 mt-24 ">
                <button className="bg-gray-600 animate-pulse w-24 h-8 rounded-md"></button>
                <button className="bg-gray-600 animate-pulse w-24 h-8 rounded-md"></button>
              </div>
              <div className="w-full lg:w-4/12 px-4 lg:order-1">
                <div className="flex justify-center py-4 lg:pt-4 pt-8">
                  <div className="mr-4 p-3 text-center">
                    <div className="w-16 h-6 bg-gray-600 animate-pulse rounded-md"></div>
                  </div>
                  <div className="mr-4 p-3 text-center">
                    <div className="w-16 h-6 bg-gray-600 animate-pulse rounded-md"></div>
                  </div>
                  <div className="lg:mr-4 p-3 text-center">
                    <div className="w-16 h-6 bg-gray-600 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <div className="w-48 h-8 bg-gray-600 animate-pulse mx-auto rounded-md mb-4"></div>
              <div className="w-36 h-6 bg-gray-600 animate-pulse mx-auto rounded-md mb-2"></div>
              <div className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10"></div>
              <div className="w-48 h-6 bg-gray-600 animate-pulse mx-auto rounded-md mb-2"></div>
              <div className="w-48 h-6 bg-gray-600 animate-pulse mx-auto rounded-md mb-2"></div>
            </div>
            <div className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10"></div>
            <div className=" text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">
                  <div className="w-72 h-6 bg-gray-600 animate-pulse mx-auto rounded-md mb-6"></div>
                  <div className="w-40 h-6 bg-gray-600 animate-pulse mx-auto rounded-md"></div>
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
    <div className="w-96 border border-gray-600 rounded-lg max-w-md mx-auto my-5 bg-black animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center p-3">
        <div className="mr-3">
          <div className="w-10 h-10 rounded-full bg-gray-700"></div>
        </div>
        <div className="flex flex-col">
          <div className="w-24 h-4 bg-gray-700 rounded mb-2"></div>
          <div className="w-16 h-3 bg-gray-600 rounded"></div>
        </div>
      </div>

      {/* Media Skeleton */}
      <div className="w-full h-56 bg-gray-700"></div>

      {/* Interaction Bar Skeleton */}
      <div className="border-y border-gray-500 p-2 flex justify-start gap-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-700 rounded"></div>
          <div className="w-6 h-3 bg-gray-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-700 rounded"></div>
          <div className="w-6 h-3 bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="px-3 py-2">
        <div className="w-full h-4 bg-gray-700 rounded mb-2"></div>
        <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};

export const UserListSkeleton = () => {
  return (
    <div>
      <div className="block md:hidden border border-gray-600 rounded-lg w-full mx-2 my-2 font-sans bg-black animate-pulse">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-500 mr-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-500 rounded w-32"></div>
              <div className="h-3 bg-gray-500 rounded w-24"></div>
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-500 rounded"></div>
        </div>
      </div>
      <div className="block md:hidden border border-gray-600 rounded-lg w-full mx-2 my-2 font-sans bg-black animate-pulse">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-500 mr-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-500 rounded w-32"></div>
              <div className="h-3 bg-gray-500 rounded w-24"></div>
            </div>
          </div>
          <div className="h-8 w-20 bg-gray-500 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export const UserCardSkeleton = () => {
  return (
    <div>
      <div className="block md:hidden border border-gray-600 rounded-lg w-full mx-2 my-2 font-sans bg-black animate-pulse">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-gray-500 mr-3"></div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-500 rounded w-32"></div>
              <div className="h-3 bg-gray-500 rounded w-24"></div>
            </div>
          </div>

          <div className="h-8 w-20 bg-gray-500 rounded"></div>
        </div>
      </div>

      <div className="hidden md:block w-60 h-64 m-2 max-w-sm bg-black border border-gray-600 rounded-lg shadow-lg animate-pulse">
        <div className="flex flex-col items-center pt-10">
          <div className="cursor-pointer justify-center items-center flex-col flex">
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-500"></div>
            </div>
            <div className="h-4 bg-gray-500 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-500 rounded w-24"></div>
          </div>
          <div className="flex mt-4">
            <div className="h-8 w-24 bg-gray-500 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserDynamicListSkeleton = () => {
  return (
    <div>
      {/* Mobile UI Skeleton */}
      <div className="block md:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-600 rounded-lg w-full mx-2 my-7 font-sans bg-black animate-pulse"
          >
            <div className="flex justify-between items-center p-3">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-500 mr-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-500 rounded w-32"></div>
                  <div className="h-3 bg-gray-500 rounded w-24"></div>
                </div>
              </div>
              <div className="h-8 w-20 bg-gray-500 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop UI Skeleton */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className="w-60 h-64 bg-black border border-gray-600 rounded-lg shadow-lg animate-pulse flex flex-col items-center pt-10"
          >
            <div className="mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-500"></div>
            </div>
            <div className="h-4 bg-gray-500 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-500 rounded w-24"></div>
            <div className="mt-4">
              <div className="h-8 w-24 bg-gray-500 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const EventCardSkeleton = () => {
  return (
    <div className="mt-5 bg-black p-4 rounded-lg shadow-lg mx-auto flex justify-start gap-4 text-center w-[80%] animate-pulse">
      <div className="w-[40%]">
        <div className="w-full h-full bg-gray-700 rounded-lg"></div>
      </div>
      <div className="w-[60%] space-y-2">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
};

export const EventsSkeleton = () => {
  return (
    <div className="bg-black p-4 rounded-lg shadow-lg mx-auto flex md:flex-row flex-col gap-4 text-left my-2 border border-gray-600 animate-pulse">
      <div className="md:w-[40%] w-full h-48 bg-gray-700 rounded-lg"></div>
      <div className="flex-1 md:w-[60%]">
        <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>

        <div className="h-4 bg-gray-700 rounded mb-2 w-full"></div>
        <div className="h-4 bg-gray-700 rounded mb-2 w-5/6"></div>

        <div className="h-4 bg-gray-700 rounded mb-2 w-1/2"></div>

        {/* Date Placeholder */}
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
      </div>
    </div>
  );
};
