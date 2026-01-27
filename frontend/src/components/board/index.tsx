import Canvas from "./Canvas";
import MousePosition from "./MousePosition";
import MousesRenderer from "./MousesRenderer";
import MoveImage from "./MouseImage";
import SelectionBtns from "./SelectionBtns";

const Board = () => (
  <>
    <Canvas />
    <MousePosition />
    <MousesRenderer />
    <MoveImage />
    <SelectionBtns />
  </>
);

export default Board;
