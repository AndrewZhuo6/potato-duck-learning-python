window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "functions",
  icon: "🪄",
  title: "Functions",
  blurb: "Wrapping work in a name: parameters, return values, scope, and everything Python lets a function be.",
  sections: [

    {
      id: "defining",
      icon: "✨",
      title: "Defining & Calling",
      tagline: "def, parameters, arguments",
      keywords: "def function define call parameter argument return docstring naming reuse",
      blocks: [
        { type: "syntax", value: "def name(parameters):\\n    block\\n    return value" },
        { type: "code", value: `def jump_or_step(stone_index):
    if stone_index % 2 == 0:
        return "STEP"
    return "JUMP"

jump_or_step(5)     # 'JUMP'
jump_or_step(2)     # 'STEP'` },
        {
          type: "table",
          head: ["Word", "Means"],
          rows: [
            ["def", "I am defining a function"],
            ["parameter", "the name in the definition — stone_index"],
            ["argument", "the actual value passed in — 5"],
            ["return", "hand a value back to the caller"],
            ["call", "run it — jump_or_step(5)"],
            ["body", "the indented block"],
            ["signature", "the name plus its parameters"]
          ]
        },
        { type: "text", value: "Defining a function does not run it. The body executes only when it is called, which is why you can define functions in any order as long as they exist by the time anything calls them." },
        { type: "sub", value: "No parameters, no return" },
        { type: "code", value: `def greet():
    print("Quack.")

greet()           # prints
x = greet()       # x is None — it returned nothing` },
        { type: "sub", value: "Several parameters" },
        { type: "code", value: `def damage(base, multiplier):
    return base * multiplier

damage(5, 3)                    # 15 — by position
damage(base=5, multiplier=3)    # 15 — by name, clearer
damage(multiplier=3, base=5)    # 15 — names free you from order` },
        { type: "warn", value: "Positional arguments must come before keyword ones. damage(base=5, 3) is a SyntaxError." },
        { type: "sub", value: "Docstrings" },
        { type: "code", value: `def vowel_count(word):
    """Count the vowels in word, ignoring case.

    Returns an integer. Non-letters are ignored.
    """
    return sum(1 for ch in word.lower() if ch in "aeiou")

help(vowel_count)
vowel_count.__doc__` },
        { type: "note", value: "A function should do one thing its name describes. If you cannot name it without using 'and', it is two functions. That single rule prevents most of the mess that grows into spaghetti code." }
      ]
    },

    {
      id: "return",
      icon: "↩️",
      title: "return",
      tagline: "Handing a value back",
      keywords: "return none print difference multiple values tuple early exit implicit",
      blocks: [
        { type: "warn", value: "return and print() are not the same, and confusing them is the most common mistake in this book. print() shows a human something and hands back nothing. return gives a value to your code so it can be stored, compared or passed on. A function that prints where it should return looks perfect on screen and fails every test." },
        {
          type: "compare",
          bad: `def double(n):
    print(n * 2)

result = double(5)
print(result + 1)   # TypeError — result is None`,
          good: `def double(n):
    return n * 2

result = double(5)
print(result + 1)   # 11`,
          why: "The left function displays 10 and returns None. The right hands 10 back so the next line can use it."
        },
        { type: "sub", value: "return stops the function immediately" },
        { type: "code", value: `def first_vowel(word):
    for ch in word:
        if ch in "aeiou":
            return ch      # leaves at once
    return None            # only reached if the loop finished

def check(n):
    return "positive"
    print("never runs")` },
        { type: "sub", value: "Returning several values" },
        { type: "code", value: `def min_max(pile):
    return min(pile), max(pile)     # really one tuple

low, high = min_max([3, 9, 1])
both = min_max([3, 9, 1])           # (1, 9)` },
        { type: "sub", value: "Bare return and implicit None" },
        { type: "code", value: `def check(n):
    if n < 0:
        return        # returns None, used to leave early
    process(n)

def nothing():
    pass              # also returns None` },
        { type: "sub", value: "Multiple returns are fine" },
        { type: "text", value: "Some teaching insists on a single exit point. Python style does not. Guard clauses that return early are clearer than deep nesting." },
        {
          type: "compare",
          bad: `def grade(score):
    if score >= 0:
        if score <= 100:
            if score >= 50:
                result = "pass"
            else:
                result = "fail"
        else:
            result = "invalid"
    else:
        result = "invalid"
    return result`,
          good: `def grade(score):
    if not 0 <= score <= 100:
        return "invalid"
    if score >= 50:
        return "pass"
    return "fail"`,
          why: "Each case is handled and dismissed. No nesting, no result variable threaded through four branches."
        }
      ]
    },

    {
      id: "default-args",
      icon: "🎚️",
      title: "Default & Flexible Arguments",
      tagline: "Optional parameters, *args, **kwargs",
      keywords: "default argument optional args kwargs star unpacking keyword only positional mutable default trap",
      blocks: [
        { type: "sub", value: "Defaults" },
        { type: "code", value: `def damage(base, multiplier=2):
    return base * multiplier

damage(5)        # 10 — multiplier defaults
damage(5, 3)     # 15` },
        { type: "warn", value: "Parameters with defaults must come after those without. def f(a=1, b) is a SyntaxError." },
        { type: "sub", value: "The mutable default trap" },
        { type: "text", value: "A default value is created ONCE, when the function is defined — not each time it is called. With a list or dict as the default, every call shares the same one." },
        {
          type: "compare",
          bad: `def add(item, pile=[]):
    pile.append(item)
    return pile

add("a")    # ['a']
add("b")    # ['a', 'b']  ← the same list!`,
          good: `def add(item, pile=None):
    if pile is None:
        pile = []
    pile.append(item)
    return pile

add("a")    # ['a']
add("b")    # ['b']`,
          why: "This is the single most surprising behaviour in Python. Never use a list, dict or set as a default — use None and build it inside."
        },
        { type: "sub", value: "*args — any number of positional arguments" },
        { type: "code", value: `def total(*numbers):
    return sum(numbers)          # numbers is a tuple

total(1, 2)          # 3
total(1, 2, 3, 4)    # 10
total()              # 0

def describe(name, *tags):
    print(name, "has tags:", tags)` },
        { type: "sub", value: "**kwargs — any number of keyword arguments" },
        { type: "code", value: `def settings(**options):
    for key, value in options.items():
        print(key, "=", value)   # options is a dict

settings(mode="fast", level=3)` },
        { type: "sub", value: "All together" },
        { type: "text", value: "The order is fixed: ordinary parameters, then defaults, then *args, then **kwargs." },
        { type: "code", value: `def f(required, optional=1, *args, **kwargs):
    ...` },
        { type: "sub", value: "Unpacking into a call" },
        { type: "text", value: "The same stars work in reverse, spreading a list or dict into arguments." },
        { type: "code", value: `values = [1, 2, 3]
total(*values)         # same as total(1, 2, 3)

config = {"base": 5, "multiplier": 3}
damage(**config)       # same as damage(base=5, multiplier=3)` },
        { type: "sub", value: "Forcing keyword-only arguments" },
        { type: "code", value: `def move(x, y, *, fast=False):
    ...

move(1, 2, fast=True)    # fine
move(1, 2, True)         # TypeError — fast must be named` },
        { type: "tip", value: "A bare * in the signature means everything after it must be passed by name. Use it for boolean flags — move(1, 2, True) tells the reader nothing, move(1, 2, fast=True) tells them everything." }
      ]
    },

    {
      id: "scope",
      icon: "🔒",
      title: "Scope",
      tagline: "Where a name can be seen",
      keywords: "scope local global nonlocal legb shadowing namespace variable visibility",
      blocks: [
        { type: "text", value: "A name created inside a function lives only there. It cannot be seen outside, and it disappears when the function ends." },
        { type: "code", value: `def f():
    inside = 5
    print(inside)     # fine

f()
print(inside)         # NameError` },
        { type: "sub", value: "The LEGB rule" },
        { type: "text", value: "Python looks for a name in four places, in this order:" },
        {
          type: "table",
          head: ["Level", "Means"],
          rows: [
            ["Local", "inside the current function"],
            ["Enclosing", "inside any function wrapping this one"],
            ["Global", "at the top level of the file"],
            ["Built-in", "Python's own names, like len and print"]
          ]
        },
        { type: "sub", value: "Reading against writing" },
        { type: "text", value: "A function may READ a global name freely. Assigning to it creates a new local name instead, leaving the global untouched." },
        { type: "code", value: `count = 0

def read():
    print(count)      # 0 — reading is fine

def write():
    count = 99        # creates a LOCAL count
    
write()
print(count)          # still 0` },
        { type: "warn", value: "Worse, this fails: if a function assigns to a name anywhere in its body, Python treats it as local throughout — so reading it before that line raises UnboundLocalError even though a global of that name exists." },
        { type: "code", value: `count = 0

def broken():
    print(count)      # UnboundLocalError
    count = 1         # this line makes count local everywhere above` },
        { type: "sub", value: "global and nonlocal" },
        { type: "code", value: `count = 0

def increment():
    global count
    count += 1        # now it really is the outer one

def outer():
    total = 0
    def inner():
        nonlocal total
        total += 1    # the enclosing function's variable
    inner()
    return total` },
        {
          type: "compare",
          bad: `total = 0

def add(n):
    global total
    total += n`,
          good: `def add(total, n):
    return total + n

total = add(total, 5)`,
          why: "global makes a function's effect invisible from its call site. Passing values in and returning them out keeps every dependency in the signature where a reader can see it."
        },
        { type: "sub", value: "Shadowing" },
        { type: "code", value: `def f():
    list = [1, 2]     # now list() is unavailable in this function
    return list(range(3))    # TypeError` },
        { type: "note", value: "Mutable arguments are the exception to all of this. A function cannot rebind the caller's name, but it can absolutely change the object that name points at. See Copying & References." }
      ]
    },

    {
      id: "lambda",
      icon: "λ",
      title: "Lambda",
      tagline: "A function without a name",
      keywords: "lambda anonymous inline function key sort map filter expression short",
      blocks: [
        { type: "syntax", value: "lambda parameters: expression" },
        { type: "text", value: "A lambda is a small function written inline. It holds exactly one expression, and its value is automatically returned." },
        { type: "code", value: `double = lambda n: n * 2
double(5)      # 10

# the same thing, written properly
def double(n):
    return n * 2` },
        { type: "warn", value: "Do not assign a lambda to a name like that. If it needs a name it should be a def — you get a docstring, a readable traceback, and no reason to squeeze it onto one line." },
        { type: "sub", value: "Where lambdas belong" },
        { type: "text", value: "As a throwaway argument to a function that takes a function." },
        { type: "code", value: `sorted(pairs, key=lambda p: p[1])
sorted(people, key=lambda p: (-p["score"], p["name"]))
max(words, key=lambda w: len(w))
filter(lambda n: n % 2 == 0, numbers)` },
        { type: "sub", value: "Limits" },
        {
          type: "list",
          items: [
            "One expression only. No statements, no if blocks, no loops, no assignment.",
            "No docstring.",
            "Shows up as <lambda> in a traceback, which tells you nothing."
          ]
        },
        { type: "code", value: `# a conditional expression IS an expression, so this works
lambda n: "even" if n % 2 == 0 else "odd"

# this does not
lambda n: if n > 0: return n     # SyntaxError` },
        {
          type: "compare",
          bad: `sorted(items, key=lambda x: (x.priority, -x.score, x.name.lower()))`,
          good: `def sort_order(item):
    return (item.priority, -item.score, item.name.lower())

sorted(items, key=sort_order)`,
          why: "Once the expression stops fitting comfortably on one line, a named function is easier to read, test and reuse."
        }
      ]
    },

    {
      id: "higher-order",
      icon: "🎩",
      title: "Functions as Values",
      tagline: "map, filter, closures, decorators",
      keywords: "higher order function map filter reduce closure decorator wrapper callback first class",
      blocks: [
        { type: "text", value: "A function is a value like any other. You can store it, pass it, return it from another function." },
        { type: "code", value: `def shout(word):
    return word.upper()

f = shout          # no brackets — the function itself
f("hi")            # 'HI'

actions = {"shout": shout, "whisper": str.lower}
actions["shout"]("hi")` },
        { type: "sub", value: "map and filter" },
        { type: "code", value: `map(str.upper, words)               # apply to each
filter(lambda n: n > 0, numbers)    # keep those that pass

list(map(int, ["1", "2", "3"]))     # [1, 2, 3]` },
        {
          type: "compare",
          bad: `list(map(lambda n: n * 2, numbers))
list(filter(lambda n: n > 0, numbers))`,
          good: `[n * 2 for n in numbers]
[n for n in numbers if n > 0]`,
          why: "Comprehensions do the same work and most Python programmers find them easier to read. map is still worth using when you already have a named function: map(int, parts)."
        },
        { type: "sub", value: "reduce" },
        { type: "code", value: `from functools import reduce
reduce(lambda a, b: a * b, [1, 2, 3, 4])    # 24

# usually there is a better way
sum(numbers)
max(numbers)
math.prod(numbers)` },
        { type: "sub", value: "Closures" },
        { type: "text", value: "A function defined inside another remembers the outer function's variables, even after the outer one has finished." },
        { type: "code", value: `def multiplier(n):
    def multiply(x):
        return x * n      # n is remembered
    return multiply

double = multiplier(2)
triple = multiplier(3)
double(5)     # 10
triple(5)     # 15` },
        { type: "sub", value: "Decorators" },
        { type: "text", value: "A decorator wraps a function in another function. The @ line is shorthand for reassigning the name." },
        { type: "code", value: `def announce(func):
    def wrapper(*args, **kwargs):
        print("calling", func.__name__)
        result = func(*args, **kwargs)
        print("done")
        return result
    return wrapper

@announce
def greet(name):
    print("Hello", name)

greet("Quackbit")
# calling greet
# Hello Quackbit
# done` },
        { type: "text", value: "The @ line means exactly greet = announce(greet)." },
        { type: "code", value: `from functools import wraps

def announce(func):
    @wraps(func)          # keeps the original name and docstring
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper` },
        { type: "tip", value: "Decorators you will meet before you write your own: @property, @staticmethod, @classmethod on classes, and @functools.lru_cache for automatic memoisation." }
      ]
    },

    {
      id: "generators",
      icon: "🌊",
      title: "Generators",
      tagline: "Producing values one at a time",
      keywords: "generator yield lazy iterator memory infinite next stopiteration expression",
      blocks: [
        { type: "text", value: "A function containing yield is a generator. Instead of building everything and returning it, it hands back one value at a time and pauses, resuming where it left off." },
        { type: "code", value: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

for value in countdown(3):
    print(value)      # 3, 2, 1` },
        { type: "sub", value: "Why bother" },
        {
          type: "compare",
          bad: `def squares(n):
    result = []
    for i in range(n):
        result.append(i * i)
    return result

for x in squares(10_000_000):
    ...`,
          good: `def squares(n):
    for i in range(n):
        yield i * i

for x in squares(10_000_000):
    ...`,
          why: "The left builds a ten-million-item list in memory before the loop starts. The right holds one number at a time. Same output, vastly different cost."
        },
        { type: "sub", value: "Generator expressions" },
        { type: "code", value: `squares = (n * n for n in range(1000000))   # brackets, not square brackets

total = sum(n * n for n in range(1000000))  # no intermediate list
any(n < 0 for n in numbers)` },
        { type: "sub", value: "They can be endless" },
        { type: "code", value: `def naturals():
    n = 0
    while True:
        yield n
        n += 1

for n in naturals():
    if n > 100:
        break
    print(n)` },
        { type: "warn", value: "A generator is exhausted once. After you have looped over it, it is empty — looping again gives nothing. If you need the values twice, convert to a list." },
        { type: "code", value: `gen = (n for n in range(3))
list(gen)     # [0, 1, 2]
list(gen)     # [] — already spent` },
        { type: "sub", value: "next()" },
        { type: "code", value: `gen = countdown(3)
next(gen)     # 3
next(gen)     # 2
next(gen, "done")    # a default instead of StopIteration` },
        { type: "sub", value: "yield from" },
        { type: "code", value: `def chain(a, b):
    yield from a
    yield from b

list(chain([1, 2], [3, 4]))    # [1, 2, 3, 4]` }
      ]
    },

    {
      id: "recursion",
      icon: "🪞",
      title: "Recursion",
      tagline: "A function that calls itself",
      keywords: "recursion recursive base case stack depth limit memoization fibonacci factorial tree",
      blocks: [
        { type: "text", value: "A recursive function solves a problem by calling itself on a smaller version of the same problem. Every one needs two parts: a base case that stops, and a step that moves toward it." },
        { type: "code", value: `def factorial(n):
    if n <= 1:          # base case
        return 1
    return n * factorial(n - 1)    # recursive step

factorial(5)    # 120` },
        { type: "code", label: "how it unwinds", value: `factorial(5)
= 5 * factorial(4)
= 5 * 4 * factorial(3)
= 5 * 4 * 3 * factorial(2)
= 5 * 4 * 3 * 2 * factorial(1)
= 5 * 4 * 3 * 2 * 1
= 120` },
        { type: "warn", value: "No base case, or a step that does not approach it, means RecursionError. Python stops at about 1000 nested calls, deliberately — it is a guard against a runaway function taking the whole program down." },
        { type: "sub", value: "Where recursion earns its place" },
        { type: "text", value: "Anything shaped like a tree: nested folders, nested lists, parsing, exploring a maze. There the recursive version is genuinely simpler than the loop." },
        { type: "code", value: `def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

flatten([1, [2, [3, [4]]]])    # [1, 2, 3, 4]` },
        { type: "sub", value: "Where it does not" },
        {
          type: "compare",
          bad: `def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

fib(35)   # takes many seconds`,
          good: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a

fib(35)   # instant`,
          why: "The recursive version recomputes the same values exponentially many times — fib(30) calls fib(5) over 800,000 times. The loop computes each once."
        },
        { type: "sub", value: "Memoisation" },
        { type: "text", value: "If you must keep the recursive shape, cache the answers so each is computed once." },
        { type: "code", value: `from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

fib(100)    # instant` },
        { type: "note", value: "Every recursion can be rewritten as a loop, and in Python the loop is usually faster because there is no call overhead and no depth limit. Choose recursion when it makes the code clearer, not because it feels clever." }
      ]
    },

    {
      id: "type-hints",
      icon: "🏷️",
      title: "Type Hints",
      tagline: "Saying what goes in and out",
      keywords: "type hint annotation typing optional union list dict callable mypy signature",
      blocks: [
        { type: "text", value: "Hints document what a function expects and returns. Python does not enforce them at all — they are for humans, editors and checking tools." },
        { type: "syntax", value: "def name(param: type) -> return_type:" },
        { type: "code", value: `def jump_or_step(stone_index: int) -> str:
    return "JUMP" if stone_index % 2 else "STEP"

def total(numbers: list[int]) -> int:
    return sum(numbers)

def find(data: dict[str, int], key: str) -> int | None:
    return data.get(key)` },
        {
          type: "table",
          head: ["Hint", "Means"],
          rows: [
            ["int, str, float, bool", "the basic types"],
            ["list[int]", "a list of integers"],
            ["dict[str, int]", "string keys, integer values"],
            ["tuple[int, int]", "exactly two integers"],
            ["set[str]", "a set of strings"],
            ["int | None", "an integer or None"],
            ["list[int] | None", "either, often a default of None"],
            ["Any", "anything at all"],
            ["Callable[[int], str]", "a function taking int, returning str"]
          ]
        },
        { type: "code", value: `from typing import Any, Callable

def apply(f: Callable[[int], int], values: list[int]) -> list[int]:
    return [f(v) for v in values]

def setting(name: str, default: Any = None) -> Any:
    ...` },
        { type: "warn", value: "Hints are never checked at runtime. A function hinted -> int will happily return a string, and Python will not complain. Tools like mypy check them separately, before you run anything." },
        { type: "text", value: "Variables can carry hints too." },
        { type: "code", value: `count: int = 0
names: list[str] = []
config: dict[str, str] = {}` },
        { type: "note", value: "For your Guardian solutions these are optional, and adding them everywhere on a small script is noise. They start paying rent when a function is used from several places, or when it takes a nested structure and the shape is not obvious from the name." }
      ]
    }

  ]
});