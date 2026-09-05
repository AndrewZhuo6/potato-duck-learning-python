window.initPreparationChapter({
    chapterNumber: 4,
    chapterTitle: "Chapter 4: Duck Energy",
    nextChapterUrl: "preparation5.html",
    starterCode: `def calculate_energy(food_dict):
    # Sum and return all calorie values from food_dict
    pass
`,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "calculate_energy" not in globals():
        return {"passed": False, "msg": "Function 'calculate_energy' is not defined."}
    
    # Test Case 1: Standard meal dictionary
    try:
        meal = {"potato": 150, "corn": 100, "berries": 50}
        res1 = calculate_energy(meal)
        if res1 != 300:
            return {"passed": False, "msg": f"Failed: calculate_energy({meal}) returned {res1}, expected 300"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Empty dictionary
    try:
        res2 = calculate_energy({})
        if res2 != 0:
            return {"passed": False, "msg": f"Failed: calculate_energy({{}}) returned {res2}, expected 0"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on empty dictionary: {str(e)}"}

    # Test Case 3: Single high-calorie snack
    try:
        res3 = calculate_energy({"super_potato": 500})
        if res3 != 500:
            return {"passed": False, "msg": f"Failed: calculate_energy({{'super_potato': 500}}) returned {res3}, expected 500"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    return {"passed": True, "msg": "Energy calculated! Potato Duck is fully energized."}

run_tests()
`
});
