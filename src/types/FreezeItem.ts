export type FreezeItem = {
  id: number;
  image: string;
  title: string;
  price: number;
  remainingSeconds: number;
  checked: boolean;
  selectedAppId: string | null;
};
