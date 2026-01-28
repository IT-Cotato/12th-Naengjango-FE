export type FreezeItem = {
  id: number;
  image: string;
  title: string;
  price: number;
  remainingHour: number;
  checked: boolean;
  selectedAppId: string | null;
};
