import { useLocalStorage } from '@rehooks/local-storage';

export const useFtue = (key: string) => {
  const [show, setShow] = useLocalStorage('ftue.' + key, true);

  return {
    show,
    acknowledge: () => setShow(false),
  };
}