window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "efficiency",
  icon: "⏳",
  title: "Efficiency & Style",
  blurb: "What separates code that works from code that works well: cost, memory, algorithms, and writing for the next person.",
  sections: [

    {
      id: "big-o",
      icon: "📈",
      title: "Time Complexity",
      tagline: "How the cost grows",
      keywords: "big o complexity time performance linear quadratic logarithmic constant exponential scaling analysis",
      blocks: [
        { type: "text", value: "Two solutions can give the same answer and be worlds apart. What matters is not how long something takes on ten items, but how that time changes when the pile grows." },
        { type: "text", value: "Big-O describes that growth. It ignores constants and small terms, because on a large enough input only the shape matters." },
        {
          type: "table",
          head: ["Growth", "Name", "Doubling the input means", "Example"],
          rows: [
            ["O(1)", "constant", "no extra work at all", "dict lookup"],
            ["O(log n)", "logarithmic", "one extra step", "binary search"],
            ["O(n)", "linear", "twice the work", "one loop"],
            ["O(n log n)", "linearithmic", "slightly over double", "sorting"],
            ["O(n²)", "quadratic", "four times the work", "nested loops"],
            ["O(n³)", "cubic", "eight times", "triple loop"],
            ["O(2ⁿ)", "exponential", "squares the work", "naive recursion"],
            ["O(n!)", "factorial", "hopeless", "every permutation"]
          ]
        },
        { type: "sub", value: "What it looks like in practice" },
        {
          type: "table",
          head: ["n", "O(n)", "O(n log n)", "O(n²)"],
          rows: [
            ["10", "10", "33", "100"],
            ["100", "100", "664", "10,000"],
            ["1,000", "1,000", "9,966", "1,000,000"],
            ["10,000", "10,000", "132,877", "100,000,000"],
            ["1,000,000", "1,000,000", "19,931,569", "1,000,000,000,000"]
          ]
        },
        { type: "text", value: "At a million items, the linear version does a million steps and the quadratic does a million million. One finishes instantly; the other never finishes at all." },
        { type: "sub", value: "Reading your own code" },
        { type: "code", value: `# O(1) — no loop over the input
def first(pile):
    return pile[0]

# O(n) — one pass
for item in pile:
    check(item)

# O(n squared) — a pass for every item
for a in pile:
    for b in pile:
        compare(a, b)

# O(log n) — throw away half each round
while low <= high:
    mid = (low + high) // 2
    ...

# O(n log n) — a pass, with a log-n step inside
for item in pile:
    binary_search(sorted_pile, item)` },
        { type: "sub", value: "The rules for combining" },
        {
          type: "list",
          items: [
            "Loops one after another add: O(n) + O(n) is still O(n).",
            "Loops inside each other multiply: O(n) inside O(n) is O(n²).",
            "Constants vanish: O(3n) is O(n), O(n/2) is O(n).",
            "Only the biggest term survives: O(n² + n) is O(n²)."
          ]
        },
        { type: "warn", value: "Hidden loops count. if item in big_list is O(n), so putting it inside a loop makes that loop quadratic even though you only wrote one for. The same goes for .index(), .count(), max(), and slicing." },
        { type: "note", value: "One coder searched a list of a million names page by page and it took weeks. Another halved the list each time and was done in seconds. Doubling the list to two million adds one single step to the second approach. That is the whole of this section, and it is why it matters." }
      ]
    },

    {
      id: "space",
      icon: "💾",
      title: "Space Complexity",
      tagline: "The mana a spell costs",
      keywords: "space memory complexity auxiliary in place tradeoff generator cache",
      blocks: [
        { type: "text", value: "Time is not the only cost. Every list you build, every dictionary you fill, occupies memory while it runs. Space complexity measures how that grows with the input." },
        {
          type: "table",
          head: ["Space", "Means", "Example"],
          rows: [
            ["O(1)", "a fixed amount, whatever the input", "a running total"],
            ["O(n)", "grows with the input", "a copy, a tally dict"],
            ["O(n²)", "a grid of the input", "a distance matrix"]
          ]
        },
        { type: "code", value: `# O(1) space — one accumulator, whatever the size
total = 0
for n in numbers:
    total += n

# O(n) space — a new list as large as the input
doubled = [n * 2 for n in numbers]

# O(n) space — the tally grows with distinct items
counts = {}
for ch in text:
    counts[ch] = counts.get(ch, 0) + 1` },
        { type: "sub", value: "The classic trade" },
        { type: "text", value: "Most of the time you buy speed with memory. A dictionary of tallies costs O(n) space and turns a search that touched everything into one that touches nothing." },
        {
          type: "compare",
          bad: `# O(n squared) time, O(1) space
for i, a in enumerate(pile):
    for b in pile[i+1:]:
        if a + b == target:
            return True`,
          good: `# O(n) time, O(n) space
seen = set()
for n in pile:
    if target - n in seen:
        return True
    seen.add(n)`,
          why: "The right version remembers what it has passed, so it never looks backward. That is the trade: memory spent to avoid repeated work."
        },
        { type: "sub", value: "Spending less memory" },
        { type: "code", value: `# builds the whole list first
total = sum([n * n for n in range(10_000_000)])

# holds one value at a time
total = sum(n * n for n in range(10_000_000))` },
        { type: "text", value: "Dropping the square brackets makes it a generator. Identical answer, O(1) space instead of O(n)." },
        { type: "warn", value: "Recursion costs space you did not ask for. Every pending call sits on the stack, so a recursion n deep is O(n) space even if it stores nothing itself. That is what RecursionError is protecting." }
      ]
    },

    {
      id: "operation-costs",
      icon: "💰",
      title: "What Each Operation Costs",
      tagline: "A reference table",
      keywords: "cost complexity list dict set operations append insert pop lookup membership slice sort reference",
      blocks: [
        { type: "text", value: "Knowing these lets you spot an accidental quadratic before you write it." },
        { type: "table", caption: "Lists",
          head: ["Operation", "Cost", "Note"],
          rows: [
            ["x[i]", "O(1)", "by position, instant"],
            ["x[i] = v", "O(1)", ""],
            ["x.append(v)", "O(1)", "the fast way to grow"],
            ["x.pop()", "O(1)", "from the end"],
            ["x.pop(0)", "O(n)", "shifts everything left"],
            ["x.insert(0, v)", "O(n)", "shifts everything right"],
            ["x.remove(v)", "O(n)", "has to find it first"],
            ["v in x", "O(n)", "walks the whole list"],
            ["x.index(v)", "O(n)", ""],
            ["x.count(v)", "O(n)", ""],
            ["len(x)", "O(1)", "stored, not counted"],
            ["x[a:b]", "O(b-a)", "builds a new list"],
            ["x.sort()", "O(n log n)", ""],
            ["min/max/sum", "O(n)", ""]
          ]
        },
        { type: "table", caption: "Dictionaries and sets",
          head: ["Operation", "Cost"],
          rows: [
            ["d[k]", "O(1)"],
            ["d[k] = v", "O(1)"],
            ["k in d", "O(1)"],
            ["d.get(k)", "O(1)"],
            ["del d[k]", "O(1)"],
            ["len(d)", "O(1)"],
            ["s.add(v)", "O(1)"],
            ["v in s", "O(1)"],
            ["looping over either", "O(n)"]
          ]
        },
        { type: "table", caption: "Strings",
          head: ["Operation", "Cost", "Note"],
          rows: [
            ["s[i]", "O(1)", ""],
            ["len(s)", "O(1)", ""],
            ["sub in s", "O(n·m)", ""],
            ["s + t", "O(n+m)", "builds a new string every time"],
            ["\"\".join(list)", "O(total)", "one pass — use this"],
            ["s.split()", "O(n)", ""],
            ["s[a:b]", "O(b-a)", ""]
          ]
        },
        { type: "sub", value: "The three that bite most often" },
        {
          type: "list",
          items: [
            "in on a list inside a loop — convert to a set first.",
            "pop(0) or insert(0, x) in a loop — use collections.deque.",
            "s += piece in a loop — collect into a list and join at the end."
          ]
        },
        {
          type: "compare",
          bad: `result = ""
for word in words:
    result += word + " "`,
          good: `result = " ".join(words)`,
          why: "Strings cannot be changed, so += builds an entirely new string each round. That is O(n²) for a long list, against O(n) for join."
        }
      ]
    },

    {
      id: "algorithms",
      icon: "🧠",
      title: "Patterns Worth Knowing",
      tagline: "Shapes that solve whole families of problems",
      keywords: "algorithm pattern two pointer sliding window binary search hash map prefix sum greedy frequency",
      blocks: [
        { type: "text", value: "Most problems are variations on a handful of shapes. Recognising the shape is most of the work." },
        { type: "sub", value: "Hash map lookup — O(n²) becomes O(n)" },
        { type: "code", value: `# instead of comparing every pair, remember what you have seen
seen = {}
for i, n in enumerate(pile):
    if target - n in seen:
        return [seen[target - n], i]
    seen[n] = i` },
        { type: "sub", value: "Frequency counting" },
        { type: "code", value: `counts = {}
for item in pile:
    counts[item] = counts.get(item, 0) + 1

# the first thing appearing exactly once
for item in pile:
    if counts[item] == 1:
        return item` },
        { type: "sub", value: "Two pointers" },
        { type: "code", value: `# from both ends, moving inward
left, right = 0, len(pile) - 1
while left < right:
    if pile[left] + pile[right] == target:
        return [left, right]
    elif pile[left] + pile[right] < target:
        left += 1
    else:
        right -= 1

# checking a palindrome
left, right = 0, len(word) - 1
while left < right:
    if word[left] != word[right]:
        return False
    left += 1
    right -= 1
return True` },
        { type: "sub", value: "Sliding window" },
        { type: "code", value: `# the best sum of k consecutive items, in one pass
window = sum(pile[:k])
best = window
for i in range(k, len(pile)):
    window += pile[i] - pile[i - k]
    best = max(best, window)` },
        { type: "tip", value: "The window adds the new item and removes the old one rather than re-summing. That turns an O(n·k) loop into O(n)." },
        { type: "sub", value: "Binary search" },
        { type: "code", value: `# only on a SORTED sequence
low, high = 0, len(pile) - 1
while low <= high:
    mid = (low + high) // 2
    if pile[mid] == target:
        return mid
    elif pile[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
return -1` },
        { type: "sub", value: "Running totals" },
        { type: "code", value: `# prefix sums make any range total O(1) afterwards
prefix = [0]
for n in pile:
    prefix.append(prefix[-1] + n)

# sum of pile[a:b]
total = prefix[b] - prefix[a]` },
        { type: "sub", value: "Tracking a best-so-far" },
        { type: "code", value: `best = float("-inf")
lowest_seen = pile[0]
for n in pile[1:]:
    best = max(best, n - lowest_seen)
    lowest_seen = min(lowest_seen, n)` },
        { type: "note", value: "Notice what these share: each replaces repeated backward looking with something remembered as you go. That single idea — carry the answer forward instead of recomputing it — is behind most of the difference between a slow solution and a fast one." }
      ]
    },

    {
      id: "measuring",
      icon: "⏱️",
      title: "Measuring",
      tagline: "Do not guess, time it",
      keywords: "measure timeit perf_counter profile benchmark optimize premature bottleneck",
      blocks: [
        { type: "text", value: "Intuition about speed is unreliable. Before optimising anything, find out where the time actually goes." },
        { type: "code", value: `import time

start = time.perf_counter()
do_work()
print(f"{time.perf_counter() - start:.4f}s")` },
        { type: "code", value: `import timeit

timeit.timeit('"".join(parts)', globals=globals(), number=10000)
timeit.timeit("sum(range(100))", number=10000)` },
        { type: "code", value: `import cProfile
cProfile.run("main()")     # every function, called how often, costing what` },
        { type: "sub", value: "The order to do things in" },
        {
          type: "list",
          items: [
            "Make it correct. A fast wrong answer is worthless.",
            "Make it clear. You cannot optimise what you cannot read.",
            "Measure. Find the one part that actually costs.",
            "Improve the algorithm — a better Big-O beats any micro-tuning.",
            "Only then fiddle with details, and measure again."
          ]
        },
        { type: "warn", value: "Most code does not need to be fast. Optimising a function that runs once on ten items wastes your time and makes the code worse. Spend the effort where the measurement points." },
        { type: "note", value: "There is no point tuning a loop that runs in a millisecond when the algorithm around it is O(n²). Changing the shape is worth more than every trick in this section combined." }
      ]
    },

    {
      id: "style",
      icon: "🧭",
      title: "Style & Readability",
      tagline: "Writing for the next coder",
      keywords: "pep8 style readability naming comments convention clean code formatting zen",
      blocks: [
        { type: "text", value: "PyThorn grew strong on tangled, copy-pasted code dumped in the ruins. Do not feed him." },
        { type: "sub", value: "PEP 8, the essentials" },
        {
          type: "table",
          head: ["Rule", "Detail"],
          rows: [
            ["Indent", "four spaces, never tabs"],
            ["Line length", "79 characters, or 88 if your team agrees"],
            ["Blank lines", "two between functions, one inside them"],
            ["Imports", "one per line, at the top of the file"],
            ["Spaces", "around operators: x = 1, not x=1"],
            ["No space", "inside brackets: f(x), not f( x )"],
            ["Comparisons", "if x is None, not if x == None"],
            ["Naming", "snake_case, CONSTANTS, ClassNames"]
          ]
        },
        {
          type: "compare",
          bad: `def f( x,y ):
    if x==None:return 0
    z=x+y
    return z`,
          good: `def add_scores(first, second):
    if first is None:
        return 0
    return first + second`,
          why: "Same logic. The right version can be read at a glance and its name says what it does."
        },
        { type: "sub", value: "Comment the why" },
        {
          type: "compare",
          bad: `# add one to looks_used
looks_used += 1`,
          good: `# each glance costs us ground, so we ration them to three
looks_used += 1`,
          why: "The code already says what. A comment earns its place by explaining a decision the code cannot show."
        },
        { type: "sub", value: "Habits worth keeping" },
        {
          type: "list",
          items: [
            "Name for what it holds. Future you is a stranger.",
            "One job per function. If naming it needs 'and', split it.",
            "Return early instead of nesting deeply.",
            "Delete code you do not use — dead code is where bugs hide.",
            "Solve it plainly first, then make it fast if it needs to be.",
            "Prefer obvious over clever. Clever is a cost you pay later."
          ]
        },
        { type: "sub", value: "The Zen of Python" },
        { type: "code", value: `import this` },
        { type: "text", value: "That prints a short set of principles the language was built around. The ones that matter most day to day: readability counts, explicit beats implicit, simple beats complex, and flat beats nested. Special cases are not special enough to break the rules — but practicality beats purity, so none of it is a law." },
        { type: "sub", value: "Tools that do it for you" },
        {
          type: "table",
          head: ["Tool", "Does"],
          rows: [
            ["black", "reformats to a consistent style"],
            ["ruff", "fast linting and fixes"],
            ["flake8", "flags style problems"],
            ["mypy", "checks type hints"],
            ["isort", "orders imports"]
          ]
        },
        { type: "note", value: "You may not carry my bloodline, but you carry the handbook. Write code the next coder can read, and the village stays standing long after you do. That is the only kind of immortality a coder gets. — Randy" }
      ]
    }

  ]
});