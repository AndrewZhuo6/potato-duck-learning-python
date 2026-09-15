window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "data-structures",
  icon: "🎒",
  title: "Data Structures",
  blurb: "Lists, tuples, sets and dictionaries — what each is for, every method, and which to reach for when.",
  sections: [

    {
      id: "choosing",
      icon: "🧭",
      title: "Which One To Use",
      tagline: "Four containers, four jobs",
      keywords: "list tuple set dict choose compare mutable ordered unique which container",
      blocks: [
        {
          type: "table",
          head: ["", "list", "tuple", "set", "dict"],
          rows: [
            ["Written", "[1, 2]", "(1, 2)", "{1, 2}", "{\"a\": 1}"],
            ["Ordered", "yes", "yes", "no", "yes (insertion)"],
            ["Changeable", "yes", "no", "yes", "yes"],
            ["Duplicates", "yes", "yes", "no", "keys no, values yes"],
            ["Access by", "position", "position", "membership only", "key"],
            ["Find an item", "O(n)", "O(n)", "O(1)", "O(1)"],
            ["Add an item", "O(1) at end", "cannot", "O(1)", "O(1)"]
          ]
        },
        { type: "sub", value: "The short version" },
        {
          type: "list",
          items: [
            "list — an ordered pile you will change. The default choice.",
            "tuple — a fixed group where position has meaning, like a coordinate.",
            "set — you only care whether something is present, and duplicates must vanish.",
            "dict — you want to look things up by a label rather than a position."
          ]
        },
        { type: "note", value: "That O(1) against O(n) row is the most consequential line in this book. Checking membership in a set of a million items takes the same time as in a set of ten. Doing it on a list means walking the whole thing." }
      ]
    },

    {
      id: "lists",
      icon: "📋",
      title: "Lists",
      tagline: "The ordered, changeable pile",
      keywords: "list append extend insert remove pop index count sort reverse slice nested matrix clear",
      blocks: [
        { type: "text", value: "A list holds items in order, each in a numbered slot from 0 upward. Unlike a string, a list can be changed in place." },
        { type: "code", value: `inventory = []
inventory = ["torch", "mirror"]
mixed = [1, "a", True, None, [2, 3]]    # any types, even other lists

inventory[0]         # 'torch'
inventory[-1]        # 'mirror'
len(inventory)       # 2
inventory[0] = "lamp"   # allowed — strings are not` },
        { type: "sub", value: "Slicing" },
        { type: "text", value: "Exactly the same rules as strings: [start:stop:step], stop is exclusive, negatives count from the end." },
        { type: "code", value: `nums = [0, 1, 2, 3, 4, 5]
nums[1:4]      # [1, 2, 3]
nums[:3]       # [0, 1, 2]
nums[3:]       # [3, 4, 5]
nums[::2]      # [0, 2, 4]
nums[::-1]     # [5, 4, 3, 2, 1, 0]
nums[:]        # a shallow copy` },
        { type: "code", value: `# slices can be assigned to
nums[1:3] = [9, 9, 9]     # [0, 9, 9, 9, 3, 4, 5]
del nums[0:2]             # removes those positions` },
        { type: "sub", value: "Every list method" },
        {
          type: "table",
          head: ["Method", "Does", "Returns"],
          rows: [
            [".append(x)", "add x to the end", "None"],
            [".extend(other)", "add every item of other", "None"],
            [".insert(i, x)", "put x at position i", "None"],
            [".remove(x)", "delete the first x", "None (ValueError if absent)"],
            [".pop()", "remove and give back the last", "the item"],
            [".pop(i)", "remove and give back item i", "the item"],
            [".clear()", "empty it", "None"],
            [".index(x)", "position of the first x", "int (ValueError if absent)"],
            [".count(x)", "how many x", "int"],
            [".sort()", "reorder in place", "None"],
            [".reverse()", "flip in place", "None"],
            [".copy()", "a shallow copy", "a new list"]
          ]
        },
        { type: "warn", value: "Every method that changes the list returns None. values = values.sort() destroys your list. Write values.sort() alone, or new = sorted(values)." },
        { type: "sub", value: "append against extend" },
        { type: "code", value: `a = [1, 2]
a.append([3, 4])     # [1, 2, [3, 4]]  — one new item, a list

b = [1, 2]
b.extend([3, 4])     # [1, 2, 3, 4]    — four items
b += [5, 6]          # same as extend` },
        { type: "sub", value: "Combining and repeating" },
        { type: "code", value: `[1, 2] + [3, 4]      # [1, 2, 3, 4]
[0] * 5              # [0, 0, 0, 0, 0]
[1, 2] * 2           # [1, 2, 1, 2]` },
        { type: "warn", value: "[[0] * 3] * 3 does NOT make an independent grid. It makes three references to the SAME row, so changing one row changes all three. Build it with a comprehension instead — see Nested Lists below." },
        { type: "sub", value: "Nested lists and grids" },
        { type: "code", value: `matrix = [[1, 63, 82],
          [3, 67, 22],
          [18, 8, 5]]

matrix[0]        # [1, 63, 82]
matrix[2][1]     # 8  — row 2, column 1

for row in matrix:
    for value in row:
        print(value)

# with positions
for i, row in enumerate(matrix):
    for j, value in enumerate(row):
        print(i, j, value)` },
        {
          type: "compare",
          bad: `grid = [[0] * 3] * 3
grid[0][0] = 1
# [[1,0,0], [1,0,0], [1,0,0]]`,
          good: `grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
# [[1,0,0], [0,0,0], [0,0,0]]`,
          why: "The left builds one row and repeats the reference three times. The comprehension builds a genuinely new row each round."
        },
        { type: "sub", value: "Using a list as a stack or queue" },
        { type: "code", value: `# stack — last in, first out
stack = []
stack.append(1)
stack.append(2)
stack.pop()        # 2

# queue — first in, first out. pop(0) is O(n), so use deque
from collections import deque
queue = deque([1, 2, 3])
queue.append(4)
queue.popleft()    # 1, and it is O(1)` }
      ]
    },

    {
      id: "tuples",
      icon: "📌",
      title: "Tuples",
      tagline: "The frozen group",
      keywords: "tuple immutable unpack single element return multiple namedtuple key coordinate",
      blocks: [
        { type: "text", value: "A tuple is an ordered group that cannot be changed after it is made. Use one when the collection is a fixed record rather than a growing pile." },
        { type: "code", value: `point = (4, 9)
rgb = (255, 128, 0)
empty = ()

point[0]        # 4
len(point)      # 2
point[0] = 5    # TypeError — tuples do not change` },
        { type: "warn", value: "A one-item tuple needs a trailing comma. (5) is just the number five in brackets; (5,) is a tuple. This catches everyone once." },
        { type: "code", value: `not_a_tuple = (5)      # int
actual_tuple = (5,)    # tuple
also_a_tuple = 5,      # brackets are often optional` },
        { type: "sub", value: "Why bother, when lists exist" },
        {
          type: "list",
          items: [
            "It signals intent — this group has a fixed shape, like (x, y).",
            "It can be a dictionary key or a set member. A list cannot.",
            "It cannot be changed by accident by code you pass it to.",
            "It is slightly smaller and faster than a list."
          ]
        },
        { type: "code", value: `# a tuple can be a key; a list cannot
seen = {}
seen[(2, 3)] = "visited"

positions = {(0, 0), (1, 1)}     # a set of coordinates

bad = {[2, 3]: "x"}    # TypeError: unhashable type: 'list'` },
        { type: "sub", value: "Unpacking" },
        { type: "code", value: `x, y = (4, 9)
a, b, c = 1, 2, 3
first, *rest = (1, 2, 3, 4)     # first is 1, rest is [2, 3, 4]

for name, score in [("a", 90), ("b", 85)]:
    print(name, score)` },
        { type: "sub", value: "Returning several values" },
        { type: "text", value: "A function returning several things is really returning one tuple. That is why the caller can unpack it." },
        { type: "code", value: `def min_max(pile):
    return min(pile), max(pile)

low, high = min_max([3, 9, 1])    # 1, 9
result = min_max([3, 9, 1])       # (1, 9)` },
        { type: "sub", value: "Named tuples" },
        { type: "text", value: "When positions start to be hard to remember, give them names without giving up the tuple." },
        { type: "code", value: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(4, 9)

p.x        # 4
p[0]       # 4 — still works like a tuple
x, y = p   # still unpacks` },
        { type: "warn", value: "A tuple cannot be changed, but the things inside it can be, if THEY are changeable. ([1,2], 3) is a tuple whose first item is a mutable list, and that list can still be appended to." }
      ]
    },

    {
      id: "sets",
      icon: "🎲",
      title: "Sets",
      tagline: "Unique, unordered, instant to search",
      keywords: "set add remove discard union intersection difference symmetric subset frozenset duplicates unique",
      blocks: [
        { type: "text", value: "A set holds unique items in no particular order. Its one great strength is that checking membership is instant regardless of size." },
        { type: "code", value: `seen = set()
colours = {"red", "green", "blue"}
from_list = set([1, 2, 2, 3])     # {1, 2, 3} — duplicates vanish

"red" in colours       # True, and O(1)
len(colours)           # 3` },
        { type: "warn", value: "{} makes an empty DICTIONARY, not an empty set. For an empty set you must write set()." },
        { type: "sub", value: "Methods" },
        {
          type: "table",
          head: ["Method", "Does"],
          rows: [
            [".add(x)", "add x; no effect if already there"],
            [".remove(x)", "delete x; KeyError if absent"],
            [".discard(x)", "delete x; silent if absent"],
            [".pop()", "remove and return an arbitrary item"],
            [".clear()", "empty it"],
            [".update(other)", "add everything from other"],
            [".copy()", "a shallow copy"]
          ]
        },
        { type: "sub", value: "Set operations" },
        {
          type: "table",
          head: ["Operator", "Method", "Gives"],
          rows: [
            ["a | b", ".union(b)", "everything in either"],
            ["a & b", ".intersection(b)", "only what is in both"],
            ["a - b", ".difference(b)", "in a but not b"],
            ["a ^ b", ".symmetric_difference(b)", "in one but not both"],
            ["a <= b", ".issubset(b)", "every a is in b"],
            ["a >= b", ".issuperset(b)", "every b is in a"],
            ["", ".isdisjoint(b)", "they share nothing"]
          ]
        },
        { type: "code", value: `a = {1, 2, 3}
b = {3, 4, 5}

a | b     # {1, 2, 3, 4, 5}
a & b     # {3}
a - b     # {1, 2}
a ^ b     # {1, 2, 4, 5}` },
        { type: "sub", value: "What sets are actually for" },
        { type: "code", value: `# remove duplicates, keeping order
unique = list(dict.fromkeys(items))

# remove duplicates, order irrelevant
unique = list(set(items))

# have I seen this before?
seen = set()
for item in stream:
    if item in seen:
        print("duplicate:", item)
    seen.add(item)

# does the word contain any vowel?
if set(word) & set("aeiou"):
    ...` },
        { type: "warn", value: "Only hashable things can go in a set — numbers, strings, tuples, booleans. Lists and dictionaries cannot, because they can change and that would break the lookup." },
        { type: "sub", value: "frozenset" },
        { type: "code", value: `frozen = frozenset([1, 2, 3])
# unchangeable, so it CAN be a dict key or a member of another set` }
      ]
    },

    {
      id: "dicts",
      icon: "🗝️",
      title: "Dictionaries",
      tagline: "Look things up by name",
      keywords: "dict dictionary key value get keys values items setdefault update pop counting nested defaultdict",
      blocks: [
        { type: "text", value: "A dictionary stores pairs. You reach a value by its key rather than by a position, and that lookup is instant no matter how large it grows." },
        { type: "code", value: `weakness = {
    "Blood Python": "vinegar",
    "Carpet Python": "potion"
}

weakness["Blood Python"]           # 'vinegar'
weakness["Water Python"] = "snare" # add a new pair
len(weakness)                      # 3
"Blood Python" in weakness         # True — checks KEYS` },
        { type: "warn", value: "Asking for a key that is not there raises KeyError and stops the program. Use .get() when absence is possible." },
        { type: "code", value: `weakness.get("Tree Python")            # None
weakness.get("Tree Python", "unknown") # 'unknown'` },
        { type: "sub", value: "Every dictionary method" },
        {
          type: "table",
          head: ["Method", "Does"],
          rows: [
            [".get(k)", "value for k, or None"],
            [".get(k, d)", "value for k, or d"],
            [".keys()", "a view of all keys"],
            [".values()", "a view of all values"],
            [".items()", "a view of (key, value) pairs"],
            [".pop(k)", "remove k, return its value"],
            [".pop(k, d)", "remove k, or return d if absent"],
            [".popitem()", "remove and return the last pair"],
            [".update(other)", "merge another dict in"],
            [".setdefault(k, d)", "get k, inserting d first if absent"],
            [".clear()", "empty it"],
            [".copy()", "a shallow copy"],
            ["dict.fromkeys(seq, v)", "build from a list of keys"]
          ]
        },
        { type: "sub", value: "Looping" },
        { type: "code", value: `for key in weakness:
    print(key)

for value in weakness.values():
    print(value)

for key, value in weakness.items():
    print(key, "fears", value)` },
        { type: "sub", value: "Counting — the most useful pattern in the language" },
        { type: "code", value: `counts = {}
for ch in spell:
    counts[ch] = counts.get(ch, 0) + 1

# with setdefault
for ch in spell:
    counts.setdefault(ch, 0)
    counts[ch] += 1

# with defaultdict
from collections import defaultdict
counts = defaultdict(int)
for ch in spell:
    counts[ch] += 1

# with Counter — the shortest
from collections import Counter
counts = Counter(spell)
counts.most_common(3)` },
        { type: "sub", value: "Grouping" },
        { type: "code", value: `groups = {}
for word in words:
    key = len(word)
    groups.setdefault(key, []).append(word)

# {3: ['cat', 'dog'], 5: ['horse']}` },
        { type: "sub", value: "Merging" },
        { type: "code", value: `a = {"x": 1}
b = {"y": 2}

merged = {**a, **b}     # {'x': 1, 'y': 2}
merged = a | b          # Python 3.9+
a.update(b)             # changes a in place` },
        { type: "sub", value: "Nested dictionaries" },
        { type: "code", value: `data = {
    "quackbit": {"level": 3, "items": ["torch"]},
    "pythorn":  {"level": 99, "items": []}
}

data["quackbit"]["level"]              # 3
data["quackbit"]["items"].append("map")
data.get("unknown", {}).get("level", 0)  # 0, no crash` },
        { type: "note", value: "Since Python 3.7 a dictionary remembers the order things were inserted. Do not confuse that with being sorted — it is insertion order, not key order." }
      ]
    },

    {
      id: "comprehensions",
      icon: "⚗️",
      title: "Comprehensions",
      tagline: "Building a collection in one line",
      keywords: "comprehension list dict set generator filter map nested condition expression",
      blocks: [
        { type: "text", value: "A comprehension builds a new collection from an existing one. It is the same work a loop does, written as a single expression." },
        { type: "syntax", value: "[expression for item in iterable if condition]" },
        {
          type: "compare",
          bad: `squares = []
for n in range(5):
    squares.append(n * n)`,
          good: `squares = [n * n for n in range(5)]`,
          why: "Same result. The right version says 'this is a new list built from that one' as a single thought, rather than three statements you have to assemble mentally."
        },
        { type: "sub", value: "With a filter" },
        { type: "code", value: `evens = [n for n in numbers if n % 2 == 0]
words = [w for w in text.split() if len(w) > 3]
cleaned = "".join(ch for ch in msg if ch.isalpha())` },
        { type: "sub", value: "With a choice" },
        { type: "text", value: "A conditional expression goes BEFORE the for; a filter goes after. They are different things." },
        { type: "code", value: `# transform every item
labels = ["JUMP" if n % 2 else "STEP" for n in stones]

# keep only some items
odds = [n for n in stones if n % 2]

# both
labels = ["odd" if n % 2 else "even" for n in stones if n > 0]` },
        { type: "sub", value: "Other kinds" },
        { type: "code", value: `# set — duplicates vanish
unique_lengths = {len(w) for w in words}

# dict
lengths = {w: len(w) for w in words}
flipped = {v: k for k, v in original.items()}

# generator — computes lazily, uses almost no memory
total = sum(n * n for n in range(1000000))` },
        { type: "tip", value: "When a comprehension feeds straight into sum(), max(), any() or all(), drop the brackets. That makes it a generator, which never builds the whole collection in memory." },
        { type: "sub", value: "Nested" },
        { type: "code", value: `# flatten a grid — read the fors left to right, outer first
flat = [value for row in matrix for value in row]

# build a grid
grid = [[0 for _ in range(3)] for _ in range(3)]

# every pair
pairs = [(a, b) for a in first for b in second]` },
        { type: "warn", value: "Stop at one or two levels. A comprehension with three fors and two ifs is a write-only line — you will not be able to read it next week, and neither will Steave. Write the loop." },
        { type: "sub", value: "any() and all()" },
        { type: "code", value: `any(n < 0 for n in numbers)        # is at least one negative?
all(n > 0 for n in numbers)        # are they all positive?
any(ch in "aeiou" for ch in word)  # does it contain a vowel?

sum(1 for n in numbers if n > 10)  # how many are over 10` }
      ]
    },

    {
      id: "copying",
      icon: "👯",
      title: "Copying & References",
      tagline: "Why changing one list changed the other",
      keywords: "copy reference alias shallow deep mutable side effect deepcopy slice list",
      blocks: [
        { type: "text", value: "Assigning a list to a new name does not copy it. Both names point at the same list, so changing it through either name changes what both see." },
        { type: "code", value: `a = [1, 2, 3]
b = a           # NOT a copy
b.append(4)
print(a)        # [1, 2, 3, 4] — a changed too

a is b          # True — one list, two names` },
        { type: "sub", value: "Making a real copy" },
        { type: "code", value: `b = a.copy()
b = a[:]
b = list(a)
b = [*a]

# for dictionaries
d2 = d.copy()
d2 = dict(d)
d2 = {**d}` },
        { type: "sub", value: "Shallow against deep" },
        { type: "text", value: "All of those are SHALLOW copies. The outer list is new, but the things inside it are still shared." },
        { type: "code", value: `original = [[1, 2], [3, 4]]
shallow = original.copy()

shallow[0].append(99)
print(original)    # [[1, 2, 99], [3, 4]] — the inner list was shared

import copy
deep = copy.deepcopy(original)
deep[0].append(99)
print(original)    # unchanged` },
        { type: "warn", value: "Only reach for deepcopy when you genuinely have nested mutable data. It is slow, and it will happily follow references round in circles if your data has loops." },
        { type: "sub", value: "Why this matters in functions" },
        { type: "text", value: "A function receives the same object, not a copy. Changing it inside changes it outside." },
        { type: "code", value: `def add_item(pile):
    pile.append("new")      # changes the caller's list

def safer(pile):
    pile = pile + ["new"]   # builds a new list, caller untouched
    return pile` },
        {
          type: "compare",
          bad: `def tidy(items):
    items.sort()
    return items`,
          good: `def tidy(items):
    return sorted(items)`,
          why: "The left version reorders the caller's list as a side effect, which the name gives no hint of. The right leaves the original alone."
        },
        { type: "note", value: "The whole distinction only exists for mutable things — lists, dicts, sets, and objects. Numbers, strings and tuples cannot be changed, so it never arises for them." }
      ]
    },

    {
      id: "sorting",
      icon: "🔢",
      title: "Sorting",
      tagline: "sorted, sort, key, reverse",
      keywords: "sort sorted key reverse lambda stable multiple criteria itemgetter descending custom",
      blocks: [
        {
          type: "table",
          head: ["", "sorted(x)", "x.sort()"],
          rows: [
            ["Works on", "anything iterable", "lists only"],
            ["Changes original", "no", "yes"],
            ["Returns", "a new list", "None"],
            ["Use when", "you want both", "you do not need the original"]
          ]
        },
        { type: "code", value: `values = [3, 1, 2]

new = sorted(values)          # [1, 2, 3], values untouched
values.sort()                 # values is now [1, 2, 3]
sorted(values, reverse=True)  # [3, 2, 1]` },
        { type: "sub", value: "key — sorting by a rule" },
        { type: "text", value: "key takes a function. Python calls it on each item and sorts by whatever it returns, not by the item itself." },
        { type: "code", value: `sorted(words, key=len)                 # shortest first
sorted(words, key=str.lower)           # ignoring capitals
sorted(pairs, key=lambda p: p[1])      # by the second element
sorted(people, key=lambda p: p["age"]) # by a dict field

from operator import itemgetter
sorted(pairs, key=itemgetter(1))       # the same, slightly faster` },
        { type: "sub", value: "Sorting by several things at once" },
        { type: "text", value: "Return a tuple from key. Python compares the first element, and only looks at the second when the first ties." },
        { type: "code", value: `# by score descending, then name ascending
sorted(people, key=lambda p: (-p["score"], p["name"]))

# by length, then alphabetically
sorted(words, key=lambda w: (len(w), w))` },
        { type: "tip", value: "Negating a number reverses just that one field. For text, where you cannot negate, sort twice — Python's sort is stable, so the earlier order survives within ties." },
        { type: "sub", value: "Stability" },
        { type: "code", value: `# sort by the secondary key first, then the primary
items.sort(key=lambda x: x.name)
items.sort(key=lambda x: x.score, reverse=True)
# equal scores keep their alphabetical order` },
        { type: "sub", value: "Sorting dictionaries" },
        { type: "code", value: `# by key
dict(sorted(data.items()))

# by value
dict(sorted(data.items(), key=lambda kv: kv[1]))

# the top three by value
sorted(data.items(), key=lambda kv: kv[1], reverse=True)[:3]` },
        { type: "warn", value: "Sorting is O(n log n). If all you need is the largest or smallest, min() and max() are O(n) and do not build a new list. For the top few, heapq.nlargest(k, items) beats sorting everything." },
        { type: "code", value: `max(values)                       # O(n)
max(people, key=lambda p: p.age)  # the whole item, not just the value

import heapq
heapq.nlargest(3, values)` }
      ]
    }

  ]
});