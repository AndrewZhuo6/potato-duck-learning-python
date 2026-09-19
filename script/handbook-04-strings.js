window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "strings",
  icon: "📜",
  title: "Strings",
  blurb: "Text: how to write it, cut it, search it, reshape it, and every method that comes attached.",
  sections: [

    {
      id: "string-basics",
      icon: "🔤",
      title: "Writing Strings",
      tagline: "Quotes, escapes and raw text",
      keywords: "string quotes single double triple escape newline tab backslash raw unicode multiline immutable",
      blocks: [
        { type: "text", value: "A string is text in quotes. Single or double — Python does not care, as long as they match." },
        { type: "code", value: `name = "Quackbit"
print(name)

name = 'Quackbit'
print(name)

empty = ""
print(repr(empty))` },
        { type: "text", value: "Use whichever quote saves you from escaping." },
        { type: "code", value: `print("don't")            # easy
print('don\\'t')          # awkward
print('He said "hi"')     # easy
print("He said \\"hi\\"")  # awkward` },
        { type: "sub", value: "Triple quotes" },
        { type: "text", value: "Three quotes in a row let a string run across several lines, keeping the line breaks." },
        { type: "code", value: `message = """The village is quiet.
The stones are cold.
The road is long."""
print(message)` },
        { type: "sub", value: "Escape sequences" },
        { type: "text", value: "A backslash gives the next character a special meaning." },
        {
          type: "table",
          head: ["Escape", "Means"],
          rows: [
            ["\\n", "new line"],
            ["\\t", "tab"],
            ["\\\\", "a literal backslash"],
            ["\\'", "a single quote"],
            ["\\\"", "a double quote"],
            ["\\r", "carriage return"],
            ["\\0", "the null character"],
            ["\\uXXXX", "a unicode character by code"]
          ]
        },
        { type: "code", value: `print("line one\\nline two")
print("name\\tvalue")
print("C:\\\\Users\\\\Tim")` },
        { type: "sub", value: "Raw strings" },
        { type: "text", value: "Put r before the quotes and backslashes lose their power. Essential for Windows paths and regular expressions." },
        { type: "code", value: `print(r"C:\\Users\\Tim")
# print("C:\\Users\\Tim")   # \\U starts a unicode escape — error` },
        { type: "sub", value: "Joining strings written side by side" },
        { type: "code", value: `long = ("the first part "
        "and the second part "
        "and the third")
print(long)` },
        { type: "warn", value: "Strings cannot be changed once made. word[0] = \"x\" raises TypeError. Every method that seems to change a string actually builds a new one and hands it back — which is why you must catch the result: word = word.upper(), not just word.upper()." }
      ]
    },

    {
      id: "indexing-slicing",
      icon: "✂️",
      title: "Indexing & Slicing",
      tagline: "Reaching into a string",
      keywords: "index slice substring position negative step reverse range character len out of range",
      blocks: [
        { type: "text", value: "Every character has a position, counting from 0. Negative positions count backwards from the end." },
        { type: "code", label: "positions", value: `#   p  o  t  a  t  o
#   0  1  2  3  4  5
#  -6 -5 -4 -3 -2 -1
word = "potato"
for i, ch in enumerate(word):
    print(f"index {i}: {ch}")` },
        { type: "code", value: `word = "potato"
print(word[0])
print(word[3])
print(word[-1])     # the last character
print(word[-2])     # second from the end
print(len(word))` },
        { type: "warn", value: "The last valid position is len - 1. word[6] on a 6-character string raises IndexError. Negative indexing is the safe way to get the end: word[-1] never needs you to compute the length." },
        { type: "sub", value: "Slicing" },
        { type: "syntax", value: "text[start:stop:step]" },
        { type: "text", value: "start is where to begin, stop is where to stop BEFORE, step is how far to jump each time. Leave any of them out and Python fills in a sensible default." },
        {
          type: "table",
          head: ["Written", "Gives", "Meaning"],
          rows: [
            ["word[0:3]", "'pot'", "positions 0, 1, 2"],
            ["word[2:]", "'tato'", "from 2 to the end"],
            ["word[:4]", "'pota'", "from the start to 4"],
            ["word[:]", "'potato'", "the whole thing, a copy"],
            ["word[-3:]", "'ato'", "the last three"],
            ["word[:-2]", "'pota'", "all but the last two"],
            ["word[::2]", "'pttо'", "every second character"],
            ["word[::-1]", "'otatop'", "reversed"],
            ["word[1:5:2]", "'oa'", "1 and 3"]
          ]
        },
        { type: "tip", value: "text[::-1] is the standard way to reverse anything with an order — a string, a list, a tuple. The step of -1 walks from the end to the start." },
        { type: "sub", value: "Slices never go out of range" },
        { type: "code", value: `word = "potato"
print(word[2:99])       # no error, it just stops at the end
print(repr(word[99:]))  # an empty string, still no error
# print(word[10])       # raises IndexError` },
        { type: "note", value: "That stop-before rule looks odd until you notice two things it gives you: text[:n] and text[n:] split the string perfectly with no overlap and nothing lost, and text[a:b] always contains exactly b - a characters." }
      ]
    },

    {
      id: "fstrings",
      icon: "🧵",
      title: "Building Strings",
      tagline: "f-strings, format, concatenation",
      keywords: "f-string format concatenate join interpolation padding alignment decimal places percentage",
      blocks: [
        { type: "text", value: "There are four ways to put values into text. Use f-strings." },
        { type: "sub", value: "f-strings" },
        { type: "syntax", value: "f\"text {expression} more text\"" },
        { type: "code", value: `name = "Quackbit"
stones = 12

print(f"{name} crossed {stones} stones")
print(f"{stones * 2} in total")           # any expression works
print(f"{name.upper()}")                  # including method calls
print(f"{'even' if stones % 2 == 0 else 'odd'}")` },
        { type: "sub", value: "Formatting inside an f-string" },
        { type: "text", value: "A colon after the expression starts a format specification." },
        {
          type: "table",
          head: ["Written", "Result", "Does"],
          rows: [
            ["f\"{3.14159:.2f}\"", "'3.14'", "two decimal places"],
            ["f\"{42:5}\"", "'   42'", "width 5, right aligned"],
            ["f\"{42:<5}\"", "'42   '", "left aligned"],
            ["f\"{42:^5}\"", "' 42  '", "centred"],
            ["f\"{42:05}\"", "'00042'", "padded with zeros"],
            ["f\"{1234567:,}\"", "'1,234,567'", "thousands separator"],
            ["f\"{0.856:.1%}\"", "'85.6%'", "as a percentage"],
            ["f\"{255:b}\"", "'11111111'", "binary"],
            ["f\"{255:x}\"", "'ff'", "hexadecimal"],
            ["f\"{255:o}\"", "'377'", "octal"],
            ["f\"{1500:.2e}\"", "'1.50e+03'", "scientific"]
          ]
        },
        { type: "code", value: `prices = {"torch": 4.5, "mirror": 12.0}
for item, price in prices.items():
    print(f"{item:<12} {price:>8.2f}")` },
        { type: "sub", value: "Debugging with =" },
        { type: "code", value: `count = 7
print(f"{count=}")
print(f"{count * 2=}")` },
        { type: "tip", value: "That equals sign prints the expression AND its value. It turns a print-debugging session into one keystroke per variable." },
        { type: "sub", value: "The older ways" },
        { type: "code", value: `name = "Quackbit"
stones = 12

# .format() — still fine, more verbose
print("{} crossed {} stones".format(name, stones))
print("{0} and {0} again".format(name))
print("{n} crossed".format(n=name))

# % formatting — old, avoid in new code
print("%s crossed %d stones" % (name, stones))

# plain joining
print(name + " crossed " + str(stones) + " stones")` },
        { type: "warn", value: "Plain + requires every piece to already be a string. \"count: \" + 5 raises TypeError; you must write str(5). f-strings convert automatically, which is one more reason to prefer them." },
        { type: "sub", value: "Building a long string in a loop" },
        {
          type: "compare",
          bad: `result = ""
for word in words:
    result += word + " "`,
          good: `result = " ".join(words)`,
          why: "Strings cannot be changed, so += builds a brand new string every round — O(n²) work for a long list. .join() walks the list once."
        }
      ]
    },

    {
      id: "string-methods-case",
      icon: "🔠",
      title: "Case & Whitespace Methods",
      tagline: "Changing shape, trimming edges",
      keywords: "upper lower title capitalize swapcase casefold strip lstrip rstrip whitespace trim clean",
      blocks: [
        { type: "text", value: "None of these change the original string. Each builds a new one and hands it back." },
        {
          type: "table",
          head: ["Method", "Does", "Example"],
          rows: [
            [".upper()", "all capitals", "'aB'.upper() → 'AB'"],
            [".lower()", "all lowercase", "'aB'.lower() → 'ab'"],
            [".title()", "Capitalise Each Word", "'a b'.title() → 'A B'"],
            [".capitalize()", "First letter only", "'ab cd'.capitalize() → 'Ab cd'"],
            [".swapcase()", "flips each letter", "'aB'.swapcase() → 'Ab'"],
            [".casefold()", "aggressive lowercase", "for comparing across languages"]
          ]
        },
        { type: "code", value: `word = "pOtAtO"
print(word.lower())
print(word)              # unchanged

word = word.lower()      # catch the result to keep it
print(word)` },
        { type: "sub", value: "Trimming" },
        {
          type: "table",
          head: ["Method", "Removes"],
          rows: [
            [".strip()", "whitespace from both ends"],
            [".lstrip()", "whitespace from the left"],
            [".rstrip()", "whitespace from the right"],
            [".strip(chars)", "any of those characters from both ends"],
            [".removeprefix(s)", "s from the start, if present"],
            [".removesuffix(s)", "s from the end, if present"]
          ]
        },
        { type: "code", value: `print(repr("  hello  ".strip()))
print(repr("  hello  ".lstrip()))
print(repr("###hi###".strip("#")))
print(repr("xyxhixyx".strip("xy")))     # strips ANY of those characters

print("file.txt".removesuffix(".txt"))` },
        { type: "warn", value: ".strip(chars) does not remove a whole word — it removes any of those individual characters from each end until it hits one that is not listed. \"banana\".strip(\"ban\") gives an empty string." },
        { type: "tip", value: "Reading user input, .strip().lower() should be reflexive. It makes \" YES \" and \"yes\" behave identically, which is nearly always what you want." }
      ]
    },

    {
      id: "string-methods-search",
      icon: "🔎",
      title: "Searching & Testing Methods",
      tagline: "Finding things, asking questions",
      keywords: "find index count startswith endswith isalpha isdigit isalnum isspace islower isupper contains search",
      blocks: [
        { type: "sub", value: "Finding" },
        {
          type: "table",
          head: ["Method", "Gives", "If absent"],
          rows: [
            [".find(x)", "position of the first x", "-1"],
            [".rfind(x)", "position of the last x", "-1"],
            [".index(x)", "position of the first x", "raises ValueError"],
            [".rindex(x)", "position of the last x", "raises ValueError"],
            [".count(x)", "how many non-overlapping x", "0"]
          ]
        },
        { type: "code", value: `text = "waterbitwater"
print(text.find("bit"))
print(text.find("zzz"))
print(text.count("water"))

# find also takes a start position
print(text.find("water", 1))   # skips the first one` },
        { type: "tip", value: "Use .find() when a miss is normal and you will handle it; use .index() when a miss means something has gone wrong and you want it to stop loudly." },
        { type: "sub", value: "Testing the start and end" },
        { type: "code", value: `print("potato.txt".startswith("pot"))
print("potato.txt".endswith(".txt"))
print("potato.txt".endswith((".txt", ".md"))) # a tuple means any of these` },
        { type: "sub", value: "Asking what kind of characters" },
        { type: "text", value: "Each of these returns True only if EVERY character qualifies, and False for an empty string." },
        {
          type: "table",
          head: ["Method", "True when every character is"],
          rows: [
            [".isalpha()", "a letter"],
            [".isdigit()", "a digit"],
            [".isalnum()", "a letter or a digit"],
            [".isspace()", "whitespace"],
            [".islower()", "lowercase (ignoring non-letters)"],
            [".isupper()", "uppercase (ignoring non-letters)"],
            [".istitle()", "Title Case"],
            [".isnumeric()", "numeric, including fractions and roman numerals"],
            [".isdecimal()", "a plain decimal digit"],
            [".isidentifier()", "valid as a Python name"],
            [".isprintable()", "printable"]
          ]
        },
        { type: "code", value: `print("abc".isalpha())
print("ab1".isalpha())      # the digit disqualifies it
print("".isalpha())         # empty is never True
print("AB".isupper())
print("AB1".isupper())      # digits are ignored, letters decide` },
        { type: "warn", value: "\"-5\".isdigit() is False, because the minus sign is not a digit. To test whether text can become a number, try the conversion and catch the failure." },
        { type: "code", value: `def is_number(text):
    try:
        float(text)
        return True
    except ValueError:
        return False

print(is_number("123"))
print(is_number("-3.14"))
print(is_number("abc"))` }
      ]
    },

    {
      id: "string-methods-transform",
      icon: "🔧",
      title: "Splitting, Joining & Replacing",
      tagline: "Reshaping text",
      keywords: "split rsplit splitlines join replace partition center ljust rjust zfill expandtabs translate",
      blocks: [
        { type: "sub", value: "split()" },
        { type: "syntax", value: "text.split(separator=None, maxsplit=-1)" },
        { type: "code", value: `print("a b c".split())           # any whitespace
print("a,b,c".split(","))
print("a,b,c".split(",", 1))     # at most one split
print("a b  c".split())          # runs of spaces collapse
print("a b  c".split(" "))       # they do not` },
        { type: "warn", value: "Calling .split() with no argument treats any run of whitespace as one separator and ignores leading and trailing space. Passing \" \" explicitly does not. The bare version is almost always what you want." },
        { type: "code", value: `print("line1\\nline2".splitlines())
print("a-b-c".rsplit("-", 1))         # split from the right

# partition splits once and keeps the separator
print("key=value".partition("="))` },
        { type: "sub", value: "join()" },
        { type: "syntax", value: "separator.join(list_of_strings)" },
        { type: "code", value: `lines = ["first line", "second line"]

print(" ".join(["a", "b", "c"]))
print("".join(["a", "b", "c"]))
print(", ".join(["a", "b"]))
print("\\n".join(lines))` },
        { type: "warn", value: "Every item must already be a string. \" \".join([1, 2]) raises TypeError. Convert first: \" \".join(str(n) for n in numbers)." },
        { type: "tip", value: "The separator goes first and the list second, which reads backwards the first hundred times. Remember it as: this separator, applied to that list." },
        { type: "sub", value: "replace()" },
        { type: "code", value: `print("aaa".replace("a", "b"))
print("aaa".replace("a", "b", 2))    # at most two
print("a-b-c".replace("-", ""))      # deleting` },
        { type: "sub", value: "Padding and aligning" },
        {
          type: "table",
          head: ["Method", "Does", "Example"],
          rows: [
            [".ljust(n)", "pad right to width n", "'a'.ljust(3) → 'a  '"],
            [".rjust(n)", "pad left to width n", "'a'.rjust(3) → '  a'"],
            [".center(n)", "pad both sides", "'a'.center(3) → ' a '"],
            [".zfill(n)", "pad left with zeros", "'7'.zfill(3) → '007'"],
            [".ljust(n, c)", "pad with character c", "'a'.ljust(3,'-') → 'a--'"]
          ]
        },
        { type: "sub", value: "translate()" },
        { type: "text", value: "Replaces or deletes many characters in one pass — faster than chaining several .replace() calls." },
        { type: "code", value: `table = str.maketrans("abc", "xyz")
print("aabbcc".translate(table))

# deleting characters
table = str.maketrans("", "", "aeiou")
print("potato".translate(table))` }
      ]
    },

    {
      id: "string-iteration",
      icon: "🔁",
      title: "Walking Through Text",
      tagline: "Characters, positions, patterns",
      keywords: "iterate loop character enumerate reverse zip comprehension build filter count vowels",
      blocks: [
        { type: "text", value: "A string is a sequence, so every looping tool that works on a list works on text." },
        { type: "code", value: `for ch in "potato":
    print(ch)

for i, ch in enumerate("potato"):
    print(i, ch)

for ch in reversed("potato"):
    print(ch)` },
        { type: "sub", value: "Building a new string from an old one" },
        { type: "text", value: "The standard shape: start empty, walk the original, add what passes your test." },
        { type: "code", value: `message = "The 12 stones of Potato Village!"

cleaned = ""
for ch in message:
    if ch.isalpha():
        cleaned += ch
print(cleaned)

# the same thing, shorter and faster
cleaned = "".join(ch for ch in message if ch.isalpha())
print(cleaned)` },
        { type: "sub", value: "Counting things" },
        { type: "code", value: `word = "Potato"

# count vowels
count = 0
for ch in word.lower():
    if ch in "aeiou":
        count += 1
print("vowel count:", count)

# same, in one line
count = sum(1 for ch in word.lower() if ch in "aeiou")
print("one-line count:", count)

# count every character at once
from collections import Counter
tally = Counter("waterbitwater")
print("w count:", tally["w"])
print("most common:", tally.most_common(1))` },
        { type: "sub", value: "Counting without importing anything" },
        { type: "code", value: `spell = "abracadabra"
counts = {}
for ch in spell:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)` },
        { type: "sub", value: "Comparing two strings position by position" },
        { type: "code", value: `for a, b in zip("abc", "abd"):
    if a != b:
        print("differs:", a, b)` },
        { type: "tip", value: "zip() stops at the shorter of the two, so it never runs off the end. If you need to know that the lengths differ, check len() separately." }
      ]
    },

    {
      id: "string-encoding",
      icon: "🌍",
      title: "Characters & Encoding",
      tagline: "ord, chr, unicode, bytes",
      keywords: "ord chr unicode ascii encode decode bytes utf-8 character code alphabet",
      blocks: [
        { type: "text", value: "Every character has a number. ord() gives you the number, chr() gives you back the character." },
        { type: "code", value: `print(ord("a"))
print(ord("A"))
print(ord("0"))
print(chr(97))
print(chr(65))` },
        {
          type: "table",
          head: ["Characters", "Codes"],
          rows: [
            ["0–9", "48–57"],
            ["A–Z", "65–90"],
            ["a–z", "97–122"],
            ["space", "32"]
          ]
        },
        { type: "sub", value: "What that lets you do" },
        { type: "code", value: `# position in the alphabet
print(ord("c") - ord("a"))

# shift a letter, wrapping around (a Caesar cipher)
def shift(ch, n):
    if not ch.isalpha():
        return ch
    base = ord("a") if ch.islower() else ord("A")
    return chr((ord(ch) - base + n) % 26 + base)

print(shift("a", 3))
print(shift("z", 1))

# build the alphabet
alphabet = "".join(chr(ord("a") + i) for i in range(26))
print(alphabet)` },
        { type: "tip", value: "The % 26 is what makes z wrap round to a. That is the wrap-around trick from the arithmetic section, doing real work." },
        { type: "sub", value: "Strings are unicode" },
        { type: "text", value: "Python 3 strings hold any character in any writing system. Emoji, Chinese, accented letters — all ordinary characters." },
        { type: "code", value: `word = "土豆"
print(len(word))
print(word[0])

print("café"[3])
print(ord("é"))
print(ord("🦆"))` },
        { type: "sub", value: "Bytes" },
        { type: "text", value: "A string is characters. Bytes are raw numbers. Converting between them is called encoding and decoding, and UTF-8 is the encoding to use." },
        { type: "code", value: `data = "potato".encode("utf-8")
print(data)
print(type(data))
print(data.decode("utf-8"))

print("土豆".encode("utf-8"))  # six bytes for two characters` },
        { type: "note", value: "You only meet bytes when reading files in binary mode or talking over a network. For everything else, work with strings and let Python handle the rest." }
      ]
    }

  ]
});