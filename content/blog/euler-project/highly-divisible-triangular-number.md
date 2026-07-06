---
title: Euler 12 — Highly Divisible Triangular Number
date: 2026-07-05
---

First post in this folder: I've been working through [Project Euler](https://projecteuler.net) problems, and I want to write up the ones where the obvious solution isn't the right one. [Problem 12](https://projecteuler.net/problem=12) is a good place to start.

## The problem

Triangle numbers are what you get by summing the natural numbers: the 7th triangle number is 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28. The question: **what is the first triangle number with more than five hundred divisors?**

## The naive approach, and why it hurts

The nth triangle number is `T(n) = n * (n + 1) // 2` (one of `n`, `n + 1` is always even, so the division is exact). The direct approach is to walk up `n`, factor each `T(n)`, and stop when the divisor count passes 500.

The catch is that `T(n)` grows quadratically in `n`. Trial-division factoring costs roughly the square root of the number you're factoring, so factoring `T(n)` costs on the order of `n` — and you're doing that for every step. It adds up fast.

## Splitting into coprime factors

The trick is to never factor `T(n)` at all. Split it into two pieces, with one of them absorbing the `/2`:

- `n` even: `a = n // 2`, `b = n + 1`
- `n` odd: `a = n`, `b = (n + 1) // 2`

These are consecutive-ish numbers, so `gcd(a, b) = 1`. And the divisor-count function `d` is multiplicative over coprime factors:

```
d(T(n)) = d(a) * d(b)
```

Now we only ever factor numbers of size ~`n` instead of ~`n²`. That's the whole speedup.

## Bonus: consecutive steps share work

There's a second, smaller win hiding in the split: the `b` at step `n` shows up again as the `a` at step `n + 1` when `n` is even. Without doing anything, we'd factor the same number twice across consecutive iterations. A cache of divisor counts keyed by value makes each factorization happen once.

## The code

```python
def get_divisor_count(n, cache):
    if n in cache:
        return cache[n]

    remaining = n
    curr_factor = 2
    divisor_count = 1

    while remaining != 1:
        if remaining % curr_factor == 0:
            exponent = 0
            while remaining % curr_factor == 0:
                remaining //= curr_factor
                exponent += 1
            divisor_count *= exponent + 1
        else:
            curr_factor += 1 if curr_factor == 2 else 2

    cache[n] = divisor_count
    return divisor_count


def solve(limit=500):
    cache = {}
    n = 1

    while True:
        if n % 2 == 0:
            a, b = n // 2, n + 1
        else:
            a, b = n, (n + 1) // 2

        divisors = get_divisor_count(a, cache) * get_divisor_count(b, cache)

        if divisors > limit:
            return a * b

        n += 1
```

The divisor counting itself is standard: factor with trial division, and for a prime factorization `p1^e1 * p2^e2 * ...` the divisor count is `(e1 + 1) * (e2 + 1) * ...`, since a divisor picks each prime's exponent independently.

## Result

The answer is **76576500**, and it lands in about 0.4 seconds on my machine — with `d(76576500) = 576` divisors, the first to break 500.
