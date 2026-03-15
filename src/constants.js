export const COLORS = {
  bg: '#0a0f1e',
  skyTop: '#87CEEB',
  skyMid: '#b8e4f7',
  skyBottom: '#d4f0a0',
  gold: '#f5c842',
  goldDark: '#e0a820',
  green: '#6fcf97',
  greenDark: '#27ae60',
  red: '#eb5757',
  blue: '#56ccf2',
  purple: '#bc80bd',
  health: '#fc8d59',
  text: '#ffffff',
  textSecondary: '#a0aec0',
  hudBg: 'rgba(12,18,28,0.95)',
  cardBgStart: '#0f1a2e',
  cardBgEnd: '#0a1020',
  groundBase: '#5a8a3a',
  groundLight: '#6aaa45',
  groundDark: '#4a7a2a',
  groundDarker: '#4a8a3a',
  road: '#7a7a8a',
  roadMarking: 'rgba(255,255,220,0.7)',
  sidewalk: '#c8b89a',
  shadow: 'rgba(20,30,10,0.25)',
  buildingWhite: '#f5f0e8',
  buildingCream: '#e8dfc8',
};

export const GRID = {
  tileWidth: 64,
  tileHeight: 32,
  gridSize: 20,
};

export const BUILDINGS = [
  { id: 'home', name: 'Home', gridCol: 3, gridRow: 12, tileW: 2, tileD: 2, height: 40, wallColor: '#e8dfc8', roofColor: '#c0392b', accentColor: '#7EC8A4', type: 'peaked' },
  { id: 'workplace', name: 'Workplace', gridCol: 13, gridRow: 3, tileW: 3, tileD: 2, height: 80, wallColor: '#d4e8f8', roofColor: '#4a6fa5', accentColor: '#6BAED6', type: 'flat' },
  { id: 'bank', name: 'Bank', gridCol: 14, gridRow: 12, tileW: 3, tileD: 3, height: 55, wallColor: '#f5f0e8', roofColor: '#8a7a5a', accentColor: '#f5c842', type: 'flat' },
  { id: 'gym', name: 'Gym', gridCol: 4, gridRow: 4, tileW: 2, tileD: 2, height: 45, wallColor: '#e8f0f8', roofColor: '#2c3e50', accentColor: '#FC8D59', type: 'flat' },
  { id: 'bar', name: 'Bar', gridCol: 10, gridRow: 14, tileW: 2, tileD: 2, height: 38, wallColor: '#e8d5c0', roofColor: '#5a3a2a', accentColor: '#BC80BD', type: 'flat' },
  { id: 'casino', name: 'Casino', gridCol: 16, gridRow: 16, tileW: 3, tileD: 2, height: 60, wallColor: '#1a1a3a', roofColor: '#2d2d5a', accentColor: '#f5c842', type: 'flat' },
  { id: 'hospital', name: 'Hospital', gridCol: 7, gridRow: 2, tileW: 3, tileD: 2, height: 60, wallColor: '#f8f8f8', roofColor: '#d0d0d8', accentColor: '#eb5757', type: 'flat' },
  { id: 'park', name: 'Park', gridCol: 10, gridRow: 9, tileW: 3, tileD: 3, height: 0, wallColor: '#6aba50', roofColor: '#78ca5a', accentColor: '#6fcf97', type: 'park' },
  { id: 'friends', name: 'Friends House', gridCol: 2, gridRow: 16, tileW: 2, tileD: 2, height: 40, wallColor: '#dde8d0', roofColor: '#4a7a4a', accentColor: '#56ccf2', type: 'peaked' },
];

export const TREE_POSITIONS = [
  { col: 1, row: 3, scale: 0.8, type: 'round' },
  { col: 5, row: 7, scale: 1.0, type: 'oak' },
  { col: 7, row: 8, scale: 1.2, type: 'round' },
  { col: 0, row: 10, scale: 0.8, type: 'pine' },
  { col: 18, row: 4, scale: 1.0, type: 'pine' },
  { col: 17, row: 8, scale: 1.2, type: 'oak' },
  { col: 4, row: 18, scale: 0.8, type: 'round' },
  { col: 8, row: 17, scale: 1.0, type: 'oak' },
  { col: 19, row: 13, scale: 1.2, type: 'round' },
  { col: 1, row: 7, scale: 0.8, type: 'pine' },
  { col: 16, row: 2, scale: 1.0, type: 'round' },
  { col: 12, row: 19, scale: 1.0, type: 'pine' },
  { col: 3, row: 1, scale: 0.9, type: 'oak' },
  { col: 19, row: 18, scale: 1.1, type: 'round' },
  { col: 6, row: 14, scale: 0.9, type: 'pine' },
];

export const BUSH_POSITIONS = [
  { col: 2, row: 4, scale: 0.5 },
  { col: 6, row: 6, scale: 0.6 },
  { col: 0.5, row: 8, scale: 0.4 },
  { col: 17, row: 5, scale: 0.5 },
  { col: 18, row: 9, scale: 0.6 },
  { col: 3, row: 19, scale: 0.5 },
  { col: 15, row: 1, scale: 0.4 },
  { col: 7, row: 16, scale: 0.5 },
  { col: 19, row: 15, scale: 0.6 },
  { col: 1, row: 14, scale: 0.5 },
];

export const AVATARS = [
  { skinTone: '#FDBCB4', hairColor: '#5a3825', shirtColor: '#3a86ff' },
  { skinTone: '#C68642', hairColor: '#1a1a1a', shirtColor: '#ff6b6b' },
  { skinTone: '#8D5524', hairColor: '#1a1a1a', shirtColor: '#06d6a0' },
  { skinTone: '#FDDBB4', hairColor: '#c4883a', shirtColor: '#f72585' },
];

export const DECAY = {
  finances: -5,
  health: -3,
  mental: -4,
  relationships: -5,
};

export const STARTING_STATS = {
  finances: 30,
  health: 70,
  mental: 65,
  relationships: 50,
};

export const ACTIONS_PER_MONTH = 4;
