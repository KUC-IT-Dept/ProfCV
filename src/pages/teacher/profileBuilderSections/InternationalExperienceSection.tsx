import { Profile } from './profileBuilderTypes';
import SectionShell from './SectionShell';

type Props = { profile: Profile; };
export default function InternationalExperienceSection(_props: Props) {
  return <SectionShell title="InternationalExperience" description="InternationalExperience details will be added here." />;
}
