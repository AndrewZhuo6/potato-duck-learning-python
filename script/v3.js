window.initPreparationChapter({
    chapterNumber: 3,
    chapterTitle: "Chapter 3: Our Inventory",
    nextChapterUrl: "v4.html",
    starterCode: `def quick_look_swap(monster, weaknesses, inventory):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "quick_look_swap" not in globals():
        return {"passed": False, "msg": "Function 'quick_look_swap' is not defined."}

    inv = ['knife', 'torch', 'bow', 'water', 'meat', 'sword', 'map', 'rod', 'salt', 'fork', 'spoon', 'onion']
    weaknesses = {'thief': 'knife', 'vampire': 'onion', 'snake': 'rod', 'harpy': 'bow', 'bandits': 'bomb'}

    # Test Case 1: 'harpy' -> 'bow' at index 2
    try:
        res1 = quick_look_swap('harpy', weaknesses, inv)
        if res1 != 2:
            return {"passed": False, "msg": f"Failed: quick_look_swap('harpy', weaknesses, inv) returned {res1}, expected 2"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: 'thief' -> 'knife' at index 0
    try:
        res2 = quick_look_swap('thief', weaknesses, inv)
        if res2 != 0:
            return {"passed": False, "msg": f"Failed: quick_look_swap('thief', weaknesses, inv) returned {res2}, expected 0"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: 'bandits' -> 'bomb' (not in inventory)
    try:
        res3 = quick_look_swap('bandits', weaknesses, inv)
        if res3 != -1:
            return {"passed": False, "msg": f"Failed: quick_look_swap('bandits', weaknesses, inv) returned {res3}, expected -1"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    # Test Case 4: 'vampire' -> 'onion' at index 11
    try:
        res4 = quick_look_swap('vampire', weaknesses, inv)
        if res4 != 11:
            return {"passed": False, "msg": f"Failed: quick_look_swap('vampire', weaknesses, inv) returned {res4}, expected 11"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 4: {str(e)}"}

    # Test Case 5: 'snake' -> 'rod' at index 7
    try:
        res5 = quick_look_swap('snake', weaknesses, inv)
        if res5 != 7:
            return {"passed": False, "msg": f"Failed: quick_look_swap('snake', weaknesses, inv) returned {res5}, expected 7"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 5: {str(e)}"}

    # Test Case 6: Unknown monster 'ghost' -> -1
    try:
        res6 = quick_look_swap('ghost', weaknesses, inv)
        if res6 != -1:
            return {"passed": False, "msg": f"Failed: quick_look_swap('ghost', weaknesses, inv) returned {res6}, expected -1"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 6: {str(e)}"}

    return {"passed": True, "msg": "Quick-swap mastered! All test cases passed."}

run_tests()
`
});
