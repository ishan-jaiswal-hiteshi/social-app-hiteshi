"use client";

interface ProfileInfoProps {
  name: string;
  location: string;
  jobTitle: string;
  university: string;
  bio: string;
}

export default function ProfileInfo({
  name,
  location,
  jobTitle,
  university,
  bio,
}: ProfileInfoProps) {
  return (
    <div className="text-center mt-5">
      <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
        {name}
      </h3>
      <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
        <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
        {location}
      </div>
      <hr className="w-72 h-0.5 mx-auto my-4 bg-red-500 border-0 rounded md:my-10" />
      <div className="mb-2 text-blueGray-600 mt-10">
        <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
        {jobTitle}
      </div>
      <div className="mb-2 text-blueGray-600">
        <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
        {university}
      </div>
      <div className="mt-10 py-10 border-t border-red-500 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
            <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
              {bio}
            </p>
            <a href="#pablo" className="font-normal text-red-500">
              Show more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
