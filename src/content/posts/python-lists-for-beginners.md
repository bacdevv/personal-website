---
title: "Python Lists Explained: A Practical Guide for Beginners"
description: "Learn Python lists step by step: indexing, slicing, adding and removing items, loops, comprehensions, sorting, copying, and common mistakes."
pubDatetime: 2026-10-09T13:00:00+07:00
draft: false
featured: false
tags:
  - python
  - programming
  - beginners
  - data-structures
---

# Python Lists Explained: A Practical Guide for Beginners

When you start programming in Python, one of the first data structures you will use is the **list**. Lists make it easy to store multiple values, process them in a loop, and build small applications without creating a separate variable for every item.

In this guide, we will start with the basics, explore the operations you will use most often, and finish with a small to-do list program. Each Python example is self-contained, so you can experiment with it in the **Edit & Run** panel on this blog.

## 1. What is a Python list?

A **list** is an ordered, mutable collection. In simple terms:

- **Ordered:** Items keep their positions, starting at index `0`.
- **Mutable:** You can change, add, and remove items.
- **Flexible:** A list may contain different types, although using one type is often clearer.
- **Duplicates allowed:** The same value can appear more than once.

Create a list with square brackets:

```python
languages = ["Python", "Java", "JavaScript"]
scores = [8, 9, 10, 9]
empty_list = []

print(languages)
print(scores)
print(len(languages))
print(empty_list)
```

`len()` returns the number of items, not the last valid index. For a list of three items, the indices are `0`, `1`, and `2`.

## 2. Access items with indexing

Use an index to retrieve an item. Negative indices count backward from the end.

```python
fruits = ["apple", "banana", "cherry", "mango"]

print(fruits[0])    # apple
print(fruits[2])    # cherry
print(fruits[-1])   # mango
print(fruits[-2])   # cherry
```

A common beginner mistake is assuming that the first item has index `1`. Python starts at `0`. Accessing an index that does not exist raises `IndexError`.

When an item may not exist, check the length first:

```python
names = ["Linh", "An"]
position = 3

if 0 <= position < len(names):
    print(names[position])
else:
    print("There is no item at that position.")
```

## 3. Modify, append, extend, and insert

Because lists are mutable, you can replace an item directly. There are three common ways to add items:

- `append(x)` adds **one item** at the end.
- `extend(items)` adds **each item** from another iterable.
- `insert(i, x)` places an item at a given position.

```python
tasks = ["Read", "Study"]

tasks[0] = "Read Python"
tasks.append("Exercise")
tasks.extend(["Practice Java", "Review notes"])
tasks.insert(1, "Take a break")

print(tasks)
print("Number of tasks:", len(tasks))
```

Watch the difference between `append()` and `extend()`:

```python
first = [1, 2]
second = [1, 2]

first.append([3, 4])
second.extend([3, 4])

print(first)   # [1, 2, [3, 4]]
print(second)  # [1, 2, 3, 4]
```

`append([3, 4])` creates a **nested list** as the final item. `extend([3, 4])` adds two separate numbers.

## 4. Remove items safely

Choose the removal method based on what you know:

| Method | What it does |
| --- | --- |
| `remove(value)` | Deletes the first matching value |
| `pop(index)` | Removes and returns an item at an index |
| `pop()` | Removes and returns the last item |
| `del items[index]` | Deletes an item without returning it |
| `clear()` | Removes every item |

```python
colors = ["red", "blue", "green", "blue"]

colors.remove("blue")
last_color = colors.pop()

print(colors)       # ['red', 'green']
print(last_color)   # blue

colors.clear()
print(colors)       # []
```

`remove()` raises `ValueError` when the value is absent; `pop()` raises `IndexError` if the list is empty. Check before calling them:

```python
shopping = ["milk", "bread"]

if "eggs" in shopping:
    shopping.remove("eggs")
else:
    print("Eggs are not in the list.")

if shopping:
    print("Removed:", shopping.pop())
```

## 5. Slicing: select part of a list

Slicing follows this pattern: `items[start:stop:step]`. The `stop` position is **excluded**.

```python
numbers = [10, 20, 30, 40, 50, 60]

print(numbers[1:4])  # [20, 30, 40]
print(numbers[:3])   # [10, 20, 30]
print(numbers[3:])   # [40, 50, 60]
print(numbers[::2])  # [10, 30, 50]
print(numbers[::-1]) # [60, 50, 40, 30, 20, 10]
```

Slicing returns a **new list**, but it is a *shallow copy*: objects inside it may still be shared. We will see why that matters in Section 9.

## 6. Loop through lists

Use a `for` loop when you want each item. Use `enumerate()` when you also need its index.

```python
students = ["Alice", "Bob", "Charlie"]

for student in students:
    print("Hello,", student)

print("--- Numbered ---")
for position, student in enumerate(students, start=1):
    print(f"{position}. {student}")
```

Use `in` to check whether a value is present:

```python
subjects = ["Python", "Java", "Math"]

if "Python" in subjects:
    print("Python is on the study plan!")
```

## 7. List comprehensions: build lists concisely

A **list comprehension** creates a new list by transforming or filtering values from an iterable.

```python
numbers = [1, 2, 3, 4, 5, 6]

squares = [n * n for n in numbers]
even_numbers = [n for n in numbers if n % 2 == 0]

print("Squares:", squares)
print("Even numbers:", even_numbers)
```

Compare that with an ordinary loop:

```python
numbers = [1, 2, 3, 4]
doubled = []

for number in numbers:
    doubled.append(number * 2)

print(doubled)
print([number * 2 for number in numbers])
```

Both approaches work. Prefer whichever is clearer; a complicated comprehension is usually harder to read than a simple loop.

## 8. Sorting and useful built-in functions

`sort()` changes the original list **in place**. `sorted()` returns a **new sorted list**.

```python
scores = [75, 92, 60, 85]

print("Sorted copy:", sorted(scores))
print("Original:", scores)

scores.sort(reverse=True)
print("Descending:", scores)
print("Highest:", max(scores))
print("Lowest:", min(scores))
print("Total:", sum(scores))
```

To sort strings without considering capitalization, pass a `key` function:

```python
names = ["zoe", "Alice", "bob"]
print(sorted(names, key=str.lower))
```

**Important:** `sort()` returns `None`, not the sorted list. Avoid writing `result = scores.sort()` if you intend to store the result.

## 9. Copying lists: the aliasing trap

The assignment `b = a` does **not** copy a list. It makes both names refer to the same list object.

```python
original = ["Python", "Java"]
alias = original
independent = original.copy()

alias.append("C++")

print("Original:", original)
print("Alias:", alias)
print("Copy:", independent)
```

A shallow copy is enough for many lists of strings and numbers. For nested mutable items, the inner lists are still shared:

```python
grid = [[1, 2], [3, 4]]
shallow = grid.copy()

shallow[0][0] = 99
print(grid)  # [[99, 2], [3, 4]]
```

If you need independent nested objects, consider `copy.deepcopy()`:

```python
from copy import deepcopy

grid = [[1, 2], [3, 4]]
separate = deepcopy(grid)
separate[0][0] = 99

print("Original:", grid)
print("Independent:", separate)
```

## 10. Common mistakes to avoid

### Mistake A: Changing a list while iterating over it

Removing items from the same list during iteration can skip values. Create a filtered list instead:

```python
values = [1, 2, 2, 3, 4, 4, 5]
values = [value for value in values if value % 2 != 0]
print(values)  # [1, 3, 5]
```

### Mistake B: Repeating nested lists with `*`

This creates shared inner lists:

```python
bad_grid = [[0] * 3] * 2
bad_grid[0][0] = 7
print(bad_grid)  # Both rows changed

good_grid = [[0] * 3 for _ in range(2)]
good_grid[0][0] = 7
print(good_grid) # Only the first row changed
```

### Mistake C: Using a mutable default argument

A default list can be reused across function calls. Use `None` when you want a fresh list per call:

```python
def add_topic(topic, topics=None):
    if topics is None:
        topics = []
    topics.append(topic)
    return topics

print(add_topic("Lists"))
print(add_topic("Dictionaries"))
```

## 11. Mini-project: a simple to-do list

Let's combine `append()`, `enumerate()`, `pop()`, and `len()` into one small program. This version uses no interactive input, so you can press **Run** and immediately see the result.

```python
todo = []

def add_task(task):
    todo.append(task)

def complete_task(position):
    if 0 <= position < len(todo):
        finished = todo.pop(position)
        print("Completed:", finished)
    else:
        print("Invalid task number")

def show_tasks():
    print("Your to-do list:")
    for number, task in enumerate(todo, start=1):
        print(f"{number}. {task}")

add_task("Learn list indexing")
add_task("Practice list comprehensions")
add_task("Build a Python project")
show_tasks()

complete_task(1)  # Positions start at 0
show_tasks()
```

**Challenge:** Extend the program with `find_task(keyword)` and `remove_task(task_name)` functions. What happens if the task does not exist?

## 12. When should you use a list?

Use a list when you need a sequence, want to preserve insertion order, need to access items by index, or expect to add/remove elements.

| Structure | Best suited for |
| --- | --- |
| `list` | Ordered, changeable sequence; duplicates allowed |
| `tuple` | Ordered sequence that should not be changed |
| `set` | Unique hashable items and fast membership checks on average |
| `dict` | Look up values using keys |

**Performance intuition:** Indexing a list is generally `O(1)`. Appending is amortized `O(1)`. Searching, inserting, or removing near the beginning can take `O(n)`. Don't worry about memorizing every complexity yet; choose the simplest data structure that fits your task.

## Practice exercises

1. Create a list of five favorite programming languages and print the first and last items.
2. Given `[12, 5, 8, 21, 4]`, make a new list containing only numbers greater than `7`.
3. Write a function that returns the average of a non-empty list of numbers.
4. Remove duplicates from a list **while keeping their first-seen order**.
5. Extend the to-do mini-project to mark tasks as completed without removing them.

## Final thoughts

Python lists are simple to start with, but understanding **mutation**, **slicing**, **copying**, and **list comprehensions** will help you avoid bugs in larger programs. Try changing the examples rather than only reading them: replace values, add more items, and predict the output before clicking **Run**.

**Next topic:** Python dictionaries and how they differ from lists.
