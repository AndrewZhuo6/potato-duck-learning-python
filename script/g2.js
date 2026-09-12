window.initPreparationChapter({
    chapterNumber: 7,
    chapterTitle: "Guardian 2: Endless Doubts",
    nextChapterUrl: "g3.html",
    starterCode: `def flip(guidance):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "flip" not in globals():
        return {"passed": False, "msg": "Function 'flip' is not defined."}

    # Test Case 1: 'tfel' -> 'left'
    try:
        res1 = flip('tfel')
        if res1 != 'left':
            return {"passed": False, "msg": f"Failed: flip('tfel') returned '{res1}', expected 'left'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'tfel': {str(e)}"}

    # Test Case 2: 'thgir' -> 'right'
    try:
        res2 = flip('thgir')
        if res2 != 'right':
            return {"passed": False, "msg": f"Failed: flip('thgir') returned '{res2}', expected 'right'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'thgir': {str(e)}"}

    # Test Case 3: 'drawrof' -> 'forward'
    try:
        res3 = flip('drawrof')
        if res3 != 'forward':
            return {"passed": False, "msg": f"Failed: flip('drawrof') returned '{res3}', expected 'forward'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'drawrof': {str(e)}"}

    # Test Case 4: 'lanogaid' -> 'diagonal'
    try:
        res4 = flip('lanogaid')
        if res4 != 'diagonal':
            return {"passed": False, "msg": f"Failed: flip('lanogaid') returned '{res4}', expected 'diagonal'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'lanogaid': {str(e)}"}

    # Test Case 5: Single char & empty string
    try:
        if flip('a') != 'a':
            return {"passed": False, "msg": "Failed on single character 'a'"}
        if flip('') != '':
            return {"passed": False, "msg": "Failed on empty string"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on edge cases: {str(e)}"}

    return {"passed": True, "msg": "The magical fog clears away! Guardian 2 conquered."}

run_tests()
`
});
