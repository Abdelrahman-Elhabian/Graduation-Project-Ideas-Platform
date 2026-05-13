/**
 * Utility Helper Functions
 */

/**
 * Format a Firestore timestamp or Date to a readable string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';

  let date;
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp);
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const timeAgo = (timestamp) => {
  if (!timestamp) return '';

  let date;
  if (timestamp?.toDate) {
    date = timestamp.toDate();
  } else if (timestamp?.seconds) {
    date = new Date(timestamp.seconds * 1000);
  } else {
    date = new Date(timestamp);
  }

  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Get initials from a name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

/**
 * Available technologies for project ideas
 */
export const TECHNOLOGIES = [
  'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express.js',
  'Python', 'Django', 'Flask', 'FastAPI',
  'Java', 'Spring Boot', 'Kotlin',
  'C#', '.NET', 'ASP.NET',
  'PHP', 'Laravel',
  'Ruby on Rails',
  'Go', 'Rust',
  'Flutter', 'React Native', 'Swift', 'Kotlin Multiplatform',
  'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes',
  'TensorFlow', 'PyTorch', 'OpenAI API',
  'GraphQL', 'REST API', 'WebSocket',
  'Blockchain', 'Solidity', 'Web3',
  'Unity', 'Unreal Engine',
  'Arduino', 'Raspberry Pi', 'IoT'
];

/**
 * Difficulty levels for project ideas
 */
export const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: '#10B981' },
  { value: 'intermediate', label: 'Intermediate', color: '#F59E0B' },
  { value: 'advanced', label: 'Advanced', color: '#EF4444' },
  { value: 'expert', label: 'Expert', color: '#7C3AED' }
];

/**
 * Get color for difficulty level
 */
export const getDifficultyColor = (difficulty) => {
  const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty);
  return level ? level.color : '#94A3B8';
};

/**
 * Get label for difficulty level
 */
export const getDifficultyLabel = (difficulty) => {
  const level = DIFFICULTY_LEVELS.find(l => l.value === difficulty);
  return level ? level.label : difficulty;
};

/**
 * Categories for project ideas
 */
export const CATEGORIES = [
  { value: 'business', label: 'Business', color: '#7C3AED', icon: '💼' },
  { value: 'medical', label: 'Medical', color: '#EF4444', icon: '🏥' },
  { value: 'sports', label: 'Sports & Fitness', color: '#F59E0B', icon: '⚽' },
  { value: 'healthcare', label: 'Healthcare', color: '#10B981', icon: '❤️' },
  { value: 'agriculture', label: 'Agriculture', color: '#84CC16', icon: '🌱' },
  { value: 'education', label: 'Education', color: '#06B6D4', icon: '📚' },
  { value: 'industry', label: 'Industry', color: '#F97316', icon: '🏭' },
  { value: 'other', label: 'Other', color: '#94A3B8', icon: '📌' }
];

/**
 * Get color for category
 */
export const getCategoryColor = (category) => {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.color : '#94A3B8';
};

/**
 * Get label for category
 */
export const getCategoryLabel = (category) => {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.label : category;
};

/**
 * Get icon for category
 */
export const getCategoryIcon = (category) => {
  const cat = CATEGORIES.find(c => c.value === category);
  return cat ? cat.icon : '💡';
};
