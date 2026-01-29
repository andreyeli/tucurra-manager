export const calculateSalary = (
  hours: number,
  hourlyRate: number,
  isOvertime: boolean,
  overtimeMultiplier: number = 1.5
): number => {
  const rate = isOvertime ? hourlyRate * overtimeMultiplier : hourlyRate;
  return hours * rate;
};

export const calculateVacations = (
  accumulatedSalary: number,
  vacationPercentage: number = 0.0833
): number => {
  return accumulatedSalary * vacationPercentage;
};

export const calculateAguinaldo = (
  totalYearlyEarnings: number
): number => {
  return totalYearlyEarnings / 12;
};
