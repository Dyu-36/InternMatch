// Accounting, audit and tax demo postings. See jobs.mjs for the field contract.
// All postings are fictional; the jobType values must match src/types/index.ts.

/** @type {Array<Record<string, unknown>>} */
export const accountingJobs = [
  // ------------------------------------------------------------ Deloitte
  {
    slug: 'deloitte-audit-intern',
    company: 'deloitte',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [7000000, 12000000],
    skills: ['Accounting', 'Audit', 'Excel', 'IFRS', 'English'],
    quota: 8,
    featured: true,
    deadline: 25,
    description:
      'Bạn sẽ tham gia kiểm toán báo cáo tài chính của các doanh nghiệp niêm yết, từ lập kế hoạch kiểm toán đến kiểm tra số dư và thuyết minh.\n' +
      'Công việc gồm đối chiếu sổ sách, phỏng vấn nhân viên và soạn thảo hồ sơ kiểm toán.',
    requirements:
      '- Năm cuối ngành Kế toán, Kiểm toán, Tài chính hoặc Kinh tế.\n' +
      '- Nắm chuẩn kế toán Việt Nam và khái niệm kiểm toán cơ bản.\n' +
      '- Sử dụng tốt Excel, có khả năng trình bày báo cáo.\n' +
      '- Tiếng Anh đọc hiểu chuẩn báo cáo tài chính quốc tế.',
  },
  {
    slug: 'deloitte-accounting-intern',
    company: 'deloitte',
    title: 'Thực tập sinh Kế toán Tài chính (Financial Accounting Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6000000, 10000000],
    skills: ['Accounting', 'IFRS', 'Excel', 'Financial Reporting', 'English'],
    quota: 5,
    deadline: 30,
    description:
      'Bạn sẽ hỗ trợ lập báo cáo tài chính và hợp nhất báo cáo của doanh nghiệp, đồng thời theo dõi các khoản mục phải thu, phải trả.\n' +
      'Phần lớn công việc sử dụng phần mềm kế toán và Excel nâng cao.',
    requirements:
      '- Năm cuối ngành Kế toán - Kiểm toán hoặc Tài chính.\n' +
      '- Hiểu nguyên tắc cơ bản về doanh thu, chi phí và tài sản.\n' +
      '- Từng dùng phần mềm kế toán như MISA, Bravo hoặc phần mềm tương đương.',
  },
  {
    slug: 'deloitte-tax-intern',
    company: 'deloitte',
    title: 'Thực tập sinh Tư vấn Thuế (Tax Advisory Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [7000000, 11000000],
    skills: ['Tax', 'VAT', 'Transfer Pricing', 'Excel', 'English'],
    quota: 4,
    deadline: 22,
    description:
      'Bạn sẽ hỗ trợ tư vấn thuế cho doanh nghiệp trong nước và nước ngoài, bao gồm thuế giá trị gia tăng, thu nhập cá nhân và giá thành chuyển nhượng.\n' +
      'Công việc gồm rà soát hồ sơ thuế và cập nhật các thay đổi chính sách.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Luật.\n' +
      '- Hiểu khung thuế suất cơ bản của Việt Nam.\n' +
      '- Kỹ năng tra cứu và tổng hợp văn bản pháp luật.',
  },
  {
    slug: 'deloitte-finance-analyst',
    company: 'deloitte',
    title: 'Chuyên gia Phân tích Tài chính (Financial Analyst)',
    jobType: 'Full-time',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [20000000, 32000000],
    skills: ['Financial Modeling', 'Excel', 'Valuation', 'Reporting', 'English'],
    quota: 2,
    hot: true,
    deadline: 27,
    description:
      'Bạn sẽ xây dựng mô hình tài chính, phân tích báo cáo và hỗ trợ khách hàng trong các dự án tư vấn giao dịch.\n' +
      'Công việc có tỷ lệ làm việc với khách hàng cao nên đòi hỏi giao tiếp tốt.',
    requirements:
      '- 2 năm kinh nghiệm phân tích tài chính hoặc tư vấn M&A.\n' +
      '- Thành thạo Excel và phần mềm mô hình tài chính.\n' +
      '- Tốt nghiệp chuyên ngành Tài chính, Kế toán hoặc Kinh tế.',
  },

  // ------------------------------------------------------------------ PwC
  {
    slug: 'pwc-audit-intern',
    company: 'pwc',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [7000000, 12000000],
    skills: ['Audit', 'Accounting', 'Excel', 'Sampling', 'English'],
    quota: 10,
    featured: true,
    hot: true,
    deadline: 21,
    description:
      'Bạn sẽ làm việc trong nhóm kiểm toán doanh nghiệp, hỗ trợ kiểm tra số dư tài khoản, đánh giá rủi ro kiểm toán và lập hồ sơ.\n' +
      'Chương trình có định kỳ huấn luyện nghiệp vụ và cơ hội tham gia kỳ thi tuyển dụng chính thức.',
    requirements:
      '- Năm cuối ngành Kế toán - Kiểm toán, Tài chính hoặc Kinh tế.\n' +
      '- GPA từ 3.0 trở lên là một lợi thế.\n' +
      '- Chăm chỉ, tuân thủ mốc thời gian nghiêm ngặt.\n' +
      '- Tiếng Anh kỹ thuật tốt.',
  },
  {
    slug: 'pwc-reporting-intern',
    company: 'pwc',
    title: 'Thực tập sinh Kế toán & Báo cáo (Accounting and Reporting Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6000000, 9500000],
    skills: ['Financial Reporting', 'IFRS', 'Excel', 'Consolidation', 'English'],
    quota: 5,
    deadline: 29,
    description:
      'Bạn sẽ hỗ trợ công tác báo cáo tài chính và lập báo cáo quản trị cho khách hàng có vốn đầu tư nước ngoài.\n' +
      'Công việc gồm hợp nhất báo cáo và kiểm tra tuân thủ chuẩn kế toán quốc tế.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Toán.\n' +
      '- Nắm chuẩn IFRS và hiểu nguyên tắc hợp nhất báo cáo tài chính.\n' +
      '- Thành thạo Excel và có khả năng lập bảng cân đối.',
  },
  {
    slug: 'pwc-risk-intern',
    company: 'pwc',
    title: 'Thực tập sinh Quản trị Rủi ro (Risk & Compliance Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [6000000, 10000000],
    skills: ['Risk Management', 'AML', 'Compliance', 'Excel', 'English'],
    quota: 3,
    deadline: 33,
    description:
      'Bạn sẽ hỗ trợ rà soát quy trình tuân thủ, kiểm tra hồ sơ phòng chống rửa tiền và cập nhật ma trận rủi ro của khách hàng.\n' +
      'Công việc đòi hỏi sự cẩn trọng và khả năng làm việc với tài liệu tiếng Anh.',
    requirements:
      '- Năm cuối ngành Luật, Kinh tế, Tài chính hoặc Quản trị rủi ro.\n' +
      '- Từng tìm hiểu quy định về phòng chống rửa tiền là một lợi thế.\n' +
      '- Lý trí, cẩn trọng trong xử lý tài liệu nhạy cảm.',
  },
  {
    slug: 'pwc-finance-advisory-intern',
    company: 'pwc',
    title: 'Thực tập sinh Tư vấn Tài chính (Finance Advisory Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [8000000, 13000000],
    skills: ['Due Diligence', 'Valuation', 'Financial Modeling', 'Excel', 'English'],
    quota: 3,
    deadline: 24,
    description:
      'Bạn sẽ tham gia các dự án thẩm định mua bán, lập mô hình tài chính và xây dựng báo cáo tóm tắt cho khách hàng.\n' +
      'Công việc thường theo dự án với thời hạn cụ thể, cần tư duy phân tích tốt.',
    requirements:
      '- Năm cuối ngành Tài chính, Kế toán hoặc Kinh tế.\n' +
      '- Thành thạo Excel và có khả năng xây dựng mô hình tài chính cơ bản.\n' +
      '- Sẵn sàng làm việc theo nhóm dưới áp lực thời gian.',
  },

  // ------------------------------------------------------------------- EY
  {
    slug: 'ey-audit-intern',
    company: 'ey',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [7000000, 12000000],
    skills: ['Audit', 'Accounting', 'Excel', 'Internal Controls', 'English'],
    quota: 8,
    featured: true,
    deadline: 23,
    description:
      'Bạn sẽ hỗ trợ kiểm toán các báo cáo tài chính, kiểm tra hệ thống kiểm soát nội bộ và thực hiện kiểm toán vòng vặp.\n' +
      'Phần lớn khách hàng của nhóm hoạt động trong lĩnh vực sản xuất và thương mại.',
    requirements:
      '- Năm cuối ngành Kế toán, Kiểm toán hoặc Tài chính.\n' +
      '- Nắm hiểu hệ thống kiểm soát nội bộ trong doanh nghiệp.\n' +
      '- Chịu được đi làm việc tại khách hàng trong thời gian ngắn.',
  },
  {
    slug: 'ey-tax-intern',
    company: 'ey',
    title: 'Thực tập sinh Thuế (Tax Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6000000, 9500000],
    skills: ['Tax', 'Corporate Tax', 'Excel', 'Research', 'English'],
    quota: 4,
    deadline: 31,
    description:
      'Bạn sẽ hỗ trợ soạn thảo tờ khai thuế, rà soát chi phí được trừ và nghiên cứu các quy định thuế mới ban hành.\n' +
      'Công việc gồm cập nhật cơ sở dữ liệu thuế và hỗ trợ đội tư vấn trong các tháng cao điểm kê khai.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Luật.\n' +
      '- Cẩn thận với số liệu, sử dụng tốt Excel.\n' +
      '- Khả năng đọc hiểu văn bản pháp luật về thuế.',
  },
  {
    slug: 'ey-accounting-advisory-intern',
    company: 'ey',
    title: 'Thực tập sinh Tư vấn Kế toán (Accounting Advisory Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [7000000, 11000000],
    skills: ['Accounting', 'IFRS', 'Process Improvement', 'Excel', 'English'],
    quota: 3,
    deadline: 26,
    description:
      'Bạn sẽ tham gia các dự án chuyển đổi và cải tiến quy trình kế toán, gồm thiết kế quy trình mới và xây dựng bộ công cụ theo dõi.\n' +
      'Công việc gần với thực tế vận hành của doanh nghiệp.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính, Quản trị hoặc Công nghệ thông tin.\n' +
      '- Tư duy logic và khả năng vẽ sơ đồ quy trình.\n' +
      '- Ưu tiên ứng viên từng làm dự án chuyển đổi số.',
  },
  {
    slug: 'ey-risk-manager',
    company: 'ey',
    title: 'Chuyên gia Quản trị Rủi ro (Risk Advisory)',
    jobType: 'Full-time',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [18000000, 30000000],
    skills: ['Risk Management', 'Compliance', 'Banking', 'Reporting', 'English'],
    quota: 2,
    deadline: -13,
    posted: 48,
    description:
      'Bạn sẽ đánh giá rủi ro hoạt động cho các tổ chức tài chính, xây dựng khung quản trị rủi ro và theo dõi các dự án tuân thủ.\n' +
      'Công việc thường xuyên trao đổi với lãnh đạo khách hàng.',
    requirements:
      '- 2 năm kinh nghiệm quản trị rủi ro, tuân thủ hoặc kiểm toán nội bộ.\n' +
      '- Hiểu khung pháp lý của ngành tài chính - ngân hàng.\n' +
      '- Kỹ năng trình bày và làm việc trực tiếp với khách hàng.',
  },

  // ----------------------------------------------------------------- KPMG
  {
    slug: 'kpmg-audit-intern',
    company: 'kpmg',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [7000000, 12000000],
    skills: ['Audit', 'Accounting', 'Excel', 'IFRS', 'English'],
    quota: 8,
    featured: true,
    deadline: 25,
    description:
      'Bạn sẽ tham gia kiểm toán các công ty đại chúng, kiểm tra chứng từ và đối chiếu số liệu báo cáo tài chính.\n' +
      'Chương trình có lộ trình chuyên môn theo nhóm từ kiểm tra chi tiết đến tổng hợp.',
    requirements:
      '- Năm cuối ngành Kế toán - Kiểm toán, Tài chính hoặc Kinh tế.\n' +
      '- Cẩn thận trong đối chiếu số liệu, tỉ mỉ với chứng từ.\n' +
      '- Ưu tiên ứng viên có chứng chỉ ACCA hoặc CPA bộ phận.',
  },
  {
    slug: 'kpmg-tax-intern',
    company: 'kpmg',
    title: 'Thực tập sinh Thuế (Tax Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [6000000, 9500000],
    skills: ['Tax', 'PWC', 'Excel', 'Transfer Pricing', 'English'],
    quota: 4,
    deadline: 30,
    description:
      'Bạn sẽ hỗ trợ lập hồ sơ thuế cho doanh nghiệp có vốn đầu tư nước ngoài, bao gồm thuế chuyển nhượng và báo cáo về hoạt động ở nước ngoài.\n' +
      'Công việc yêu cầu sự chính xác cao trong số liệu báo cáo.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Luật.\n' +
      '- Nắm hiểu nguyên tắc thuế suất và phương pháp tính thuế.\n' +
      '- Sử dụng tốt Excel và tiếng Anh viết báo cáo.',
  },
  {
    slug: 'kpmg-general-accountant',
    company: 'kpmg',
    title: 'Kế toán Tổng hợp (General Accountant)',
    jobType: 'Full-time',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [15000000, 24000000],
    skills: ['Accounting', 'Tax', 'ERP', 'Reporting', 'English'],
    quota: 2,
    deadline: 28,
    description:
      'Bạn sẽ phụ trách ghi sổ kế toán, đối chiếu tài khoản và lập báo cáo thuế định kỳ cho khách hàng.\n' +
      'Công việc gồm cả xử lý báo cáo quản trị nội bộ theo yêu cầu Ban quản trị.',
    requirements:
      '- 2 năm kinh nghiệm kế toán tổng hợp.\n' +
      '- Thành thạo phần mềm kế toán và Excel nâng cao.\n' +
      '- Có chứng chỉ CPA hoặc tương đương là một lợi thế lớn.',
  },
  {
    slug: 'kpmg-advisory-intern',
    company: 'kpmg',
    title: 'Thực tập sinh Tư vấn (Advisory Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [6000000, 9000000],
    skills: ['Due Diligence', 'Research', 'Excel', 'Presentation', 'English'],
    quota: 3,
    deadline: 32,
    description:
      'Bạn sẽ hỗ trợ thẩm định doanh nghiệp và chuẩn bị báo cáo phân tích cho các dự án tư vấn của công ty.\n' +
      'Công việc đòi hỏi sự tỉ mỉ khi tổng hợp tài liệu từ nhiều nguồn.',
    requirements:
      '- Năm cuối ngành Kinh tế, Tài chính hoặc Luật.\n' +
      '- Kỹ năng tìm kiếm và tổng hợp thông tin tốt.\n' +
      '- Điểm tốt nếu có kinh nghiệm làm báo cáo học tập môn kinh doanh.',
  },

  // -------------------------------------------------------- Grant Thornton
  {
    slug: 'grant-thornton-audit-intern',
    company: 'grant-thornton',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [6000000, 10000000],
    skills: ['Audit', 'Accounting', 'Excel', 'SME', 'English'],
    quota: 6,
    deadline: 27,
    description:
      'Bạn sẽ hỗ trợ kiểm toán doanh nghiệp vừa và nhỏ, bao gồm kiểm tra chi phí, công nợ và xác nhận số dư.\n' +
      'Khách hàng đa dạng từ thương mại, sản xuất đến dịch vụ.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Kinh tế.\n' +
      '- Đi lại linh hoạt đến khách hàng trong khu vực thành phố.\n' +
      '- Chăm chỉ và sẵn sàng học hỏi.',
  },
  {
    slug: 'grant-thornton-tax-intern',
    company: 'grant-thornton',
    title: 'Thực tập sinh Thuế (Tax Compliance Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [5500000, 8500000],
    skills: ['Tax', 'Compliance', 'Excel', 'ETAX', 'English'],
    quota: 4,
    deadline: 29,
    description:
      'Bạn sẽ kiểm tra hồ sơ kê khai thuế, đối chiếu dữ liệu và hỗ trợ doanh nghiệp nộp tờ khai đúng hạn.\n' +
      'Công việc tập trung vào tính chính xác và khả năng truy xuất dữ liệu.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Quản trị.\n' +
      '- Tỉ mỉ, không sợ làm việc với bảng số lớn.\n' +
      '- Sử dụng tốt phần mềm kê khai thuế điện tử.',
  },
  {
    slug: 'grant-thornton-accounting-intern',
    company: 'grant-thornton',
    title: 'Thực tập sinh Kế toán (Accounting Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [5500000, 8500000],
    skills: ['Accounting', 'ERP', 'Excel', 'VAT', 'English'],
    quota: 4,
    deadline: 31,
    description:
      'Bạn sẽ hỗ trợ bộ phận kế toán ghi sổ, lập sổ chi tiết và theo dõi công nợ phải thu phải trả.\n' +
      'Công việc bám sát hệ thống kế toán của khách hàng.',
    requirements:
      '- Năm cuối ngành Kế toán hoặc Tài chính.\n' +
      '- Từng dùng phần mềm kế toán trong học tập.\n' +
      '- Cẩn thận với đối chiếu số liệu giữa sổ sách và chứng từ.',
  },
  {
    slug: 'grant-thornton-advisory-intern',
    company: 'grant-thornton',
    title: 'Thực tập sinh Tư vấn Kinh doanh (Business Advisory Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [6000000, 9000000],
    skills: ['Business Advisory', 'Research', 'Excel', 'English', 'Presentation'],
    quota: 2,
    deadline: 24,
    description:
      'Bạn sẽ hỗ trợ các dự án tư vấn về vận hành doanh nghiệp, gồm khảo sát quy trình và phân tích số liệu.\n' +
      'Công việc linh hoạt, phù hợp với sinh viên muốn tiếp cận sớm công việc tư vấn.',
    requirements:
      '- Năm cuối ngành Kinh tế, Quản trị hoặc Marketing.\n' +
      '- Khả năng giao tiếp và làm việc với tài liệu tiếng Anh.\n' +
      '- Sẵn sàng tham gia trình bày kết quả phân tích.',
  },

  // ---------------------------------------------------------- Forvis Mazars
  {
    slug: 'forvis-mazars-audit-intern',
    company: 'forvis-mazars',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hải Châu, Đà Nẵng',
    salary: [6000000, 10000000],
    skills: ['Audit', 'Accounting', 'Excel', 'English', 'Time Management'],
    quota: 5,
    featured: true,
    deadline: 28,
    description:
      'Bạn sẽ tham gia kiểm toán các doanh nghiệp vừa và nhỏ, từ lập kế hoạch kiểm toán đến hoàn thành hồ sơ và thư tỉnh trao đổi.\n' +
      'Môi trường làm việc cân bằng giữa chuyên môn và cuộc sống.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Kinh tế.\n' +
      '- Quản lý thời gian tốt vì dự án kiểm toán có mốc giao việc chặt.\n' +
      '- Thành thạo Excel và có khả năng làm việc theo nhóm.',
  },
  {
    slug: 'forvis-mazars-accounting-outsourcing-intern',
    company: 'forvis-mazars',
    title: 'Thực tập sinh Kế toán & Dịch vụ Vận hành (Accounting and Outsourcing Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [5500000, 8500000],
    skills: ['Accounting', 'Payroll', 'Excel', 'ERP', 'English'],
    quota: 4,
    deadline: 30,
    description:
      'Bạn sẽ hỗ trợ khách hanh về kế toán, tính lương và báo cáo định kỳ trong mô hình dịch vụ vận hành.\n' +
      'Đây là lĩnh vực có nhu cầu tuyển dụng ổn định tại Đà Nẵng.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Quản trị nhân sự.\n' +
      '- Cẩn thận với số liệu lương và bảo mật thông tin khách hàng.\n' +
      '- Sử dụng tốt Excel và phần mềm kế toán.',
  },
  {
    slug: 'forvis-mazars-tax-intern',
    company: 'forvis-mazars',
    title: 'Thực tập sinh Tư vấn Thuế (Tax Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [5500000, 8500000],
    skills: ['Tax', 'ETAX', 'Excel', 'Research', 'English'],
    quota: 3,
    deadline: 26,
    description:
      'Bạn sẽ hỗ trợ lập tờ khai thuế, theo dõi lịch nộp và rà soát các khoản thuế phát sinh trong năm.\n' +
      'Công việc tập trung vào tuân thủ và lập hồ sơ có hệ thống.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Luật.\n' +
      '- Nắm hiểu cơ bản về thuế GTGT và thuế TNCN.\n' +
      '- Tỉ mỉ và biết sắp xếp hồ sơ.',
  },
  {
    slug: 'forvis-mazars-advisory-intern',
    company: 'forvis-mazars',
    title: 'Thực tập sinh Tư vấn Kinh doanh (Business Advisory Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Đà Nẵng',
    salary: [6000000, 9000000],
    skills: ['Business Advisory', 'Process', 'Excel', 'English', 'Communication'],
    quota: 2,
    deadline: 33,
    description:
      'Bạn sẽ tham gia các dự án cải tiến vận hành, gồm khảo sát hiện trạng và xây dựng báo cáo đề xuất cho khách hàng.\n' +
      'Công việc giúp bạn hiểu cách một doanh nghiệp vận hành và đo lường hiệu quả.',
    requirements:
      '- Năm cuối ngành Kinh tế, Quản trị hoặc Kỹ thuật Công nghiệp.\n' +
      '- Khả năng trình bày ý tưởng rõ ràng.\n' +
      '- Sẵn sàng đi làm việc tại địa điểm khách hàng trong thành phố.',
  },

  // ------------------------------------------------------------------- RSM
  {
    slug: 'rsm-audit-intern',
    company: 'rsm',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6500000, 10500000],
    skills: ['Audit', 'Accounting', 'Excel', 'IFRS', 'English'],
    quota: 6,
    deadline: 29,
    description:
      'Bạn sẽ tham gia kiểm toán các công ty trong nhiều ngành, bao gồm kiểm tra số dư, phân tích biến động và soạn hồ sơ kiểm toán.\n' +
      'Lộ trình đào tạo theo nhóm giúp bạn nhanh chóng lấy được chứng chỉ nghề nghiệp.',
    requirements:
      '- Năm cuối ngành Kế toán, Kiểm toán hoặc Tài chính.\n' +
      '- Tiếng Anh đọc hiểu tài liệu chuyên ngành.\n' +
      '- Tỉ mỉ trong đối chiếu số liệu.',
  },
  {
    slug: 'rsm-tax-intern',
    company: 'rsm',
    title: 'Thực tập sinh Thuế (Tax Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [5500000, 8500000],
    skills: ['Tax', 'Compliance', 'Excel', 'ETAX', 'English'],
    quota: 3,
    deadline: 31,
    description:
      'Bạn sẽ hỗ trợ rà soát hồ sơ thuế, lập bảng đối chiếu và cập nhật tình hình tuân thủ của khách hàng.\n' +
      'Công việc gắn với lịch nộp tờ khai theo quý và theo năm.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Luật.\n' +
      '- Khả năng sắp xếp và đối chiếu hồ sơ.\n' +
      '- Sử dụng tốt Excel.',
  },
  {
    slug: 'rsm-accounting-advisory-intern',
    company: 'rsm',
    title: 'Thực tập sinh Kế toán - Tư vấn (Accounting and Advisory Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [6000000, 9000000],
    skills: ['Accounting', 'IFRS', 'Excel', 'Advisory', 'English'],
    quota: 3,
    hot: true,
    deadline: 24,
    description:
      'Bạn sẽ hỗ trợ đội tư vấn trong việc chuyển đổi hệ thống kế toán và lập báo cáo quản trị cho khách hàng.\n' +
      'Công việc kết hợp giữa kiến thức kế toán và kỹ năng phân tích.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Quản trị.\n' +
      '- Nắm chuẩn IFRS và hiểu nguyên lý hoạch toán.\n' +
      '- Sẵn sàng học công cụ báo cáo mới.',
  },
  {
    slug: 'rsm-accounting-manager',
    company: 'rsm',
    title: 'Kế toán Trưởng (Accounting Manager)',
    jobType: 'Full-time',
    location: 'Cầu Giấy, Hà Nội',
    salary: [25000000, 40000000],
    skills: ['Accounting', 'Tax', 'Management', 'Reporting', 'English'],
    quota: 1,
    deadline: 16,
    description:
      'Bạn sẽ quản lý toàn bộ công tác kế toán của nhóm khách hàng, bao gồm chu kỳ ghi sổ, báo cáo thuế và tổ chức kiểm soát nội bộ.\n' +
      'Vị trí phù hợp với kỹ sư kế toán muốn chuyển sang vai trò quản lý.',
    requirements:
      '- Trên 5 năm kinh nghiệm kế toán, tối thiểu 2 năm ở vị trí trưởng/phó.\n' +
      '- Có chứng chỉ CPA hoặc ACCA.\n' +
      '- Kỹ năng lãnh đạo nhóm và giao tiếp với khách hàng.',
  },

  // ------------------------------------------------------------------- BDO
  {
    slug: 'bdo-audit-intern',
    company: 'bdo',
    title: 'Thực tập sinh Kiểm toán (Audit Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [6000000, 10000000],
    skills: ['Audit', 'Accounting', 'Excel', 'SME', 'English'],
    quota: 5,
    deadline: 30,
    description:
      'Bạn sẽ hỗ trợ kiểm toán doanh nghiệp vừa và nhỏ, kiểm tra sổ sách, chứng từ và xác nhận số dư với khách hàng.\n' +
      'Công việc thường xuyên được hướng dẫn trực tiếp bởi kiểm toán viên có kinh nghiệm.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Kinh tế.\n' +
      '- Đi lại linh hoạt, chịu được áp lực cuối kỳ kiểm toán.\n' +
      '- Cẩn thận và chính xác trong công việc đối chiếu.',
  },
  {
    slug: 'bdo-tax-intern',
    company: 'bdo',
    title: 'Thực tập sinh Thuế (Tax Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [5500000, 8500000],
    skills: ['Tax', 'VAT', 'Excel', 'ETAX', 'English'],
    quota: 3,
    deadline: 27,
    description:
      'Bạn sẽ hỗ trợ lập hồ sơ thuế, kiểm tra tính hợp lệ của chi phí và cập nhật tình hình tuân thủ thuế của khách hàng.\n' +
      'Công việc gồm cả hỗ trợ khách hàng giải đáp các câu hỏi thường gặp về thuế.',
    requirements:
      '- Năm cuối ngành Kế toán, Tài chính hoặc Luật.\n' +
      '- Nắm hiểu nguyên tắc tính thuế GTGT và hạn nộp tờ khai.\n' +
      '- Giao tiếp rõ ràng với khách hàng.',
  },
  {
    slug: 'bdo-accounting-intern',
    company: 'bdo',
    title: 'Thực tập sinh Kế toán (Accounting Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [5500000, 8500000],
    skills: ['Accounting', 'ERP', 'Excel', 'Payroll', 'English'],
    quota: 4,
    deadline: 32,
    description:
      'Bạn sẽ hỗ trợ bộ phận kế toán về ghi sổ, tính lương và lập báo cáo thuế định kỳ cho khách hàng.\n' +
      'Công việc gần gũi với thực tế kế toán trong doanh nghiệp.',
    requirements:
      '- Năm cuối ngành Kế toán hoặc Tài chính.\n' +
      '- Từng dùng phần mềm kế toán trong học tập.\n' +
      '- Chịu được sự thay đổi trong quy trình tính lương.',
  },
  {
    slug: 'bdo-advisory-intern',
    company: 'bdo',
    title: 'Thực tập sinh Tư vấn (Business Advisory Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [5500000, 8500000],
    skills: ['Advisory', 'Financial Analysis', 'Excel', 'English', 'Research'],
    quota: 2,
    deadline: 25,
    description:
      'Bạn sẽ hỗ trợ dự án tư vấn với phần tài liệu, dữ liệu và phân tích tài chính theo yêu cầu của dự án.\n' +
      'Đây là vị trí linh hoạt về thời gian, phù hợp lịch học.',
    requirements:
      '- Năm cuối ngành Kinh tế, Tài chính hoặc Quản trị.\n' +
      '- Sử dụng tốt Excel và có khả năng tổng hợp tài liệu.\n' +
      '- Tiếng Anh đọc tài liệu chuyên ngành.',
  },
];
