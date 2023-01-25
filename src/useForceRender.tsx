import { useState } from "react";

export const useForceRender = () => {
    const [renderCount, setRenderCount] = useState<number>(0);
    return () => setRenderCount(renderCount + 1);
};
