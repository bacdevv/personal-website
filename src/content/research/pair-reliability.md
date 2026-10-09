---
title: Can reliability depend on the image pair?
description: A hypothesis about judging useful evidence under occlusion.
date: "2026-10-01T00:00:00Z"
draft: false
status: Hypothesis
tags: [Person Re-ID, Occlusion]
---

> Demonstration research entry. This is an unvalidated question, not a novelty claim, publication, or reported result.

## The question

Could the reliability of a body-region feature depend on the query–gallery pair, instead of being a fixed property of one image?

## Why investigate it?

A visible region in one image may still have no useful counterpart in another. Pair-conditioned confidence could potentially identify comparable evidence.

## What would count as evidence?

Use a fixed baseline, identical data splits, documented seeds, and an ablation that isolates the reliability mechanism. Record Rank-1 and mAP, including any regression.

## Next experiment

Establish baseline reproducibility before adding a new scoring rule. Do not infer novelty without a current literature review.
