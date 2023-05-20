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


export const INTENT_TAG: labelType[] = [
  {
    label: 'A级(有明确意向)',
    value: 0,
  },
  {
    label: 'B级(可能有意向)',
    value: 1,
  },
  {
    label: 'C级(明确拒绝)',
    value: 2,
  },
  {
    label: 'D级(用户忙)',
    value: 3,
  },
  {
    label: 'E级(拨打失败)',
    value: 4,
  },
  {
    label: 'F级(无效客户)',
    value: 5,
  },
]