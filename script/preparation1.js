window.initPreparationChapter({
    chapterNumber: 1,
    chapterTitle: "Chapter 1: The Broken Gate",
    nextChapterUrl: "preparation2.html",
    starterCode: `def solve_gate(passcode):
`,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "solve_gate" not in globals():
        return {"passed": False, "msg": "Function 'solve_gate' is not defined."}
    
    # Test Case 1: Passcode 1234
    try:
        res1 = solve_gate(1234)
        if res1 != "UNLOCKED":
            return {"passed": False, "msg": f"Failed: solve_gate(1234) returned '{res1}', expected 'UNLOCKED'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 1234: {str(e)}"}

    # Test Case 2: Incorrect Passcode
    try:
        res2 = solve_gate(9999)
        if res2 != "LOCKED":
            return {"passed": False, "msg": f"Failed: solve_gate(9999) returned '{res2}', expected 'LOCKED'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 9999: {str(e)}"}

    # Test Case 3: Edge Case 0
    try:
        res3 = solve_gate(0)
        if res3 != "LOCKED":
            return {"passed": False, "msg": f"Failed: solve_gate(0) returned '{res3}', expected 'LOCKED'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 0: {str(e)}"}

    return {"passed": True, "msg": "Gate Unlocked! All test cases passed."}

run_tests()
`
});
