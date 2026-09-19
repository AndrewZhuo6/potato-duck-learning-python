window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "modules-errors",
  icon: "📚",
  title: "Modules, Files & Errors",
  blurb: "Bringing in outside code, reading and writing files, and handling the moments when things go wrong.",
  sections: [

    {
      id: "imports",
      icon: "📥",
      title: "import",
      tagline: "Using code from elsewhere",
      keywords: "import from as module package library alias star wildcard circular main name",
      blocks: [
        { type: "syntax", value: "import module · from module import name · import module as alias" },
        { type: "code", value: `import math
print(math.sqrt(16))

from math import sqrt
print(sqrt(16))           # no prefix needed

from math import sqrt, pi, floor
print(pi, floor(3.99))

import math as m
print(m.sqrt(16))

from collections import Counter as Tally
print(Tally("banana"))` },
        {
          type: "table",
          head: ["Form", "Use when"],
          rows: [
            ["import module", "the default — the prefix shows where things come from"],
            ["from module import name", "you use one or two names constantly"],
            ["import module as alias", "the name is long or clashes"],
            ["from module import *", "never"]
          ]
        },
        { type: "warn", value: "from module import * pulls every public name into your file at once. You lose track of where anything came from, and a later import can silently replace a name you were using. It is the one import form to avoid entirely." },
        { type: "sub", value: "Importing your own files" },
        { type: "text", value: "Any .py file in the same folder is a module you can import by its filename without the extension." },
        { type: "code", label: "helpers.py", value: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

print("helpers.py loaded")` },
        { type: "code", label: "main.py", value: `# in your project, Python imports helpers.py from the same directory
import types, sys
helpers = types.ModuleType("helpers")
helpers.is_prime = lambda n: n > 1 and all(n % i != 0 for i in range(2, int(n ** 0.5) + 1))
sys.modules["helpers"] = helpers

import helpers
print(helpers.is_prime(17))

from helpers import is_prime
print(is_prime(17))` },
        { type: "warn", value: "Never name your own file after a standard module. A file called math.py or random.py in your folder will be imported instead of the real one, and the error will make no sense at all." },
        { type: "sub", value: "Where Python looks" },
        { type: "code", value: `import sys
print(sys.path[:3])  # first few search folders` },
        { type: "sub", value: "__name__ == \"__main__\"" },
        { type: "text", value: "When a file is run directly its __name__ is \"__main__\"; when it is imported, __name__ is the module's name. This lets a file be both a program and a library." },
        { type: "code", value: `def main():
    print("running directly")

if __name__ == "__main__":
    main()` },
        { type: "tip", value: "Put that guard around anything that should not happen on import — test calls, prints, input prompts. Without it, importing your file runs the whole thing." },
        { type: "sub", value: "Import order convention" },
        { type: "code", value: `# standard library first
import math
import os
print("Standard modules imported")

# then third-party (e.g. requests, numpy)
# import requests

# then your own
# import helpers` }
      ]
    },

    {
      id: "files",
      icon: "📄",
      title: "Reading & Writing Files",
      tagline: "open, with, modes",
      keywords: "file open read write append close with encoding lines readlines writelines path csv json binary",
      blocks: [
        { type: "syntax", value: "with open(path, mode, encoding=\"utf-8\") as f:" },
        {
          type: "table",
          head: ["Mode", "Does"],
          rows: [
            ["\"r\"", "read — the default; errors if missing"],
            ["\"w\"", "write — creates, or ERASES an existing file"],
            ["\"a\"", "append — adds to the end"],
            ["\"x\"", "create — errors if it already exists"],
            ["\"r+\"", "read and write"],
            ["\"rb\" \"wb\"", "binary rather than text"]
          ]
        },
        { type: "warn", value: "Mode \"w\" erases the file the instant it opens, before you write anything. If you meant to add to it, use \"a\"." },
        { type: "sub", value: "Reading" },
        { type: "code", value: `# create sample file
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("first line\\nsecond line\\nthird line\\n")

with open("data.txt", encoding="utf-8") as f:
    content = f.read()          # the whole thing as one string
    print("content:", repr(content))

with open("data.txt", encoding="utf-8") as f:
    lines = f.readlines()       # a list, each ending in \\n
    print("lines:", lines)

with open("data.txt", encoding="utf-8") as f:
    for line in f:              # one line at a time, low memory
        print("line:", line.rstrip())` },
        { type: "tip", value: "Looping over the file object directly is the best default — it never loads the whole file into memory, so it works on a file larger than your RAM." },
        { type: "sub", value: "Writing" },
        { type: "code", value: `with open("out.txt", "w", encoding="utf-8") as f:
    f.write("first line\\n")     # write does NOT add a newline
    f.writelines(["a\\n", "b\\n"])

with open("log.txt", "a", encoding="utf-8") as f:
    f.write("another entry\\n")

# print can write to a file
with open("out.txt", "w", encoding="utf-8") as f:
    print("hello", file=f)

with open("out.txt", "r", encoding="utf-8") as f:
    print(f.read().rstrip())` },
        { type: "sub", value: "Always use with" },
        {
          type: "compare",
          bad: `f = open("data.txt")
content = f.read()
f.close()`,
          good: `with open("data.txt") as f:
    content = f.read()`,
          why: "If .read() raises, the left version never reaches .close() and the file stays open. with closes it whatever happens."
        },
        { type: "warn", value: "Always pass encoding=\"utf-8\" explicitly. The default varies by operating system, so a file that reads fine on your machine may fail on a teammate's — a particularly nasty bug because it depends on whose computer runs it." },
        { type: "sub", value: "Paths" },
        { type: "code", value: `from pathlib import Path

p = Path("data") / "notes.txt"     # works on every OS
p.parent.mkdir(exist_ok=True)
p.write_text("hello", encoding="utf-8")

print(p.exists())
print(p.read_text(encoding="utf-8"))
print(p.suffix)
print(p.stem)
print(p.parent)

for f in Path("data").glob("*.txt"):
    print(f)` },
        { type: "sub", value: "JSON and CSV" },
        { type: "code", value: `import json

data = {"name": "Quackbit", "level": 3}

with open("out.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

with open("out.json", encoding="utf-8") as f:
    loaded = json.load(f)
    print("json loaded:", loaded)

text = json.dumps(data)      # to a string
print("json text:", text)
data = json.loads(text)      # from a string

import csv

with open("data.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "score"])
    writer.writerow(["Quackbit", "100"])

with open("data.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["name"], row["score"])` }
      ]
    },

    {
      id: "exceptions",
      icon: "🛡️",
      title: "try / except",
      tagline: "Handling what goes wrong",
      keywords: "try except finally else raise exception error handling catch specific bare broad",
      blocks: [
        { type: "syntax", value: "try:\\n    risky\\nexcept SomeError:\\n    handle\\nelse:\\n    ran cleanly\\nfinally:\\n    always" },
        { type: "code", value: `try:
    value = int(input("Number: "))
    print("Parsed number:", value)
except ValueError:
    print("That was not a whole number.")
    value = 0` },
        {
          type: "table",
          head: ["Clause", "Runs when"],
          rows: [
            ["try", "always — this is the risky part"],
            ["except X", "an X was raised"],
            ["else", "the try finished with NO exception"],
            ["finally", "always, whatever happened"]
          ]
        },
        { type: "code", value: `try:
    f = open("data.txt")
except FileNotFoundError:
    print("no such file")
else:
    print(f.read())      # only if the open succeeded
    f.close()
finally:
    print("done")        # always` },
        { type: "sub", value: "Catch what you expect, not everything" },
        {
          type: "compare",
          bad: `try:
    result = process(data)
except:
    pass`,
          good: `try:
    result = process(data)
except (ValueError, KeyError) as e:
    print("could not process:", e)
    result = None`,
          why: "A bare except swallows everything — including typos in your own code and Ctrl-C. You get a program that silently does nothing and gives you no way to find out why."
        },
        { type: "code", value: `# several kinds, handled the same way
try:
    int("abc")
except (ValueError, TypeError) as e:
    print("Caught ValueError or TypeError:", e)

# several kinds, handled differently
data = {}
try:
    val = data["missing"]
except ValueError:
    print("Caught ValueError")
except KeyError as e:
    print("Caught KeyError:", e)` },
        { type: "sub", value: "raise" },
        { type: "code", value: `level = 0
try:
    if level < 1:
        raise ValueError("level must be at least 1")
except ValueError as e:
    print("Caught validation error:", e)

# raise a new one, keeping the original as the cause
try:
    config = {}
    port = config["port"]
except KeyError as e:
    try:
        raise ValueError("bad config") from e
    except ValueError as err:
        print(f"Raised: {err!r} caused by {err.__cause__!r}")` },
        { type: "sub", value: "Your own exception types" },
        { type: "code", value: `class GuardianError(Exception):
    pass

class WrongAnswer(GuardianError):
    pass

def check(answer):
    if answer != 42:
        raise WrongAnswer("Incorrect answer provided!")

try:
    check(10)
except GuardianError as e:      # catches both
    print("Caught GuardianError:", e)` },
        { type: "sub", value: "Ask forgiveness, not permission" },
        { type: "text", value: "Python's style prefers trying the thing and catching the failure over checking first. It is one operation rather than two, and it has no gap between the check and the use." },
        {
          type: "compare",
          bad: `if "key" in data:
    value = data["key"]
else:
    value = 0`,
          good: `try:
    value = data["key"]
except KeyError:
    value = 0

# or simply
value = data.get("key", 0)`,
          why: "Both are correct. For dictionaries .get() is best of all. The principle matters more for files and network calls, where the thing can vanish between the check and the use."
        },
        { type: "warn", value: "Do not use exceptions for ordinary control flow. Catching an error to end a loop that a condition could have ended is slower and hides your intent." }
      ]
    },

    {
      id: "exception-types",
      icon: "🗂️",
      title: "Exception Types",
      tagline: "The full hierarchy",
      keywords: "exception types hierarchy baseexception valueerror typeerror keyerror indexerror oserror custom assertion",
      blocks: [
        { type: "text", value: "Exceptions form a tree. Catching a parent catches every child beneath it, which is why except Exception catches almost everything." },
        { type: "code", label: "the tree, simplified", value: `BaseException
 ├── SystemExit
 ├── KeyboardInterrupt
 ├── GeneratorExit
 └── Exception
      ├── ArithmeticError
      │    ├── ZeroDivisionError
      │    └── OverflowError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── OSError
      │    ├── FileNotFoundError
      │    ├── PermissionError
      │    └── IsADirectoryError
      ├── ValueError
      │    └── UnicodeError
      ├── TypeError
      ├── NameError
      │    └── UnboundLocalError
      ├── AttributeError
      ├── ImportError
      │    └── ModuleNotFoundError
      ├── RuntimeError
      │    └── RecursionError
      ├── StopIteration
      └── AssertionError` },
        { type: "warn", value: "Catch Exception, never BaseException. The three that sit outside Exception are how a program is meant to be stopped — catching them means Ctrl-C no longer works." },
        {
          type: "table",
          head: ["Exception", "Raised when"],
          rows: [
            ["ValueError", "right type, impossible value — int(\"abc\")"],
            ["TypeError", "wrong type — \"5\" + 5"],
            ["KeyError", "no such dictionary key"],
            ["IndexError", "position past the end"],
            ["AttributeError", "no such method or attribute"],
            ["NameError", "no such name"],
            ["ZeroDivisionError", "divided by zero"],
            ["FileNotFoundError", "no such file"],
            ["PermissionError", "not allowed to open it"],
            ["ImportError", "module could not be imported"],
            ["StopIteration", "a generator is exhausted"],
            ["RecursionError", "too deep"],
            ["AssertionError", "an assert failed"]
          ]
        },
        { type: "sub", value: "Catching a parent" },
        { type: "code", value: `# catches both IndexError and KeyError
try:
    items = [1, 2]
    val = items[10]
except LookupError as e:
    print("Caught with LookupError:", repr(e))

# catches every file and permission problem
try:
    open("missing_dir/file.txt")
except OSError as e:
    print("Caught with OSError:", repr(e))` },
        { type: "sub", value: "assert" },
        { type: "code", value: `pile = [1, 2, 3]
assert len(pile) > 0, "the pile must not be empty"
print("Assert passed, pile items:", len(pile))` },
        { type: "warn", value: "assert is for catching your own mistakes during development, not for validating user input. Python removes every assert when run with the -O flag, so any check you actually need must be a real if and raise." }
      ]
    },

    {
      id: "debugging",
      icon: "🔬",
      title: "Debugging",
      tagline: "Finding out what is actually happening",
      keywords: "debug print traceback logging breakpoint pdb assert repr inspect troubleshoot",
      blocks: [
        { type: "text", value: "Debugging is the discipline of replacing what you assume with what you observe. Almost every bug is a variable holding something other than what you expected." },
        { type: "sub", value: "print, used well" },
        { type: "code", value: `count = 7
data = {"a": 1, "b": 2}
value = 3.14
text = "potato "

print(f"{count=}")
print(f"{data=}")
print(f"{type(value)=}")
print(repr(text))               # reveals hidden spaces and newlines` },
        { type: "tip", value: "Print the repr, not the value. 'potato ' and 'potato' look identical printed; their reprs do not. That trailing space has cost more hours than any other single character." },
        { type: "sub", value: "Reading a traceback" },
        { type: "code", value: `Traceback (most recent call last):
  File "main.py", line 12, in <module>
    result = process(data)
  File "main.py", line 7, in process
    return total / count
ZeroDivisionError: division by zero` },
        { type: "text", value: "Read it bottom-up. The last line names the problem. Above it, the deepest call comes last — so line 7 inside process is where it broke, called from line 12." },
        { type: "sub", value: "breakpoint()" },
        { type: "code", value: `def process(data):
    total = sum(data)
    # breakpoint()        # execution pauses here in interactive debuggers
    print("data total:", total)
    return total / len(data)

print("result:", process([10, 20, 30]))` },
        {
          type: "table",
          head: ["Command", "Does"],
          rows: [
            ["n", "next line"],
            ["s", "step into a call"],
            ["c", "continue until the next breakpoint"],
            ["p name", "print a variable"],
            ["l", "show the surrounding code"],
            ["q", "quit"]
          ]
        },
        { type: "sub", value: "logging" },
        { type: "text", value: "For anything beyond a quick check, logging beats print — it can be switched off, filtered by severity, and sent to a file." },
        { type: "code", value: `import logging
logging.basicConfig(level=logging.DEBUG, force=True, format="%(levelname)s: %(message)s")

logging.debug("detail for me")
logging.info("normal progress")
logging.warning("something looks off")
logging.error("it failed")` },
        { type: "sub", value: "A method that works" },
        {
          type: "list",
          items: [
            "Reproduce it reliably. A bug you cannot repeat cannot be fixed.",
            "Narrow it down. Cut the input until the smallest case still fails.",
            "Check your assumptions one at a time, with prints.",
            "Change ONE thing, then test. Changing three means you learn nothing.",
            "Read the error message properly. It usually says exactly what happened."
          ]
        },
        { type: "note", value: "When you are truly stuck, explain the code out loud, line by line, to someone who does not code — or to a rubber duck. Half the time you find the bug mid-sentence, because saying it forces you to check what you have been assuming. We have a duck available. — Randy" }
      ]
    }

  ]
});