import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };
export default function OnlineCoursesCertificationsSection(_props: Props) {
  return <SectionShell title="OnlineCoursesCertifications" description="OnlineCoursesCertifications details will be added here." />;
}
