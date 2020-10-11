export default class Formatter {
  static numberThousandSeperator = number => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  };

  // static dateFormatter
}
