import {COLORS} from '../../constants/theme';

export const HOOK_TABLE = [
  {
    id: 1,
    tableID: 3,
    tableStatus: 'Occupied',
    colorStatus: COLORS.TableStatusRed,
    paidStatus: false,
  },
  {
    id: 2,
    tableID: 31,
    tableStatus: 'Empty',
    colorStatus: COLORS.TableStatusBlue,
    paidStatus: false,
  },
  {
    id: 3,
    tableID: 33,
    tableStatus: 'Done Soon',
    colorStatus: COLORS.TableStatusGreen,
    paidStatus: false,
  },
  {
    id: 4,
    tableID: 34,
    tableStatus: 'Occupied',
    colorStatus: COLORS.TableStatusRed,
    paidStatus: true,
  },
  {
    id: 5,
    tableID: 35,
    tableStatus: 'Open',
    colorStatus: COLORS.TableStatusYellow,
    paidStatus: false,
  },
  {
    id: 6,
    tableID: 36,
    tableStatus: 'Open',
    colorStatus: COLORS.TableStatusRed,
    paidStatus: false,
  },
];
