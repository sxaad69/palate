// Bundled daily encouragement — no network needed. Cycled by day count so
// the message changes as the streak grows. Warm, non-judgmental, honest.

export interface Encouragement {
  en: string;
  ar: string;
}

export const ENCOURAGEMENT: Encouragement[] = [
  { en: 'One clear day is a complete victory. Stack another tomorrow.', ar: 'يوم صافٍ واحد انتصار كامل. أضف آخر غدًا.' },
  { en: 'You don’t have to be perfect. You just have to be clear today.', ar: 'لا يجب أن تكون مثاليًا. فقط كن صافيًا اليوم.' },
  { en: 'Cravings are visitors. They always leave.', ar: 'الاشتهاء زائر. وهو دائمًا يرحل.' },
  { en: 'Your future self is thanking you right now.', ar: 'نفسك المستقبلية تشكرك الآن.' },
  { en: 'Small days build big lives.', ar: 'الأيام الصغيرة تبني حياة كبيرة.' },
  { en: 'You’ve survived every hard day so far. That’s a 100% record.', ar: 'لقد نجوت من كل يوم صعب حتى الآن. هذا سجل نجاح ١٠٠٪.' },
  { en: 'The money you save is the life you’re buying back.', ar: 'المال الذي توفره هو الحياة التي تستعيدها.' },
  { en: 'Rest is productive. Healing is happening even when you can’t feel it.', ar: 'الراحة إنتاجية. التعافي يحدث حتى عندما لا تشعر به.' },
  { en: 'You are not starting over. You are continuing, wiser.', ar: 'أنت لا تبدأ من جديد. أنت تكمل، بحكمة أكبر.' },
  { en: 'Clarity looks good on you.', ar: 'الصفاء يليق بك.' },
  { en: 'Ten minutes. That’s all a craving asks. You can give it ten minutes of breathing.', ar: 'عشر دقائق. هذا كل ما يطلبه الاشتهاء. يمكنك منحه عشر دقائق من التنفس.' },
  { en: 'Nobody regrets a clear morning.', ar: 'لا أحد يندم على صباح صافٍ.' },
  { en: 'Progress, not perfection. Count the days, forgive the rest.', ar: 'التقدم لا الكمال. عُدَّ الأيام وسامح الباقي.' },
  { en: 'You chose this. That choice is strength.', ar: 'أنت اخترت هذا. وهذا الاختيار قوة.' },
];

export function encouragementForDay(daysClean: number): Encouragement {
  return ENCOURAGEMENT[daysClean % ENCOURAGEMENT.length];
}
