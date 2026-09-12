window.initPreparationChapter({
    chapterNumber: 2,
    chapterTitle: "Chapter 2: Something Redundant",
    nextChapterUrl: "v3.html",
    starterCode: `def be_careful(distance):
    
    `,
    testHarness: (userCode) => `
${userCode}

import io
from contextlib import redirect_stdout

def capture_be_careful(dist):
    buf = io.StringIO()
    with redirect_stdout(buf):
        be_careful(dist)

    # Split output into non-empty, trimmed lines
    return [line.strip() for line in buf.getvalue().splitlines() if line.strip()]

def run_tests():
    if "be_careful" not in globals():
        return {"passed": False, "msg": "Function 'be_careful' is not defined."}

    def get_expected(distance):
        # 3 'look back', then (distance - 3) 'walk'
        expected = []
        for i in range(distance):
            if i < 3:
                expected.append("look back")
            else:
                expected.append("walk")
        return expected
    
    # Test Case 1: distance 30
    try:
        res1 = capture_be_careful(30)
        expected1 = get_expected(30)
        if res1 != expected1:
            return {"passed": False, "msg": f"Failed: be_careful(30) returned {res1}, expected {expected1}"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: distance 10
    try:
        res2 = capture_be_careful(10)
        expected2 = get_expected(10)
        if res2 != expected2:
            return {"passed": False, "msg": f"Failed: be_careful(10) returned {res2}, expected {expected2}"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: distance 2
    try:
        res3 = capture_be_careful(2)
        expected3 = get_expected(2)
        if res3 != expected3:
            return {"passed": False, "msg": f"Failed: be_careful(2) returned {res3}, expected {expected3}"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    return {"passed": True, "msg": "You escaped! All test cases passed."}

run_tests()
`
});
