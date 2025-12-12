export interface NavItem {
  id: string;
  url: string;
  title: string;
  timestamp: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, title: string) => void;
}
