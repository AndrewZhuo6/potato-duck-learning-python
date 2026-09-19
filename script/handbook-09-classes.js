window.HANDBOOK_GROUPS = window.HANDBOOK_GROUPS || [];
window.HANDBOOK_GROUPS.push({
  id: "classes",
  icon: "🏛️",
  title: "Classes & Objects",
  blurb: "Making your own kinds of thing: attributes, methods, inheritance, and the special methods that make an object behave like a built-in.",
  sections: [

    {
      id: "class-basics",
      icon: "🧱",
      title: "Defining a Class",
      tagline: "class, __init__, self",
      keywords: "class object instance init self attribute method constructor instantiate blueprint",
      blocks: [
        { type: "text", value: "A class is a template for a kind of thing. It bundles some data with the functions that work on that data. An object built from a class is called an instance." },
        { type: "syntax", value: "class Name:\\n    def __init__(self, params):\\n        self.attribute = value" },
        { type: "code", value: `class Duck:
    def __init__(self, name, level=1):
        self.name = name
        self.level = level
        self.inventory = []

    def pick_up(self, item):
        self.inventory.append(item)

    def describe(self):
        return f"{self.name}, level {self.level}"

quackbit = Duck("Quackbit", 3)
quackbit.pick_up("torch")
print(quackbit.describe())
print(quackbit.inventory)` },
        { type: "sub", value: "What the pieces are" },
        {
          type: "table",
          head: ["Term", "Means"],
          rows: [
            ["class", "the template"],
            ["instance", "one thing built from it"],
            ["attribute", "a value stored on the instance"],
            ["method", "a function defined in the class"],
            ["__init__", "runs automatically when an instance is made"],
            ["self", "the instance the method was called on"]
          ]
        },
        { type: "sub", value: "self" },
        { type: "text", value: "Every method's first parameter is the instance itself. Python passes it automatically, so you never write it at the call site." },
        { type: "code", value: `class Duck:
    def __init__(self, name):
        self.name = name
        self.inventory = []

    def pick_up(self, item):
        self.inventory.append(item)

quackbit = Duck("Quackbit")

quackbit.pick_up("torch")          # what you write
Duck.pick_up(quackbit, "torch")    # what Python does behind the scenes
print(quackbit.inventory)` },
        { type: "warn", value: "Forgetting self in a method definition gives TypeError: takes 1 positional argument but 2 were given — a confusing message that means exactly this. And forgetting self. inside a method creates a local variable that vanishes when the method ends." },
        {
          type: "compare",
          bad: `def pick_up(self, item):
    inventory.append(item)`,
          good: `def pick_up(self, item):
    self.inventory.append(item)`,
          why: "Without self., Python looks for a local or global name called inventory and raises NameError. Attributes always need the prefix."
        },
        { type: "text", value: "The name self is a convention, not a rule — but break it and every Python programmer reading your code will stumble. Use self." },
        { type: "sub", value: "Class attributes against instance attributes" },
        { type: "code", value: `class Duck:
    species = "mallard"       # shared by every Duck

    def __init__(self, name):
        self.name = name      # different for each Duck

a = Duck("Quackbit")
b = Duck("Potatis")
print(a.species)
Duck.species = "teal"         # changes it for both
print(a.species)
print(b.species)` },
        { type: "warn", value: "Never use a list or dict as a class attribute unless you mean it to be shared. Every instance will see the same one — the same trap as mutable default arguments." }
      ]
    },

    {
      id: "dunder-methods",
      icon: "🎭",
      title: "Special Methods",
      tagline: "Making your object behave like a built-in",
      keywords: "dunder magic method str repr len eq lt add getitem contains iter call bool operator overload",
      blocks: [
        { type: "text", value: "Methods whose names start and end with two underscores hook into Python's own syntax. Defining them lets your object work with print, len, ==, +, in, for, and the rest." },
        { type: "sub", value: "The two you should always define" },
        { type: "code", value: `class Duck:
    def __init__(self, name, level):
        self.name = name
        self.level = level

    def __repr__(self):
        return f"Duck({self.name!r}, {self.level})"

    def __str__(self):
        return f"{self.name} (level {self.level})"

d = Duck("Quackbit", 3)
print(str(d))   # uses __str__
print(repr(d))  # uses __repr__
print([d])      # containers use __repr__` },
        { type: "tip", value: "If you only write one, write __repr__ — Python falls back to it when __str__ is missing, and it is what you see when debugging. Aim for something that could be pasted back in to recreate the object." },
        { type: "sub", value: "Comparison" },
        { type: "code", value: `class Duck:
    def __init__(self, name, level):
        self.name = name
        self.level = level

    def __repr__(self):
        return f"Duck({self.name!r}, {self.level})"

    def __eq__(self, other):
        return self.level == other.level

    def __lt__(self, other):
        return self.level < other.level

    def __hash__(self):
        return hash(self.name)

a = Duck("Quackbit", 3)
b = Duck("Potatis", 5)
ducks = [b, a]

print(a < b)          # uses __lt__
print(sorted(ducks))  # uses __lt__` },
        { type: "warn", value: "Defining __eq__ silently removes the default __hash__, so your objects can no longer go in a set or be dict keys. If you need that, define __hash__ too." },
        { type: "sub", value: "The full set worth knowing" },
        {
          type: "table",
          head: ["Method", "Triggered by"],
          rows: [
            ["__init__", "Duck(...)"],
            ["__repr__", "repr(x), the console"],
            ["__str__", "str(x), print(x)"],
            ["__len__", "len(x)"],
            ["__bool__", "if x:"],
            ["__eq__", "x == y"],
            ["__lt__ __le__ __gt__ __ge__", "< <= > >="],
            ["__hash__", "hash(x), sets, dict keys"],
            ["__add__ __sub__ __mul__", "+ - *"],
            ["__getitem__", "x[i]"],
            ["__setitem__", "x[i] = v"],
            ["__delitem__", "del x[i]"],
            ["__contains__", "v in x"],
            ["__iter__", "for v in x"],
            ["__next__", "next(x)"],
            ["__call__", "x(...)"],
            ["__enter__ __exit__", "with x:"],
            ["__getattr__", "x.missing_name"]
          ]
        },
        { type: "code", value: `class Inventory:
    def __init__(self, items=None):
        self.items = items or []

    def __len__(self):
        return len(self.items)

    def __getitem__(self, i):
        return self.items[i]

    def __contains__(self, item):
        return item in self.items

    def __iter__(self):
        return iter(self.items)

inv = Inventory(["torch", "map"])
print(len(inv))
print(inv[0])
print("torch" in inv)
for item in inv:
    print(item)` },
        { type: "note", value: "Defining __len__ alone gives you truthiness for free — an empty Inventory becomes falsy, so if inv: works without writing __bool__. Python is full of these small courtesies." }
      ]
    },

    {
      id: "inheritance",
      icon: "🌳",
      title: "Inheritance",
      tagline: "Building on an existing class",
      keywords: "inheritance subclass parent child super override base class mro multiple composition",
      blocks: [
        { type: "text", value: "A class can be based on another, inheriting everything it has and then adding or changing pieces." },
        { type: "syntax", value: "class Child(Parent):" },
        { type: "code", value: `class Creature:
    def __init__(self, name, health):
        self.name = name
        self.health = health

    def describe(self):
        return f"{self.name}, {self.health} hp"

class Guardian(Creature):
    def __init__(self, name, health, weakness):
        super().__init__(name, health)    # run the parent's setup
        self.weakness = weakness

    def describe(self):
        base = super().describe()
        return f"{base}, fears {self.weakness}"

g = Guardian("SuPrime", 200, "primes")
print(g.describe())` },
        { type: "sub", value: "super()" },
        { type: "text", value: "super() reaches the parent class. Use it in __init__ so the parent's setup still happens, and in any method where you want to extend rather than replace the parent's behaviour." },
        { type: "warn", value: "If you define __init__ in a child and do not call super().__init__(), none of the parent's attributes get created, and every method relying on them fails." },
        { type: "sub", value: "Checking relationships" },
        { type: "code", value: `class Creature:
    pass

class Guardian(Creature):
    pass

g = Guardian()
print(isinstance(g, Guardian))
print(isinstance(g, Creature))      # a Guardian IS a Creature
print(issubclass(Guardian, Creature))
print(Guardian.__mro__)             # the order Python searches for methods` },
        { type: "sub", value: "Inheritance against composition" },
        {
          type: "compare",
          bad: `class Duck(Inventory):
    ...`,
          good: `class Duck:
    def __init__(self):
        self.inventory = Inventory()`,
          why: "Inherit only when the child genuinely IS a kind of the parent. A Duck is not a kind of Inventory — it HAS one. Reaching for inheritance to reuse code produces tangled hierarchies."
        },
        { type: "sub", value: "Multiple inheritance" },
        { type: "code", value: `class Swimmer:
    def swim(self):
        return "swimming"

class Flyer:
    def fly(self):
        return "flying"

class Duck(Swimmer, Flyer):
    pass

d = Duck()
print(d.swim())
print(d.fly())` },
        { type: "warn", value: "Multiple inheritance works, and it gets complicated fast when two parents define the same method. Python resolves it with a defined order (the MRO), but if you need to consult the MRO to predict what your code does, simplify the design instead." }
      ]
    },

    {
      id: "properties",
      icon: "🔐",
      title: "Properties & Class Methods",
      tagline: "@property, @staticmethod, @classmethod",
      keywords: "property getter setter staticmethod classmethod decorator encapsulation private underscore validation",
      blocks: [
        { type: "sub", value: "@property" },
        { type: "text", value: "A method that behaves like an attribute. Useful for values computed on demand, or for validating what gets assigned." },
        { type: "code", value: `class Duck:
    def __init__(self, name, level):
        self.name = name
        self._level = level

    @property
    def level(self):
        return self._level

    @level.setter
    def level(self, value):
        if value < 1:
            raise ValueError("level must be at least 1")
        self._level = value

    @property
    def title(self):
        return "novice" if self._level < 5 else "master"

d = Duck("Quackbit", 3)
print(d.level)       # no brackets, looks like an attribute
d.level = 5          # runs the setter, which validates
print(d.level)

try:
    d.level = 0
except ValueError as e:
    print("ValueError:", e)

print(d.title)       # computed each time, no storage` },
        { type: "tip", value: "Start with plain attributes. Convert to a property only when you need validation or computation — the syntax at the call site does not change, so nothing that used the attribute needs rewriting." },
        { type: "sub", value: "@staticmethod" },
        { type: "text", value: "A function that lives in the class for organisation but needs neither the instance nor the class." },
        { type: "code", value: `class MathHelper:
    @staticmethod
    def is_prime(n):
        if n < 2:
            return False
        for i in range(2, int(n ** 0.5) + 1):
            if n % i == 0:
                return False
        return True

print(MathHelper.is_prime(17))` },
        { type: "sub", value: "@classmethod" },
        { type: "text", value: "Receives the class rather than an instance. Mostly used for alternative constructors." },
        { type: "code", value: `class Duck:
    def __init__(self, name, level):
        self.name = name
        self.level = level

    def __repr__(self):
        return f"Duck({self.name!r}, {self.level})"

    @classmethod
    def novice(cls, name):
        return cls(name, 1)

    @classmethod
    def from_string(cls, text):
        name, level = text.split(",")
        return cls(name, int(level))

a = Duck.novice("Quackbit")
b = Duck.from_string("Potatis,7")
print(a)
print(b)` },
        { type: "sub", value: "Privacy conventions" },
        {
          type: "table",
          head: ["Written", "Means"],
          rows: [
            ["name", "public — use freely"],
            ["_name", "internal — please do not touch"],
            ["__name", "name-mangled, harder to reach by accident"],
            ["__name__", "Python's own, do not invent these"]
          ]
        },
        { type: "note", value: "Python has no真 private attributes. The single underscore is a promise between programmers, not a lock. The language trusts you, which is either liberating or terrifying depending on the day." }
      ]
    },

    {
      id: "dataclasses",
      icon: "📦",
      title: "Dataclasses",
      tagline: "Classes that mostly hold data",
      keywords: "dataclass field default factory frozen post_init namedtuple boilerplate",
      blocks: [
        { type: "text", value: "When a class exists mainly to hold a few values, @dataclass writes __init__, __repr__ and __eq__ for you." },
        {
          type: "compare",
          bad: `class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __repr__(self):
        return f"Point({self.x}, {self.y})"
    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)`,
          good: `from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int`,
          why: "Identical behaviour. The type hints are required here — that is how the dataclass decorator knows what the fields are."
        },
        { type: "code", value: `from dataclasses import dataclass, field

@dataclass
class Duck:
    name: str
    level: int = 1
    inventory: list = field(default_factory=list)

d = Duck("Quackbit")
print(d)
print(d == Duck("Quackbit"))   # compares by value` },
        { type: "warn", value: "For a mutable default you must use field(default_factory=list), not = []. The dataclass decorator refuses the bare list outright — one of the few places Python protects you from that trap." },
        { type: "sub", value: "Frozen dataclasses" },
        { type: "code", value: `from dataclasses import dataclass, FrozenInstanceError

@dataclass(frozen=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
try:
    p.x = 5
except FrozenInstanceError as e:
    print("FrozenInstanceError:", e)

# frozen means hashable, so it can be a dict key
seen = {Point(1, 2): "visited"}
print(seen)` },
        { type: "sub", value: "Post-initialisation" },
        { type: "code", value: `from dataclasses import dataclass

@dataclass
class Rectangle:
    width: float
    height: float
    area: float = 0

    def __post_init__(self):
        self.area = self.width * self.height

rect = Rectangle(4, 5)
print(rect)
print("area:", rect.area)` },
        {
          type: "table",
          head: ["Need", "Use"],
          rows: [
            ["a fixed record, no methods", "namedtuple or frozen dataclass"],
            ["data plus a few methods", "dataclass"],
            ["behaviour, inheritance, state", "a plain class"],
            ["key-value data from outside", "a plain dict"]
          ]
        }
      ]
    },

    {
      id: "when-classes",
      icon: "🤔",
      title: "When To Use a Class",
      tagline: "And when not to",
      keywords: "when class design function module simple avoid overengineering state",
      blocks: [
        { type: "text", value: "Classes are not the default unit of Python code. Functions are. A class earns its place when data and the operations on it genuinely belong together." },
        { type: "sub", value: "Use a class when" },
        {
          type: "list",
          items: [
            "Several values always travel together and several functions all take the same ones.",
            "There is state that changes over time and must stay consistent.",
            "You need many instances of the same shape — enemies, accounts, records.",
            "You want your thing to work with len(), in, for, or ==."
          ]
        },
        { type: "sub", value: "Do not use a class when" },
        {
          type: "list",
          items: [
            "It has one method. That is a function.",
            "It has no state — only static methods. That is a module.",
            "It only holds data and nothing else. That is a dict or a dataclass.",
            "You are wrapping a single function to feel organised."
          ]
        },
        {
          type: "compare",
          bad: `class Calculator:
    def add(self, a, b):
        return a + b

Calculator().add(2, 3)`,
          good: `def add(a, b):
    return a + b

add(2, 3)`,
          why: "No state, no reason for an instance. The class adds a layer that carries no information."
        },
        { type: "note", value: "For your Guardian challenges you will almost never need a class — those problems take input and produce output, which is what a function is. Classes start to matter when a program has a world to keep track of. Knowing when NOT to reach for something is as much a skill as knowing how to use it. — Randy" }
      ]
    }

  ]
});