window.initPreparationChapter({
    chapterNumber: 12,
    chapterTitle: "Guardian 7: The Echoing Gate",
    nextChapterUrl: "g8.html",
    starterCode: `def pullOne(word):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "pullOne" not in globals():
        return {"passed": False, "msg": "Function 'pullOne' is not defined."}

    # Test Case 1: 'waterbitwater' -> 'b'
    try:
        res1 = pullOne('waterbitwater')
        if res1 != 'b':
            return {"passed": False, "msg": f"Failed: pullOne('waterbitwater') returned '{res1}', expected 'b'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: 'swiss' -> 'w'
    try:
        res2 = pullOne('swiss')
        if res2 != 'w':
            return {"passed": False, "msg": f"Failed: pullOne('swiss') returned '{res2}', expected 'w'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: All repeating letters 'aabbcc' -> 'LOCKED'
    try:
        res3 = pullOne('aabbcc')
        if res3 != 'LOCKED':
            return {"passed": False, "msg": f"Failed: pullOne('aabbcc') returned '{res3}', expected 'LOCKED'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    # Test Case 4: Empty string '' -> 'LOCKED'
    try:
        res4 = pullOne('')
        if res4 != 'LOCKED':
            return {"passed": False, "msg": f"Failed: pullOne('') returned '{res4}', expected 'LOCKED'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on empty string: {str(e)}"}

    # Test Case 5: 'quack' -> 'q' (all unique, first is 'q')
    try:
        res5 = pullOne('quack')
        if res5 != 'q':
            return {"passed": False, "msg": f"Failed: pullOne('quack') returned '{res5}', expected 'q'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'quack': {str(e)}"}

    # Test Case 6: Single repeating letter 'zzzz' -> 'LOCKED'
    try:
        res6 = pullOne('zzzz')
        if res6 != 'LOCKED':
            return {"passed": False, "msg": f"Failed: pullOne('zzzz') returned '{res6}', expected 'LOCKED'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'zzzz': {str(e)}"}

    return {"passed": True, "msg": "The ancient acoustic seal unlocks! Guardian 7 conquered."}

run_tests()
`
});
