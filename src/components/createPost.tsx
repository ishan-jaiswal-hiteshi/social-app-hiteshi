import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [images, setImages] = useState<File[]>([]);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (images.length + newFiles.length > 10) {
        toast.error("You can only upload up to 10 images.");
        return;
      }
      setImages((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handlePost = async (event: React.FormEvent) => {
    event.preventDefault();

    if (images.length === 0) {
      toast.error("At least one image is required.");
      return;
    }

    const formData = new FormData();

    images.forEach((image) => {
      formData.append(`files`, image);
    });

    try {
      setLoading(true);
      const mediaResponse = await axiosInstance.post(
        "/multiple-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (mediaResponse && mediaResponse.data?.mediaUrls) {
        const uploadData = {
          userId: user?.id,
          content: content || "",
          mediaUrls: mediaResponse?.data?.mediaUrls,
        };

        const postResponse = await axiosInstance.post(
          "/create-post",
          uploadData
        );

        if (postResponse) {
          setUser((prevUser) => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              other_data: {
                ...prevUser.other_data,
                posts: (prevUser.other_data?.posts || 0) + 1,
              },
            };
          });
          toast.success("Post Created Successfully!");
          router.push("/dashboard/home");
        }
      } else {
        throw new Error("Media upload failed. No media URL received.");
      }
    } catch (error) {
      console.error("Error in uploading a post", error);
      toast.error("Error in Creating Post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create a New Post
        </h2>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
              className="animate-spin inline-block text-center w-12 h-12 border-[3px] border-current border-t-transparent text-red-600 rounded-full dark:text-red-500"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handlePost}
        >
          <div className="flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-center text-gray-600 hover:text-gray-800"
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="text-gray-500"
                >
                  <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" />
                </svg>
                <p className="text-sm text-gray-500">
                  Click to upload images (Max: 10)
                </p>
              </div>
            </label>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs"
                    onClick={() => handleRemoveImage(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Post Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={4}
              value={content}
              onChange={handleContentChange}
              className="mt-1 block w-full p-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Write your post content here..."
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-400"
            >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
