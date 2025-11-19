interface ErrorTextProps {
  message: string;
}

export default function ErrorText({ message }: ErrorTextProps) {
  return <p className="text-red-500 text-sm">{message}</p>;
}
