type InfoItemProps = {
  label: string;
  value: string;
};

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 ">
      <span className="Medium_18 text-gray-400">{label}</span>
      <span className="Medium_18 text-main-skyblue">{value}</span>
    </div>
  );
}
