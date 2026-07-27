// ========== MOTIVATIONAL QUOTES ==========
const motivationalQuotes = [
    "You are stronger than you know. 💪",
    "Every day is a new opportunity to nurture yourself. 🌸",
    "Your body is doing amazing things. Be kind to it. ❤️",
    "Trust the process and trust yourself. ✨",
    "You're creating life. That's a superpower! 🦸‍♀️",
    "Rest when you need to. Your health matters. 🛌",
    "Listen to your body - it knows what it needs. 🧘‍♀️",
    "You're doing an incredible job! Keep going. 🌟",
    "Self-care isn't selfish, it's essential. 💝",
    "Your journey is unique and beautiful. 🌈",
    "Embrace the changes, you're growing life. 🌱",
    "One day at a time, one breath at a time. 🌬️",
    "You are enough, exactly as you are. ✨",
    "Celebrate the small victories. 🎉",
    "Your body knows how to do this. Trust it. 🙏"
];

// ========== PARENTING BOOKS ==========
const parentingBooks = [
    {
        title: "What to Expect When You're Expecting",
        author: "Heidi Murkoff",
        description: "The ultimate week-by-week pregnancy guide with expert advice.",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        title: "The Whole-Brain Child",
        author: "Daniel J. Siegel & Tina Payne Bryson",
        description: "Revolutionary strategies to nurture your child's developing mind.",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        title: "Ina May's Guide to Childbirth",
        author: "Ina May Gaskin",
        description: "Inspiring stories and practical advice for natural childbirth.",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        title: "The Fourth Trimester",
        author: "Kimberly Ann Johnson",
        description: "Understanding and supporting your postpartum body and mind.",
        rating: "⭐⭐⭐⭐"
    },
    {
        title: "Expecting Better",
        author: "Emily Oster",
        description: "Making informed decisions during pregnancy with real data.",
        rating: "⭐⭐⭐⭐⭐"
    },
    {
        title: "The Mama Natural Week-by-Week Guide",
        author: "Genevieve Howland",
        description: "Natural pregnancy and childbirth with modern science.",
        rating: "⭐⭐⭐⭐"
    },
    {
        title: "Bringing Up Bébé",
        author: "Pamela Druckerman",
        description: "One American mother discovers the wisdom of French parenting.",
        rating: "⭐⭐⭐⭐"
    },
    {
        title: "The Happiest Baby on the Block",
        author: "Harvey Karp",
        description: "The new way to calm crying and help your baby sleep.",
        rating: "⭐⭐⭐⭐⭐"
    }
];

// ========== SUPPORT GROUPS ==========
// Real, well-known organizations only - no invented communities or contact info.
const supportGroups = [
    {
        name: "Postpartum Support International",
        description: "Pregnancy and postpartum mental health support, including a free helpline and local coordinators worldwide.",
        phone: "1-800-944-4773",
        url: "https://www.postpartum.net"
    },
    {
        name: "La Leche League International",
        description: "Mother-to-mother breastfeeding support, with local groups and leaders around the world.",
        url: "https://llli.org"
    },
    {
        name: "What to Expect Community",
        description: "Free peer forums grouped by due date and stage - pregnancy, postpartum, and early parenting.",
        url: "https://forums.whattoexpect.com"
    },
    {
        name: "BabyCenter Community",
        description: "Large parenting community with birth-month groups and topic-based discussion boards.",
        url: "https://community.babycenter.com"
    },
    {
        name: "March of Dimes",
        description: "Pregnancy health education and support resources, including a NICU family support network.",
        url: "https://www.marchofdimes.org"
    }
];

// ========== DIET PLANS BY PHASE ==========
const dietPlans = {
    menstrual: [
        "Iron-rich foods (spinach, lentils, lean red meat)",
        "Omega-3 fatty acids (salmon, walnuts, chia seeds)",
        "Dark chocolate (70%+ cocoa) in moderation",
        "Ginger tea for cramping relief",
        "Plenty of water and herbal teas",
        "Warm soups and broths",
        "Leafy greens to replenish iron"
    ],
    follicular: [
        "Lean proteins (chicken, fish, tofu, eggs)",
        "Fresh fruits and vegetables",
        "Whole grains (quinoa, brown rice, oats)",
        "Probiotics (yogurt, kefir, kimchi)",
        "Green smoothies with berries",
        "Nuts and seeds",
        "Legumes and beans"
    ],
    ovulation: [
        "Antioxidant-rich foods (berries, dark leafy greens)",
        "Raw vegetables with hummus",
        "Fiber-rich foods (whole grains, vegetables)",
        "Healthy fats (avocado, olive oil, nuts)",
        "Lots of water for hydration",
        "Colorful fruits",
        "Wild-caught fish"
    ],
    luteal: [
        "Complex carbohydrates (sweet potato, quinoa, oats)",
        "Magnesium-rich foods (bananas, almonds, dark chocolate)",
        "Calcium sources (dairy, fortified foods, leafy greens)",
        "Reduce caffeine and processed foods",
        "Herbal teas (chamomile, peppermint)",
        "Roasted vegetables",
        "Pumpkin seeds"
    ],
    pregnancy_first: [
        "Folic acid rich foods (leafy greens, citrus, beans)",
        "Small, frequent meals to combat nausea",
        "Ginger tea or candies for morning sickness",
        "Crackers and bland foods if nauseous",
        "Plenty of water throughout the day",
        "Prenatal vitamins as prescribed",
        "Whole grains for sustained energy",
        "Avoid raw fish, unpasteurized dairy"
    ],
    pregnancy_second: [
        "Calcium-rich foods (dairy, fortified soy, sardines)",
        "Iron sources (lean meat, beans, fortified cereals)",
        "Omega-3 DHA (fatty fish, walnuts, flaxseeds)",
        "Colorful fruits and vegetables daily",
        "Healthy snacks (nuts, fruits, yogurt)",
        "Protein with every meal",
        "Whole grain carbohydrates",
        "Vitamin C for iron absorption"
    ],
    pregnancy_third: [
        "Small, frequent meals to avoid heartburn",
        "High-fiber foods to prevent constipation",
        "Protein for baby's rapid growth",
        "Healthy fats for brain development",
        "Stay well-hydrated (8-10 glasses water)",
        "Foods rich in vitamin K (broccoli, kale)",
        "Complex carbs for sustained energy",
        "Dates (may help with labor preparation)"
    ]
};

// ========== FOODS TO AVOID ==========
const foodsToAvoid = {
    pregnancy_first: [
        "Raw or undercooked meat and eggs",
        "Unpasteurized dairy products",
        "Raw fish and high-mercury fish",
        "Unwashed fruits and vegetables",
        "Excessive caffeine (limit to 200mg/day)"
    ],
    pregnancy_second: [
        "High-mercury fish (shark, swordfish)",
        "Raw sprouts",
        "Unpasteurized juices",
        "Deli meats unless heated",
        "Excessive vitamin A"
    ],
    pregnancy_third: [
        "Spicy foods if experiencing heartburn",
        "Large meals (eat smaller portions)",
        "Foods that cause gas",
        "Excessive salt",
        "Carbonated drinks"
    ]
};

// ========== ESSENTIAL NUTRIENTS ==========
const essentialNutrients = {
    menstrual: [
        "Iron: 18mg daily",
        "Vitamin B6: Reduces PMS symptoms",
        "Magnesium: Helps with cramps",
        "Omega-3: Anti-inflammatory"
    ],
    follicular: [
        "Vitamin E: Supports follicle development",
        "B-Vitamins: Energy production",
        "Zinc: Reproductive health",
        "Vitamin C: Immune support"
    ],
    ovulation: [
        "Vitamin B12: Energy",
        "Folate: Reproductive health",
        "Selenium: Antioxidant",
        "Vitamin D: Hormonal balance"
    ],
    luteal: [
        "Magnesium: 400mg daily",
        "Vitamin B6: Mood support",
        "Calcium: Reduces PMS",
        "Complex carbs: Serotonin boost"
    ],
    pregnancy_first: [
        "Folic acid: 400-600mcg daily",
        "Iron: 27mg daily",
        "Calcium: 1000mg daily",
        "Vitamin D: 600 IU daily",
        "DHA: 200-300mg daily"
    ],
    pregnancy_second: [
        "Iron: 27mg daily (very important)",
        "Calcium: 1000mg daily",
        "Protein: 70-100g daily",
        "Omega-3 DHA: 300mg daily",
        "Vitamin C: 85mg daily"
    ],
    pregnancy_third: [
        "Protein: 100g daily",
        "Calcium: 1000mg daily",
        "Iron: 27mg daily",
        "Fiber: 25-30g daily",
        "Vitamin K: For blood clotting"
    ]
};

// ========== EXERCISE PLANS ==========
const exercisePlans = {
    menstrual: [
        "Light walking (20-30 minutes)",
        "Gentle yoga or stretching",
        "Rest when needed - listen to your body",
        "Avoid intense workouts if experiencing cramps",
        "Swimming (if comfortable)"
    ],
    follicular: [
        "Cardio exercises (running, cycling)",
        "Strength training",
        "High-intensity interval training (HIIT)",
        "Dance or aerobics classes",
        "30-45 minutes daily activity"
    ],
    ovulation: [
        "Peak performance activities",
        "Group fitness classes",
        "Running or intense cardio",
        "Strength training with heavier weights",
        "Sports activities"
    ],
    luteal: [
        "Moderate cardio (brisk walking)",
        "Pilates or barre classes",
        "Swimming",
        "Yoga for relaxation",
        "Gentle strength training"
    ],
    pregnancy_first: [
        "Gentle walking (15-20 minutes)",
        "Prenatal yoga",
        "Swimming (excellent low-impact option)",
        "Pelvic floor exercises (Kegels)",
        "Avoid overexertion and overheating"
    ],
    pregnancy_second: [
        "Moderate walking (30 minutes daily)",
        "Prenatal yoga or Pilates",
        "Swimming and water aerobics",
        "Stationary cycling",
        "Modified strength training",
        "Kegel exercises daily"
    ],
    pregnancy_third: [
        "Short, frequent walks",
        "Prenatal yoga (modified poses)",
        "Pelvic floor and perineal massage",
        "Breathing and relaxation exercises",
        "Gentle stretching",
        "Rest frequently - avoid exhaustion"
    ]
};

// ========== SAMPLE MEAL PLANS ==========
const sampleMealPlans = {
    menstrual: {
        "Breakfast": "Warm oatmeal with cinnamon, banana, and flaxseed",
        "Mid-Morning": "Dark chocolate square with a handful of walnuts",
        "Lunch": "Lentil soup with spinach and whole grain bread",
        "Afternoon": "Ginger tea with a few dates",
        "Dinner": "Grilled salmon with quinoa and sauteed leafy greens",
        "Evening": "Chamomile tea"
    },
    follicular: {
        "Breakfast": "Oatmeal with berries, nuts, and Greek yogurt",
        "Mid-Morning": "Apple slices with almond butter",
        "Lunch": "Grilled chicken salad with quinoa and mixed vegetables",
        "Afternoon": "Hummus with carrot and cucumber sticks",
        "Dinner": "Baked salmon with sweet potato and broccoli",
        "Evening": "Herbal tea with a small piece of dark chocolate"
    },
    ovulation: {
        "Breakfast": "Greek yogurt parfait with berries and chia seeds",
        "Mid-Morning": "Raw veggie sticks with hummus",
        "Lunch": "Wild-caught fish tacos with avocado and cabbage slaw",
        "Afternoon": "Mixed berries with a handful of almonds",
        "Dinner": "Grilled shrimp with brown rice and roasted asparagus",
        "Evening": "Infused water with citrus and mint"
    },
    luteal: {
        "Breakfast": "Sweet potato hash with eggs and spinach",
        "Mid-Morning": "Banana with almond butter",
        "Lunch": "Quinoa bowl with roasted vegetables and chickpeas",
        "Afternoon": "Herbal tea with a small square of dark chocolate",
        "Dinner": "Roasted chicken with mashed sweet potato and greens",
        "Evening": "Warm milk or chamomile tea with pumpkin seeds"
    },
    pregnancy_first: {
        "Breakfast": "Whole grain toast with avocado and scrambled eggs",
        "Mid-Morning": "Crackers with cheese",
        "Lunch": "Chicken soup with vegetables and whole grain bread",
        "Afternoon": "Banana with peanut butter",
        "Dinner": "Baked chicken breast with rice and steamed vegetables",
        "Evening": "Ginger tea with whole grain crackers"
    },
    pregnancy_second: {
        "Breakfast": "Smoothie bowl with yogurt, berries, and granola",
        "Mid-Morning": "Trail mix with dried fruits and nuts",
        "Lunch": "Salmon with quinoa and leafy green salad",
        "Afternoon": "Greek yogurt with honey and walnuts",
        "Dinner": "Lean beef stir-fry with brown rice and vegetables",
        "Evening": "Warm milk with a date"
    },
    pregnancy_third: {
        "Breakfast": "Scrambled eggs with whole grain toast and fruit",
        "Mid-Morning": "Dates and almonds",
        "Lunch": "Lentil soup with whole grain roll",
        "Afternoon": "Cheese and whole grain crackers",
        "Dinner": "Baked fish with quinoa and roasted vegetables",
        "Evening": "Chamomile tea with a small snack"
    }
};