const shuffle = (ansArray, question) => {
  ansArray = [...ansArray];

  let resultArray = Array(ansArray.length).fill(null);

  if (
    ansArray.some(
      (e) =>
        containsNoCase(e, `(A) و (B`) ||
        containsNoCase(e, `(أ) و (ب)`) ||
        containsNoCase(e, `A and B`) ||
        containsNoCase(e, `(A) و (C`) ||
        containsNoCase(e, `A and C`) ||
        containsNoCase(e, `كلاً من (A) و (C)`) ||
        containsNoCase(e, `جميع ما سب`) ||
        containsNoCase(e, `all of the abov`) ||
        containsNoCase(e, ` (A) و (B)`) ||
        containsNoCase(e, `ا شيء مما س`)

      // (A) و (B)
    )
  ) {
    ansArray.forEach((element, index) => {
      if (contains_A_and_B(element)) {
        resultArray[2] = element;
        ansArray = ansArray.filter((e) => e != element);
      }
      if (contains_A_and_C(element)) {
        resultArray[resultArray.length - 1] = element;
        ansArray = ansArray.filter((e) => e != element);
      }
      if (contains_All(element) && !contains_A_and_C(element)) {
        resultArray[resultArray.length - 1] = element;
        ansArray = ansArray.filter((e) => e != element);
      }
    });
    resultArray.forEach((element, index) => {
      if (element === null) {
        resultArray[index] = ansArray.shift();
      }
    });

    return resultArray;
  } else {
    for (let i = ansArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ansArray[i], ansArray[j]] = [ansArray[j], ansArray[i]];
    }

    return ansArray;
  }
};

function containsNoCase(sentence, searchText) {
  return sentence.toLowerCase().includes(searchText.toLowerCase());
}

function contains_A_and_B(element) {
  if (
    containsNoCase(element, `(A) و (B`) ||
    containsNoCase(element, `(أ) و (ب)`) ||
    containsNoCase(element, `A and B`)
  ) {
    return true;
  } else {
    return false;
  }
}

function contains_A_and_C(sentence) {
  if (
    containsNoCase(sentence, `(A) و (C`) ||
    containsNoCase(sentence, `A and C`) ||
    containsNoCase(sentence, `كلاً من (A) و (C)`)
  ) {
    return true;
  } else {
    return false;
  }
}

function contains_All(element) {
  if (
    containsNoCase(element, `جميع ما سب`) ||
    containsNoCase(element, `all of the abov`) ||
    containsNoCase(element, `ا شيء مما س`)
  ) {
    return true;
  } else {
    return false;
  }
}

export default shuffle;
