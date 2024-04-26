export const COLORS: { color: string; backgroundColor: string }[] = [
  {
    backgroundColor: '#d5e6f8',
    color: '#347fe3',
  },
  {
    backgroundColor: '#fdefcb',
    color: '#ff8749',
  },
  {
    backgroundColor: '#efcdff',
    color: '#9f15dc',
  },
  {
    backgroundColor: '#ffcdce',
    color: '#f40f0e',
  },
];

export const getRandomColor = (): { color: string; backgroundColor: string } => {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
};
