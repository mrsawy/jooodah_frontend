const getLetter = (number, currentL) => {
  let letter;

  if (currentL && typeof currentL.toLowerCase === 'function') {
    var currentLang = currentL.toLowerCase();
  } else {
    var currentLang = '';
  }

  switch (number) {
    case 0:
      letter = currentLang === 'ar' ? 'أ.' : 'A.';
      break;
    case 1:
      letter = currentLang === 'ar' ? 'ب.' : 'B.';
      break;
    case 2:
      letter = currentLang === 'ar' ? 'ج.' : 'C.';
      break;
    case 3:
      letter = currentLang === 'ar' ? 'د.' : 'D.';
      break;
    case 4:
      letter = currentLang === 'ar' ? 'ه.' : 'E.';
      break;
    case 5:
      letter = currentLang === 'ar' ? 'و.' : 'F.';
      break;
    case 6:
      letter = currentLang === 'ar' ? 'ز.' : 'G.';
      break;
    case 7:
      letter = currentLang === 'ar' ? 'ح.' : 'H.';
      break;
    case 8:
      letter = currentLang === 'ar' ? 'ط.' : 'I.';
      break;
    case 9:
      letter = currentLang === 'ar' ? 'ي.' : 'J.';
      break;
    case 10:
      letter = currentLang === 'ar' ? 'ك.' : 'K.';
      break;
    case 11:
      letter = currentLang === 'ar' ? 'ل.' : 'L.';
      break;
    case 12:
      letter = currentLang === 'ar' ? 'م.' : 'M.';
      break;
    case 13:
      letter = currentLang === 'ar' ? 'ن.' : 'N.';
      break;
    case 14:
      letter = currentLang === 'ar' ? 'س.' : 'O.';
      break;
    case 15:
      letter = currentLang === 'ar' ? 'ع.' : 'P.';
      break;
    case 16:
      letter = currentLang === 'ar' ? 'ف.' : 'Q.';
      break;
    case 17:
      letter = currentLang === 'ar' ? 'ص.' : 'R.';
      break;
    case 18:
      letter = currentLang === 'ar' ? 'ق.' : 'S.';
      break;
    case 19:
      letter = currentLang === 'ar' ? 'ر.' : 'T.';
      break;
    case 20:
      letter = currentLang === 'ar' ? 'ش.' : 'U.';
      break;
    default:
      letter = currentLang === 'ar' ? 'أ.' : `A`;
      break;
  }

  return letter;
};

export default getLetter;
