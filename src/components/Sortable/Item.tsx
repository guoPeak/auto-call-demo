import React from 'react';
import { sortable } from 'react-sortable';

const Item: React.FC = ({ children, ...props }) => {
  return <li {...props}>{children}</li>;
};

export default sortable(Item);
