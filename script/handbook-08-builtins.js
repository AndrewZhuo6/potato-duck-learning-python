window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "builtins",
  icon: "✨",
  title: "Built-in Functions",
  blurb: "The spells that come with Python. No import, no definition — they are simply always there.",
  sections: [

    {
      id: "builtins-overview",
      icon: "📖",
      title: "The Complete List",
      tagline: "All 71, at a glance",
      keywords: "builtin functions list all complete reference overview index",
      blocks: [
        { type: "text", value: "These need no import. The sections below explain the ones you will actually use; this table is here so you can see the whole set in one place." },
        {
          type: "table",
          head: ["", "", "", ""],
          rows: [
            ["abs", "aiter", "all", "anext"],
            ["any", "ascii", "bin", "bool"],
            ["breakpoint", "bytearray", "bytes", "callable"],
            ["chr", "classmethod", "compile", "complex"],
            ["delattr", "dict", "dir", "divmod"],
            ["enumerate", "eval", "exec", "filter"],
            ["float", "format", "frozenset", "getattr"],
            ["globals", "hasattr", "hash", "help"],
            ["hex", "id", "input", "int"],
            ["isinstance", "issubclass", "iter", "len"],
            ["list", "locals", "map", "max"],
            ["memoryview", "min", "next", "object"],
            ["oct", "open", "ord", "pow"],
            ["print", "property", "range", "repr"],
            ["reversed", "round", "set", "setattr"],
            ["slice", "sorted", "staticmethod", "str"],
            ["sum", "super", "tuple", "type"],
            ["vars", "zip", "__import__", ""]
          ]
        },
        { type: "note", value: "You will not remember this table, and nobody expects you to. Remember only that the spell probably already exists, and come back and look. That habit is worth more than memorising every row." }
      ]
    },

    {
      id: "builtins-numbers",
      icon: "🔢",
      title: "Numbers & Maths",
      tagline: "abs, round, pow, divmod, sum, min, max",
      keywords: "abs round pow divmod sum min max number math absolute rounding key default",
      blocks: [
        {
          type: "table",
          head: ["Call", "Does", "Example"],
          rows: [
            ["abs(x)", "distance from zero", "abs(-4) → 4"],
            ["round(x)", "nearest whole number", "round(2.6) → 3"],
            ["round(x, n)", "round to n decimals", "round(2.567, 2) → 2.57"],
            ["pow(a, b)", "a to the power b", "pow(2, 3) → 8"],
            ["pow(a, b, m)", "(a ** b) % m, fast", "pow(2, 10, 7) → 2"],
            ["divmod(a, b)", "quotient and remainder", "divmod(17, 5) → (3, 2)"],
            ["sum(x)", "add them all up", "sum([1,2,3]) → 6"],
            ["sum(x, start)", "starting from start", "sum([1,2], 10) → 13"],
            ["min(x)", "the smallest", "min([3,1,2]) → 1"],
            ["max(x)", "the largest", "max([3,1,2]) → 3"]
          ]
        },
        { type: "sub", value: "min and max take a key" },
        { type: "code", value: `max([3, 1, 2])                      # 3
max("a", "b", "c")                  # 'c' — several arguments also work
max(words, key=len)                 # the LONGEST word, not the length
max(people, key=lambda p: p.age)    # the whole person
min(values, default=0)              # 0 instead of ValueError when empty` },
        { type: "warn", value: "min() and max() on an empty sequence raise ValueError. Pass default= when the collection might be empty." },
        { type: "sub", value: "round's surprise" },
        { type: "code", value: `round(0.5)     # 0  — not 1
round(1.5)     # 2
round(2.5)     # 2  — not 3` },
        { type: "text", value: "It rounds halves to the nearest EVEN number. This is deliberate: always rounding up would bias any large set of numbers upward. If you want the school rule, use math.floor(x + 0.5)." },
        { type: "sub", value: "sum on other things" },
        { type: "code", value: `sum([1.5, 2.5])                     # 4.0
sum(1 for ch in word if ch in "aeiou")   # counting
sum(n % 2 == 0 for n in numbers)         # counting, since True is 1

# not for strings — use join
sum(["a", "b"])       # TypeError` }
      ]
    },

    {
      id: "builtins-sequences",
      icon: "📏",
      title: "Sequences & Iteration",
      tagline: "len, range, enumerate, zip, sorted, reversed",
      keywords: "len range enumerate zip sorted reversed iter next slice all any filter map",
      blocks: [
        {
          type: "table",
          head: ["Call", "Does"],
          rows: [
            ["len(x)", "how many items or characters"],
            ["range(n)", "0 up to n-1"],
            ["enumerate(x)", "pairs of (position, item)"],
            ["zip(a, b)", "pairs of (a-item, b-item)"],
            ["sorted(x)", "a new sorted list"],
            ["reversed(x)", "walk backwards"],
            ["iter(x)", "make an iterator"],
            ["next(it)", "pull the next value"],
            ["all(x)", "True if every item is truthy"],
            ["any(x)", "True if at least one is truthy"],
            ["filter(f, x)", "keep items where f is true"],
            ["map(f, x)", "apply f to every item"],
            ["slice(a, b, c)", "a reusable slice object"]
          ]
        },
        { type: "code", value: `len("potato")        # 6
len([1, 2, 3])       # 3
len({"a": 1})        # 1

for i, item in enumerate(items, start=1):
    print(i, item)

for a, b in zip(names, scores):
    print(a, b)

list(reversed([1, 2, 3]))    # [3, 2, 1]` },
        { type: "sub", value: "all and any" },
        { type: "code", value: `all([True, True])          # True
all([])                    # True  — vacuously, nothing failed
any([False, True])         # True
any([])                    # False — nothing succeeded

all(n > 0 for n in numbers)
any(ch in "aeiou" for ch in word)` },
        { type: "warn", value: "all([]) is True and any([]) is False. On an empty collection these give the opposite answers, which is mathematically correct and occasionally surprising in a loop." },
        { type: "sub", value: "zip in both directions" },
        { type: "code", value: `# pairing up
pairs = list(zip([1, 2], "ab"))     # [(1, 'a'), (2, 'b')]

# unzipping — the star spreads the list back out
numbers, letters = zip(*pairs)      # (1, 2), ('a', 'b')

# transposing a grid
matrix = [[1, 2], [3, 4]]
list(zip(*matrix))                  # [(1, 3), (2, 4)]` },
        { type: "warn", value: "zip stops at the shortest input and silently ignores the rest. Pass strict=True (Python 3.10+) to raise an error when lengths differ." },
        { type: "sub", value: "next with a default" },
        { type: "code", value: `# the first item matching a test, or None
first_even = next((n for n in numbers if n % 2 == 0), None)` },
        { type: "tip", value: "That pattern finds the first match without building a whole filtered list, and stops as soon as it succeeds." }
      ]
    },

    {
      id: "builtins-types",
      icon: "🔄",
      title: "Types & Conversion",
      tagline: "int, float, str, bool, list, dict, set, tuple",
      keywords: "int float str bool list dict set tuple type isinstance issubclass callable conversion constructor",
      blocks: [
        {
          type: "table",
          head: ["Call", "Makes", "Example"],
          rows: [
            ["int(x)", "a whole number", "int(\"42\") → 42"],
            ["int(x, base)", "from another base", "int(\"ff\", 16) → 255"],
            ["float(x)", "a decimal number", "float(\"2.5\") → 2.5"],
            ["str(x)", "text", "str(42) → \"42\""],
            ["bool(x)", "True or False", "bool(0) → False"],
            ["list(x)", "a list", "list(\"ab\") → ['a','b']"],
            ["tuple(x)", "a tuple", "tuple([1,2]) → (1,2)"],
            ["set(x)", "a set", "set([1,1]) → {1}"],
            ["frozenset(x)", "an unchangeable set", ""],
            ["dict(...)", "a dictionary", "dict(a=1) → {'a': 1}"],
            ["complex(a, b)", "a complex number", "complex(3,4) → (3+4j)"],
            ["bytes(x)", "raw bytes", ""],
            ["bytearray(x)", "changeable bytes", ""]
          ]
        },
        { type: "code", value: `# dict has several forms
dict(a=1, b=2)                    # {'a': 1, 'b': 2}
dict([("a", 1), ("b", 2)])        # from pairs
dict(zip(keys, values))           # from two lists
dict.fromkeys("abc", 0)           # {'a': 0, 'b': 0, 'c': 0}` },
        { type: "sub", value: "Asking about types" },
        { type: "code", value: `type(7)                    # <class 'int'>
isinstance(7, int)         # True
isinstance(7, (int, float))# True — any of these
issubclass(bool, int)      # True
callable(print)            # True — can it be called?
callable(7)                # False` },
        { type: "sub", value: "Number bases" },
        {
          type: "table",
          head: ["Call", "Gives"],
          rows: [
            ["bin(10)", "'0b1010'"],
            ["oct(10)", "'0o12'"],
            ["hex(255)", "'0xff'"],
            ["int(\"1010\", 2)", "10"],
            ["int(\"ff\", 16)", "255"]
          ]
        }
      ]
    },

    {
      id: "builtins-text",
      icon: "🔤",
      title: "Text & Display",
      tagline: "print, input, format, repr, ord, chr",
      keywords: "print input format repr ascii ord chr len output display string representation",
      blocks: [
        {
          type: "table",
          head: ["Call", "Does"],
          rows: [
            ["print(...)", "show values to a human"],
            ["input(prompt)", "read a line of text"],
            ["format(x, spec)", "format one value"],
            ["repr(x)", "the developer-facing text form"],
            ["ascii(x)", "repr with non-ASCII escaped"],
            ["ord(c)", "a character's code number"],
            ["chr(n)", "the character for a code"]
          ]
        },
        { type: "sub", value: "str against repr" },
        { type: "code", value: `s = "hi\\nthere"

print(str(s))     # hi
                  # there
print(repr(s))    # 'hi\\nthere'

str(3.0)          # '3.0'
repr([1, "a"])    # "[1, 'a']"` },
        { type: "text", value: "str() is for people; repr() is for you, when debugging. repr shows the quotes and the escapes, so you can see exactly what a value is rather than how it looks." },
        { type: "tip", value: "When a printed value looks right but behaves wrong, print its repr. That is how you spot the trailing space or the string \"5\" masquerading as the number 5." },
        { type: "sub", value: "format()" },
        { type: "code", value: `format(3.14159, ".2f")     # '3.14'
format(42, "05")           # '00042'
format(1234567, ",")       # '1,234,567'

# usually an f-string is clearer
f"{3.14159:.2f}"` }
      ]
    },

    {
      id: "builtins-objects",
      icon: "🔍",
      title: "Inspection",
      tagline: "help, dir, hasattr, getattr, id, vars",
      keywords: "help dir hasattr getattr setattr delattr vars globals locals id hash inspect explore",
      blocks: [
        { type: "text", value: "These let you ask a running program about itself. help and dir in particular are how you explore something you do not know." },
        {
          type: "table",
          head: ["Call", "Does"],
          rows: [
            ["help(x)", "read x's documentation"],
            ["dir(x)", "list every name x has"],
            ["hasattr(x, \"n\")", "does x have attribute n?"],
            ["getattr(x, \"n\")", "fetch attribute n by name"],
            ["getattr(x, \"n\", d)", "or d if missing"],
            ["setattr(x, \"n\", v)", "set attribute n by name"],
            ["delattr(x, \"n\")", "remove attribute n"],
            ["vars(x)", "x's attributes as a dict"],
            ["id(x)", "x's identity number"],
            ["hash(x)", "x's hash, if hashable"],
            ["globals()", "the module's names"],
            ["locals()", "the current scope's names"]
          ]
        },
        { type: "code", value: `help(len)
help(str.split)
help("".join)

dir(str)      # every string method
dir([])       # every list method

# what can this thing do?
[name for name in dir(str) if not name.startswith("_")]` },
        { type: "tip", value: "dir() with that filter is the fastest way to discover methods you did not know existed. It works on anything — a module, a class, an instance." },
        { type: "sub", value: "Attributes by name" },
        { type: "code", value: `getattr(obj, "name", "unknown")

action = "upper"
getattr("potato", action)()    # 'POTATO'` }
      ]
    },

    {
      id: "builtins-danger",
      icon: "⚠️",
      title: "The Ones To Avoid",
      tagline: "eval, exec, compile",
      keywords: "eval exec compile danger security injection literal_eval avoid",
      blocks: [
        { type: "text", value: "eval() runs a string as a Python expression. exec() runs a string as Python statements. Both exist, both work, and both are almost always the wrong answer." },
        { type: "code", value: `eval("2 + 3")          # 5
exec("x = 5")          # creates x` },
        { type: "warn", value: "Never call eval or exec on anything a user typed. A string from outside your program can do anything Python can do — read your files, delete them, open a network connection. There is no safe way to sanitise it." },
        {
          type: "compare",
          bad: `value = eval(input("Enter a number: "))`,
          good: `value = int(input("Enter a number: "))`,
          why: "The left will happily execute whatever was typed. The right accepts a number or raises a clean ValueError."
        },
        { type: "sub", value: "When you really need to read a literal" },
        { type: "code", value: `import ast
ast.literal_eval("[1, 2, 3]")     # [1, 2, 3]
ast.literal_eval("__import__('os')")  # ValueError — refuses` },
        { type: "text", value: "literal_eval only accepts literals: numbers, strings, tuples, lists, dicts, sets, booleans, None. It cannot call anything." },
        { type: "note", value: "If you find yourself reaching for eval to build a variable name from a string, you want a dictionary instead. That is what dictionaries are for." }
      ]
    }

  ]
});