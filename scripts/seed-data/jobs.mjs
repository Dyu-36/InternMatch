// Fictional demo job postings used by scripts/seed-jobs.mjs.
import { accountingJobs } from './jobs-accounting.mjs';
import { salesJobs } from './jobs-sales.mjs';
// These are invented openings attached to the real company brands in
// companies.mjs so the demo board looks realistic. They are not real
// vacancies, and every company description repeats that notice.
//
// Shape per entry (all fields required unless noted):
//   slug      stable unique key; the deterministic uuid is derived from it
//   company   slug of the owning company
//   title     job title shown on the card and detail page
//   jobType   must be one of the five JobType values in src/types/index.ts
//   location  district-level address
//   salary    [min, max] stipend in VND per month
//   skills    tag list used by the job search
//   quota     number of openings
//   hot       optional, marks the "hot" badge
//   featured  optional, marks the "featured" badge
//   deadline  optional, days from the seed run date; omit for no deadline
//   posted    optional, days before the seed run date; defaults to the index
//   description / requirements / benefits required; `benefits` defaults to the
//             company benefits line

/** @type {Array<Record<string, unknown>>} */
export const jobs = [
  // ------------------------------------------------------------------ IT
  {
    slug: 'microsoft-backend-dotnet-intern',
    company: 'microsoft',
    title: 'Thực tập sinh Lập trình Backend .NET (Backend Developer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Khu Cầu Giấy, Hà Nội',
    salary: [12000000, 18000000],
    skills: ['C#', '.NET', 'SQL Server', 'REST API', 'Git'],
    quota: 5,
    featured: true,
    deadline: 30,
    description:
      'Bạn sẽ làm việc trong nhóm dịch vụ nền tảng, xây dựng và bảo trì các API phục vụ khách hàng doanh nghiệp.\n' +
      'Công việc hằng ngày gồm viết mã, viết kiểm thử tự động, tham gia code review và trực trực tiếp trong các buổi họp kỹ thuật.',
    requirements:
      '- Năm cuối hoặc mới tốt nghiệp ngành Công nghệ thông tin hoặc Toán tin.\n' +
      '- Nắm cơ bản C#, kiến trúc REST, cơ sở dữ liệu quan hệ.\n' +
      '- Biết dùng Git, đọc tài liệu kỹ thuật bằng tiếng Anh.\n' +
      '- Ưu tiên ứng viên có thể làm việc từ 4 ngày mỗi tuần trong ít nhất 3 tháng.',
  },
  {
    slug: 'microsoft-cloud-swe',
    company: 'microsoft',
    title: 'Kỹ sư Phần mềm Cloud (Azure Backend Engineer)',
    jobType: 'Full-time',
    location: 'Khu Cầu Giấy, Hà Nội',
    salary: [25000000, 40000000],
    skills: ['Azure', 'Kubernetes', 'Python', 'CI/CD', 'Distributed Systems'],
    quota: 3,
    hot: true,
    deadline: 21,
    description:
      'Vị trí thuộc đội ngũ nền tảng đám mây, phụ trách thiết kế dịch vụ container và tối ưu độ ổn định của hạ tầng.\n' +
      'Bạn sẽ làm việc cùng nhóm kỹ sư giàu kinh nghiệm trong các dự án triển khai tại khu vực Châu Á.',
    requirements:
      '- Tốt nghiệp ngành Công nghệ thông tin hoặc tương đương.\n' +
      '- 2 năm kinh nghiệm với dịch vụ cloud và container.\n' +
      '- Thành thạo Python hoặc Go, hiểu mô hình CI/CD.\n' +
      '- Tiếng Anh đọc tài liệu trôi chảy.',
  },
  {
    slug: 'microsoft-data-analyst-intern',
    company: 'microsoft',
    title: 'Thực tập sinh Phân tích Dữ liệu (Data Analyst Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'TP. Hồ Chí Minh',
    salary: [6000000, 10000000],
    skills: ['SQL', 'Power BI', 'Python', 'Excel', 'Data Visualization'],
    quota: 2,
    deadline: 25,
    description:
      'Bạn sẽ hỗ trợ nhóm kinh doanh phân tích dữ liệu thị trường, xây dựng báo cáo định kỳ và trực quan hoá chỉ số.\n' +
      'Phần lớn thời gian bạn làm việc với SQL và các công cụ mô hình hoá dữ liệu.',
    requirements:
      '- Sinh viên năm 3 hoặc 4 ngành Kinh tế, Thống kê hoặc Công nghệ thông tin.\n' +
      '- Viết SQL thành thạo, hiểu cấu trúc dữ liệu bảng quan hệ.\n' +
      '- Có khả năng trình bày phân tích bằng tiếng Việt và tiếng Anh.',
  },
  {
    slug: 'microsoft-qa-engineer',
    company: 'microsoft',
    title: 'Chuyên gia Kiểm thử Phần mềm (QA Engineer)',
    jobType: 'Full-time',
    location: 'Đà Nẵng',
    salary: [18000000, 28000000],
    skills: ['Selenium', 'Postman', 'API Testing', 'Jira', 'Agile'],
    quota: 2,
    deadline: 35,
    description:
      'Bạn sẽ thiết kế và duy trì bộ kiểm thử tự động cho các sản phẩm doanh nghiệp, đồng thời theo sát lỗi trước khi phát hành.\n' +
      'Công việc phối hợp chặt chẽ với nhóm phát triển trong môi trường làm việc theo chu kỳ hai tuần.',
    requirements:
      '- 1 năm kinh nghiệm kiểm thử phần mềm, ưu tiên kinh nghiệm kiểm thử API.\n' +
      '- Sử dụng thành thạo Postman và một framework kiểm thử giao diện.\n' +
      '- Tư duy phân tích tốt, chịu được áp lực giai đoạn bàn giao.',
  },

  {
    slug: 'google-algorithm-intern',
    company: 'google',
    title: 'Thực tập sinh Kỹ sư Thuật Toán (Software Engineering Intern, Algorithms)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Khu Cầu Giấy, Hà Nội',
    salary: [20000000, 30000000],
    skills: ['C++', 'Python', 'Algorithms', 'Data Structures', 'Linux'],
    quota: 4,
    featured: true,
    hot: true,
    deadline: 14,
    description:
      'Vị trí dành cho sinh viên yêu thích thuật toán, tham gia phát triển thư viện và hạ tầng xử lý dữ liệu quy mô lớn.\n' +
      'Bạn sẽ được ghép cặp với một chuyên gia trong suốt thời gian thực tập và tham gia một dự án thật từ đầu đến cuối.',
    requirements:
      '- Kiến thức về cấu trúc dữ liệu và giải thuật, từng tham gia luyện tập lập trình thi.\n' +
      '- Thành thạo ít nhất một ngôn ngữ hệ thống như C++ hoặc Rust.\n' +
      '- Khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh.\n' +
      '- Ưu tiên ứng viên từng làm dự án mã nguồn mở.',
  },
  {
    slug: 'google-ads-engineer-intern',
    company: 'google',
    title: 'Software Engineer Intern - Ads Platform',
    jobType: 'Thực tập Toàn thời gian',
    location: 'TP. Hồ Chí Minh',
    salary: [18000000, 26000000],
    skills: ['Java', 'Kotlin', 'Distributed Systems', 'SQL', 'gRPC'],
    quota: 3,
    deadline: -6,
    posted: 40,
    description:
      'Bạn sẽ làm việc trong nhóm sản phẩm quảng cáo, phát triển các dịch vụ chịu tải lớn phục vụ hàng triệu yêu cầu mỗi ngày.\n' +
      'Các nhiệm vụ bao gồm tối ưu hiệu năng, xử lý sự cố và nâng cao độ tin cậy của dịch vụ.',
    requirements:
      '- Sinh viên cuối năm hoặc mới tốt nghiệp ngành Công nghệ thông tin.\n' +
      '- Nắm cơ bản lập trình hướng đối tượng và thiết kế dịch vụ phân tán.\n' +
      '- Sẵn sàng làm việc cường độ cao trong giai đoạn cao điểm.',
  },
  {
    slug: 'google-devops-intern',
    company: 'google',
    title: 'Thực tập sinh DevOps / Site Reliability (SRE Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hà Nội',
    salary: [15000000, 22000000],
    skills: ['Linux', 'Bash', 'Prometheus', 'Kubernetes', 'Networking'],
    quota: 2,
    deadline: 20,
    description:
      'Bạn sẽ theo dõi độ ổn định của hệ thống, viết công cụ tự động hoá vận hành và hỗ trợ trực sự cố.\n' +
      'Đây là cơ hội tiếp cận trực tiếp với hạ tầng của một trong những trung tâm dữ liệu lớn tại khu vực.',
    requirements:
      '- Hiểu hệ điều hành Linux, mạng và script tự động hoá.\n' +
      '- Từng trải qua một dự án cá nhân liên quan đến container hoặc giám sát hệ thống.\n' +
      '- Tính cẩn trọng trong vận hành hệ thống thật.',
  },
  {
    slug: 'google-product-analyst-intern',
    company: 'google',
    title: 'Thực tập sinh Phân tích Sản phẩm (Product Analyst Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hà Nội',
    salary: [8000000, 12000000],
    skills: ['SQL', 'Python', 'Statistics', 'Tableau', 'Experimentation'],
    quota: 2,
    deadline: 32,
    description:
      'Bạn sẽ phân tích hành vi người dùng, đo lường hiệu quả của các tính năng và đề xuất cải tiến dựa trên dữ liệu.\n' +
      'Công việc đòi hỏi khả năng tư duy phản biện và trình bày rõ ràng kết luận.',
    requirements:
      '- Kiến thức xác suất thống kê, SQL và một ngôn ngữ lập trình.\n' +
      '- Ưu tiên ứng viên từng làm dự án phân tích dữ liệu thực tế.\n' +
      '- Có thể làm việc 20 giờ mỗi tuần trong học kỳ.',
  },

  {
    slug: 'ibm-cloud-engineer-intern',
    company: 'ibm',
    title: 'Thực tập sinh Kỹ sư Đám mây (Cloud Engineer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [10000000, 15000000],
    skills: ['Linux', 'Shell', 'Docker', 'Terraform', 'Ansible'],
    quota: 4,
    deadline: 26,
    description:
      'Bạn sẽ hỗ trợ nhóm tư vấn triển khai hạ tầng cho khách hàng doanh nghiệp trong môi trường đám mây lai.\n' +
      'Phần lớn thời gian làm việc với hạ tầng dưới dạng mã nguồn và tự động hoá triển khai.',
    requirements:
      '- Nắm cơ bản hệ điều hành Linux và mạng.\n' +
      '- Có kinh nghiệm dùng Docker hoặc Kubernetes ở mức dự án cá nhân.\n' +
      '- Yêu thích làm việc trực tiếp với khách hàng và ghi chép kỹ thuật.',
  },
  {
    slug: 'ibm-nodejs-intern',
    company: 'ibm',
    title: 'Thực tập sinh Phát triển Phần mềm (Node.js Developer Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [7000000, 11000000],
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'REST', 'Git'],
    quota: 3,
    deadline: 30,
    description:
      'Bạn sẽ phát triển và bảo trì các dịch vụ nội bộ phục vụ vận hành dự án tại khách hàng.\n' +
      'Công việc được hướng dẫn sát, kết hợp học kiến thức mới với các nhiệm vụ thực tế trên môi trường chạy thật.',
    requirements:
      '- Sinh viên đang theo học ngành Công nghệ thông tin hoặc Toán tin.\n' +
      '- Hiểu JavaScript, từng làm dự án web cá nhân bằng Node.js.\n' +
      '- Cẩn thận, sẵn sàng học quy trình phát triển phần mềm chuyên nghiệp.',
  },
  {
    slug: 'ibm-sap-consultant-intern',
    company: 'ibm',
    title: 'Thực tập sinh Tư vấn Giải pháp Doanh nghiệp (Technology Consultant Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [9000000, 13000000],
    skills: ['ERP', 'SAP', 'SQL', 'Process Mapping', 'English'],
    quota: 3,
    deadline: 24,
    description:
      'Bạn sẽ tham gia phân tích nghiệp vụ, hỗ trợ cấu hình hệ thống quản trị doanh nghiệp và soạn tài liệu cho khách hàng.\n' +
      'Đây là vị trí phù hợp với bạn muốn theo đuổi ngành tư vấn công nghệ.',
    requirements:
      '- Năm cuối ngành Quản trị Kinh doanh, Kế toán hoặc Công nghệ thông tin.\n' +
      '- Có khả năng đọc tài liệu tiếng Anh và làm việc theo nhóm.\n' +
      '- Từng tham gia cuộc thi hoặc chương trình tình nguyện liên quan tư vấn là một lợi thế.',
  },
  {
    slug: 'ibm-devops-junior',
    company: 'ibm',
    title: 'Kỹ sư DevOps (DevOps Engineer)',
    jobType: 'Full-time',
    location: 'Cầu Giấy, Hà Nội',
    salary: [20000000, 32000000],
    skills: ['Kubernetes', 'CI/CD', 'Docker', 'GCP', 'Monitoring'],
    quota: 2,
    hot: true,
    deadline: 18,
    description:
      'Bạn sẽ phụ trác đường ống triển khai tự động và cải thiện độ ổn định của các dịch vụ dùng chung cho nhiều khách hàng.\n' +
      'Công việc trực tiếp với đội ngũ phát triển tại ba quốc gia.',
    requirements:
      '- 2 năm kinh nghiệm DevOps hoặc vận hành hệ thống.\n' +
      '- Thành thạo Docker, Kubernetes và triển khai hạ tầng dưới dạng mã nguồn.\n' +
      '- Tiếng Anh giao tiếp tốt.',
  },

  {
    slug: 'intel-embedded-intern',
    company: 'intel',
    title: 'Thực tập sinh Phát triển Phần mềm Nhúng (Embedded Software Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Đà Nẵng',
    salary: [11000000, 16000000],
    skills: ['C', 'C++', 'RTOS', 'Debugging', 'Assembly'],
    quota: 4,
    featured: true,
    deadline: 29,
    description:
      'Bạn sẽ tham gia phát triển phần mềm điều khiển cho dòng vi mạch của nhóm thiết kế Đà Nẵng.\n' +
      'Công việc gồm viết mã, chạy kiểm thử trên thiết bị thật và phân tích lỗi phần cứng - phần mềm.',
    requirements:
      '- Sinh viên năm cuối ngành Điện tử - Viễn thông hoặc Công nghệ thông tin.\n' +
      '- Kiến thức tốt về lập trình C, hiểu cấu trúc vi điều khiển.\n' +
      '- Từng làm dự án mạch nhúng thực tế là một lợi thế lớn.',
  },
  {
    slug: 'intel-hardware-validation-intern',
    company: 'intel',
    title: 'Thực tập sinh Kiểm chứng Phần cứng (Hardware Validation Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Đà Nẵng',
    salary: [10000000, 14000000],
    skills: ['Digital Design', 'Verilog', 'LabVIEW', 'Test Automation', 'Python'],
    quota: 3,
    deadline: 22,
    description:
      'Bạn sẽ xây dựng và chạy các kịch bản kiểm chứng cho nền tảng chip mới trước khi chuyển sang sản xuất hàng loạt.\n' +
      'Công việc kết hợp giữa thiết bị đo lường trong phòng thí nghiệm và lập trình tự động hoá.',
    requirements:
      '- Kiến thức mạch số và mô hình thức Verilog.\n' +
      '- Có kinh nghiệm dùng thiết bị đo trong phòng thí nghiệm điện tử.\n' +
      '- Tỉ mỉ, cẩn thận với quy trình kiểm chứng.',
  },
  {
    slug: 'intel-data-engineer-intern',
    company: 'intel',
    title: 'Thực tập sinh Kỹ sư Dữ liệu (Data Engineering Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Đà Nẵng',
    salary: [8000000, 12000000],
    skills: ['Python', 'Spark', 'Hadoop', 'SQL', 'Airflow'],
    quota: 2,
    deadline: 33,
    description:
      'Bạn sẽ xây dựng đường ống dữ liệu phục vụ phân tích hiệu năng sản phẩm và trực quan hoá báo cáo vận hành.\n' +
      'Phần lớn dữ liệu đến từ dây chuyền sản xuất tại nhà máy.',
    requirements:
      '- Sinh viên ngành Khoa học Dữ liệu, Công nghệ thông tin hoặc Toán.\n' +
      '- Nắm cơ bản hệ sinh thái dữ liệu lớn và truy vấn SQL.\n' +
      '- Có thể làm việc tối thiểu 3 buổi chiều mỗi tuần.',
  },
  {
    slug: 'intel-ai-intern',
    company: 'intel',
    title: 'Thực tập sinh Trí tuệ Nhân tạo (AI Software Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hà Nội',
    salary: [13000000, 18000000],
    skills: ['PyTorch', 'Python', 'Computer Vision', 'Deep Learning', 'Linux'],
    quota: 3,
    hot: true,
    deadline: 17,
    description:
      'Bạn sẽ tối ưu và kiểm chứng các mô hình học sâu chạy trên nền tảng chip của công ty.\n' +
      'Công việc kết hợp giữa nghiên cứu mô hình và đo lường hiệu năng thực tế.',
    requirements:
      '- Kiến thức chắc về học sâu, từng huấn luyện mô hình thực tế.\n' +
      '- Thành thạo Python và PyTorch.\n' +
      '- Ưu tiên ứng viên có bài báo khoa học hoặc dự án mã nguồn mở.',
  },

  {
    slug: 'nvidia-ai-research-intern',
    company: 'nvidia',
    title: 'Thực tập sinh Nghiên cứu AI (AI Research Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [20000000, 28000000],
    skills: ['PyTorch', 'CUDA', 'LLM', 'Research', 'Mathematics'],
    quota: 4,
    featured: true,
    deadline: 12,
    description:
      'Bạn sẽ tham gia nhóm nghiên cứu về mô hình ngôn ngữ và mạng nơ-ron, đồng thời đóng góp thử nghiệm cho các bài báo khoa học.\n' +
      'Đây là vị trí hướng nghiên cứu, phù hợp với ứng viên hướng tới học băng tiến sĩ.',
    requirements:
      '- Nền tảng toán học vững, thành thạo học sâu.\n' +
      '- Từng phát biểu tại hội nghị sinh viên hoặc có bài báo khoa học.\n' +
      '- Có thể làm việc toàn thời gian trong ít nhất 6 tháng.',
  },
  {
    slug: 'nvidia-cuda-intern',
    company: 'nvidia',
    title: 'Thực tập sinh Lập trình CUDA (CUDA Software Engineer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Hà Nội',
    salary: [18000000, 25000000],
    skills: ['CUDA', 'C++', 'GPU', 'Performance Optimization', 'Linux'],
    quota: 3,
    hot: true,
    deadline: 19,
    description:
      'Bạn sẽ tối ưu các toán hạ khi chạy trên GPU và viết thư viện phục vụ nhiều nhóm sản phẩm khác nhau.\n' +
      'Công việc mang tính kỹ thuật cao, đòi hỏi cả hiểu thuật toán lẫn hiểu kiến trúc phần cứng.',
    requirements:
      '- Thành thạo C++ và kiến thức về lập trình song song.\n' +
      '- Từng tối ưu hiệu năng chương trình hoặc dùng GPU tính toán.\n' +
      '- Có khả năng phân tích hiệu năng bằng công cụ profiling.',
  },
  {
    slug: 'nvidia-solutions-architect-intern',
    company: 'nvidia',
    title: 'Thực tập sinh Kiến trúc Giải pháp (Solutions Architect Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hà Nội',
    salary: [10000000, 15000000],
    skills: ['Deep Learning', 'MLOps', 'Kubernetes', 'Presenting', 'English'],
    quota: 2,
    deadline: 27,
    description:
      'Bạn sẽ hỗ trợ đối tác và khách hàng trong việc triển khai giải pháp tính toán, gồm thiết kế và trình bày mô hình tham chiếu.\n' +
      'Vị trí đòi hỏi cả kỹ năng kỹ thuật lẫn khả năng giao tiếp.',
    requirements:
      '- Kiến thức về học sâu và triển khai mô hình trên cụm máy chủ.\n' +
      '- Kỹ năng trình bày và viết tài liệu tốt bằng tiếng Anh.\n' +
      '- Thoải mái làm việc cùng khách hàng doanh nghiệp.',
  },
  {
    slug: 'nvidia-data-center-intern',
    company: 'nvidia',
    title: 'Thực tập sinh Trung tâm Dữ liệu (Data Center Engineer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Đà Nẵng',
    salary: [12000000, 17000000],
    skills: ['Linux', 'Networking', 'Python', 'Automation', 'Shell'],
    quota: 3,
    deadline: 23,
    description:
      'Bạn sẽ hỗ trợ vận hành hạ tầng máy chủ phục vụ huấn luyện mô hình, bao gồm giám sát, triển khai và xử lý sự cố.\n' +
      'Môi trường làm việc theo ca, có đào tạo bài bản về hệ điều hành và mạng.',
    requirements:
      '- Hiểu hệ điều hành Linux và nguyên lý mạng.\n' +
      '- Sử dụng tốt script tự động hoá (Bash hoặc Python).\n' +
      '- Sẵn sàng làm việc ca đêm theo lịch phân công.',
  },

  {
    slug: 'cisco-network-intern',
    company: 'cisco',
    title: 'Thực tập sinh Kỹ sư Mạng (Network Engineer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 9, TP. Hồ Chí Minh',
    salary: [10000000, 15000000],
    skills: ['Networking', 'Cisco IOS', 'TCP/IP', 'Wireshark', 'VLAN'],
    quota: 5,
    featured: true,
    deadline: 31,
    description:
      'Bạn sẽ tham gia nhóm triển khai mạng cho khách hàng, hỗ trợ cấu hình thiết bị và giải quyết sự cố mạng thực tế.\n' +
      'Công việc đi kèm chương trình đào tạo chứng chỉ mạng do công ty chi trả.',
    requirements:
      '- Sinh viên ngành Công nghệ thông tin hoặc Điện tử - Viễn thông.\n' +
      '- Hiểu mô hình OSI/IP và từng cấu hình thiết bị mạng ở mức cơ bản.\n' +
      '- Khả năng di chuyển đi làm việc tại khách hàng trong khu vực nội thành.',
  },
  {
    slug: 'cisco-software-intern',
    company: 'cisco',
    title: 'Thực tập sinh Lập trình Phần mềm Mạng (Network Software Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Quận 9, TP. Hồ Chí Minh',
    salary: [12000000, 18000000],
    skills: ['Python', 'Go', 'REST API', 'Networking', 'Unit Testing'],
    quota: 3,
    deadline: 25,
    description:
      'Bạn sẽ phát triển các thành phần phần mềm điều khiển thiết bị mạng, từ giao diện API đến logic xử lý giao thức.\n' +
      'Công việc được review thường xuyên trong môi trường phát triển dựa trên mã nguồn.',
    requirements:
      '- Thành thạo Python hoặc Go, hiểu nguyên lý lập trình hướng đối tượng.\n' +
      '- Từng viết kiểm thử tự động cho dự án cá nhân.\n' +
      '- Quan tâm đến mạng máy tính và hệ điều hành.',
  },
  {
    slug: 'cisco-cybersecurity-intern',
    company: 'cisco',
    title: 'Thực tập sinh An ninh Mạng (Cybersecurity Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [8000000, 13000000],
    skills: ['Linux', 'Security', 'Packet Analysis', 'Python', 'Threat Detection'],
    quota: 2,
    hot: true,
    deadline: 20,
    description:
      'Bạn sẽ hỗ trợ nhóm phân tích sự cố, theo dõi cảnh báo và xây dựng quy trình phản ứng sự cố mạng.\n' +
      'Phần lớn thời gian làm việc với dữ liệu giám sát từ các trung tâm an ninh.',
    requirements:
      '- Nắm cơ bản về an ninh thông tin và mã hoá.\n' +
      '- Từng dùng Linux và các công cụ phân tích gói tin trong học tập.\n' +
      '- Tính tò mò và sẵn sàng học hỏi trong môi trường thực tế.',
  },
  {
    slug: 'cisco-technical-support',
    company: 'cisco',
    title: 'Chuyên gia Hỗ trợ Kỹ thuật (Technical Support Engineer)',
    jobType: 'Full-time',
    location: 'Hà Nội',
    salary: [15000000, 24000000],
    skills: ['Troubleshooting', 'Networking', 'English', 'Ticketing', 'Documentation'],
    quota: 4,
    deadline: 35,
    description:
      'Bạn sẽ hỗ trợ khách hàng giải quyết sự cố kỹ thuật, viết tài liệu hướng dẫn và chuyển giao kiến thức cho đội.\n' +
      'Đội làm việc theo ca và có đào tạo chứng chỉ nghiệp vụ ban đầu.',
    requirements:
      '- 1 năm kinh nghiệm hỗ trợ kỹ thuật hoặc trung tâm điện thoại.\n' +
      '- Nền tảng mạng máy tính, hiểu cách truy vấn cơ sở dữ liệu.\n' +
      '- Tiếng Anh giao tiếp tốt, kiên nhẫn với khách hàng.',
  },

  {
    slug: 'samsung-mobile-intern',
    company: 'samsung-electronics',
    title: 'Thực tập sinh Phát triển Ứng dụng Di động (Android Developer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [12000000, 18000000],
    skills: ['Kotlin', 'Android', 'Jetpack', 'Git', 'MVVM'],
    quota: 4,
    featured: true,
    deadline: 28,
    description:
      'Bạn sẽ làm việc trong nhóm phát triển ứng dụng di động của nhà máy tại TP. Hồ Chí Minh.\n' +
      'Công việc gồm xây dựng tính năng mới, sửa lỗi và tối ưu hiệu năng trên thiết bị thật.',
    requirements:
      '- Năm cuối ngành Công nghệ thông tin hoặc Điện tử - Viễn thông.\n' +
      '- Từng phát triển ứng dụng Android bằng Kotlin hoặc Java.\n' +
      '- Ưu tiên ứng viên có ứng dụng đã được đăng trên kho ứng dụng.',
  },
  {
    slug: 'samsung-semiconductor-intern',
    company: 'samsung-electronics',
    title: 'Thực tập sinh Kỹ sư Bán dẫn (Process Engineer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Khu công nghiệp, Đà Nẵng',
    salary: [10000000, 15000000],
    skills: ['Semiconductor', 'Lithography', 'SPC', 'English', 'Data Analysis'],
    quota: 3,
    deadline: 26,
    description:
      'Bạn sẽ hỗ trợ kiểm soát chất lượng và tối ưu quy trình sản xuất linh kiện bán dẫn trong nhà máy.\n' +
      'Công việc theo ca và yêu cầu tuân thủ nghiêm ngặt quy trình an toàn.',
    requirements:
      '- Kỹ sư tự động, hoá lý hoặc bán dẫn, năm cuối.\n' +
      '- Thành thạo phân tích dữ liệu và kiểm soát quá trình.\n' +
      '- Cẩn trọng trong thao tác trên thiết bị đo lường chính xác.',
  },
  {
    slug: 'samsung-b2b-sales-intern',
    company: 'samsung-electronics',
    title: 'Thực tập sinh Kinh doanh Doanh nghiệp (B2B Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6000000, 10000000],
    skills: ['Sales', 'CRM', 'Communication', 'Excel', 'English'],
    quota: 4,
    deadline: 34,
    description:
      'Bạn sẽ hỗ trợ nhóm kinh doanh khách hàng doanh nghiệp trong việc tìm kiếm khách hàng, đề xuất giải pháp và theo dõi hợp đồng.\n' +
      'Đây là cơ hội tiếp cận nhanh chóng vào mảng kinh doanh B2B.',
    requirements:
      '- Năm cuối ngành Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Kỹ năng giao tiếp và làm việc nhóm tốt.\n' +
      '- Ngoại trình vững và, không phải điều kiện bắt buộc nhưng rất đánh giá cao.',
  },
  {
    slug: 'samsung-supply-chain-analyst',
    company: 'samsung-electronics',
    title: 'Chuyên viên Chuỗi cung ứng (Supply Chain Analyst)',
    jobType: 'Full-time',
    location: 'Khu Chế xuất Tân Bình, TP. Hồ Chí Minh',
    salary: [18000000, 28000000],
    skills: ['Supply Chain', 'SAP', 'Data Analysis', 'Forecasting', 'English'],
    quota: 2,
    hot: true,
    deadline: 22,
    description:
      'Bạn sẽ theo dõi luồng vật chất, dự báo nhu cầu và phối hợp với các đối tác sản xuất trong khu vực Đông Nam Á.\n' +
      'Phần lớn thời gian làm việc với hệ thống dữ liệu doanh nghiệp.',
    requirements:
      '- 2 năm kinh nghiệm chuỗi cung ứng, kế hoạch hoặc phân tích vận hành.\n' +
      '- Sử dụng tốt Excel và các công cụ phân tích dữ liệu.\n' +
      '- Tiếng Anh đọc tài liệu trôi chảy.',
  },

  {
    slug: 'fpt-frontend-intern',
    company: 'fpt',
    title: 'Thực tập sinh Lập trình Front-end (Frontend Developer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [8000000, 13000000],
    skills: ['React', 'TypeScript', 'HTML/CSS', 'Tailwind', 'Git'],
    quota: 10,
    featured: true,
    hot: true,
    deadline: 20,
    description:
      'Bạn sẽ tham gia phát triển giao diện cho các sản phẩm phần mềm của FPT Software, làm việc trực tiếp với đội thiết kế và bộ phận kiểm thử.\n' +
      'Các bạn xuất sắc sẽ được giữ lại vào chương trình tuyển dụng chính thức.',
    requirements:
      '- Sinh viên năm cuối hoặc mới tốt nghiệp ngành Công nghệ thông tin.\n' +
      '- Thành thạo React, TypeScript và CSS hiện đại.\n' +
      '- Có portfolio hoặc các dự án cá nhân trên GitHub.\n' +
      '- Có thể làm việc tối thiểu 4 ngày mỗi tuần trong ít nhất 3 tháng.',
  },
  {
    slug: 'fpt-qa-intern',
    company: 'fpt',
    title: 'Thực tập sinh Kiểm thử Phần mềm (QA Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Cầu Giấy, Hà Nội',
    salary: [6000000, 9000000],
    skills: ['Manual Testing', 'SQL', 'Postman', 'Agile', 'Jira'],
    quota: 6,
    deadline: 27,
    description:
      'Bạn sẽ viết kịch bản kiểm thử, báo lỗi và kiểm tra lại lỗi trước khi bàn giao khách hàng.\n' +
      'Công việc phù hợp với sinh viên muốn làm quen quy trình bảo đảm chất lượng phần mềm.',
    requirements:
      '- Năm cuối ngành Công nghệ thông tin, Toán tin hoặc Cơ khí.\n' +
      '- Cẩn thận, tỉ mỉ và có khả năng đọc yêu cầu nghiệp vụ.\n' +
      '- Thành thạo truy vấn cơ sở dữ liệu cơ bản.',
  },
  {
    slug: 'fpt-sales-solutions-intern',
    company: 'fpt',
    title: 'Thực tập sinh Kinh doanh Giải pháp (Solution Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: [6000000, 11000000],
    skills: ['Sales', 'CRM', 'Presenting', 'Consulting', 'English'],
    quota: 5,
    deadline: 30,
    description:
      'Bạn sẽ hỗ trợ nhóm kinh doanh phát triển khách hàng, tìm hiểu nhu cầu và trình bày giải pháp công nghệ cho khách hàng doanh nghiệp.\n' +
      'Công việc có cơ hội làm việc cùng khách hàng tại Nhật Bản nếu bạn đạt yêu cầu ngoại ngữ.',
    requirements:
      '- Năm cuối ngành Kinh tế, Marketing, Quản trị hoặc Công nghệ thông tin.\n' +
      '- Ngoại trình và kỹ năng thuyết trình tốt.\n' +
      '- Tiếng Anh giao tiếp cơ bản trở lên.',
  },
  {
    slug: 'fpt-data-engineer',
    company: 'fpt',
    title: 'Kỹ sư Dữ liệu (Data Engineer)',
    jobType: 'Full-time',
    location: 'Đà Nẵng',
    salary: [18000000, 30000000],
    skills: ['Python', 'Spark', 'Airflow', 'SQL', 'Data Warehouse'],
    quota: 3,
    deadline: 33,
    description:
      'Bạn sẽ thiết kế và vận hành các pipeline dữ liệu phục vụ nền tảng dữ liệu tập trung của tập đoàn.\n' +
      'Công việc gồm thiết kế mô hình dữ liệu và bảo đảm chất lượng dữ liệu đầu vào.',
    requirements:
      '- 2 năm kinh nghiệm xây dựng pipeline dữ liệu.\n' +
      '- Thành thạo SQL và Python, biết điều phối tác vụ phân tán.\n' +
      '- Từng triển khai hệ thống dữ liệu trên nền tảng đám mây là một lợi thế.',
  },

  {
    slug: 'grab-backend-intern',
    company: 'grab',
    title: 'Thực tập sinh Kỹ sư Backend (Backend Engineer Intern, Go)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [15000000, 22000000],
    skills: ['Go', 'MySQL', 'gRPC', 'Distributed Systems', 'Docker'],
    quota: 5,
    featured: true,
    deadline: 21,
    description:
      'Bạn sẽ làm việc trong nhóm dịch vụ di chuyển, phát triển và tối ưu các API chịu lưu lượng lớn.\n' +
      'Mọi thay đổi đều được triển khai an toàn qua hệ thống kiểm thử và giám sát tự động.',
    requirements:
      '- Năm cuối ngành Công nghệ thông tin hoặc Toán tin.\n' +
      '- Nắm cơ bản Go hoặc một ngôn ngữ backend khác, hiểu cơ sở dữ liệu quan hệ.\n' +
      '- Từng viết kiểm thử cho dự án cá nhân.\n' +
      '- Sẵn sàng làm việc 4 ngày mỗi tuần tối thiểu 4 tháng.',
  },
  {
    slug: 'grab-data-scientist-intern',
    company: 'grab',
    title: 'Thực tập sinh Khoa học Dữ liệu (Data Scientist Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [14000000, 20000000],
    skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Visualization'],
    quota: 3,
    deadline: 24,
    description:
      'Bạn sẽ phát triển mô hình dự báo và phân khúc người dùng, đồng thời theo dõi hiệu quả của mô hình sau khi triển khai.\n' +
      'Công việc kết hợp giữa nghiên cứu và triển khai thực tế trên hệ thống lớn.',
    requirements:
      '- Nền tảng toán thống kê vững, thành thạo Python.\n' +
      '- Từng xây dựng mô hình dự báo hoặc phân loại trong dự án học phần.\n' +
      '- Thành thạo truy vấn SQL trên tập dữ liệu lớn.',
  },
  {
    slug: 'grab-mobile-ios-intern',
    company: 'grab',
    title: 'Thực tập sinh Phát triển iOS (iOS Developer Intern)',
    jobType: 'Thực tập Toàn thời gian',
    location: 'Thủ Thiêm, TP. Hồ Chí Minh',
    salary: [14000000, 20000000],
    skills: ['Swift', 'iOS', 'UIKit', 'SwiftUI', 'Git'],
    quota: 2,
    deadline: 29,
    description:
      'Bạn sẽ xây dựng và cải thiện trải nghiệm trên ứng dụng di động của bộ sản phẩm giao hàng.\n' +
      'Công việc có sự gắn với trải nghiệm người dùng thực tế tại Việt Nam.',
    requirements:
      '- Năm cuối ngành Công nghệ thông tin.\n' +
      '- Thành thạo Swift, từng phát triển ứng dụng iOS thật.\n' +
      '- Quan tâm đến thiết kế giao diện và hiệu năng trên thiết bị di động.',
  },
  {
    slug: 'grab-growth-intern',
    company: 'grab',
    title: 'Thực tập sinh Tăng trưởng Kinh doanh (Growth Sales Intern)',
    jobType: 'Thực tập Bán thời gian',
    location: 'Hà Nội',
    salary: [7000000, 11000000],
    skills: ['Sales', 'Growth', 'CRM', 'Data Analysis', 'Communication'],
    quota: 4,
    hot: true,
    deadline: 18,
    description:
      'Bạn sẽ hỗ trợ đội tăng trưởng trong việc phát triển đối tác tài xế và doanh nghiệp, phân tích dữ liệu và thử nghiệm chiến lược mới.\n' +
      'Công việc có chỉ số đo lường rõ ràng và được đánh giá thường xuyên.',
    requirements:
      '- Sinh viên Kinh tế, Marketing hoặc Quản trị Kinh doanh.\n' +
      '- Ngoại trình, không ngại làm việc với đối tác bên ngoài.\n' +
      '- Có khả năng phân tích dữ liệu đơn giản bằng Excel hoặc SQL.',
  },
];

/** Every demo posting: information technology, accounting, and sales. */
export const allJobs = [...jobs, ...accountingJobs, ...salesJobs];
