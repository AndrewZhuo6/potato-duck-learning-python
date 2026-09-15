window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "operators",
  icon: "⚖️",
  title: "Operators",
  blurb: "Every symbol Python uses to combine, compare and test values, and the order it applies them in.",
  sections: [

    {
      id: "arithmetic",
      icon: "➕",
      title: "Arithmetic",
      tagline: "Doing sums",
      keywords: "arithmetic add subtract multiply divide modulo remainder floor division power exponent negative",
      blocks: [
        {
          type: "table",
          head: ["Operator", "Does", "Example", "Result"],
          rows: [
            ["+", "add", "7 + 2", "9"],
            ["-", "subtract", "7 - 2", "5"],
            ["*", "multiply", "7 * 2", "14"],
            ["/", "divide", "7 / 2", "3.5"],
            ["//", "floor divide", "7 // 2", "3"],
            ["%", "remainder", "7 % 2", "1"],
            ["**", "power", "7 ** 2", "49"]
          ]
        },
        { type: "warn", value: "/ always gives a float, even when it divides evenly. 6 / 3 is 3.0, not 3. If you need a whole number, use // or wrap it in int()." },
        { type: "sub", value: "Floor division" },
        { type: "text", value: "// divides and throws away whatever is left over, rounding DOWN — which for negative numbers means away from zero." },
        { type: "code", value: `7 // 2      # 3
-7 // 2     # -4  (not -3 — it rounds down, not toward zero)
7.0 // 2    # 3.0 (a float in, a float out)` },
        { type: "sub", value: "The remainder operator" },
        { type: "text", value: "% gives what is left after dividing. It is far more useful than it first appears." },
        { type: "code", value: `7 % 2       # 1
10 % 3      # 1
9 % 3       # 0` },
        { type: "text", value: "Four things % is used for constantly:" },
        {
          type: "table",
          head: ["Question", "Test"],
          rows: [
            ["is n even?", "n % 2 == 0"],
            ["is n odd?", "n % 2 == 1  (or just n % 2)"],
            ["does a divide evenly into b?", "b % a == 0"],
            ["wrap around a cycle of size k", "index % k"]
          ]
        },
        { type: "code", value: `# every 10th step, without counting separately
for step in range(1, 31):
    if step % 10 == 0:
        print("checkpoint at", step)

# cycle through 3 colours forever
colours = ["red", "green", "blue"]
for i in range(10):
    print(colours[i % 3])` },
        { type: "tip", value: "The wrap-around trick — index % length — never goes out of range, no matter how large the index gets. It is how you loop a list back to its start." },
        { type: "sub", value: "Powers and roots" },
        { type: "code", value: `2 ** 10      # 1024
2 ** 0.5     # 1.4142... — a square root
27 ** (1/3)  # 3.0000... — a cube root

import math
math.sqrt(16)    # 4.0 — clearer when you mean a square root` },
        { type: "warn", value: "** binds tighter than the minus sign, so -2 ** 2 is -4, not 4. Python raises 2 to the power 2, then negates it. Write (-2) ** 2 if you meant the other thing." },
        { type: "sub", value: "divmod()" },
        { type: "code", value: `divmod(17, 5)    # (3, 2) — quotient and remainder together

hours, minutes = divmod(total_minutes, 60)` }
      ]
    },

    {
      id: "comparison",
      icon: "🔍",
      title: "Comparison",
      tagline: "Asking questions that answer True or False",
      keywords: "comparison equal not equal greater less than chained compare strings sorting",
      blocks: [
        {
          type: "table",
          head: ["Operator", "Asks", "True when"],
          rows: [
            ["==", "are these equal?", "5 == 5"],
            ["!=", "are these different?", "5 != 4"],
            [">", "is left bigger?", "5 > 4"],
            ["<", "is left smaller?", "4 < 5"],
            [">=", "bigger or equal?", "5 >= 5"],
            ["<=", "smaller or equal?", "4 <= 5"]
          ]
        },
        { type: "warn", value: "= assigns a value. == asks a question. Using = inside an if is a SyntaxError in Python, which is a mercy — in many languages it silently compiles and causes a bug you will hunt for hours." },
        { type: "sub", value: "Comparing text" },
        { type: "text", value: "Strings compare character by character using their character codes, which puts all capitals before all lowercase letters." },
        { type: "code", value: `"apple" < "banana"     # True
"Zebra" < "apple"      # True — capital Z (90) beats lowercase a (97)
"abc" == "ABC"         # False

"abc".lower() == "ABC".lower()   # True — the fix` },
        { type: "sub", value: "Chaining" },
        { type: "text", value: "Python lets you write a range check the way mathematics does. Most languages do not." },
        {
          type: "compare",
          bad: `if x >= 0 and x <= 10:
    ...`,
          good: `if 0 <= x <= 10:
    ...`,
          why: "Both are correct; the second reads as one idea rather than two. Python evaluates the middle value only once."
        },
        { type: "code", value: `age = 25
18 <= age < 65        # True

a, b, c = 1, 2, 3
a < b < c             # True` },
        { type: "sub", value: "Comparing lists and tuples" },
        { type: "text", value: "Sequences compare item by item from the left, stopping at the first difference. This is how sorting a list of tuples works." },
        { type: "code", value: `[1, 2, 3] < [1, 2, 4]     # True — differs at the third item
(1, 5) < (2, 0)           # True — the first item decides
[1, 2] < [1, 2, 3]        # True — a prefix is smaller` },
        { type: "warn", value: "Comparing types that have no order raises TypeError. 5 < \"apple\" does not work — Python refuses to guess whether a number comes before a word." }
      ]
    },

    {
      id: "logical",
      icon: "🔗",
      title: "Logical Operators",
      tagline: "and, or, not",
      keywords: "logical and or not boolean short circuit truthy combine condition",
      blocks: [
        {
          type: "table",
          head: ["Operator", "Result"],
          rows: [
            ["a and b", "True only when BOTH are true"],
            ["a or b", "True when AT LEAST ONE is true"],
            ["not a", "flips it — not True is False"]
          ]
        },
        { type: "code", value: `looks_used < 3 and snake_distance <= 2
sign == "shelter" or sign == "safe"
not caught` },
        { type: "sub", value: "Short-circuiting" },
        { type: "text", value: "Python stops as soon as the answer is certain. With and, if the left side is false the right side is never looked at. With or, if the left side is true the right side is never looked at." },
        { type: "code", value: `# safe: if the list is empty, the second test never runs
if inventory and inventory[0] == "torch":
    print("torch first")

# safe: .get() is never called on a missing dict
if data is not None and data.get("key"):
    ...` },
        { type: "tip", value: "Order your conditions so the cheap or protective test comes first. That is not style — it is what stops the second test from crashing on an empty list or a None." },
        { type: "sub", value: "They return values, not just booleans" },
        { type: "text", value: "and and or hand back one of their operands, not necessarily True or False. It still behaves correctly in a condition, but it enables a shorthand." },
        { type: "code", value: `"a" and "b"       # 'b'   — both truthy, so the last one
"" and "b"        # ''    — stopped at the falsy one
"a" or "b"        # 'a'   — stopped at the first truthy one
"" or "fallback"  # 'fallback'

name = user_input or "Anonymous"   # a default when input is empty` },
        { type: "warn", value: "That default trick fires on any falsy value, including 0 and an empty list. If zero is a legitimate answer, test explicitly with is None instead." },
        { type: "sub", value: "Rewriting not" },
        { type: "text", value: "Pushing not through an and or an or flips both the operator and each side. Knowing this lets you simplify tangled conditions." },
        {
          type: "table",
          head: ["Written", "Same as"],
          rows: [
            ["not (a and b)", "not a or not b"],
            ["not (a or b)", "not a and not b"],
            ["not (x > 5)", "x <= 5"],
            ["not (x == y)", "x != y"]
          ]
        },
        {
          type: "compare",
          bad: `if not (x > 5 and x < 10):
    ...`,
          good: `if x <= 5 or x >= 10:
    ...`,
          why: "Same result, one less layer of negation to hold in your head."
        }
      ]
    },

    {
      id: "membership",
      icon: "📥",
      title: "Membership",
      tagline: "in and not in",
      keywords: "in not in membership contains search substring list dict set speed",
      blocks: [
        { type: "text", value: "in asks whether something is inside something else. It works on every container Python has." },
        { type: "code", value: `"a" in "cat"                    # True — a substring
3 in [1, 2, 3]                  # True — a list item
"torch" not in inventory        # True when absent
"name" in {"name": "Quackbit"}  # True — checks KEYS, not values
5 in range(10)                  # True` },
        { type: "warn", value: "On a dictionary, in tests the keys. To search the values you must say it: if \"Quackbit\" in data.values()." },
        { type: "sub", value: "Speed matters here" },
        {
          type: "table",
          head: ["Container", "Time to check", "Meaning"],
          rows: [
            ["list", "O(n)", "walks every item until found"],
            ["tuple", "O(n)", "same"],
            ["string", "O(n)", "same"],
            ["set", "O(1)", "instant, whatever the size"],
            ["dict (keys)", "O(1)", "instant, whatever the size"]
          ]
        },
        { type: "text", value: "So when you will be checking membership many times over a large collection, convert it to a set once and check against that." },
        {
          type: "compare",
          bad: `for word in many_words:
    if word in big_list:
        ...`,
          good: `lookup = set(big_list)
for word in many_words:
    if word in lookup:
        ...`,
          why: "The left version re-walks the whole list for every word. With 10,000 words against a 10,000-item list that is 100 million comparisons; the right version is 10,000."
        },
        { type: "sub", value: "Testing several at once" },
        { type: "code", value: `if ch in "aeiou":                     # a vowel
if answer in ("yes", "y", "yeah"):    # any of these
if not any(c in text for c in "!?."): # none of these` }
      ]
    },

    {
      id: "identity",
      icon: "🆔",
      title: "Identity",
      tagline: "is and is not",
      keywords: "is identity equality same object id none memory reference interning",
      blocks: [
        { type: "text", value: "== asks whether two values LOOK the same. is asks whether they are the very same object in memory. These are different questions and confusing them causes strange bugs." },
        { type: "code", value: `a = [1, 2, 3]
b = [1, 2, 3]
c = a

a == b     # True  — same contents
a is b     # False — two separate lists
a is c     # True  — c is another name for the same list` },
        { type: "sub", value: "When to use is" },
        {
          type: "list",
          items: [
            "Comparing with None — always is None, never == None",
            "Comparing with True or False when you truly mean the singleton objects",
            "Asking whether two names point at the same mutable object"
          ]
        },
        { type: "code", value: `if result is None:
    ...
if result is not None:
    ...` },
        { type: "warn", value: "Never use is to compare numbers or strings. Python quietly reuses small integers and short strings, so 5 is 5 may be True while 500 is 500 is False — on the same machine, in the same session. It is an implementation detail, not something to rely on." },
        { type: "code", value: `a = 256
b = 256
a is b      # True — small ints are cached

a = 257
b = 257
a is b      # may be False — nothing is guaranteed here

a == b      # True — this is the question you meant` },
        { type: "sub", value: "id()" },
        { type: "code", value: `id(a)       # a number identifying the object
id(a) == id(b)    # exactly what "a is b" asks` },
        { type: "note", value: "The reason this matters is mutability. If two names point at the same list, changing it through one name changes what the other name sees. For numbers and strings, which cannot be changed at all, the distinction never bites." }
      ]
    },

    {
      id: "bitwise",
      icon: "🔢",
      title: "Bitwise Operators",
      tagline: "Working on the binary digits",
      keywords: "bitwise and or xor not shift binary bits mask flags",
      blocks: [
        { type: "text", value: "These operate on the individual binary digits of whole numbers. You will rarely need them, but they turn up in flags, masks and certain puzzle solutions." },
        {
          type: "table",
          head: ["Operator", "Name", "Example", "Result"],
          rows: [
            ["&", "and", "12 & 10", "8"],
            ["|", "or", "12 | 10", "14"],
            ["^", "xor", "12 ^ 10", "6"],
            ["~", "not", "~12", "-13"],
            ["<<", "shift left", "3 << 2", "12"],
            [">>", "shift right", "12 >> 2", "3"]
          ]
        },
        { type: "code", label: "12 & 10 in binary", value: `  1100   (12)
& 1010   (10)
------
  1000   (8)` },
        { type: "sub", value: "The tricks worth knowing" },
        {
          type: "table",
          head: ["Written", "Does", "Why"],
          rows: [
            ["n & 1", "1 if odd, 0 if even", "the last bit is the odd one"],
            ["n << 1", "doubles n", "shifting left multiplies by 2"],
            ["n >> 1", "halves n, rounding down", "shifting right divides by 2"],
            ["a ^ a", "always 0", "anything xor itself cancels"],
            ["n & (n-1)", "clears the lowest set bit", "a power of 2 becomes 0"]
          ]
        },
        { type: "code", value: `# is n a power of two?
def is_power_of_two(n):
    return n > 0 and n & (n - 1) == 0

# find the one number that appears once among pairs
result = 0
for value in numbers:
    result ^= value` },
        { type: "warn", value: "Do not confuse & with and, or | with or. The bitwise pair work on numbers and do not short-circuit; the word pair work on truth and do. Using & where you meant and can produce a right answer by luck and a wrong one later." },
        { type: "note", value: "If you are reaching for these to make code faster, stop. Python is not fast enough for bit tricks to matter, and n * 2 is clearer than n << 1. Use them when the problem is genuinely about bits." }
      ]
    },

    {
      id: "precedence",
      icon: "🪜",
      title: "Order of Operations",
      tagline: "What Python does first",
      keywords: "precedence order operations priority parentheses brackets associativity walrus ternary",
      blocks: [
        { type: "text", value: "When several operators appear in one expression, Python applies them in a fixed order. Highest first:" },
        {
          type: "table",
          head: ["Level", "Operators", "Notes"],
          rows: [
            ["1", "()", "brackets always win"],
            ["2", "**", "right to left"],
            ["3", "+x, -x, ~x", "unary signs"],
            ["4", "*, /, //, %", "left to right"],
            ["5", "+, -", "left to right"],
            ["6", "<<, >>", "bit shifts"],
            ["7", "&", "bitwise and"],
            ["8", "^", "bitwise xor"],
            ["9", "|", "bitwise or"],
            ["10", "==, !=, <, >, <=, >=, is, in", "all comparisons"],
            ["11", "not", ""],
            ["12", "and", ""],
            ["13", "or", ""],
            ["14", "if/else", "the conditional expression"],
            ["15", "lambda", ""],
            ["16", ":=", "the walrus"]
          ]
        },
        { type: "code", value: `2 + 3 * 4          # 14, not 20
(2 + 3) * 4        # 20

2 ** 3 ** 2        # 512 — right to left, so 2 ** 9
(2 ** 3) ** 2      # 64

not True and False # False — not binds tighter than and
not (True and False)  # True` },
        { type: "tip", value: "You do not need to memorise this table. Use brackets whenever an expression has more than two operators. Nobody has ever complained about code being too clear." },
        { type: "sub", value: "The conditional expression" },
        { type: "text", value: "A one-line if/else that produces a value. Python's version of the ternary operator other languages write with ? and :." },
        { type: "syntax", value: "value_if_true if condition else value_if_false" },
        { type: "code", value: `status = "JUMP" if stone % 2 else "STEP"

# the same thing written out
if stone % 2:
    status = "JUMP"
else:
    status = "STEP"` },
        { type: "warn", value: "Do not chain these. a if b else c if d else e is legal and nearly unreadable. Past one level, write a proper if block." },
        { type: "sub", value: "The walrus operator" },
        { type: "text", value: "Added in Python 3.8, := assigns a value AND produces it in the same breath, so you can capture something inside a condition." },
        { type: "code", value: `# without it
line = input()
while line != "quit":
    print(line)
    line = input()

# with it
while (line := input()) != "quit":
    print(line)

if (n := len(pile)) > 10:
    print("pile has", n, "items")` },
        { type: "note", value: "The walrus earns its place when it removes a duplicated line, as above. Used anywhere else it mostly makes code harder to read for the sake of saving a line. Reach for it rarely." }
      ]
    }

  ]
});