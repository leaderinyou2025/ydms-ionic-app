# Ionic Angular Coding Conventions
## 1. Cấu trúc Thư Mục Dự Án Ionic

### 1.1 Tuân thủ cấu trúc chuẩn của Ionic và Angular
- Tách biệt logic và giao diện theo module (Modular Design).
- Phân chia thư mục theo chức năng:
```plaintext
    src/
    ├── app/
    │   ├── core/                  # Core module (services, guards, directives, pipes etc.)
    │   ├── pages/                 # Pages
    │   ├── services/              # Feature services
    │   ├── shared/                # Shared module (components, class, constans, interface, enums)
    │   ├── app.component.html
    │   ├── app.component.scss
    │   ├── app.component.ts
    │   ├── app.component.spec.ts
    │   ├── app-routing.module.ts
    │   └── app.module.ts
    ├── environments/               # Cấu hình môi trường
    ├── assets/                     # Tài nguyên (ảnh, font, v.v.)
    └── theme/                      # Global styles (Tailwind config, utilities)
```

---

## 2. Sử dụng Component và Page trong Ionic

### 2.1 Đặt tên
- **Pages**:
  - Tên file: Sử dụng **kebab-case** và thêm hậu tố `page`.
    ```plaintext
    login.page.ts
    login.page.html
    login.page.scss
    ```
  - Tên selector: Sử dụng tiền tố `app-` hoặc tên dự án.
    ```typescript
    @Component({
      selector: 'app-login',
    })
    ```

- **Components**:
  - Tên file: Sử dụng **kebab-case** và thêm hậu tố `component`.
    ```plaintext
    header.component.ts
    header.component.html
    header.component.scss
    ```

### 2.2 Tái sử dụng Component
- Component tái sử dụng nên được đặt trong thư mục `shared/`:
  ```plaintext
  src/app/shared/components/
  ```

---

## 3. Quy tắc Thiết Kế Giao Diện (UI/UX) với Ionic

### 3.1 Tuân thủ hệ thống thiết kế của Ionic
- Ưu tiên sử dụng **Ionic components** thay vì tự xây dựng UI từ đầu:
  ```html
  <!-- Khuyến khích -->
  <ion-button expand="full" color="primary">Submit</ion-button>

  <!-- Không nên -->
  <button class="btn btn-primary">Submit</button>
  ```

### 3.2 Tối ưu hóa hiệu suất giao diện
- Sử dụng `ion-virtual-scroll` cho danh sách dài:
  ```html
  <ion-virtual-scroll [items]="items">
    <ion-item *virtualItem="let item">
      {{ item.name }}
    </ion-item>
  </ion-virtual-scroll>
  ```

- Sử dụng **lazy loading** cho hình ảnh:
  ```html
  <ion-img src="assets/image.jpg"></ion-img>
  ```

---

## 4. Quy tắc về Navigation (Điều hướng)

### 4.1 Sử dụng Ionic Router
- Tất cả các điều hướng phải thông qua `NavController` hoặc `Router`.
- Không sử dụng `window.location` hoặc `href` để điều hướng.

**Ví dụ:**
```typescript
constructor(private navCtrl: NavController) {}

goToPage(): void {
  this.navCtrl.navigateForward('/details');
}
```

### 4.2 Sử dụng Lazy Loading cho các page
- Cấu hình `loadChildren` trong file `app-routing.module.ts`:
  ```typescript
  const routes: Routes = [
    {
      path: 'login',
      loadChildren: () =>
        import('./features/login/login.module').then((m) => m.LoginPageModule),
    },
  ];
  ```

---

## 5. Quy tắc về Service và API

### 5.1 Đặt tên Service
- Tên service sử dụng **PascalCase** và thêm hậu tố `Service`:
  ```typescript
  export class AuthService {
    // Authentication logic
  }
  ```

### 5.2 Xử lý API
- Tạo service chức năng và sử dụng OdooService để giao tiếp với API

### 5.3 Xử lý trạng thái tải (loading)
- Sử dụng `IonLoadingController` để hiển thị trạng thái tải:
  ```typescript
  async presentLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
    });
    await loading.present();

    // Đóng loading sau khi hoàn tất
    setTimeout(() => loading.dismiss(), 2000);
  }
  ```

---

## 6. Quy tắc xử lý State (Trạng thái)

### 6.1 Sử dụng `BehaviorSubject` hoặc `NgRx` để quản lý trạng thái
- Tạo một service để lưu trữ trạng thái:
  ```typescript
  @Injectable({
    providedIn: 'root',
  })
  export class AuthStateService {
    private authState = new BehaviorSubject<boolean>(false);

    isLoggedIn$ = this.authState.asObservable();

    login() {
      this.authState.next(true);
    }

    logout() {
      this.authState.next(false);
    }
  }
  ```

---

## 7. Quy tắc xử lý Platform

### 7.1 Kiểm tra nền tảng
- Sử dụng `Platform` để kiểm tra thiết bị:
  ```typescript
  constructor(private platform: Platform) {
    if (this.platform.is('android')) {
      console.log('Chạy trên Android');
    }
  }
  ```

### 7.2 Sử dụng plugin của Capacitor
- Không sử dụng plugin không chính thức trừ khi cần thiết.
- Mỗi plugin phải được kiểm tra bằng cách gọi `checkPermissions` trước khi sử dụng:
  ```typescript
  const status = await Geolocation.checkPermissions();
  if (status.location === 'granted') {
    const position = await Geolocation.getCurrentPosition();
    console.log(position);
  }
  ```

---

## 8. Testing (Kiểm thử)

### 8.1 Unit Test
- Cần gạch đầu dòng ra các case đã test, input và output cụ thể

---

## 9. Performance Optimization

### 9.1 Tối ưu hóa ứng dụng Ionic
- Chỉ import module cần thiết cho từng page.
- Sử dụng **lazy loading** cho module và assets.

### 9.2 Tối ưu hóa kích thước ứng dụng
- Sử dụng **Ionic PWA Toolkit** nếu hỗ trợ Progressive Web App (PWA).
- Nén và tối ưu hóa hình ảnh trước khi thêm vào thư mục `assets`.

---

## 10. Quy tắc và Thứ tự Import Thư Viện

### 10.1 Quy tắc Import
- Mỗi file chỉ import các module và thư viện thực sự cần thiết.
- Tránh import toàn bộ thư viện nếu chỉ cần một phần:
  ```typescript
  // Tốt
  import { debounceTime } from 'rxjs/operators';

  // Xấu
  import * as RxJS from 'rxjs';
  ```

- Sử dụng alias để tránh xung đột tên:
  ```typescript
  import { AuthService as UserAuthService } from './services/auth.service';
  ```

### 10.2 Thứ tự Import
Sắp xếp import theo thứ tự:
1. **Thư viện Angular hoặc Core** (ví dụ: `@angular/core`, `@ionic/angular`):
   ```typescript
   import { Component, OnInit } from '@angular/core';
   import { NavController } from '@ionic/angular';
   ```
2. **Thư viện bên thứ ba** (ví dụ: `rxjs`, `lodash`):
   ```typescript
   import { Observable } from 'rxjs';
   import _ from 'lodash';
   ```
3. **Module hoặc Service nội bộ của dự án**:
   ```typescript
   import { ApiService } from './services/api.service';
   import { AuthStateService } from './state/auth-state.service';
   ```
4. **Style hoặc Assets**:
   ```typescript
   import './global.scss';
   ```

- Chèn một dòng trắng giữa các nhóm import.

---
