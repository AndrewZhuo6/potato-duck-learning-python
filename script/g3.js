window.initPreparationChapter({
    chapterNumber: 8,
    chapterTitle: "Guardian 3: 7 Floating Alphabet",
    nextChapterUrl: "g4.html",
    starterCode: `def cross_floating_alphabet(path):
    
    `,
    testHarness: (userCode) => `
${userCode}

def run_tests():
    if "cross_floating_alphabet" not in globals():
        return {"passed": False, "msg": "Function 'cross_floating_alphabet' is not defined."}

    # Test Case 1: 'potatis' (len 7, 3 vowels -> valid, returns 3)
    try:
        res1 = cross_floating_alphabet('potatis')
        if res1 != 3:
            return {"passed": False, "msg": f"Failed: cross_floating_alphabet('potatis') returned {res1}, expected 3"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'potatis': {str(e)}"}

    # Test Case 2: 'abcdefg' (len 7, 2 vowels -> valid, returns 2)
    try:
        res2 = cross_floating_alphabet('abcdefg')
        if res2 != 2:
            return {"passed": False, "msg": f"Failed: cross_floating_alphabet('abcdefg') returned {res2}, expected 2"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'abcdefg': {str(e)}"}

    # Test Case 3: 'aeiouxx' (len 7, 5 vowels > 3 -> invalid, returns -1)
    try:
        res3 = cross_floating_alphabet('aeiouxx')
        if res3 != -1:
            return {"passed": False, "msg": f"Failed: cross_floating_alphabet('aeiouxx') returned {res3}, expected -1 (too many vowels)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on 'aeiouxx': {str(e)}"}

    # Test Case 4: Invalid length < 7 ('potat')
    try:
        res4 = cross_floating_alphabet('potat')
        if res4 != -1:
            return {"passed": False, "msg": f"Failed: cross_floating_alphabet('potat') returned {res4}, expected -1 (length must be 7)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on short string: {str(e)}"}

    # Test Case 5: Invalid length > 7 ('potatiss')
    try:
        res5 = cross_floating_alphabet('potatiss')
        if res5 != -1:
            return {"passed": False, "msg": f"Failed: cross_floating_alphabet('potatiss') returned {res5}, expected -1 (length must be 7)"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on long string: {str(e)}"}

    # Test Case 6: 0 vowels ('bcdfgjk', len 7 -> valid, returns 0)
    try:
        res6 = cross_floating_alphabet('bcdfgjk')
        if res6 != 0:
            return {"passed": False, "msg": f"Failed: cross_floating_alphabet('bcdfgjk') returned {res6}, expected 0"}
    except Exception as e:
        return {"passed": False, "msg": f"Runtime error on zero vowel string: {str(e)}"}

    return {"passed": True, "msg": "You crossed the Seven Floating Alphabets safely! Guardian 3 conquered."}

run_tests()
`
});
