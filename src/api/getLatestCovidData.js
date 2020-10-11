import axios from 'axios';
import * as HTMLParser from 'node-html-parser';

export default async () => {
  let result = {};
  try {
    result = await axios.get(
      'https://api.allorigins.win/get?url=' +
        encodeURIComponent('https://www.worldometers.info/coronavirus/'),
      {
        timeout: 10000,
      },
    );
  } catch (error) {
    throw new Error(
      'Could not reach latest data. You may not have internet connection.',
    );
  }

  try {
    const converToNumber = str => {
      let number = '';

      for (let i = 0; i < str.length; i++) {
        if (!isNaN(str[i])) {
          number += str[i];
        }
      }

      return Number(number);
    };

    let root = HTMLParser.parse(result.data.contents);
    let texts = root.querySelectorAll('.maincounter-number');

    let totalConfirmed = texts[0].childNodes[1].childNodes[0].text;
    let totalDeath = texts[1].childNodes[1].childNodes[0].text;
    let totalRecovered = texts[2].childNodes[1].childNodes[0].text;

    totalConfirmed = converToNumber(totalConfirmed);
    totalDeath = converToNumber(totalDeath);
    totalRecovered = converToNumber(totalRecovered);

    return {
      confirmed: totalConfirmed,
      deaths: totalDeath,
      recovered: totalRecovered,
    };
  } catch (error) {
    throw new Error('Error while parsing data. The problem will be fixed soon');
  }
};
