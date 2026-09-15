window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "values",
  icon: "📦",
  title: "Values & Variables",
  blurb: "Every kind of thing Python can hold, the names you give them, and how one kind becomes another.",
  sections: [

    {
      id: "variables",
      icon: "🏷️",
      title: "Variables",
      tagline: "Names attached to values",
      keywords: "variable assignment name box store reassign multiple swap augmented constant delete",
      blocks: [
        { type: "text", value: "A variable is a name pointing at a value. The equals sign does not mean 'is equal to' — it means 'from now on, this name refers to that value'." },
        { type: "syntax", value: "name = value" },
        { type: "code", value: `stones = 12
name = "Quackbit"
is_safe = True
nothing_yet = None` },
        { type: "text", value: "Point the name somewhere else and the old value is forgotten. The name does not remember its past." },
        { type: "code", value: `count = 0
count = count + 1    # 1
count += 1           # 2` },
        { type: "sub", value: "Augmented assignment" },
        { type: "text", value: "Every arithmetic operator has a shorthand that reads the variable, changes it, and stores it back." },
        {
          type: "table",
          head: ["Shorthand", "Means", "Example"],
          rows: [
            ["x += 3", "x = x + 3", "add"],
            ["x -= 3", "x = x - 3", "subtract"],
            ["x *= 3", "x = x * 3", "multiply"],
            ["x /= 3", "x = x / 3", "divide (gives a float)"],
            ["x //= 3", "x = x // 3", "divide, drop the remainder"],
            ["x %= 3", "x = x % 3", "keep only the remainder"],
            ["x **= 3", "x = x ** 3", "raise to a power"]
          ]
        },
        { type: "sub", value: "Assigning several at once" },
        { type: "code", value: `x, y = 3, 7
low, high = 0, len(pile) - 1

a = b = c = 0        # all three point at 0

x, y = y, x          # swap, no temporary variable needed` },
        { type: "tip", value: "That last line is the Python way to swap two values. In most languages you need a third variable to hold one of them while you move the other. Here the right-hand side is built first, then unpacked." },
        { type: "sub", value: "Unpacking" },
        { type: "code", value: `point = (4, 9)
x, y = point                 # x is 4, y is 9

first, *rest = [1, 2, 3, 4]  # first is 1, rest is [2, 3, 4]
*most, last = [1, 2, 3, 4]   # most is [1, 2, 3], last is 4` },
        { type: "warn", value: "Unpacking demands an exact match unless you use a star. Writing a, b = [1, 2, 3] raises ValueError: too many values to unpack." },
        { type: "sub", value: "Deleting a name" },
        { type: "code", value: `del stones     # the name is gone; using it now raises NameError` },
        { type: "note", value: "Two names can point at the same value. For numbers and strings that never matters, because those cannot be changed. For lists and dictionaries it matters enormously — see Copying in Data Structures." }
      ]
    },

    {
      id: "naming",
      icon: "✏️",
      title: "Naming Rules",
      tagline: "What you may call things, and what you should",
      keywords: "naming identifier rules keywords reserved snake case convention pep8 valid invalid underscore",
      blocks: [
        { type: "sub", value: "The rules Python enforces" },
        {
          type: "list",
          items: [
            "Letters, digits and underscores only. No spaces, no dashes, no punctuation.",
            "Must not start with a digit. 2fast is invalid; fast2 is fine.",
            "Case matters. total, Total and TOTAL are three different names.",
            "Must not be one of Python's reserved keywords."
          ]
        },
        {
          type: "compare",
          bad: `2stones = 4
snake distance = 10
total-count = 5
class = "warrior"`,
          good: `stones_2 = 4
snake_distance = 10
total_count = 5
character_class = "warrior"`,
          why: "The left column raises SyntaxError on every line. The last is a keyword, which Python has already reserved for something else."
        },
        { type: "sub", value: "Reserved keywords" },
        { type: "text", value: "These 35 words belong to the language. You cannot use any of them as a name." },
        {
          type: "table",
          head: ["", "", "", ""],
          rows: [
            ["False", "None", "True", "and"],
            ["as", "assert", "async", "await"],
            ["break", "class", "continue", "def"],
            ["del", "elif", "else", "except"],
            ["finally", "for", "from", "global"],
            ["if", "import", "in", "is"],
            ["lambda", "nonlocal", "not", "or"],
            ["pass", "raise", "return", "try"],
            ["while", "with", "yield", ""]
          ]
        },
        { type: "sub", value: "The conventions everyone follows" },
        {
          type: "table",
          head: ["Thing", "Style", "Example"],
          rows: [
            ["variable", "lowercase with underscores", "snake_distance"],
            ["function", "lowercase with underscores", "jump_or_step"],
            ["constant", "all capitals", "MAX_STONES"],
            ["class", "capitalised words", "PotatoVillage"],
            ["private-ish", "leading underscore", "_internal"],
            ["throwaway", "a single underscore", "for _ in range(3)"]
          ]
        },
        { type: "warn", value: "Do not name a variable after a built-in function. Writing list = [1,2,3] means list() no longer works for the rest of the program, and the error it eventually causes will point somewhere completely unrelated. The usual victims are list, dict, str, sum, min, max, type, id and input." },
        { type: "note", value: "Name for what it holds, not for how short it is. distance_walked costs eleven extra keystrokes and saves an hour of confusion later. The only acceptable single letters are i, j, k for loop counters and x, y for coordinates." }
      ]
    },

    {
      id: "numbers",
      icon: "🔢",
      title: "Numbers",
      tagline: "int, float, complex",
      keywords: "int float integer decimal complex number precision rounding underscore literal binary hex octal infinity",
      blocks: [
        { type: "text", value: "Python has three kinds of number. You will use two of them." },
        {
          type: "table",
          head: ["Kind", "What", "Examples"],
          rows: [
            ["int", "whole numbers, no size limit", "7, 0, -3, 10**100"],
            ["float", "numbers with a decimal point", "2.5, -0.1, 3.0"],
            ["complex", "has an imaginary part", "3 + 4j"]
          ]
        },
        { type: "sub", value: "Integers are unbounded" },
        { type: "text", value: "Unlike most languages, a Python int has no maximum. It grows to whatever size it needs." },
        { type: "code", value: `big = 2 ** 200
print(big)
# 1606938044258990275541962092341162602522202993782792835301376` },
        { type: "sub", value: "Writing numbers readably" },
        { type: "code", value: `population = 1_000_000     # underscores are ignored, purely for your eyes
binary = 0b1010            # 10
octal = 0o17               # 15
hexadecimal = 0xFF         # 255
scientific = 1.5e3         # 1500.0` },
        { type: "sub", value: "The float trap" },
        { type: "warn", value: "Floats are stored in binary, and some decimal fractions have no exact binary form — exactly as one third has no exact decimal form. This is not a Python bug; every language that uses this standard behaves the same way." },
        { type: "code", value: `0.1 + 0.2
# 0.30000000000000004

0.1 + 0.2 == 0.3
# False` },
        { type: "text", value: "So never compare two floats with ==. Compare the size of their difference instead." },
        {
          type: "compare",
          bad: `if total == 0.3:
    print("equal")`,
          good: `if abs(total - 0.3) < 1e-9:
    print("close enough")`,
          why: "1e-9 is the tolerance. Anything closer than that counts as the same number for practical purposes."
        },
        { type: "text", value: "When exact decimals genuinely matter — money, especially — use the decimal module instead of floats." },
        { type: "code", value: `from decimal import Decimal
Decimal("0.1") + Decimal("0.2")     # Decimal('0.3')` },
        { type: "sub", value: "Special float values" },
        { type: "code", value: `float("inf")      # infinity, larger than any number
float("-inf")     # negative infinity
float("nan")      # not a number

best = float("inf")
for value in pile:
    if value < best:
        best = value` },
        { type: "tip", value: "Starting a 'find the smallest' search at float('inf') means the first real value always wins the first comparison. It saves a special case for the empty start." }
      ]
    },

    {
      id: "booleans",
      icon: "🔘",
      title: "Booleans & Truthiness",
      tagline: "True, False, and what counts as either",
      keywords: "bool boolean true false truthy falsy empty zero none condition",
      blocks: [
        { type: "text", value: "There are exactly two boolean values: True and False. Capital first letter, always. Every comparison produces one of them." },
        { type: "code", value: `5 > 3          # True
5 == 4         # False
"a" in "cat"   # True` },
        { type: "sub", value: "Booleans are numbers underneath" },
        { type: "code", value: `True + True      # 2
False * 10       # 0
int(True)        # 1

vowels = "potatis"
count = sum(1 for ch in vowels if ch in "aeiou")   # 3
count = sum(ch in "aeiou" for ch in vowels)        # 3, same thing` },
        { type: "tip", value: "Because True counts as 1, summing a series of tests gives you how many were true. It is a tidy way to count matches without writing a counter and a loop body." },
        { type: "sub", value: "Truthiness" },
        { type: "text", value: "Anything can be used where a condition is expected. Empty things are treated as False; everything else is True." },
        {
          type: "table",
          head: ["Falsy (counts as False)", "Truthy (counts as True)"],
          rows: [
            ["False", "True"],
            ["None", "any non-zero number"],
            ["0, 0.0", "any non-empty string"],
            ["\"\" (empty string)", "any non-empty list, dict, set, tuple"],
            ["[], {}, (), set()", "any object without a rule saying otherwise"],
            ["range(0)", ""]
          ]
        },
        { type: "code", value: `inventory = []
if inventory:
    print("you have items")
else:
    print("empty")     # this runs` },
        {
          type: "compare",
          bad: `if len(inventory) > 0:
    ...
if name != "":
    ...`,
          good: `if inventory:
    ...
if name:
    ...`,
          why: "Both work, but the right-hand version is what Python programmers write and read. Shorter, and it works the same for lists, strings, dicts and sets."
        },
        { type: "warn", value: "Be careful when zero is a legitimate value. if count: is False when count is 0, which may be exactly the case you wanted to handle. When zero is meaningful, test explicitly: if count is not None." },
        { type: "sub", value: "bool()" },
        { type: "code", value: `bool(0)       # False
bool("")      # False
bool([])      # False
bool("no")    # True  — a non-empty string is True even if it says "no"
bool(" ")     # True  — a space is a character` }
      ]
    },

    {
      id: "none",
      icon: "⚪",
      title: "None",
      tagline: "The absence of a value",
      keywords: "none null nothing default return is not empty sentinel",
      blocks: [
        { type: "text", value: "None represents nothing at all. Not zero, not an empty string — the absence of any value. It is what other languages call null." },
        { type: "code", value: `result = None
print(result)        # None
type(result)         # <class 'NoneType'>` },
        { type: "sub", value: "Where it turns up" },
        {
          type: "list",
          items: [
            "A function with no return statement hands back None.",
            "Methods that change a list in place — .append(), .sort(), .reverse() — return None.",
            "dict.get() returns None when the key is missing.",
            "As a starting value for something not filled in yet."
          ]
        },
        { type: "code", value: `def shout(word):
    print(word.upper())

value = shout("hi")     # prints HI
print(value)            # None — shout returns nothing` },
        { type: "sub", value: "Testing for it" },
        {
          type: "compare",
          bad: `if result == None:
    ...`,
          good: `if result is None:
    ...`,
          why: "There is only ever one None in a running program, so identity (is) is both faster and more correct than equality. Use is None and is not None, always."
        },
        { type: "warn", value: "The classic beginner disaster: values = values.sort(). Because .sort() returns None, your list is replaced by None and everything after it fails. Use values.sort() on its own line, or new = sorted(values)." },
        { type: "tip", value: "None is useful as a 'not supplied' marker in function parameters, especially where a mutable default would be dangerous — see Functions, Default Arguments." }
      ]
    },

    {
      id: "conversion",
      icon: "🔄",
      title: "Type Conversion",
      tagline: "Turning one kind into another",
      keywords: "convert cast int float str bool list tuple set dict conversion parse valueerror implicit",
      blocks: [
        { type: "text", value: "Python will not quietly guess what you meant. Mixing types that do not combine is an error, and converting is something you ask for explicitly." },
        { type: "syntax", value: "int(x) · float(x) · str(x) · bool(x) · list(x) · tuple(x) · set(x)" },
        {
          type: "table",
          head: ["Call", "Result", "Note"],
          rows: [
            ["int(\"42\")", "42", "text to whole number"],
            ["int(3.9)", "3", "CHOPS the decimal, does not round"],
            ["int(\"3.9\")", "ValueError", "it will not do two steps for you"],
            ["float(\"2.5\")", "2.5", ""],
            ["float(3)", "3.0", ""],
            ["str(42)", "\"42\"", "anything can become text"],
            ["bool(0)", "False", "see Truthiness"],
            ["list(\"abc\")", "['a','b','c']", "splits into characters"],
            ["tuple([1,2])", "(1, 2)", "frozen copy"],
            ["set([1,1,2])", "{1, 2}", "duplicates vanish"],
            ["list({\"a\": 1})", "['a']", "a dict gives its keys"]
          ]
        },
        { type: "warn", value: "int(3.9) is 3, not 4. It truncates toward zero, so int(-3.9) is -3. When you want the nearest whole number, use round()." },
        { type: "code", value: `int(3.9)        # 3
int(-3.9)       # -3
round(3.9)      # 4
round(-3.9)     # -4` },
        { type: "sub", value: "Converting a decimal string" },
        { type: "code", value: `int("3.9")          # ValueError
int(float("3.9"))   # 3 — two explicit steps` },
        { type: "sub", value: "Handling bad input" },
        { type: "code", value: `raw = input("Number: ")
try:
    value = int(raw)
except ValueError:
    print("That was not a whole number.")
    value = 0` },
        { type: "sub", value: "Where Python does convert quietly" },
        { type: "text", value: "Mixed arithmetic between int and float gives a float. That is the one automatic conversion you can rely on." },
        { type: "code", value: `3 + 2.0        # 5.0
7 / 2          # 3.5  — division ALWAYS gives a float
7 // 2         # 3    — unless you ask for floor division` },
        { type: "note", value: "round() has a surprise worth knowing: it rounds halves to the nearest EVEN number, so round(0.5) is 0 and round(1.5) is 2. This is deliberate — always rounding up would bias any large set of numbers upward." }
      ]
    },

    {
      id: "type-checking",
      icon: "🔍",
      title: "Checking a Type",
      tagline: "type() and isinstance()",
      keywords: "type isinstance check class instance duck typing hasattr",
      blocks: [
        { type: "code", value: `type(7)           # <class 'int'>
type("a")         # <class 'str'>
type([1, 2])      # <class 'list'>
type(None)        # <class 'NoneType'>` },
        { type: "sub", value: "isinstance() is the one to use" },
        { type: "syntax", value: "isinstance(value, type_or_tuple_of_types)" },
        { type: "code", value: `isinstance(7, int)              # True
isinstance(7, (int, float))     # True — any of these
isinstance(True, int)           # True — bool is a kind of int` },
        {
          type: "compare",
          bad: `if type(x) == int:
    ...`,
          good: `if isinstance(x, int):
    ...`,
          why: "isinstance also accepts subclasses and several types at once. type() == is an exact match and quietly rejects things that should have passed."
        },
        { type: "warn", value: "isinstance(True, int) is True, because Python's bool is built on top of int. If you need to reject booleans specifically, test for them first." },
        { type: "note", value: "Python's usual style is to not check types at all — just use the value and let it fail if it cannot do what you asked. Checking is worth it at the edges of your program, where input arrives and you cannot trust its shape. Inside your own code, it is mostly noise." }
      ]
    }

  ]
});