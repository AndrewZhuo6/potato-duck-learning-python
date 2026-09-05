window.initPreparationChapter({
    chapterNumber: 1,
    chapterTitle: "Chapter 1: The Decision",
    nextChapterUrl: "preparation2.html",
    starterCode: `def decide_based_on(sign):
    
    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "decide_based_on" not in globals():
        return {"passed": False, "msg": "Function 'decide_based_on' is not defined."}
    
    # Test Case 1: sign 'shelter'
    try:
        res1 = decide_based_on('shelter')
        if res1 != "keep going":
            return {"passed": False, "msg": f"Failed: decide_based_on('shelter') returned '{res1}', expected 'keep going'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 'shelter': {str(e)}"}

    # Test Case 2: sign 'bandits'
    try:
        res2 = decide_based_on('bandits')
        if res2 != "turn back":
            return {"passed": False, "msg": f"Failed: decide_based_on('bandits') returned '{res2}', expected 'turn back'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 'bandits': {str(e)}"}

    # Test Case 3: sign 'other'
    try:
        res3 = decide_based_on('other')
        if res3 != "ask someone":
            return {"passed": False, "msg": f"Failed: decide_based_on('other') returned '{res3}', expected 'ask someone'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 'other': {str(e)}"}

    return {"passed": True, "msg": "Problem Solved! All test cases passed."}

run_tests()
`
});
