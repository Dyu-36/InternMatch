import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <span className="site-footer__muted">© 2026 InternMatch. Kết nối đúng cơ hội thực tập.</span>
        <Link className="site-footer__muted" href="/jobs">Khám phá việc làm →</Link>
      </Container>
    </footer>
  );
}
