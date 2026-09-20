window.initPreparationChapter({
    chapterNumber: 6,
    chapterTitle: "Guardian 1: Jumping River",
    nextChapterUrl: "g2.html",
    starterCode: `def jump_or_step(stone_index):
    
    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "jump_or_step" not in globals():
        return {"passed": False, "msg": "Function 'jump_or_step' is not defined."}

    # Test Case 1: Odd number 5
    try:
        res1 = jump_or_step(5)
        if res1 != "JUMP":
            return {"passed": False, "msg": f"Failed: jump_or_step(5) returned '{res1}', expected 'JUMP'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 5: {str(e)}"}

    # Test Case 2: Even number 4
    try:
        res2 = jump_or_step(4)
        if res2 != "STEP":
            return {"passed": False, "msg": f"Failed: jump_or_step(4) returned '{res2}', expected 'STEP'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 4: {str(e)}"}

    # Test Case 3: Edge case stone 1
    try:
        res3 = jump_or_step(1)
        if res3 != "JUMP":
            return {"passed": False, "msg": f"Failed: jump_or_step(1) returned '{res3}', expected 'JUMP'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 1: {str(e)}"}

    # Test Case 4: Edge case stone 2
    try:
        res4 = jump_or_step(2)
        if res4 != "STEP":
            return {"passed": False, "msg": f"Failed: jump_or_step(2) returned '{res4}', expected 'STEP'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on input 2: {str(e)}"}

    # Test Case 5: Large numbers
    try:
        if jump_or_step(100) != "STEP":
            return {"passed": False, "msg": "Failed: jump_or_step(100) should return 'STEP'"}
        if jump_or_step(99) != "JUMP":
            return {"passed": False, "msg": "Failed: jump_or_step(99) should return 'JUMP'"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on large inputs: {str(e)}"}

    return {"passed": True, "msg": "You crossed the Jumping River safely! Guardian 1 conquered."}

run_tests()
`
});
