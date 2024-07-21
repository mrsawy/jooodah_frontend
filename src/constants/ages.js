// Function to generate an array of experiences
const generateExperience = (() => {
  let exp = [];
  for (let i = 0; i < 41; i++) {
    exp.push({ key: i, text: i, value: i });
  }
  exp.push({ key: `+40`, text: `+40`, value: `+40` });

  return exp;
})();

// Function to generate an array of ages
const generateAges = (() => {
  let ages = [];
  for (let i = 18; i <= 66; i++) {
    ages.push({ key: i, text: i, value: i });
  }
  return ages;
})();

// highest level of education

let eduLevels = [
  "Preparatory -  إعدادية",
  "Secondary -  ثانوية",
  "Diploma -  دبلومة",
  "Bachelor's Degree - درجة بكالوريوس",
  "Master's Degree - درجة ماجستير",
  "Doctorate (PhD) -  دكتوراه",
].map((i) => ({ key: i, text: i, value: i }));

// بكالوريوس - ماجستير - دكتوراه

// Exporting the functions
export { generateExperience as experiences, generateAges as ages, eduLevels };
