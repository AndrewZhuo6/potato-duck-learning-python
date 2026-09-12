window.initPreparationChapter({
    chapterNumber: 14,
    chapterTitle: "Guardian 9: The Hungry Cobra",
    nextChapterUrl: "g10.html",
    starterCode: `def grabBottle(inv_energyVal, nBottle):
    
    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "grabBottle" not in globals():
        return {"passed": False, "msg": "Function 'grabBottle' is not defined."}

    # Test Case 1: Example from story
    # [21, 90, 19, 46, 50, 1, 73], 3 -> reals: [12, 9, 91, 64, 5, 1, 37]
    # Top 3 are 91 + 64 + 37 = 192
    try:
        res1 = grabBottle([21, 90, 19, 46, 50, 1, 73], 3)
        if res1 != 192:
            return {"passed": False, "msg": f"Failed: grabBottle([21, 90, 19, 46, 50, 1, 73], 3) returned {res1} ({type(res1).__name__}), expected 192 (int)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: [12, 34, 56], 1 -> reals: [21, 43, 65] -> top 1 is 65
    try:
        res2 = grabBottle([12, 34, 56], 1)
        if res2 != 65:
            return {"passed": False, "msg": f"Failed: grabBottle([12, 34, 56], 1) returned {res2}, expected 65"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: Trailing zeros [10, 20, 30], 2 -> reals: [1, 2, 3] -> top 2 are 3 + 2 = 5
    try:
        res3 = grabBottle([10, 20, 30], 2)
        if res3 != 5:
            return {"passed": False, "msg": f"Failed: grabBottle([10, 20, 30], 2) returned {res3}, expected 5"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on trailing zeros test: {str(e)}"}

    # Test Case 4: Identical digits [99, 11, 22], 3 -> 99 + 11 + 22 = 132
    try:
        res4 = grabBottle([99, 11, 22], 3)
        if res4 != 132:
            return {"passed": False, "msg": f"Failed: grabBottle([99, 11, 22], 3) returned {res4}, expected 132"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 4: {str(e)}"}

    # Test Case 5: 100 -> real is 1
    try:
        res5 = grabBottle([100], 1)
        if res5 != 1:
            return {"passed": False, "msg": f"Failed: grabBottle([100], 1) returned {res5}, expected 1"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 5: {str(e)}"}

    # Test Case 6: Large list (500 items) and large numbers (up to 9 digits)
    try:
        large_bottles = [
            900000001, 100000009, 807060504, 500000000,
            999999999, 123456789, 1000002, 7000000
        ] + [i * 1234567 for i in range(1, 493)]
        res6 = grabBottle(large_bottles, 25)
        EXPECTED_LARGE = 24313976211
        if res6 != EXPECTED_LARGE:
            return {"passed": False, "msg": f"Failed on large dataset: grabBottle returned {res6}, expected {EXPECTED_LARGE}"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on large dataset test: {str(e)}"}

    return {"passed": True, "msg": "The Cobra is satisfied with the maximum energy feed! Guardian 9 conquered."}

run_tests()
`
});
