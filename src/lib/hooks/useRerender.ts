import { useState } from 'react';

const useRerender = () => {
    const [, rerender] = useState(0);
    return () => rerender(prev => prev + 1);
};

export default useRerender;
