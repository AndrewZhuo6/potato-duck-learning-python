window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "stdlib",
  icon: "🧰",
  title: "The Standard Library",
  blurb: "Modules that ship with Python. Import one line and the work is already done for you.",
  sections: [

    {
      id: "math-module",
      icon: "📐",
      title: "math",
      tagline: "Numbers beyond the basics",
      keywords: "math sqrt floor ceil gcd factorial pi inf isclose log sin trig prod comb",
      blocks: [
        { type: "code", value: `import math` },
        {
          type: "table",
          head: ["Call", "Does", "Example"],
          rows: [
            ["math.sqrt(x)", "square root", "sqrt(16) → 4.0"],
            ["math.floor(x)", "round down", "floor(2.9) → 2"],
            ["math.ceil(x)", "round up", "ceil(2.1) → 3"],
            ["math.trunc(x)", "chop toward zero", "trunc(-2.9) → -2"],
            ["math.fabs(x)", "absolute value, as float", "fabs(-4) → 4.0"],
            ["math.pow(a, b)", "power, as float", "pow(2,3) → 8.0"],
            ["math.gcd(a, b)", "greatest common divisor", "gcd(12,18) → 6"],
            ["math.lcm(a, b)", "lowest common multiple", "lcm(4,6) → 12"],
            ["math.factorial(n)", "n!", "factorial(5) → 120"],
            ["math.prod(x)", "multiply them all", "prod([2,3,4]) → 24"],
            ["math.comb(n, k)", "combinations", "comb(5,2) → 10"],
            ["math.perm(n, k)", "permutations", "perm(5,2) → 20"],
            ["math.isqrt(n)", "integer square root", "isqrt(17) → 4"],
            ["math.log(x)", "natural log", ""],
            ["math.log(x, b)", "log to base b", "log(8,2) → 3.0"],
            ["math.log2(x)", "log base 2", ""],
            ["math.log10(x)", "log base 10", ""],
            ["math.isclose(a, b)", "nearly equal?", "for comparing floats"],
            ["math.isnan(x)", "is it not-a-number?", ""],
            ["math.isinf(x)", "is it infinite?", ""]
          ]
        },
        {
          type: "table",
          head: ["Constant", "Value"],
          rows: [
            ["math.pi", "3.14159..."],
            ["math.e", "2.71828..."],
            ["math.tau", "2π"],
            ["math.inf", "infinity"],
            ["math.nan", "not a number"]
          ]
        },
        { type: "sub", value: "Comparing floats properly" },
        { type: "code", value: `0.1 + 0.2 == 0.3                    # False
math.isclose(0.1 + 0.2, 0.3)        # True` },
        { type: "sub", value: "isqrt for prime checking" },
        { type: "code", value: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, math.isqrt(n) + 1):
        if n % i == 0:
            return False
    return True` },
        { type: "tip", value: "You only need to test divisors up to the square root. Beyond that, any factor would already have been found as the partner of a smaller one. That single observation turns an O(n) check into O(√n)." },
        { type: "sub", value: "Trigonometry" },
        { type: "code", value: `math.sin(x)    math.cos(x)    math.tan(x)     # x in RADIANS
math.asin(x)   math.acos(x)   math.atan(x)
math.atan2(y, x)                                # correct quadrant
math.degrees(rad)    math.radians(deg)
math.dist((0,0), (3,4))    # 5.0
math.hypot(3, 4)           # 5.0` }
      ]
    },

    {
      id: "random-module",
      icon: "🎲",
      title: "random",
      tagline: "Chance and shuffling",
      keywords: "random randint choice shuffle sample uniform seed choices gauss secrets",
      blocks: [
        { type: "code", value: `import random` },
        {
          type: "table",
          head: ["Call", "Gives"],
          rows: [
            ["random.random()", "a float from 0.0 up to 1.0"],
            ["random.uniform(a, b)", "a float between a and b"],
            ["random.randint(a, b)", "an int from a to b INCLUSIVE"],
            ["random.randrange(a, b)", "an int from a up to b-1"],
            ["random.choice(seq)", "one item"],
            ["random.choices(seq, k=n)", "n items, repeats allowed"],
            ["random.sample(seq, n)", "n different items"],
            ["random.shuffle(list)", "reorders IN PLACE, returns None"],
            ["random.seed(n)", "make the sequence repeatable"],
            ["random.gauss(mu, sigma)", "a normal distribution"]
          ]
        },
        { type: "code", value: `random.randint(1, 6)                   # a die roll, 1 to 6 inclusive
random.choice(["torch", "mirror"])
random.sample(range(1, 50), 6)         # six different numbers

deck = [1, 2, 3, 4, 5]
random.shuffle(deck)                   # deck is changed
shuffled = random.sample(deck, len(deck))   # a new list instead` },
        { type: "warn", value: "randint INCLUDES both ends; randrange excludes the top, matching range(). Mixing them up is an off-by-one waiting to happen." },
        { type: "sub", value: "Weighted choice" },
        { type: "code", value: `random.choices(["common", "rare"], weights=[90, 10], k=5)` },
        { type: "sub", value: "Repeatable randomness" },
        { type: "code", value: `random.seed(42)
random.randint(1, 100)     # the same number every run` },
        { type: "tip", value: "Seeding makes a random program reproducible, which is the only way to debug one. Set a seed while testing and remove it afterwards." },
        { type: "warn", value: "random is predictable by design and must never be used for passwords, tokens or anything security-related. Use the secrets module for that." }
      ]
    },

    {
      id: "collections-module",
      icon: "🗃️",
      title: "collections",
      tagline: "Better containers",
      keywords: "collections counter defaultdict deque namedtuple ordereddict most_common queue stack",
      blocks: [
        { type: "sub", value: "Counter" },
        { type: "code", value: `from collections import Counter

tally = Counter("waterbitwater")
tally["w"]                    # 2
tally["z"]                    # 0 — never a KeyError
tally.most_common(3)          # the three commonest, as pairs
tally.most_common()[-1]       # the rarest

Counter(["a", "b", "a"])      # Counter({'a': 2, 'b': 1})
sum(tally.values())           # the total count

a = Counter("aab")
b = Counter("abc")
a + b       # combined counts
a - b       # subtracted, negatives dropped
a & b       # the smaller of each
a | b       # the larger of each` },
        { type: "sub", value: "defaultdict" },
        { type: "text", value: "A dictionary that creates a default value the first time a key is touched, so you never have to check whether it exists." },
        { type: "code", value: `from collections import defaultdict

counts = defaultdict(int)          # missing keys start at 0
for ch in text:
    counts[ch] += 1

groups = defaultdict(list)         # missing keys start at []
for word in words:
    groups[len(word)].append(word)

pairs = defaultdict(set)
pairs["a"].add(1)` },
        { type: "warn", value: "Merely LOOKING at a missing key in a defaultdict creates it. That makes the dictionary grow as you inspect it, which is surprising if you then count its length." },
        { type: "sub", value: "deque" },
        { type: "text", value: "A list that is fast at BOTH ends. A normal list is O(n) to remove from the front; a deque is O(1)." },
        { type: "code", value: `from collections import deque

queue = deque([1, 2, 3])
queue.append(4)          # to the right
queue.appendleft(0)      # to the left
queue.pop()              # from the right
queue.popleft()          # from the left — this is the fast one
queue.rotate(1)          # shift everything round

recent = deque(maxlen=5)  # keeps only the last five, drops the oldest` },
        {
          type: "compare",
          bad: `queue = []
queue.pop(0)     # O(n) — shifts everything left`,
          good: `queue = deque()
queue.popleft()  # O(1)`,
          why: "On a queue of 100,000 items processed to completion, the left is ten billion operations and the right is 100,000."
        },
        { type: "sub", value: "namedtuple" },
        { type: "code", value: `from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
p = Point(4, 9)
p.x          # 4
p[0]         # 4
x, y = p` }
      ]
    },

    {
      id: "itertools-functools",
      icon: "⚙️",
      title: "itertools & functools",
      tagline: "Combinations, caching, partials",
      keywords: "itertools functools combinations permutations product accumulate groupby chain lru_cache reduce partial cache",
      blocks: [
        { type: "sub", value: "itertools" },
        { type: "code", value: `import itertools` },
        {
          type: "table",
          head: ["Call", "Produces"],
          rows: [
            ["chain(a, b)", "a then b, as one sequence"],
            ["combinations(x, n)", "every n-item choice, order ignored"],
            ["permutations(x, n)", "every n-item arrangement"],
            ["product(a, b)", "every pairing — nested loops"],
            ["accumulate(x)", "running totals"],
            ["groupby(x, key)", "runs of consecutive equal items"],
            ["count(start, step)", "an endless counter"],
            ["cycle(x)", "repeats forever"],
            ["repeat(v, n)", "v, n times"],
            ["islice(x, n)", "the first n, lazily"],
            ["pairwise(x)", "overlapping neighbours"],
            ["zip_longest(a, b)", "zip that pads instead of stopping"]
          ]
        },
        { type: "code", value: `list(itertools.combinations([1,2,3], 2))
# [(1,2), (1,3), (2,3)]

list(itertools.permutations([1,2,3], 2))
# [(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)]

list(itertools.product([1,2], "ab"))
# [(1,'a'), (1,'b'), (2,'a'), (2,'b')]

list(itertools.accumulate([1,2,3,4]))
# [1, 3, 6, 10]

list(itertools.pairwise([1,2,3,4]))
# [(1,2), (2,3), (3,4)]` },
        { type: "warn", value: "groupby only groups items that are ADJACENT. To group a whole collection you must sort by the same key first, or use a defaultdict instead." },
        { type: "sub", value: "functools" },
        { type: "code", value: `from functools import lru_cache, cache, reduce, partial

@cache                    # remembers every result
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

@lru_cache(maxsize=128)   # keeps only the 128 most recent
def expensive(n):
    ...

reduce(lambda a, b: a * b, [1,2,3,4])    # 24

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
square(5)     # 25` },
        { type: "tip", value: "@cache turns an exponential recursive function into a linear one with a single line. It only works when the function is pure — same arguments, same answer, no side effects — and the arguments must be hashable." }
      ]
    },

    {
      id: "datetime-module",
      icon: "📅",
      title: "datetime & time",
      tagline: "Dates, times and durations",
      keywords: "datetime date time timedelta strftime strptime now timestamp sleep perf_counter format parse",
      blocks: [
        { type: "code", value: `from datetime import datetime, date, timedelta

now = datetime.now()
today = date.today()

now.year, now.month, now.day
now.hour, now.minute, now.second
today.weekday()        # Monday is 0
today.isoweekday()     # Monday is 1` },
        { type: "sub", value: "Formatting and parsing" },
        { type: "code", value: `now.strftime("%Y-%m-%d")             # '2026-09-15'
now.strftime("%d/%m/%Y %H:%M")       # '15/09/2026 18:30'

datetime.strptime("2026-09-15", "%Y-%m-%d")

date.today().isoformat()             # '2026-09-15'` },
        {
          type: "table",
          head: ["Code", "Means"],
          rows: [
            ["%Y", "four-digit year"],
            ["%y", "two-digit year"],
            ["%m", "month, 01–12"],
            ["%d", "day, 01–31"],
            ["%H", "hour, 00–23"],
            ["%I", "hour, 01–12"],
            ["%M", "minute"],
            ["%S", "second"],
            ["%p", "AM or PM"],
            ["%A", "weekday name"],
            ["%B", "month name"],
            ["%j", "day of the year"]
          ]
        },
        { type: "sub", value: "Arithmetic" },
        { type: "code", value: `tomorrow = today + timedelta(days=1)
last_week = now - timedelta(weeks=1)
later = now + timedelta(hours=2, minutes=30)

gap = date(2026, 12, 25) - today
gap.days                  # how many days until

delta = end - start
delta.total_seconds()` },
        { type: "sub", value: "time" },
        { type: "code", value: `import time

time.sleep(2)              # pause for two seconds
time.time()                # seconds since 1970

start = time.perf_counter()
do_work()
elapsed = time.perf_counter() - start` },
        { type: "tip", value: "Use perf_counter for measuring how long something takes — it is the highest-resolution clock available and is not affected by the system clock changing." }
      ]
    },

    {
      id: "regex",
      icon: "🔣",
      title: "re",
      tagline: "Regular expressions",
      keywords: "re regex regular expression match search findall sub pattern group compile anchor class quantifier",
      blocks: [
        { type: "text", value: "A regular expression describes a pattern of text. It is a small language of its own, and it is worth knowing enough to recognise when a plain string method would be simpler." },
        { type: "code", value: `import re

re.search(r"\\d+", "abc123")      # a Match object, or None
re.findall(r"\\d+", "a1b22c333")  # ['1', '22', '333']
re.sub(r"\\d", "#", "a1b2")       # 'a#b#'
re.split(r"[,;]", "a,b;c")        # ['a', 'b', 'c']
re.fullmatch(r"\\d+", "123")      # matches the WHOLE string` },
        { type: "warn", value: "Always write patterns as raw strings — r\"\\d+\" not \"\\d+\". Without the r, Python processes the backslashes first and the regex engine never sees them." },
        { type: "sub", value: "Character classes" },
        {
          type: "table",
          head: ["Pattern", "Matches"],
          rows: [
            [".", "any character except a newline"],
            ["\\d", "a digit"],
            ["\\D", "not a digit"],
            ["\\w", "a letter, digit or underscore"],
            ["\\W", "not one of those"],
            ["\\s", "whitespace"],
            ["\\S", "not whitespace"],
            ["[abc]", "any one of a, b, c"],
            ["[^abc]", "any character except those"],
            ["[a-z]", "any lowercase letter"],
            ["[a-zA-Z0-9]", "any letter or digit"]
          ]
        },
        { type: "sub", value: "Quantifiers and anchors" },
        {
          type: "table",
          head: ["Pattern", "Means"],
          rows: [
            ["*", "zero or more"],
            ["+", "one or more"],
            ["?", "zero or one"],
            ["{n}", "exactly n"],
            ["{n,}", "n or more"],
            ["{n,m}", "between n and m"],
            ["*? +? ??", "the same, but lazy — as few as possible"],
            ["^", "start of the string"],
            ["$", "end of the string"],
            ["\\b", "a word boundary"],
            ["|", "either side"],
            ["( )", "a group, captured"],
            ["(?: )", "a group, not captured"]
          ]
        },
        { type: "sub", value: "Groups" },
        { type: "code", value: `m = re.search(r"(\\d{4})-(\\d{2})-(\\d{2})", "on 2026-09-15 we")
m.group(0)      # '2026-09-15' — the whole match
m.group(1)      # '2026'
m.groups()      # ('2026', '09', '15')

m = re.search(r"(?P<year>\\d{4})", "2026")
m.group("year")  # '2026'` },
        { type: "sub", value: "Compiling" },
        { type: "code", value: `pattern = re.compile(r"\\d+")
pattern.findall(text)      # faster when reused many times

re.search(r"abc", text, re.IGNORECASE)` },
        {
          type: "compare",
          bad: `re.sub(r"[^a-zA-Z]", "", msg).lower()`,
          good: `"".join(ch for ch in msg if ch.isalpha()).lower()`,
          why: "Both clean a string. The right version needs no import, no pattern language, and any reader can see what it does. Reach for re when the pattern is genuinely complex."
        },
        { type: "note", value: "There is an old joke that solving a problem with a regular expression leaves you with two problems. It is unfair but not baseless — a regex you cannot read a month later is a liability. Comment anything longer than a few characters." }
      ]
    },

    {
      id: "other-modules",
      icon: "📦",
      title: "Other Modules Worth Knowing",
      tagline: "os, sys, json, csv, statistics, heapq, bisect",
      keywords: "os sys json csv statistics heapq bisect pathlib argparse unittest copy pprint textwrap string",
      blocks: [
        { type: "sub", value: "heapq — the smallest item, fast" },
        { type: "code", value: `import heapq

heap = [3, 1, 4]
heapq.heapify(heap)         # rearrange into a heap
heapq.heappush(heap, 2)
heapq.heappop(heap)         # 1 — always the smallest, O(log n)

heapq.nlargest(3, values)
heapq.nsmallest(3, values)` },
        { type: "tip", value: "For the top k of a large collection, heapq.nlargest is O(n log k) against sorting's O(n log n). On a million items where you want the top ten, that is a large difference." },
        { type: "sub", value: "bisect — binary search, written for you" },
        { type: "code", value: `import bisect

sorted_list = [1, 3, 5, 7]
bisect.bisect_left(sorted_list, 5)     # 2
bisect.insort(sorted_list, 4)          # insert, keeping it sorted` },
        { type: "sub", value: "statistics" },
        { type: "code", value: `import statistics

statistics.mean([1, 2, 3])       # 2
statistics.median([1, 2, 3, 4])  # 2.5
statistics.mode([1, 1, 2])       # 1
statistics.stdev([1, 2, 3])` },
        { type: "sub", value: "os and sys" },
        { type: "code", value: `import os, sys

os.getcwd()
os.listdir(".")
os.path.exists("data.txt")
os.environ.get("HOME")

sys.argv          # command-line arguments
sys.exit(0)
sys.path` },
        { type: "sub", value: "string" },
        { type: "code", value: `import string

string.ascii_lowercase     # 'abcdefghijklmnopqrstuvwxyz'
string.ascii_uppercase
string.ascii_letters
string.digits              # '0123456789'
string.punctuation
string.whitespace` },
        { type: "sub", value: "pprint and textwrap" },
        { type: "code", value: `from pprint import pprint
pprint(nested_data)        # readable, indented output

import textwrap
textwrap.fill(long_text, width=70)
textwrap.dedent(indented_block)` },
        { type: "note", value: "Python's slogan for this is 'batteries included'. Before writing anything more than a few lines, it is worth thirty seconds asking whether the standard library already has it. It usually does." }
      ]
    }

  ]
});