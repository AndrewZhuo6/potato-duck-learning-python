window.initPreparationChapter({
    chapterNumber: 5,
    chapterTitle: "Chapter 5: Your Consideration",
    nextChapterUrl: "g1.html",
    starterCode: `def fuse_mana_crystals(crystals, target_power):
    
    `,
    testHarness: (userCode) => `
import time
import tracemalloc

${userCode}

def run_tests():
    if "fuse_mana_crystals" not in globals():
        return {"passed": False, "msg": "Function 'fuse_mana_crystals' is not defined."}
    
    # Test Case 1: Standard valid pair
    try:
        res1 = fuse_mana_crystals([10, 15, 3, 7], 17)
        if res1 is not True:
            return {"passed": False, "msg": f"Failed: fuse_mana_crystals([10, 15, 3, 7], 17) returned {res1}, expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 1: {str(e)}"}

    # Test Case 2: Impossible target
    try:
        res2 = fuse_mana_crystals([10, 15, 3, 7], 20)
        if res2 is not False:
            return {"passed": False, "msg": f"Failed: fuse_mana_crystals([10, 15, 3, 7], 20) returned {res2}, expected False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 2: {str(e)}"}

    # Test Case 3: Cannot reuse the same single crystal element
    try:
        res3 = fuse_mana_crystals([5, 3, 9], 10)
        if res3 is not False:
            return {"passed": False, "msg": f"Failed: fuse_mana_crystals([5, 3, 9], 10) returned {res3}, expected False (cannot use crystal '5' twice)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 3: {str(e)}"}

    # Test Case 4: Two distinct crystals with the same power value
    try:
        res4 = fuse_mana_crystals([5, 5, 9], 10)
        if res4 is not True:
            return {"passed": False, "msg": f"Failed: fuse_mana_crystals([5, 5, 9], 10) returned {res4}, expected True (two separate crystals of power 5)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on test 4: {str(e)}"}

    # Test Case 5: Empty list and single element
    try:
        if fuse_mana_crystals([], 10) is not False or fuse_mana_crystals([10], 10) is not False:
            return {"passed": False, "msg": "Failed: Empty list or single crystal cannot form a pair and must return False"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on empty/single crystal test: {str(e)}"}

    # Test Case 6: Negative powers and zero
    try:
        res6 = fuse_mana_crystals([-8, 12, 0, 5], -3)
        if res6 is not True:
            return {"passed": False, "msg": f"Failed: fuse_mana_crystals([-8, 12, 0, 5], -3) returned {res6}, expected True (-8 + 5 = -3)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on negative values test: {str(e)}"}

    # Test Case 7: Large-scale Time Limit & Mana (Memory) Benchmark
    large_crystals = list(range(0, 12000, 2))  # 6,000 even numbers, worst-case traversal
    target_unachievable = 99999               # odd target impossible with evens
    
    TIME_LIMIT = 0.50       # seconds
    MEMORY_LIMIT_MB = 3.5   # MB

    tracemalloc.start()
    t0 = time.perf_counter()
    try:
        res_perf = fuse_mana_crystals(large_crystals, target_unachievable)
    except Exception as e:
        tracemalloc.stop()
        return {"passed": False, "msg": f"Runtime error on large scale benchmark: {str(e)}"}
    finally:
        elapsed = time.perf_counter() - t0
        _, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

    peak_mb = peak / (1024 * 1024)

    if res_perf is not False:
        return {"passed": False, "msg": f"Failed: large scale test returned {res_perf}, expected False"}

    if peak_mb > MEMORY_LIMIT_MB:
        return {
            "passed": False,
            "msg": f"💥 Mana Limit Exceeded! Your spell consumed {peak_mb:.2f} MB of mana (Limit: {MEMORY_LIMIT_MB:.1f} MB). Allocating massive combinations or tables overloads your duck body! Store only what you have seen so far."
        }

    if elapsed > TIME_LIMIT:
        return {
            "passed": False,
            "msg": f"⏳ Time Limit Exceeded! Your spell took {elapsed:.2f}s (Limit: {TIME_LIMIT:.2f}s). An O(N²) quadratic approach (nested loops or 'x in list') takes too long! Can you optimize it to O(N) using a set?"
        }

    # Test Case 8: Large scale with valid pair at the end
    try:
        large_crystals_match = list(range(0, 12000, 2)) + [10001]
        res_match = fuse_mana_crystals(large_crystals_match, 10001)  # 0 + 10001 = 10001
        if res_match is not True:
            return {"passed": False, "msg": "Failed on large scale dataset with valid pair: expected True"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on large scale match test: {str(e)}"}

    return {
        "passed": True,
        "msg": f"🎉 Legendary Spellcraft! Your spell ran in {elapsed*1000:.1f}ms and consumed only {peak_mb:.2f} MB of mana. You mastered time and memory efficiency and conquered all Quackbit preparation chapters!"
    }

run_tests()
`
});
