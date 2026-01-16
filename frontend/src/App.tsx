import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";

const generator = rough.generator();

function createElement(
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string
) {
  return { id, x1, y1, x2, y2, type, seed: Math.floor(Math.random() * 1000) };
}

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [elements, setElements] = useState<Array<any>>([]);
  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("line");

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const context = canvas.getContext("2d")!;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    // ISSUE A FIX: Generate the rough shape ONLY when drawing
    elements.forEach(({ x1, y1, x2, y2, type, seed }) => {
      const options = {
        seed,
        stroke: "#1e1e1e",
        strokeWidth: 2,
        roughness: 0.5,
      };

      const roughElement =
        type === "line"
          ? generator.line(x1, y1, x2, y2, options)
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, options);

      roughCanvas.draw(roughElement);
    });
  }, [elements, windowSize]);

  const handleMouseDown = (event: React.MouseEvent) => {
    setDrawing(true);
    const { clientX, clientY } = event;

    // Create new element with unique ID
    const id = elements.length;
    const element = createElement(id, clientX, clientY, clientX, clientY, tool);
    setElements((prevState) => [...prevState, element]);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!drawing) return;

    const { clientX, clientY } = event;

    // ISSUE B FIX: Using functional update to avoid stale state
    setElements((prevState) => {
      const index = prevState.length - 1;
      if (index < 0) return prevState;

      const updatedElements = [...prevState];
      const { x1, y1, id, seed } = updatedElements[index];

      // Update coordinates of the element being dragged
      updatedElements[index] = {
        id,
        x1,
        y1,
        x2: clientX,
        y2: clientY,
        type: tool,
        seed,
      };

      return updatedElements;
    });
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  useEffect(() => {
    const timeoutMethod = setTimeout(() => {
      console.log(elements);
    }, 1000);
    return () => clearTimeout(timeoutMethod);
  }, [elements]);

  return (
    <div>
      <div className="toolbar">
        <div
          className={`tool-option ${tool === "line" ? "active" : ""}`}
          onClick={() => setTool("line")}
          title="Line"
        >
          <button
            className={tool === "line" ? "active" : ""}
            onClick={() => setTool("line")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="5" y1="19" x2="19" y2="5"></line>
            </svg>
          </button>
          <button
            className={tool === "rect" ? "active" : ""}
            onClick={() => setTool("rect")}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          </button>
          <div className="separator"></div>
          <button onClick={() => setElements([])} title="Clear All">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>

      <canvas
        id="canvas"
        width={windowSize.width}
        height={windowSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ backgroundColor: "#fdfdfd" }}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default App;
