window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "control-flow",
  icon: "🔀",
  title: "Control Flow",
  blurb: "Bending the straight line: making decisions, repeating work, and leaving early.",
  sections: [

    {
      id: "if-else",
      icon: "🪧",
      title: "if, elif, else",
      tagline: "Making decisions",
      keywords: "if elif else condition branch nested guard clause decision ternary pass",
      blocks: [
        { type: "syntax", value: "if condition:\\n    block\\nelif other_condition:\\n    block\\nelse:\\n    block" },
        { type: "code", value: `if sign == "shelter":
    print("Go to the safe shelter!")
elif sign == "bandits":
    print("Turn back! There are bandits!")
else:
    print("You don't know this road.")` },
        { type: "text", value: "Python tries the if first. If it is false it tries each elif in order. If none match, else catches the rest. The instant one matches, every remaining branch is skipped — they are not even looked at." },
        { type: "sub", value: "Order matters" },
        {
          type: "compare",
          bad: `if score > 50:
    grade = "pass"
elif score > 90:
    grade = "excellent"`,
          good: `if score > 90:
    grade = "excellent"
elif score > 50:
    grade = "pass"`,
          why: "In the left version a score of 95 matches the first branch and stops, so 'excellent' is unreachable. When conditions overlap, put the most specific first."
        },
        { type: "text", value: "elif and else are both optional. A lone if is perfectly good." },
        { type: "code", value: `if snake_distance <= 0:
    caught = True` },
        { type: "sub", value: "Nesting" },
        { type: "code", value: `if looks_used < 3:
    if snake_distance <= 2:
        print("too close")
    else:
        print("still safe")` },
        { type: "text", value: "Often a nested if flattens into a single condition, and the flat version is easier to read." },
        {
          type: "compare",
          bad: `if user is not None:
    if user.active:
        if user.age >= 18:
            allow()`,
          good: `if user is not None and user.active and user.age >= 18:
    allow()`,
          why: "and short-circuits, so the later tests still never run on a None. Three levels of indentation become one."
        },
        { type: "sub", value: "Guard clauses" },
        { type: "text", value: "Rather than wrapping the real work in a deep if, deal with the exceptional cases first and leave. The main path then sits unindented at the bottom." },
        {
          type: "compare",
          bad: `def process(data):
    if data is not None:
        if len(data) > 0:
            return sum(data) / len(data)
        else:
            return 0
    else:
        return 0`,
          good: `def process(data):
    if data is None:
        return 0
    if len(data) == 0:
        return 0
    return sum(data) / len(data)`,
          why: "The right version never nests. Each guard handles one problem and exits, so the important line is the last one and needs no context to read."
        },
        { type: "sub", value: "pass" },
        { type: "text", value: "A block cannot be empty. pass is a placeholder that does nothing, for when you want the structure before the content." },
        { type: "code", value: `if condition:
    pass    # decide what goes here later
else:
    handle()` },
        { type: "warn", value: "A common silent bug: testing a value rather than a comparison. if x = 5 is a SyntaxError so Python saves you there, but if name: is True for any non-empty string, including \"False\" and \"0\". Know whether you mean truthiness or equality." }
      ]
    },

    {
      id: "match",
      icon: "🎯",
      title: "match / case",
      tagline: "Structural pattern matching",
      keywords: "match case switch pattern structural wildcard guard capture python 3.10",
      blocks: [
        { type: "text", value: "Added in Python 3.10. It looks like a switch statement from other languages, but it matches the SHAPE of a value, not just its value." },
        { type: "syntax", value: "match value:\\n    case pattern:\\n        block\\n    case _:\\n        block" },
        { type: "code", value: `match command:
    case "north":
        move(0, 1)
    case "south":
        move(0, -1)
    case "quit":
        stop()
    case _:
        print("unknown command")` },
        { type: "text", value: "The underscore is the wildcard — it matches anything, so it plays the part of else. It must come last." },
        { type: "sub", value: "Several values in one case" },
        { type: "code", value: `match answer:
    case "yes" | "y" | "yeah":
        confirm()
    case "no" | "n":
        decline()` },
        { type: "sub", value: "Matching a shape and capturing parts" },
        { type: "code", value: `match point:
    case (0, 0):
        print("at the origin")
    case (0, y):
        print(f"on the y axis at {y}")
    case (x, 0):
        print(f"on the x axis at {x}")
    case (x, y):
        print(f"at {x}, {y}")` },
        { type: "text", value: "A bare name inside a pattern captures whatever sits in that position. That is the part a plain if/elif chain cannot do without unpacking by hand." },
        { type: "sub", value: "Guards" },
        { type: "code", value: `match value:
    case n if n < 0:
        print("negative")
    case 0:
        print("zero")
    case n if n > 100:
        print("large")
    case _:
        print("ordinary")` },
        { type: "sub", value: "Matching lists and dictionaries" },
        { type: "code", value: `match data:
    case []:
        print("empty")
    case [single]:
        print("one item:", single)
    case [first, *rest]:
        print("first:", first, "and", len(rest), "more")

match config:
    case {"mode": "fast"}:
        run_fast()
    case {"mode": mode, "level": level}:
        run(mode, level)` },
        { type: "warn", value: "A lone lowercase name in a case always CAPTURES, it never compares. case red: matches everything and binds it to red — it does not check against a variable called red. To compare against a constant, use a dotted name like case Colour.RED." },
        { type: "note", value: "For simple value checks a dictionary lookup is usually cleaner than match. Where match earns its keep is destructuring nested data — pulling apart a shape and naming its pieces in one step." }
      ]
    },

    {
      id: "for-loops",
      icon: "🔁",
      title: "for Loops",
      tagline: "Once for each thing",
      keywords: "for loop iterate range enumerate zip nested reversed sorted index items",
      blocks: [
        { type: "syntax", value: "for variable in iterable:\\n    block" },
        { type: "text", value: "A for loop runs its block once for every item in a sequence, with the variable holding the current item." },
        { type: "code", value: `for item in ["torch", "mirror", "snare"]:
    print(item)

for letter in "potato":
    print(letter)

for key in {"a": 1, "b": 2}:
    print(key)        # dictionaries give their keys` },
        { type: "sub", value: "range()" },
        { type: "syntax", value: "range(stop) · range(start, stop) · range(start, stop, step)" },
        {
          type: "table",
          head: ["Written", "Produces"],
          rows: [
            ["range(5)", "0 1 2 3 4"],
            ["range(2, 6)", "2 3 4 5"],
            ["range(0, 10, 2)", "0 2 4 6 8"],
            ["range(5, 0, -1)", "5 4 3 2 1"],
            ["range(len(pile))", "every valid position in pile"],
            ["range(0)", "nothing — the loop body never runs"]
          ]
        },
        { type: "code", value: `for i in range(5):
    print(i)

for i in range(1, 11):
    print(i)          # 1 to 10` },
        { type: "warn", value: "range stops BEFORE the stop value, so range(5) never produces 5. To count from 1 to n inclusive, write range(1, n + 1)." },
        { type: "sub", value: "When you need the position too" },
        {
          type: "compare",
          bad: `for i in range(len(items)):
    print(i, items[i])`,
          good: `for i, item in enumerate(items):
    print(i, item)`,
          why: "enumerate hands you both at once and cannot go out of range. Use range(len(x)) only when you genuinely need the index alone."
        },
        { type: "code", value: `for i, item in enumerate(items, start=1):
    print(f"{i}. {item}")     # numbering from 1` },
        { type: "sub", value: "Walking two sequences together" },
        { type: "code", value: `names = ["a", "b", "c"]
scores = [90, 85, 77]

for name, score in zip(names, scores):
    print(name, score)` },
        { type: "text", value: "zip stops at the shorter one. Anything left over in the longer is ignored." },
        { type: "sub", value: "Dictionaries" },
        { type: "code", value: `for key in data:              # keys
for key in data.keys():       # keys, said explicitly
for value in data.values():   # values
for key, value in data.items():   # both` },
        { type: "sub", value: "Nested loops" },
        { type: "code", value: `for row in matrix:
    for value in row:
        print(value)

# every pair from two lists
for a in first:
    for b in second:
        check(a, b)` },
        { type: "warn", value: "A loop inside a loop runs the inner one completely for each round of the outer. Two nested loops over 1,000 items is a million rounds. That is fine at small sizes and fatal at large ones — see Efficiency." },
        { type: "sub", value: "Never change a list while looping over it" },
        {
          type: "compare",
          bad: `for item in items:
    if item.bad:
        items.remove(item)`,
          good: `items = [item for item in items if not item.bad]`,
          why: "Removing during iteration shifts everything left, so the loop skips items. It does not crash — it quietly gives a wrong answer, which is worse."
        }
      ]
    },

    {
      id: "while-loops",
      icon: "♾️",
      title: "while Loops",
      tagline: "Until something changes",
      keywords: "while loop condition infinite sentinel break counter until repeat",
      blocks: [
        { type: "syntax", value: "while condition:\\n    block" },
        { type: "text", value: "A while loop repeats for as long as its condition stays true. Use it when you do not know in advance how many rounds it will take." },
        { type: "code", value: `steps = 0
while steps < 30:
    steps += 1
    print("step", steps)` },
        { type: "warn", value: "If nothing inside the loop ever makes the condition false, it runs forever and the page freezes. Every while loop needs something in its body that moves toward stopping — usually changing the variable the condition tests." },
        {
          type: "compare",
          bad: `count = 0
while count < 5:
    print(count)`,
          good: `count = 0
while count < 5:
    print(count)
    count += 1`,
          why: "The left loop never increments, so count < 5 is true forever. This is the most common way to hang a program."
        },
        { type: "sub", value: "for or while?" },
        {
          type: "table",
          head: ["Use", "When"],
          rows: [
            ["for", "you know the collection or the count"],
            ["while", "you are waiting for a condition to change"],
            ["for", "walking a list, string, dict or range"],
            ["while", "reading input until a sentinel value"],
            ["while", "searching by repeatedly halving a range"]
          ]
        },
        { type: "sub", value: "Reading until a sentinel" },
        { type: "code", value: `line = input()
while line != "quit":
    print(line)
    line = input()

# the same, without repeating the input line
while (line := input()) != "quit":
    print(line)` },
        { type: "sub", value: "Deliberate infinite loops" },
        { type: "text", value: "Sometimes the exit is in the middle rather than at the top. Start with True and break out." },
        { type: "code", value: `while True:
    command = input("> ")
    if command == "quit":
        break
    handle(command)` },
        { type: "tip", value: "while True with a break is clearer than contorting a condition to fit at the top. It is not a cheat — it is the right shape when the decision to stop happens after some work." },
        { type: "sub", value: "Binary search, the classic while" },
        { type: "code", value: `low, high = 0, len(pile) - 1
while low <= high:
    mid = (low + high) // 2
    if pile[mid] == target:
        return mid
    elif pile[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
return -1` },
        { type: "note", value: "Notice what moves toward stopping there: low rises or high falls every round, so the gap always shrinks. When you write a while loop, be able to point at the line that guarantees it ends." }
      ]
    },

    {
      id: "break-continue",
      icon: "🚪",
      title: "break, continue, else",
      tagline: "Leaving early and skipping ahead",
      keywords: "break continue else loop skip exit early return flag found nested",
      blocks: [
        {
          type: "table",
          head: ["Word", "Does"],
          rows: [
            ["break", "leave the loop entirely, right now"],
            ["continue", "skip the rest of this round, start the next"],
            ["else", "run only if the loop finished without breaking"]
          ]
        },
        { type: "sub", value: "break" },
        { type: "code", value: `for item in pile:
    if item == target:
        print("found it")
        break        # stop looking` },
        { type: "sub", value: "continue" },
        { type: "code", value: `for n in numbers:
    if n < 0:
        continue     # ignore negatives, carry on
    total += n` },
        { type: "tip", value: "continue is a guard clause for loops. It handles the case you do not care about and gets out of the way, so the real work below it never needs an else." },
        { type: "sub", value: "for / else" },
        { type: "text", value: "A loop may have an else. It runs when the loop ran to completion — and is SKIPPED if a break happened. It is the tidy way to express 'searched everything and found nothing'." },
        { type: "code", value: `for item in pile:
    if item == target:
        print("found")
        break
else:
    print("not in the pile")` },
        {
          type: "compare",
          bad: `found = False
for item in pile:
    if item == target:
        found = True
        break
if not found:
    print("not in the pile")`,
          good: `for item in pile:
    if item == target:
        break
else:
    print("not in the pile")`,
          why: "Same behaviour, no flag variable to declare, set and check. The name else is unfortunate — read it as 'no break'."
        },
        { type: "sub", value: "Breaking out of nested loops" },
        { type: "text", value: "break only leaves the loop it is in. To escape both, either use a flag or — much cleaner — put the loops in a function and return." },
        {
          type: "compare",
          bad: `done = False
for row in matrix:
    for value in row:
        if value == target:
            done = True
            break
    if done:
        break`,
          good: `def find(matrix, target):
    for i, row in enumerate(matrix):
        for j, value in enumerate(row):
            if value == target:
                return [i, j]
    return None`,
          why: "return leaves the function from any depth. That alone is a good reason to put a nested search in its own function."
        },
        { type: "warn", value: "break and continue only affect the innermost loop containing them. There is no 'break 2' in Python." }
      ]
    },

    {
      id: "with",
      icon: "🚪",
      title: "with",
      tagline: "Cleaning up automatically",
      keywords: "with context manager file open close resource cleanup as",
      blocks: [
        { type: "text", value: "Some things must be closed after use — files especially. with guarantees the cleanup happens, even if an error interrupts the block." },
        { type: "syntax", value: "with expression as name:\\n    block" },
        {
          type: "compare",
          bad: `f = open("data.txt")
content = f.read()
f.close()`,
          good: `with open("data.txt") as f:
    content = f.read()`,
          why: "If .read() raises an error in the left version, .close() is never reached and the file stays open. with closes it no matter what happens."
        },
        { type: "code", value: `with open("out.txt", "w") as f:
    f.write("hello")
# the file is closed here, automatically

# several at once
with open("in.txt") as src, open("out.txt", "w") as dst:
    dst.write(src.read())` },
        { type: "note", value: "Anything can support with — it just needs the right two methods. You will meet it mostly with files, but also with locks, database connections, and timers. See Files & Errors." }
      ]
    }

  ]
});