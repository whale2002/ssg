import { useState } from "react";
import React from 'react'

export function Layout(): React.FC {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>This is Layout Component</h1>
      <div>
        {count}
        <button onClick={() => setCount(count + 1)}>Add Count</button>
      </div>
    </div>
  );
}