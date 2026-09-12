window.initPreparationChapter({
    chapterNumber: 13,
    chapterTitle: "Guardian 8: Two Pair",
    nextChapterUrl: "g9.html",
    starterCode: `def findPair(runeList, target):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "findPair" not in globals():
        return {"passed": False, "msg": "Function 'findPair' is not defined."}

    # Test Case 1: No suitable pair -> -1
    try:
        res1 = findPair([23, 21, 1, 45, 9, 3, 16], 57)
        if res1 != -1:
            return {"passed": False, "msg": f"Failed: findPair([23, 21, 1, 45, 9, 3, 16], 57) returned {res1}, expected -1"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Multiple pairs: [3, 4, 2, 5], target 7
    # Pairs are (4, 3) with diff 1, and (5, 2) with diff 3 -> pick [5, 2]
    try:
        res2 = findPair([3, 4, 2, 5], 7)
        if res2 != [5, 2]:
            return {"passed": False, "msg": f"Failed: findPair([3, 4, 2, 5], 7) returned {res2}, expected [5, 2] (largest difference)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: Multiple pairs: [1, 10, 5, 6, 2, 9], target 11
    # Pairs: (6, 5) diff 1, (9, 2) diff 7, (10, 1) diff 9 -> pick [10, 1]
    try:
        res3 = findPair([1, 10, 5, 6, 2, 9], 11)
        if res3 != [10, 1]:
            return {"passed": False, "msg": f"Failed: findPair([1, 10, 5, 6, 2, 9], 11) returned {res3}, expected [10, 1]"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    # Test Case 4: Cannot reuse same single element
    try:
        res4 = findPair([5, 3, 9], 10)
        if res4 != -1:
            return {"passed": False, "msg": f"Failed: findPair([5, 3, 9], 10) returned {res4}, expected -1 (cannot reuse single key 5)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 4: {str(e)}"}

    # Test Case 5: Two distinct elements with same value: [5, 5], target 10 -> [5, 5]
    try:
        res5 = findPair([5, 5], 10)
        if res5 != [5, 5]:
            return {"passed": False, "msg": f"Failed: findPair([5, 5], 10) returned {res5}, expected [5, 5]"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 5: {str(e)}"}

    # Test Case 6: Empty list -> -1
    try:
        res6 = findPair([], 10)
        if res6 != -1:
            return {"passed": False, "msg": f"Failed: findPair([], 10) returned {res6}, expected -1"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on empty list: {str(e)}"}

    return {"passed": True, "msg": "The massive iron door clicks open! Guardian 8 conquered."}

run_tests()
`
});
