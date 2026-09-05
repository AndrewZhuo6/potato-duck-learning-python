/**
 * Preparation 2 Configuration: Chapter 2 - The Duck's Supply Bag
 */

window.initPreparationChapter({
    chapterNumber: 2,
    chapterTitle: "Chapter 2: The Duck's Supply Bag",
    nextChapterUrl: "preparation3.html",
    starterCode: `def count_potatoes(bag, item_name):
    # Count and return how many times item_name appears in the bag list
    pass
`,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "count_potatoes" not in globals():
        return {"passed": False, "msg": "Function 'count_potatoes' is not defined."}
    
    # Test Case 1: Multiple occurrences
    try:
        inv1 = ["potato", "apple", "potato", "duck_treat"]
        res1 = count_potatoes(inv1, "potato")
        if res1 != 2:
            return {"passed": False, "msg": f"Failed: count_potatoes({inv1}, 'potato') returned {res1}, expected 2"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Zero occurrences
    try:
        inv2 = ["carrot", "bread", "water"]
        res2 = count_potatoes(inv2, "potato")
        if res2 != 0:
            return {"passed": False, "msg": f"Failed: count_potatoes({inv2}, 'potato') returned {res2}, expected 0"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: Empty list
    try:
        res3 = count_potatoes([], "potato")
        if res3 != 0:
            return {"passed": False, "msg": f"Failed: count_potatoes([], 'potato') returned {res3}, expected 0"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on empty list: {str(e)}"}

    return {"passed": True, "msg": "Inventory verified! All test cases passed."}

run_tests()
`
});
