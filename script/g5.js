window.initPreparationChapter({
    chapterNumber: 10,
    chapterTitle: "Guardian 5: Palindoom",
    nextChapterUrl: "g6.html",
    starterCode: `def determine(word):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "determine" not in globals():
        return {"passed": False, "msg": "Function 'determine' is not defined."}

    # Test Case 1: 'racecar' -> True
    try:
        res1 = determine('racecar')
        if res1 is not True:
            return {"passed": False, "msg": f"Failed: determine('racecar') returned {res1}, expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'racecar': {str(e)}"}

    # Test Case 2: 'panda' -> False
    try:
        res2 = determine('panda')
        if res2 is not False:
            return {"passed": False, "msg": f"Failed: determine('panda') returned {res2}, expected False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'panda': {str(e)}"}

    # Test Case 3: 'level' -> True
    try:
        res3 = determine('level')
        if res3 is not True:
            return {"passed": False, "msg": f"Failed: determine('level') returned {res3}, expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'level': {str(e)}"}

    # Test Case 4: 'noon' -> True
    try:
        res4 = determine('noon')
        if res4 is not True:
            return {"passed": False, "msg": f"Failed: determine('noon') returned {res4}, expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'noon': {str(e)}"}

    # Test Case 5: Single character 'a' -> True
    try:
        res5 = determine('a')
        if res5 is not True:
            return {"passed": False, "msg": f"Failed: determine('a') returned {res5}, expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on single char: {str(e)}"}

    # Test Case 6: 'quackbit' -> False
    try:
        res6 = determine('quackbit')
        if res6 is not False:
            return {"passed": False, "msg": f"Failed: determine('quackbit') returned {res6}, expected False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'quackbit': {str(e)}"}

    return {"passed": True, "msg": "Palindoom bows before your wisdom of balance! Guardian 5 conquered."}

run_tests()
`
});
