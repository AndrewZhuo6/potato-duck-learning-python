/**
 * Preparation 3 Configuration: Chapter 3 - The Secret Quack Cipher
 */

window.initPreparationChapter({
    chapterNumber: 3,
    chapterTitle: "Chapter 3: The Secret Quack Cipher",
    nextChapterUrl: "preparation4.html",
    starterCode: `def decode_signal(message):
    # Strip outer spaces, lowercase, and return the reversed string
    pass
`,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "decode_signal" not in globals():
        return {"passed": False, "msg": "Function 'decode_signal' is not defined."}
    
    # Test Case 1: "TIbkCAUQ" -> "quackbit"
    try:
        res1 = decode_signal("TIbkCAUQ")
        if res1 != "quackbit":
            return {"passed": False, "msg": f"Failed: decode_signal('TIbkCAUQ') returned '{res1}', expected 'quackbit'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Strip spaces & reverse
    try:
        res2 = decode_signal("  NOHTYP  ")
        if res2 != "python":
            return {"passed": False, "msg": f"Failed: decode_signal('  NOHTYP  ') returned '{res2}', expected 'python'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: Empty string
    try:
        res3 = decode_signal("   ")
        if res3 != "":
            return {"passed": False, "msg": f"Failed: decode_signal('   ') returned '{res3}', expected ''"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    return {"passed": True, "msg": "Secret message decoded! All test cases passed."}

run_tests()
`
});
