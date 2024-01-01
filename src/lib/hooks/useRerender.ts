import { useState } from 'react';

export default function useRerender() {
    const [, rerender] = useState(0);
    return () => rerender(prev => prev + 1);
}
