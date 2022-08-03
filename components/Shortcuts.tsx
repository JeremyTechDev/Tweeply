import React from 'react';

import { SHORTCUTS } from '../helpers/contants';

const Shortcuts = () => {
  return (
    <div className="w-full bg-gray-700 rounded-xl my-8 py-4 px-8 z-10">
      <h3 className="text-2xl">Keyboard Shortcuts:</h3>
      <ul className="mt-4">
        {SHORTCUTS.map((shortcut) => {
          return (
            <li key={shortcut.keys} className="grid grid-cols-4">
              <span>🎯 {shortcut.displayKeys}:</span>
              <span>{shortcut.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Shortcuts;
