import React, { FC } from 'react';

import { SHORTCUTS } from '../helpers/contants';

interface T {
  bgColor: string;
}

const Shortcuts: FC<T> = ({ bgColor }) => {
  return (
    <div className={`w-full ${bgColor} rounded-xl my-8 py-4 px-8 z-10`}>
      <h3 className="text-2xl">Keyboard Shortcuts:</h3>
      <ul className="mt-4">
        {SHORTCUTS.map((shortcut) => {
          return (
            <li key={shortcut.keys} className="grid grid-cols-3">
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
