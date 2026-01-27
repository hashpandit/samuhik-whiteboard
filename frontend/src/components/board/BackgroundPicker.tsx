import { CgScreen } from "react-icons/cg";

import { useModal } from "../../store/useModal";
import BackgroundModal from "./BackgroundModal";

const BackgroundPicker = () => {
  const { openModal } = useModal();

  return (
    <button className="btn-icon" onClick={() => openModal(<BackgroundModal />)}>
      <CgScreen />
    </button>
  );
};

export default BackgroundPicker;
