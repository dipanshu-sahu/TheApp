import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

const Gap = ({
  orientation,
  customHeight,
  type,
}: {
  orientation?: 'vertical' | 'horizontal';
  customHeight?: number;
  type?: 'xs' | 's' | 'm' | 'l';
}) => {
  const [height, setHeight] = useState(6);

  useEffect(() => {
    if (type === 'xs') {
      setHeight(4);
    }
    if (type === 's') {
      setHeight(8);
    }
    if (type === 'm') {
      setHeight(16);
    }
    if (type === 'l') {
      setHeight(24);
    }
  }, [type]);

  useEffect(() => {
    if (customHeight) {
      setHeight(customHeight);
    }
  }, [customHeight]);

  return (
    <View
      style={{
        ...(orientation === 'horizontal'
          ? { width: height }
          : { height: height }),
      }}
    />
  );
};

export default Gap;
