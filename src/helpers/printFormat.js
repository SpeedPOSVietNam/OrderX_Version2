/*

Một bill có nhiều dòng, mỗi dòng cách nhau bởi ký tự xuống dòng \n
Mỗi dòng sẽ được format theo cấu trúc bên dưới, mỗi thuộc tính sẽ được cách nhau bởi 1 dấu cách

type    size 	align	value
---------------------------------------
text 	small	left	'string'
qrcode	medium	right
barcode	large	center

Diễn giải:
type: text/qrcode/barcode
size: small/medium/large
align: left/center/right
value: Chuỗi text bất kỳ

VÍ DỤ:
text medium left Waiter: Hoang Tran
=> sẽ in ra 1 dòng chữ Waiter: Hoang Tran, cỡ chữ medium, canh lề trái

*/

//#region constants - CAUTION: nếu thay đổi giá trị ở đây thì cũng cần thay đổi trong IngenicoModule.java
import moment from 'moment';
import {removeVI, DefaultOption} from 'jsrmvi';
import {toCurrency} from './utils';
import {OrderDetailCalcMode} from '../constants/global';

const NEW_LINE = '\n';
const SEPARATOR = ' ';

// type
const TEXT = 'text';
const QRCODE = 'qrcode';
const BARCODE = 'barcode';

// size
const SMALL = 'small';
const MEDIUM = 'medium';
const LARGE = 'large';

// align
const LEFT = 'left';
const CENTER = 'center';
const RIGHT = 'right';

const LINE_MAX_LENGTH_MEDIUM = 32; // 1 dòng chứa được nhiều nhất 32 ký tự MEDIUM
//#endregion

//#region utils
const rv = text =>
  removeVI(text, {ignoreCase: false, replaceSpecialCharacters: false});
const line = (type, size, align, value) => {
  const _ = SEPARATOR;
  return type + _ + size + _ + align + _ + value + NEW_LINE;
};

const separatorLine = (character = '=', length = LINE_MAX_LENGTH_MEDIUM) => {
  return line(TEXT, MEDIUM, CENTER, new Array(length).fill(character).join(''));
};

const emptyLine = () => {
  return line(TEXT, MEDIUM, CENTER, '');
};

const fillSpace = (text, space, limitInSpace = false) => {
  if (space && text.length < space) {
    return new Array(space - text.length).fill(' ').join('') + text;
  }
  return limitInSpace ? text.substring(0, space) : text;
};
//#endregion

export const prepareBillForPrinter = ({
  venueName = 'VENUE NAME',
  venueAddress = 'Venue Address',
  tableName = '#1',
  billId = '0000',
  waiterName = 'Training user',
  time = moment().format('L LT'),
  numOfCust = 1,
  items = [], // {qty, name, unitPrice, totalPrice, calcMode}
  netTotal = 0,
  taxes = [], // {name, amount}
  finalTotal = 0,
  payments = [], // {name, amount}
  referenceCode = null,
} = {}) => {
  let result = '';

  // header
  result += line(TEXT, MEDIUM, CENTER, rv(venueName.toUpperCase()));
  result += line(TEXT, MEDIUM, CENTER, rv(venueAddress));
  result += emptyLine();
  result += line(TEXT, LARGE, CENTER, `Table ${tableName}`);
  result += line(TEXT, MEDIUM, CENTER, `Bill: ${billId}`);
  // if (referenceCode != null) {
  //   result += line(TEXT, MEDIUM, CENTER, `Trans: ${referenceCode}`);
  // }
  result += line(TEXT, MEDIUM, CENTER, `Serv: ${rv(waiterName)}`);
  // result += line(TEXT, MEDIUM, CENTER, `${time}  # Cust: ${numOfCust}`);
  result += separatorLine('=');

  // items
  items.forEach(({qty, name, unitPrice, totalPrice, calcMode}) => {
    if (calcMode === OrderDetailCalcMode.Void) {
      return;
    }
    let _unitPrice = fillSpace(toCurrency(unitPrice, '.', false), 11);
    let _totalPrice = fillSpace(toCurrency(totalPrice, '.', false), 11);

    result += line(TEXT, MEDIUM, LEFT, rv(name));
    result += line(TEXT, MEDIUM, RIGHT, `${qty} ${_unitPrice} ${_totalPrice}`);
  });
  result += separatorLine('=');

  // taxes, total cost
  result += line(
    TEXT,
    MEDIUM,
    RIGHT,
    `Net: ${fillSpace(toCurrency(netTotal, '.', false), 15)}`,
  );
  taxes.forEach(({name, amount}) => {
    result += line(
      TEXT,
      MEDIUM,
      RIGHT,
      `${name}: ${fillSpace(toCurrency(amount, '.', false), 15)}`,
    );
  });
  result += line(
    TEXT,
    MEDIUM,
    RIGHT,
    `TOTAL: ${toCurrency(finalTotal, '.', false)}`,
  );
  result += separatorLine('=');

  // payments
  payments.forEach(({name, amount}) => {
    result += line(
      TEXT,
      MEDIUM,
      RIGHT,
      `${name}: ${fillSpace(toCurrency(amount, '.', false), 15)}`,
    );
  });

  // footer
  result += emptyLine();
  result += line(TEXT, MEDIUM, CENTER, '- Thank You -');

  return result;
};
