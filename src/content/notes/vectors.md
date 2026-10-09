---
title: "Vectors — Linear Algebra, Chapter 1"
description: "A friendly guide to vectors: shapes, operations, dot products, angles, unit vectors, complex vectors, subspaces, span, independence, and basis."
subject: Linear Algebra
date: "2026-10-09T07:00:00Z"
draft: false
tags:
  - linear-algebra
  - vectors
  - mathematics
---

**About this chapter.** These notes follow all 24 lessons (7–30) in the provided *Vectors* transcript. They keep the main ideas and code challenges, but use shorter, simpler English. Math is written in LaTeX. This is the **Vectors** chapter of an expanding Linear Algebra notebook; later chapters can be added as separate notes.

You do **not** need advanced math to start. Think of a vector as a short list of numbers, or as an arrow. We will use the same small examples again and again.

## What you will learn

1. What vectors mean as lists of numbers and as arrows.
2. How to add, subtract, scale, and multiply vectors.
3. How the dot product tells us about length and angles.
4. How to work with unit vectors and complex-valued vectors.
5. How vectors build lines, planes, subspaces, spans, and bases.

**Notation:** Bold lowercase letters such as $\mathbf{v}$ mean vectors. Normal letters such as $c$ or $\lambda$ mean single numbers (*scalars*). $\mathbf{A}$ often means a matrix (a table of numbers).

---

## Start here: a 2-minute visual example

Use the live coordinate graph above. Change the x and y values, and watch the three arrows move. Numbers on the axes show exactly how far each arrow goes.

**First example:** Set a = (2, 1) and b = (1, 2). Add the x values and y values: a + b = (3, 3). The green arrow ends at (3, 3).

**Quick practice:**

1. Set a = (1, 0) and b = (0, 2). Where does the green arrow end? **Answer:** (1, 2).
2. Set a = (2, 1) and b = (2, 0). What is a · b? **Answer:** 2×2 + 1×0 = 4.
3. Set a = (-1, 2) and b = (1, -2). What is their sum? **Answer:** (0, 0), the zero vector.

## Part A — Meet the vector

### 7. Vectors: a list of numbers and an arrow

**As numbers**, a vector is an **ordered list**. Each number is an *element* or *component*:

$$
\mathbf{v}=\begin{bmatrix}2\\-1\\4\end{bmatrix}.
$$

This vector has **three elements**, so it is a *3D vector*. Order matters: $[2,-1,4]$ and $[-1,2,4]$ are not the same vector. A vector may contain integers, fractions, real numbers, or complex numbers. The transcript briefly mentions vectors of functions, but this chapter focuses on numerical vectors.

**As an arrow**, a 2D vector $\mathbf{v}=[3,2]^T$ means *move 3 units right and 2 units up*. A vector has **length and direction**. If you move the whole arrow to another place without rotating or resizing it, it is still the same vector.

- The start of the arrow is the **tail**; the end is the **head**.
- Starting the arrow at $(0,0)$ is called its **standard position**.
- A **point** tells you *where* something is. A **vector** tells you *how far and which way* to move. A vector from the origin can end at a point with the same coordinates, but the ideas are different.

A **column vector** stands vertically and has shape $n\times1$. A **row vector** lies horizontally and has shape $1\times n$:

$$
\mathbf{v}=\begin{bmatrix}3\\2\end{bmatrix},\qquad
\mathbf{v}^{T}=\begin{bmatrix}3&2\end{bmatrix}.
$$

The $T$ means **transpose**: turn rows into columns, or columns into rows. Beyond three dimensions, we usually stop trying to draw the arrow and work with its numbers instead.

**Python example — make and inspect a vector:**

```python
v = [3, 2]
print("Vector:", v)
print("Number of elements:", len(v))
print("Start: (0, 0)")
print("End:", tuple(v))
```

**Drawing the arrow:** In a graph, a 2D vector $[x,y]^T$ runs from $(0,0)$ to $(x,y)$. In Python with Matplotlib, the basic idea is `plt.plot([0, x], [0, y])`; for a 3D vector, give start/end coordinates to a 3D plotting tool. The transcript demonstrates both 2D and 3D plotting in MATLAB and Python. Plotting libraries are optional; you do not need them for the calculations here.

**A small Python shape detail:** A plain list does not have `.T`. And a one-dimensional NumPy array remains 1D after `.T`; use `reshape(-1, 1)` when you actually need a column with shape $n\times1$.

**Remember:** A vector is more than a point. Its components describe a movement when drawn from the origin.

### 8. Adding and subtracting vectors

To add or subtract vectors, work with the **matching positions**:

$$
\begin{aligned}
\mathbf{a}&=\begin{bmatrix}2\\3\end{bmatrix},&
\mathbf{b}&=\begin{bmatrix}4\\-1\end{bmatrix},\\
\mathbf{a}+\mathbf{b}&=\begin{bmatrix}6\\2\end{bmatrix},&
\mathbf{a}-\mathbf{b}&=\begin{bmatrix}-2\\4\end{bmatrix}.
\end{aligned}
$$

**Geometric idea:** For addition, put the tail of $\mathbf{b}$ at the head of $\mathbf{a}$. The arrow from the first tail to the final head is $\mathbf{a}+\mathbf{b}$. For subtraction, add the opposite arrow $-\mathbf{b}$; or draw an arrow from the head of $\mathbf{b}$ to the head of $\mathbf{a}$ when both start at the origin.

**Rule:** In ordinary vector addition, both vectors must have the **same number of elements**.

```python
a = [2, 3]
b = [4, -1]
add = [x + y for x, y in zip(a, b)]
subtract = [x - y for x, y in zip(a, b)]
print("a + b =", add)
print("a - b =", subtract)
```

**Python trap:** For plain Python lists, `a + b` *joins* the lists; it does not add matching numbers. NumPy arrays support numerical vector addition, but the examples here use basic Python so they can run directly in the blog.

### 9. Scaling a vector with one number

A **scalar** is one number. Multiply every component by it:

$$
\lambda\mathbf{v}=\lambda\begin{bmatrix}2\\-3\end{bmatrix}
=\begin{bmatrix}2\lambda\\-3\lambda\end{bmatrix}.
$$

What happens to the arrow?

| Scalar $\lambda$ | What happens? |
|---|---|
| $\lambda>1$ | Longer, same direction |
| $0<\lambda<1$ | Shorter, same direction |
| $\lambda=1$ | No change |
| $\lambda=0$ | Zero vector (no direction) |
| $\lambda<0$ | Points the opposite way; length scales by $\lvert\lambda\rvert$ |

For example, $-\tfrac12[4,2]^T=[-2,-1]^T$: half as long, pointing the other way. All scalar multiples of a nonzero vector stay on the **same straight line through the origin**. This is the first hint of a *subspace*.

```python
v = [4, 2]
scale = -0.5
print([scale * x for x in v])  # [-2.0, -1.0]
```

**Remember:** Scaling changes a vector's length; a negative scale also reverses its orientation. Later, this idea helps us understand eigenvectors.

---

## Part B — Four ways vectors can multiply

### 10. Dot product: turn two vectors into one number

The **dot product** multiplies matching components and then **adds** them:

$$
\boxed{\mathbf{a}\cdot\mathbf{b}=\sum_{i=1}^{n}a_i b_i}
$$

Example:

$$
[1,2,3]\cdot[4,-1,2]
=(1)(4)+(2)(-1)+(3)(2)=8.
$$

The answer is **one number**, not a vector. We may also write $\mathbf{a}^T\mathbf{b}$ when $\mathbf{a}$ and $\mathbf{b}$ are column vectors. They must have the **same number of components**.

```python
a = [1, 2, 3]
b = [4, -1, 2]
dot = sum(x * y for x, y in zip(a, b))
print(dot)  # 8
```

**Why care?** Dot products appear in data analysis, similarities, projections, and many algorithms. We will discover their geometric meaning after learning vector length.

### 11. Properties of the dot product

Three words appear often:

- **Distributive** means we can split over addition:

$$
\mathbf{a}\cdot(\mathbf{b}+\mathbf{c})
=\mathbf{a}\cdot\mathbf{b}+\mathbf{a}\cdot\mathbf{c}.
$$

- **Commutative** means swapping the vectors keeps the answer:

$$
\mathbf{a}\cdot\mathbf{b}=\mathbf{b}\cdot\mathbf{a}
\qquad\text{(real vectors).}
$$

- **Not associative like ordinary multiplication:** A dot product gives a *number*, not another vector. A double dot product such as $(\mathbf{a}\cdot\mathbf{b})\cdot\mathbf{c}$ is not a standard dot product. We *can* multiply that number by a vector, but in general

$$
(\mathbf{a}\cdot\mathbf{b})\mathbf{c}
\ne\mathbf{a}(\mathbf{b}\cdot\mathbf{c}).
$$

For example, with $\mathbf{a}=[1,0]^T$, $\mathbf{b}=[1,1]^T$, and $\mathbf{c}=[0,1]^T$, the left side is $[0,1]^T$ and the right side is $[1,0]^T$.

**Remember:** Distribute and swap dot-product inputs, but do not freely move parentheses around several dot products.

### 12. Code challenge: dot products of matching matrix columns

A **matrix** is a table of numbers. Each column can be viewed as a vector. If two matrices $\mathbf{A},\mathbf{B}\in\mathbb{R}^{4\times6}$ both have four rows and six columns, compute one dot product for each pair of matching columns:

$$
d_j=\mathbf{A}_{:,j}\cdot\mathbf{B}_{:,j},\qquad j=1,\dots,6.
$$

You get **six numbers** in the result vector $\mathbf{d}$. In this notation, $:$ means *all rows*, and $j$ means *column number $j$*.

**Try it:** Change `rows` or `cols`. Does the result still have one number per column?

```python
import random
random.seed(4)
rows, cols = 4, 6
A = [[random.randint(-3, 3) for _ in range(cols)] for _ in range(rows)]
B = [[random.randint(-3, 3) for _ in range(cols)] for _ in range(rows)]
column_dots = []
for j in range(cols):
    value = sum(A[i][j] * B[i][j] for i in range(rows))
    column_dots.append(value)
print("Column dot products:", column_dots)
print("Number of results:", len(column_dots))
```

### 13. Code challenge: can we swap dot-product inputs?

Compute both $\mathbf{a}\cdot\mathbf{b}$ and $\mathbf{b}\cdot\mathbf{a}$ for two long vectors. They should match. That is the **commutative property** for the ordinary real dot product.

```python
import random
random.seed(13)
a = [random.randint(-5, 5) for _ in range(100)]
b = [random.randint(-5, 5) for _ in range(100)]
ab = sum(x * y for x, y in zip(a, b))
ba = sum(y * x for x, y in zip(a, b))
print("a · b:", ab)
print("b · a:", ba)
print("Equal?", ab == ba)
```

**Small lesson about experiments:** Code can give strong examples and find counterexamples, but a few trials are **not a mathematical proof**. The reason this always works for real vectors is that ordinary number multiplication is commutative: $a_i b_i=b_i a_i$.

---

## Part C — Length, angles, and unit vectors

### 14. Vector length (norm)

A vector's **length**, also called its **magnitude** or **norm**, is its distance from tail to head:

$$
\boxed{\lVert\mathbf{v}\rVert=\sqrt{v_1^2+v_2^2+\cdots+v_n^2}
=\sqrt{\mathbf{v}\cdot\mathbf{v}}.}
$$

For $\mathbf{v}=[3,4]^T$, the length is $\sqrt{3^2+4^2}=5$. This is the **Pythagorean theorem** in vector form. The rule works in 2D, 3D, and higher dimensions.

```python
import math
v = [3, 4]
length = math.sqrt(sum(x * x for x in v))
print(length)  # 5.0
```

**Do not confuse:** `len(v)` counts components (here, 2); the vector's *mathematical length* is 5.

### 15. Dot product geometry: signs, angles, and right angles

Here is the connection between numbers and arrows:

$$
\boxed{\mathbf{a}\cdot\mathbf{b}
=\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\cos\theta.}
$$

$\theta$ is the angle **between two nonzero vectors**. Since $\cos\theta$ runs from $-1$ to $1$:

| Dot product | Angle | Simple meaning |
|---|---|---|
| Positive | Smaller than $90^\circ$ | They point roughly the same way |
| Zero | Exactly $90^\circ$ | They are **orthogonal** (perpendicular) |
| Negative | Greater than $90^\circ$ | They point partly against each other |
| Largest possible positive value | $0^\circ$ | Same direction |
| Most negative possible value | $180^\circ$ | Opposite directions |

You can also solve for the angle:

$$
\theta=\arccos\!\left(
\frac{\mathbf{a}\cdot\mathbf{b}}
{\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert}
\right).
$$

**Example:** $[1,0]^T\cdot[0,1]^T=0$. The arrows meet at $90^\circ$.

**Why do the two dot-product formulas agree?** The *law of cosines* says that the squared distance between arrow tips is

$$
\lVert\mathbf{a}-\mathbf{b}\rVert^2
=\lVert\mathbf{a}\rVert^2+\lVert\mathbf{b}\rVert^2
-2\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\cos\theta.
$$

Expanding the same left side using dot products gives

$$
\lVert\mathbf{a}-\mathbf{b}\rVert^2
=\lVert\mathbf{a}\rVert^2+\lVert\mathbf{b}\rVert^2
-2\mathbf{a}\cdot\mathbf{b}.
$$

The two expressions describe the same distance, so the dot-product formula follows. This is a key bridge between **algebra and geometry**.

```python
import math
a = [1, 0]
b = [0, 1]
dot = sum(x * y for x, y in zip(a, b))
na = math.sqrt(sum(x*x for x in a))
nb = math.sqrt(sum(x*x for x in b))
cos_theta = dot / (na * nb)
angle_degrees = math.degrees(math.acos(max(-1, min(1, cos_theta))))
print("Dot product:", dot)
print("Angle (degrees):", angle_degrees)
```

**Important:** If either vector is zero, the angle formula cannot be used because it divides by zero. In numerical code, clamp the cosine to $[-1,1]$ before `acos` to guard against tiny rounding errors.

### 16. Code challenge: the Cauchy–Schwarz inequality

This name sounds hard, but it tells us a simple limit: the dot product cannot be bigger in absolute value than the product of the two lengths.

$$
\boxed{\left|\mathbf{a}\cdot\mathbf{b}\right|
\le\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert.}
$$

**Why?** From the angle formula, the left side is $\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert|\cos\theta|$, and $|\cos\theta|\le1$.

- **Equality** holds when one vector is a scalar multiple of the other (including the zero-vector case).
- **Strictly less** holds when two nonzero vectors are not along the same line.

```python
import math
a = [1, 2, 3]
b = [2, -1, 4]
left = abs(sum(x*y for x, y in zip(a, b)))
right = math.sqrt(sum(x*x for x in a)) * math.sqrt(sum(x*x for x in b))
print("|a · b| =", left)
print("|a| |b| =", round(right, 4))
print("Inequality holds:", left <= right + 1e-12)
```

**Try:** Change `b` to `[2, 4, 6]`. The two sides will match because $\mathbf{b}=2\mathbf{a}$.

### 17. Code challenge: what happens to the dot-product sign after scaling?

If we scale $\mathbf{a}$ by $s$ and $\mathbf{b}$ by $t$, then

$$
(s\mathbf{a})\cdot(t\mathbf{b})
=st(\mathbf{a}\cdot\mathbf{b}).
$$

That gives three cases:

- $st>0$: the **sign stays the same** (unless the dot product was already zero).
- $st<0$: the **sign flips**.
- $st=0$: the new dot product is **zero**.

**And if the original vectors are orthogonal?** Their dot product is zero, and scaling them cannot change that: $st\times0=0$.

```python
a = [1, 2]
b = [2, 1]
s, t = -2, 3
original = sum(x*y for x, y in zip(a, b))
scaled = sum((s*x)*(t*y) for x, y in zip(a, b))
print("Original:", original)
print("Scaled:", scaled)
print("Expected:", s*t*original)
```

### 18. Hadamard product: multiply element by element

The **Hadamard product** (also called *element-wise multiplication*) multiplies matching components **without summing**:

$$
\begin{bmatrix}2\\3\\4\end{bmatrix}
\odot\begin{bmatrix}5\\-1\\2\end{bmatrix}
=\begin{bmatrix}10\\-3\\8\end{bmatrix}.
$$

Unlike the dot product, the answer is still a **vector of the same size**.

```python
a = [2, 3, 4]
b = [5, -1, 2]
print([x * y for x, y in zip(a, b)])  # [10, -3, 8]
```

When using NumPy, `a * b` (for same-shaped arrays) gives element-wise multiplication; `np.dot(a, b)` gives a dot product for 1D arrays. In MATLAB, element-wise multiplication uses `.*`.

### 19. Outer product: turn two vectors into a matrix

The **outer product** creates a *table* of every pairwise multiplication. For column vectors $\mathbf{a}\in\mathbb{R}^m$ and $\mathbf{b}\in\mathbb{R}^n$:

$$
\mathbf{a}\mathbf{b}^T
=\begin{bmatrix}a_1b_1 & \cdots & a_1b_n\\
\vdots&\ddots&\vdots\\
a_mb_1&\cdots&a_mb_n\end{bmatrix}
\in\mathbb{R}^{m\times n}.
$$

Example:

$$
\begin{bmatrix}1\\2\end{bmatrix}
\begin{bmatrix}3&4&5\end{bmatrix}
=\begin{bmatrix}3&4&5\\6&8&10\end{bmatrix}.
$$

Unlike the dot product, the input vectors **can have different numbers of elements**. The output matrix has **2 rows and 3 columns** here.

```python
a = [1, 2]
b = [3, 4, 5]
outer = [[x*y for y in b] for x in a]
for row in outer:
    print(row)
```

Think about the result in either of two ways: each **row** is a scaled copy of $\mathbf{b}^T$, or each **column** is a scaled copy of $\mathbf{a}$.

### 20. Cross product: a vector at right angles

For ordinary **3D vectors**, the cross product $\mathbf{a}\times\mathbf{b}$ gives **another 3D vector**. Its direction is perpendicular to both input vectors, following the **right-hand rule**.

$$
\mathbf{a}\times\mathbf{b}
=\begin{bmatrix}
a_2b_3-a_3b_2\\
a_3b_1-a_1b_3\\
a_1b_2-a_2b_1
\end{bmatrix}.
$$

Its length is related to the angle:

$$
\lVert\mathbf{a}\times\mathbf{b}\rVert
=\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\sin\theta.
$$

This is also the **area of the parallelogram** formed by the two arrows.

For the unit x- and y-axis vectors, $[1,0,0]^T\times[0,1,0]^T=[0,0,1]^T$.

```python
a = [1, 0, 0]
b = [0, 1, 0]
cross = [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0],
]
print(cross)  # [0, 0, 1]
```

**Remember:** Reversing the order reverses the direction: $\mathbf{b}\times\mathbf{a}=-(\mathbf{a}\times\mathbf{b})$.

### Compare the four vector products

| Operation | Input size | Output | Main action |
|---|---|---|---|
| Dot, $\mathbf{a}\cdot\mathbf{b}$ | Same length | One number | Multiply pairs, then add |
| Hadamard, $\mathbf{a}\odot\mathbf{b}$ | Same length | Vector | Multiply pairs only |
| Outer, $\mathbf{a}\mathbf{b}^T$ | May differ | Matrix | Multiply every pair |
| Cross, $\mathbf{a}\times\mathbf{b}$ | 3D here | 3D vector | Perpendicular vector |

---

## Part D — Complex vectors and normalization

### 21. Vectors can contain complex numbers

A **complex number** has a real part and an imaginary part:

$$
z=a+bi,\qquad i^2=-1.
$$

For example, $z=2+3i$ is **one number** with two parts, not two separate vector elements. A complex vector may look like

$$
\mathbf{z}=\begin{bmatrix}2+3i\\1-i\end{bmatrix}.
$$

Multiplication uses the usual brackets rule plus $i^2=-1$:

$$
(a+bi)(c+di)=(ac-bd)+(ad+bc)i.
$$

You can picture $a+bi$ as a point on a plane: horizontal is the **real** axis, vertical is the **imaginary** axis. Its distance from the origin is $\sqrt{a^2+b^2}$.

```python
z = 2 + 3j  # Python uses j, not i
w = 1 - 2j
print("z * w =", z * w)
print("Real:", z.real, "Imaginary:", z.imag)
print("Magnitude:", abs(z))
```

### 22. Hermitian transpose: transpose and conjugate

The **complex conjugate** changes the sign of the imaginary part:

$$
\overline{a+bi}=a-bi.
$$

The **Hermitian transpose** (or *conjugate transpose*) does **two things**: transpose the vector, then conjugate every number. It is written $\mathbf{z}^{H}$ or $\mathbf{z}^{*}$.

$$
\begin{bmatrix}2+3i\\1-i\end{bmatrix}^{H}
=\begin{bmatrix}2-3i&1+i\end{bmatrix}.
$$

For real vectors, conjugation changes nothing, so $\mathbf{v}^H=\mathbf{v}^T$.

For complex vectors, the **standard inner product** uses the conjugate transpose:

$$
\langle\mathbf{z},\mathbf{w}\rangle
=\mathbf{z}^{H}\mathbf{w}
=\sum_i\overline{z_i}w_i.
$$

This convention keeps $\mathbf{z}^{H}\mathbf{z}=\sum_i|z_i|^2$ **real and non-negative**, which we need for length:

$$
\lVert\mathbf{z}\rVert=\sqrt{\mathbf{z}^{H}\mathbf{z}}.
$$

```python
z = [2 + 3j, 1 - 1j]
w = [1 + 0j, 2 + 1j]
inner = sum(a.conjugate() * b for a, b in zip(z, w))
self_inner = sum(a.conjugate() * a for a in z)
print("Complex inner product:", inner)
print("zᴴz:", self_inner)
```

**Important difference:** For complex vectors, swapping the inputs typically **conjugates** the answer:

$$
\langle\mathbf{z},\mathbf{w}\rangle
=\overline{\langle\mathbf{w},\mathbf{z}\rangle}.
$$

That is not quite the same rule as the real dot product.

### 23. Unit vectors: keep the direction, make the length 1

A **unit vector** has length **exactly one**. To turn any **nonzero** vector into a unit vector, divide by its length:

$$
\boxed{\widehat{\mathbf{v}}=
\frac{\mathbf{v}}{\lVert\mathbf{v}\rVert},
\qquad \lVert\widehat{\mathbf{v}}\rVert=1.}
$$

Example: $\mathbf{v}=[3,4]^T$ has length 5, so the unit vector in the same direction is $[3/5,4/5]^T$.

```python
import math
v = [3, 4]
norm = math.sqrt(sum(x*x for x in v))
if norm != 0:
    unit = [x / norm for x in v]
    print("Unit vector:", unit)
    print("Length:", math.sqrt(sum(x*x for x in unit)))
```

**Exception:** You **cannot normalize the zero vector**. Its length is zero, so division would be undefined; it has no direction to keep.

### 24. Code challenge: dot products after normalization

Start with two nonzero vectors. Find their lengths and dot product. Then normalize both and find their new dot product.

$$
\widehat{\mathbf{a}}\cdot\widehat{\mathbf{b}}
=\frac{\mathbf{a}\cdot\mathbf{b}}
{\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert}
=\cos\theta.
$$

After normalization, the dot product directly tells us about the **angle**, without being affected by how long the original arrows were.

```python
import math
a = [3, 4, 0, 0]
b = [4, 0, 3, 0]
length_a = math.sqrt(sum(x*x for x in a))
length_b = math.sqrt(sum(x*x for x in b))
raw_dot = sum(x*y for x, y in zip(a, b))
ua = [x / length_a for x in a]
ub = [x / length_b for x in b]
unit_dot = sum(x*y for x, y in zip(ua, ub))
print("Lengths:", length_a, length_b)
print("Raw dot:", raw_dot)
print("Unit-vector dot:", unit_dot)
```

**Think:** What will happen if the two vectors already point in exactly the same direction? What if they are perpendicular?

---

## Part E — From vectors to spaces

### 25. Dimensions and fields

The notation $\mathbb{R}^{3}$ means **all vectors with three real-number components**. For example, $[1,2,3]^T\in\mathbb{R}^{3}$. Likewise, $\mathbb{C}^{2}$ means all vectors with two complex-number components.

- **Dimension:** Roughly, how many independent number directions are needed to describe a space. A vector in $\mathbb{R}^5$ has **five components**.
- **Field:** What kinds of scalars we are allowed to use. $\mathbb{R}$ is the field of **real numbers**; $\mathbb{C}$ is the field of **complex numbers**.
- **Ambient space:** The larger space in which the vectors live. A line can be inside $\mathbb{R}^3$ even though the line itself is only one-dimensional.

**Why it matters:** A vector with three components need not be free to move in every 3D direction. It might be limited to a line or plane.

### 26. Subspaces: all combinations that stay inside

A **subspace** is a collection of vectors that behaves well under ordinary vector operations. To be a subspace of $\mathbb{R}^n$, it must:

1. Include the **zero vector**.
2. Stay inside the set when you **add** any two of its vectors (*closed under addition*).
3. Stay inside the set when you **scale** any vector by any real number (*closed under scalar multiplication*).

Example: all multiples of $[1,2]^T$ form a line through the origin:

$$
S=\left\{t\begin{bmatrix}1\\2\end{bmatrix}:t\in\mathbb{R}\right\}.
$$

This line is a **1D subspace of the larger 2D space** $\mathbb{R}^2$. Any two vectors on this line can be added or scaled without leaving the line.

**Not a subspace:** The line $y=2x+1$. It does not contain $(0,0)$, so it fails immediately.

### 27. Subspace versus subset

A **subset** is simply a collection of things chosen from a larger set. It has **no extra rules** about adding or scaling.

For example, all points with $x>0$ and $y>0$ form a **subset** of $\mathbb{R}^2$. But it is **not a subspace**: it does not contain the zero vector, and multiplying one of its points by $-1$ takes you outside the set.

$$
\text{Every subspace is a subset, but not every subset is a subspace.}
$$

**Fast test:** Does the set contain zero? If not, stop: it is **not** a subspace.

### 28. Span: where can your vectors take you?

A **linear combination** means multiplying vectors by numbers and adding the results:

$$
\mathbf{v}=c_1\mathbf{v}_1+c_2\mathbf{v}_2+\cdots+c_k\mathbf{v}_k.
$$

The **span** of some vectors is **every vector you can make** by choosing any allowed scalars:

$$
\operatorname{span}\{\mathbf{v}_1,\ldots,\mathbf{v}_k\}
=\left\{\sum_{i=1}^{k}c_i\mathbf{v}_i:c_i\in\mathbb{R}\right\}.
$$

Some helpful pictures:

- One nonzero vector spans a **line through the origin**.
- Two vectors that point along **different lines** in $\mathbb{R}^2$ span the **whole plane**.
- Two vectors that are scalar multiples span **only one line**.
- Two independent vectors in $\mathbb{R}^3$ span a **plane through the origin**, not all of 3D space.

Example:

$$
\begin{bmatrix}5\\1\end{bmatrix}
=2\begin{bmatrix}1\\0\end{bmatrix}
+1\begin{bmatrix}3\\1\end{bmatrix}.
$$

So $[5,1]^T$ is in the span of $[1,0]^T$ and $[3,1]^T$.

**Big idea:** Span answers the question: *Can I build this target vector from the ones I already have?*

### 29. Linear independence: are any vectors unnecessary?

Vectors are **linearly dependent** if at least one can be built from the others. For example:

$$
\begin{bmatrix}2\\4\end{bmatrix}
=2\begin{bmatrix}1\\2\end{bmatrix}.
$$

So these two vectors are dependent: the second adds **no new direction**.

A set is **linearly independent** if the only way to make the zero vector is to give **every vector a zero weight**:

$$
c_1\mathbf{v}_1+\cdots+c_k\mathbf{v}_k=\mathbf{0}
\quad\Longrightarrow\quad c_1=\cdots=c_k=0.
$$

If some weights can be nonzero and still produce zero, the set is **dependent**.

**Easy facts:**

- A set containing the **zero vector** is dependent.
- More than $n$ vectors in $\mathbb{R}^n$ must be dependent.
- Two non-parallel vectors in $\mathbb{R}^2$ are independent.
- Independence is about the **whole set**, not one isolated vector.

**Connection to span:** Adding a dependent vector does **not** expand the span. Adding an independent vector may open a new direction.

### 30. Basis: enough vectors, but no extras

A **basis** is a set of vectors with **both** properties:

1. They are **linearly independent**: no vector is redundant.
2. They **span the space**: you can build every vector you need.

For $\mathbb{R}^2$, the familiar **standard basis** is

$$
\mathbf{e}_1=\begin{bmatrix}1\\0\end{bmatrix},
\qquad\mathbf{e}_2=\begin{bmatrix}0\\1\end{bmatrix}.
$$

Any vector $[x,y]^T$ can be written as

$$
\begin{bmatrix}x\\y\end{bmatrix}
=x\mathbf{e}_1+y\mathbf{e}_2.
$$

But these are not the only possible basis vectors. For example,

$$
\mathbf{u}_1=\begin{bmatrix}1\\0\end{bmatrix},\quad
\mathbf{u}_2=\begin{bmatrix}1\\1\end{bmatrix}
$$

also form a basis of $\mathbb{R}^2$. The same vector $[3,2]^T$ now has different **coordinates in this basis**:

$$
\begin{bmatrix}3\\2\end{bmatrix}
=1\mathbf{u}_1+2\mathbf{u}_2.
$$

Notice that its standard coordinates are $(3,2)$, but its coordinates in the new basis are $(1,2)$. The actual vector does **not** change; only our measuring system changes.

**Useful rule:** Any basis of $\mathbb{R}^n$ contains exactly **$n$ independent vectors**. A 2D plane *inside* $\mathbb{R}^3$ has a two-vector basis for that plane, not necessarily a basis for all of $\mathbb{R}^3$.

---

## Quick formula sheet

| Idea | Formula or rule |
|---|---|
| Add vectors | $(\mathbf{a}+\mathbf{b})_i=a_i+b_i$ |
| Scale a vector | $(c\mathbf{v})_i=cv_i$ |
| Dot product | $\mathbf{a}\cdot\mathbf{b}=\sum_i a_ib_i$ |
| Length | $\lVert\mathbf{v}\rVert=\sqrt{\sum_i v_i^2}$ for real vectors |
| Angle | $\cos\theta=\dfrac{\mathbf{a}\cdot\mathbf{b}}{\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert}$ |
| Perpendicular | $\mathbf{a}\cdot\mathbf{b}=0$ for nonzero real vectors |
| Cauchy–Schwarz | $|\mathbf{a}\cdot\mathbf{b}|\le\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert$ |
| Unit vector | $\widehat{\mathbf{v}}=\mathbf{v}/\lVert\mathbf{v}\rVert$ for $\mathbf{v}\ne\mathbf0$ |
| Hadamard | $(\mathbf{a}\odot\mathbf{b})_i=a_ib_i$ |
| Outer product | $(\mathbf{a}\mathbf{b}^T)_{ij}=a_ib_j$ |
| Complex inner product | $\mathbf{a}^H\mathbf{b}=\sum_i\overline{a_i}b_i$ |
| Linear combination | $\sum_i c_i\mathbf{v}_i$ |
| Basis | **Independent + spans the target space** |

## 10 questions to test yourself

Try to answer before opening the solutions.

1. Is $[2,3]$ a vector or a point? Can it represent both?
2. Can you add a vector in $\mathbb{R}^2$ to one in $\mathbb{R}^3$ using ordinary vector addition?
3. What happens to $[2,4]$ when multiplied by $-2$?
4. Find $[1,2]\cdot[3,4]$.
5. Find the length of $[6,8]$.
6. What does a zero dot product mean for two **nonzero real** vectors?
7. Why can we not normalize $[0,0]$?
8. Does $[1,2]^T$ together with $[2,4]^T$ span all of $\mathbb{R}^2$?
9. Is the set $\{[1,0]^T,[0,1]^T,[1,1]^T\}$ independent?
10. What are the **two conditions** required for a basis?

### Short answers (check after trying)

1. It can describe an ordered pair as a point, or an arrow as a vector. They are different ideas.
2. No. Their numbers of components are different.
3. It becomes $[-4,-8]$: twice as long and pointing the opposite way.
4. $3+8=11$.
5. $\sqrt{36+64}=10$.
6. They are perpendicular (orthogonal).
7. Division by its length would divide by zero.
8. No. They are multiples, so they span only one line.
9. No. The third vector is the sum of the first two.
10. Linear independence and spanning the required space.

## Common mistakes to avoid

- **Vector dimension vs. vector length:** number of components is not the arrow's magnitude.
- **Python list vs. numeric array:** Python lists concatenate with `+`; NumPy arrays perform element-wise addition.
- **Dot vs. Hadamard:** a dot product **sums** the pairwise products; Hadamard keeps them as a vector.
- **Dot vs. outer:** the dot product is a **number**; the outer product is a **matrix**.
- **Right angle vs. zero vector:** a zero dot product implies a right angle only when **both vectors are nonzero**.
- **Unit vector vs. zero vector:** you cannot divide by the zero vector's length.
- **Subspace vs. subset:** a subspace must include zero and be closed under vector addition and scaling.
- **Span vs. basis:** spanning may include unnecessary vectors; a basis has **no unnecessary vectors**.
- **Complex transpose:** for a complex inner product, use the **conjugate transpose**, not just the regular transpose.

## What's next?

This notebook begins with **Vectors** because almost every later Linear Algebra topic uses them. The next chapters can introduce **Matrices**, **Matrix Multiplication**, **Rank**, **Eigenvalues and Eigenvectors**, and **PCA** as *separate notes* under the same **Linear Algebra** subject. That is a suggested learning path, not content from this transcript.

*Source: User-provided “Vectors” course transcript, lessons 7–30. Numerical examples and simple Python snippets in this note are explanatory adaptations.*
