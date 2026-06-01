import { Card } from "@/components/ui/card";

type Props = { message: string };

export default function ErrorAlert({ message }: Props) {
  if (!message) return null;
  return (
    <Card role="alert" className="border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
      {message}
    </Card>
  );
}


