export const calculateNutritionTotals = (foods) => {
  return foods.reduce((acc, food) => ({
    totalCalories: acc.totalCalories + (food.calories || 0),
    totalProtein: acc.totalProtein + (food.protein || 0),
    totalCarbs: acc.totalCarbs + (food.carbs || 0),
    totalFat: acc.totalFat + (food.fat || 0)
  }), { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 });
};

export const calculateWorkoutCalories = (duration, category, weight = 70) => {
  const MET = {
    Strength: 5,
    Cardio: 8,
    Flexibility: 3,
    HIIT: 10,
    Yoga: 3,
    Sports: 7,
    Other: 5
  };
  return Math.round((MET[category] || 5) * weight * (duration / 60));
};

export const calculateProgressDelta = (current, previous) => {
  if (!previous) return null;
  return {
    weight: current.weight - previous.weight,
    bodyFat: current.bodyFat - previous.bodyFat
  };
};