/** Exercises transcribed from the nine supplied PDF pages, pp. 39, 41–48.
 * Answer suggestions are editorial (the source contains no separate answer key).
 */
export type ExerciseQuestion = {
  id: string;
  prompt: string;
  answers: string[];
  explanation: string;
  kind?: 'blank' | 'choice' | 'sentence' | 'self';
  options?: string[];
  hint?: string;
  model?: string;
};

export type ExerciseGroup = {
  id: string;
  title: string;
  instruction: string;
  sourcePage?: number;
  hint?: string;
  passage?: string;
  scoring?: 'automatic' | 'self';
  maxScore?: number;
  questions: ExerciseQuestion[];
};

const fill = (id: string, prompt: string, answer: string | string[], explanation: string): ExerciseQuestion => ({
  id, prompt, answers: Array.isArray(answer) ? answer : [answer], explanation, kind: 'blank',
});
const sentence = (id: string, prompt: string, answer: string | string[], explanation: string): ExerciseQuestion => ({
  ...fill(id, prompt, answer, explanation), kind: 'sentence',
});
const choose = (id: string, prompt: string, options: string[], answer: string, explanation: string): ExerciseQuestion => ({
  id, prompt, options, answers: [answer], explanation, kind: 'choice',
});

export const exerciseGroups: Record<string, ExerciseGroup> = {
  p25: {
    id: 'p25', title: 'Practice 25', sourcePage: 39,
    instruction: 'Complete each sentence with at, on or in.',
    hint: 'Use at for a point, on for a surface, and in for an area or enclosed space.',
    questions: [
      fill('25-1', 'Do you live ___ Manchester?', 'in', 'Use in with names of towns.'),
      fill('25-2', 'He was ___ the bus stop for half an hour.', 'at', 'A bus stop is a particular point.'),
      fill('25-3', 'Are the plates ___ the cupboard?', 'in', 'A cupboard is an enclosed space.'),
      fill('25-4', 'Look at the example ___ the board.', 'on', 'The example is on a surface.'),
      fill('25-5', 'I met my girlfriend ___ a party.', 'at', 'We normally say at a party.'),
      fill('25-6', 'Kathy’s not here – she’s ___ work at the moment.', 'at', 'At work is a common expression.'),
      fill('25-7', 'Are my books ___ that shelf?', 'on', 'A shelf is a surface.'),
      fill('25-8', 'My toothbrush isn’t ___ the bathroom. Where is it?', 'in', 'Use in for a room.'),
      fill('25-9', 'She usually sits ___ the floor.', 'on', 'We sit on the surface of the floor.'),
      fill('25-10', 'Is your daughter happy ___ school?', 'at', 'At school refers to the place or activity.'),
      fill('25-11', 'We had breakfast ___ the garden.', 'in', 'Use in for the area of a garden.'),
      fill('25-12', 'There are too many cars ___ the road.', 'on', 'Cars are on the road surface.'),
    ],
  },
  p27: {
    id: 'p27', title: 'Practice 27', sourcePage: 41,
    instruction: 'Complete each sentence with at, on or in.',
    hint: 'At = specific point in time; on = day/date; in = month, year, season or period of the day.',
    questions: [
      fill('27-1', 'College starts ___ 9 o’clock in the morning.', 'at', 'At is used for clock times.'),
      fill('27-2', 'I usually go swimming ___ Tuesdays.', 'on', 'On is used for named days.'),
      fill('27-3', 'I got up ___ 7 o’clock this morning.', 'at', 'At is used for a specific time.'),
      fill('27-4', 'Jim came round ___ Saturday afternoon.', 'on', 'A named day and period use on.'),
      fill('27-5', 'The children get too many presents ___ Christmas.', 'at', 'At Christmas is the general holiday period.'),
      fill('27-6', 'We usually take our holiday ___ September.', 'in', 'Use in with months.'),
      fill('27-7', 'They don’t go out very often ___ the evenings.', 'in', 'In the evenings refers to a usual period of the day.'),
      fill('27-8', 'She was born in Australia ___ 1952.', 'in', 'Use in with years.'),
      fill('27-9', 'I always go and see her ___ her birthday.', 'on', 'Use on with a particular day.'),
      fill('27-10', 'She phoned up ___ the beginning of the match on TV.', 'at', 'At the beginning is the fixed expression.'),
      fill('27-11', 'They usually come and stay with us ___ the summer holidays.', 'in', 'In describes a period of time.'),
      fill('27-12', 'We moved here ___ 20th October.', 'on', 'Use on with a date.'),
    ],
  },
  p28a: {
    id: 'p28a', title: 'Practice 28a', sourcePage: 43,
    instruction: 'Write the -ing form of each verb.',
    hint: 'Check final -e, short vowel + consonant, and -ie spelling.',
    questions: [
      fill('28a-1', 'be → ___', 'being', 'Keep the e in be: being.'),
      fill('28a-2', 'clean → ___', 'cleaning', 'Add -ing.'),
      fill('28a-3', 'come → ___', 'coming', 'Drop the final silent e.'),
      fill('28a-4', 'do → ___', 'doing', 'Add -ing.'),
      fill('28a-5', 'fly → ___', 'flying', 'Keep y and add -ing.'),
      fill('28a-6', 'get (up) → ___', 'getting up', 'Double t in getting; the phrase is getting up.'),
      fill('28a-7', 'give → ___', 'giving', 'Drop the final silent e.'),
      fill('28a-8', 'listen → ___', 'listening', 'Add -ing; do not double n.'),
      fill('28a-9', 'live → ___', 'living', 'Drop the final silent e.'),
      fill('28a-10', 'play → ___', 'playing', 'Add -ing.'),
      fill('28a-11', 'smoke → ___', 'smoking', 'Drop the final silent e.'),
      fill('28a-12', 'stay → ___', 'staying', 'Add -ing.'),
      fill('28a-13', 'study → ___', 'studying', 'Keep y before -ing.'),
      fill('28a-14', 'swim → ___', 'swimming', 'Double the final consonant m.'),
      fill('28a-15', 'teach → ___', 'teaching', 'Add -ing.'),
      fill('28a-16', 'watch → ___', 'watching', 'Add -ing.'),
      fill('28a-17', 'work → ___', 'working', 'Add -ing.'),
      fill('28a-18', 'write → ___', 'writing', 'Drop the final silent e.'),
    ],
  },
  p28b: {
    id: 'p28b', title: 'Practice 28b', sourcePage: 43,
    instruction: 'Use each -ing form from Practice 28a once to complete these sentences.',
    hint: 'Look for the activity that makes sense after like, love, or hate.',
    questions: [
      fill('28b-1', 'My father loves ___ to music.', 'listening', 'We say listen to music.'),
      fill('28b-2', 'Rosie likes ___ to our house.', 'coming', 'We say come to our house.'),
      fill('28b-3', 'Peter doesn’t like ___ the car so I usually do it.', 'cleaning', 'Cleaning the car is the activity.'),
      fill('28b-4', 'Do you like ___ in the sea?', 'swimming', 'Swimming is the water activity.'),
      fill('28b-5', 'She loves ___ presents.', 'giving', 'Give presents means offer gifts.'),
      fill('28b-6', 'I hate ___ letters.', 'writing', 'Write letters is the activity.'),
      fill('28b-7', 'Jess loves ___ a mother.', 'being', 'Being is the -ing form of be.'),
      fill('28b-8', 'I hate ___ – the smell of cigarettes is terrible.', 'smoking', 'The clue is the smell of cigarettes.'),
      fill('28b-9', 'I don’t like ___ so I travel everywhere by train or boat.', 'flying', 'Flying means travelling by plane.'),
      fill('28b-10', 'My friends and I love ___ ball games on the beach.', 'playing', 'We say play ball games.'),
      fill('28b-11', 'Joe likes ___ television after a long day at college.', 'watching', 'We say watch television.'),
      fill('28b-12', 'Everyone in my family hates ___ on Monday mornings.', 'getting up', 'Getting up is leaving your bed.'),
      fill('28b-13', 'Does Caroline like ___ young children?', 'teaching', 'Teach children means help them learn.'),
      fill('28b-14', 'I don’t like the lessons at college but I like ___ in the library.', 'studying', 'Studying means learning or reviewing work.'),
      fill('28b-15', 'Greg always hates ___ his homework.', 'doing', 'We say do homework.'),
      fill('28b-16', 'Trisha doesn’t really like ___ in an office.', 'working', 'Working is the office activity.'),
      fill('28b-17', 'Anne and I love ___ in the countryside.', 'living', 'Living means having your home there.'),
      fill('28b-18', 'Felix really likes ___ in good hotels.', 'staying', 'Stay in a hotel means spend time there.'),
    ],
  },
  p29a: {
    id: 'p29a', title: 'Practice 29a', sourcePage: 44,
    instruction: 'Choose a verb from the box. Use it after would like to: ask, be, buy, come, have, pay, play, see, sit, stay.',
    hint: 'Would like to + base verb. Use each verb once.',
    questions: [
      fill('29a-1', 'Would you like to ___ lunch with us tomorrow?', 'have', 'Have lunch is the normal phrase.'),
      fill('29a-2', 'I’d like to ___ a new pair of jeans.', 'buy', 'Buy means purchase.'),
      fill('29a-3', 'Would you like to ___ by the window?', 'sit', 'Sit by the window is natural.'),
      fill('29a-4', 'I’d better leave now. I wouldn’t like to ___ late for the meeting.', 'be', 'Be late is the expression.'),
      fill('29a-5', 'Do you think Rosa would like to ___ tennis with us?', 'play', 'We play tennis.'),
      fill('29a-6', 'My parents would like to ___ at a new hotel.', 'stay', 'Stay at a hotel.'),
      fill('29a-7', 'We’d like to ___ him a few questions.', 'ask', 'Ask someone questions.'),
      fill('29a-8', 'Excuse me. I’d like to ___ the bill now, please.', 'pay', 'Pay the bill is the usual phrase.'),
      fill('29a-9', 'We’re having a party on Saturday. Would you like to ___?', 'come', 'Come means join us.'),
      fill('29a-10', 'I’d like to ___ that new film tonight.', 'see', 'See a film is the normal phrase.'),
    ],
  },
  p29b: {
    id: 'p29b', title: 'Practice 29b', sourcePage: 44,
    instruction: 'Write the -ing form after like, or to + base verb after would like.',
    hint: 'Compare Do you like cooking? and Would you like to go?',
    questions: [
      fill('29b-1', 'Do you like ___? (cook)', 'cooking', 'Like takes an -ing form in this exercise.'),
      fill('29b-2', 'Would you like ___ for a walk? (go)', 'to go', 'Would like is followed by to + base verb.'),
      fill('29b-3', 'I’d like ___ you again. (see)', 'to see', 'Would like + to see.'),
      fill('29b-4', 'My brother likes ___ to the theatre. (go)', 'going', 'Like + going.'),
      fill('29b-5', 'Does Amber like ___ with her parents? (live)', 'living', 'Like + living.'),
      fill('29b-6', 'She’d like ___ the world. (travel)', 'to travel', 'Would like + to travel.'),
      fill('29b-7', 'We’d like ___ to the manager, please. (speak)', 'to speak', 'Would like + to speak.'),
      fill('29b-8', 'Do you think Francis would like ___ my bike? (buy)', 'to buy', 'Would like + to buy.'),
      fill('29b-9', 'The cat likes ___ mice into the house. (bring)', 'bringing', 'Like + bringing.'),
      fill('29b-10', 'Do you like ___ computer games? (play)', 'playing', 'Like + playing.'),
    ],
  },
  p30: {
    id: 'p30', title: 'Practice 30', sourcePage: 45,
    instruction: 'Rewrite the words in the correct order. Write the whole sentence.',
    hint: 'For ordinary positive sentences: subject + frequency adverb + verb. For negatives: subject + don’t/doesn’t + frequency adverb + verb.',
    questions: [
      sentence('30-1', 'to the mountains / never / we / go', 'We never go to the mountains.', 'Never goes before go.'),
      sentence('30-2', 'often / she / write to me / doesn’t', 'She doesn’t often write to me.', 'After doesn’t comes often, then the base verb.'),
      sentence('30-3', 'play football on Saturday afternoons / the boys / always', 'The boys always play football on Saturday afternoons.', 'Always goes before play.'),
      sentence('30-4', 'usually / arrives late / the bus', 'The bus usually arrives late.', 'Usually goes before arrives.'),
      sentence('30-5', 'go to bed before 11 / often / I', 'I often go to bed before 11.', 'Often goes before go.'),
      sentence('30-6', 'never / drinks coffee in the evening / she', 'She never drinks coffee in the evening.', 'Never goes before drinks.'),
      sentence('30-7', 'it / rain in the summer / often / doesn’t', 'It doesn’t often rain in the summer.', 'Doesn’t often + base verb rain.'),
      sentence('30-8', 'read books slowly / I / always', 'I always read books slowly.', 'Always goes before read.'),
      sentence('30-9', 'usually / my father / goes to work by bus', 'My father usually goes to work by bus.', 'Usually goes before goes.'),
      sentence('30-10', 'always / go to the beach at the weekend / we', 'We always go to the beach at the weekend.', 'Always goes before go.'),
    ],
  },
  testA: {
    id: 'testA', title: 'Test 1 · Part A', sourcePage: 46,
    instruction: 'Fill the ten numbered gaps in Andrew’s letter. Each correct answer earns 1 point.', maxScore: 10,
    passage: `Dear José,\n\nThank you for your letter. It was [[1]] interesting. And thank you for the photographs. Your village looks beautiful. Now I would like to tell you a little about myself and [[2]] family.\n\nI live [[3]] a town about 40 miles (that’s about 64 kilometres) from London. I’ve [[4]] one brother and one sister and we all [[5]] to the local school. My mother’s a tourist officer and she [[6]] to London [[7]] the train every day. My father’s a computer programmer and he often works [[8]] home.\n\nAt the weekends I often play football with the school team. I sometimes go [[9]] at the local pool. [[10]] is a very good gym at the pool, too.\n\nI look forward to your next letter.\n\nBest wishes,\nAndrew`,
    questions: [
      fill('a-1', 'Gap 1', ['very', 'really', 'quite', 'so'], 'An adverb describes how interesting it was.'),
      fill('a-2', 'Gap 2', 'my', 'Andrew is talking about his own family.'),
      fill('a-3', 'Gap 3', 'in', 'Use in with a town.'),
      fill('a-4', 'Gap 4', 'got', 'I’ve got means I have.'),
      fill('a-5', 'Gap 5', 'go', 'We all go to school.'),
      fill('a-6', 'Gap 6', 'goes', 'She goes is present simple, third-person singular.'),
      fill('a-7', 'Gap 7', 'on', 'We travel on the train.'),
      fill('a-8', 'Gap 8', 'at', 'At home is the fixed expression.'),
      fill('a-9', 'Gap 9', 'swimming', 'Go swimming describes the activity at a pool.'),
      fill('a-10', 'Gap 10', 'There', 'There is introduces the existence of something.'),
    ],
  },
  testB: {
    id: 'testB', title: 'Test 1 · Part B', sourcePage: 46,
    instruction: 'Choose the correct words. Each correct answer earns 1 point.', maxScore: 10,
    questions: [
      choose('b-1', '___ you usually go home for lunch?', ['Do', 'Does'], 'Do', 'Use do with you.'),
      choose('b-2', 'I start work ___ 9 o’clock.', ['on', 'at'], 'at', 'Use at with a clock time.'),
      choose('b-3', '___ dogs are very noisy.', ['That', 'Those'], 'Those', 'Those agrees with plural dogs.'),
      choose('b-4', 'What ___ yesterday?', ['you did', 'did you do'], 'did you do', 'Use did + subject + base verb in past questions.'),
      choose('b-5', '___ your passport?', ['Have you got', 'Do you have got'], 'Have you got', 'Have you got is a correct possession question.'),
      choose('b-6', 'Do you enjoy ___?', ['to read', 'reading'], 'reading', 'Enjoy is followed by a gerund.'),
      choose('b-7', 'Is your sister ___ you?', ['older than', 'old than'], 'older than', 'Comparatives use older than.'),
      choose('b-8', '___ some new books in the library.', ['There is', 'There are'], 'There are', 'Plural books requires are.'),
      choose('b-9', 'Where ___ you last night?', ['was', 'were'], 'were', 'Use were with you.'),
      choose('b-10', 'Did you stay ___ home at the weekend?', ['at', 'in'], 'at', 'We say at home.'),
    ],
  },
  testC: {
    id: 'testC', title: 'Test 1 · Part C', sourcePage: 47,
    instruction: 'Rebuild all seven conversation turns using the correct tense, form, and missing words. Compare with the model, then award up to 20 points (subtract 1 for each mistake).',
    scoring: 'self', maxScore: 20,
    questions: [
      {id:'c-1',kind:'self',prompt:'A: You / have / nice time / London / the weekend?',answers:[],model:'A: Did you have a nice time in London at the weekend?',explanation:'Use did + base verb for a past question.'},
      {id:'c-2',kind:'self',prompt:'B: Yes, I. / I / stay with / old friend from school / we / have / wonderful time together. / Saturday we / go / art gallery / the morning, / concert / the afternoon / Italian restaurant / the evening. / It / be / great weekend. / What about you? / You / have / nice weekend?',answers:[],model:'B: Yes, I did. I stayed with an old friend from school and we had a wonderful time together. On Saturday we went to an art gallery in the morning, a concert in the afternoon, and an Italian restaurant in the evening. It was a great weekend. What about you? Did you have a nice weekend?',explanation:'Use stayed, had, went, was and did for past events. Other natural joining words are possible.'},
      {id:'c-3',kind:'self',prompt:'A: It / not be / very interesting. / I / stay / home / all weekend.',answers:[],model:'A: It wasn’t very interesting. I stayed at home all weekend.',explanation:'Use wasn’t and stayed for the past.'},
      {id:'c-4',kind:'self',prompt:'B: Why / you / not go out?',answers:[],model:'B: Why didn’t you go out?',explanation:'Use didn’t + base form go.'},
      {id:'c-5',kind:'self',prompt:'A: I / not feel / very well.',answers:[],model:'A: I didn’t feel very well.',explanation:'Use didn’t feel for a past negative.'},
      {id:'c-6',kind:'self',prompt:'B: Oh. I / be / sorry about that.',answers:[],model:'B: Oh. I’m sorry about that.',explanation:'I’m sorry is natural when expressing sympathy now.'},
      {id:'c-7',kind:'self',prompt:'A: That / be / all right. / I / be / better now.',answers:[],model:'A: That’s all right. I’m better now.',explanation:'Use the present because the speaker feels better now.'},
    ],
  },
  testD: {
    id: 'testD', title: 'Test 1 · Part D', sourcePage: 47,
    instruction: 'Put the words in the correct order. Each correct answer earns 1 point.', maxScore: 10,
    questions: [
      sentence('d-1', 'brother / has / a / your / job / got?', 'Has your brother got a job?', 'Have got forms questions with has before the subject.'),
      sentence('d-2', 'buildings / are / this / there / beautiful / town / some / in.', 'There are some beautiful buildings in this town.', 'Use there are with plural buildings.'),
      sentence('d-3', 'history / mother / the / their / college / at / teaches.', 'Their mother teaches history at the college.', 'The subject is their mother.'),
      sentence('d-4', 'music / like / the / I / evenings / listening / in / to.', 'I like listening to music in the evenings.', 'Like + -ing; listen to music.'),
      sentence('d-5', 'her / taller / all / is / Angela / sisters / than.', 'Angela is taller than all her sisters.', 'Use the comparative taller than.'),
      sentence('d-6', 'lights / are / the / in / those / sky / what?', 'What are those lights in the sky?', 'Question word + are + subject.'),
      sentence('d-7', 'you / time / do / work / finish / what?', 'What time do you finish work?', 'Use do before you for a present-simple question.'),
      sentence('d-8', 'at / yesterday / were / not / school / they.', ['They were not at school yesterday.', 'They weren’t at school yesterday.'], 'A past negative with were not.'),
      sentence('d-9', 'phone / she / me / the / not / at / weekend / did.', ['She did not phone me at the weekend.', 'She didn’t phone me at the weekend.'], 'Did not + base verb phone.'),
      sentence('d-10', 'in / sometimes / winter / go / the / I / skiing.', ['I sometimes go skiing in the winter.', 'Sometimes I go skiing in the winter.'], 'Sometimes normally goes before go, but can also begin the sentence.'),
    ],
  },
};

// New review examples are intentionally distinct from the supplied PDF questions.
exerciseGroups.review = {
  id: 'review', title: 'Quick review · New practice',
  instruction: 'Apply the rules to new sentences. These review questions are not taken from the PDF.',
  questions: [
    fill('r-1', 'My friend is waiting ___ the station.', 'at', 'At identifies a meeting place or point.'),
    fill('r-2', 'The keys are ___ the desk.', 'on', 'The desk is a surface.'),
    fill('r-3', 'We usually go away ___ August.', 'in', 'Use in with months.'),
    fill('r-4', 'The meeting starts ___ six o’clock.', 'at', 'Use at with clock times.'),
    fill('r-5', 'I enjoy ___ books. (read)', 'reading', 'Enjoy takes the -ing form.'),
    fill('r-6', 'She would like ___ French. (learn)', 'to learn', 'Would like takes to + base verb.'),
    sentence('r-7', 'always / my sister / gets up early', 'My sister always gets up early.', 'Place always between subject and verb.'),
  ],
};

export const TEST_GROUP_IDS = ['testA', 'testB', 'testC', 'testD'] as const;
export const LESSON_GROUP_IDS = ['p25','p27','p28a','p28b','p29a','p29b','p30'] as const;
