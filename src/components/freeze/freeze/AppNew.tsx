export default function AppNew({ name }: { name: string }) {
  return (
    <div
      data-layer="application"
      className="size-[54px] px-3.5 py-[7px] bg-sub-skyblue rounded-lg inline-flex flex-col items-center justify-center overflow-hidden"
    >
      <div
        data-layer="name"
        className="
          w-full
          text-center
          text-gray-800
          text-sm
          font-bold
          font-sans
          leading-5
          tracking-tight
          line-clamp-2
        "
        title={name}
      >
        {name}
      </div>
    </div>
  );
}
