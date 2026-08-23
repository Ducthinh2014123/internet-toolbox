# Internet Toolbox

**Internet Toolbox** là một bộ sưu tập **150 công cụ tiện ích trực tuyến miễn phí, mã nguồn mở**, dành cho developer và bất kỳ ai cần các công cụ nhanh, gọn, không quảng cáo. Toàn bộ công cụ chạy **hoàn toàn trên trình duyệt (client-side)** — không có backend, không có database, không gửi dữ liệu của bạn lên bất kỳ máy chủ nào.

🌐 **Trải nghiệm trực tiếp:** [internet-toolbox-ten.vercel.app](https://internet-toolbox-ten.vercel.app/)

> Dự án mã nguồn mở, được sản xuất vào năm **2026** bởi **Bùi Đức Thịnh** (GitHub: [@Ducthinh2014123](https://github.com/Ducthinh2014123)).
>
> © 2026 Bùi Đức Thịnh. Bản quyền thuộc về tác giả. Xem chi tiết cấp phép sử dụng tại mục [License](#license).

> ℹ️ Mã nguồn được công khai với mục đích để mọi người **xem, tham khảo và học hỏi** cách xây dựng dự án (không nhằm mục đích để tự cài đặt/host lại). Muốn sử dụng công cụ, hãy truy cập trực tiếp trang web ở trên.

## Tính năng nổi bật

- 🔎 **Tìm kiếm & Command Palette** (`Ctrl/Cmd + K`) để mở nhanh bất kỳ công cụ nào
- ⭐ **Yêu thích & Gần đây** — lưu ngay trên trình duyệt của bạn (`localStorage`), không cần đăng nhập
- 🌗 **Chế độ Sáng / Tối**
- 📱 Giao diện responsive, tối ưu cho cả mobile và desktop
- 🔒 **Riêng tư tuyệt đối** — mọi xử lý (mã hoá, chuyển đổi, tạo dữ liệu ngẫu nhiên...) diễn ra ngay trên máy bạn, không upload lên server
- ⚡ Tốc độ cao, không phụ thuộc backend

## 10 nhóm công cụ (150 công cụ)

| Nhóm | Số lượng | Ví dụ công cụ |
| --- | --- | --- |
| 👨‍💻 Developer & Code | 18 | JSON formatter, Regex tester, SQL formatter, Diff checker |
| 🔐 Encoding & Crypto | 17 | Base64, SHA-1/256/384/512, MD5, Base32, Hex/Binary |
| ✍️ Text | 18 | Word counter, Slug generator, Lorem Ipsum, Readability Score |
| 📅 Date & Time | 15 | Unix timestamp, Cron helper, Date difference, Quarter Calculator |
| 🌐 Web & URL | 16 | Robots.txt generator, Browser info, UTM Link Builder |
| 🌍 Network & IP | 16 | IPv4 Calculator, DNS record formatter, Random IP Generator |
| 🎨 Generators | 15 | Password generator, Random Data Generator, Color Palette Generator |
| 🖼️ Image | 16 | Resize, crop, chuyển đổi định dạng ảnh |
| 🧾 QR & Barcode | 9 | Tạo/đọc mã QR, tạo mã Barcode |
| 🎬 Subtitle & Data | 10 | SRT formatter, chuyển đổi phụ đề, dữ liệu |

Danh sách đầy đủ và chi tiết từng công cụ luôn hiển thị trực tiếp trên trang `/tools` và `/categories` của [website](https://internet-toolbox-ten.vercel.app/).

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + hand-built shadcn/ui-style primitives
- Lucide icons
- No backend, no database

## Project structure

- `app/` — routes (home, `/tools`, `/tools/[slug]`, `/categories`, `/categories/[category]`, `/about`, `sitemap.ts`, `robots.ts`)
- `components/` — header, footer, command palette, theme toggle, toast system, generic tool runner components (`TextIOTool`, `FormTool`), UI primitives
- `lib/tools-registry.ts` — the single source of truth for every tool (metadata + logic). All surfaces (homepage, all-tools, search, command palette, categories, favorites, related tools) read from this registry only.
- `lib/tools/*.ts` — pure, dependency-light logic per category (encoding, text, datetime, developer, ...)
- `lib/categories.ts` — the 10 tool categories
- `lib/hooks/use-local-storage-list.ts` — Favorites and Recently Used, backed by `localStorage`

## Contributing

Đây là dự án mã nguồn mở — mọi ý kiến đóng góp, báo lỗi (issue), hoặc pull request đều được hoan nghênh trên [GitHub repository](https://github.com/Ducthinh2014123/internet-toolbox/).

## License

Copyright © 2026 **Bùi Đức Thịnh** ([@Ducthinh2014123](https://github.com/Ducthinh2014123)). Mọi quyền được bảo lưu (All rights reserved), trừ khi có quy định khác trong tệp `LICENSE` của repository. Vui lòng giữ nguyên thông tin bản quyền tác giả khi sử dụng lại, phân phối lại hoặc xây dựng dự án phái sinh từ mã nguồn này.
