import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { HiOutlineDownload } from "react-icons/hi";
import { ImExit } from "react-icons/im";
import { IoIosShareAlt } from "react-icons/io";

import { CANVAS_SIZE } from "../utils/constants";
import { useViewportSize } from "../store";
import { useModal } from "../store/useModal";
import { useRefs } from "../store";

import ShareModal from "./board/ShareModal";
import BackgroundPicker from "./board/BackgroundPicker";
import ColorPicker from "./board/ColorPicker";
import HistoryBtns from "./board/HistoryBtns";
import ImagePicker from "./board/ImagePicker";
import LineWidthPicker from "./board/LineWidthPicker";
import ModePicker from "./board/ModePicker";
import ShapeSelector from "./board/ShapeSelector";

const ToolBar = () => {
  const { canvasRef, bgRef } = useRefs();
  const { openModal } = useModal();
  const { width } = useViewportSize();
  const navigate = useNavigate();

  const [opened, setOpened] = useState(width >= 1024);

  useEffect(() => {
    setOpened(width >= 1024);
  }, [width]);

  const handleExit = () => navigate("/");

  const handleDownload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE.width;
    canvas.height = CANVAS_SIZE.height;

    const tempCtx = canvas.getContext("2d");

    if (tempCtx && canvasRef.current && bgRef.current) {
      tempCtx.drawImage(bgRef.current, 0, 0);
      tempCtx.drawImage(canvasRef.current, 0, 0);
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "canvas.png";
    link.click();
  };

  const handleShare = () => openModal(<ShareModal />);

  return (
    <>
      <motion.button
        className="btn-icon absolute bottom-1/2 -left-2 z-50 h-10 w-10 rounded-full bg-black text-2xl transition-none lg:hidden"
        animate={{ rotate: opened ? 0 : 180 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpened(!opened)}
      >
        <FiChevronRight />
      </motion.button>

      <motion.div
        className="absolute left-10 top-[50%] z-50 grid grid-cols-2 items-center gap-5 rounded-lg bg-zinc-900 p-5 text-white 2xl:grid-cols-1"
        animate={{
          x: opened ? 0 : -160,
          y: "-50%",
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <HistoryBtns />

        <div className="h-px w-full bg-white 2xl:hidden" />
        <div className="h-px w-full bg-white" />

        <ShapeSelector />
        <ColorPicker />
        <LineWidthPicker />
        <ModePicker />
        <ImagePicker />

        <div className="2xl:hidden"></div>
        <div className="h-px w-full bg-white 2xl:hidden" />
        <div className="h-px w-full bg-white" />

        <BackgroundPicker />
        <button className="btn-icon text-2xl" onClick={handleShare}>
          <IoIosShareAlt />
        </button>
        <button className="btn-icon text-2xl" onClick={handleDownload}>
          <HiOutlineDownload />
        </button>
        <button className="btn-icon text-xl" onClick={handleExit}>
          <ImExit />
        </button>
      </motion.div>
    </>
  );
};

export default ToolBar;
