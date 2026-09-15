window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "basics",
  icon: "🪶",
  title: "Getting Started",
  blurb: "What Python is, how it reads your code, and the two spells you will use more than any other.",
  sections: [

    {
      id: "what-is-python",
      icon: "🐍",
      title: "What Python Is",
      tagline: "How your words become actions",
      keywords: "python interpreter script run execute language history version",
      blocks: [
        { type: "text", value: "Python is a set of instructions you write in something close to English, which a program called the interpreter reads one line at a time and carries out. You write, it runs. There is no separate step where the whole thing is turned into machine language first, which is why a mistake halfway down a file will only announce itself when the interpreter actually gets there." },
        { type: "text", value: "It reads top to bottom. Line 1 happens, then line 2, then line 3. Everything else in this book — decisions, loops, functions — is a way of bending that straight line into a more useful shape." },
        { type: "code", label: "order matters", value: `print("first")
print("second")
print("third")

# first
# second
# third` },
        { type: "text", value: "A file of Python is called a script or a module. It ends in .py. In this village you write into the editor on each challenge page and the interpreter runs inside your browser, but it is the same Python." },
        { type: "note", value: "Python was made by Guido van Rossum and released in 1991. The version everything uses now is Python 3. If you find advice online using print without brackets, you are reading Python 2, and it is nearly twenty years out of date. Close the tab." }
      ]
    },

    {
      id: "comments",
      icon: "💬",
      title: "Comments",
      tagline: "Notes the interpreter ignores",
      keywords: "comment hash docstring note annotate disable debugging triple quote",
      blocks: [
        { type: "text", value: "Anything after a # on a line is invisible to Python and visible to humans. Use it to explain why you did something, not what you did — the code already says what." },
        { type: "syntax", value: "# your note here" },
        { type: "code", value: `# check every ten metres, three times at most
if distance % 10 == 0 and looks_used < 3:
    looks_used += 1

total = 0  # a comment can also sit at the end of a line` },
        { type: "sub", value: "Commenting code out" },
        { type: "text", value: "Putting a # in front of a working line switches it off without deleting it. Useful when you are narrowing down which line is broken." },
        { type: "code", value: `print("one")
# print("two")   <- this line no longer runs
print("three")` },
        { type: "sub", value: "Docstrings" },
        { type: "text", value: "Three quotes in a row make a string that can span many lines. Placed as the very first thing inside a function or class, it becomes that thing's official description, and help() will read it back to you." },
        { type: "code", value: `def jump_or_step(stone_index):
    """Return 'JUMP' for odd stones and 'STEP' for even ones."""
    return "JUMP" if stone_index % 2 else "STEP"

help(jump_or_step)` },
        { type: "warn", value: "A triple-quoted string that is not attached to anything is still a string — Python builds it, then throws it away. It works as a block comment, but it is not free, and it is not what # is for." },
        { type: "note", value: "The best comment explains a decision. 'divide by two here because the list is already sorted' earns its place. '# add one to x' does not." }
      ]
    },

    {
      id: "print",
      icon: "📢",
      title: "print()",
      tagline: "Making Python speak",
      keywords: "print output display console sep end flush newline multiple arguments",
      blocks: [
        { type: "text", value: "print() shows a value where a human can see it. It is how you check what your code is actually doing rather than what you hope it is doing." },
        { type: "syntax", value: "print(value, ..., sep=' ', end='\\n')" },
        { type: "code", value: `print("Hello, Potato Village")
print(7)
print(3.14)
print(True)
print([1, 2, 3])` },
        { type: "sub", value: "Several values at once" },
        { type: "text", value: "Separate them with commas. print() puts a space between each and a new line at the end." },
        { type: "code", value: `print("stones:", 12, "safe:", True)
# stones: 12 safe: True` },
        { type: "sub", value: "Changing the separator and the ending" },
        {
          type: "table",
          head: ["Argument", "Does", "Example"],
          rows: [
            ["sep", "what goes between values", "print(1, 2, sep='-') → 1-2"],
            ["end", "what goes after the last one", "print('a', end='') → no new line"],
            ["flush", "force it out immediately", "rarely needed"]
          ]
        },
        { type: "code", value: `print("a", "b", "c", sep="")      # abc
print("a", "b", sep=" | ")        # a | b

print("loading", end="")
print("...")                      # loading...` },
        { type: "sub", value: "Printing inside a loop" },
        { type: "code", value: `for stone in range(1, 4):
    print("stone", stone)

# stone 1
# stone 2
# stone 3` },
        { type: "warn", value: "print() shows a human something and hands back nothing at all. It is not how a function gives a value to the rest of your code — that is return. Confusing the two is the single most common beginner mistake, and it produces code that looks perfect on screen and fails every test. See Functions." },
        { type: "note", value: "When you are lost, print() the variable you are least sure about, on the line just before the one that breaks. Half of all debugging is discovering a box held something other than what you assumed." }
      ]
    },

    {
      id: "input",
      icon: "⌨️",
      title: "input()",
      tagline: "Asking the world for something",
      keywords: "input read user prompt stdin convert int float strip",
      blocks: [
        { type: "text", value: "input() stops the program, waits for someone to type a line and press enter, then hands back what they typed." },
        { type: "syntax", value: "variable = input(prompt)" },
        { type: "code", value: `sign = input("Sign: ")
print("You read:", sign)` },
        { type: "warn", value: "input() ALWAYS hands back a string, even when the person typed digits. Typing 5 gives you the text \"5\", not the number 5. \"5\" + 1 is an error, and \"5\" * 3 is \"555\", which is almost certainly not what you wanted." },
        { type: "sub", value: "Getting a number" },
        { type: "code", value: `age = int(input("Age: "))
price = float(input("Price: "))

steps = int(input("Steps: "))
print(steps + 1)   # now this adds instead of joining text` },
        { type: "sub", value: "Reading several values from one line" },
        { type: "code", value: `# the person types:  3 7 12
raw = input("Numbers: ")
parts = raw.split()               # ['3', '7', '12']
numbers = [int(p) for p in parts] # [3, 7, 12]
print(sum(numbers))               # 22` },
        { type: "sub", value: "Cleaning what you get" },
        { type: "code", value: `answer = input("Yes or no: ").strip().lower()
if answer == "yes":
    print("Off we go.")` },
        { type: "tip", value: ".strip() removes stray spaces at both ends and .lower() flattens the capitals, so \" YES \" and \"yes\" both match. Doing both is a habit worth forming early." }
      ]
    },

    {
      id: "indentation",
      icon: "📏",
      title: "Indentation",
      tagline: "How Python sees structure",
      keywords: "indentation whitespace spaces tabs block colon indentationerror nesting pep8",
      blocks: [
        { type: "text", value: "Most languages use curly braces to show where a block starts and ends. Python uses the blank space at the start of the line. This is not a style preference. It is the syntax, and getting it wrong stops the program." },
        { type: "code", value: `if sign == "shelter":
    print("inside the block")
    print("also inside the block")
print("outside — back to the left margin")` },
        { type: "sub", value: "The rules" },
        {
          type: "list",
          items: [
            "A line ending in a colon opens a block. The next line must be indented further.",
            "Every line in the same block must be indented by exactly the same amount.",
            "Four spaces per level is the convention. Use four, always.",
            "Go back to the left to close the block.",
            "Never mix tabs and spaces in one file — they look identical on screen and Python rejects the mixture."
          ]
        },
        { type: "sub", value: "Nesting" },
        { type: "text", value: "Each layer inside another indents four more spaces." },
        { type: "code", value: `for stone in stones:
    if stone % 2 == 0:
        if stone > 10:
            print("a far, safe stone")
        print("a safe stone")
    print("checked this stone")` },
        {
          type: "compare",
          bad: `if x > 5:
print("too far left")`,
          good: `if x > 5:
    print("indented four")`,
          why: "The first raises IndentationError: expected an indented block. A colon promises a block, and Python holds you to it."
        },
        { type: "tip", value: "VS Code inserts four spaces when you press Tab, and shows whitespace if you turn it on. Never try to align blocks by eye." },
        { type: "note", value: "People complain about this rule until they read someone else's Python. The indentation cannot lie about the structure, because the indentation IS the structure. In other languages the two can drift apart, and that is where bugs hide." }
      ]
    },

    {
      id: "errors-intro",
      icon: "🩹",
      title: "Reading Error Messages",
      tagline: "The interpreter telling you where it stopped",
      keywords: "error exception traceback syntaxerror nameerror typeerror indexerror keyerror valueerror debug",
      blocks: [
        { type: "text", value: "An error is not the machine scolding you. It is a report: here is the line, here is what I could not do. Read the LAST line first — that names the problem. Then look at the line number above it." },
        { type: "code", label: "a traceback", value: `Traceback (most recent call last):
  File "main.py", line 3, in <module>
    print(total + name)
TypeError: unsupported operand type(s) for +: 'int' and 'str'` },
        { type: "text", value: "That says: on line 3, you tried to add a number to a piece of text. Nothing mysterious about it once you read it in that order." },
        { type: "sub", value: "The errors you will actually meet" },
        {
          type: "table",
          head: ["Error", "Means", "Usually caused by"],
          rows: [
            ["SyntaxError", "Python cannot parse the line", "missing colon, bracket or quote"],
            ["IndentationError", "the spacing is wrong", "uneven indent, or none after a colon"],
            ["TabError", "tabs and spaces mixed", "pasting code from elsewhere"],
            ["NameError", "no such name exists", "a typo, or using it before creating it"],
            ["TypeError", "wrong kind of thing", "\"5\" + 5, or calling a non-function"],
            ["ValueError", "right kind, impossible value", "int(\"abc\")"],
            ["IndexError", "no such position", "asking for item 5 of a 3-item list"],
            ["KeyError", "no such label", "asking a dict for a key it lacks"],
            ["AttributeError", "no such method on that type", "\"abc\".append(1)"],
            ["ZeroDivisionError", "divided by zero", "x / 0"],
            ["ImportError", "cannot find that module", "a misspelled or missing import"],
            ["RecursionError", "a function called itself forever", "a missing base case"]
          ]
        },
        { type: "sub", value: "A worked example" },
        { type: "code", value: `word = "potato"
print(word[10])

# IndexError: string index out of range
# word has 6 characters, so the last valid position is 5.` },
        { type: "tip", value: "Paste the last line of the error into a search engine, but drop the parts specific to you — search 'TypeError unsupported operand int str', not your variable names." },
        { type: "note", value: "Every coder reads errors all day, every day. Getting one does not mean you are bad at this. Not reading it does." }
      ]
    },

    {
      id: "how-to-read",
      icon: "🧭",
      title: "How To Use This Book",
      tagline: "A word from Randy",
      keywords: "intro how to read handbook navigate search randy foreword",
      blocks: [
        { type: "text", value: "There are twelve topics along the top and every section of each one down the left. If you know what you are looking for, search — the box takes any word in the book, including words inside the code examples and the tables. Pressing the / key anywhere jumps you to it." },
        { type: "text", value: "Nothing in here is a solution to a Guardian. This is the language itself, written out completely: every operator, every method, every built-in function, every kind of thing Python can hold. What you build from it is yours." },
        { type: "sub", value: "How the pieces are marked" },
        {
          type: "table",
          head: ["You will see", "It means"],
          rows: [
            ["Syntax", "the shape of the thing, with the parts named"],
            ["A dark code box", "real code you can copy and run"],
            ["Randy's note", "context, history, or a judgement about when to use it"],
            ["Careful", "a trap that catches people, often silently"],
            ["Shortcut", "a faster or cleaner way once you know the basics"],
            ["Avoid / Prefer", "two ways of writing the same thing, and why one wins"]
          ]
        },
        { type: "note", value: "Read a section when you are stuck on it, not before. A handbook read cover to cover is a book. A handbook opened at the right page is a weapon. — Randy" }
      ]
    }

  ]
});