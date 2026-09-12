window.initPreparationChapter({
    chapterNumber: 4,
    chapterTitle: "Chapter 4: Existing Spell",
    nextChapterUrl: "preparation5.html",
    starterCode: `def tidy_up(inventory):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "tidy_up" not in globals():
        return {"passed": False, "msg": "Function 'tidy_up' is not defined."}
    
    # Test Case 1: Standard inventory dictionary
    try:
        inv = {"corn": 100, "berries": 50, "stone": 20, "potato": 150, "gold coin": 500}
        expected1 = {"gold coin": 500, "potato": 150, "corn": 100, "berries": 50, "stone": 20}
        res1 = tidy_up(inv)
        if res1 != expected1:
            return {"passed": False, "msg": f"Failed: tidy_up(inventory) returned {res1}, expected {expected1}"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Empty dictionary
    try:
        res2 = tidy_up({})
        if res2 != 0:
            return {"passed": False, "msg": f"Failed: tidy_up(inventory) returned {res2}, expected 0"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on empty dictionary: {str(e)}"}

    return {"passed": True, "msg": "Inventory is tidied up! Quackbit is ready for its next journey."}

run_tests()
`
});
