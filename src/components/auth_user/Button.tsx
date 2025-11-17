export default function Button({ children, ...props }: any) {
  return (
    <button
      {...props}
      className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
