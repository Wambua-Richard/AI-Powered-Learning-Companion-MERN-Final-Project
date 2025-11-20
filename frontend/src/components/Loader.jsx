// Loader reusable component to show loading state

export default function Loader() {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  