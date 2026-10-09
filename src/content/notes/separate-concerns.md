---
title: Separate the model from the interface
description: Keep domain behavior independent of the screen.
subject: Programming
date: "2026-10-01T00:00:00Z"
draft: false
tags: []
---

> Demonstration learning note.

## Start with the data

A book class represents a book. A library class manages a collection of books. A window displays the collection and forwards user actions to it.

## One useful boundary

```java
Book result = library.findBook(code);
if (result == null) {
    showMessage("Book not found");
}
```

The search method does not need to know which table or text field will display its result.
