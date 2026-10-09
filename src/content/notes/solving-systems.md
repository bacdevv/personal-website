---
title: "Solving Systems of Equations — Linear Algebra, Chapter 6"
description: "Turn equations into matrices, then solve them with systematic row operations."
subject: Linear Algebra
date: "2026-10-09T09:06:00Z"
draft: false
tags:
  - linear-algebra
  - mathematics
  - solving-systems
---

I will start with two lines meeting on a graph and turn the same equations into a matrix problem. Gaussian elimination gives a systematic way to find a solution—or prove there is none.

## Learning goals

- Build $A\mathbf x=\mathbf b$ from equations without mixing coefficients and constants.
- Reduce a matrix with valid row operations and read pivot/free variables.
- Distinguish **one**, **infinitely many**, and **no** solutions.

## Visual intuition

![A mathematical visualization for solving systems of equations.](/images/linear-algebra/course/solving-systems.svg)

<section class="course-interactive" data-course-demo="systems" aria-label="Interactive mathematical illustration"></section>

The diagram updates independently of the Python runner. It shows one small example; the lessons below explain the general rule.

## Part A — Equations become a matrix

### 80. Systems of equations: algebra and geometry

**Main idea.** Each equation in two variables is a line. A solution to two equations is their intersection: one point, a whole line, or none.

$$
ax+by=c
$$

**Worked example.** The lines $x+y=3$ and $x-y=1$ meet at $(2,1)$. Replacing the second equation with $2x+2y=6$ gives infinitely many solutions; using $2x+2y=7$ makes the system inconsistent.

**Check yourself:** What geometric condition gives exactly one solution in 2D?

<details><summary>Answer</summary>

Two nonparallel lines intersect at one point.

</details>

### 81. Converting systems of equations to matrix equations

**Main idea.** Stack coefficients into a matrix, unknowns into a vector, and constants into another vector. This turns a system into Ax=b.

$$
A\mathbf x=\mathbf b
$$

**Worked example.** Write $2x+y=5$ and $x-y=1$ as $A=\begin{bmatrix}2&1\\1&-1\end{bmatrix}$, $x=(x,y)^T$, $b=(5,1)^T$. The matrix stores coefficients only: constants stay in $b$.

**Check yourself:** What is the shape of A for three equations with two unknowns?

<details><summary>Answer</summary>

3×2.

</details>

## Part B — Elimination, pivots and RREF

### 82. Gaussian elimination

**Main idea.** Gaussian elimination replaces rows using operations that preserve the solution set. The goal is an upper-triangular or echelon system.

$$
R_2\leftarrow R_2-2R_1
$$

**Worked example.** Start with the equations $x+y=3$ and $2x-y=3$. Apply $R_2\leftarrow R_2-2R_1$ to eliminate $x$: the new second equation is $-3y=-3$. Therefore $y=1$, then $x=2.

**Check yourself:** Does adding a multiple of one row to another change the solution set?

<details><summary>Answer</summary>

No, it is an invertible elementary row operation.

</details>

### 83. Echelon form and pivots

**Main idea.** A pivot marks a leading nonzero entry. Pivot columns identify independent directions, while free columns lead to free variables.

$$
\operatorname{rank}(A)=\text{number of pivots}
$$

**Worked example.** The matrix $\begin{bmatrix}1&2&5\\0&1&4\\0&0&0\end{bmatrix}$ has pivots in columns 1 and 2. Its rank is $2$, and column 3 is not a pivot column.

**Check yourself:** How many free variables occur in a consistent system with 4 unknowns and rank 2?

<details><summary>Answer</summary>

Two.

</details>

### 84. Reduced row echelon form

**Main idea.** RREF normalizes each pivot to one and clears entries above and below it. It makes the general solution easy to read.

$$
\operatorname{rref}\!\left(\begin{bmatrix}1&2\\2&4\end{bmatrix}\right)=\begin{bmatrix}1&2\\0&0\end{bmatrix}
$$

**Worked example.** From $\begin{bmatrix}1&2\\0&1\end{bmatrix}$, subtract twice row 2 from row 1. The RREF becomes $I_2$. A pivot column has a leading 1 and zeros elsewhere.

**Check yourself:** Is RREF unique for a given matrix?

<details><summary>Answer</summary>

Yes, although the sequence of valid row operations need not be unique.

</details>

## Part C — Solvability and matrix spaces

### 85. Code challenge: RREF of matrices with different sizes and ranks

**Main idea.** Different matrix shapes and ranks produce different numbers of pivots. Always compare the coefficient and augmented matrices to detect inconsistency.

$$
\operatorname{rank}(A)<\operatorname{rank}([A\mid b])\Rightarrow\text{no solution}
$$

**Worked example.** Compare a $2\times3$ full-row-rank matrix (two pivots) with one whose second row duplicates the first (one pivot). Add an inconsistent right-hand side to see a pivot appear only in the augmented column.

**Code challenge — test the claim.** Predict the result, then run this independently.

```python
import numpy as np

def rref(A, eps=1e-10):
    M = np.array(A, dtype=float).copy()
    lead = 0
    for row in range(M.shape[0]):
        while lead < M.shape[1] and not np.any(np.abs(M[row:, lead]) > eps):
            lead += 1
        if lead == M.shape[1]: break
        pivot = row + np.argmax(np.abs(M[row:, lead]))
        M[[row, pivot]] = M[[pivot, row]]
        M[row] /= M[row, lead]
        for r in range(M.shape[0]):
            if r != row: M[r] -= M[r, lead] * M[row]
        lead += 1
    M[np.abs(M) < eps] = 0
    return M

for A in [[[1, 2], [2, 4]], [[1, 0, 3], [0, 1, 4]]]:
    print(rref(A))
```

**Check yourself:** How do we recognize an inconsistent augmented row?

<details><summary>Answer</summary>

A row [0 … 0 | nonzero].

</details>

### 86. Matrix spaces after row reduction

**Main idea.** Row reduction preserves the row space and null space, but generally changes the column space. Pivot positions point back to basis columns of the original matrix.

$$
\operatorname{Null}(A)=\operatorname{Null}(\operatorname{rref}(A))
$$

**Worked example.** Row operations preserve $Ax=0$ because they multiply $A$ on the left by an invertible matrix. They can change actual column vectors and hence change the column space in the original coordinates.

**Check yourself:** Where do basis columns for Col(A) come from after elimination?

<details><summary>Answer</summary>

Use the pivot column indices, but take the columns from the original A.

</details>

## Detailed worked example

## Three possible outcomes of a linear system

For two equations in two unknowns, picture each equation as a line.

1. **Unique solution:** the two lines intersect at one point, and $\operatorname{rank}(A)=2$.
2. **Infinitely many solutions:** the lines coincide; the system is consistent but has a free variable.
3. **No solution:** the lines are parallel and distinct. The augmented matrix has a larger rank than the coefficient matrix.

For the equations $x+y=3$ and $2x+2y=7$, subtract twice the first equation from the second. The result is $0=1$, which immediately proves inconsistency.

## From Gaussian elimination to solution formulas

An elementary row operation corresponds to swapping equations, multiplying an equation by a nonzero number, or adding a multiple of one equation to another. None changes the solution set. In RREF, every pivot is $1$ with zeros elsewhere in its column. Variables without pivots can be free, provided the system is consistent.

For $A\in\mathbb R^{m\times n}$, compare $\operatorname{rank}(A)$ with $\operatorname{rank}([A\,\,b])$. If they differ, there is no solution. If equal to $n$, a consistent system has a unique solution; if less than $n$, it has infinitely many solutions over real numbers.


## Verify the calculations with Python

The numerical examples use NumPy. Each block is self-contained so you can run it independently. If a library is still loading in the website runner, try the same code in Jupyter or Colab.

```python
import numpy as np
A = np.array([[1., 1.], [1., -1.]])
b = np.array([3., 1.])
x = np.linalg.solve(A, b)
print("solution:", x)                 # [2., 1.]
print("residual:", A @ x - b)         # nearly zero
bad = np.array([[1., 1.], [2., 2.]])
bad_b = np.array([3., 7.])
print("rank(A):", np.linalg.matrix_rank(bad))
print("rank([A b]):", np.linalg.matrix_rank(np.column_stack([bad, bad_b])))
```

## Practice questions

I recommend answering these questions before opening the solutions. A small calculation is more useful than memorizing a long definition.

1. What does a row [0 0 0 | 5] mean?
2. Does one pivot per row guarantee unique x when n>m?
3. Which matrix rank decides whether Ax=b has a solution?

### Answers

1. Inconsistency, because it requires 0=5.
2. No, there can still be free variables.
3. Compare rank(A) and rank([A b]).

## Common mistakes

- An equation describing a line need not pass through the origin; it is not automatically a subspace.
- Row operations change matrix entries, not the solution set.
- Do not use np.linalg.solve for a non-square matrix.

## What I want you to remember

Elimination reveals pivot variables and consistency. The number of pivots alone cannot establish consistency: check the augmented system too.
