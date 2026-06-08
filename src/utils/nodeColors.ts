// TODO: Define node color configuration
export const nodeColorScheme = {
  // TODO: Add color mappings for different node types
  default: '#3b82f6',
  // TODO: Add more color definitions
};

// TODO: Define color utility functions
export const getNodeColor = (nodeType: string): string => {
  // TODO: Implement node color selection logic
  return nodeColorScheme.default;
};

export const getNodeBorderColor = (nodeType: string, isSelected?: boolean): string => {
  // TODO: Implement border color logic
  // TODO: Handle selection state
  return '#1e40af';
};

export const getNodeTextColor = (nodeType: string): string => {
  // TODO: Implement text color logic for contrast
  return '#ffffff';
};
