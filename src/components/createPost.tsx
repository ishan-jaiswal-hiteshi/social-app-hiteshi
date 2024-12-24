import axios from "axios";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [image, setImage] = useState<File | null>(null);
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string>("");

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };

  const handleTagsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTags(event.target.value);
  };

  const handlePost = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!image || !content) {
      toast.error("Both image and content are required.");
      return;
    }
    const formattedTags = tags
      ?.split(/[\s,]+/)
      ?.map((tag) => `#${tag?.trim()}`)
      ?.join(" ");

    const updatedContent = `${content} ${formattedTags}`;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("content", updatedContent);

    try {
      const response = await axios.post("/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        toast.success("Post Created Succesfully!!");
        console.log("Response data:", response?.data);
        redirect("/dashboard/home");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error in Creating Post:");
    }
  };
  return (
    <div className="sm:w-96">
      <div className="max-w-lg w-full space-y-8 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create a New Post
        </h2>
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
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-center text-gray-600 hover:text-gray-800"
            >
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
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
                    Click to upload an image
                  </p>
                </div>
              )}
            </label>
          </div>

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
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              #Hash Tags
            </label>
            <textarea
              id="tags"
              name="tags"
              value={tags}
              onChange={handleTagsChange}
              className="mt-1 block w-full p-3 border text-black border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Create hash tags..."
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
