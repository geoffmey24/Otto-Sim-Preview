export const SCENARIOS = {
  home: [
    {
      title: 'Rent Is Due',
      body: 'Your rent of $750 is due at the end of the month. Your account is tight but you can just cover it. Your landlord also mentioned a lease renewal coming up.',
      choices: [
        { label: 'Pay rent on time', impacts: { finances: -12, mental: 5 }, buttonType: 'recommended' },
        { label: 'Skip this month', impacts: { mental: -18, relationships: -8 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Noisy Neighbor',
      body: 'The neighbor above you has been blasting music until 2am every night. You are losing sleep and your focus is completely slipping.',
      choices: [
        { label: 'Knock and talk it out', impacts: { mental: 12, relationships: 5 }, buttonType: 'recommended' },
        { label: 'Buy earplugs and endure', impacts: { finances: -4, mental: -8 }, buttonType: 'alternative' },
        { label: 'Call building management', impacts: { mental: 8, relationships: -6 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Takeout Habit',
      body: 'You have been ordering takeout every day this week. It is convenient but expensive and your energy levels are noticeably worse.',
      choices: [
        { label: 'Cook at home for the rest of the month', impacts: { finances: 8, health: 10, mental: 5 }, buttonType: 'recommended' },
        { label: 'Keep ordering — you deserve the convenience', impacts: { finances: -14, health: -8 }, buttonType: 'risky' },
      ],
    },
  ],

  workplace: [
    {
      title: 'Overtime Offer',
      body: 'Your manager asks if you will work this Saturday for time and a half — an extra $280. But you had plans with friends and your body needs rest.',
      choices: [
        { label: 'Work overtime', impacts: { finances: 18, health: -10, relationships: -12 }, buttonType: 'recommended' },
        { label: 'Decline and keep your plans', impacts: { relationships: 10, mental: 8 }, buttonType: 'alternative' },
        { label: 'Negotiate — just the morning shift', impacts: { finances: 8, health: -4, relationships: -4 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Workplace Conflict',
      body: 'A coworker took credit for your idea in front of your manager again. You are furious. It has happened three times and your manager does not notice.',
      choices: [
        { label: 'Speak to the coworker directly', impacts: { mental: 14, finances: 5 }, buttonType: 'recommended' },
        { label: 'Report it to HR', impacts: { mental: 8, relationships: -10, finances: 8 }, buttonType: 'alternative' },
        { label: 'Say nothing and let it go', impacts: { mental: -16 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Performance Review',
      body: 'Your six month review is today. Mostly positive but your communication needs improvement. A small raise is being considered.',
      choices: [
        { label: 'Accept feedback and ask for the raise', impacts: { finances: 14, mental: 10 }, buttonType: 'recommended' },
        { label: 'Push back and defend yourself', impacts: { finances: -6, mental: -8 }, buttonType: 'risky' },
        { label: 'Accept and ask for a development plan', impacts: { mental: 15, finances: 6 }, buttonType: 'alternative' },
      ],
    },
  ],

  bank: [
    {
      title: 'No Emergency Fund',
      body: 'A financial advisor points out you have zero emergency savings. If anything unexpected happens you would be in serious trouble.',
      choices: [
        { label: 'Open a savings account, auto-deposit $100/month', impacts: { finances: -8, mental: 14 }, buttonType: 'recommended' },
        { label: 'Invest $200 in a low-risk ETF fund', impacts: { finances: -10, mental: 10 }, buttonType: 'alternative' },
        { label: 'Do nothing — deal with it later', impacts: { mental: -12 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'First Credit Card',
      body: 'The bank offers your first credit card with a $1,500 limit at 22% APR. Responsible use builds credit but misuse creates debt.',
      choices: [
        { label: 'Accept and pay in full every month', impacts: { finances: 12, mental: 6 }, buttonType: 'recommended' },
        { label: 'Accept without a payoff plan', impacts: { finances: -15, mental: -10 }, buttonType: 'risky' },
        { label: 'Decline — too risky right now', impacts: { mental: 4 }, buttonType: 'alternative' },
      ],
    },
    {
      title: 'Car Loan',
      body: 'A $3,000 loan to buy a used car would cut your commute in half and open better-paying jobs but adds monthly payments for a year.',
      choices: [
        { label: 'Take the loan and get the car', impacts: { finances: -10, mental: 10, health: 5 }, buttonType: 'recommended' },
        { label: 'Buy a secondhand bike instead', impacts: { finances: -4, health: 14 }, buttonType: 'alternative' },
        { label: 'Keep taking the bus', impacts: { mental: -8 }, buttonType: 'risky' },
      ],
    },
  ],

  gym: [
    {
      title: 'Personal Trainer',
      body: 'A trainer offers a custom program for $200/month. You have been struggling to see results on your own for two months.',
      choices: [
        { label: 'Hire the trainer for 3 months', impacts: { finances: -16, health: 22 }, buttonType: 'recommended' },
        { label: 'Buy a $25 workout guide book', impacts: { finances: -3, health: 10 }, buttonType: 'alternative' },
        { label: 'Stick with current routine', impacts: { health: 5 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Injury Warning',
      body: 'Your knee has been aching before workouts. You want to hit a new personal record today but your body is sending clear warning signals.',
      choices: [
        { label: 'Rest and recover — skip today', impacts: { health: 16, mental: 8 }, buttonType: 'recommended' },
        { label: 'Do a light workout to stay consistent', impacts: { health: 8, mental: 6 }, buttonType: 'alternative' },
        { label: 'Push through for the record', impacts: { mental: 8, health: -20 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Morning Workout Crew',
      body: 'A regular at the gym invites you to their 5:30am group. You would have accountability partners but need to wake up 90 minutes earlier every day.',
      choices: [
        { label: 'Join the morning group', impacts: { relationships: 16, health: 12, mental: -6 }, buttonType: 'recommended' },
        { label: 'Decline but stay friendly', impacts: { health: 5, relationships: 3 }, buttonType: 'alternative' },
        { label: 'Suggest an evening meetup', impacts: { relationships: 10, health: 8 }, buttonType: 'risky' },
      ],
    },
  ],

  bar: [
    {
      title: 'Friday Night Out',
      body: 'Your coworkers are heading out for drinks. You are exhausted and low on cash but have turned down every invitation for three weeks.',
      choices: [
        { label: 'Go out and have a couple drinks', impacts: { relationships: 18, finances: -14, health: -6 }, buttonType: 'recommended' },
        { label: 'Go but only drink water', impacts: { relationships: 12, finances: -5 }, buttonType: 'alternative' },
        { label: 'Stay home again', impacts: { mental: -12, relationships: -14 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'One Drink Too Many',
      body: 'What started as two drinks became five. The night was fun but your card was charged $90 you did not plan for. You wake up with a headache.',
      choices: [
        { label: 'Accept it, adjust budget, and learn', impacts: { finances: -18, health: -8, mental: 10 }, buttonType: 'recommended' },
        { label: 'Feel guilty and spiral', impacts: { finances: -18, mental: -18, health: -8 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Unexpected Networking',
      body: 'You get into a great conversation with someone who works at a company you admire. They mention they are hiring and seem interested in your background.',
      choices: [
        { label: 'Exchange contact info and follow up Monday', impacts: { finances: 16, relationships: 12 }, buttonType: 'recommended' },
        { label: 'Great conversation but forget to follow up', impacts: { relationships: 8, finances: -10 }, buttonType: 'alternative' },
        { label: 'Aggressively pitch yourself on the spot', impacts: { relationships: -10, finances: 6 }, buttonType: 'risky' },
      ],
    },
  ],

  casino: [
    {
      title: 'Up $120',
      body: 'You have been at the slots for an hour and you are up $120. Your ride home leaves in 30 minutes. Every instinct says keep going.',
      choices: [
        { label: 'Cash out and leave — take the win', impacts: { finances: 14, mental: 12 }, buttonType: 'recommended' },
        { label: 'Play a few more rounds', impacts: {}, buttonType: 'alternative', random: { threshold: 0.5, win: { finances: 10, mental: 8 }, lose: { finances: -20, mental: -14 } } },
        { label: 'Double down — go big', impacts: {}, buttonType: 'risky', random: { threshold: 0.75, win: { finances: 30, mental: 15 }, lose: { finances: -30, mental: -20 } } },
      ],
    },
    {
      title: 'Down $200',
      body: 'You have lost $200. Someone whispers about a card game in the back room claiming it is a sure thing. Something about this feels very wrong.',
      choices: [
        { label: 'Walk away and accept the loss', impacts: { mental: 14 }, buttonType: 'recommended' },
        { label: 'Try to win it back', impacts: {}, buttonType: 'risky', random: { threshold: 0.35, win: { finances: 15, mental: 5 }, lose: { finances: -20, mental: -18 } } },
        { label: 'Call a friend to come get you', impacts: { relationships: 14, mental: 12 }, buttonType: 'alternative' },
      ],
    },
    {
      title: 'Won $350 at Poker',
      body: 'An incredible night — you won $350. You are feeling invincible. Your rideshare arrives in 15 minutes. The table pressures you to stay for one more round.',
      choices: [
        { label: 'Cash out and leave immediately', impacts: { finances: 22, mental: 16 }, buttonType: 'recommended' },
        { label: 'One more round', impacts: {}, buttonType: 'risky', random: { threshold: 0.5, win: { finances: 20, mental: 10 }, lose: { finances: -28, mental: -18 } } },
        { label: 'Buy everyone a round of drinks', impacts: { finances: 12, relationships: 14 }, buttonType: 'alternative' },
      ],
    },
  ],

  hospital: [
    {
      title: 'Overdue Checkup',
      body: 'It has been over a year since you saw a doctor. You feel okay but a routine visit costs $120 with your basic insurance copay.',
      choices: [
        { label: 'Book the appointment and go this week', impacts: { finances: -10, health: 20, mental: 8 }, buttonType: 'recommended' },
        { label: 'Schedule it for next month', impacts: { mental: 3 }, buttonType: 'alternative' },
        { label: 'Skip it — you feel fine', impacts: { health: -12, mental: -8 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Woke Up Sick',
      body: 'You woke up with a fever of 101 and body aches. You have an important presentation. No official sick day policy means missing costs you a day\'s pay.',
      choices: [
        { label: 'Stay home and rest', impacts: { health: 18, finances: -8, mental: 10 }, buttonType: 'recommended' },
        { label: 'Push through and go to work', impacts: { health: -22, finances: 8, relationships: -8 }, buttonType: 'risky' },
        { label: 'Work from home if possible', impacts: { health: 8, finances: 4, mental: 6 }, buttonType: 'alternative' },
      ],
    },
    {
      title: 'Mental Health Check',
      body: 'The doctor notices signs of stress and anxiety. She recommends therapy. Your insurance covers 6 sessions per year at no cost.',
      choices: [
        { label: 'Book a therapy session', impacts: { mental: 22, relationships: 5 }, buttonType: 'recommended' },
        { label: 'Say you are fine and decline', impacts: { mental: -14 }, buttonType: 'risky' },
        { label: 'Ask for self-help recommendations', impacts: { mental: 10 }, buttonType: 'alternative' },
      ],
    },
  ],

  park: [
    {
      title: 'Clear Morning',
      body: 'It is a cool clear morning and the trail is empty. You have 45 minutes before work. A run would set the tone for your whole day.',
      choices: [
        { label: 'Go for a 30 minute run', impacts: { health: 16, mental: 12 }, buttonType: 'recommended' },
        { label: 'Sit quietly and breathe', impacts: { mental: 10, health: 4 }, buttonType: 'alternative' },
        { label: 'Sit and scroll your phone', impacts: { mental: -6 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Community Cleanup',
      body: 'A free neighborhood cleanup event is happening. Volunteers get a free lunch and you would meet new people from the neighborhood.',
      choices: [
        { label: 'Join the event for the full morning', impacts: { relationships: 18, mental: 12, health: 8 }, buttonType: 'recommended' },
        { label: 'Watch but do not participate', impacts: { relationships: 4, mental: 4 }, buttonType: 'alternative' },
        { label: 'Head home — not your thing', impacts: { mental: -5, relationships: -4 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Moment of Clarity',
      body: 'Twenty minutes by the pond with no phone. You realize you have been running on empty for months and something has to change.',
      choices: [
        { label: 'Write down a real plan', impacts: { mental: 20, finances: 8 }, buttonType: 'recommended' },
        { label: 'Call a friend and talk it through', impacts: { mental: 14, relationships: 14 }, buttonType: 'alternative' },
        { label: 'Shake it off and stay busy', impacts: { mental: -14 }, buttonType: 'risky' },
      ],
    },
  ],

  friends: [
    {
      title: 'Game Night',
      body: 'Your friend is hosting a casual game night with 6 people including new faces. It is free but runs late and you have an early shift tomorrow.',
      choices: [
        { label: 'Go and stay until the end', impacts: { relationships: 20, mental: 12, health: -8 }, buttonType: 'recommended' },
        { label: 'Go but leave by 10pm', impacts: { relationships: 12, mental: 8, health: -3 }, buttonType: 'alternative' },
        { label: 'Skip it — you need sleep', impacts: { relationships: -14, mental: -10, health: 5 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'Friend Needs $150',
      body: 'Your close friend texts asking to borrow $150 until next week. They say it is urgent. Your budget is tight but you could manage it.',
      choices: [
        { label: 'Lend the money', impacts: { relationships: 18, finances: -15 }, buttonType: 'recommended' },
        { label: 'Help them find another solution', impacts: { relationships: 10 }, buttonType: 'alternative' },
        { label: 'Tell them you cannot afford it', impacts: { relationships: -10 }, buttonType: 'risky' },
      ],
    },
    {
      title: 'An Honest Conversation',
      body: 'Your friend opens up about struggling. The conversation shifts and you realize you have been bottling up your own stress for months.',
      choices: [
        { label: 'Open up fully and be honest', impacts: { mental: 24, relationships: 20 }, buttonType: 'recommended' },
        { label: 'Listen but keep your guard up', impacts: { relationships: 12, mental: 6 }, buttonType: 'alternative' },
        { label: 'Deflect with humor and change the subject', impacts: { relationships: 5, mental: -14 }, buttonType: 'risky' },
      ],
    },
  ],
};
