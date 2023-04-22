export const transformValToLabel = (value: string, data: any[]) => {
  if (!Array.isArray(data)) return '-';
  return data.find((item) => item.value === value)?.label || '-';
};
