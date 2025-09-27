export const initialQuestions = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by your thoughts?",
    options: [
      { value: "never", label: "Never" },
      { value: "rarely", label: "Rarely" },
      { value: "sometimes", label: "Sometimes" },
      { value: "often", label: "Often" },
      { value: "always", label: "Always" }
    ]
  },
  {
    id: 2,
    question: "How would you rate your current stress level?",
    options: [
      { value: "very_low", label: "Very Low" },
      { value: "low", label: "Low" },
      { value: "moderate", label: "Moderate" },
      { value: "high", label: "High" },
      { value: "very_high", label: "Very High" }
    ]
  },
  {
    id: 3,
    question: "How well do you sleep at night?",
    options: [
      { value: "excellent", label: "Excellent" },
      { value: "good", label: "Good" },
      { value: "fair", label: "Fair" },
      { value: "poor", label: "Poor" },
      { value: "very_poor", label: "Very Poor" }
    ]
  },
  {
    id: 4,
    question: "How often do you engage in social activities?",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "rarely", label: "Rarely" },
      { value: "never", label: "Never" }
    ]
  },
  {
    id: 5,
    question: "How would you describe your current mood?",
    options: [
      { value: "very_positive", label: "Very Positive" },
      { value: "positive", label: "Positive" },
      { value: "neutral", label: "Neutral" },
      { value: "negative", label: "Negative" },
      { value: "very_negative", label: "Very Negative" }
    ]
  }
];

export const followUpTests = {
  high_stress: [
    {
      id: 6,
      question: "What triggers your stress the most?",
      options: [
        { value: "work", label: "Work/Studies" },
        { value: "relationships", label: "Relationships" },
        { value: "finances", label: "Financial Issues" },
        { value: "health", label: "Health Concerns" },
        { value: "future", label: "Future Uncertainty" }
      ]
    },
    {
      id: 7,
      question: "How do you usually cope with stress?",
      options: [
        { value: "exercise", label: "Exercise" },
        { value: "meditation", label: "Meditation/Breathing" },
        { value: "social", label: "Talk to someone" },
        { value: "avoidance", label: "Avoid the situation" },
        { value: "unhealthy", label: "Unhealthy habits" }
      ]
    }
  ],
  sleep_issues: [
    {
      id: 8,
      question: "What time do you usually go to bed?",
      options: [
        { value: "before_10", label: "Before 10 PM" },
        { value: "10_11", label: "10-11 PM" },
        { value: "11_12", label: "11 PM - 12 AM" },
        { value: "after_12", label: "After 12 AM" },
        { value: "irregular", label: "Irregular schedule" }
      ]
    },
    {
      id: 9,
      question: "How many hours of sleep do you usually get?",
      options: [
        { value: "less_5", label: "Less than 5 hours" },
        { value: "5_6", label: "5-6 hours" },
        { value: "6_7", label: "6-7 hours" },
        { value: "7_8", label: "7-8 hours" },
        { value: "more_8", label: "More than 8 hours" }
      ]
    }
  ],
  low_mood: [
    {
      id: 10,
      question: "How long have you been feeling this way?",
      options: [
        { value: "few_days", label: "A few days" },
        { value: "week", label: "About a week" },
        { value: "month", label: "About a month" },
        { value: "months", label: "Several months" },
        { value: "long_time", label: "A very long time" }
      ]
    },
    {
      id: 11,
      question: "Do you have someone to talk to about your feelings?",
      options: [
        { value: "yes_family", label: "Yes, family members" },
        { value: "yes_friends", label: "Yes, close friends" },
        { value: "yes_professional", label: "Yes, a professional" },
        { value: "sometimes", label: "Sometimes" },
        { value: "no", label: "No, I don't" }
      ]
    }
  ]
};