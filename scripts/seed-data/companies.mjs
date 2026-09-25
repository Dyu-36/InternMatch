// Demo company catalog for the InternMatch job seed.
//
// Safety rules baked into this file:
// - Every contact field is a reserved, non-deliverable placeholder (RFC 2606
//   `.example` / RFC 2606 all-zero tax code) so nobody can be reached by accident.
// - `wikipediaTitle` + `wikidataId` point at the real public article and Wikidata
//   item. `scripts/resolve-company-logos.mjs` uses them to resolve the real,
//   externally hosted brand logo from Wikimedia Commons. Logos are never created
//   or drawn here: if the resolver cannot prove a file, `logoUrl` stays empty
//   and the UI falls back to the company initial.
// - `jobIndustry` uses the exact strings the jobs filter matches on
//   (src/components/jobs/JobsExplorer.tsx `industryMatchers`).
//
// The job postings attached to these companies are fictional demo data; the
// company description repeats that notice so the public UI cannot be mistaken
// for a real vacancy.

export const DEMO_NOTICE =
  'Hồ sơ doanh nghiệp và các tin tuyển dụng dưới đây là dữ liệu minh hoạ, không phải vị trí thực tế.';

export const JOB_INDUSTRY = {
  it: 'Công nghệ thông tin',
  accounting: 'Kế toán - Tài chính',
  sales: 'Kinh doanh - Bán hàng',
};

/**
 * @typedef {object} SeedCompany
 * @property {string} slug        stable key, also part of the reserved demo username
 * @property {string} name        real company name
 * @property {'it'|'accounting'|'sales'} category
 * @property {string} wikipediaTitle
 * @property {string} wikidataId
 * @property {string} industry    free-text industry shown on the company profile
 * @property {string} size        company size label
 * @property {string} city
 * @property {string} address
 * @property {string} website    official public site of the real company
 * @property {string} description
 * @property {string} benefits   company-wide benefits, reused by that company's jobs
 */

/** @type {SeedCompany[]} */
export const companies = [
  // ---------------------------------------------------------------- IT (9)
  {
    slug: 'microsoft',
    name: 'Microsoft',
    category: 'it',
    wikipediaTitle: 'Microsoft',
    wikidataId: 'Q2283',
    industry: 'Công nghệ thông tin',
    size: 'Trên 100.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu công nghệ Cầu Giấy, đường Dương Đình Nghệ, Hà Nội',
    website: 'https://www.microsoft.com',
    description:
      'Microsoft là tập đoàn công nghệ với hệ sinh thái Microsoft 365, Azure và các nền tảng phát triển phần mềm. ' +
      DEMO_NOTICE,
    benefits: 'Bảo hiểm sức khỏe cho gia đình, ngân sách học tập cá nhân, thiết bị làm việc chuẩn quốc tế, lộ trình nghề nghiệp rõ ràng.',
  },
  {
    slug: 'google',
    name: 'Google',
    category: 'it',
    wikipediaTitle: 'Google',
    wikidataId: 'Q95',
    industry: 'Công nghệ thông tin',
    size: 'Trên 100.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu đô thị Cầu Giấy, phố Dương Đình Nghệ, Hà Nội',
    website: 'https://about.google',
    description:
      'Google phát triển các sản phẩm như Search, Cloud, Android và YouTube, đồng thời đầu tư mạnh vào trung tâm dữ liệu tại Việt Nam. ' +
      DEMO_NOTICE,
    benefits: 'Lương cạnh tranh, quỹ cổ phiếu nhân viên, bữa ăn trưa và phòng tập, chính sách làm việc linh hoạt, đào tạo tiếng Anh.',
  },
  {
    slug: 'ibm',
    name: 'IBM',
    category: 'it',
    wikipediaTitle: 'IBM',
    wikidataId: 'Q37156',
    industry: 'Công nghệ thông tin',
    size: 'Trên 50.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu trung tâm Quận 1, đường Hàm Nghi, TP. Hồ Chí Minh',
    website: 'https://www.ibm.com',
    description:
      'IBM cung cấp nền tảng đám mây, tư vấn công nghệ và tự động hoá cho doanh nghiệp tại Việt Nam. ' + DEMO_NOTICE,
    benefits: 'Chương trình Early Career, hỗ trợ học phá cao học, bảo hiểm y tế mở rộng, ngân sách chứng chỉ quốc tế.',
  },
  {
    slug: 'intel',
    name: 'Intel',
    category: 'it',
    wikipediaTitle: 'Intel',
    wikidataId: 'Q248',
    industry: 'Công nghệ thông tin',
    size: 'Trên 50.000 nhân viên',
    city: 'Đà Nẵng',
    address: 'Khu công nghệ phía Nam, đường Lê Duẩn, Đà Nẵng',
    website: 'https://www.intel.com',
    description:
      'Intel thiết kế và sản xuất bộ vi xử lý cùng nền tảng chip tiên tiến, tuyển dụng mạnh kỹ sư tại Đà Nẵng. ' + DEMO_NOTICE,
    benefits: 'Môi trường phòng thí nghiệm thiết kế chuyên sâu, coaching của chuyên gia, phần thưởng dự án, thưởng lễ giới thiệu.',
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    category: 'it',
    wikipediaTitle: 'Nvidia',
    wikidataId: 'Q182477',
    industry: 'Công nghệ thông tin',
    size: 'Trên 10.000 nhân viên',
    city: 'Hà Nội',
    address: 'Toà nhà Detech Tower, đường Tôn Thất Thuyết, Hà Nội',
    website: 'https://www.nvidia.com',
    description:
      'NVIDIA cung cấp nền tảng tính toán tăng tốc GPU và trí tuệ nhân tạo cho trung tâm dữ liệu, xe hơi và robot. ' +
      DEMO_NOTICE,
    benefits: 'Cơ hội làm việc trên hệ sinh thái AI hàng đầu, cấp phần cứng cho nghiên cứu, hội nghị quốc tế do công ty tổ chức.',
  },
  {
    slug: 'cisco',
    name: 'Cisco',
    category: 'it',
    wikipediaTitle: 'Cisco',
    wikidataId: 'Q173395',
    industry: 'Công nghệ thông tin',
    size: 'Trên 50.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu chế xuất Thủ Đức, đường Võ Văn Kiệt, TP. Hồ Chí Minh',
    website: 'https://www.cisco.com',
    description:
      'Cisco là nhà sản xuất thiết bị mạng và an ninh mạng, tuyển dụng sinh viên theo chương trình phát triển tài năng mạng. ' +
      DEMO_NOTICE,
    benefits: 'Chương trình Freshers, đào tạo chứng chỉ CCNA do công ty chi trả, lộ trình phát triển kỹ thuật nhiều hướng.',
  },
  {
    slug: 'samsung-electronics',
    name: 'Samsung Electronics',
    category: 'it',
    wikipediaTitle: 'Samsung Electronics',
    wikidataId: 'Q20718',
    industry: 'Điện tử - Bán lẻ',
    size: 'Trên 100.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu đô thị mới Thủ Thiêm, đường Lê Gia Trí, TP. Hồ Chí Minh',
    website: 'https://www.samsung.com',
    description:
      'Samsung Electronics sản xuất điện thoại, thiết bị gia dụng và linh kiện bán dẫn, có nhà máy lớn tại Việt Nam. ' +
      DEMO_NOTICE,
    benefits: 'Căn tin và khu tập thể, xe đưa đón ca, chính sách ưu đãi sản phẩm cho nhân viên, đào tạo kỹ thuật tại nhà máy.',
  },
  {
    slug: 'fpt',
    name: 'FPT Corporation',
    category: 'it',
    wikipediaTitle: 'FPT Corporation',
    wikidataId: 'Q610241',
    industry: 'Công nghệ thông tin',
    size: 'Trên 10.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu Cầu Giấy, đường Dương Đình Nghệ, Hà Nội',
    website: 'https://fpt-software.com',
    description:
      'FPT là tập đoàn công nghệ Việt Nam, mạnh về phát triển phần mềm, chuyển đổi số và trung tâm dữ liệu. ' +
      DEMO_NOTICE,
    benefits: 'Nội bộ FPT học bất kỳ khóa nào, cơ hội làm việc tại Nhật Bản và Singapore, chế độ bảo hiểm toàn diện.',
  },
  {
    slug: 'grab',
    name: 'Grab',
    category: 'it',
    wikipediaTitle: 'Grab Holdings',
    wikidataId: 'Q20873932',
    industry: 'Công nghệ thông tin',
    size: 'Trên 5.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu đô thị mới Thủ Thiêm, đường Nguyễn Cơ Thạch, TP. Hồ Chí Minh',
    website: 'https://www.grab.com',
    description:
      'Grab vận hành nền tảng di chuyển, giao hàng và dịch vụ tài chính với đội ngũ kỹ thuật đặt tại Việt Nam. ' +
      DEMO_NOTICE,
    benefits: 'Lương cạnh tranh khu vực, phần thưởng hiệu suất, ngân sách học tập, sức khỏe tâm lý miễn phí.',
  },

  // -------------------------------------------------------- Accounting (8)
  {
    slug: 'deloitte',
    name: 'Deloitte',
    category: 'accounting',
    wikipediaTitle: 'Deloitte',
    wikidataId: 'Q491748',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 10.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu trung tâm Hoàn Kiếm, đường Lý Thường Kiệt, Hà Nội',
    website: 'https://www2.deloitte.com',
    description:
      'Deloitte cung cấp dịch vụ kiểm toán, tư vấn thuế, tài chính và rủi ro cho doanh nghiệp tại Việt Nam. ' + DEMO_NOTICE,
    benefits: 'Lộ trình cấp CPA, đào tạo chuyên môn hàng quý, chế độ bảo hiểm sức khỏe toàn diện, phụ cấp ăn trưa.',
  },
  {
    slug: 'pwc',
    name: 'PwC',
    category: 'accounting',
    wikipediaTitle: 'PwC',
    wikidataId: 'Q488048',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 10.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Toà nhà Times City, đường Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh',
    website: 'https://www.pwc.com',
    description:
      'PwC kiểm toán, tư vấn thuế và giao dịch M&A, tuyển sinh viên kinh tế, toán và tài chính. ' + DEMO_NOTICE,
    benefits: 'Chương trình tuyển dụng trước khi ra trường, bảo hiểm sức khỏe nhóm, ngân sách thi chứng chỉ ACCA, môi trường quốc tế.',
  },
  {
    slug: 'ey',
    name: 'EY',
    category: 'accounting',
    wikipediaTitle: 'Ernst & Young',
    wikidataId: 'Q489097',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 10.000 nhân viên',
    city: 'Hà Nội',
    address: 'Toà nhà Lê Thành, đường Đào Duy Từ, Hoàn Kiếm, Hà Nội',
    website: 'https://www.ey.com',
    description:
      'EY tư vấn kiểm toán, thuế, tài chính và quản trị rủi ro, trọng tâm tăng trưởng bền vững. ' + DEMO_NOTICE,
    benefits: 'Chương trình Executive Challenge, coaching 1 kèm, phụ cấp chuyên ngành, cơ hội làm việc tại văn phòng khu vực.',
  },
  {
    slug: 'kpmg',
    name: 'KPMG',
    category: 'accounting',
    wikipediaTitle: 'KPMG',
    wikidataId: 'Q493751',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 10.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu trung tâm Quận 1, đường Lê Thánh Tôn, TP. Hồ Chí Minh',
    website: 'https://kpmg.com',
    description:
      'KPMG cung cấp dịch vụ kiểm toán, tư vấn thuế và tư vấn rủi ro tại Việt Nam và khu vực. ' + DEMO_NOTICE,
    benefits: 'Đào tạo kiểm toán ngành nghề, cơ hội luân chuyển phòng ban, chính sách bảo hiểm y tế, ngân sách sách chuyên môn.',
  },
  {
    slug: 'grant-thornton',
    name: 'Grant Thornton',
    category: 'accounting',
    wikipediaTitle: 'Grant Thornton',
    wikidataId: 'Q3115410',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 1.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu Cầu Giấy, đường Trần Đăng Ninh, Hà Nội',
    website: 'https://www.grantthornton.global',
    description:
      'Grant Thornton là mạng lưới kiểm toán và tư vấn độc lập, phục vụ doanh nghiệp vừa và nhỏ. ' + DEMO_NOTICE,
    benefits: 'Môi trường làm việc gần gũi, hỗ trợ thi CPA, chính sách bảo hiểm sức khỏe, phụ cấu đào tạo thường niên.',
  },
  {
    slug: 'forvis-mazars',
    name: 'Forvis Mazars',
    category: 'accounting',
    wikipediaTitle: 'Forvis Mazars',
    wikidataId: 'Q1131326',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 1.000 nhân viên',
    city: 'Đà Nẵng',
    address: 'Khu trung tâm Hải Châu, đường Lê Lợi, Đà Nẵng',
    website: 'https://www.forvismazars.com',
    description:
      'Forvis Mazars cung cấp dịch vụ kiểm toán, kế toán và tư vấn tài chính cho doanh nghiệp trong nhiều ngành. ' +
      DEMO_NOTICE,
    benefits: 'Chính sách cân bằng công việc - cuộc sống, coaching thường xuyên, hỗ trợ chứng chỉ nghề nghiệp, phúc lợi đầy đủ.',
  },
  {
    slug: 'rsm',
    name: 'RSM',
    category: 'accounting',
    wikipediaTitle: 'RSM International',
    wikidataId: 'Q7277730',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 1.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu trung tâm Quận 1, đường Hàm Nghi, TP. Hồ Chí Minh',
    website: 'https://www.rsm.global',
    description:
      'RSM là mạng lưới kế toán kiểm toán quốc tế, tuyển dụng nhân sự tại văn phòng Hà Nội và TP. Hồ Chí Minh. ' +
      DEMO_NOTICE,
    benefits: 'Lộ trình kế toán - kiểm toán, đào tạo theo nhóm, phúc lợi chuẩn quốc tế, lịch làm việc linh hoạt.',
  },
  {
    slug: 'bdo',
    name: 'BDO',
    category: 'accounting',
    wikipediaTitle: 'BDO Global',
    wikidataId: 'Q701027',
    industry: 'Kiểm toán - Tư vấn tài chính',
    size: 'Trên 1.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu Hoàn Kiếm, đường Nguyễn Thái Học, Hà Nội',
    website: 'https://www.bdo.global',
    description:
      'BDO cung cấp dịch vụ kiểm toán, tư vấn thuế và kinh doanh cho doanh nghiệp vừa và nhỏ. ' + DEMO_NOTICE,
    benefits: 'Môi trường làm việc linh hoạt, đào tạo kế toán - thuế bài bản, hỗ trợ thi chứng chỉ nghề nghiệp.',
  },

  // ------------------------------------------------------------- Sales (8)
  {
    slug: 'coca-cola',
    name: 'The Coca-Cola Company',
    category: 'sales',
    wikipediaTitle: 'Coca-Cola',
    wikidataId: 'Q2813',
    industry: 'Đồ uống - Thực phẩm',
    size: 'Trên 50.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu Cầu Giấy, đường Mạc Đĩnh Chi, Hà Nội',
    website: 'https://www.coca-colacompany.com',
    description:
      'Coca-Cola vận hành hệ thống phân phối đồ uống tại Việt Nam qua các nhà phân phối và tuyến giao hàng. ' + DEMO_NOTICE,
    benefits: 'Phụ cấp công tác đi lại, thưởng theo doanh số, đào tạo kỹ năng bán hàng, cơ hội chuyển vị trí nội bộ.',
  },
  {
    slug: 'pepsi',
    name: 'PepsiCo',
    category: 'sales',
    wikipediaTitle: 'PepsiCo',
    wikidataId: 'Q334800',
    industry: 'Thực phẩm - Đồ uống',
    size: 'Trên 100.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu Chế xuất Tân Thuận, đường Nguyễn Hữu Cảnh, Quận 7, TP. Hồ Chí Minh',
    website: 'https://www.pepsico.com',
    description:
      'PepsiCo phân phối nước giải khát và thực phẩm theo mô hình tăng trưởng doanh nghiệp tại Việt Nam. ' +
      DEMO_NOTICE,
    benefits: 'Chương trình quản lý bán hàng trẻ, phụ cấp xe và môi xe, thưởng theo KPI, đào tạo quản lý bán hàng.',
  },
  {
    slug: 'nestle',
    name: 'Nestlé',
    category: 'sales',
    wikipediaTitle: 'Nestlé',
    wikidataId: 'Q160746',
    industry: 'Thực phẩm - Đồ uống',
    size: 'Trên 50.000 nhân viên',
    city: 'Đà Nẵng',
    address: 'Khu công nghiệp Hoà Khánh, đường Võ Nguyên Giáp, Đà Nẵng',
    website: 'https://www.nestle.com',
    description:
      'Nestlé sở hữu nhà máy tại Đà Nẵng và tuyển dụng nhân sự kinh doanh cho mạng lưới phân phối toàn quốc. ' +
      DEMO_NOTICE,
    benefits: 'Đào tạo bán hàng chuẩn quốc tế, xe công tác, phúc lợi theo thâm niên, cơ hội làm việc tại thị trường quốc tế.',
  },
  {
    slug: 'unilever',
    name: 'Unilever',
    category: 'sales',
    wikipediaTitle: 'Unilever',
    wikidataId: 'Q157062',
    industry: 'Hàng tiêu dùng',
    size: 'Trên 50.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu trung tâm Quận 7, đường Lê Văn Lương, TP. Hồ Chí Minh',
    website: 'https://www.unilever.com',
    description:
      'Unilever quản lý danh mục hàng tiêu dùng và tuyển dụng nhân sự kinh doanh tại Việt Nam. ' + DEMO_NOTICE,
    benefits: 'Lộ trình nghề nghiệp theo khung U+, phụ cấp di chuyển, bảo hiểm sức khỏe, chương trình quản lý bán hàng tích cực.',
  },
  {
    slug: 'fedex',
    name: 'FedEx',
    category: 'sales',
    wikipediaTitle: 'FedEx',
    wikidataId: 'Q459477',
    industry: 'Logistics - Vận chuyển',
    size: 'Trên 50.000 nhân viên',
    city: 'Hà Nội',
    address: 'Cảng Hà Nội Nội Bài, huyện Sóc Sơn, Hà Nội',
    website: 'https://www.fedex.com',
    description:
      'FedEx vận hành mạng lưới logistics tại Việt Nam với dịch vụ giao hàng nhanh và hàng quan trọng. ' + DEMO_NOTICE,
    benefits: 'Phụ cấu giao hàng theo chuyến, bảo hiểm tai nạn, đào tạo vận hành, đường lên vị trí quản lý vận hành.',
  },
  {
    slug: 'dhl',
    name: 'DHL',
    category: 'sales',
    wikipediaTitle: 'DHL',
    wikidataId: 'Q489815',
    industry: 'Logistics - Vận chuyển',
    size: 'Trên 50.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu Chế xuất Tân Bình, đường Hoàng Văn Thụ, TP. Hồ Chí Minh',
    website: 'https://www.dhl.com',
    description:
      'DHL Express và DHL Global Forwarding phục vụ khách hàng xuất nhập khẩu tại Việt Nam. ' + DEMO_NOTICE,
    benefits: 'Đào tạo kinh doanh và logistics, thưởng thành tích, bảo hiểm sức khỏe, môi trường làm việc quốc tế.',
  },
  {
    slug: 'ikea',
    name: 'IKEA',
    category: 'sales',
    wikipediaTitle: 'IKEA',
    wikidataId: 'Q54078',
    industry: 'Bán lẻ - Nội thất',
    size: 'Trên 10.000 nhân viên',
    city: 'TP. Hồ Chí Minh',
    address: 'Khu đô thị mới Thủ Thiêm, đường Nguyễn Văn Linh, TP. Hồ Chí Minh',
    website: 'https://www.ikea.com',
    description:
      'IKEA vận hành cửa hàng và trung tâm cung cấp tại TP. Hồ Chí Minh, tuyển dụng nhân sự bán hàng và vận hành. ' +
      DEMO_NOTICE,
    benefits: 'Giảm giá nhân viên, quỹ tiết kiệm và bảo hiểm, chính sách nghỉ phép linh hoạt, phụ cấu ăn ca.',
  },
  {
    slug: 'viettel',
    name: 'Tập đoàn Viettel',
    category: 'sales',
    wikipediaTitle: 'Viettel',
    wikidataId: 'Q1109534',
    industry: 'Viễn thông',
    size: 'Trên 50.000 nhân viên',
    city: 'Hà Nội',
    address: 'Khu Cầu Giấy, đường Nguyễn Đình Chiểu, Hà Nội',
    website: 'https://www.viettel.com.vn',
    description:
      'Viettel cung cấp dịch vụ viễn thông, phát triển ứng dụng số và bán hàng qua mạng lưới đại lý toàn quốc. ' +
      DEMO_NOTICE,
    benefits: 'Cơ hội nghỉ phép dài hơn, ưu đãi dịch vụ viễn thông, thưởng theo doanh số, đào tạo bán hàng chuẩn.',
  },
];

export const companyBySlug = new Map(companies.map((company) => [company.slug, company]));
