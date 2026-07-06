---
title: Euler 12 — Highly Divisible Triangular Number
date: 2026-07-05
---
Hello, world.

This is my first post in this folder, and my first ever blog post in general. I will probably post about more "systems"-relevant work, but I bumped into Project Euler this weekend (again — I remember bumping into it during undergrad) and thought it was interesting.

I ended up solving the first 12 problems. I thought problem #12 was a good place to start my blog, mainly because it took me back to simple arithmetic, which I enjoyed. I hope what's below is relevant, although it might not be inherently valuable in an age where an LLM can probably one-shot this problem with ease. Still, all the code for the problem is handwritten, apart from formatting the docstring in the code after the first go. Here is my shot at a first blog post — potentially low effort compared to the future ones I'm planning, which I hope will each be more educational.

## The problem

Triangle numbers are what you get by summing the natural numbers: the 7th triangle number is 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28. So T(7) = 28 (and I will use this notation for the rest of the post). The question at hand: **what is the first triangle number with more than five hundred divisors?**

## The naive approach

The nth triangle number is `T(n) = n * (n + 1) // 2` (one of `n`, `n + 1` is always even, so the division is exact). The direct approach is to walk up `n`, factor each `T(n)`, and stop when the divisor count passes 500.

The catch is that `T(n)` grows quadratically in `n`. Trial-division factoring costs roughly the square root of the number you're factoring, so factoring `T(n)` costs on the order of `n` — and you're doing that for every step. It adds up.

## Splitting into coprime factors

The trick is to never factor `T(n)` at all. Split it into two pieces, with one of them absorbing the `/2`:

- `n` even: `a = n // 2`, `b = n + 1`
- `n` odd: `a = n`, `b = (n + 1) // 2`

These are consecutive-ish numbers, so `gcd(a, b) = 1`. And the divisor-count function `d` is multiplicative over coprime factors:

```
d(T(n)) = d(a) * d(b)
```

Why is this the case? One important thing to realise first is how to calculate `d(m)`, the total number of divisors of `m`: find the prime factorization, add 1 to each prime's exponent, and multiply those together. The reason is that a unique divisor can use anywhere from zero up to the full count of each prime factor — the extra 1 covers the zero case. An example with 120 (not a T(n), but the same rule applies):

```
120 = (2**3) * (3**1) * (5**1)
d(120) = (3+1) * (1+1) * (1+1) = 16
```

Again, we add 1 for the case where a divisor skips a prime entirely (3 * 5 = 15 is a divisor of 120 that does not use 2). And because `a` and `b` share no prime factors, their prime factorizations stack side by side, so the divisor counts simply multiply: `d(a * b) = d(a) * d(b)`.

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

The divisor counting in `get_divisor_count` is exactly the scheme above: trial division to get each prime's exponent, then multiply the `(exponent + 1)`s together.

## Result

The answer is **76576500**, and it lands in about 0.4 seconds on my machine — with `d(76576500) = 576` divisors, the first to break 500.
