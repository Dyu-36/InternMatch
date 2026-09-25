// Sales, channel and logistics-revenue demo postings. See jobs.mjs for the
// field contract. All postings are fictional.

/** @type {Array<Record<string, unknown>>} */
export const salesJobs = [
  // ------------------------------------------------------------- Coca-Cola
  {
    slug: 'coca-cola-sales-intern',
    company: 'coca-cola',
    title: 'Thực tập sinh Kinh doanh (Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [5000000, 8000000],
    skills: ['Sales', 'Negotiation', 'Route Sales', 'Excel', 'Communication'],
    quota: 12,
    featured: true,
    hot: true,
    deadline: 20,
    description:
      'Bạn sẽ đi tuyến bán hàng tại các điểm bán lẻ, theo dõi tồn kho, thu tiền và trưng bày sản phẩm theo quy chuẩn.\n' +
      'Công việc giúp bạn hiểu rõ thị trường đồ uống và phát triển kỹ năng bán hàng thực chiến.',
    requirements:
      '- Sinh viên đang học ngành Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Ngoại trình, sức khỏe tốt, sẵn sàng di chuyển trong thành phố.\n' +
      '- Có thể làm việc 3 buổi tối hoặc cuối tuần mỗi tuần.\n' +
      '- Ưu tiên ứng viên từng làm thực tập kinh doanh.',
  },
  {
    slug: 'coca-cola-sales-executive',
    company: 'coca-cola',
    title: 'Nhân viên Kinh doanh Hiện Trường (Field Sales Executive)',
    jobType: 'Full-time',
    location: 'Hoàn Kiếm, Hà Nội',
    salary: [9000000, 15000000],
    skills: ['Sales', 'FMCG', 'Negotiation', 'Route Planning', 'English'],
    quota: 6,
    deadline: 28,
    description:
      'Bạn sẽ phụ trách một nhóm tuyến bán hàng, phát triển số điểm bán mới và chăm sóc khách hàng hiện trường.\n' +
      'Vị trí có lộ trình lên vị trí giám sát bán hàng trong 12 tháng.',
    requirements:
      '- 1 năm kinh nghiệm bán hàng thực địa trong ngành hàng tiêu dùng.\n' +
      '- Kỹ năng thuyết phục và xử lý phản đối tốt.\n' +
      '- Sử dụng tốt Excel và ứng dụng bản đồ trên điện thoại.',
  },
  {
    slug: 'coca-cola-channel-executive',
    company: 'coca-cola',
    title: 'Chuyên viên Phát triển Kênh bán hàng (Channel Development Executive)',
    jobType: 'Full-time',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [11000000, 18000000],
    skills: ['Channel Management', 'Sales', 'Distribution', 'Excel', 'English'],
    quota: 3,
    deadline: 26,
    description:
      'Bạn sẽ xây dựng và mở rộng mạng lưới phân phối, hỗ trợ nhà phân phối đạt chỉ tiêu doanh thu theo khu vực.\n' +
      'Công việc gồm cả khảo sát thị trường và đề xuất chương trình hỗ trợ bán hàng.',
    requirements:
      '- 2 năm kinh nghiệm quản lý kênh bán hàng hoặc kinh doanh phân phối.\n' +
      '- Thành thạo Excel và công cụ theo dõi doanh thu.\n' +
      '- Khả năng làm việc theo chỉ tiêu áp lực cao.',
  },
  {
    slug: 'coca-cola-marketing-intern',
    company: 'coca-cola',
    title: 'Thực tập sinh Quản trị Bán hàng (Trade Marketing Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [5000000, 8000000],
    skills: ['Trade Marketing', 'Sales Data', 'Excel', 'Retail', 'English'],
    quota: 4,
    deadline: 29,
    description:
      'Bạn sẽ phân tích dữ liệu bán hàng tại các điểm bán, hỗ trợ thiết kế chương trình khuyến mãi và theo dõi hiệu quả thực hiện.\n' +
      'Công việc kết hợp giữa số liệu và hiểu biết về thị trường bán lẻ.',
    requirements:
      '- Năm cuối ngành Marketing, Kinh tế hoặc Quản trị.\n' +
      '- Thành thạo Excel và biết trực quan hóa dữ liệu cơ bản.\n' +
      '- Từng tham gia chương trình nghiên cứu thị trường là một lợi thế.',
  },

  // ------------------------------------------------------------------ Pepsi
  {
    slug: 'pepsi-sales-intern',
    company: 'pepsi',
    title: 'Thực tập sinh Kinh doanh (Sales Development Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 7, TP. Hồ Chí Minh',
    salary: [5000000, 8500000],
    skills: ['Sales', 'FMCG', 'CRM', 'Negotiation', 'English'],
    quota: 10,
    featured: true,
    deadline: 21,
    description:
      'Bạn sẽ hỗ trợ nhóm kinh doanh tìm kiếm điểm bán mới, gọi điện chào hàng và theo dõi đơn hàng trên hệ thống CRM.\n' +
      'Đây là chương trình tuyển dụng quản lý bán hàng trẻ, thường xuyên có suất học nâng cao.',
    requirements:
      '- Sinh viên năm cuối hoặc mới tốt nghiệp ngành Kinh tế, Marketing.\n' +
      '- Ngoại trình, không ngại gọi điện và bán hàng.\n' +
      '- Tiếng Anh giao tiếp cơ bản.',
  },
  {
    slug: 'pepsi-field-sales-executive',
    company: 'pepsi',
    title: 'Nhân viên Kinh doanh (Field Sales Executive)',
    jobType: 'Full-time',
    location: 'Quận 7, TP. Hồ Chí Minh',
    salary: [9000000, 14000000],
    skills: ['Sales', 'FMCG', 'Route Sales', 'Excel', 'Motorcycle License'],
    quota: 8,
    hot: true,
    deadline: 24,
    description:
      'Bạn sẽ phụ trách địa bàn phân phối cố định, đảm bảo tồn kho tại các điểm bán và thực hiện chương trình trưng bày.\n' +
      'Công việc có xe công tác và phụ cấu đi lại theo chính sách công ty.',
    requirements:
      '- 1 năm kinh nghiệm bán hàng thực địa.\n' +
      '- Có giấy phép lái xe máy và sẵn sàng di chuyển nhiều.\n' +
      '- Sức khỏe tốt, chịu được điều kiện làm việc ngoài trời.',
  },
  {
    slug: 'pepsi-key-account-executive',
    company: 'pepsi',
    title: 'Chuyên viên Chăm sóc Khách hàng Lớn (Key Account Executive)',
    jobType: 'Full-time',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [13000000, 20000000],
    skills: ['Key Account', 'Negotiation', 'Sales', 'Category Management', 'English'],
    quota: 3,
    deadline: 23,
    description:
      'Bạn sẽ quản lý các chuỗi siêu thị và cửa hàng lớn, thương thảo điều kiện thương mại và duy trì mức độ hợp tác.\n' +
      'Công việc gồm cả lập kế hoạch chi tiêu theo từng nhóm khách hàng.',
    requirements:
      '- 2 năm kinh nghiệm quản lý khách hàng trong ngành hàng nhanh tiêu dùng.\n' +
      '- Kỹ năng đàm phán và tư duy thương mại tốt.\n' +
      '- Tiếng Anh tốt là bắt buộc.',
  },
  {
    slug: 'pepsi-business-intelligence-intern',
    company: 'pepsi',
    title: 'Thực tập sinh Phân tích Kinh doanh (Sales Operations Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 7, TP. Hồ Chí Minh',
    salary: [6000000, 9500000],
    skills: ['Excel', 'Power BI', 'Data Analysis', 'Sales Operations', 'English'],
    quota: 3,
    deadline: 31,
    description:
      'Bạn sẽ tổng hợp và phân tích dữ liệu doanh thu theo khu vực, chuẩn bị báo cáo cho cuộc họp kinh doanh hằng tuần.\n' +
      'Công việc đòi hỏi sự chính xác và khả năng trình bày số liệu rõ ràng.',
    requirements:
      '- Năm cuối ngành Kinh tế, Thống kê hoặc Công nghệ thông tin.\n' +
      '- Thành thạo Excel và có kiến thức về công cụ trực quan hóa dữ liệu.\n' +
      '- Tinh thần cẩn trọng với số liệu.',
  },

  // ----------------------------------------------------------------- Nestlé
  {
    slug: 'nestle-sales-intern',
    company: 'nestle',
    title: 'Thực tập sinh Kinh doanh (Sales Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hòa Khánh, Đà Nẵng',
    salary: [5500000, 9000000],
    skills: ['Sales', 'Distribution', 'FMCG', 'Excel', 'Communication'],
    quota: 8,
    featured: true,
    deadline: 25,
    description:
      'Bạn sẽ hỗ trợ nhóm kinh doanh quản lý các tuyến bán hàng tại khu vực miền Trung, theo dõi chỉ tiêu và tồn kho hằng ngày.\n' +
      'Công việc có cơ hội tiếp cận quy trình sản xuất tại nhà máy trong một ngày định hướng.',
    requirements:
      '- Sinh viên ngành Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Sẵn sàng làm việc di chuyển trong khu vực Đà Nẵng và lân cận.\n' +
      '- Ngoại trình, kiên trì trong công việc bán hàng.',
  },
  {
    slug: 'nestle-district-manager-trainee',
    company: 'nestle',
    title: 'Quản lý Địa bàn Tập sự (District Sales Trainee)',
    jobType: 'Full-time',
    location: 'Đà Nẵng',
    salary: [11000000, 17000000],
    skills: ['Sales Management', 'FMCG', 'Teamwork', 'Excel', 'English'],
    quota: 4,
    hot: true,
    deadline: -9,
    posted: 44,
    description:
      'Bạn sẽ quản lý một nhóm tuyến bán hàng, theo dõi chỉ tiêu doanh thu và huấn luyện nhân viên kinh doanh mới.\n' +
      'Đây là chương trình dành cho người tốt nghiệp, kết hợp đào tạo và làm việc thực tế 24 tháng.',
    requirements:
      '- Tốt nghiệp Kinh tế, Marketing, Quản trị hoặc Công nghệ thông tin.\n' +
      '- Ưu tiên ứng viên từng tham gia hoạt động tình nguyện hoặc phong trào sinh viên.\n' +
      '- Khả năng chịu áp lực chỉ tiêu và đi làm việc nhiều địa bàn.',
  },
  {
    slug: 'nestle-merchandiser-intern',
    company: 'nestle',
    title: 'Thực tập sinh Trưng bày Sản phẩm (Merchandiser Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hòa Khánh, Đà Nẵng',
    salary: [5000000, 8000000],
    skills: ['Merchandising', 'Retail', 'Excel', 'Field Work', 'English'],
    quota: 4,
    deadline: 28,
    description:
      'Bạn sẽ đảm bảo hình ảnh trưng bày sản phẩm tại các cửa hàng tuân thủ tiêu chuẩn của công ty.\n' +
      'Công việc gồm kiểm tra định kỳ, ghi nhận hình ảnh và đề xuất điều chỉnh tại điểm bán.',
    requirements:
      '- Sinh viên ngành Marketing, Quản trị hoặc Thiết kế Công nghiệp.\n' +
      '- Cẩn trọng, biết quan sát chi tiết trong hình ảnh.\n' +
      '- Sẵn sàng đi làm việc thực địa tại các điểm bán.',
  },
  {
    slug: 'nestle-e-commerce-intern',
    company: 'nestle',
    title: 'Thực tập sinh Kinh doanh Thương mại Điện tử (E-commerce Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [6000000, 9000000],
    skills: ['E-commerce', 'Marketplace', 'Excel', 'Content', 'English'],
    quota: 3,
    deadline: 30,
    description:
      'Bạn sẽ theo dõi hiệu quả bán hàng trên các sàn thương mại điện tử, tối ưu mô tả sản phẩm và phân tích chỉ số đơn hàng.\n' +
      'Công việc phù hợp với bạn quan tâm kênh bán hàng số.',
    requirements:
      '- Năm cuối ngành Marketing, Kinh tế hoặc Công nghệ thông tin.\n' +
      '- Quen thuộc với ít nhất một sàn thương mại điện tử.\n' +
      '- Kỹ năng phân tích dữ liệu bán hàng cơ bản.',
  },

  // --------------------------------------------------------------- Unilever
  {
    slug: 'unilever-sales-intern',
    company: 'unilever',
    title: 'Thực tập sinh Kinh doanh (Sales Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 7, TP. Hồ Chí Minh',
    salary: [5500000, 9000000],
    skills: ['Sales', 'FMCG', 'Negotiation', 'Excel', 'English'],
    quota: 6,
    featured: true,
    deadline: 22,
    description:
      'Bạn sẽ làm việc trong nhóm bán hàng với danh mục sản phẩm tiêu dùng nhanh, hỗ trợ xây dựng kế hoạch kinh doanh theo tuyến.\n' +
      'Công việc gồm cả gặp gỡ nhà bán lẻ để tìm hiểu nhu cầu thị trường.',
    requirements:
      '- Năm cuối ngành Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Năng lượng và tinh thần cầu tiến trong học tập và làm việc.\n' +
      '- Ưu tiên ứng viên từng tham gia bán hàng trong thời gian sinh viên.',
  },
  {
    slug: 'unilever-sales-manager',
    company: 'unilever',
    title: 'Quản lý Bán hàng (Sales Manager)',
    jobType: 'Full-time',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [18000000, 28000000],
    skills: ['Sales Management', 'FMCG', 'Team Leadership', 'Excel', 'English'],
    quota: 2,
    hot: true,
    deadline: 18,
    description:
      'Bạn sẽ quản lý đội kinh doanh địa bàn, xây dựng kế hoạch bán hàng theo quý và phát triển đội ngũ nhân viên tuyến.\n' +
      'Công việc đo lường rõ ràng bằng chỉ số doanh thu và độ phủ.',
    requirements:
      '- 3 năm kinh nghiệm kinh doanh FMCG, trong đó 1 năm quản lý nhóm.\n' +
      '- Kỹ năng lãnh đạo và truyền động lực cho đội ngũ tuyến.\n' +
      '- Tiếng Anh giao tiếp tốt.',
  },
  {
    slug: 'unilever-trade-intern',
    company: 'unilever',
    title: 'Thực tập sinh Trade Marketing',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [5500000, 8500000],
    skills: ['Trade Marketing', 'Retail', 'Excel', 'Insights', 'English'],
    quota: 3,
    deadline: 26,
    description:
      'Bạn sẽ hỗ trợ chuẩn bị kế hoạch kích hoạt cho từng kênh bán, phân tích dữ liệu bán hàng và đánh giá hiệu quả chương trình.\n' +
      'Công việc tiếp giáp giữa bộ phận kinh doanh và bộ phận sản phẩm.',
    requirements:
      '- Năm cuối ngành Marketing, Kinh tế hoặc Quản trị.\n' +
      '- Sử dụng tốt Excel và biết đọc dữ liệu bán lẻ.\n' +
      '- Có kiến thức nền về hành vi người tiêu dùng.',
  },
  {
    slug: 'unilever-retail-intern',
    company: 'unilever',
    title: 'Thực tập sinh Bán lẻ (Retail Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [5000000, 8000000],
    skills: ['Retail', 'Sales', 'Visual Merchandising', 'Communication', 'English'],
    quota: 4,
    deadline: 29,
    description:
      'Bạn sẽ hỗ trợ quản lý bán hàng tại các cửa hàng chuỗi, kiểm tra tồn kho trên kệ và hỗ trợ khách hàng tại điểm bán.\n' +
      'Đây là cơ hội hiểu rõ cách siêu thị vận hành và quản lý chuỗi.',
    requirements:
      '- Sinh viên ngành Marketing, Quản trị, Kinh tế hoặc Bán hàng.\n' +
      '- Lịch làm việc linh hoạt, sẵn sàng làm cuối tuần.\n' +
      '- Ngoại trình và thích tương tác với khách hàng.',
  },

  // ----------------------------------------------------------------- FedEx
  {
    slug: 'fedex-sales-intern',
    company: 'fedex',
    title: 'Thực tập sinh Kinh doanh Dịch vụ Logistics (Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đông Hà Nội, Hà Nội',
    salary: [6000000, 9500000],
    skills: ['Sales', 'Logistics', 'CRM', 'English', 'Negotiation'],
    quota: 6,
    featured: true,
    deadline: 24,
    description:
      'Bạn sẽ hỗ trợ tìm kiếm khách hàng có nhu cầu vận chuyển, tư vấn dịch vụ và soạn báo giá theo khối lượng hàng hóa.\n' +
      'Công việc gồm cả theo dõi lịch trình hàng và báo cáo doanh thu theo tuần.',
    requirements:
      '- Năm cuối ngành Kinh tế, Marketing hoặc Logistics.\n' +
      '- Tiếng Anh giao tiếp tốt vì khách hàng phần lớn là doanh nghiệp xuất nhập khẩu.\n' +
      '- Cẩn thận với chi tiết và sẵn sàng học nghiệp vụ mới.',
  },
  {
    slug: 'fedex-key-account-executive',
    company: 'fedex',
    title: 'Chuyên viên Khách hàng Doanh nghiệp (Key Account Executive)',
    jobType: 'Full-time',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [14000000, 22000000],
    skills: ['Key Account', 'Logistics', 'Negotiation', 'CRM', 'English'],
    quota: 4,
    hot: true,
    deadline: 20,
    description:
      'Bạn sẽ phụ trách một danh sách khách hàng doanh nghiệp, duy trì tỷ lệ gia hạn và đề xuất tối ưu chi phí vận chuyển cho khách hàng.\n' +
      'Công việc gần với đội vận hành để đảm bảo chất lượng dịch vụ.',
    requirements:
      '- 2 năm kinh nghiệm kinh doanh dịch vụ hoặc xuất nhập khẩu.\n' +
      '- Tiếng Anh thành thạo, có kinh nghiệm làm việc với khách hàng B2B.\n' +
      '- Kỹ năng quản lý thời gian và ưu tiên công việc theo mức độ khẩn cấp.',
  },
  {
    slug: 'fedex-operations-intern',
    company: 'fedex',
    title: 'Thực tập sinh Vận hành Logistics (Operations Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Đông Hà Nội, Hà Nội',
    salary: [6000000, 9000000],
    skills: ['Logistics', 'Excel', 'Data Processing', 'English', 'Problem Solving'],
    quota: 5,
    deadline: 27,
    description:
      'Bạn sẽ theo dõi lịch trình hàng hóa, cập nhật trạng thái đơn và hỗ trợ xử lý các vấn đề giao nhận phát sinh.\n' +
      'Công việc giúp bạn hiểu toàn bộ chuỗi vận hành của một hãng vận chuyển quốc tế.',
    requirements:
      '- Sinh viên ngành Logistics, Quản trị Kinh doanh hoặc Công nghệ thông tin.\n' +
      '- Thành thạo Excel và biết xử lý dữ liệu bảng.\n' +
      '- Cẩn trọng và không ngại làm việc theo ca.',
  },
  {
    slug: 'fedex-customs-broker-intern',
    company: 'fedex',
    title: 'Thực tập sinh Hải quan và Thủ tục Xuất nhập khẩu (Customs Broker Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6000000, 9500000],
    skills: ['Customs', 'Import Export', 'Documentation', 'English', 'Excel'],
    quota: 3,
    deadline: 25,
    description:
      'Bạn sẽ hỗ trợ hoàn thiện chứng từ thuế, hồ sơ hải quan và theo dõi thông báo của cơ quan hải quan.\n' +
      'Công việc yêu cầu chính xác tuyệt đối trong giấy tờ.',
    requirements:
      '- Năm cuối ngành Luật, Logistics, Kinh tế quốc tế hoặc Công nghệ thông tin.\n' +
      '- Nắm khái niệm cơ bản về thủ tục xuất nhập khẩu.\n' +
      '- Tiếng Anh đọc hiểu văn bản thương mại quốc tế.',
  },

  // ------------------------------------------------------------------- DHL
  {
    slug: 'dhl-sales-intern',
    company: 'dhl',
    title: 'Thực tập sinh Kinh doanh Dịch vụ Chuyển phát (Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Tân Bình, TP. Hồ Chí Minh',
    salary: [6000000, 9000000],
    skills: ['Sales', 'Logistics', 'CRM', 'English', 'Communication'],
    quota: 6,
    deadline: 23,
    description:
      'Bạn sẽ hỗ trợ nhóm kinh doanh tìm kiếm khách hàng, tư vấn giải pháp vận chuyển và duy trì mối quan hệ với khách hàng hiện tại.\n' +
      'Công việc sử dụng nhiều hệ thống nội bộ nên bạn được đào tạo ngay từ đầu.',
    requirements:
      '- Sinh viên năm cuối ngành Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Tiếng Anh đọc hiểu tài liệu và giao tiếp cơ bản.\n' +
      '- Ngoại trình, sẵn sàng gặp gỡ khách hàng doanh nghiệp.',
  },
  {
    slug: 'dhl-country-manager-trainee',
    company: 'dhl',
    title: 'Quản lý Quốc gia Tập sự (Country Manager Trainee)',
    jobType: 'Full-time',
    location: 'Tân Bình, TP. Hồ Chí Minh',
    salary: [13000000, 20000000],
    skills: ['Leadership', 'Logistics', 'Sales', 'English', 'Problem Solving'],
    quota: 2,
    featured: true,
    hot: true,
    deadline: 17,
    description:
      'Bạn sẽ luân chuyển qua các bộ phận từ vận hành, kinh doanh đến chăm sóc khách hàng trước khi đảm nhiệm vị trí quản lý.\n' +
      'Chương trình kéo dài 18 tháng với cơ hội làm việc tại nhiều thị trường khác nhau.',
    requirements:
      '- Tốt nghiệp ngành Kinh tế, Logistics, Quản trị hoặc Kỹ thuật.\n' +
      '- Tiếng Anh trôi chảy, sẵn sàng công tác nước ngoài.\n' +
      '- Tinh thần cầu tiến, chịu được thay đổi môi trường làm việc.',
  },
  {
    slug: 'dhl-customer-service-intern',
    company: 'dhl',
    title: 'Thực tập sinh Chăm sóc Khách hàng (Customer Service Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [5000000, 8000000],
    skills: ['Customer Service', 'English', 'Ticketing', 'Communication', 'Problem Solving'],
    quota: 8,
    deadline: 28,
    description:
      'Bạn sẽ tiếp nhận và trao đổi với khách hàng qua điện thoại và email, cập nhật trạng thái lô hàng và xử lý khiếu nại.\n' +
      'Đội có đào tạo nghiệp vụ và phong cách giao tiếp chuẩn quốc tế.',
    requirements:
      '- Sinh viên ngành Kinh tế, Quản trị, Ngôn ngữ Anh hoặc Công nghệ thông tin.\n' +
      '- Tiếng Anh giao tiếp khá, phát âm rõ ràng.\n' +
      '- Kiên nhẫn và tinh thần phục vụ khách hàng.',
  },
  {
    slug: 'dhl-freight-forwarder-intern',
    company: 'dhl',
    title: 'Thực tập sinh Xuất nhập khẩu Hàng không khí (Air Freight Forwarder Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Tân Bình, TP. Hồ Chí Minh',
    salary: [6500000, 9500000],
    skills: ['Freight Forwarding', 'Air Cargo', 'English', 'Documentation', 'Excel'],
    quota: 4,
    deadline: 26,
    description:
      'Bạn sẽ hỗ trợ lập báo giá, đặt chuyến và theo dõi lịch trình chuyến hàng không khí cho khách hàng.\n' +
      'Công việc gần với hoạt động xuất nhập khẩu thực tế của doanh nghiệp.',
    requirements:
      '- Năm cuối ngành Logistics, Kinh tế quốc tế hoặc Kinh tế.\n' +
      '- Tiếng Anh giao tiếp tốt, biết thuật ngữ logistics cơ bản.\n' +
      '- Chăm chỉ với chứng từ và lịch trình.',
  },

  // ------------------------------------------------------------------- IKEA
  {
    slug: 'ikea-sales-advisor-intern',
    company: 'ikea',
    title: 'Thực tập sinh Tư vấn Bán hàng (Sales Advisor Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [5000000, 7500000],
    skills: ['Retail', 'Sales', 'Customer Service', 'Communication', 'English'],
    quota: 12,
    featured: true,
    deadline: 21,
    description:
      'Bạn sẽ tư vấn khách tham quan về sản phẩm nội thất, hỗ trợ khách tìm hiểu lắp đặt và thanh toán tại quầy.\n' +
      'Đây là vị trí tiếp xúc trực tiếp với khách hàng và được đào tạo bài bản theo tiêu chuẩn quốc tế.',
    requirements:
      '- Sinh viên đang theo học bất kỳ ngành nào, ưu tiên Marketing hoặc Quản trị.\n' +
      '- Lịch làm việc linh hoạt, sẵn sàng làm cuối tuần và ca đêm.\n' +
      '- Thân thiện, kiên nhẫn và thích tư vấn bán hàng.\n' +
      '- Tiếng Anh là một lợi thế rõ ràng.',
  },
  {
    slug: 'ikea-b2b-sales-intern',
    company: 'ikea',
    title: 'Thực tập sinh Kinh doanh Khách hàng Doanh nghiệp (B2B Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [6500000, 9500000],
    skills: ['B2B Sales', 'CRM', 'Interior', 'Negotiation', 'English'],
    quota: 4,
    deadline: 24,
    description:
      'Bạn sẽ tìm kiếm khách hàng doanh nghiệp cần trang trí văn phòng, khép phụng dự án và duy trì quan hệ khách hàng.\n' +
      'Công việc thường theo chu kỳ dự án nên lịch làm việc linh hoạt.',
    requirements:
      '- Năm cuối ngành Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Có khả năng đàm phán và trình bày giá trị sản phẩm.\n' +
      '- Tiếng Anh đọc hiểu tài liệu chuyên ngành nội thất là một lợi thế.',
  },
  {
    slug: 'ikea-store-manager',
    company: 'ikea',
    title: 'Quản lý Cửa hàng (Store Manager)',
    jobType: 'Full-time',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [18000000, 28000000],
    skills: ['Retail Management', 'Leadership', 'Sales', 'KPI', 'English'],
    quota: 1,
    hot: true,
    deadline: -4,
    posted: 35,
    description:
      'Bạn sẽ quản lý toàn bộ hoạt động của cửa hàng, bao gồm doanh thu, trải nghiệm khách hàng và đội ngũ nhân sự.\n' +
      'Vị trí đi kèm chương trình đào tạo quản lý kế tiếp trong hệ thống quốc tế.',
    requirements:
      '- 4 năm kinh nghiệm bán lẻ, trong đó 2 năm làm quản lý cửa hàng.\n' +
      '- Kỹ năng lãnh đạo nhóm và quản lý chỉ tiêu kinh doanh.\n' +
      '- Tiếng Anh giao tiếp tốt, sẵn sàng đào tạo nhân sự.',
  },
  {
    slug: 'ikea-merchandiser-intern',
    company: 'ikea',
    title: 'Thực tập sinh Trưng bày & Thu mua (Merchandising Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [5000000, 8000000],
    skills: ['Merchandising', 'Visual Design', 'Inventory', 'Excel', 'English'],
    quota: 4,
    deadline: 27,
    description:
      'Bạn sẽ hỗ trợ trưng bày sản phẩm theo kịch bản trưng bày, kiểm kê tồn kho và hỗ trợ hoạt động thu mua sản phẩm.\n' +
      'Công việc thể hiện kỹ năng thẩm mỹ và sắp xếp không gian.',
    requirements:
      '- Sinh viên ngành Thiết kế Nội thất, Kiến trúc, Marketing hoặc Quản trị.\n' +
      '- Có khả năng làm việc thể chất và đam mê trình bày sản phẩm.\n' +
      '- Tỉ mỉ trong kiểm kê số liệu tồn kho.',
  },

  // ----------------------------------------------------------------- Viettel
  {
    slug: 'viettel-sales-intern',
    company: 'viettel',
    title: 'Thực tập sinh Kinh doanh Viễn thông (Telecom Sales Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [5000000, 8000000],
    skills: ['Sales', 'Telecom', 'CRM', 'Communication', 'English'],
    quota: 15,
    featured: true,
    hot: true,
    deadline: 19,
    description:
      'Bạn sẽ hỗ trợ đội kinh doanh giải pháp cho khách hàng cá nhân và doanh nghiệp, tư vấn các gói cước và dịch vụ số.\n' +
      'Công việc được hỗ trợ đào tạo nghiệp vụ từ đầu và có thưởng theo chỉ tiêu.',
    requirements:
      '- Sinh viên đang học, ưu tiên ngành Marketing, Quản trị, Kinh tế hoặc Công nghệ thông tin.\n' +
      '- Ngoại trình, giao tiếp tốt và sẵn sàng làm việc ngoài giờ.\n' +
      '- Tinh thần phục vụ khách hàng là điểm được đánh giá cao.',
  },
  {
    slug: 'viettel-b2b-executive',
    company: 'viettel',
    title: 'Chuyên viên Kinh doanh Doanh nghiệp (B2B Sales Executive)',
    jobType: 'Full-time',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [12000000, 19000000],
    skills: ['B2B Sales', 'Telecom', 'Solution Selling', 'Negotiation', 'English'],
    quota: 4,
    deadline: 22,
    description:
      'Bạn sẽ tiếp cận doanh nghiệp, tư vấn giải pháp kết nối và truyền thông số, phát triển hợp đồng dài hạn.\n' +
      'Công việc gắn với chuyển đổi số của khách hàng trong nhiều ngành.',
    requirements:
      '- 2 năm kinh nghiệm kinh doanh B2B, ưu tiên trong ngành viễn thông hoặc công nghệ.\n' +
      '- Kỹ năng trình bày giá trị giải pháp và xử lý phản đối.\n' +
      '- Tiếng Anh đọc hiểu tài liệu kỹ thuật.',
  },
  {
    slug: 'viettel-channel-intern',
    company: 'viettel',
    title: 'Thực tập sinh Quản lý Điểm bán (Channel Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [5000000, 8000000],
    skills: ['Channel', 'Retail', 'Sales', 'Excel', 'Communication'],
    quota: 8,
    deadline: 26,
    description:
      'Bạn sẽ hỗ trợ đội quản lý điểm bán tại khu vực, theo dõi doanh thu đại lý và tổ chức các chương trình kích hoạt.\n' +
      'Công việc thường xuyên di chuyển giữa các điểm bán trên địa bàn phụ trách.',
    requirements:
      '- Sinh viên ngành Marketing, Quản trị hoặc Kinh tế.\n' +
      '- Năng lực giao tiếp tốt với nhiều đối tượng khác nhau.\n' +
      '- Sẵn sàng làm việc thực địa theo lịch phân công.',
  },
  {
    slug: 'viettel-partner-manager',
    company: 'viettel',
    title: 'Quản lý Đối tác (Partner Manager)',
    jobType: 'Full-time',
    location: 'Cầu Giấy, Hà Nội',
    salary: [15000000, 24000000],
    skills: ['Partnership', 'Sales', 'Negotiation', 'CRM', 'English'],
    quota: 2,
    hot: true,
    deadline: -21,
    posted: 55,
    description:
      'Bạn sẽ xây dựng và duy trì mạng lưới đối tác phân phối, đàm phán chính sách hợp tác và theo dõi hiệu quả từng đối tác.\n' +
      'Công việc gồm cả nhận diện cơ hội hợp tác mới trong hệ sinh thái số.',
    requirements:
      '- 3 năm kinh nghiệm quản lý đối tác hoặc kinh doanh B2B.\n' +
      '- Kỹ năng đàm phán và quản lý hợp đồng thương mại.\n' +
      '- Tiếng Anh tốt là bắt buộc.',
  },
];
