# Internet Toolbox

**Internet Toolbox** là một bộ sưu tập **150 công cụ tiện ích trực tuyến miễn phí, mã nguồn mở**, dành cho developer và bất kỳ ai cần các công cụ nhanh, gọn, không quảng cáo. Toàn bộ công cụ chạy **hoàn toàn trên trình duyệt (client-side)** — không có backend, không có database, không gửi dữ liệu của bạn lên bất kỳ máy chủ nào.

> Dự án mã nguồn mở, được sản xuất vào năm **2026** bởi **Bùi Đức Thịnh** (GitHub: [@Ducthinh2014123](https://github.com/Ducthinh2014123)).
>
> © 2026 Bùi Đức Thịnh. Bản quyền thuộc về tác giả. Xem chi tiết cấp phép sử dụng tại mục [License](#license).

## Tính năng nổi bật

- 🔎 **Tìm kiếm & Command Palette** (`Ctrl/Cmd + K`) để mở nhanh bất kỳ công cụ nào
- ⭐ **Yêu thích & Gần đây** — lưu ngay trên trình duyệt của bạn (`localStorage`), không cần đăng nhập
- 🌗 **Chế độ Sáng / Tối**
- 📱 Giao diện responsive, tối ưu cho cả mobile và desktop
- 🔒 **Riêng tư tuyệt đối** — mọi xử lý (mã hoá, chuyển đổi, tạo dữ liệu ngẫu nhiên...) diễn ra ngay trên máy bạn, không upload lên server
- ⚡ Tốc độ cao, không phụ thuộc backend, dễ tự host trên Vercel

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

Danh sách đầy đủ và chi tiết từng công cụ luôn hiển thị trực tiếp trên trang `/tools` và `/categories` của web.

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + hand-built shadcn/ui-style primitives
- Lucide icons
- No backend, no database — deployable directly to Vercel

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000.

## Build

\`\`\`bash
npm run build
\`\`\`

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Framework preset: Next.js. No environment variables or backend services are required.
4. Deploy.

## Contributing

Đây là dự án mã nguồn mở — mọi ý kiến đóng góp, báo lỗi (issue), hoặc pull request đều được hoan nghênh trên [GitHub repository](https://github.com/Ducthinh2014123/internet-toolbox/).

## License

Copyright © 2026 **Bùi Đức Thịnh** ([@Ducthinh2014123](https://github.com/Ducthinh2014123)). Mọi quyền được bảo lưu (All rights reserved), trừ khi có quy định khác trong tệp `LICENSE` của repository. Vui lòng giữ nguyên thông tin bản quyền tác giả khi sử dụng lại, phân phối lại hoặc xây dựng dự án phái sinh từ mã nguồn này.
