window.initPreparationChapter({
    chapterNumber: 5,
    chapterTitle: "Chapter 5: Your Consideration",
    nextChapterUrl: "index.html",
    starterCode: `def unlock_master_vault(team_powers, master_key):

    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "unlock_master_vault" not in globals():
        return {"passed": False, "msg": "Function 'unlock_master_vault' is not defined."}
    
    # Test Case 1: Valid power and valid key
    try:
        res1 = unlock_master_vault([30, 40, 35], "QUACK_MASTER_2026")
        if res1 is not True:
            return {"passed": False, "msg": f"Failed: unlock_master_vault([30, 40, 35], 'QUACK_MASTER_2026') returned {res1}, expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Insufficient power (60 < 100)
    try:
        res2 = unlock_master_vault([10, 20, 30], "QUACK_PASS")
        if res2 is not False:
            return {"passed": False, "msg": f"Failed: unlock_master_vault([10, 20, 30], 'QUACK_PASS') returned {res2}, expected False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: Invalid key prefix
    try:
        res3 = unlock_master_vault([50, 60], "WRONG_KEY")
        if res3 is not False:
            return {"passed": False, "msg": f"Failed: unlock_master_vault([50, 60], 'WRONG_KEY') returned {res3}, expected False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    # Test Case 4: Empty list
    try:
        res4 = unlock_master_vault([], "QUACK_KEY")
        if res4 is not False:
            return {"passed": False, "msg": f"Failed: unlock_master_vault([], 'QUACK_KEY') returned {res4}, expected False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 4: {str(e)}"}

    return {"passed": True, "msg": "Vault opened! Congratulations, you conquered all Quackbit preparation chapters!"}

run_tests()
`
});
