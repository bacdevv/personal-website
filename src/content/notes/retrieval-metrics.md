---
title: Rank-1 and average precision
description: Two complementary views of retrieval quality.
subject: Machine Learning
date: "2026-10-01T00:00:00Z"
draft: false
tags: []
---

> Demonstration learning note.

## Rank-1

Rank-1 asks whether the first retrieved candidate has the correct identity, under the evaluation protocol's valid-match rules.

## Average precision

Average precision considers where all valid positive matches appear in the ranked list. Mean average precision averages this over valid queries.

## Keep the protocol fixed

Compare methods only under the same dataset split, exclusions, and evaluation procedure. A toy example is not a benchmark result.
