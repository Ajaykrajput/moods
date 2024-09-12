import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export function ModalDialog({ children, isOpen, onClose }) {
  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 duration-300 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-w-lg rounded-xl space-y-4 bg-white p-10 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
