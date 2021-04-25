import React, { useState } from 'react';

export default function Example() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full px-8 absolute top-6">
      <div className="flex justify-center items-center">
        <p className="px-2">You clicked {count} times.</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setCount(count + 1)}>
          Click me!
      </button>
      </div>
    </div>
  );
}
