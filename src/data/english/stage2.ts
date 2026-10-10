/** Stage 2, source PDF pages 49–62. All printed Practice sections are represented.
 * Suggested answers are editorial; the scanned pages provide examples, not an answer key.
 * [[n]] marks an individual answer input. A source sentence may contain several.
 */
export type Stage2Gap = { answers: string[]; explanation: string; options?: string[] };
export type Stage2Question = { number: number; template: string; gaps: Stage2Gap[]; mode: 'fill' | 'choice' | 'sentence' | 'self' | 'display'; sourceGiven?: boolean };
export type Stage2Group = { id: string; title: string; sourcePage: number; instruction: string; hint: string; questions: Stage2Question[] };
export const stage2Groups: Record<string, Stage2Group> = {
  "p31": {
    "id": "p31",
    "title": "Practice 31",
    "sourcePage": 49,
    "instruction": "Complete the 10 sentences using a, an or the.",
    "hint": "A/an introduces a singular countable noun; the identifies a particular person or thing.",
    "questions": [
      {
        "number": 1,
        "template": "I've got [[1]] lighter and [[2]] box of matches but [[3]] lighter doesn't work very well.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "There's [[1]] doctor and [[2]] nurse in [[3]] village but [[4]] doctor's getting rather old now.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "I bought [[1]] sandwich and [[2]] piece of cake. [[3]] sandwich was all right but [[4]] cake was horrible.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "[[1]] woman and two men were here a few moments ago. I think [[2]] woman wanted to see you.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "They've got [[1]] dog and [[2]] cat, [[3]] rabbit and some goldfish but the children like [[4]] dog best.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "He sent me two letters and [[1]] postcard while he was on holiday. [[2]] postcard didn't say much but [[3]] letters were very interesting.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "You can have [[1]] apple or [[2]] orange. [[3]] apples are nice and sweet.",
        "gaps": [
          {
            "answers": [
              "an"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "an"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "There's [[1]] plum tree and [[2]] peach tree in our garden. [[3]] peach tree doesn't produce many peaches but [[4]] plum tree produces lots of plums every year.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "There's [[1]] theatre and two cinemas in town but one of [[2]] cinemas is closing down.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "There's [[1]] train at 2.00 and one at 3.30. [[2]] 2.00 train takes two hours and [[3]] 3.30 train takes [[4]] hour and [[5]] half.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "an"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p32": {
    "id": "p32",
    "title": "Practice 32",
    "sourcePage": 50,
    "instruction": "Complete the 10 sentences using a, an or the.",
    "hint": "The identifies something both speaker and listener can recognize.",
    "questions": [
      {
        "number": 1,
        "template": "This is [[1]] beautiful painting. Does [[2]] artist live near here?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "I bought [[1]] new toothbrush this morning and I can't find it. I'm sure I put it in [[2]] bathroom.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "Can you get [[1]] fresh cream cake when you're out? [[2]] shop on [[3]] corner usually sells them.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "It's [[1]] very nice school and [[2]] teachers are all really hard-working.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "'Look! There's [[1]] cat in [[2]] garden.' 'Yes, it's [[3]] cat from next door.'",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "'There's [[1]] man at [[2]] door. He wants to see you.'",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "We stayed in [[1]] very nice hotel. [[2]] room was comfortable and [[3]] food was excellent.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "I bought Elliot [[1]] new jacket last week but yesterday two of [[2]] buttons came off. I'm taking it back to [[3]] shop.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "I had [[1]] bath this morning but [[2]] water was a bit cold.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "Hannah was at [[1]] airport, waiting for [[2]] friend to arrive.",
        "gaps": [
          {
            "answers": [
              "the"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p33": {
    "id": "p33",
    "title": "Practice 33",
    "sourcePage": 51,
    "instruction": "Rewrite all 10 sentences, adding the where necessary.",
    "hint": "The source includes two worked examples (1 and 2). Do not add the before Rome or Sweden.",
    "questions": [
      {
        "number": 1,
        "template": "Moon moves slowly round earth.",
        "gaps": [
          {
            "answers": [
              "The moon moves slowly round the earth."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 2,
        "template": "Sun is very hot today.",
        "gaps": [
          {
            "answers": [
              "The sun is very hot today."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 3,
        "template": "Did you see Pope when you went to Rome?",
        "gaps": [
          {
            "answers": [
              "Did you see the Pope when you went to Rome?"
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 4,
        "template": "Sky went very grey and it started to rain.",
        "gaps": [
          {
            "answers": [
              "The sky went very grey and it started to rain."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 5,
        "template": "I hope I can go round world one day.",
        "gaps": [
          {
            "answers": [
              "I hope I can go round the world one day."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 6,
        "template": "Prince of Wales is visiting our town next week.",
        "gaps": [
          {
            "answers": [
              "The Prince of Wales is visiting our town next week."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 7,
        "template": "What is capital of Sweden?",
        "gaps": [
          {
            "answers": [
              "What is the capital of Sweden?"
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 8,
        "template": "It was very cold in sea today.",
        "gaps": [
          {
            "answers": [
              "It was very cold in the sea today."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 9,
        "template": "How many countries are in European Community?",
        "gaps": [
          {
            "answers": [
              "How many countries are in the European Community?"
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 10,
        "template": "I once met Prime Minister of Spain.",
        "gaps": [
          {
            "answers": [
              "I once met the Prime Minister of Spain."
            ],
            "explanation": "Use the for the unique or context-specific thing; keep most place names without it."
          }
        ],
        "mode": "sentence"
      }
    ]
  },
  "p34": {
    "id": "p34",
    "title": "Practice 34",
    "sourcePage": 52,
    "instruction": "Mark C for countable and U for uncountable nouns.",
    "hint": "Classify each noun as used in the source exercise.",
    "questions": [
      {
        "number": 1,
        "template": "paper → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 2,
        "template": "coffee → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 3,
        "template": "cassette → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 4,
        "template": "information → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 5,
        "template": "bottle → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 6,
        "template": "soup → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 7,
        "template": "pen → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 8,
        "template": "metal → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 9,
        "template": "book → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 10,
        "template": "rice → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 11,
        "template": "spaghetti → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 12,
        "template": "child → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 13,
        "template": "milk → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 14,
        "template": "news → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 15,
        "template": "job → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 16,
        "template": "homework → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 17,
        "template": "apple → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 18,
        "template": "toothpaste → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 19,
        "template": "bath → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 20,
        "template": "salt → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 21,
        "template": "girl → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 22,
        "template": "money → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 23,
        "template": "knife → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 24,
        "template": "egg → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 25,
        "template": "table → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 26,
        "template": "shampoo → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 27,
        "template": "coat → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 28,
        "template": "water → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 29,
        "template": "tea → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 30,
        "template": "flour → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 31,
        "template": "bread → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 32,
        "template": "bag → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 33,
        "template": "ball → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 34,
        "template": "soap → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 35,
        "template": "food → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 36,
        "template": "cup → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 37,
        "template": "cat → [[1]]",
        "gaps": [
          {
            "answers": [
              "C"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 38,
        "template": "meat → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 39,
        "template": "honey → [[1]]",
        "gaps": [
          {
            "answers": [
              "U"
            ],
            "options": [
              "C",
              "U"
            ],
            "explanation": "C = countable; U = uncountable."
          }
        ],
        "mode": "choice"
      }
    ]
  },
  "p35": {
    "id": "p35",
    "title": "Practice 35",
    "sourcePage": 53,
    "instruction": "Choose a word from the box for each of the 10 illustrated objects.",
    "hint": "Word box: tube, loaf, bottle, glass, bag, jar, tin, carton, slice, bar. Use each once.",
    "questions": [
      {
        "number": 1,
        "template": "a [[1]] of shampoo.",
        "gaps": [
          {
            "answers": [
              "bottle"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "a [[1]] of soup.",
        "gaps": [
          {
            "answers": [
              "tin"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "a [[1]] of sugar.",
        "gaps": [
          {
            "answers": [
              "bag"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "a [[1]] of bread.",
        "gaps": [
          {
            "answers": [
              "loaf"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "a [[1]] of juice.",
        "gaps": [
          {
            "answers": [
              "carton"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "a [[1]] of soap.",
        "gaps": [
          {
            "answers": [
              "bar"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "a [[1]] of toothpaste.",
        "gaps": [
          {
            "answers": [
              "tube"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "a [[1]] of water.",
        "gaps": [
          {
            "answers": [
              "glass"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "a [[1]] of honey.",
        "gaps": [
          {
            "answers": [
              "jar"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "a [[1]] of bread.",
        "gaps": [
          {
            "answers": [
              "slice"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p36": {
    "id": "p36",
    "title": "Practice 36",
    "sourcePage": 54,
    "instruction": "Complete using a, an or some.",
    "hint": "Some goes with plural countable nouns and uncountable nouns; a/an with singular countable nouns.",
    "questions": [
      {
        "number": 1,
        "template": "I would like [[1]] soup, please.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "Is there [[1]] bank near here?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "They drank [[1]] milk and then went to bed.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "Would you like [[1]] apple?",
        "gaps": [
          {
            "answers": [
              "an"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "There's [[1]] rice in the cupboard.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "Did you get [[1]] bottle of lemonade?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "Here's [[1]] money to buy your lunch.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "Karen's starting [[1]] new job next week.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "There's [[1]] butter in the fridge.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "I usually have [[1]] cup of tea in the morning.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p37a": {
    "id": "p37a",
    "title": "Practice 37a",
    "sourcePage": 55,
    "instruction": "Complete using a, an, some or any.",
    "hint": "Any is usual in questions/negatives; some is usual in positives, offers and requests.",
    "questions": [
      {
        "number": 1,
        "template": "Have you got [[1]] juice in the fridge?",
        "gaps": [
          {
            "answers": [
              "any"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "There are [[1]] letters on the floor.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "I had [[1]] cup of tea but I didn't have [[2]] toast.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "any"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "You need [[1]] flour and [[2]] egg.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "an"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "I'd like [[1]] rice but I don't want [[2]] potatoes.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "any"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "Would you like [[1]] bowl of soup?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "He gave me [[1]] tea but he didn't put [[2]] sugar in it.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "any"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "There are [[1]] nice trees in the garden but there aren't [[2]] flowers.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "any"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "Can I have [[1]] glass of orange juice?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "There are [[1]] knives and forks on the table but there isn't [[2]] salt or pepper.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "any"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p37b": {
    "id": "p37b",
    "title": "Practice 37b",
    "sourcePage": 56,
    "instruction": "Choose the correct word at all 23 places in the restaurant conversation.",
    "hint": "The full exchange and speaker labels are preserved. A = customer; B = companion; W = waiter.",
    "questions": [
      {
        "number": 1,
        "template": "A: This is [[1]] nice restaurant. What's [[2]] food like?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "the"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 2,
        "template": "R: Well, I came here last month with Jeremy and [[1]] food was very good.",
        "gaps": [
          {
            "answers": [
              "the"
            ],
            "options": [
              "the",
              "some"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 3,
        "template": "A: Oh good. Ah, here's [[1]] waiter.",
        "gaps": [
          {
            "answers": [
              "the"
            ],
            "options": [
              "the",
              "some"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 4,
        "template": "W: Good evening. Would you like to order?",
        "gaps": [],
        "mode": "display"
      },
      {
        "number": 5,
        "template": "A: Yes, please. Have you got [[1]] fresh fish tonight?",
        "gaps": [
          {
            "answers": [
              "any"
            ],
            "options": [
              "some",
              "any"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 6,
        "template": "W: Yes, we've got [[1]] very good fish. The fishermen brought them in this morning.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "options": [
              "some",
              "a"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 7,
        "template": "A: Ah, good. Well, I'd like [[1]] fish, please.",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "options": [
              "some",
              "any"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 8,
        "template": "W: And would you like [[1]] vegetables with your fish?",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "options": [
              "some",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 9,
        "template": "A: Yes, please.",
        "gaps": [],
        "mode": "display"
      },
      {
        "number": 10,
        "template": "W: And what about [[1]] starter? There's [[2]] very good vegetable soup and [[3]] delicious fish soup.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "options": [
              "some",
              "a"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "some"
            ],
            "options": [
              "some",
              "any"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "some"
            ],
            "options": [
              "some",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 11,
        "template": "A: No, thank you. I don't want [[1]] soup.",
        "gaps": [
          {
            "answers": [
              "any"
            ],
            "options": [
              "some",
              "any"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 12,
        "template": "W: And would you like [[1]] drink?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 13,
        "template": "A: Yes, I'd like [[1]] glass of fruit juice before [[2]] meal, please. And then can we have [[3]] mineral water with the meal?",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "the"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "some"
            ],
            "options": [
              "any",
              "some"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 14,
        "template": "W: Yes, of course. And for you madam?",
        "gaps": [],
        "mode": "display"
      },
      {
        "number": 15,
        "template": "R: Well, I don't want [[1]] starter but I'll have [[2]] glass of fruit juice too and then I'll have [[3]] spaghetti with tomato sauce.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "a"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          },
          {
            "answers": [
              "some"
            ],
            "options": [
              "a",
              "some"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 16,
        "template": "W: Fine. Anything else?",
        "gaps": [],
        "mode": "display"
      },
      {
        "number": 17,
        "template": "R: Oh yes, please. I'd like [[1]] bowl of salad.",
        "gaps": [
          {
            "answers": [
              "a"
            ],
            "options": [
              "a",
              "some"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 18,
        "template": "W: Yes, certainly. And would you like [[1]] bread?",
        "gaps": [
          {
            "answers": [
              "some"
            ],
            "options": [
              "a",
              "some"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 19,
        "template": "R: Yes, please. And is there [[1]] butter with the bread?",
        "gaps": [
          {
            "answers": [
              "any"
            ],
            "options": [
              "some",
              "any"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 20,
        "template": "W: Yes, there is. So is that all for now?",
        "gaps": [],
        "mode": "display"
      },
      {
        "number": 21,
        "template": "A: Yes. I just have one question. Where's [[1]] toilet, please?",
        "gaps": [
          {
            "answers": [
              "the"
            ],
            "options": [
              "a",
              "the"
            ],
            "explanation": "Use the article or determiner that fits this dialogue."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 22,
        "template": "W: Over there on your right.",
        "gaps": [],
        "mode": "display"
      },
      {
        "number": 23,
        "template": "A: Thanks.",
        "gaps": [],
        "mode": "display"
      }
    ]
  },
  "p38a": {
    "id": "p38a",
    "title": "Practice 38a",
    "sourcePage": 57,
    "instruction": "Write the adverb form of all 18 adjectives.",
    "hint": "Remember good → well, hard → hard and easy → easily.",
    "questions": [
      {
        "number": 1,
        "template": "soft → [[1]]",
        "gaps": [
          {
            "answers": [
              "softly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "quick → [[1]]",
        "gaps": [
          {
            "answers": [
              "quickly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "angry → [[1]]",
        "gaps": [
          {
            "answers": [
              "angrily"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "slow → [[1]]",
        "gaps": [
          {
            "answers": [
              "slowly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "nice → [[1]]",
        "gaps": [
          {
            "answers": [
              "nicely"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "quiet → [[1]]",
        "gaps": [
          {
            "answers": [
              "quietly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "calm → [[1]]",
        "gaps": [
          {
            "answers": [
              "calmly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "easy → [[1]]",
        "gaps": [
          {
            "answers": [
              "easily"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "perfect → [[1]]",
        "gaps": [
          {
            "answers": [
              "perfectly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "polite → [[1]]",
        "gaps": [
          {
            "answers": [
              "politely"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 11,
        "template": "bad → [[1]]",
        "gaps": [
          {
            "answers": [
              "badly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 12,
        "template": "beautiful → [[1]]",
        "gaps": [
          {
            "answers": [
              "beautifully"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 13,
        "template": "hard → [[1]]",
        "gaps": [
          {
            "answers": [
              "hard"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 14,
        "template": "sad → [[1]]",
        "gaps": [
          {
            "answers": [
              "sadly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 15,
        "template": "careful → [[1]]",
        "gaps": [
          {
            "answers": [
              "carefully"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 16,
        "template": "good → [[1]]",
        "gaps": [
          {
            "answers": [
              "well"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 17,
        "template": "fast → [[1]]",
        "gaps": [
          {
            "answers": [
              "fast"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 18,
        "template": "clear → [[1]]",
        "gaps": [
          {
            "answers": [
              "clearly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p38b": {
    "id": "p38b",
    "title": "Practice 38b",
    "sourcePage": 57,
    "instruction": "Choose an adverb from Practice 38a to complete all 10 sentences.",
    "hint": "Answers have been suggested from the exercise vocabulary; some contexts can admit other natural adverbs.",
    "questions": [
      {
        "number": 1,
        "template": "I think you're working too [[1]]. You need a holiday.",
        "gaps": [
          {
            "answers": [
              "hard"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "She sang [[1]].",
        "gaps": [
          {
            "answers": [
              "beautifully"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "You speak German [[1]] – just like a German.",
        "gaps": [
          {
            "answers": [
              "perfectly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "Please talk [[1]]. I don't want the baby to wake up.",
        "gaps": [
          {
            "answers": [
              "quietly",
              "softly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "She had no problems at all with the exam. She passed it [[1]].",
        "gaps": [
          {
            "answers": [
              "easily"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "Don't drive so [[1]]. It's dangerous.",
        "gaps": [
          {
            "answers": [
              "fast"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "I understood what to do because she explained everything very [[1]].",
        "gaps": [
          {
            "answers": [
              "clearly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "Please carry the glasses [[1]]. They were very expensive.",
        "gaps": [
          {
            "answers": [
              "carefully"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "She didn't cry or scream. She just listened very [[1]] when I told her the terrible news.",
        "gaps": [
          {
            "answers": [
              "quietly",
              "calmly"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "I asked him very [[1]] but he refused.",
        "gaps": [
          {
            "answers": [
              "politely"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p38c": {
    "id": "p38c",
    "title": "Practice 38c",
    "sourcePage": 58,
    "instruction": "Rewrite all 10 descriptions using a verb and an adverb.",
    "hint": "The source provides worked examples for 1 and 2.",
    "questions": [
      {
        "number": 1,
        "template": "They're slow workers.",
        "gaps": [
          {
            "answers": [
              "They work slowly."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 2,
        "template": "He's a dangerous driver.",
        "gaps": [
          {
            "answers": [
              "He drives dangerously."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 3,
        "template": "She's a careful writer.",
        "gaps": [
          {
            "answers": [
              "She writes carefully."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 4,
        "template": "I'm a loud singer.",
        "gaps": [
          {
            "answers": [
              "I sing loudly."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 5,
        "template": "She's a fast swimmer.",
        "gaps": [
          {
            "answers": [
              "She swims fast."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 6,
        "template": "He's a bad actor.",
        "gaps": [
          {
            "answers": [
              "He acts badly."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 7,
        "template": "Jill's a beautiful painter.",
        "gaps": [
          {
            "answers": [
              "Jill paints beautifully."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 8,
        "template": "You're a terrible dancer.",
        "gaps": [
          {
            "answers": [
              "You dance terribly."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 9,
        "template": "They're good teachers.",
        "gaps": [
          {
            "answers": [
              "They teach well."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      },
      {
        "number": 10,
        "template": "John's a patient listener.",
        "gaps": [
          {
            "answers": [
              "John listens patiently."
            ],
            "explanation": "Change the adjective describing the person into an adverb describing the action."
          }
        ],
        "mode": "sentence"
      }
    ]
  },
  "p38d": {
    "id": "p38d",
    "title": "Practice 38d",
    "sourcePage": 58,
    "instruction": "Choose the correct adjective or adverb in each sentence.",
    "hint": "Use adjectives to describe nouns and adverbs to describe actions.",
    "questions": [
      {
        "number": 1,
        "template": "This music is too [[1]]. We can't talk.",
        "gaps": [
          {
            "answers": [
              "loud"
            ],
            "options": [
              "loud",
              "loudly"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 2,
        "template": "She played [[1]] and she lost the game.",
        "gaps": [
          {
            "answers": [
              "badly"
            ],
            "options": [
              "bad",
              "badly"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 3,
        "template": "We waited [[1]] for the letter but it never came.",
        "gaps": [
          {
            "answers": [
              "patiently"
            ],
            "options": [
              "patient",
              "patiently"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 4,
        "template": "Please don't be [[1]] with him.",
        "gaps": [
          {
            "answers": [
              "angry"
            ],
            "options": [
              "angry",
              "angrily"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 5,
        "template": "She asks [[1]] questions.",
        "gaps": [
          {
            "answers": [
              "intelligent"
            ],
            "options": [
              "intelligent",
              "intelligently"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 6,
        "template": "The children are playing together very [[1]] today.",
        "gaps": [
          {
            "answers": [
              "nicely"
            ],
            "options": [
              "nice",
              "nicely"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 7,
        "template": "She's a very [[1]] person and everyone likes her.",
        "gaps": [
          {
            "answers": [
              "warm"
            ],
            "options": [
              "warm",
              "warmly"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 8,
        "template": "She surprised me when she opened the door [[1]].",
        "gaps": [
          {
            "answers": [
              "suddenly"
            ],
            "options": [
              "sudden",
              "suddenly"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 9,
        "template": "You speak English very [[1]].",
        "gaps": [
          {
            "answers": [
              "well"
            ],
            "options": [
              "good",
              "well"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      },
      {
        "number": 10,
        "template": "It's [[1]] to swim in the sea here.",
        "gaps": [
          {
            "answers": [
              "dangerous"
            ],
            "options": [
              "dangerous",
              "dangerously"
            ],
            "explanation": "The word modifies the noun, adjective or action shown in the sentence."
          }
        ],
        "mode": "choice"
      }
    ]
  },
  "p39a": {
    "id": "p39a",
    "title": "Practice 39a",
    "sourcePage": 60,
    "instruction": "Write the comparative form of all 30 adjectives.",
    "hint": "One syllable: -er; consonant + y: -ier; long adjectives: more; irregular: good → better, bad → worse.",
    "questions": [
      {
        "number": 1,
        "template": "happy → [[1]]",
        "gaps": [
          {
            "answers": [
              "happier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "difficult → [[1]]",
        "gaps": [
          {
            "answers": [
              "more difficult"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "clean → [[1]]",
        "gaps": [
          {
            "answers": [
              "cleaner"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "early → [[1]]",
        "gaps": [
          {
            "answers": [
              "earlier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "beautiful → [[1]]",
        "gaps": [
          {
            "answers": [
              "more beautiful"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "soft → [[1]]",
        "gaps": [
          {
            "answers": [
              "softer"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "intelligent → [[1]]",
        "gaps": [
          {
            "answers": [
              "more intelligent"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "dirty → [[1]]",
        "gaps": [
          {
            "answers": [
              "dirtier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "good → [[1]]",
        "gaps": [
          {
            "answers": [
              "better"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "careful → [[1]]",
        "gaps": [
          {
            "answers": [
              "more careful"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 11,
        "template": "cheap → [[1]]",
        "gaps": [
          {
            "answers": [
              "cheaper"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 12,
        "template": "strong → [[1]]",
        "gaps": [
          {
            "answers": [
              "stronger"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 13,
        "template": "interesting → [[1]]",
        "gaps": [
          {
            "answers": [
              "more interesting"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 14,
        "template": "hot → [[1]]",
        "gaps": [
          {
            "answers": [
              "hotter"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 15,
        "template": "warm → [[1]]",
        "gaps": [
          {
            "answers": [
              "warmer"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 16,
        "template": "expensive → [[1]]",
        "gaps": [
          {
            "answers": [
              "more expensive"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 17,
        "template": "fresh → [[1]]",
        "gaps": [
          {
            "answers": [
              "fresher"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 18,
        "template": "kind → [[1]]",
        "gaps": [
          {
            "answers": [
              "kinder"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 19,
        "template": "boring → [[1]]",
        "gaps": [
          {
            "answers": [
              "more boring"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 20,
        "template": "cold → [[1]]",
        "gaps": [
          {
            "answers": [
              "colder"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 21,
        "template": "honest → [[1]]",
        "gaps": [
          {
            "answers": [
              "more honest"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 22,
        "template": "busy → [[1]]",
        "gaps": [
          {
            "answers": [
              "busier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 23,
        "template": "young → [[1]]",
        "gaps": [
          {
            "answers": [
              "younger"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 24,
        "template": "near → [[1]]",
        "gaps": [
          {
            "answers": [
              "nearer"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 25,
        "template": "funny → [[1]]",
        "gaps": [
          {
            "answers": [
              "funnier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 26,
        "template": "easy → [[1]]",
        "gaps": [
          {
            "answers": [
              "easier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 27,
        "template": "bad → [[1]]",
        "gaps": [
          {
            "answers": [
              "worse"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 28,
        "template": "late → [[1]]",
        "gaps": [
          {
            "answers": [
              "later"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 29,
        "template": "dangerous → [[1]]",
        "gaps": [
          {
            "answers": [
              "more dangerous"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 30,
        "template": "weak → [[1]]",
        "gaps": [
          {
            "answers": [
              "weaker"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p39b": {
    "id": "p39b",
    "title": "Practice 39b",
    "sourcePage": 60,
    "instruction": "Complete all 15 sentences using a comparative and than.",
    "hint": "Include than in your answer, even where the blank is long.",
    "questions": [
      {
        "number": 1,
        "template": "She's much [[1]] her husband. (young)",
        "gaps": [
          {
            "answers": [
              "younger than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 2,
        "template": "It's a [[1]] day [[2]] yesterday. (warm)",
        "gaps": [
          {
            "answers": [
              "warmer"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 3,
        "template": "The vegetables in this shop are [[1]] the ones in the supermarket. (fresh)",
        "gaps": [
          {
            "answers": [
              "fresher than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 4,
        "template": "The train is [[1]] the bus. (expensive)",
        "gaps": [
          {
            "answers": [
              "more expensive than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 5,
        "template": "This new TV programme is much [[1]] the old one. (funny)",
        "gaps": [
          {
            "answers": [
              "funnier than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 6,
        "template": "Ms Davies is a [[1]] teacher [[2]] Mr Andrews. (good)",
        "gaps": [
          {
            "answers": [
              "better"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 7,
        "template": "My office is [[1]] Helen's. (near)",
        "gaps": [
          {
            "answers": [
              "nearer than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 8,
        "template": "The traffic is [[1]] it was last year. (noisy)",
        "gaps": [
          {
            "answers": [
              "noisier than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 9,
        "template": "You have a [[1]] life [[2]] I have. (busy)",
        "gaps": [
          {
            "answers": [
              "busier"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 10,
        "template": "Drivers in this country are [[1]] drivers in my country. (careless)",
        "gaps": [
          {
            "answers": [
              "more careless than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 11,
        "template": "The exam today was [[1]] last year's exam. (difficult)",
        "gaps": [
          {
            "answers": [
              "more difficult than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 12,
        "template": "She's much [[1]] her sister. (kind)",
        "gaps": [
          {
            "answers": [
              "kinder than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 13,
        "template": "The North is [[1]] the South. (rich)",
        "gaps": [
          {
            "answers": [
              "richer than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 14,
        "template": "The students ask [[1]] questions [[2]] they did before. (intelligent)",
        "gaps": [
          {
            "answers": [
              "more intelligent"
            ],
            "explanation": "Apply the rule taught in this lesson."
          },
          {
            "answers": [
              "than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      },
      {
        "number": 15,
        "template": "Her second book is [[1]] her first. (interesting)",
        "gaps": [
          {
            "answers": [
              "more interesting than"
            ],
            "explanation": "Apply the rule taught in this lesson."
          }
        ],
        "mode": "fill"
      }
    ]
  },
  "p39c": {
    "id": "p39c",
    "title": "Practice 39c",
    "sourcePage": 61,
    "instruction": "Compare the Grand Hotel and Sea View Hotel in all 14 sentences, using the adjectives from the box.",
    "hint": "Read both hotel descriptions. The first two examples are printed in the source; compare your own remaining sentences to suggested answers.",
    "questions": [
      {
        "number": 1,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is more beautiful than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": true
      },
      {
        "number": 2,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is more central than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": true
      },
      {
        "number": 3,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is bigger than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 4,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is more comfortable than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 5,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is cleaner than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 6,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is warmer than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 7,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is noisier than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 8,
        "template": "The Grand Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Grand Hotel is more expensive than the Sea View Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 9,
        "template": "The Sea View Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Sea View Hotel is smaller than the Grand Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 10,
        "template": "The views from the Sea View Hotel ...",
        "gaps": [
          {
            "answers": [
              "The views from the Sea View Hotel are lovelier than those from the Grand Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 11,
        "template": "The Sea View Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Sea View Hotel is more peaceful than the Grand Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 12,
        "template": "The Sea View Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Sea View Hotel is cheaper than the Grand Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 13,
        "template": "The staff in the Sea View Hotel ...",
        "gaps": [
          {
            "answers": [
              "The staff in the Sea View Hotel are friendlier than the staff in the Grand Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      },
      {
        "number": 14,
        "template": "The Sea View Hotel ...",
        "gaps": [
          {
            "answers": [
              "The Sea View Hotel is colder than the Grand Hotel."
            ],
            "explanation": "Suggested comparison using the hotel descriptions."
          }
        ],
        "mode": "self",
        "sourceGiven": false
      }
    ]
  }
} as Record<string, Stage2Group>;
export const stage2Totals = Object.fromEntries(Object.entries(stage2Groups).map(([id, group]) => [id, group.questions.reduce((n, q) => n + q.gaps.length, 0)]));
