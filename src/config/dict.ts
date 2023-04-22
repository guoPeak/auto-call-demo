interface labelType {
  label: string;
  value: number | string;
}

export const BOT_STATUS: labelType[] = [
  {
    label: '待发布',
    value: 0,
  },
  {
    label: '审核中',
    value: 1,
  },
  {
    label: '已发布',
    value: 2,
  },
];

export const BOT_RANAGE: labelType[] = [
  {
    label: '全部（全公司的）',
    value: 0,
  },
  {
    label: '我负责的',
    value: 1,
  },
  {
    label: '所属或下属部门的',
    value: 2,
  },
];

export const INDUSTRY: labelType[] = [
  {
    label: '养老行业',
    value: 0,
  },
  {
    label: '服务业',
    value: 1,
  },
  {
    label: '医疗健康',
    value: 2,
  },
];
