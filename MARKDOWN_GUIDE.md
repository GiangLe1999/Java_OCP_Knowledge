# Hướng dẫn sử dụng Markdown trong Text Blocks

Text blocks hiện đã hỗ trợ **Markdown formatting** để bạn có thể tạo nội dung phong phú hơn!

## 📝 Các tính năng hỗ trợ

### 1. **Headings** (Tiêu đề)
```markdown
# Heading 1
## Heading 2
### Heading 3
```

### 2. **Lists** (Danh sách)

**Unordered list** (gạch đầu dòng):
```markdown
- Item 1
- Item 2
  - Sub item 2.1
  - Sub item 2.2
- Item 3
```

**Ordered list** (đánh số):
```markdown
1. First item
2. Second item
3. Third item
```

### 3. **Tables** (Bảng)
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

**Ví dụ thực tế**:
```markdown
| Từ khóa | Ý nghĩa | Kế thừa thêm? |
|---------|---------|---------------|
| sealed | Hạn chế kế thừa | Được (với permits) |
| final | Không cho kế thừa | Không được |
| non-sealed | Mở rộng tự do | Được |
```

### 4. **Text Formatting**
```markdown
**Bold text** - Text đậm
*Italic text* - Text nghiêng  
`inline code` - Code ngắn trong dòng
```

### 5. **Links**
```markdown
[Link text](https://example.com)
```

### 6. **Blockquotes** (Trích dẫn)
```markdown
> This is a quote
> Multiple lines
```

---

## 💡 Ví dụ hoàn chỉnh

Khi tạo/edit topic, nhập vào text block:

```markdown
## Các quy tắc của Sealed Class

Khi khai báo sealed class, cần tuân thủ:

1. **Từ khóa sealed** phải đứng trước class/interface
2. **Mệnh đề permits** liệt kê các lớp được phép kế thừa
3. Các lớp con phải chọn một trong ba:
   - `sealed` - Tiếp tục hạn chế
   - `final` - Kết thúc chuỗi kế thừa
   - `non-sealed` - Mở rộng tự do

### So sánh các từ khóa

| Từ khóa | Cho phép kế thừa tiếp? | Yêu cầu permits? |
|---------|------------------------|------------------|
| sealed | ✅ Có (với permits) | ✅ Bắt buộc |
| final | ❌ Không | ❌ Không cần |
| non-sealed | ✅ Có (tự do) | ❌ Không cần |

**Lưu ý quan trọng**: Các lớp trong permits phải cùng package!
```

Kết quả hiển thị sẽ có:
- ✅ Headings với font size phù hợp
- ✅ Lists với bullets/numbers
- ✅ Tables đẹp với borders và styling
- ✅ Bold, italic, inline code
- ✅ Tất cả được format đẹp tự động!

---

## 🎯 Tips

1. **Xuống dòng**: Để tạo paragraph mới, để trống 1 dòng
2. **Tables**: Dùng `|` để tạo cột, dùng `---` để tạo header separator
3. **Nested lists**: Indent bằng 2-4 spaces để tạo sub-items
4. **Inline code**: Dùng backticks \` \` cho code ngắn trong câu

Bây giờ bạn có thể tạo nội dung phong phú hơn nhiều! 🚀
