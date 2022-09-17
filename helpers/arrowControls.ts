import React from 'react';

// Checks that is possible to focus on tweet/reply above
export const arrowUpControl = (
  isActive: boolean,
  setter: React.Dispatch<React.SetStateAction<number>>,
) => {
  if (isActive) {
    setter((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return 0;
    });
  }
};

// Checks that is possible to focus on tweet/reply bellow
export const arrowDownControl = (
  isActive: boolean,
  setter: React.Dispatch<React.SetStateAction<number>>,
  count: number,
) => {
  if (isActive) {
    setter((prev) => {
      if (prev < count - 1) {
        return prev + 1;
      }
      return count - 1;
    });
  }
};
