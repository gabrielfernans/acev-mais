export const GRADIENTS: { backgroundColor: string; backgroundImage: string }[] = [
  {
    backgroundColor: '#0093E9',
    backgroundImage: 'linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)',
  },
  {
    backgroundColor: '#8EC5FC',
    backgroundImage: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
  },
  {
    backgroundColor: '#85FFBD',
    backgroundImage: 'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)',
  },
  {
    backgroundColor: '#8BC6EC',
    backgroundImage: 'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)',
  },
  {
    backgroundColor: '#FF9A8B',
    backgroundImage: 'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
  },
  {
    backgroundColor: '#FFDEE9',
    backgroundImage: 'linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%)',
  },
  {
    backgroundColor: '#08AEEA',
    backgroundImage: 'linear-gradient(0deg, #08AEEA 0%, #2AF598 100%)',
  },
  {
    backgroundColor: '#FF3CAC',
    backgroundImage: 'linear-gradient(225deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)',
  },
  {
    backgroundColor: '#74EBD5',
    backgroundImage: 'linear-gradient(90deg, #74EBD5 0%, #9FACE6 100%)',
  },
];

export const getRandomGradient = (): { backgroundColor: string; backgroundImage: string } => {
  const randomIndex = Math.floor(Math.random() * GRADIENTS.length);
  return GRADIENTS[randomIndex];
};
