---
title: "PCA: vì sao cần trừ trung bình?"
description: "Bài viết mẫu bằng tiếng Việt về phép đưa dữ liệu về quanh tâm."
pubDatetime: "2026-10-05T00:00:00Z"
featured: false
draft: false
tags: ["Machine Learning", "Linear Algebra"]
---

> Demonstration article · Replace or adapt this content before your personal launch.

## Mỗi hàng là một mẫu

Giả sử mỗi hàng của ma trận dữ liệu là một mẫu, mỗi cột là một đặc trưng. Ta tính trung bình của từng cột rồi trừ trung bình đó khỏi mỗi giá trị trong cột.

```python
import numpy as np
X = np.array([[10, 30], [20, 20], [30, 10]])
X_centered = X - X.mean(axis=0)
print(X_centered)
```

## Dữ liệu được dịch chuyển

Trừ trung bình làm dữ liệu nằm quanh gốc tọa độ. Phép dịch chuyển này giữ nguyên khoảng cách giữa các cặp điểm.

## PCA quan tâm điều gì?

PCA tìm những hướng có phương sai lớn. Việc đưa dữ liệu về quanh tâm giúp mô tả sự biến thiên quanh giá trị trung bình.

Đây là nội dung minh họa hỗ trợ Unicode tiếng Việt. Xem thêm [ghi chú đại số tuyến tính](/notes/pca-centering).
