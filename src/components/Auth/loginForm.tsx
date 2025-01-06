import { AuthFormProps } from "@/props/authProps";
import { MdNavigateNext } from "react-icons/md";

export default function AuthForm({
  formData,
  loading,
  error,
  isNewUser,
  emailSubmitted,
  handleInputChange,
  handleEmailSubmit,
  handleSubmit,
}: AuthFormProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && !loading) {
      event.preventDefault();
      emailSubmitted ? handleSubmit : handleEmailSubmit;
    }
  };
  return (
    <div className="flex items-center justify-center h-96 w-96">
      <form
        onSubmit={emailSubmitted ? handleSubmit : handleEmailSubmit}
        className="w-full max-w-md  p-6 rounded-lg"
      >
        <div className="flex justify-center mx-auto mb-12  ">
          <img
            className="w-auto h-12"
            src="https://hiteshi.com/_next/static/media/logo.9b8ca92c.png"
            alt="Logo"
            onDragStart={(e) => e.preventDefault()}
          />
        </div>

        {!emailSubmitted && (
          <div className="relative flex items-center mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full py-3 pl-10 text-gray-700 border-b rounded-lg focus:outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
        )}

        {emailSubmitted && isNewUser && (
          <>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                name="fullName"
                maxLength={16}
                value={formData.fullName}
                onChange={handleInputChange}
                className="block w-full py-3 pl-10 text-gray-700 border-b rounded-lg focus:outline-none"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="relative flex items-center mb-4">
              <input
                type="text"
                name="userName"
                maxLength={16}
                value={formData.userName}
                onChange={handleInputChange}
                className="block w-full py-3 pl-10 text-gray-700 border-b rounded-lg focus:outline-none"
                placeholder="Username"
                required
              />
            </div>
          </>
        )}

        {emailSubmitted && (
          <div className="relative flex items-center mb-4">
            <input
              type="text"
              name="otp"
              maxLength={6}
              value={formData.otp}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value) && value.length <= 6) {
                  handleInputChange(e);
                }
              }}
              className="block w-full py-3 pl-10 text-gray-700 border-b rounded-lg focus:outline-none"
              placeholder="Enter OTP"
              required
            />
          </div>
        )}

        {error && <p className="mb-4 text-primary-light flex">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`w-fit bg-red-500 text-white px-3 py-2 rounded-md flex items-center justify-center ${
              loading ? "opacity-75 cursor-not-allowed" : "active:bg-red-600"
            }`}
          >
            {loading ? (
              <div
                className="animate-spin inline-block w-5 h-5 border-[2px] border-current border-t-transparent text-white rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
            ) : (
              <MdNavigateNext size={24} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
