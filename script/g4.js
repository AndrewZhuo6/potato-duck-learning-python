window.initPreparationChapter({
    chapterNumber: 9,
    chapterTitle: "Guardian 4: Fuzzy Talking Wall",
    nextChapterUrl: "g5.html",
    starterCode: `def analyze(word):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "analyze" not in globals():
        return {"passed": False, "msg": "Function 'analyze' is not defined."}

    # Test Case 1: '#S@t1a2r3t#' -> 'start'
    try:
        res1 = analyze('#S@t1a2r3t#')
        if res1 != 'start':
            return {"passed": False, "msg": f"Failed: analyze('#S@t1a2r3t#') returned '{res1}', expected 'start'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: 'QUACK!_123' -> 'quack'
    try:
        res2 = analyze('QUACK!_123')
        if res2 != 'quack':
            return {"passed": False, "msg": f"Failed: analyze('QUACK!_123') returned '{res2}', expected 'quack'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: '12345' -> ''
    try:
        res3 = analyze('12345')
        if res3 != '':
            return {"passed": False, "msg": f"Failed: analyze('12345') returned '{res3}', expected empty string ''"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on numeric string: {str(e)}"}

    # Test Case 4: 'H-E-L-L-O' -> 'hello'
    try:
        res4 = analyze('H-E-L-L-O')
        if res4 != 'hello':
            return {"passed": False, "msg": f"Failed: analyze('H-E-L-L-O') returned '{res4}', expected 'hello'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 4: {str(e)}"}

    # Test Case 5: '$$$Python%%%' -> 'python'
    try:
        res5 = analyze('$$$Python%%%')
        if res5 != 'python':
            return {"passed": False, "msg": f"Failed: analyze('$$$Python%%%') returned '{res5}', expected 'python'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 5: {str(e)}"}

    return {"passed": True, "msg": "The wall recognized the true word and opened! Guardian 4 conquered."}

run_tests()
`
});
