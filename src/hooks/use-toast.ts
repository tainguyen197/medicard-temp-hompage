export function useToast() {
  const toast = ({
    title,
    description,
    variant,
  }: {
    title: string;
    description?: string;
    variant?: "default" | "destructive";
  }) => {
    const message = description ? `${title}: ${description}` : title;
    alert(message);
  };

  return { toast };
}
