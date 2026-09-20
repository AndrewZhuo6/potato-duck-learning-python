window.initPreparationChapter({
    chapterNumber: 11,
    chapterTitle: "Guardian 6: SuPrime",
    nextChapterUrl: "g7.html",
    starterCode: `def sumPrime():

    `,
    testHarness: (userCode) => `
import time

${userCode}

def run_tests():
    if "sumPrime" not in globals():
        return {"passed": False, "msg": "Function 'sumPrime' is not defined."}

    # Test Execution & Result (Primes strictly under 1000 sum to 76127)
    t0 = time.perf_counter()
    try:
        res = sumPrime()
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error in sumPrime(): {str(e)}"}
    elapsed = time.perf_counter() - t0

    EXPECTED_SUM = 76127
    if res != EXPECTED_SUM:
        return {"passed": False, "msg": f"Failed: sumPrime() returned {res}, expected {EXPECTED_SUM}"}

    # Time Efficiency constraint
    if elapsed > 1.0:
        return {"passed": False, "msg": f"Time Limit Exceeded: sumPrime() took {elapsed:.2f}s (Limit: 1.0s). Try using a sieve or optimizing your prime checks!"}

    return {"passed": True, "msg": f"The prime spell struck SuPrime with 76,127 power in {elapsed*1000:.1f}ms! Guardian 6 conquered."}

run_tests()
`
});
