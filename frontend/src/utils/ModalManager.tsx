import { AnimatePresence, motion } from "framer-motion";
import { useAtom } from "jotai";

import Portal from "../components/ui/Portal";
import { modalAtom } from "../store/modal";

const bgAnimation = {
  closed: { opacity: 0 },
  opened: { opacity: 1 },
};

const modalAnimation = {
  closed: { y: -100 },
  opened: { y: 0 },
  exited: { y: 100 },
};

const ModalManager = () => {
  const [{ opened, modal }, setModal] = useAtom(modalAtom);

  return (
    <Portal>
      <motion.div
        className="absolute z-40 flex min-h-full w-full items-center justify-center bg-black/80"
        style={{ pointerEvents: opened ? "all" : "none" }}
        onClick={() => setModal({ modal: <></>, opened: false })}
        variants={bgAnimation}
        initial="closed"
        animate={opened ? "opened" : "closed"}
      >
        <AnimatePresence>
          {opened && (
            <motion.div
              variants={modalAnimation}
              initial="closed"
              animate="opened"
              exit="exited"
              onClick={(e) => e.stopPropagation()}
              className="p-6"
            >
              {modal}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Portal>
  );
};

export default ModalManager;
