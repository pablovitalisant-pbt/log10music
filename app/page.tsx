import LeadCaptureModal from '../components/LeadCaptureModal';
import { getStitchBodyHtml } from '../lib/stitch';

export default async function HomePage() {
  const html = await getStitchBodyHtml();

  return (
    <>
      <main dangerouslySetInnerHTML={{ __html: html }} />
      <LeadCaptureModal />
    </>
  );
}
