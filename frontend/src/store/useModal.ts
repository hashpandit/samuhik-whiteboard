import { useSetAtom } from "jotai";
import { modalAtom } from "./modal";

export const useModal = () => {
  const setModal = useSetAtom(modalAtom);

  const openModal = (modal: React.ReactNode) =>
    setModal({ modal, opened: true });

  const closeModal = () => setModal({ modal: null, opened: false });

  return { openModal, closeModal };
};
