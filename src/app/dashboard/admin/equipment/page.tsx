import EquipmentContent from "./equipment-content";

export default function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string; status?: string }>;
}) {
  return <EquipmentContent searchParams={searchParams} />;
} 