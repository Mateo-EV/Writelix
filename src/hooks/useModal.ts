import { create } from "zustand";

type ModalData =
  | {
      type: "DeleteUploadModal";
      data: {fileId: string}
    }
  | {
      type: null;
      data: undefined;
    };

type ModalStore = {
  isOpen: boolean;
  setIsOpen: (state: boolean | ((prevState: boolean) => boolean)) => void;
  openModal: (prop: ModalData) => void;
} & ModalData;

export const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (state) => {
    if (typeof state === "boolean") return set({ isOpen: state });
    return set(({ isOpen }) => ({ isOpen: state(isOpen) }));
  },
  openModal: (props) => set({ ...props, isOpen: true }),
  type: null,
  data: undefined
}));
