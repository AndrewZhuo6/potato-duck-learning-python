window.initPreparationChapter({
    chapterNumber: 15,
    chapterTitle: "Guardian 10: Fast, We're Running Out of Time!",
    nextChapterUrl: "boss.html",
    starterCode: `def findloc(curseID, matrix):
    
    `,
    testHarness: (userCode) => `
import time

${userCode}

def run_tests():
    if "findloc" not in globals():
        return {"passed": False, "msg": "Function 'findloc' is not defined."}

    # Test Case 1: 3x3 sorted matrix
    try:
        m1 = [
            [1, 5, 9],
            [14, 20, 25],
            [30, 45, 60]
        ]
        res1 = findloc(20, m1)
        if res1 != [1, 1]:
            return {"passed": False, "msg": f"Failed: findloc(20, m1) returned {res1}, expected [1, 1]"}
        
        res1_first = findloc(1, m1)
        if res1_first != [0, 0]:
            return {"passed": False, "msg": f"Failed: findloc(1, m1) returned {res1_first}, expected [0, 0]"}

        res1_last = findloc(60, m1)
        if res1_last != [2, 2]:
            return {"passed": False, "msg": f"Failed: findloc(60, m1) returned {res1_last}, expected [2, 2]"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 3x3 matrix: {str(e)}"}

    # Test Case 2: 4x4 sorted matrix
    try:
        m2 = [
            [2, 4, 8, 10],
            [12, 16, 20, 24],
            [28, 32, 36, 40],
            [44, 48, 52, 56]
        ]
        res2 = findloc(36, m2)
        if res2 != [2, 2]:
            return {"passed": False, "msg": f"Failed: findloc(36, m2) returned {res2}, expected [2, 2]"}

        res2_b = findloc(48, m2)
        if res2_b != [3, 1]:
            return {"passed": False, "msg": f"Failed: findloc(48, m2) returned {res2_b}, expected [3, 1]"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 4x4 matrix: {str(e)}"}

    # Test Case 3: 1xN and Nx1 vectors
    try:
        m_row = [[10, 20, 30, 40, 50]]
        if findloc(40, m_row) != [0, 3]:
            return {"passed": False, "msg": "Failed on 1x5 single row matrix"}

        m_col = [[5], [15], [25], [35]]
        if findloc(25, m_col) != [2, 0]:
            return {"passed": False, "msg": "Failed on 4x1 single column matrix"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 1D shaped matrix: {str(e)}"}

    # Test Case 4: Performance Test (Large sorted matrix 400x400 = 160,000 cells)
    try:
        ROWS, COLS = 400, 400
        large_matrix = [[r * COLS + c for c in range(COLS)] for r in range(ROWS)]
        target_val = 350 * COLS + 275  # Row 350, Col 275
        expected_pos = [350, 275]

        t0 = time.perf_counter()
        res_large = findloc(target_val, large_matrix)
        elapsed = time.perf_counter() - t0

        if res_large != expected_pos:
            return {"passed": False, "msg": f"Failed on large matrix: returned {res_large}, expected {expected_pos}"}

        if elapsed > 0.40:
            return {"passed": False, "msg": f"Time Limit Exceeded: Search took {elapsed:.2f}s (Limit: 0.40s). A linear scan O(M*N) is too slow! Use 2D Binary Search O(log(M*N))."}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on large matrix benchmark: {str(e)}"}

    return {"passed": True, "msg": f"Vault crystal located in {elapsed*1000:.1f}ms! You defeated the final Guardian and unlocked the path to PyThorn!"}

run_tests()
`
});
