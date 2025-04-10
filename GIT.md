# 1. Cấu trúc Repository

* Branch chính:
  * main: Chứa code ổn định, đã được kiểm tra kỹ lưỡng.
  * develop: Chứa các tính năng đang trong quá trình phát triển.

* Branch tính năng:
  * Tạo branch mới cho từng tính năng, lỗi hoặc cải tiến, sử dụng quy ước tên:
    * feature/[feature-name]
    * fix/[bug-description]
    * refactor/[refactor-name]

Ví dụ:

    feature/user-authentication
    fix/login-redirect
    refactor/code-cleanup

# 2. Commit Message

## 2.1 Quy tắc viết commit message

* Cấu trúc chuẩn:

      <type>(<scope>): <short description>
      
      <optional longer description>

* type: Mô tả loại thay đổi, ví dụ:
  * feat: Thêm tính năng mới.
  * fix: Sửa lỗi.
  * refactor: Tái cấu trúc code.
  * style: Thay đổi liên quan đến style (không ảnh hưởng logic).
  * docs: Thay đổi tài liệu.
  * test: Thêm hoặc sửa test.
  * chore: Công việc vặt (cập nhật phụ thuộc, script).
* scope: Phạm vi thay đổi (có thể là module hoặc tính năng).
* short description: Mô tả ngắn gọn (tối đa 50 ký tự).

Ví dụ:

    feat(auth): add JWT authentication
    fix(user): resolve login redirect issue
    refactor(profile): cleanup unused variables
    style: update button styles for consistency

## 2.2 Không commit code không cần thiết

* Không commit file debug hoặc thư mục build (dist/, node_modules/).
* Sử dụng .gitignore để loại trừ file không cần thiết:


      node_modules/
      dist/
      .env

# 3. Pull Request (PR)

* Tạo PR cho mỗi tính năng hoặc lỗi.
* Tiêu đề PR: Tương tự như commit message (ngắn gọn và có type, scope).
* Mô tả PR:
  * Tóm tắt thay đổi.
  * Các vấn đề liên quan (nếu có, tham chiếu bằng #issue-number).
  * Hướng dẫn test.

Ví dụ:

    Title: feat(auth): implement JWT-based authentication
    Description:
      - Add login, signup API integration
      - Add auth guard for protected routes
      - Refactor auth service
    Related issues:
      - Closes #123
      - Partially addresses #456

# 4. Quy tắc làm việc với branch

## 4.1 Quy trình làm việc cơ bản (Git Workflow)

1. Tạo branch mới từ develop:
   <code>git checkout -b feature/<feature-name></code>

2. Thực hiện thay đổi và commit theo quy tắc.

3. Cập nhật branch với code mới từ develop:

   <code>git fetch origin</code><br>
   <code>git merge origin/develop</code>

4. Tạo pull request (PR) để merge vào develop.

## 4.2 Quy tắc khi merge

* Không merge trực tiếp vào main.
* Sử dụng squash để gộp các commit không cần thiết.
* Kiểm tra code và chạy test trước khi merge

## 4.3 Quy tắc khi giải quyết xung đột (Conflict)

* Không sửa xung đột trực tiếp trên main hoặc develop.
* Luôn giải quyết xung đột trong branch của bạn và kiểm tra lại sau khi xử lý.


# 5. Kiểm tra và Đánh giá

* Code review trước khi merge:
  * Đảm bảo code đúng convention.
  * Đảm bảo code không ảnh hưởng đến tính năng khác.
  * Chạy test nếu có (Unit test, E2E test).

# 6. Các công cụ hỗ trợ
* Sử dụng GitFlow mặc định của Webstorm
